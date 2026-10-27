import numpy as np
from PIL import Image, ImageFilter


def create_feathered_mask(mask: np.ndarray, feather_radius: int = 7) -> np.ndarray:
    """Create a soft feathered boundary for seamless blending without hard lines."""
    mask_img = Image.fromarray((mask * 255).astype(np.uint8), mode="L")
    feathered = mask_img.filter(ImageFilter.GaussianBlur(radius=feather_radius))
    return np.array(feathered, dtype=np.float32) / 255.0


def match_color_stats(source: np.ndarray, target: np.ndarray, mask: np.ndarray) -> np.ndarray:
    """
    Subtle color/luminance matching inside mask region
    to adapt source skin tone slightly to target lighting.
    """
    m_bool = mask > 0.1
    if not np.any(m_bool):
        return source

    matched = source.astype(np.float32).copy()
    for c in range(3):
        src_mean = float(np.mean(source[..., c][m_bool]))
        tgt_mean = float(np.mean(target[..., c][m_bool]))
        src_std = float(np.std(source[..., c][m_bool])) or 1.0
        tgt_std = float(np.std(target[..., c][m_bool])) or 1.0

        # Gentle shift towards target lighting
        matched[..., c] = (matched[..., c] - src_mean) * (tgt_std / src_std * 0.3 + 0.7) + tgt_mean

    return np.clip(matched, 0, 255).astype(np.uint8)


def composite_pixel_preserving(
    template: np.ndarray,
    generated_face: np.ndarray,
    mask: np.ndarray,
    feather_radius: int = 7,
) -> np.ndarray:
    """
    Composite generated face seamlessly onto template.
    Outside the mask boundary, template pixels remain 100% exact.
    """
    assert template.shape == generated_face.shape, "Images must have identical dimensions"

    feathered = create_feathered_mask(mask, feather_radius=feather_radius)
    alpha = np.expand_dims(feathered, axis=-1)

    # Color match generated region with template surroundings
    adjusted_gen = match_color_stats(generated_face, template, mask)

    # Seamless composite
    result = (template.astype(np.float32) * (1.0 - alpha) + adjusted_gen.astype(np.float32) * alpha)
    result = np.clip(result, 0, 255).astype(np.uint8)

    # Strict pixel preservation: exactly 0 mask = 100% template pixels
    exact_outside = mask == 0
    result[exact_outside] = template[exact_outside]

    return result
