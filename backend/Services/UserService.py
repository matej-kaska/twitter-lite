from fastapi import APIRouter
from Operations.DatabaseOperation import DatabaseOperation
from werkzeug.security import check_password_hash
from Models.UserModel import User, UserCls
from Models.UserDataModel import UserData, UserDataCls
from typing import Dict

router = APIRouter()

@router.post("/register")
def register(user: Dict):
    email = user.get("email")
    password = user.get("password")
    username = user.get("username")
    name = user.get("name")
    if DatabaseOperation.load_from_users({"email": email}) == None:
        if DatabaseOperation.load_from_users_data({"username": username}) == None:
            new_user = UserCls(email, password)
            DatabaseOperation.save_to_users(new_user)
            user_data = UserDataCls(new_user.data_id, username, name) #username cannot be twice
            DatabaseOperation.save_to_users_data(user_data)
            return {"message": "The user was successfully created!"}
    #CATCH
    return {"error_message": "User already exists!"}
    
    try:
        if DatabaseOperation.load_from_users({"email": user.email}) == None:
            new_user = UserCls(user.email, user.password)
            DatabaseOperation.save_to_users(new_user)

            """ user_data = UserDataCls(new_user.data_id, user.username, user.name) #username
            DatabaseOperation.save_to_users_data(user_data) """

            return {"message": "The user was successfully created!"}
        else:
            return {"error_message": "User already exists!"}
    except Exception as e:
        print(e)
        return {"error_message": "Something went wrong!"}

@router.get("/login")
def login():
    ...

@router.get("/logout")
def logout():
    ...