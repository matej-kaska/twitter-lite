import './Tweet.scss';
import { Link, useNavigate } from "react-router-dom";
import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { solid, regular } from '@fortawesome/fontawesome-svg-core/import.macro';
import moment from 'moment';

interface iTweet {
  id: string;
  id_of_user: string;
  name_of_user: string;
  username_of_user: string;
  comments: any[];
  likes: any[];
  ts_created: Date;
  text: string;
}

interface TweetProps {
  tweet: iTweet;
}

function Tweet({tweet} : TweetProps) {
    const tweetTimestamp = moment(tweet.ts_created);
    const now = moment();
    const duration = moment.duration(now.diff(tweetTimestamp));

    let timeAgo = '';
    if (duration.asDays() > 1) {
      if (duration.asDays() < 2) {
        timeAgo = `${Math.floor(duration.asDays())} den`;
      } else if (duration.asDays() < 5) {
        timeAgo = `${Math.floor(duration.asDays())} dny`;
      } else {
        timeAgo = `${Math.floor(duration.asDays())} dnů`;
      }
    } else if (duration.asHours() > 1) {
      timeAgo = `${Math.floor(duration.asHours())} hod`;
    } else {
      timeAgo = `${Math.floor(duration.asMinutes())} min`;
    }
  
    return (
      <section className="tweet">
        <div className="box">
            <div className="wrapper-info">
                <h2>{tweet.name_of_user}</h2>
                <h3>{tweet.username_of_user}  -  {timeAgo}</h3>
            </div>
            <p>{tweet.text}</p>
            <div className="wrapper-buttons">
                <FontAwesomeIcon className="buttonSvg" icon={regular("comment")}/>
                <a>{tweet.comments.length.toString()}</a>
                <FontAwesomeIcon className="buttonSvg" icon={regular("heart")}/>
                <a>{tweet.likes.length.toString()}</a>
            </div>
        </div>
      </section>
    )
  }

  export default Tweet