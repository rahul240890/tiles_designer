import logging
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.database import engine, Base
from fastapi.staticfiles import StaticFiles
import uvicorn

# ✅ Import Routes
from app.routes import (
    auth_routes, user_routes, seller_routes, seller_user_routes,
    attribute_routes, collection_routes, favorite_routes, tile_routes,
    upload_routes, pdf_routes, progress_routes
)
from app.routes import suitable_place  # ✅ Import Suitable Places Route

logging.basicConfig(level=logging.DEBUG)  # ✅ Enable detailed logs

app = FastAPI(title="AI-Powered Tile Visualization API", version="1.0.0", debug=True)
# ✅ Serve images from the `tiles_storage` folder
app.mount("/tiles_storage", StaticFiles(directory="tiles_storage"), name="tiles")
# ✅ Enable CORS (Allow frontend requests)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins (Change to specific domains in production)
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
# ✅ Register Routes
app.include_router(auth_routes.router)
app.include_router(user_routes.router)
app.include_router(seller_routes.router)
app.include_router(seller_user_routes.router)
app.include_router(attribute_routes.router)
app.include_router(collection_routes.router)
app.include_router(suitable_place.router)
app.include_router(favorite_routes.router)
app.include_router(tile_routes.router)  # 🚀 Tile Management Routes
app.include_router(upload_routes.router)  # 🚀 Multiple Tile Upload Routes
app.include_router(pdf_routes.router)  # 🚀 PDF-Based Tile Upload Routes
app.include_router(progress_routes.router)  # 🚀 Real-Time Progress Tracking



@app.get("/", tags=["Health Check"])
def home():
    return {"message": "Welcome to the AI-Powered Tile Visualization API 🚀"}