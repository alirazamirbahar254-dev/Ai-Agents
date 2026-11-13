from tools.math.calculator import calculator_tool,calculator;
from tools.web.web_search import web_search_tool, web_search;

TOOLS = {

    "calculator":{
        "function": calculator,
        "definition": calculator_tool,
    },

    "web_search":{
        "function": web_search,
        "definition": web_search_tool
    }
    
}

TOOL_DEFINITIONS = [tool["definition"] for tool in TOOLS.values()]
