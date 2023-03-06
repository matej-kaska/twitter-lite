from fastapi import APIRouter, Request, Response
from fastapi.responses import JSONResponse
from Operations.DatabaseOperation import DatabaseOperation
from werkzeug.security import check_password_hash
from Models.UserDataModel import UserDataCls, UserData
from typing import Dict
import json

router = APIRouter()

@router.post("/loadProfile")
async def loadProfile(request: Request):
    data = await request.json()
    user_id = data.get("user_id")
    user = DatabaseOperation.load_from_users({"_id": user_id})
    return DatabaseOperation.load_from_users_data({"_id": user.data_id})

@router.post("/loadTweetsUser")
async def loadTweetsUser(request: Request):
    data = await request.json()
    user_id = data.get("user_id")
    number_of_bunch = data.get("number_of_bunch")
    return DatabaseOperation.load_bunch_from_tweets_own(user_id, number_of_bunch)

@router.post("/loadLikesUser")
async def loadLikesUser(request: Request):
    data = await request.json()
    user_id = data.get("user_id")
    number_of_bunch = data.get("number_of_bunch")
    return DatabaseOperation.load_bunch_from_tweets_liked(user_id, number_of_bunch)