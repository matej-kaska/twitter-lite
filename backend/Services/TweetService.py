from fastapi import APIRouter, Request, Response
from fastapi.responses import JSONResponse
from Operations.DatabaseOperation import DatabaseOperation
from Models.TweetModel import TweetCls, Tweet
from Models.UserDataModel import UserDataCls, UserData
from typing import Dict
from GlobalConstants import SECRET
from jose import jwt
import json

router = APIRouter()

@router.post("/loadTweets")
def loadTweets(data: Dict):
    number_of_bunch = data.get("number_of_bunch")
    print(number_of_bunch)
    return DatabaseOperation.load_bunch_from_tweets(number_of_bunch)

@router.post("/addTweet")
def addTweet(request: Request, data: Dict):
    try:
        text = data.get("tweet")
        access_token = request.cookies.get("access_token")
        decoded_token = jwt.decode(access_token, SECRET, algorithms=["HS256"])
        id = decoded_token['id']
        user = DatabaseOperation.load_from_users({"_id": id})
        user_data = DatabaseOperation.load_from_users_data({"_id": user.data_id})
        tweet = TweetCls(id, user_data.name, user_data.username, text)
        DatabaseOperation.save_to_tweets(tweet)
        return JSONResponse(status_code=201, content={"message": "The tweet was successfully posted!"})
    except Exception as e:
        print(e)
        return JSONResponse(status_code=400, content={"error_message": "Something went wrong!"})