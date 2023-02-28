import pymongo
from Models.UserModel import User
from Models.UserDataModel import UserData
from fastapi.encoders import jsonable_encoder

class DatabaseOperation:
    @classmethod
    def initialize(cls):
        client = pymongo.MongoClient("mongodb://admin:admin@mongo-db:27017")
        cls.database = client.twitterlite
	
    # Collection users
    @classmethod
    def save_to_users(cls, user):
        user = jsonable_encoder(user)
        cls.database.users.insert_one(user)

    @classmethod
    def load_from_users(cls, query):
        user = cls.database.users.find_one(query)
        if user == None:
            return None
        return User.parse_obj(user)
    
    # Collection users_data
    @classmethod
    def save_to_users_data(cls, user_data):
        user_data = jsonable_encoder(user_data)
        cls.database.users_data.insert_one(user_data)

    @classmethod
    def load_from_users_data(cls, query):
        user_data = cls.database.users_data.find_one(query)
        if user_data == None:
            return None
        return UserData.parse_obj(user_data)
