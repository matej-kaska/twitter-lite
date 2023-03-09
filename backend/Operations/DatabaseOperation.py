import pymongo
from Models.UserModel import User
from Models.UserDataModel import UserData
from Models.TweetModel import Tweet
from Models.CommentModel import Comment
from Models.AnswerModel import Answer
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
    
    @classmethod
    def update_users_data_push(cls, user_id, key, value):
        user = User.parse_obj(cls.database.users.find_one({"_id": user_id}))
        cls.database.users_data.update_one({"_id": user.data_id}, {"$push": {key: value}})

    @classmethod
    def update_users_data_pull(cls, user_id, key, value):
        user = User.parse_obj(cls.database.users.find_one({"_id": user_id}))
        cls.database.users_data.update_one({"_id": user.data_id}, {"$pull": {key: value}})
    
    @classmethod
    def update_users_data_set(cls, user_id, key, value):
        user = User.parse_obj(cls.database.users.find_one({"_id": user_id}))
        cls.database.users_data.update_one({"_id": user.data_id}, {"$set": {key: value}})

    
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
    def load_bunch_from_tweets_own(cls, user_id, limiter):
        tweets = cls.database.tweets.find({"id_of_user": user_id}).sort("ts_created", -1).limit(10 * limiter)
        if tweets == None:
            return None
        tweets = list(tweets)
        bunch = []
        for tweet in tweets:
            bunch.append(Tweet.parse_obj(tweet))
        return bunch
    
    @classmethod
    def load_bunch_from_tweets_liked(cls, user_id, limiter):
        user = User.parse_obj(cls.database.users.find_one({"_id": user_id}))
        likes = cls.database.users_data.find_one({"_id": user.data_id})
        liked_ids = []
        for like in UserData.parse_obj(likes).liked:
            liked_ids.append(like)
        liked_tweets = []
        print(liked_ids)
        liked_ids = reversed(liked_ids)
        print(liked_ids)
        i = 0
        for liked_id in liked_ids:
            if i < 10 * limiter:
                tweet = cls.database.tweets.find_one({"_id": liked_id})
                liked_tweets.append(tweet)
                i = i +1
        if liked_tweets == None:
            return None
        bunch = []
        for tweet in liked_tweets:
            bunch.append(Tweet.parse_obj(tweet))
        return bunch

    @classmethod
    def update_tweet_push(cls, tweet_id, key, value):
        cls.database.tweets.update_one({"_id": tweet_id}, {"$push": {key: value}})

    @classmethod
    def update_tweet_pull(cls, tweet_id, key, value):
        cls.database.tweets.update_one({"_id": tweet_id}, {"$pull": {key: value}})

    #Collection Comments
    @classmethod
    def load_from_comments(cls, query):
        comment = cls.database.comments.find_one(query)
        if comment == None:
            return None
        return Comment.parse_obj(comment)
    
    @classmethod
    def save_to_comments(cls, comment):
        comment = jsonable_encoder(comment)
        cls.database.comments.insert_one(comment)

    @classmethod
    def update_comment_push(cls, comment_id, key, value):
        cls.database.comments.update_one({"_id": comment_id}, {"$push": {key: value}})

    @classmethod
    def update_comment_pull(cls, comment_id, key, value):
        cls.database.comments.update_one({"_id": comment_id}, {"$pull": {key: value}})

    #Collection Replies
    @classmethod
    def load_from_answers(cls, query):
        answer = cls.database.answers.find_one(query)
        if answer == None:
            return None
        return Answer.parse_obj(answer)
    
    @classmethod
    def save_to_answers(cls, answer):
        answer = jsonable_encoder(answer)
        cls.database.answers.insert_one(answer)

    @classmethod
    def update_answers_push(cls, answer_id, key, value):
        cls.database.answers.update_one({"_id": answer_id}, {"$push": {key: value}})

    @classmethod
    def update_answers_pull(cls, answer_id, key, value):
        cls.database.answers.update_one({"_id": answer_id}, {"$pull": {key: value}})