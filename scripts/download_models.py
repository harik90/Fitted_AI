"""
Fitted AI - Model Checkpoint Download Helper

Per PRD:
- Never download huge models silently without user confirmation.
- InsightFace (antelopev2 / buffalo_l)
- SAM 2 (sam2_hiera_base_plus / large)
- InstantID (InstantID adapter & controlnet)
- GFPGAN (v1.4)
"""

import sys
from pathlib import Path


MODEL_CATALOG = {
    "insightface": {
        "name": "InsightFace buffalo_l",
        "description": "Face detection, landmark 2D/3D & identity embedding (prototype only).",
        "url": "https://github.com/deepinsight/insightface/releases",
        "destination": "models/insightface",
    },
    "sam2": {
        "name": "SAM 2 (Segment Anything 2)",
        "description": "Precise head, hair, neck and clothing segmentation (Apache 2.0).",
        "url": "https://github.com/facebookresearch/segment-anything-2",
        "destination": "models/sam2",
    },
    "instantid": {
        "name": "InstantID Checkpoints",
        "description": "Zero-shot identity-preserving image adapter for SDXL.",
        "url": "https://huggingface.co/InstantX/InstantID",
        "destination": "models/instantid",
    },
    "gfpgan": {
        "name": "GFPGAN v1.4",
        "description": "Face restoration and natural skin texture enhancer.",
        "url": "https://github.com/TencentARC/GFPGAN/releases/download/v1.3.0/GFPGANv1.4.pth",
        "destination": "models/gfpgan",
    },
}


def print_instructions():
    print("=" * 60)
    print("Fitted AI - Model Checkpoints Directory & Setup Guide")
    print("=" * 60)
    for key, info in MODEL_CATALOG.items():
        print(f"\n[ {info['name']} ]")
        print(f"  Description: {info['description']}")
        print(f"  Download:    {info['url']}")
        print(f"  Target Dir:  {info['destination']}")
        Path(info["destination"]).mkdir(parents=True, exist_ok=True)
    print("\n" + "=" * 60)
    print("Target folders have been prepared. Place weights in the respective directories.")


if __name__ == "__main__":
    print_instructions()
