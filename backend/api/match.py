import uuid
import logging
import base64
from pathlib import Path

from fastapi import APIRouter, UploadFile, File, Form, HTTPException
from fastapi.responses import JSONResponse

from backend.config import settings
from backend.utils.image import validate_image, save_upload
from backend.pipelines.matcher import pipeline

logger = logging.getLogger(__name__)

router = APIRouter()


@router.post("/match")
async def match_photos(
    source_image: UploadFile = File(...),
    template_image: UploadFile = File(...),
    background: str = Form("white"),
    instructions: str = Form(""),
    features: str = Form("head,lips,hair,clothes"),
    quality_mode: str = Form("4k"),
):
    request_id = str(uuid.uuid4())[:8]
    request_dir = Path(settings.temp_dir) / request_id

    try:
        request_dir.mkdir(parents=True, exist_ok=True)

        source_path = await save_upload(source_image, request_dir / "source")
        template_path = await save_upload(template_image, request_dir / "template")

        source_err = validate_image(source_path)
        if source_err:
            raise HTTPException(status_code=400, detail=source_err)

        template_err = validate_image(template_path)
        if template_err:
            raise HTTPException(status_code=400, detail=template_err)

        output_path = request_dir / "result.png"

        # Execute automated pipeline with GFPGAN, feature flags & quality mode
        result = pipeline.process(
            source_path=source_path,
            template_path=template_path,
            output_path=output_path,
            background=background,
            instructions=instructions,
            features=features,
            quality_mode=quality_mode,
        )

        result_url = f"/temp/{request_id}/result.png"
        result_base64 = None
        if output_path.exists():
            with open(output_path, "rb") as f:
                result_base64 = "data:image/png;base64," + base64.b64encode(f.read()).decode("utf-8")

        return JSONResponse(
            content={
                "success": True,
                "result_url": result_url,
                "result_base64": result_base64,
                "score": result.quality_report.overall_score,
                "attempts": result.attempts,
                "request_id": request_id,
                "gender": result.detected_gender,
                "resolution": result.resolution,
                "hair_adapted": result.hair_adapted,
            }
        )


    except HTTPException:
        raise
    except Exception as e:
        logger.exception("Match request failed")
        raise HTTPException(
            status_code=500,
            detail="Something went wrong while generating the result.",
        )
