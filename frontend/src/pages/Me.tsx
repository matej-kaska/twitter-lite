import { useState, useEffect } from "react";
import { fetchUserInfo, UserInfo, token } from "../utils/UserInfo";

function Info() {
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);

  useEffect(() => {
    const getUserInfo = async () => {
      try {
        const userInfo = await fetchUserInfo(token);
        setUserInfo(userInfo);
      } catch (error) {
        console.error(error);
      }
    };
    getUserInfo();
  }, [token]);

  if (!userInfo) {
    return <div>User is not logged in!</div>;
  }
  return <div>{JSON.stringify(userInfo)}</div>;
}

export default Info;