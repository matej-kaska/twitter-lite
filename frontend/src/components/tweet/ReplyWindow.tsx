import './ReplyWindow.scss';
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
  likes: any[];
  ts_created: Date;
  text: string;
}

interface TweetProps {
  tweet: iTweet;
  handleModalReply: () => void;
  likeFromModal: () => void;
}

interface iLikes {
  _id: string;
  name: string;
}

function Tweet(props: TweetProps) {
    const [likesList, setLikesList] = useState<iLikes[]>([]);
    const tweetTimestamp = moment(props.tweet.ts_created);
    const now = moment();
    const duration = moment.duration(now.diff(tweetTimestamp));
    const [likeCount, setLikeCount] = useState(props.tweet.likes.length);
    const [liked, setLiked] = useState(false);
    const id_of_user = localStorage.getItem("id_of_user")
    const navigate = useNavigate();
    const location = useLocation();
    const [isLikesOpen, setIsLikesOpen] = useState(false);
    const [isOpen, setIsOpen] = useState(true);

    type Form = {
      liked_tweet: string;
      user: string;
      apiError: string
    }

    type Reply = {
        reply: string;
        apiError: string
    }

    const formSchema = yup.object().shape({
        reply: yup.string().required().min(1),
    })

    const handleIsOpen = () => {
        setIsOpen(!isOpen);
        props.handleModalReply();
    }

    const addReply = (data: Reply) => {
        axios.post("../addReply",{
            comment_id: props.tweet._id,
            id_of_user: id_of_user,
            text: data.reply,
          })
          .then(response => {
            handleIsOpen()
          })
          .catch(error => {
              console.error(error);
          });
    }

    const HandleProfile = (id_of_profile: string) => {
      if (location.pathname !== '/profile/' + id_of_profile) {
        navigate("/profile/" + id_of_profile);
      }
      window.location.reload();
    }

    const handleModalLikes = () => {
      if(isLikesOpen == true){
          setIsLikesOpen(false);
      } else {
          setIsLikesOpen(true);
      }
    }

    useEffect(() => {
        if (props.tweet.likes.includes(id_of_user)) {
            setLiked(true);
        } else {
            setLiked(false);
        }
    }, [])

    useEffect(() => {
      axios.post("../loadLikes",{
        comment_id: props.tweet._id,
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

    const {setError, register, handleSubmit, formState: { errors } } = useForm<Reply>({ 
      resolver: yupResolver(formSchema)
    });



    const Like = () => {
      axios.post("/like",{
        liked_comment: props.tweet._id,
        user: id_of_user,
      })
      .then(() => {
        props.likeFromModal();
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
  
    return isOpen ? (
      <section className="tweet">
        <div className="modal-container">
            <div className="modal">
                    <div className="top-bar">
                        <button onClick={handleIsOpen} className="X" ><FontAwesomeIcon icon={solid("x")}/></button>
                    </div>
                    <div className="box">
                        <div onClick={() => HandleProfile(props.tweet.id_of_user)} className="wrapper-info">
                            <h2>{props.tweet.name_of_user}</h2>
                            <h3>{props.tweet.username_of_user}  -  {timeAgo}</h3>
                        </div>
                        <p>{props.tweet.text}</p>
                        <div className="wrapper-buttons">
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
                    <form onSubmit={handleSubmit(addReply)}>
                    <div className="wrapper-text">
                        <textarea {...register("reply")} placeholder="Napište odpověď..."></textarea>
                        <button>Odpovědět</button>
                    </div>
                </form>
            </div>
        </div>
        {isLikesOpen && likesList && (
                    <div className="modal-container">
                        <div className="modal likes">
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
    ): null;
  }

  export default Tweet