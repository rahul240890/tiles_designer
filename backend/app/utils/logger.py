import logging

# Configure logging
logging.basicConfig(
    filename="app.log",
    level=logging.INFO,
    format="%(asctime)s - %(levelname)s - %(message)s",
)

# ✅ Log events
def log_event(event: str):
    logging.info(event)

# ✅ Log errors
def log_error(error: str):
    logging.error(error)
