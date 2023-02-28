import './Navbar.scss';
import { Link, useNavigate } from "react-router-dom";
import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { solid, regular } from '@fortawesome/fontawesome-svg-core/import.macro';
import axios from 'axios';
import * as yup from 'yup'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'

interface UserInfo {
  id: string;
  email: string;
  password: string;
  data_id: string;
}

function Navbar() {
  const navigate = useNavigate();
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);

  const token = document.cookie.replace(
      /(?:(?:^|.*;\s*)access_token\s*\=\s*([^;]*).*$)|^.*$/,
      "$1"
    );

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
    const fetchUserInfo = async () => {
      try {
          const response = await axios.get("/me", {
              headers: { Authorization: `Bearer ${token}` },
              withCredentials: true,
          });
        setUserInfo(JSON.parse(response.data));
      } catch (error) {
        console.error(error);
      }
      
    };

    fetchUserInfo();
  }, []);
  
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