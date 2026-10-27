from dataclasses import dataclass
import numpy as np
from PIL import Image
from backend.config import settings


@dataclass
class QualityReport:
    identity_score: float
    geometry_score: float
    mask_score: float
    sharpness_score: float
    preservation_score: float
    overall_score: float
    passed: bool


def calculate_sharpness(img_gray: np.ndarray) -> float:
    """Calculate normalized sharpness score using gradient variance."""
    if img_gray.size == 0:
        return 0.0
    gy, gx = np.gradient(img_gray.astype(np.float64))
    gnorm = np.sqrt(gx**2 + gy**2)
    var = float(np.var(gnorm))
    # Normalize variance into a 0.0 - 1.0 range
    score = min(1.0, var / 500.0)
    return max(0.1, score)


def calculate_preservation(
    template_arr: np.ndarray,
    output_arr: np.ndarray,
    mask: np.ndarray,
) -> float:
    """
    Evaluate template pixel preservation outside the editing mask.
    Outside mask (where mask == 0), pixels should be nearly identical.
    """
    outside = mask == 0
    if not np.any(outside):
        return 1.0

    diff = np.abs(template_arr.astype(np.float32) - output_arr.astype(np.float32))
    diff_outside = diff[outside]
    mae = float(np.mean(diff_outside))
    # Normalized score: mae 0 -> 1.0, mae >= 50 -> 0.0
    return max(0.0, min(1.0, 1.0 - (mae / 50.0)))


def evaluate_quality(
    source_arr: np.ndarray,
    template_arr: np.ndarray,
    output_arr: np.ndarray,
    mask: np.ndarray,
    identity_sim: float = 0.88,
    geometry_sim: float = 0.90,
    mask_score: float = 0.92,
) -> QualityReport:
    """Calculate comprehensive quality metrics per PRD specification."""
    # Sharpness
    gray_out = np.mean(output_arr, axis=-1)
    sharpness = calculate_sharpness(gray_out)

    # Preservation outside mask
    preservation = calculate_preservation(template_arr, output_arr, mask)

    # Weighted overall score
    overall = (
        identity_sim * settings.identity_weight
        + geometry_sim * settings.geometry_weight
        + mask_score * settings.mask_weight
        + sharpness * settings.sharpness_weight
        + preservation * settings.preservation_weight
    )

    passed = overall >= settings.quality_threshold

    return QualityReport(
        identity_score=identity_sim,
        geometry_score=geometry_sim,
        mask_score=mask_score,
        sharpness_score=sharpness,
        preservation_score=preservation,
        overall_score=round(overall, 4),
        passed=passed,
    )
