from pydantic import BaseModel, Field
import uuid
import typing
import datetime

class Tweet(BaseModel):
    id: str = Field(..., alias='_id')
    id_of_user: str
    name_of_user: str
    username_of_user: str
    comments: typing.List
    likes: typing.List
    ts_created: datetime.datetime
    text: str

class TweetCls:
    def __init__(self, id_of_user: str, name_of_user: str, username_of_user: str, text: str):
        self._id = uuid.uuid4()
        self.id_of_user = id_of_user
        self.name_of_user = name_of_user
        self.username_of_user = username_of_user
        self.comments = []
        self.likes = []
        self.ts_created = datetime.datetime.now()
        self.text = text