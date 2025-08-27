from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .core.utils import settings
from .api.routes import providers, courses


app = FastAPI(
    title="Course Gallery",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[settings.client_url],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
    expose_headers=["*"],
)

app.include_router(providers.router, prefix="/api")
app.include_router(courses.router, prefix="/api")
@app.get("/")
async def read_root():
    return {"message": "Welcome to the Course Gallery API"}

@app.get("/health")
async def health_check():
    return {"status": "healthy"}
