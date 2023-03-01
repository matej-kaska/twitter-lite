import './TimelineWindow.scss';
import { Link, useNavigate } from "react-router-dom";
import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { solid } from '@fortawesome/fontawesome-svg-core/import.macro';
import axios from 'axios';
import * as yup from 'yup'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import NewTweet from './NewTweet';
import Tweet from './Tweet';

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

function TimelineWindow() {

  const [tweets, setTweets] = useState<iTweet[]>([]);

  const reloadTweets = () => {
    axios.post("loadTweets",{
      number_of_bunch: 1,
    })
    .then(response => {
        setTweets(response.data);
    })
    .catch(error => {
        console.error(error);
    });
  };

  useEffect(() => {
    reloadTweets();
  }, []);

    return (
      <section className="timeline_window">
        <p></p>
        <NewTweet onTweetSubmit={reloadTweets}></NewTweet>
        <p></p>
        {tweets.map(tweet => <Tweet key={tweet.id} tweet={tweet} />)}
        <p></p>
        <div className="boxload">
          <h3>
            Načíst další
          </h3>
          <FontAwesomeIcon className="buttonSvg" icon={solid("angle-down")}/>
        </div>
      </section>
    )
  }

  export default TimelineWindow