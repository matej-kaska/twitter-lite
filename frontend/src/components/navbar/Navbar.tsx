import './Navbar.scss';
import { useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { solid } from '@fortawesome/fontawesome-svg-core/import.macro';
import axios from 'axios';
import { fetchUserInfo, UserInfo, token } from "../../utils/UserInfo";

function Navbar() {
  const navigate = useNavigate();
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const location = useLocation();
  const id_of_user = localStorage.getItem("id_of_user")

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

  const handleProfile = async () => {
    if (location.pathname === '/profile/' + id_of_user) {
      window.location.reload();
    } else {
      navigate("/profile/" + id_of_user);
    }
  };

  const handleHome = () => {
    if (location.pathname === '/') {
      window.location.reload();
    } else {
      navigate("/");
    }
  };
  
    return (
      <div className="navbar">
        <button onClick={handleHome} className="buttonhome">
            <FontAwesomeIcon className="buttonSvgHome" icon={solid("house")}/>
            <span className="home">Home</span>
        </button>
        <button onClick={handleProfile} className="buttonprofile">
            <FontAwesomeIcon className="buttonSvgProfile" icon={solid("user")}/>
            <span className="profile">Profil</span>
        </button>
        <div className="rightmenu">
            <span className="loggedin">Jste přihlášen jako: {localStorage.getItem("username")}</span>
            <button onClick={handleLogout} className="logout">Odhlásit se</button>
        </div>
      </div>
    )
  }

  export default Navbar