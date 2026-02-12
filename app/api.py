from fastapi import APIRouter, Query
from app.services.nominatim import search_places

router = APIRouter(prefix="/api")

@router.get("/locations")
async def get_locations(
    q: str = Query(..., description="Search term (e.g. cafes in Paris)")
):
    return await search_places(q)
