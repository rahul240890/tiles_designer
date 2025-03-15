import asyncio
from fastapi import APIRouter

router = APIRouter()

@router.get("/progress")
async def get_progress():
    """ Returns a fixed 100% progress since WebSocket tracking is removed. """
    return {"progress": 100}
