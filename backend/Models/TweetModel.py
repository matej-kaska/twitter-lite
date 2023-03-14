from pydantic import BaseModel, Field
from uuid import uuid4
from typing import List
from datetime import datetime
from pytz import timezone, utc

tz = timezone('Europe/Prague')

class Tweet(BaseModel):
    id: str = Field(..., alias='_id')
    id_of_user: str
    name_of_user: str
    username_of_user: str
    comments: List
    likes: List
    ts_created: datetime
    text: str

class TweetCls:
    def __init__(self, id_of_user: str, name_of_user: str, username_of_user: str, text: str):
        self._id = uuid4()
        self.id_of_user = id_of_user
        self.name_of_user = name_of_user
        self.username_of_user = username_of_user
        self.comments = []
        self.likes = []
        self.ts_created = datetime.now().replace(tzinfo=utc).astimezone(tz)
        self.text = text