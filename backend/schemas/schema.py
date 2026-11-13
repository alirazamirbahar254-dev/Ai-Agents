from pydantic import BaseModel
# ye model React se aane wale data ko validate kare ke data sahi format mein aaya hai ya nahi.
class ChatModel(BaseModel):
    message : str
    