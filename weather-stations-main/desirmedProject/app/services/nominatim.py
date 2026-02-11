import httpx

NOMINATIM_URL = "https://nominatim.openstreetmap.org/search"

HEADERS = {
    "User-Agent": "fastapi-map-poc/1.0 (contact@example.com)"
}

async def search_places(query: str):
    params = {
        "q": query,
        "format": "json",
        "limit": 10
    }

    async with httpx.AsyncClient(timeout=10) as client:
        response = await client.get(
            NOMINATIM_URL,
            params=params,
            headers=HEADERS
        )
        response.raise_for_status()
        data = response.json()

    return [
        {
            "name": place["display_name"],
            "lat": float(place["lat"]),
            "lng": float(place["lon"])
        }
        for place in data
    ]
