import httpx
from fastapi import Depends

from .auth import get_bearer_token
from .config import EXTERNAL_API_URL


async def call_external_api(token: str = Depends(get_bearer_token)):
    headers = {
        "Authorization": f"Bearer {token}"
    }

    async with httpx.AsyncClient(verify=False) as client:
        response = await client.get(
            EXTERNAL_API_URL,
            headers=headers
        )

    if response.status_code == 200:
        return response.json()

    # response.raise_for_status()
    # TODO: remove this hack with mocked data
    mocked_stations_info = [
        {
            "station_id": 0,
            "brand_id": 0,
            "brand_station_id": "string",
            "name": {
                "el": "Κοκκινοχώρι",
                "en": "Kokkinoxori"
            },
            "longitude": "24.00",
            "latitude": "40.81",
            "elevation": 0,
            "station_type": "agro_meteorological",
            "surface_type": "grass",
            "installed_at": "2026-04-22T09:29:31.777Z",
            "status": True,
            "firmware": "string",
            "last_communication": "2026-04-22T09:29:31.777Z",
            "brand_metadata": {},
            "created_at": "2026-04-22T09:29:31.777Z"
        },
        {
            "station_id": 1,
            "brand_id": 1,
            "brand_station_id": "string",
            "name": {
                "el": "Χρυσοχώρι",
                "en": "Chrisoxori"
            },
            "longitude": "24.71",
            "latitude": "40.93",
            "elevation": 0,
            "station_type": "agro_meteorological",
            "surface_type": "grass",
            "installed_at": "2026-04-22T09:29:31.777Z",
            "status": True,
            "firmware": "string",
            "last_communication": "2026-04-22T09:29:31.777Z",
            "brand_metadata": {},
            "created_at": "2026-04-22T09:29:31.777Z"
        },
        {
            "station_id": 2,
            "brand_id": 2,
            "brand_station_id": "string",
            "name": {
                "el": "Νέο Σιδηροχώρι",
                "en": "Neo Sidiroxori"
            },
            "longitude": "25.40",
            "latitude": "41.07",
            "elevation": 0,
            "station_type": "agro_meteorological",
            "surface_type": "grass",
            "installed_at": "2026-04-22T09:29:31.777Z",
            "status": True,
            "firmware": "string",
            "last_communication": "2026-04-22T09:29:31.777Z",
            "brand_metadata": {},
            "created_at": "2026-04-22T09:29:31.777Z"
        },
    ]

    return mocked_stations_info
