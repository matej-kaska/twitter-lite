from pydantic import BaseModel, Field
from uuid import uuid4
from werkzeug.security import generate_password_hash
from typing import List, Union
from datetime import datetime
import pytz

tz = pytz.timezone('Europe/Prague')

class User(BaseModel):
    id: str = Field(..., alias='_id')
    email: str
    password: str
    data_id: str

class UserCls:
    def __init__(self, email: str, password: str):
        self._id = uuid4()
        self.email = email
        self.password = generate_password_hash(password, method="sha256")
        self.data_id = uuid4()

class UserData(BaseModel):
    _id: str = Field(..., alias='_id')
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

class FullUser(BaseModel):
    id: str 
    email: str
    password: str
    data_id: str
    data: Union[UserData, None] = None