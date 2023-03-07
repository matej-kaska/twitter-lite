import './TweetWindow.scss';
import { Link, useNavigate } from "react-router-dom";
import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { solid } from '@fortawesome/fontawesome-svg-core/import.macro';
import axios from 'axios';
import * as yup from 'yup'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import Tweet from '../timeline/Tweet';
import Comment from './Comment';

interface tweet_id {
  tweet_id: string;
}

interface iComment {
  _id: string;
  id_of_user: string;
  name_of_user: string;
  username_of_user: string;
  username_of_master: string;
  id_of_master: string;
  replies: any[];
  likes: any[];
  ts_created: Date;
  text: string;
  }

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

function TweetWindow(tweet_id: tweet_id) {
  const [comment, setComment] = useState<iComment[]>([]);
  const [tweet, setTweet] = useState<iTweet>();
  const [number_of_bunch, setNumberOfBunch] = useState(1);
  const [end, setEnd] = useState(false);
  const [commentSubmitted, setCommentSubmitted] = useState(false);
  const id_of_user = localStorage.getItem("id_of_user");
  const [commentValue, setCommentValue] = useState('');

  type Form = {
    comment: string;
    apiError: string
  }
  
  const formSchema = yup.object().shape({
    comment: yup.string()
      .required("Toto pole je povinné!")
      .max(500)
      .min(1)
      ,
  })

  const {setError, register, handleSubmit, formState: { errors } } = useForm<Form>({ 
    resolver: yupResolver(formSchema)
  });



  const reloadTweet = () => {
    axios.post("../loadTweet",{
      tweet_id: tweet_id.tweet_id,
    })
    .then(response => {
      setEnd(false);
      setTweet(response.data);
    })
    .catch(error => {
        console.error(error);
    });
  };

  const reloadComments = () => {
    axios.post("../loadComments",{
      tweet_id: tweet_id.tweet_id,
    })
    .then(response => {
      setEnd(false);
      setComment(response.data);
    })
    .catch(error => {
        console.error(error);
    });
  }

  const handleComment = (data: Form) => {
    axios.post("../addComment",{
      tweet_id: tweet_id.tweet_id,
      id_of_user: id_of_user,
      text: data.comment
    })
    .then(response => {
      setEnd(false);
      setComment(response.data);
      setCommentSubmitted(true);
      setCommentValue('');
    })
    .catch(error => {
        console.error(error);
    });
  }

  useEffect(() => {
    if (commentSubmitted) {
      setNumberOfBunch(1);
      setCommentSubmitted(false);
    }
    reloadTweet();
    reloadComments();
  }, [commentSubmitted]);

    return (
      <section className="tweet_window">
          {tweet && <Tweet key={tweet._id} tweet={tweet} />}
          <form className="data" onSubmit={handleSubmit(handleComment)}>
            <div className="comment_input">
              <textarea placeholder="Okomentujte..." {...register("comment")} value={commentValue} onChange={(event) => setCommentValue(event.target.value)}></textarea>
              <button>Okomentovat</button>
            </div>
          </form>
          {comment && Array.isArray(comment) && comment.map(comment =>  <Comment key={comment._id} comment={comment}/>)}
      </section>
    )
  }

  export default TweetWindow