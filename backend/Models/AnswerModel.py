from pydantic import BaseModel, Field
import uuid
import typing
import datetime
import pytz

tz = pytz.timezone('Europe/Prague')

class Answer(BaseModel):
    id: str = Field(..., alias='_id')
    id_of_user: str
    name_of_user: str
    username_of_user: str
    id_of_comment: str
    username_of_master: str
    id_of_master: str
    likes: typing.List
    ts_created: datetime.datetime
    text: str

class AnswerCls:
    def __init__(self, id_of_user: str, name_of_user: str, username_of_user: str, id_of_comment: str, username_of_master: str, id_of_master: str, text: str):
        self._id = str(uuid.uuid4())
        self.id_of_user = id_of_user
        self.name_of_user = name_of_user
        self.username_of_user = username_of_user
        self.id_of_comment = id_of_comment
        self.username_of_master = username_of_master
        self.id_of_master = id_of_master
        self.likes = []
        self.ts_created = datetime.datetime.now().replace(tzinfo=pytz.utc).astimezone(tz)
        self.text = text