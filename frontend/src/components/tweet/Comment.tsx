import './Comment.scss';
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { solid, regular } from '@fortawesome/fontawesome-svg-core/import.macro';
import moment from 'moment';
import axios from 'axios';
import Reply from './Reply';
import ReplyWindow from './ReplyWindow';
import { iComment, iReply, iLikes } from '../../interfaces/TweetInterface';
import TimeAgo from '../../utils/TimeAgo';
import useEscapeKeyHandler from '../../hooks/useEscapeKeyHandler';
import { handleProfile } from '../../utils/handleProfile';

function Comment(props: {comment: iComment, likeCheckFunction: () => void}) {
  const [likesList, setLikesList] = useState<iLikes[]>([]);
  const [replies, setReplies] = useState<iReply[]>([]);
  const now = moment();
  const duration = moment.duration(now.diff(props.comment.ts_created));
  const [likeCount, setLikeCount] = useState(0);
  const [liked, setLiked] = useState(false);
  const id_of_user = localStorage.getItem("id_of_user");
  const [isLikesOpen, setIsLikesOpen] = useState(false);
  const [isReplyOpen, setIsReplyOpen] = useState(false);
  const navigate = useNavigate();

  const reloadReplies = () => {
    axios.post("../api/loadReplies", {
      comment_id: props.comment._id
    })
    .then(response => {
      setReplies(response.data);
    })
    .catch(error => {
      console.error(error);
    });
  };

  const Like = () => {
    axios.post("../api/like", {
      liked_comment: props.comment._id,
      user: id_of_user
    })
    .then(() => {
      setLiked(liked => !liked);
      setLikeCount((prevCount) => (liked ? prevCount - 1 : prevCount + 1));
      props.likeCheckFunction();
    })
    .catch(error => {
      console.error(error);
    });
  };

  const likeFromModal = () => {
    setLiked(liked => !liked);
    setLikeCount((prevCount) => (liked ? prevCount - 1 : prevCount + 1));
    props.likeCheckFunction();
  };

  const likeCheckFunctionReply = () => {
    reloadReplies();
  };

  const handleModalReply = () => {
    setIsReplyOpen(!isReplyOpen);
  };

  const handleModalLikes = () => {
    axios.post("../api/loadLikes", {
      comment_id: props.comment._id
    })
    .then(response => {
      setLikesList(response.data);
    })
    .catch(error => {
      console.error(error);
    });
    setIsLikesOpen(!isLikesOpen);
  };

  useEffect(() => {
    reloadReplies();
  }, []);

  useEffect(() => {
    setLiked(false);
    if (props.comment.likes.includes(id_of_user)) {
      setLiked(true);
    }
    if (props.comment){
      setLikeCount(props.comment.likes.length);
    }
  }, [props.comment.likes]);

  useEscapeKeyHandler([
    { stateSetter: setIsReplyOpen, isOpen: isReplyOpen },
    { stateSetter: setIsLikesOpen, isOpen: isLikesOpen }
  ]);

  return (
    <section className="commentsec">
      <div className="box comment">
        <div className="wrapper-info">
          <h2 onClick={() => handleProfile(props.comment.id_of_user, navigate)}>{props.comment.name_of_user}</h2>
          <h3 onClick={() => handleProfile(props.comment.id_of_user, navigate)}>{props.comment.username_of_user} - {TimeAgo(duration)}</h3>
        </div>
        <div className="comment-info">
          Odpověď uživateli&nbsp;
          <a onClick={() => handleProfile(props.comment.id_of_master, navigate)}>@{props.comment.username_of_master}</a>
        </div>
        <p>{props.comment.text}</p>
        <div className="wrapper-buttons">
          <div className="button-comment"><FontAwesomeIcon onClick={() => handleModalReply()} className="buttonSvg aloneSvg" icon={regular("comment")}/></div>
          <div className="button-like">
            {liked ? (
              <FontAwesomeIcon className="buttonSvg red" onClick={Like} icon={solid("heart")}/>
            ) : (
              <FontAwesomeIcon className="buttonSvg" onClick={Like} icon={regular("heart")}/>
            )}
            <a onClick={handleModalLikes}>{likeCount.toString()}</a>
          </div>
        </div>
        {replies.map((reply) => (<Reply key={reply._id} reply={reply} likeCheckFunctionReply={likeCheckFunctionReply} reloadReplies={reloadReplies}/>))}
      </div>
      {isLikesOpen && likesList && (
        <div className="modal-container">
          <div className="modal">
            <div className="top-bar">
              Lajknuto:
              <button onClick={handleModalLikes}>X</button>
            </div>
            <div className="follower-list">
              {likesList.length === 0 ? (
                <div>Tento komentář se nikomu nelíbí</div>
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
      {isReplyOpen && (
        <ReplyWindow tweet={props.comment} reloadReplies={reloadReplies} handleModalReply={handleModalReply} likeFromModal={likeFromModal}></ReplyWindow>
      )}
    </section>
  );
}

export default Comment;