from pathlib import Path
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
from fastapi.staticfiles import StaticFiles

from backend.config import settings
from backend.api.match import router as match_router
from backend.api.health import router as health_router

app = FastAPI(title="Fitted AI", version="0.1.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.mount("/temp", StaticFiles(directory=settings.temp_dir), name="temp")

app.include_router(health_router, prefix="/api")
app.include_router(match_router, prefix="/api")

frontend_dist = Path(__file__).resolve().parent.parent / "frontend" / "dist"
if (frontend_dist / "assets").exists():
    app.mount("/assets", StaticFiles(directory=str(frontend_dist / "assets")), name="assets")
if (frontend_dist / "presets").exists():
    app.mount("/presets", StaticFiles(directory=str(frontend_dist / "presets")), name="presets")


@app.get("/{full_path:path}")
async def serve_spa(full_path: str):
    if full_path.startswith("api/") or full_path.startswith("temp/"):
        raise HTTPException(status_code=404, detail="Not Found")
    target_file = frontend_dist / full_path
    if full_path and target_file.is_file():
        return FileResponse(str(target_file))
    index_file = frontend_dist / "index.html"
    if index_file.is_file():
        return FileResponse(str(index_file))
    return {"status": "ok", "message": "Fitted AI Backend is running. Run `cd frontend && npm run build` to serve frontend."}
