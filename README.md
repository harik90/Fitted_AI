# fitted-ai

automatic portrait and uniform identity transfer pipeline with zero manual fitting.

## why

matching real face portraits onto template uniforms usually requires tedious manual warping and lighting touchups. i built this pipeline to automate landmark alignment, feature-preserving neural blending, and ultra-hd restoration in one clean shot without third-party tunnels or external dependencies.

## run

```bash
# install
pip install -r requirements.txt
cd frontend && npm install && npm run build && cd ..

# start backend & dev ui
python -m uvicorn backend.main:app --reload --port 8000
cd frontend && npm run dev
```

on windows you can double-click `install.bat` and `start.bat`.

## deploy

run unified on a single port:

```bash
python -m uvicorn backend.main:app --host 0.0.0.0 --port 8000
```

or via container:

```bash
docker compose up --build -d
```
