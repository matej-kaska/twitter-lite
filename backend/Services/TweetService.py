from fastapi import APIRouter, Request, Response
from fastapi.responses import JSONResponse
from Operations.DatabaseOperation import DatabaseOperation
from Models.TweetModel import TweetCls, Tweet
from Models.UserDataModel import UserDataCls, UserData
from Models.CommentModel import CommentCls, Comment
from typing import Dict
from GlobalConstants import SECRET
from jose import jwt
import json

router = APIRouter()

@router.post("/loadTweets")
def loadTweets(data: Dict):
    number_of_bunch = data.get("number_of_bunch")
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
    
@router.post("/like")
async def like(request: Request):
    data = await request.json()
    tweet_id = data.get("liked_tweet")
    user = data.get("user")
    tweet = DatabaseOperation.load_from_tweets({"_id": tweet_id})
    if (user in tweet.likes):
        DatabaseOperation.update_tweet_pull(tweet_id, "likes", user)
        DatabaseOperation.update_users_data_pull(user, "liked", tweet_id)
        return JSONResponse(status_code=201, content={"message": "The tweet was successfully unliked!"})
    else:
        DatabaseOperation.update_tweet_push(tweet_id, "likes", user)
        DatabaseOperation.update_users_data_push(user, "liked", tweet_id)
        return JSONResponse(status_code=201, content={"message": "The tweet was successfully liked!"})
    
@router.post("/loadTweet")
async def loadTweet(request: Request):
    data = await request.json()
    tweet_id = data.get("tweet_id")
    return DatabaseOperation.load_from_tweets({"_id": tweet_id})

@router.post("/loadComments")
async def loadTweet(request: Request):
    data = await request.json()
    tweet_id = data.get("tweet_id")
    tweet = DatabaseOperation.load_from_tweets({"_id": tweet_id})
    comments = []
    for comment_id in tweet.comments:
        comments.append(DatabaseOperation.load_from_comments({"_id": comment_id}))
    print(comments)
    return comments

@router.post("/addComment")
async def addComments(request: Request):
    data = await request.json()
    tweet_id = data.get("tweet_id")
    id_of_user = data.get("id_of_user")
    text = data.get("text")
    tweet = DatabaseOperation.load_from_tweets({"_id": tweet_id})
    user = DatabaseOperation.load_from_users({"_id": id_of_user})
    user_data = DatabaseOperation.load_from_users_data({"_id": user.data_id})
    new_comment = CommentCls(id_of_user, user_data.name, user_data.username, text, tweet.username_of_user, tweet.id_of_user)
    DatabaseOperation.save_to_comments(new_comment)
    DatabaseOperation.update_users_data_push(id_of_user, "comments", new_comment._id)
    DatabaseOperation.update_tweet_push(tweet_id, "comments", new_comment._id)
    return JSONResponse(status_code=201, content={"message": "The comment was successfully posted!"})