from dataclasses import dataclass
import numpy as np
from PIL import Image


@dataclass
class AlignmentTransform:
    scale: float
    dx: float
    dy: float
    target_box: tuple[int, int, int, int]  # (x1, y1, x2, y2)


def estimate_face_box(img_arr: np.ndarray) -> tuple[int, int, int, int]:
    """
    Automatic face region estimation for template or source.
    In prototype fallback, centers face in upper third of image.
    """
    h, w = img_arr.shape[:2]
    # Standard portrait face positioning: upper-center
    bw = int(w * 0.45)
    bh = int(h * 0.45)
    bx1 = (w - bw) // 2
    by1 = int(h * 0.08)
    return (bx1, by1, bx1 + bw, by1 + bh)


def align_and_crop(
    source: np.ndarray,
    target_shape: tuple[int, int],
    target_box: tuple[int, int, int, int] | None = None,
) -> tuple[np.ndarray, np.ndarray]:
    """
    Resize and position source head naturally into the target template head area.
    Returns (aligned_face_canvas, mask).
    """
    th, tw = target_shape[:2]
    if target_box is None:
        target_box = estimate_face_box(np.zeros((th, tw, 3), dtype=np.uint8))

    tx1, ty1, tx2, ty2 = target_box
    target_w = max(10, tx2 - tx1)
    target_h = max(10, ty2 - ty1)

    src_img = Image.fromarray(source)
    # Estimate source face crop (centered portrait)
    sw, sh = src_img.size
    crop_w = int(sw * 0.7)
    crop_h = int(sh * 0.7)
    cx, cy = sw // 2, int(sh * 0.35)
    box = (
        max(0, cx - crop_w // 2),
        max(0, cy - crop_h // 2),
        min(sw, cx + crop_w // 2),
        min(sh, cy + crop_h // 2),
    )
    cropped = src_img.crop(box).resize((target_w, target_h), Image.Resampling.LANCZOS)

    # Place cropped head on template-sized canvas
    canvas = Image.new("RGB", (tw, th), (0, 0, 0))
    canvas.paste(cropped, (tx1, ty1))

    # Create oval face/head mask
    mask_canvas = Image.new("L", (tw, th), 0)
    from PIL import ImageDraw
    draw = ImageDraw.Draw(mask_canvas)
    # Elliptical head/face region inside the target box
    inset_x = int(target_w * 0.08)
    inset_y = int(target_h * 0.05)
    draw.ellipse(
        [tx1 + inset_x, ty1 + inset_y, tx2 - inset_x, ty2 - inset_y],
        fill=255,
    )

    aligned_arr = np.array(canvas, dtype=np.uint8)
    mask_arr = (np.array(mask_canvas, dtype=np.uint8) > 128).astype(np.uint8)

    return aligned_arr, mask_arr
