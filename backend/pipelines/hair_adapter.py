import logging
import cv2
import numpy as np

logger = logging.getLogger(__name__)


def clean_shoulder_hair(target_bgr: np.ndarray, tgt_face) -> np.ndarray:
    """
    Detects and cleanly inpaints long female hair cascading down behind
    the ears, jawline, and onto the shoulders/background.
    Replaces dangling hair with the clean background or uniform fabric.
    """
    try:
        h, w = target_bgr.shape[:2]
        
        # Use 68 landmarks if available for precise anatomical geometry
        if hasattr(tgt_face, "landmark_3d_68") and tgt_face.landmark_3d_68 is not None:
            lmk = tgt_face.landmark_3d_68
            chin = lmk[8].astype(int)
            left_jaw = lmk[3].astype(int)
            right_jaw = lmk[13].astype(int)
            eyebrows_y = int(min(lmk[19][1], lmk[24][1]))
        elif hasattr(tgt_face, "kps") and tgt_face.kps is not None:
            kps = tgt_face.kps.astype(int)
            eye_y = int((kps[0][1] + kps[1][1]) / 2)
            mouth_y = int((kps[3][1] + kps[4][1]) / 2)
            fh = mouth_y - eye_y
            chin = [int((kps[3][0] + kps[4][0]) / 2), mouth_y + int(fh * 0.7)]
            left_jaw = [max(0, kps[0][0] - int(fh * 0.6)), chin[1]]
            right_jaw = [min(w - 1, kps[1][0] + int(fh * 0.6)), chin[1]]
            eyebrows_y = max(0, eye_y - int(fh * 0.4))
        else:
            return target_bgr

        # Define search zones outside the neck (left and right of jawline)
        hair_mask = np.zeros((h, w), dtype=np.uint8)
        
        # Top boundary from ear level down to chest
        top_y = max(0, eyebrows_y)
        bottom_y = min(h, chin[1] + int((chin[1] - eyebrows_y) * 1.5))
        
        # Left side zone: from left frame edge to left jaw
        hair_mask[top_y:bottom_y, 0:max(0, left_jaw[0])] = 255
        
        # Right side zone: from right jaw to right frame edge
        hair_mask[top_y:bottom_y, min(w, right_jaw[0]):w] = 255

        # Detect dark hair pixels against brighter background or collar
        gray = cv2.cvtColor(target_bgr, cv2.COLOR_BGR2GRAY)
        
        # Background lightness estimation from top corners
        bg_sample = np.concatenate([gray[:20, :20].flatten(), gray[:20, -20:].flatten()])
        bg_mean = float(np.mean(bg_sample)) if bg_sample.size > 0 else 220.0
        
        # Pixels significantly darker than background in the shoulder hair zone
        threshold = min(170.0, bg_mean - 35.0)
        is_hair = (gray < threshold) & (hair_mask > 0)

        # Check if long hair was found outside the neck
        hair_pixel_count = np.sum(is_hair)
        if hair_pixel_count > 500:
            logger.info("Found %d long hair pixels outside neck; inpainting...", hair_pixel_count)
            clean_mask = np.zeros((h, w), dtype=np.uint8)
            clean_mask[is_hair] = 255
            # Dilate mask slightly to cleanly remove flyaway strands
            kernel = cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (5, 5))
            clean_mask = cv2.dilate(clean_mask, kernel, iterations=2)
            inpainted = cv2.inpaint(target_bgr, clean_mask, inpaintRadius=7, flags=cv2.INPAINT_TELEA)
            return inpainted

        return target_bgr
    except Exception as e:
        logger.warning("Clean shoulder hair fallback: %s", e)
        return target_bgr


def transfer_source_hair(
    source_bgr: np.ndarray,
    target_bgr: np.ndarray,
    src_face,
    tgt_face,
) -> np.ndarray:
    """
    Extracts the source person's hair and upper forehead contour,
    aligns it to the target head pose, and blends it seamlessly
    onto the top of the target head.
    """
    try:
        sh, sw = source_bgr.shape[:2]
        th, tw = target_bgr.shape[:2]
        
        # Compute Affine mapping from source kps to target kps
        M, _ = cv2.estimateAffinePartial2D(src_face.kps, tgt_face.kps)
        if M is None:
            return target_bgr
            
        src_kps = src_face.kps.astype(int)
        src_left_eye = src_kps[0]
        src_right_eye = src_kps[1]
        eye_y = int((src_left_eye[1] + src_right_eye[1]) / 2)
        eye_w = int(np.linalg.norm(src_right_eye - src_left_eye))
        eye_cx = int((src_left_eye[0] + src_right_eye[0]) / 2)
        
        sb = src_face.bbox.astype(int)
        head_top = max(0, sb[1] - int(eye_w * 0.9))
        
        # Create hair mask in source image
        hair_mask_src = np.zeros((sh, sw), dtype=np.float32)
        center = (eye_cx, int((head_top + eye_y) / 2))
        axes = (int(eye_w * 1.3), int((eye_y - head_top) * 0.95))
        cv2.ellipse(hair_mask_src, center, axes, 0, 0, 360, 1.0, -1)
        
        # Cut off below eye line
        hair_mask_src[eye_y:, :] = 0.0
        hair_mask_src = cv2.GaussianBlur(hair_mask_src, (21, 21), 7)
        
        # Warp source hair and hair mask to target coordinates
        warped_src = cv2.warpAffine(source_bgr, M, (tw, th), borderMode=cv2.BORDER_REFLECT)
        warped_mask = cv2.warpAffine(hair_mask_src, M, (tw, th), borderMode=cv2.BORDER_CONSTANT)
        warped_mask = np.expand_dims(warped_mask, axis=-1)
        
        # Alpha blend source hair onto target
        blended = (warped_src.astype(np.float32) * warped_mask +
                   target_bgr.astype(np.float32) * (1.0 - warped_mask))
        return np.clip(blended, 0, 255).astype(np.uint8)
    except Exception as e:
        logger.warning("Transfer source hair fallback: %s", e)
        return target_bgr


def adapt_hair_and_head(
    source_bgr: np.ndarray,
    target_bgr: np.ndarray,
    src_face,
    tgt_face,
    instructions: str = "",
) -> tuple[np.ndarray, bool]:
    """
    Intelligently checks and performs hair adaptation:
    - Removes female long hair dangling on shoulders if source is male
    - Transfers source person's haircut/hairline onto target head
    """
    src_gender = getattr(src_face, "gender", 1)  # 1 = Male, 0 = Female
    tgt_gender = getattr(tgt_face, "gender", 1)
    
    inst_lower = instructions.lower() if instructions else ""
    force_hair_change = any(k in inst_lower for k in ["hair", "short", "male", "cut", "head", "style"])
    
    is_male_on_female = (src_gender == 1 and tgt_gender == 0)
    
    if is_male_on_female or force_hair_change:
        logger.info("Executing hair adaptation (cleaning long shoulder hair & adapting haircut)...")
        # Step 1: Clean long shoulder hair in target
        cleaned = clean_shoulder_hair(target_bgr, tgt_face)
        # Step 2: Transfer source hairstyle
        adapted = transfer_source_hair(source_bgr, cleaned, src_face, tgt_face)
        return adapted, True
        
    return target_bgr, False
