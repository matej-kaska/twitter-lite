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
import Reply from './Reply';
import ReplyWindow from './ReplyWindow';
  
interface iComment {
_id: string;
id_of_user: string;
name_of_user: string;
username_of_user: string;
username_of_master: string;
id_of_master: string;
answers: any[];
likes: any[];
ts_created: Date;
text: string;
}

interface iReply {
  _id: string;
  id_of_user: string;
  name_of_user: string;
  username_of_user: string;
  username_of_master: string;
  id_of_master: string;
  id_of_comment: string;
  likes: any[];
  ts_created: Date;
  text: string;
  }

interface iLikes {
    _id: string;
    name: string;
  }

function Comment(props: {comment: iComment, likeCheckFunction: () => void}) {
    const [likesList, setLikesList] = useState<iLikes[]>([]);
    const [tweet, setTweet] = useState<iComment>();
    const [replies, setReplies] = useState<iReply[]>([]);
    const [number_of_bunch, setNumberOfBunch] = useState(1);
    const [end, setEnd] = useState(false);
    const [tweetSubmitted, setTweetSubmitted] = useState(false);
    const tweetTimestamp = moment(props.comment.ts_created);
    const now = moment();
    const duration = moment.duration(now.diff(tweetTimestamp));
    const [likeCount, setLikeCount] = useState(0);
    const [liked, setLiked] = useState(false);
    const id_of_user = localStorage.getItem("id_of_user");
    const [isLikesOpen, setIsLikesOpen] = useState(false);
    const [isReplyOpen, setIsReplyOpen] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();
    
  
    const reloadTweets = () => {
      axios.post("../loadComment",{
        tweet_id: props.comment._id
      })
      .then(response => {
        setEnd(false);
        setTweet(response.data);
        
      })
      .catch(error => {
          console.error(error);
      });
    };

    const reloadReplies = () => {
      axios.post("../loadReplies",{
        comment_id: props.comment._id
      })
      .then(response => {
        setReplies(response.data);
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

    useEffect(() => {
      reloadReplies();
    }, [])

    
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
  
      const handleModalReply = () => {
        setIsReplyOpen(!isReplyOpen)
      }

      const handleModalLikes = () => {
        setIsLikesOpen(!isLikesOpen)
      }
  
      useEffect(() => {
        if (props.comment.likes.includes(id_of_user)) {
            setLiked(true);
        } else {
            setLiked(false);
        }
        if (props.comment){
            setLikeCount(props.comment.likes.length);
        }
      }, [props.comment.likes, id_of_user]);

      useEffect(() => {
        axios.post("../loadLikes",{
            comment_id: props.comment._id,
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
          timeAgo = `${Math.floor(duration.asDays())} dn??`;
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
          liked_comment: props.comment._id,
          user: id_of_user,
        })
        .then(() => {
          setLiked(liked => !liked);
          setLikeCount((prevCount) => (liked ? prevCount - 1 : prevCount + 1));
          props.likeCheckFunction();
        })
        .catch(err => {
          setError("apiError", {
            type: "server",
            message: "N??kde nastala chyba zkuste to znovu!",
          });
        })
      }

      const likeFromModal = () => {
        setLiked(liked => !liked);
        setLikeCount((prevCount) => (liked ? prevCount - 1 : prevCount + 1));
        props.likeCheckFunction();
      }

      

      const likeCheckFunctionReply = () => {
        reloadReplies();
      }

      useEffect(() => {
        const handleEscapeKeyPress = (event: KeyboardEvent) => {
          if (event.key === 'Escape') {
            setIsLikesOpen(false);
            setIsReplyOpen(false);
          }
        };
    
        window.addEventListener('keydown', handleEscapeKeyPress);
    
        return () => {
          window.removeEventListener('keydown', handleEscapeKeyPress);
        };
      }, []);
  
      return (
        <section className="commentsec">
            <div className="box comment">
            <div className="wrapper-info">
                <h2 onClick={() => HandleProfile(props.comment.id_of_user)}>{props.comment.name_of_user}</h2>
                <h3 onClick={() => HandleProfile(props.comment.id_of_user)}>{props.comment.username_of_user}  -  {timeAgo}</h3>
            </div>
            <div className="comment-info">
                Odpov???? u??ivateli&nbsp;<a onClick={() => HandleProfile(props.comment.id_of_master)}>@{props.comment.username_of_master}</a>
            </div>
            <p>{props.comment.text}</p>
            <div className="wrapper-buttons">
              <div className="button-comment">
                <FontAwesomeIcon onClick={() => handleModalReply()} className="buttonSvg aloneSvg" icon={regular("comment")}/>
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
              {replies.map(reply => <Reply key={reply._id} reply={reply} likeCheckFunctionReply={likeCheckFunctionReply} reloadReplies={reloadReplies}/>)}
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
                                <div>Tento koment???? se nikomu nel??b??</div> :
                            likesList.map(like => (
                                <div key={like._id} className="follower">
                                    <div onClick={() => HandleProfile(like._id)} className="follower-name">-&nbsp;{like.name}</div>
                                </div>
                            ))}
                            </div>
                        </div>
                    </div>
                )}
        {isReplyOpen && (
                    <ReplyWindow tweet={props.comment} reloadReplies={reloadReplies} handleModalReply={handleModalReply} likeFromModal={likeFromModal}></ReplyWindow>
                )}
        </section>
      )
    }
  
    export default Comment