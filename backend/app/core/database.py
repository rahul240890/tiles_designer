from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base
from app.core.settings import settings

# ✅ Create Database Engine (Ensure PostgreSQL UUID Support)
engine = create_engine(settings.DATABASE_URL, pool_pre_ping=True)

# ✅ Create SessionLocal for Dependency Injection
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# ✅ Base Model for ORM
Base = declarative_base()

# ✅ Database Dependency (For FastAPI Dependency Injection)
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
