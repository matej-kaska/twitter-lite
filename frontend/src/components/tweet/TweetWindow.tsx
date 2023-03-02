import './TweetWindow.scss';
import { Link, useNavigate } from "react-router-dom";
import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { solid } from '@fortawesome/fontawesome-svg-core/import.macro';
import axios from 'axios';
import * as yup from 'yup'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import Tweet from '../timeline/Tweet';

interface iTweet {
  _id: string;
  id_of_user: string;
  name_of_user: string;
  username_of_user: string;
  comments: any[];
  likes: any[];
  ts_created: Date;
  text: string;
}

function TweetWindow() {

  const [tweet, setTweets] = useState<iTweet>();
  const [number_of_bunch, setNumberOfBunch] = useState(1);
  const [end, setEnd] = useState(false);
  const [tweetSubmitted, setTweetSubmitted] = useState(false);

  const reloadTweets = () => {
    axios.post("loadTweet",{
      number_of_bunch: number_of_bunch,
    })
    .then(response => {
      setEnd(false);
      setTweets(response.data);
        if (response.data.length < 10 * number_of_bunch) {
          setEnd(true);
        }
        setNumberOfBunch(prev => prev + 1);
    })
    .catch(error => {
        console.error(error);
    });
  };

  useEffect(() => {
    if (tweetSubmitted) {
      setNumberOfBunch(1);
      setTweetSubmitted(false);
    }
    reloadTweets();
  }, [tweetSubmitted]);

  const onTweetSubmit = () => {
    setTweetSubmitted(true);
  };

    return (
      <section className="tweet_window">
        <p></p>
          {tweet && <Tweet key={tweet._id} tweet={tweet} />}
        <p></p>
      </section>
    )
  }

  export default TweetWindow