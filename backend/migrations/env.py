from logging.config import fileConfig

from sqlalchemy import engine_from_config, pool
from alembic import context

# ✅ Import the Base metadata from your application
from app.core.database import Base
from app.models import (
    user, seller, collection_model, attribute_models, tiles_model,
    tile_designs_model, favorite_tiles_model, room_template
)
from app.models.ai import (
    room_segmentation, processed_image, tile_comparison, matching_tiles, painted_walls
)  # ✅ AI Models Added

# ✅ Alembic Config object for .ini file values
config = context.config

# ✅ Setup Python logging based on Alembic config
if config.config_file_name is not None:
    fileConfig(config.config_file_name)

# ✅ Include all model metadata for migrations
target_metadata = Base.metadata


def run_migrations_offline() -> None:
    """Run migrations in 'offline' mode.

    This configures the context with just a URL
    and not an Engine, though an Engine is acceptable
    here as well. By skipping the Engine creation,
    we don't even need a DBAPI to be available.

    Calls to context.execute() here emit the given string to the
    script output.
    """
    url = config.get_main_option("sqlalchemy.url")
    context.configure(
        url=url,
        target_metadata=target_metadata,
        literal_binds=True,
        dialect_opts={"paramstyle": "named"},
    )

    with context.begin_transaction():
        context.run_migrations()


def run_migrations_online() -> None:
    """Run migrations in 'online' mode.

    In this scenario, we create an Engine
    and associate a connection with the context.
    """
    connectable = engine_from_config(
        config.get_section(config.config_ini_section, {}),
        prefix="sqlalchemy.",
        poolclass=pool.NullPool,
    )

    with connectable.connect() as connection:
        context.configure(
            connection=connection, target_metadata=target_metadata
        )

        with context.begin_transaction():
            context.run_migrations()


if context.is_offline_mode():
    run_migrations_offline()
else:
    run_migrations_online()
