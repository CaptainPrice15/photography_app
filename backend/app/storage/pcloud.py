import hashlib
import httpx
from app.config import settings
from app.storage.storage_interface import StorageInterface


class PCloudStorage(StorageInterface):
    BASE_URL = "https://api.pcloud.com"

    def __init__(self):
        self.email = settings.PCLOUD_EMAIL
        self.password = settings.PCLOUD_PASSWORD
        self.access_token = settings.PCLOUD_ACCESS_TOKEN

    async def _get_auth_params(self) -> dict:
        if self.access_token:
            return {"access_token": self.access_token}
        return await self._digest_auth()

    async def _digest_auth(self) -> dict:
        if not self.email or not self.password:
            raise Exception("No pCloud credentials configured")
        async with httpx.AsyncClient(timeout=30) as client:
            r = await client.post(f"{self.BASE_URL}/getdigest")
            d = r.json()
            if d.get("result") != 0:
                raise Exception("pCloud getdigest failed")
            digest = d["digest"]
            sha1_email = hashlib.sha1(self.email.lower().encode()).hexdigest()
            passworddigest = hashlib.sha1(
                (self.password + sha1_email + digest).encode()
            ).hexdigest()
            return {
                "username": self.email,
                "passworddigest": passworddigest,
                "digest": digest,
            }

    async def _request(self, method: str, params: dict = None, files: dict = None) -> dict:
        auth_params = await self._get_auth_params()
        merged = {**auth_params, **(params or {})}
        async with httpx.AsyncClient(timeout=120) as client:
            if files:
                response = await client.post(
                    f"{self.BASE_URL}/{method}",
                    data=merged,
                    files=files,
                )
            else:
                response = await client.post(
                    f"{self.BASE_URL}/{method}",
                    data=merged,
                )
            data = response.json()
            if data.get("result") == 2094 and "access_token" in auth_params:
                auth_params = await self._digest_auth()
                merged = {**auth_params, **(params or {})}
                if files:
                    response = await client.post(
                        f"{self.BASE_URL}/{method}",
                        data=merged,
                        files=files,
                    )
                else:
                    response = await client.post(
                        f"{self.BASE_URL}/{method}",
                        data=merged,
                    )
                return response.json()
            return data

    async def upload_file(
        self, file_bytes: bytes, filename: str, folder_id: int = 0
    ) -> dict:
        data = await self._request(
            "uploadfile",
            params={"folderid": folder_id, "renameifexists": 1},
            files={"file": (filename, file_bytes)},
        )
        if data.get("result") != 0:
            raise Exception(f"pCloud upload failed: {data.get('error')}")
        return data["metadata"][0]

    async def get_file_link(self, file_id: int) -> str:
        data = await self._request("getfilelink", params={"fileid": file_id})
        if data.get("result") != 0:
            raise Exception(f"pCloud get link failed: {data.get('error')}")
        host = data["hosts"][0]
        path = data["path"]
        return f"https://{host}{path}"

    async def download_file(self, file_id: int) -> bytes:
        data = await self._request("getfilelink", params={"fileid": file_id})
        if data.get("result") != 0:
            raise Exception(f"pCloud get link failed: {data.get('error')}")
        host = data["hosts"][0]
        path = data["path"]
        url = f"https://{host}{path}"
        if data.get("auth"):
            url += "?auth=" + data["auth"]
        async with httpx.AsyncClient(timeout=120) as client:
            response = await client.get(url)
            response.raise_for_status()
            return response.content

    async def get_thumb_link(
        self, file_id: int, width: int = 800, height: int = 600
    ) -> str:
        data = await self._request(
            "getthumblink", params={"fileid": file_id, "size": f"{width}x{height}"}
        )
        if data.get("result") != 0:
            raise Exception(f"pCloud thumb failed: {data.get('error')}")
        host = data["hosts"][0]
        path = data["path"]
        return f"https://{host}{path}"

    async def delete_file(self, file_id: int) -> bool:
        data = await self._request("deletefile", params={"fileid": file_id})
        return data.get("result") == 0

    async def create_folder(self, name: str, parent_id: int = 0) -> dict:
        data = await self._request(
            "createfolder", params={"name": name, "folderid": parent_id}
        )
        if data.get("result") != 0:
            raise Exception(f"pCloud create folder failed: {data.get('error')}")
        return data
