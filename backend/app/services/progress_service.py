import asyncio

progress_status = {}

def reset_progress():
    """ Reset progress tracking """
    global progress_status
    progress_status = {}
    print("Progress reset.")

async def update_progress(progress: int):
    """ Updates the progress for tile upload processing in real-time. """
    progress_status["progress"] = progress
    print(f"Progress updated: {progress}%")

async def get_progress():
    """ Returns the current progress. """
    return progress_status.get("progress", 0)
