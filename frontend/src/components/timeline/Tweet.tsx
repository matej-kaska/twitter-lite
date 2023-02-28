import './Tweet.scss';
import { Link, useNavigate } from "react-router-dom";
import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { solid, regular } from '@fortawesome/fontawesome-svg-core/import.macro';

function Tweet() {
    return (
      <section className="tweet">
        <div className="box">
            <div className="wrapper-info">
                <h2>Matěj Kaška</h2>
                <h3>@matej.kaska  -  1h</h3>
            </div>
            <p>První tweet POGPrvní tweet POGPrvní tweet POGPrvní tweet POGPrvní tweet POGPrvní tweet POGPrvní tweet POGPrvní tweet POGPrvní tweet POGPrvní tweet POGPrvní tweet POGPrvní tweet POGPrvní tweet POGPrvní tweet POGPrvní tweet POGPrvní tweet POGPrvní tweet POGPrvní tweet POGPrvní tweet POGPrvní tweet POG</p>
            <div className="wrapper-buttons">
                <FontAwesomeIcon className="buttonSvg" icon={regular("comment")}/>
                <a>420</a>
                <FontAwesomeIcon className="buttonSvg" icon={regular("heart")}/>
                <a>69</a>
            </div>
        </div>
      </section>
    )
  }

  export default Tweet