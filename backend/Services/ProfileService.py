from fastapi import APIRouter, Request
from fastapi.responses import JSONResponse
from Operations.DatabaseOperation import DatabaseOperation

router = APIRouter()

@router.post("/loadProfile")
async def loadProfile(request: Request):
    try:
        data = await request.json()
        user_id = data.get("user_id")
        user = DatabaseOperation.load_from_users({"_id": user_id})
        return DatabaseOperation.load_from_users_data({"_id": user.data_id})
    except Exception as e:
        print(e)
        return JSONResponse(status_code=400, content={"error_message": "Something went wrong!"})

@router.post("/loadTweetsUser")
async def loadTweetsUser(request: Request):
    try:
        data = await request.json()
        user_id = data.get("user_id")
        number_of_bunch = data.get("number_of_bunch")
        return DatabaseOperation.load_bunch_from_tweets_own(user_id, number_of_bunch)
    except Exception as e:
        print(e)
        return JSONResponse(status_code=400, content={"error_message": "Something went wrong!"})

@router.post("/loadLikesUser")
async def loadLikesUser(request: Request):
    try:
        data = await request.json()
        user_id = data.get("user_id")
        number_of_bunch = data.get("number_of_bunch")
        return DatabaseOperation.load_bunch_from_tweets_liked(user_id, number_of_bunch)
    except Exception as e:
        print(e)
        return JSONResponse(status_code=400, content={"error_message": "Something went wrong!"})

@router.post("/follow")
async def follow(request: Request):
    try:
        data = await request.json()
        user_id = data.get("user_id")
        master_id = data.get("master_id")
        user = DatabaseOperation.load_from_users({"_id": user_id})
        user_data = DatabaseOperation.load_from_users_data({"_id": user.data_id})
        if master_id in user_data.followers:
            DatabaseOperation.update_users_data_pull(user_id, "followers", master_id)
            DatabaseOperation.update_users_data_pull(master_id, "following", user_id)
            return JSONResponse(status_code=201, content={"message": "The user was successfully unfollowed!"})
        else:
            DatabaseOperation.update_users_data_push(user_id, "followers", master_id)
            DatabaseOperation.update_users_data_push(master_id, "following", user_id)
            return JSONResponse(status_code=201, content={"message": "The user was successfully followed!"})
    except Exception as e:
        print(e)
        return JSONResponse(status_code=400, content={"error_message": "Something went wrong!"})

@router.post("/loadFollowing")
async def loadFollowing(request: Request):
    try:
        data = await request.json()
        user_id = data.get("user_id")
        user = DatabaseOperation.load_from_users({"_id": user_id})
        user_data = DatabaseOperation.load_from_users_data({"_id": user.data_id})
        following = []
        for following_id in user_data.following:
            user_following = DatabaseOperation.load_from_users({"_id": following_id})
            user_data_following = DatabaseOperation.load_from_users_data({"_id": user_following.data_id})
            following.append({"_id": following_id, "name": user_data_following.name})
        return following
    except Exception as e:
        print(e)
        return JSONResponse(status_code=400, content={"error_message": "Something went wrong!"})

@router.post("/loadFollowers")
async def loadFollowers(request: Request):
    try:
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
    except Exception as e:
        print(e)
        return JSONResponse(status_code=400, content={"error_message": "Something went wrong!"})

@router.post("/changeBio")
async def changeBio(request: Request):
    try:
        data = await request.json()
        text = data.get("text")
        user_id = data.get("user_id")
        DatabaseOperation.update_users_data_set(user_id, "bio", text)
        return JSONResponse(status_code=201, content={"message": "The bio was successfully changed!"})
    except Exception as e:
        print(e)
        return JSONResponse(status_code=400, content={"error_message": "Something went wrong!"})
