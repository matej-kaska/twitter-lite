from pydantic import BaseModel, Field
import uuid
import typing
import datetime
import pytz

tz = pytz.timezone('Europe/Prague')

class Answer(BaseModel):
    id: str = Field(..., alias='_id')
    id_of_user: str
    id_of_comment: str
    likes: typing.List
    ts_created: datetime.datetime
    text: str

class CommentCls:
    def __init__(self, id_of_user: str, text: str, id_of_comment: str):
        self._id = uuid.uuid4()
        self.id_of_user = id_of_user
        self.id_of_comment = id_of_comment
        self.likes = []
        self.ts_created = datetime.datetime.now().replace(tzinfo=pytz.utc).astimezone(tz)
        self.text = text