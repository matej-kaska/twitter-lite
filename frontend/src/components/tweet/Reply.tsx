import './Reply.scss';
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { solid, regular } from '@fortawesome/fontawesome-svg-core/import.macro';
import moment from 'moment';
import axios from 'axios';
import ReplyWindow from './ReplyWindow';
import { iReply, iLikes } from '../../interfaces/TweetInterface';
import TimeAgo from '../../utils/TimeAgo';
import useEscapeKeyHandler from '../../hooks/useEscapeKeyHandler';
import { handleProfile } from '../../utils/handleProfile';

function Reply(props: {reply: iReply, likeCheckFunctionReply: () => void, reloadReplies: () => void}) {
  const [likesList, setLikesList] = useState<iLikes[]>([]);
  const now = moment();
  const duration = moment.duration(now.diff(moment(props.reply.ts_created)));
  const [likeCount, setLikeCount] = useState(0);
  const [liked, setLiked] = useState(false);
  const id_of_user = localStorage.getItem("id_of_user");
  const [isLikesOpen, setIsLikesOpen] = useState(false);
  const [isReplyOpen, setIsReplyOpen] = useState(false);
  const navigate = useNavigate();

  const Like = () => {
    axios.post("../api/like", {
      liked_comment: props.reply._id,
      user: id_of_user
    })
    .then(() => {
      setLiked(liked => !liked);
      setLikeCount((prevCount) => (liked ? prevCount - 1 : prevCount + 1));
      props.likeCheckFunctionReply();
    })
    .catch(error => {
      console.error(error);
    });
  };

  const likeFromModal = () => {
    setLiked(liked => !liked);
    setLikeCount((prevCount) => (liked ? prevCount - 1 : prevCount + 1));
    props.likeCheckFunctionReply();
  };

  const handleModalReply = () => {
    setIsReplyOpen(!isReplyOpen);
  };

  const handleModalLikes = () => {
    axios.post("../api/loadLikes", {
      comment_id: props.reply._id
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
    setLiked(false);
    if (props.reply.likes.includes(id_of_user)) {
      setLiked(true);
    }
    if (props.reply){
        setLikeCount(props.reply.likes.length);
    }
  }, [props.reply.likes, id_of_user]);

  useEscapeKeyHandler([
    { stateSetter: setIsReplyOpen, isOpen: isReplyOpen },
    { stateSetter: setIsLikesOpen, isOpen: isLikesOpen }
  ]);

  return (
    <section className="replysec">
      <div className="box reply">
        <div className="wrapper-info">
          <h2 onClick={() => handleProfile(props.reply.id_of_user, navigate)}>{props.reply.name_of_user}</h2>
          <h3 onClick={() => handleProfile(props.reply.id_of_user, navigate)}>{props.reply.username_of_user} - {TimeAgo(duration)}</h3>
        </div>
        <div className="comment-info">
          Odpověď uživateli&nbsp;
          <a onClick={() => handleProfile(props.reply.id_of_master, navigate)}>@{props.reply.username_of_master}</a>
        </div>
        <p>{props.reply.text}</p>
        <div className="wrapper-buttons">
          <div className="button-comment">
            <FontAwesomeIcon onClick={() => handleModalReply()} className="buttonSvg" icon={regular("comment")}/>
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
                <div>Tento komentář se nikomu nelíbí</div>
              ) : (
                likesList.map((like) => (
                  <div key={like._id} className="follower">
                    <div onClick={() => handleProfile(like._id, navigate)} className="follower-name" >-&nbsp;{like.name}</div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}
      {isReplyOpen && (
        <ReplyWindow tweet={props.reply} reloadReplies={props.reloadReplies} handleModalReply={handleModalReply} likeFromModal={likeFromModal}></ReplyWindow>
      )}
    </section>
  );
}

export default Reply;