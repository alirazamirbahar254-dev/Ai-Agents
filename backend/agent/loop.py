# Manages the agent loop, executes requested tools, and returns results to the LLM.
from agent.llm import ask_agent
from tools import TOOLS
from tools import TOOL_DEFINITIONS 
import json

def run_agent():
    while True:

        user_input = input("HOW CAN I HELP YOU?: ")
        messages = [
        {
            "role": "system",
            "content": "For simple questions, answer in 2–3 sentences maximum.Keep answers concise and directly answer the user's question. Provide details only when requested. Whenever web search results contain relevant URLs, include them as clickable source links in your final answer. Never invent URLs."
        },
        {"role": "user", "content": user_input}]
                                                
        response = ask_agent(messages, tools = TOOL_DEFINITIONS)
 
        while response.choices[0].message.tool_calls:
            messages.append(response.choices[0].message.model_dump())

            for tool_call in response.choices[0].message.tool_calls:
                tool_name = tool_call.function.name
                args = json.loads(tool_call.function.arguments)
                print(f"{tool_name} tool executed!")
                print("Tool arguments:", args)
                result = TOOLS[tool_name]["function"](**args)

                messages.append({
                    "role": "tool",
                    "tool_call_id": tool_call.id,
                    "content": str(result)
                })

            response = ask_agent(messages, tools = TOOL_DEFINITIONS)
        print(response.choices[0].message.content)


