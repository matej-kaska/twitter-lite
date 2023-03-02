import TweetWindow from '../components/tweet/TweetWindow';
import Navbar from '../components/navbar/Navbar';
import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { solid } from '@fortawesome/fontawesome-svg-core/import.macro';
import axios from 'axios';
import './Profile.scss';

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
  
  interface TweetProps {
    tweet: iTweet;
  }

function Tweet() {
    const [tweet, setTweet] = useState<iTweet[]>([]);
    const [number_of_bunch, setNumberOfBunch] = useState(1);
    const [end, setEnd] = useState(false);
    const [tweetSubmitted, setTweetSubmitted] = useState(false);

  const reloadTweets = () => {
    let tweet_id = window.location.pathname;
    tweet_id = tweet_id.substring(9);
    tweet_id = tweet_id.substring(0,tweet_id.length - 1);
    axios.post("loadTweet",{
      tweet_id: tweet_id,
    })
    .then(response => {
      setEnd(false);
      setTweet(response.data);
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
    <section className="window">
        <Navbar></Navbar>
        <div className="one_tweet">
            <TweetWindow></TweetWindow>
        </div>
    </section>
  )
}

export default Tweet