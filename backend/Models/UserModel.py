from pydantic import BaseModel
import uuid
from werkzeug.security import generate_password_hash

class User(BaseModel):
    _id: uuid.UUID
    email: str
    password: str
    data_id: uuid.UUID

class UserCls:
    def __init__(self, email: str, password: str):
        self._id = uuid.uuid4()
        self.email = email
        self.password = generate_password_hash(password, method="sha256")
        self.data_id = uuid.uuid4()