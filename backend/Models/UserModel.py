from pydantic import BaseModel, Field
import uuid
from werkzeug.security import generate_password_hash
import typing
import datetime
import pytz

tz = pytz.timezone('Europe/Prague')

class User(BaseModel):
    id: str = Field(..., alias='_id')
    email: str
    password: str
    data_id: str

class UserCls:
    def __init__(self, email: str, password: str):
        self._id = uuid.uuid4()
        self.email = email
        self.password = generate_password_hash(password, method="sha256")
        self.data_id = uuid.uuid4()

class UserData(BaseModel):
    _id: str = Field(..., alias='_id')
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

class FullUser(BaseModel):
    id: str 
    email: str
    password: str
    data_id: str
    data: typing.Union[UserData, None] = None