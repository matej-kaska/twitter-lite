import './Navbar.scss';
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { solid } from '@fortawesome/fontawesome-svg-core/import.macro';
import axios from 'axios';
import { fetchUserInfo, UserInfo, token } from "../../utils/UserInfo";

function Navbar() {
  const navigate = useNavigate();
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);

  const handleLogout = async () => {
    try {
      await axios.post("/logout", null, {
        withCredentials: true,
      });
      navigate("/login");
    } catch (error) {
      console.error(error);
    }
  };

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
  
    return (
      <section className="navbar">
        <button className="buttonhome">
            <FontAwesomeIcon className="buttonSvgHome" icon={solid("house")}/>
            <span className="home">Home</span>
        </button>
        <button className="buttonprofile">
            <FontAwesomeIcon className="buttonSvgProfile" icon={solid("user")}/>
            <span className="profile">Profil</span>
        </button>
        <div className="rightmenu">
            <span className="loggedin">Jste přihlášen jako: {userInfo ? userInfo.email : '???'}</span>
            <button onClick={handleLogout} className="logout">Odhlásit se</button>
        </div>
      </section>
    )
  }

  export default Navbar