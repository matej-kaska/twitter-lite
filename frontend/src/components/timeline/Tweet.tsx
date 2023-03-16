import './Tweet.scss';
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { solid, regular } from '@fortawesome/fontawesome-svg-core/import.macro';
import moment from 'moment';
import axios from 'axios';
import { TweetProps, iLikes } from '../../interfaces/TweetInterface';
import TimeAgo from '../../utils/TimeAgo';
import useEscapeKeyHandler from '../../hooks/useEscapeKeyHandler';
import { handleProfile } from '../../utils/handleProfile';
import { handleTweet } from '../../utils/handleTweet';

function Tweet({tweet}: TweetProps) {
  const [likesList, setLikesList] = useState<iLikes[]>([]);
  const tweetTimestamp = moment(tweet.ts_created);
  const now = moment();
  const duration = moment.duration(now.diff(tweetTimestamp));
  const [likeCount, setLikeCount] = useState(tweet.likes.length);
  const [liked, setLiked] = useState(false);
  const id_of_user = localStorage.getItem("id_of_user");
  const navigate = useNavigate();
  const [isLikesOpen, setIsLikesOpen] = useState(false);

  const Like = () => {
    axios.post("/api/like", {
      liked_tweet: tweet._id,
      user: id_of_user
    })
    .then(() => {
      setLiked(liked => !liked);
      setLikeCount((prevCount) => (liked ? prevCount - 1 : prevCount + 1));
    })
    .catch(error => {
      console.error(error);
    });
  };

  const handleModalLikes = () => {
    setIsLikesOpen(!isLikesOpen);
  };

  useEffect(() => {
    setLiked(false);
    if (tweet.likes.includes(id_of_user)) {
      setLiked(true);
    }
  }, [tweet.likes]);

  useEffect(() => {
    axios.post("../api/loadLikes", {
      tweet_id: tweet._id
    })
    .then(response => {
        setLikesList(response.data);
    })
    .catch(error => {
        console.error(error);
    });
  }, [liked]);

  useEscapeKeyHandler([
    { stateSetter: setIsLikesOpen, isOpen: isLikesOpen }
  ]);

  return (
    <section className="tweet">
      <div className="box">
        <div className="wrapper-info">
          <h2 onClick={() => handleProfile(tweet.id_of_user, navigate)}>{tweet.name_of_user}</h2>
          <h3 onClick={() => handleProfile(tweet.id_of_user, navigate)}>{tweet.username_of_user} - {TimeAgo(duration)}</h3>
        </div>
        <p>{tweet.text}</p>
        <div className="wrapper-buttons">
          <div className="button-comment"><FontAwesomeIcon onClick={() => handleTweet(tweet._id, navigate)} className="buttonSvg" icon={regular("comment")}/>
            <a className="unclickable">{tweet.comments.length.toString()}</a>
          </div>
          <div className="button-like">
            {liked ? (
              <FontAwesomeIcon className="buttonSvg red" onClick={Like} icon={solid("heart")}/>
            ) : (
              <FontAwesomeIcon className="buttonSvg" onClick={Like} icon={regular("heart")}/>
            )}
            <a onClick={handleModalLikes}>{likeCount.toString()}</a>
          </div>
        </div>
      </div>
      {isLikesOpen && likesList && (
        <div className="modal-container">
          <div className="modal">
            <div className="top-bar">
              Lajknuto:
              <button onClick={handleModalLikes}><FontAwesomeIcon icon={solid("x")}/></button>
            </div>
            <div className="follower-list">
              {likesList.length === 0 ? (
                <div>Tento tweet se nikomu nelíbí</div>
              ) : (
                likesList.map((like) => (
                  <div key={like._id} className="follower">
                    <div onClick={() => handleProfile(like._id, navigate)} className="follower-name">-&nbsp;{like.name}</div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

export default Tweet;