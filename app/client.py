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

    response.raise_for_status()

    return response.json()