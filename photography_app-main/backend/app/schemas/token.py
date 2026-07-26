from pydantic import BaseModel


class TokenPair(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str = "bearer"


class TokenPayload(BaseModel):
    sub: str
    exp: int
    type: str
    role: Optional[str] = None


class RefreshTokenRequest(BaseModel):
    refresh_token: str
