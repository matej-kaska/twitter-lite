from uvicorn import run
from fastapi import FastAPI
from Operations.DatabaseOperation import DatabaseOperation
from Services import UserService, TweetService, ProfileService

app = FastAPI()

#Database initialization
DatabaseOperation.initialize()

#Testing route
@app.get("/")
def home():
    return {"Hello": "World"}

#Importing routes
app.include_router(UserService.router)
app.include_router(TweetService.router)
app.include_router(ProfileService.router)

if __name__ == "__main__":
    run(app, host="0.0.0.0", port=5001)