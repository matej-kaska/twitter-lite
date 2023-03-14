from Models.UserDataModel import UserData
from pydantic import BaseModel, Field
from uuid import uuid4
from werkzeug.security import generate_password_hash
from typing import Union

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

class FullUser(BaseModel):
    id: str
    email: str
    password: str
    data_id: str
    data: Union[UserData, None] = None