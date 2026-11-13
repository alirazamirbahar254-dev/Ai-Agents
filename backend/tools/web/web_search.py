#python pekage for web_search
from ddgs import DDGS

web_search_tool = {

"type":"function",

"function":{

    "name":"web_search",
    "description":"Search the web for relevant information about a user's query.",

"parameters":{

    "type": "object",

    "properties":{

         "query":{
             "type":"string"
         }
    },

    "required":[
    "query"
]
}
}
}

def web_search(query : str):

    """Use this tool to search the web for current
    information or facts that require online sources."""
    try:
        with DDGS() as ddgs:
            text = ddgs.text(query, max_results=3)
            results = []
            for result in text:
                results.append({
                    "title":result["title"],
                    "href":result["href"],
                    "body":result["body"],
                })
            
            return results
    except Exception as e:
            return str(e)

     