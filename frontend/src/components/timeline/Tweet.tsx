import './Tweet.scss';
import { Link, useLocation, useNavigate } from "react-router-dom";
import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { solid, regular } from '@fortawesome/fontawesome-svg-core/import.macro';
import moment from 'moment';
import * as yup from 'yup'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import axios from 'axios';

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

interface iLikes {
  _id: string;
  name: string;
}

function Tweet({tweet} : TweetProps) {
    const [likesList, setLikesList] = useState<iLikes[]>([]);
    const tweetTimestamp = moment(tweet.ts_created);
    const now = moment();
    const duration = moment.duration(now.diff(tweetTimestamp));
    const [likeCount, setLikeCount] = useState(tweet.likes.length);
    const [liked, setLiked] = useState(false);
    const id_of_user = localStorage.getItem("id_of_user")
    const navigate = useNavigate();
    const location = useLocation();
    const [isLikesOpen, setIsLikesOpen] = useState(false);

    type Form = {
      liked_tweet: string;
      user: string;
      apiError: string
    }

    const formSchema = yup.object().shape({
      liked_tweet: yup.string().required(),
      user: yup.string().required(),
    })

    const HandleProfile = (id_of_profile: string) => {
      if (location.pathname !== '/profile/' + id_of_profile) {
        navigate("/profile/" + id_of_profile);
      }
      window.location.reload();
    }

    const HandleTweet = (id_of_tweet: string) => {
      if (location.pathname === '/tweet/' + id_of_tweet) {
        window.location.reload();
      } else {
        navigate("/tweet/" + id_of_tweet);
      }
    }

    const handleModalLikes = () => {
      if(isLikesOpen == true){
          setIsLikesOpen(false);
      } else {
          setIsLikesOpen(true);
      }
  }

    useEffect(() => {
      if (tweet.likes.includes(id_of_user)) {
          setLiked(true);
      } else {
          setLiked(false);
      }
    }, [tweet.likes, id_of_user]);

    useEffect(() => {
      axios.post("../loadLikes",{
        tweet_id: tweet._id,
      })
      .then(response => {
          setLikesList(response.data)
      })
      .catch(error => {
          console.error(error);
      });
    }, [liked])

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

    const {setError, register, handleSubmit, formState: { errors } } = useForm<Form>({ 
      resolver: yupResolver(formSchema)
    });

    const Like = () => {
      axios.post("/like",{
        liked_tweet: tweet._id,
        user: id_of_user,
      })
      .then(() => {
        setLiked(liked => !liked);
        setLikeCount((prevCount) => (liked ? prevCount - 1 : prevCount + 1));
      })
      .catch(err => {
        setError("apiError", {
          type: "server",
          message: "Někde nastala chyba zkuste to znovu!",
        });
      })
    }
  
    return (
      <section className="tweet">
        <div className="box">
            <div onClick={() => HandleProfile(tweet.id_of_user)} className="wrapper-info">
                <h2>{tweet.name_of_user}</h2>
                <h3>{tweet.username_of_user}  -  {timeAgo}</h3>
            </div>
            <p>{tweet.text}</p>
            <div className="wrapper-buttons">
              <div className="button-comment">
                <FontAwesomeIcon onClick={() => HandleTweet(tweet._id)} className="buttonSvg" icon={regular("comment")}/>
                <a className="unclickable">{tweet.comments.length.toString()}</a>
              </div>
              <div className="button-like">
                {liked ? (
                  <>
                  <FontAwesomeIcon className="buttonSvg red" onClick={Like} icon={solid("heart")}/>
                  </>
                ) : (
                  <>
                  <FontAwesomeIcon className="buttonSvg" onClick={Like} icon={regular("heart")}/>
                  </>
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
                            {likesList.length === 0 ?
                                <div>Tento tweet se nikomu nelíbí</div> :
                            likesList.map(like => (
                                <div key={like._id} className="follower">
                                    <div onClick={() => HandleProfile(like._id)} className="follower-name">-&nbsp;{like.name}</div>
                                </div>
                            ))}
                            </div>
                        </div>
                    </div>
                )}
      </section>
    )
  }

  export default Tweet