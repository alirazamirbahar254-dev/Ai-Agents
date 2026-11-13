# Sends messages and available tools to the Qwen model through Ollama.
# import ollama

from  config  import MODEL_NAME
import os
from openai import OpenAI
from dotenv import load_dotenv
load_dotenv()
api_key = os.getenv("API_KEY")
base_url = os.getenv("BASE_URL")
openai = OpenAI(api_key=api_key, base_url=base_url)

def ask_agent(messages, tools=None):
    return openai.chat.completions.create(
        model= MODEL_NAME,
        messages=messages,
        tools=tools or []
    )
