import './Comment.scss';
import { Link, useLocation, useNavigate } from "react-router-dom";
import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { solid, regular } from '@fortawesome/fontawesome-svg-core/import.macro';
import moment from 'moment';
import axios from 'axios';
import * as yup from 'yup'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import Tweet from '../timeline/Tweet';
  
interface iReply {
_id: string;
id_of_user: string;
name_of_user: string;
username_of_user: string;
username_of_master: string;
id_of_master: string;
likes: any[];
ts_created: Date;
text: string;
}

interface iLikes {
    _id: string;
    name: string;
  }

function Reply(props: {reply: iReply}) {
    const [likesList, setLikesList] = useState<iLikes[]>([]);
    const [tweet, setTweet] = useState<iReply>();
    const [number_of_bunch, setNumberOfBunch] = useState(1);
    const [end, setEnd] = useState(false);
    const [tweetSubmitted, setTweetSubmitted] = useState(false);
    const tweetTimestamp = moment(props.reply.ts_created);
    const now = moment();
    const duration = moment.duration(now.diff(tweetTimestamp));
    const [likeCount, setLikeCount] = useState(0);
    const [liked, setLiked] = useState(false);
    const id_of_user = localStorage.getItem("id_of_user");
    const [isLikesOpen, setIsLikesOpen] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();
    
  
    const reloadTweets = () => {
      axios.post("../loadReply",{
        reply_id: props.reply._id
      })
      .then(response => {
        setEnd(false);
        console.log(response.data)
        setTweet(response.data);
        
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
        if (props.reply.likes.includes(id_of_user)) {
            setLiked(true);
        } else {
            setLiked(false);
        }
        if (props.reply){
            setLikeCount(props.reply.likes.length);
        }
      }, [props.reply.likes, id_of_user]);

      useEffect(() => {
        axios.post("../loadLikes",{
            reply_id: props.reply._id,
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
        axios.post("../like",{
          liked_reply: props.reply._id,
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
        <section className="commentsec">
            <div className="box comment">
            <div onClick={() => HandleProfile(props.reply.id_of_user)} className="wrapper-info">
                <h2>{props.reply.name_of_user}</h2>
                <h3>{props.reply.username_of_user}  -  {timeAgo}</h3>
            </div>
            <div className="comment-info">
                Odpověď uživateli&nbsp;<a>@{props.reply.username_of_master}</a>
            </div>
            <p>{props.reply.text}</p>
            <div className="wrapper-buttons">
                <FontAwesomeIcon onClick={() => HandleTweet(props.reply._id)} className="buttonSvg" icon={regular("comment")}/>
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
        {isLikesOpen && likesList && (
                    <div className="modal-container">
                        <div className="modal">
                            <div className="top-bar">
                                Lajknuto:
                                <button onClick={handleModalLikes}>X</button>
                            </div>
                            <div className="follower-list">
                            {likesList.length === 0 ?
                                <div>Tento komentář se nikomu nelíbí</div> :
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
  
    export default Reply