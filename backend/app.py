import os
import uvicorn
from fastapi import FastAPI
from Operations.DatabaseOperation import DatabaseOperation
from Services import UserService

basedir = os.path.abspath(os.path.dirname(__file__))

app = FastAPI()

DatabaseOperation.initialize()

@app.get("/")
def home():
    return {"Hello": "World"}

#Importing routes
app.include_router(UserService.router)

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=5001)



