from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

def register_middleware(app: FastAPI):
    # Setup open CORS policy for development proxy, override as needed
    app.add_middleware(
        CORSMiddleware,
        allow_origins=["*"],
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )
