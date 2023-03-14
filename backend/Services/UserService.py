from fastapi import APIRouter, Request, Response
from fastapi.responses import JSONResponse
from Operations.DatabaseOperation import DatabaseOperation
from werkzeug.security import check_password_hash
from Models.UserModel import UserCls, User, FullUser
from Models.UserDataModel import UserDataCls, UserData
from typing import Dict
from GlobalConstants import SECRET
from jose import jwt
import json

router = APIRouter()

@router.post("/register")
def register(user: Dict):
    try:
        email = user.get("email")
        password = user.get("password")
        username = user.get("username")
        name = user.get("name")
        if email and password and username and name:
            if len(email) > 320:
                return JSONResponse(status_code=401, content={"error_message": "Email doesn't meet criteria!"})
            if len(password) < 7 or len(password) > 50:
                return JSONResponse(status_code=401, content={"error_message": "Password doesn't meet criteria!"})
            if len(username) < 5 or len(username) > 40:
                return JSONResponse(status_code=401, content={"error_message": "Username doesn't meet criteria!"})
            if len(name) > 50:
                return JSONResponse(status_code=401, content={"error_message": "Name doesn't meet criteria!"})
            if DatabaseOperation.load_from_users({"email": email}) == None:
                if DatabaseOperation.load_from_users_data({"username": username}) == None:
                    new_user = UserCls(email, password)
                    DatabaseOperation.save_to_users(new_user)
                    user_data = UserDataCls(new_user.data_id, username, name)
                    DatabaseOperation.save_to_users_data(user_data)
                    return JSONResponse(status_code=201, content={"message": "The user was successfully created!"})
                return JSONResponse(status_code=401, content={"error_message": "Username is already registred!"})
            return JSONResponse(status_code=401, content={"error_message": "Email is already registred!"})
        return JSONResponse(status_code=400, content={"error_message": "Missing details!"})
    except Exception as e:
        print(e)
        return JSONResponse(status_code=400, content={"error_message": "Something went wrong!"})

@router.post("/login")
def login(user: Dict, response: Response):
    try:
        email = user.get("email")
        password = user.get("password")
        loaded_user = DatabaseOperation.load_from_users({"email": email})
        if loaded_user != None:
            if check_password_hash(loaded_user.password, password):
                token = jwt.encode({"id": loaded_user.id}, SECRET, algorithm="HS256")
                response = JSONResponse(content={"message": "The user was successfully logged in!"})
                response.set_cookie(key="access_token", value=token)
                return response
        return JSONResponse(status_code=401, content={"error_message": "Incorrect email or password!"})
    except Exception as e:
        print(e)
        return JSONResponse(status_code=400, content={"error_message": "Something went wrong!"})

@router.post("/logout")
def logout():
    try:
        response = JSONResponse(content={"message": "Successfully logged out!"})
        response.set_cookie(key="access_token", value="", expires=0)
        return response
    except Exception as e:
        print(e)
        return JSONResponse(status_code=400, content={"error_message": "Something went wrong!"})

@router.get("/me")
def me(request: Request):
    access_token = request.cookies.get("access_token")
    if not access_token:
        return JSONResponse(status_code=401, content={"error_message": "User is not logged in!"})
    try:
        decoded_token = jwt.decode(access_token, SECRET, algorithms=["HS256"])
        id = decoded_token['id']
        user = DatabaseOperation.load_from_users({"_id": id})
        user_data = DatabaseOperation.load_from_users_data({"_id": user.data_id})
        user = User.json(user)
        user_data = UserData.json(user_data)
        json_user = json.loads(user)
        json_user_data = json.loads(user_data)
        data = {"data": json_user_data}
        json_user.update(data)
        return FullUser.parse_obj(json_user)
    except Exception as e:
        print(e)
        return JSONResponse(status_code=400, content={"error_message": "Something went wrong!"})

@router.get("/token")
def token(request: Request):
    access_token = request.cookies.get("access_token")
    if not access_token:
        return JSONResponse(status_code=401, content={"error_message": "User is not logged in!"})
    try:
        decoded_token = jwt.decode(access_token, SECRET, algorithms=["HS256"])
        id = decoded_token['id']
        user = DatabaseOperation.load_from_users({"_id": id})
        user_data = DatabaseOperation.load_from_users_data({"_id": user.data_id})
        return {"id": user.id, "username": user_data.username}
    except Exception as e:
        print(e)
        return JSONResponse(status_code=400, content={"error_message": "Something went wrong!"})