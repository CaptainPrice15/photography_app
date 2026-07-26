import httpx
from app.config import settings
from app.storage.storage_interface import StorageInterface


class PCloudStorage(StorageInterface):
    BASE_URL = "https://api.pcloud.com"

    def __init__(self):
        self.access_token = settings.PCLOUD_ACCESS_TOKEN
        self.headers = {"Authorization": f"Bearer {self.access_token}"}

    async def upload_file(
        self, file_bytes: bytes, filename: str, folder_id: int = 0
    ) -> dict:
        async with httpx.AsyncClient(timeout=120) as client:
            response = await client.post(
                f"{self.BASE_URL}/uploadfile",
                headers=self.headers,
                files={"file": (filename, file_bytes)},
                data={"folderid": folder_id, "renameifexists": 1},
            )
            data = response.json()
            if data.get("result") != 0:
                raise Exception(f"pCloud upload failed: {data.get('error')}")
            return data["metadata"][0]

    async def get_file_link(self, file_id: int) -> str:
        async with httpx.AsyncClient() as client:
            response = await client.post(
                f"{self.BASE_URL}/getfilelink",
                headers=self.headers,
                data={"fileid": file_id},
            )
            data = response.json()
            if data.get("result") != 0:
                raise Exception(f"pCloud get link failed: {data.get('error')}")
            host = data["hosts"][0]
            path = data["path"]
            return f"https://{host}{path}"

    async def get_thumb_link(
        self, file_id: int, width: int = 800, height: int = 600
    ) -> str:
        async with httpx.AsyncClient() as client:
            response = await client.post(
                f"{self.BASE_URL}/getthumblink",
                headers=self.headers,
                data={"fileid": file_id, "size": f"{width}x{height}"},
            )
            data = response.json()
            if data.get("result") != 0:
                raise Exception(f"pCloud thumb failed: {data.get('error')}")
            host = data["hosts"][0]
            path = data["path"]
            return f"https://{host}{path}"

    async def delete_file(self, file_id: int) -> bool:
        async with httpx.AsyncClient() as client:
            response = await client.post(
                f"{self.BASE_URL}/deletefile",
                headers=self.headers,
                data={"fileid": file_id},
            )
            return response.json().get("result") == 0

    async def create_folder(self, name: str, parent_id: int = 0) -> dict:
        async with httpx.AsyncClient() as client:
            response = await client.post(
                f"{self.BASE_URL}/createfolder",
                headers=self.headers,
                data={"name": name, "folderid": parent_id},
            )
            data = response.json()
            if data.get("result") != 0:
                raise Exception(f"pCloud create folder failed: {data.get('error')}")
            return data
