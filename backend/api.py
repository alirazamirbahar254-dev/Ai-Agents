 # Creates the FastAPI application instance
from router.router import router 
# FastAPI mein CORS handling enable karna.
from fastapi.middleware.cors import CORSMiddleware

from fastapi import FastAPI;
app = FastAPI();

# Allow frontend to communicate with backend using CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
app.include_router(router)




