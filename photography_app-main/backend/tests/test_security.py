import uuid
from app.core.security import (
    hash_password,
    verify_password,
    create_access_token,
    create_refresh_token,
    verify_token,
)


def test_hash_password():
    hashed = hash_password("testpassword")
    assert hashed != "testpassword"
    assert verify_password("testpassword", hashed) is True
    assert verify_password("wrongpassword", hashed) is False


def test_create_access_token():
    user_id = str(uuid.uuid4())
    token = create_access_token(user_id, "visitor")
    payload = verify_token(token)
    assert payload is not None
    assert payload["sub"] == user_id
    assert payload["role"] == "visitor"
    assert payload["type"] == "access"
    assert "exp" in payload


def test_create_refresh_token():
    user_id = str(uuid.uuid4())
    token = create_refresh_token(user_id)
    payload = verify_token(token)
    assert payload is not None
    assert payload["sub"] == user_id
    assert payload["type"] == "refresh"
    assert "exp" in payload


def test_verify_invalid_token():
    payload = verify_token("invalid.token.here")
    assert payload is None


def test_access_and_refresh_tokens_differ():
    user_id = str(uuid.uuid4())
    access = create_access_token(user_id, "admin")
    refresh = create_refresh_token(user_id)
    assert access != refresh


def test_token_contains_role():
    user_id = str(uuid.uuid4())
    token = create_access_token(user_id, "admin")
    payload = verify_token(token)
    assert payload["role"] == "admin"
