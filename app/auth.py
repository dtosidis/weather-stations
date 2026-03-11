import httpx
import jwt
from datetime import datetime, timezone, timedelta

from .config import AUTH_URL, USERNAME, PASSWORD


class TokenManager:
    def __init__(self):
        self._token: str | None = None
        self._expiry: datetime | None = None

    async def get_token(self) -> str:
        if self._token and self._expiry:
            if datetime.now(timezone.utc) < self._expiry:
                return self._token

        await self._refresh_token()
        return self._token

    async def _refresh_token(self):

        async with httpx.AsyncClient(verify=False) as client:
            response = await client.post(
                AUTH_URL,
                json={
                    "username": USERNAME,
                    "password": PASSWORD
                }
            )

        response.raise_for_status()

        data = response.json()
        token = data["access_token"]

        payload = jwt.decode(token, options={"verify_signature": False})

        expiry = datetime.fromtimestamp(payload["exp"], tz=timezone.utc)

        # refresh early
        expiry = expiry - timedelta(minutes=1)

        self._token = token
        self._expiry = expiry


token_manager = TokenManager()


async def get_bearer_token():
    return await token_manager.get_token()