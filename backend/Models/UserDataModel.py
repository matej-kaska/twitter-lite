from pydantic import BaseModel, Field
from GlobalConstants import ROLES
import uuid
import typing
import datetime
import pytz

tz = pytz.timezone('Europe/Prague')

class UserData(BaseModel):
    id: str = Field(..., alias='_id')
    username: str
    name: str
    role: str
    bio: str
    tweets: typing.List
    comments: typing.List
    replies: typing.List
    following: typing.List
    followers: typing.List
    liked: typing.List
    ts_created: datetime.datetime
    ts_edited: datetime.datetime

class UserDataCls:
    def __init__(self, data_id: uuid.UUID, username: str, name: str):
        self._id = data_id
        self.username = username
        self.name = name
        self.role = ROLES[1]
        self.bio = "Vyplňte své bio!"
        self.tweets = []
        self.comments = []
        self.replies = []
        self.following = []
        self.followers = []
        self.liked = []
        self.ts_created = datetime.datetime.now().replace(tzinfo=pytz.utc).astimezone(tz)
        self.ts_edited = datetime.datetime.now().replace(tzinfo=pytz.utc).astimezone(tz)