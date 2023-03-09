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

@router.post("/follow")
async def follow(request: Request):
    data = await request.json()
    user_id = data.get("user_id")
    master_id = data.get("master_id")
    user = DatabaseOperation.load_from_users({"_id": user_id})
    user_data = DatabaseOperation.load_from_users_data({"_id": user.data_id})
    if master_id in user_data.followers:
        #unfollow
        DatabaseOperation.update_users_data_pull(user_id, "followers", master_id)
        DatabaseOperation.update_users_data_pull(master_id, "following", user_id)

        return
    else:
        #follow
        DatabaseOperation.update_users_data_push(user_id, "followers", master_id)
        DatabaseOperation.update_users_data_push(master_id, "following", user_id)
        return

@router.post("/loadFollowing")
async def loadFollowing(request: Request):
    data = await request.json()
    user_id = data.get("user_id")
    user = DatabaseOperation.load_from_users({"_id": user_id})
    user_data = DatabaseOperation.load_from_users_data({"_id": user.data_id})
    following = []
    for following_id in user_data.following:
        user_following = DatabaseOperation.load_from_users({"_id": following_id})
        user_data_following = DatabaseOperation.load_from_users_data({"_id": user_following.data_id})
        following.append({"_id": following_id, "name": user_data_following.name})
    print(following)
    return following

@router.post("/loadFollowers")
async def loadFollowers(request: Request):
    data = await request.json()
    user_id = data.get("user_id")
    user = DatabaseOperation.load_from_users({"_id": user_id})
    user_data = DatabaseOperation.load_from_users_data({"_id": user.data_id})
    followers = []
    for followers_id in user_data.followers:
        user_follower = DatabaseOperation.load_from_users({"_id": followers_id})
        user_data_follower = DatabaseOperation.load_from_users_data({"_id": user_follower.data_id})
        followers.append({"_id": followers_id, "name": user_data_follower.name})
    return followers

@router.post("/changeBio")
async def changeBio(request: Request):
    data = await request.json()
    text = data.get("text")
    user_id = data.get("user_id")
    DatabaseOperation.update_users_data_set(user_id, "bio", text)
