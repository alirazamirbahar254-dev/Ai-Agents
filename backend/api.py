from router.router import router 
from fastapi import FastAPI;
app = FastAPI();
app.include_router(router)

@router.post("/chat")
def chat():
    pass



