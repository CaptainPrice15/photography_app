from abc import ABC, abstractmethod
from typing import BinaryIO


class StorageInterface(ABC):
    @abstractmethod
    async def upload_file(
        self, file_bytes: bytes, filename: str, folder_id: int = 0
    ) -> dict:
        pass

    @abstractmethod
    async def get_file_link(self, file_id: int) -> str:
        pass

    @abstractmethod
    async def get_thumb_link(
        self, file_id: int, width: int = 800, height: int = 600
    ) -> str:
        pass

    @abstractmethod
    async def delete_file(self, file_id: int) -> bool:
        pass

    @abstractmethod
    async def create_folder(self, name: str, parent_id: int = 0) -> dict:
        pass
