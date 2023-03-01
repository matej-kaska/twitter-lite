from pydantic import BaseModel, Field
import uuid
import typing
import datetime

class Comment(BaseModel):
    id: str = Field(..., alias='_id')
    id_of_user: str
    answers: typing.List
    likes: typing.List
    ts_created: datetime.datetime
    text: str

class CommentCls:
    def __init__(self, id_of_user: str, text: str):
        self._id = uuid.uuid4()
        self.id_of_user = id_of_user
        self.answers = []
        self.likes = []
        self.ts_created = datetime.datetime.now()
        self.text = text