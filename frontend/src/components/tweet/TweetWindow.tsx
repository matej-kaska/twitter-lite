import './TweetWindow.scss';
import { useState, useEffect } from "react";
import axios from 'axios';
import * as yup from 'yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import Tweet from '../timeline/Tweet';
import Comment from './Comment';
import { iComment, iTweet } from '../../interfaces/TweetInterface';

function TweetWindow(props: {tweet_id: string}) {
  const [comment, setComment] = useState<iComment[]>([]);
  const [tweet, setTweet] = useState<iTweet>();
  const [commentSubmitted, setCommentSubmitted] = useState(false);
  const id_of_user = localStorage.getItem("id_of_user");
  const [commentValue, setCommentValue] = useState('');
  const [likeCheck, setLikeCheck] = useState(false);

  type CommentForm = {
    comment: string;
    apiError: string;
  };
  
  const formSchema = yup.object().shape({
    comment: yup.string()
      .required("Toto pole je povinné!")
      .max(500, "Odpověď nesmí být delší než 500 znaků!")
      .min(1)
  });

  const {setError, register, handleSubmit, formState: { errors } } = useForm<CommentForm>({ 
    resolver: yupResolver(formSchema)
  });

  const handleComment = (data: CommentForm) => {
    axios.post("../addComment", {
      tweet_id: props.tweet_id,
      id_of_user: id_of_user,
      text: data.comment
    })
    .then(response => {
      setComment(response.data);
      setCommentSubmitted(true);
      setCommentValue('');
    })
    .catch(error => {
      console.error(error);
      setError("apiError", {
        type: "server",
        message: "Někde nastala chyba, zkuste to znovu!"
      });
    });
  };

  const reloadTweet = () => {
    axios.post("../loadTweet", {
      tweet_id: props.tweet_id
    })
    .then(response => {
      setTweet(response.data);
    })
    .catch(error => {
      console.error(error);
    });
  };

  const reloadComments = () => {
    axios.post("../loadComments", {
      tweet_id: props.tweet_id
    })
    .then(response => {
      setComment(response.data);
    })
    .catch(error => {
      console.error(error);
    });
  };

  const likeCheckFunction = () => {
    setLikeCheck(!likeCheck);
  };

  useEffect(() => {
    setCommentSubmitted(false);
    reloadTweet();
    reloadComments();
  }, [commentSubmitted]);

  useEffect(() => {
    reloadComments();
  }, [likeCheck]);

  return (
    <section className="tweet_window">
      {tweet && <Tweet key={tweet._id} tweet={tweet} />}
      <form className="data" onSubmit={handleSubmit(handleComment)}>
        <div className="comment_input">
          <textarea placeholder="Okomentujte..." {...register("comment")} value={commentValue} onChange={(event) => setCommentValue(event.target.value)}></textarea>
          <button>Okomentovat</button>
        </div>
        {errors.comment && <p className="error">{errors.comment?.message}</p>}
        {errors.apiError && <p className="error">{errors.apiError?.message}</p>}
      </form>
      {comment && Array.isArray(comment) && comment.map((comment) => (<Comment key={comment._id} comment={comment} likeCheckFunction={likeCheckFunction}/>))}
    </section>
  );
}

export default TweetWindow;