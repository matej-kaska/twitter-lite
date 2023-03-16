import './ReplyWindow.scss';
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { solid, regular } from '@fortawesome/fontawesome-svg-core/import.macro';
import moment from 'moment';
import * as yup from 'yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import axios from 'axios';
import { ReplyProps, iLikes } from '../../interfaces/TweetInterface';
import TimeAgo from '../../utils/TimeAgo';
import { handleProfile } from '../../utils/handleProfile';

function Tweet(props: ReplyProps) {
  const [likesList, setLikesList] = useState<iLikes[]>([]);
  const now = moment();
  const duration = moment.duration(now.diff(moment(props.tweet.ts_created)));
  const [likeCount, setLikeCount] = useState(props.tweet.likes.length);
  const [liked, setLiked] = useState(false);
  const id_of_user = localStorage.getItem("id_of_user");
  const navigate = useNavigate();
  const [isLikesOpen, setIsLikesOpen] = useState(false);
  const [isOpen, setIsOpen] = useState(true);

  type ReplyForm = {
      reply: string;
      apiError: string;
  };

  const formSchema = yup.object().shape({
    reply: yup.string()
      .required()
      .min(1)
      .max(500, "Odpověď nesmí být delší než 500 znaků!")
  });

  const {setError, register, handleSubmit, formState: { errors } } = useForm<ReplyForm>({ 
    resolver: yupResolver(formSchema)
  });

  const addReply = (data: ReplyForm) => {
    axios.post("../api/addReply", {
      comment_id: props.tweet._id,
      id_of_user: id_of_user,
      text: data.reply
    })
    .then(() => {
      props.reloadReplies();
      handleIsOpen();
    })
    .catch(error => {
      console.error(error);
      setError('apiError', {
        type: "server",
        message: 'Někde nastala chyba, zkuste to znovu!'
      });
    });
  };

  const Like = () => {
    axios.post("/api/like", {
      liked_comment: props.tweet._id,
      user: id_of_user
    })
    .then(() => {
      props.likeFromModal();
      setLiked(liked => !liked);
      setLikeCount((prevCount) => (liked ? prevCount - 1 : prevCount + 1));
    })
    .catch(error => {
      console.error(error);
    });
  };

  const handleIsOpen = () => {
      setIsOpen(!isOpen);
      props.handleModalReply();
  };

  const handleModalLikes = () => {
    setIsLikesOpen(!isLikesOpen);
  };

  useEffect(() => {
    axios.post("../api/loadLikes", {
      comment_id: props.tweet._id
    })
    .then(response => {
      setLikesList(response.data);
    })
    .catch(error => {
      console.error(error);
    });
  }, [liked]);

  useEffect(() => {
    setLiked(false);
    if (props.tweet.likes.includes(id_of_user)) {
      setLiked(true);
    }
  }, []);

  return isOpen ? (
    <section className="modalwrap">
      <div className="modal-container">
        <div className="modal answer">
          <div className="top-bar">
            <button onClick={handleIsOpen} className="X"><FontAwesomeIcon icon={solid("x")}/></button>
          </div>
          <div className="box windowed">
            <div className="wrapper-info">
              <h2 onClick={() => handleProfile(props.tweet.id_of_user, navigate)}>{props.tweet.name_of_user}</h2>
              <h3 onClick={() => handleProfile(props.tweet.id_of_user, navigate)}>{props.tweet.username_of_user} - {TimeAgo(duration)}</h3>
            </div>
            <p>{props.tweet.text}</p>
            <div className="wrapper-buttons">
              <div className="button-like reply-win">
                {liked ? (
                  <FontAwesomeIcon className="buttonSvg red" onClick={Like} icon={solid("heart")}/>
                ) : (
                  <FontAwesomeIcon className="buttonSvg" onClick={Like} icon={regular("heart")}/>
                )}
                <a onClick={handleModalLikes}>{likeCount.toString()}</a>
              </div>
            </div>
          </div>
          <form onSubmit={handleSubmit(addReply)}>
            <div className="wrapper-text">
              <textarea {...register("reply")} placeholder="Napište odpověď..."></textarea>
              {errors.reply && <p className="error">{errors.reply?.message}</p>}
              {errors.apiError && <p className="error">{errors.apiError?.message}</p>}
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
  ) : null;
}

export default Tweet;