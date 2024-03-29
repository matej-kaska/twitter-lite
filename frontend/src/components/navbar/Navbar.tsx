import './Navbar.scss';
import { useNavigate, useLocation } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { solid } from '@fortawesome/fontawesome-svg-core/import.macro';
import axios from 'axios';

function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const id_of_user = localStorage.getItem("id_of_user");

  const handleLogout = async () => {
    try {
      await axios.post("/logout", null, {
        withCredentials: true
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
        <FontAwesomeIcon className="buttonSvgHome" icon={solid("house")} />
        <span className="homeSpan">Home</span>
      </button>
      <button onClick={handleProfile} className="buttonprofile">
        <FontAwesomeIcon className="buttonSvgProfile" icon={solid("user")} />
        <span className="profileSpan">Profile</span>
      </button>
      <div className="rightmenu">
        <span className="loggedin">You are logged in as: {localStorage.getItem("username")}</span>
        <button onClick={handleLogout} className="logout">Logout</button>
      </div>
    </div>
  );
}

export default Navbar;