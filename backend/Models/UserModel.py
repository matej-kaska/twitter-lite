from pydantic import BaseModel, Field
import uuid
from bson import ObjectId
from werkzeug.security import generate_password_hash

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