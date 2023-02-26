import './Navbar.scss';
import { Link, useNavigate } from "react-router-dom";
import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { solid, regular } from '@fortawesome/fontawesome-svg-core/import.macro';
import axios from 'axios';
import * as yup from 'yup'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'



function Navbar() {
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
      </section>
    )
  }

  export default Navbar