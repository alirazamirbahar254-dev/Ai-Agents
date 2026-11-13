from fastapi import APIRouter;
from agent.loop import run_agent
from schemas.schema import ChatModel;
router = APIRouter()

@router.post("/chat")
def chat(data: ChatModel):
    response = run_agent(data.message)
    return{"response": response}
    
