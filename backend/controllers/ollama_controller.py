# # for json data
# import json
# #for api request
# import urllib.request
# def ask_qwen(message):

#     data = {
#         "model"  : "qwen2.5",            # model — kaunsa model chalana hai.
#         "prompt" : "message",            # prompt — user ka message.
#         "stream" : False                 # stream: False — poora jawab ek saath return karna hai.
#     }

#     payload = json.dumps(data).encode("utf-8")
#     request = urllib.request.Request(

#         "http://127.0.0.1:11434/api/generate",
#         data = payload,
#         headers={"Content-Type":"application/json"},
#         method="POST"

#     )

#     response = urllib.request.urlopen(request)
#     result = json.loads(response.read().decode("utf-8"))
#     return result["response"]

# print(ask_qwen("Say hello in one sentence."))