export interface iTweet {
  _id: string;
  id_of_user: string;
  name_of_user: string;
  username_of_user: string;
  comments: string[];
  likes: any[];
  ts_created: Date;
  text: string;
};

export interface iLikes {
  _id: string;
  name: string;
};

export interface iComment {
  _id: string;
  id_of_user: string;
  name_of_user: string;
  username_of_user: string;
  username_of_master: string;
  id_of_master: string;
  answers: string[];
  likes: any[];
  ts_created: Date;
  text: string;
};
  
export interface iReply {
  _id: string;
  id_of_user: string;
  name_of_user: string;
  username_of_user: string;
  username_of_master: string;
  id_of_master: string;
  id_of_comment: string;
  likes: any[];
  ts_created: Date;
  text: string;
};

export interface iTweetReply {
  _id: string;
  id_of_user: string;
  name_of_user: string;
  username_of_user: string;
  likes: any[];
  ts_created: Date;
  text: string;
};

export interface TweetProps {
  tweet: iTweet;
};

export interface ReplyProps {
  tweet: iTweetReply;
  handleModalReply: () => void;
  likeFromModal: () => void;
  reloadReplies: () => void;
};