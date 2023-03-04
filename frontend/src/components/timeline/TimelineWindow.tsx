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
  _id: string;
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
  const [number_of_bunch, setNumberOfBunch] = useState(1);
  const [end, setEnd] = useState(false);
  const [tweetSubmitted, setTweetSubmitted] = useState(false);

  const reloadTweets = () => {
    axios.post("loadTweets",{
      number_of_bunch: number_of_bunch,
    })
    .then(response => {
      setEnd(false);
      setTweets(response.data);
        if (response.data.length < 10 * number_of_bunch) {
          setEnd(true);
        }
        setNumberOfBunch(number_of_bunch + 1);
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
      <section className="timeline_window">
        <p></p>
        <NewTweet onTweetSubmit={onTweetSubmit}></NewTweet>
        <p></p>
        {tweets.map(tweet => <Tweet key={tweet._id} tweet={tweet} />)}
        <p></p>
          {end ? (
            <>
            <div className="boxended">
              <h3>Došel si na konec!</h3>
            </div>
            </>
          ) : (
            <>
            <div onClick={reloadTweets} className="boxload">
              <h3>Načíst další</h3>
              <FontAwesomeIcon className="buttonSvg" icon={solid("angle-down")}/>
            </div>
            </>
          )}
      </section>
    )
  }

  export default TimelineWindow