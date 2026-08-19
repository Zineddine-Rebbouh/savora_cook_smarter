from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from slowapi import _rate_limit_exceeded_handler
from slowapi.errors import RateLimitExceeded

from app.config import get_settings
from app.limiter import limiter
from app.routers import auth, me, meal_plans, pantry, recipes

settings = get_settings()

app = FastAPI(
    title="Savora API",
    description="Core backend API for Savora recipe & meal planning app",
    version="1.0.0",
    debug=settings.debug,
)

app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origin_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router, prefix="/api/v1")
app.include_router(me.router, prefix="/api/v1")
app.include_router(recipes.router, prefix="/api/v1")
app.include_router(pantry.router, prefix="/api/v1")
app.include_router(meal_plans.router, prefix="/api/v1")


@app.get("/health", tags=["health"])
def health_check():
    return {"status": "ok"}
