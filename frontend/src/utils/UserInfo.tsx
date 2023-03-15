import axios from 'axios';

export interface UserData {
  id: string;
  username: string;
  name: string;
  role: string;
  bio: string;
  tweets: any[];
  comments: any[];
  replies: any[];
  following: any[];
  followers: any[];
  liked: any[];
  ts_created: Date;
  ts_edited: Date;
};

export interface UserInfo {
  id: string;
  email: string;
  password: string;
  data_id: string;
  data: UserData;
};

export const token = document.cookie.replace(
  /(?:(?:^|.*;\s*)access_token\s*\=\s*([^;]*).*$)|^.*$/,
  "$1"
);

export const fetchUserInfo = async (token: string) => {
  try {
      const response = await axios.get("/me", {
      headers: { Authorization: `Bearer ${token}` },
      withCredentials: true,
    });
    const data = response.data;
    return JSON.parse(JSON.stringify(data));
  } catch (error) {
    throw error;
  }
};