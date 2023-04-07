import './TimelineWindow.scss';
import { useState, useEffect } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { solid } from '@fortawesome/fontawesome-svg-core/import.macro';
import axios from 'axios';
import NewTweet from './NewTweet';
import Tweet from './Tweet';
import { iTweet } from '../../interfaces/TweetInterface';

function TimelineWindow() {
  const [tweets, setTweets] = useState<iTweet[]>([]);
  const [number_of_bunch, setNumberOfBunch] = useState(1);
  const [end, setEnd] = useState(false);
  const [tweetSubmitted, setTweetSubmitted] = useState(false);

  const reloadTweets = () => {
    axios.post("loadTweets", {
      number_of_bunch: number_of_bunch
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

  const onTweetSubmit = () => {
    setTweetSubmitted(true);
  };

  useEffect(() => {
    if (tweetSubmitted) {
      setNumberOfBunch(1);
      setTweetSubmitted(false);
    }
    reloadTweets();
  }, [tweetSubmitted]);

  return (
    <section className="timeline_window">
      <NewTweet onTweetSubmit={onTweetSubmit}></NewTweet>
      {tweets.map((tweet) => (<Tweet key={tweet._id} tweet={tweet}/>))}
      <p></p>
      {end ? (
        <div className="boxended">
          <h3>You have come to the end!</h3>
        </div>
      ) : (
        <div onClick={reloadTweets} className="boxload">
          <h3>Load more</h3>
          <FontAwesomeIcon className="buttonSvg" icon={solid("angle-down")}/>
        </div>
      )}
  </section>
  );
}

export default TimelineWindow;