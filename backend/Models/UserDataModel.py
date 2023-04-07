from GlobalConstants import ROLES
from pydantic import BaseModel, Field
from typing import List
from datetime import datetime
from pytz import timezone, utc

tz = timezone('Europe/Prague')

class UserData(BaseModel):
    id: str = Field(..., alias='_id')
    username: str
    name: str
    role: str
    bio: str
    tweets: List
    comments: List
    replies: List
    following: List
    followers: List
    liked: List
    ts_created: datetime
    ts_edited: datetime

class UserDataCls:
    def __init__(self, data_id: str, username: str, name: str):
        self._id = data_id
        self.username = username.lower()
        self.name = name
        self.role = ROLES[1]
        self.bio = "Change your bio!"
        self.tweets = []
        self.comments = []
        self.replies = []
        self.following = []
        self.followers = []
        self.liked = []
        self.ts_created = datetime.now().replace(tzinfo=utc).astimezone(tz)
        self.ts_edited = datetime.now().replace(tzinfo=utc).astimezone(tz)