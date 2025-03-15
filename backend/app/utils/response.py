from fastapi import HTTPException
from typing import Any

def success_response(message: str, data):
    # ✅ If data is a list, return only the list (to match FastAPI expectations)
    if isinstance(data, list):
        return data
    return {"status": "success", "message": message, "data": data}


def error_response(message: str, error_code: str, status_code: int = 400, detail: Any = None):
    raise HTTPException(
        status_code=status_code,
        detail={
            "status": "error",
            "message": message,
            "error_code": error_code,
            "detail": detail
        }
    )
