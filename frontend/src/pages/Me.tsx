import { useState, useEffect } from "react";
import axios from "axios";

interface UserInfo {
  id: string;
  email: string;
  password: string;
  data_id: string;
}

function Info() {
    const [userInfo, setUserInfo] = useState<UserInfo | null>(null);

    const token = document.cookie.replace(
        /(?:(?:^|.*;\s*)access_token\s*\=\s*([^;]*).*$)|^.*$/,
        "$1"
      );
  
    useEffect(() => {
      const fetchUserInfo = async () => {
        try {
            const response = await axios.get("/me", {
                headers: { Authorization: `Bearer ${token}` },
                withCredentials: true,
            });
          setUserInfo(response.data);
        } catch (error) {
          console.error(error);
        }
      };
  
      fetchUserInfo();
    }, []);

  if (!userInfo) {
    return <div>Uživatel není přihlášen!</div>;
  }

  return <div>{JSON.stringify(userInfo)}</div>;
}

export default Info;