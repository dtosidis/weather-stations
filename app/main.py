from fastapi import FastAPI, Request
from fastapi.responses import HTMLResponse
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates
from fastapi import Depends, APIRouter

from .client import call_external_api

router = APIRouter(prefix="/api")

app = FastAPI(title="FastAPI Map PoC")

app.mount("/static", StaticFiles(directory="static"), name="static")
templates = Jinja2Templates(directory="templates")

app.include_router(router)


@app.get("/", response_class=HTMLResponse)
async def index(request: Request):
    return templates.TemplateResponse(
        "index.html",
        {"request": request}
    )


@app.get("/api/stations")
async def get_stations(stations=Depends(call_external_api)):
    return stations


@app.get("/health")
async def health():
    return {"status": "ok"}
