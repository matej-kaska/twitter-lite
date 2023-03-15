export interface iUser {
  user_id: string;
};

export interface iProfileData {
  _id: string;
  username: string;
  name: string;
  role: string;
  bio: string;
  tweets: string[];
  comments: string[];
  replies: string[];
  following: string[];
  followers: string[];
  liked: string[];
  ts_created: Date;
  ts_edited: Date;
};

export interface iFollowers {
  _id: string;
  name: string;
};