import logging
from pathlib import Path
import cv2
import numpy as np
import onnxruntime as ort
from insightface.utils import face_align

logger = logging.getLogger(__name__)


def adapt_mouth_expression(
    swapped_bgr: np.ndarray,
    src_img: np.ndarray,
    src_face,
    swapped_face,
    instructions: str = "",
    force: bool = False,
) -> np.ndarray:
    """
    Transfers the source person's authentic lips and mouth expression
    onto the swapped face if the template has an open-mouth grin/smile,
    if force=True, or if the user requested 'lips same' / 'no smile' / 'neutral'.
    """
    try:
        inst_lower = instructions.lower() if instructions else ""
        force_neutral = force or any(k in inst_lower for k in ["lip", "smile", "mouth", "neutral", "same"])

        # Check inner mouth opening distance (upper inner lip vs lower inner lip)
        src_open = np.linalg.norm(src_face.landmark_3d_68[62] - src_face.landmark_3d_68[66])
        tgt_open = np.linalg.norm(swapped_face.landmark_3d_68[62] - swapped_face.landmark_3d_68[66])

        # If source is closed/gentle (< 4px) and target is open grinning (> 5px), or requested
        if not (force_neutral or (src_open < 4.2 and tgt_open > 5.0)):
            return swapped_bgr


        logger.info("Harmonizing mouth expression: transferring source lips (src_open=%.1f, tgt_open=%.1f)", src_open, tgt_open)

        src_lmk = src_face.landmark_3d_68[:, :2].astype(np.float32)
        tgt_lmk = swapped_face.landmark_3d_68[:, :2].astype(np.float32)

        src_mouth = src_lmk[48:68]
        tgt_mouth = tgt_lmk[48:68]

        src_c = np.mean(src_mouth, axis=0)
        tgt_c = np.mean(tgt_mouth, axis=0)
        src_w = np.linalg.norm(src_mouth[6] - src_mouth[0])
        tgt_w = np.linalg.norm(tgt_mouth[6] - tgt_mouth[0])
        scale = tgt_w / (src_w + 1e-5)

        M = np.array([
            [scale, 0, tgt_c[0] - scale * src_c[0]],
            [0, scale, tgt_c[1] - scale * src_c[1]]
        ], dtype=np.float32)

        th, tw = swapped_bgr.shape[:2]
        warped_src = cv2.warpAffine(src_img, M, (tw, th), borderMode=cv2.BORDER_REFLECT)

        # Color-match warped mouth to swapped face skin
        m_min = np.clip(np.min(tgt_mouth, axis=0).astype(int) - 12, [0, 0], [tw - 1, th - 1])
        m_max = np.clip(np.max(tgt_mouth, axis=0).astype(int) + 12, [0, 0], [tw - 1, th - 1])

        src_crop = warped_src[m_min[1]:m_max[1], m_min[0]:m_max[0]].astype(np.float32)
        tgt_crop = swapped_bgr[m_min[1]:m_max[1], m_min[0]:m_max[0]].astype(np.float32)

        if src_crop.size > 0 and tgt_crop.size > 0:
            for c in range(3):
                sm, ss = src_crop[..., c].mean(), src_crop[..., c].std() + 1e-5
                tm, ts = tgt_crop[..., c].mean(), tgt_crop[..., c].std() + 1e-5
                warped_src[..., c] = np.clip(
                    (warped_src[..., c].astype(np.float32) - sm) * (ts / ss) + tm, 0, 255
                )

        transformed_src_mouth = (np.dot(src_mouth, M[:, :2].T) + M[:, 2]).astype(np.int32)
        hull = cv2.convexHull(transformed_src_mouth)
        lip_mask = np.zeros((th, tw), dtype=np.float32)
        cv2.fillPoly(lip_mask, [hull], 1.0)
        lip_mask = cv2.GaussianBlur(lip_mask, (15, 15), 4.0)

        lip_mask_3d = np.expand_dims(lip_mask, axis=-1)
        blended = (warped_src.astype(np.float32) * lip_mask_3d +
                   swapped_bgr.astype(np.float32) * (1.0 - lip_mask_3d)).astype(np.uint8)
        return blended
    except Exception as e:
        logger.warning("Mouth expression adaptation fallback: %s", e)
        return swapped_bgr


def harmonize_neck_to_face(img_bgr: np.ndarray, face) -> np.ndarray:
    """
    Harmonizes the exposed neck skin below the collar to match the
    face's authentic skin tone, eliminating mismatched head/neck tone.
    """
    try:
        if not hasattr(face, "landmark_3d_68") or face.landmark_3d_68 is None:
            return img_bgr

        h, w = img_bgr.shape[:2]
        chin_pt = face.landmark_3d_68[8].astype(int)

        ny1 = min(h - 1, chin_pt[1] + 5)
        ny2 = min(h, chin_pt[1] + 45)
        nx1 = max(0, chin_pt[0] - 30)
        nx2 = min(w, chin_pt[0] + 30)

        if ny2 <= ny1 or nx2 <= nx1:
            return img_bgr

        fy1 = max(0, chin_pt[1] - 35)
        fy2 = max(0, chin_pt[1] - 10)
        face_sample = img_bgr[fy1:fy2, nx1:nx2]
        neck_sample = img_bgr[ny1:ny2, nx1:nx2]

        if face_sample.size == 0 or neck_sample.size == 0:
            return img_bgr

        n_lab = cv2.cvtColor(neck_sample, cv2.COLOR_BGR2LAB).astype(np.float32)
        f_lab = cv2.cvtColor(face_sample, cv2.COLOR_BGR2LAB).astype(np.float32)

        for c in range(3):
            fm = f_lab[..., c].mean()
            nm = n_lab[..., c].mean()
            n_lab[..., c] = np.clip(n_lab[..., c] + (fm - nm) * 0.70, 0, 255)

        n_bgr = cv2.cvtColor(n_lab.astype(np.uint8), cv2.COLOR_LAB2BGR)
        neck_mask = np.zeros((ny2 - ny1, nx2 - nx1, 1), dtype=np.float32)
        cv2.ellipse(neck_mask, ((nx2 - nx1) // 2, (ny2 - ny1) // 2),
                    ((nx2 - nx1) // 2, (ny2 - ny1) // 2), 0, 0, 360, 1.0, -1)
        neck_mask = cv2.GaussianBlur(neck_mask, (15, 15), 5.0)
        if neck_mask.ndim == 2:
            neck_mask = np.expand_dims(neck_mask, axis=-1)

        result = img_bgr.copy()
        result[ny1:ny2, nx1:nx2] = (
            n_bgr.astype(np.float32) * neck_mask +
            neck_sample.astype(np.float32) * (1.0 - neck_mask)
        ).astype(np.uint8)
        return result
    except Exception as e:
        logger.warning("Neck harmonization fallback: %s", e)
        return img_bgr


class FaceRestorer:
    """
    Ultra-Fidelity Face Restoration & Precision Blending Engine.
    - Preserves 100% of authentic facial identity, skin tone, and micro-geometry.
    - Uses GFPGAN v1.4 with controlled 30% detail blending (sharp eyes, realistic pores, zero cartoon distortion).
    - Unsharp mask in float32 space for high-frequency sharpness without clipping.
    - Anatomical polygon boundary mask for seamless blending with no halos.
    - Harmonizes exposed neck to match face skin tone.
    - 4K Ultra-HD Lanczos4 super-resolution.
    """

    def __init__(self, model_path: str = "models/gfpgan/gfpgan_1.4.onnx"):
        self.session = None
        self.model_path = Path(model_path)
        self._init_session()

    def _init_session(self):
        if self.model_path.exists():
            try:
                self.session = ort.InferenceSession(
                    str(self.model_path), providers=["CPUExecutionProvider"]
                )
                logger.info("GFPGAN FaceRestorer loaded successfully.")
            except Exception as e:
                logger.error("Failed to load GFPGAN model: %s", e)
        else:
            logger.warning("GFPGAN model file not found at %s", self.model_path)

    def enhance(self, img_bgr: np.ndarray, face) -> np.ndarray:
        """
        Enhances face details with strict identity preservation:
        - 30% GFPGAN eye/pore micro-details + 70% authentic identity.
        - Precision unsharp mask for photographic clarity.
        - Anatomical polygon blending to preserve hair, ears, and uniform collar.
        """
        if self.session is None or face is None:
            return img_bgr

        try:
            h, w = img_bgr.shape[:2]

            # 1. Align face into 512x512
            aimg, M = face_align.norm_crop2(img_bgr, face.kps, 512)

            # 2. Normalize [-1, 1] RGB for GFPGAN
            aimg_rgb = cv2.cvtColor(aimg, cv2.COLOR_BGR2RGB)
            blob = (aimg_rgb.astype(np.float32) / 127.5) - 1.0
            blob = np.transpose(blob, (2, 0, 1))
            blob = np.expand_dims(blob, axis=0)

            # 3. GFPGAN inference
            out = self.session.run(None, {"input": blob})[0][0]

            # 4. Denormalize [0, 255]
            out = np.transpose(out, (1, 2, 0))
            out = (out + 1.0) * 127.5
            out = np.clip(out, 0, 255).astype(np.uint8)
            gfpgan_bgr = cv2.cvtColor(out, cv2.COLOR_RGB2BGR)

            # 5. Controlled detail blend: 30% GFPGAN + 70% original identity
            #    This brings crystal-clear eyes and fine pores without rewriting facial identity
            blended_512 = cv2.addWeighted(gfpgan_bgr, 0.30, aimg, 0.70, 0)

            # 6. Micro-texture unsharp mask for photographic clarity
            gaussian = cv2.GaussianBlur(blended_512.astype(np.float32), (0, 0), sigmaX=1.3)
            crisp_512 = np.clip(
                blended_512.astype(np.float32) + (blended_512.astype(np.float32) - gaussian) * 0.35,
                0, 255
            ).astype(np.uint8)

            # 7. Anatomical polygon mask in 512x512 space
            mask_512 = np.zeros((512, 512), dtype=np.float32)

            if hasattr(face, "landmark_3d_68") and face.landmark_3d_68 is not None:
                pts = face.landmark_3d_68[:, :2].reshape(-1, 1, 2)
                pts_512 = cv2.transform(pts, M).reshape(-1, 2).astype(np.int32)

                jaw = pts_512[0:17]
                brow_y = np.mean(pts_512[17:27, 1])
                forehead_top = max(70, int(brow_y - 50))

                top_left = np.array([jaw[0][0] + 5, forehead_top], dtype=np.int32)
                top_center = np.array([256, forehead_top - 15], dtype=np.int32)
                top_right = np.array([jaw[16][0] - 5, forehead_top], dtype=np.int32)

                poly = np.concatenate([
                    jaw,
                    [top_right, top_center, top_left]
                ], axis=0)

                cv2.fillPoly(mask_512, [poly], 1.0)
                mask_512 = cv2.GaussianBlur(mask_512, (11, 11), 3.5)
            else:
                cv2.ellipse(mask_512, (256, 280), (150, 185), 0, 0, 360, 1.0, -1)
                mask_512 = cv2.GaussianBlur(mask_512, (11, 11), 3.5)

            # 8. Inverse warp face and mask back to full image
            inv_M = cv2.invertAffineTransform(M)
            inv_face = cv2.warpAffine(crisp_512, inv_M, (w, h), borderMode=cv2.BORDER_REFLECT)
            inv_mask = cv2.warpAffine(mask_512, inv_M, (w, h), borderMode=cv2.BORDER_CONSTANT)
            inv_mask = np.expand_dims(inv_mask, axis=-1)

            # 9. Alpha blend preserving 100% of the uniform and original surroundings
            blended = (inv_face.astype(np.float32) * inv_mask +
                       img_bgr.astype(np.float32) * (1.0 - inv_mask))
            result = np.clip(blended, 0, 255).astype(np.uint8)

            return result
        except Exception as e:
            logger.warning("Enhance fallback: %s", e)
            return img_bgr

    def upscale_4k(self, img_bgr: np.ndarray, target_height: int = 2160) -> np.ndarray:
        """
        Upscales to 4K Ultra-HD (2160p) using Lanczos4 interpolation with
        float32 unsharp sharpening that avoids digital clipping artifacts.
        """
        try:
            h, w = img_bgr.shape[:2]
            if h >= target_height:
                return img_bgr

            scale = target_height / float(h)
            target_width = int(w * scale)

            upscaled = cv2.resize(
                img_bgr,
                (target_width, target_height),
                interpolation=cv2.INTER_LANCZOS4,
            )

            upscaled_f = upscaled.astype(np.float32)
            blurred = cv2.GaussianBlur(upscaled_f, (0, 0), sigmaX=1.2)
            sharpened = np.clip(upscaled_f + (upscaled_f - blurred) * 0.28, 0, 255).astype(np.uint8)

            return sharpened
        except Exception as e:
            logger.warning("4K upscale fallback: %s", e)
            return img_bgr


restorer = FaceRestorer()
