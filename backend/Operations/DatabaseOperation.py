import pymongo
from Models.UserModel import User
from Models.UserDataModel import UserData
from Models.TweetModel import Tweet
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
    
    # Collection tweets
    @classmethod
    def save_to_tweets(cls, tweet):
        tweet = jsonable_encoder(tweet)
        cls.database.tweets.insert_one(tweet)

    @classmethod
    def load_from_tweets(cls, query):
        tweet = cls.database.tweets.find_one(query)
        if tweet == None:
            return None
        return Tweet.parse_obj(tweet)
    
    @classmethod
    def load_bunch_from_tweets(cls, limiter):
        tweets = cls.database.tweets.find().sort("ts_created", -1).limit(10 * limiter)
        if tweets == None:
            return None
        tweets = list(tweets)
        bunch = []
        for tweet in tweets:
            bunch.append(Tweet.parse_obj(tweet))
        return bunch
    
    @classmethod
    def update_tweet_push(cls, tweet_id, key, value):
        cls.database.tweets.update_one({"_id": tweet_id}, {"$push": {key: value}})

    @classmethod
    def update_tweet_pull(cls, tweet_id, key, value):
        cls.database.tweets.update_one({"_id": tweet_id}, {"$pull": {key: value}})
