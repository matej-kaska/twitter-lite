import './NewTweet.scss';
import { useState } from "react";
import * as yup from 'yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import axios from 'axios';

function NewTweet(props: { onTweetSubmit: () => void }) {
  const [tweetValue, setTweetValue] = useState("");

  type NewTweetForm = {
    newTweet: string;
    apiError: string;
  };
  
  const formSchema = yup.object().shape({
    newTweet: yup.string()
      .required("This field is required!")
      .max(500, "Tweet can't be longer than 500 characters!")
      .min(1)
  });

  const {setError, register, handleSubmit, formState: { errors } } = useForm<NewTweetForm>({ 
    resolver: yupResolver(formSchema)
  });

  const onSubmit = (data: NewTweetForm) => {
    axios.post("/addTweet", {
      tweet: data.newTweet
    })
    .then(() => {
      props.onTweetSubmit();
      setTweetValue("");
    })
    .catch(error => {
      console.error(error);
      setError("apiError", {
        type: "server",
        message: "An error has occurred, try again!"
      });
    });
  };

  return (
    <section className="newtweet">
      <form className="data" onSubmit={handleSubmit(onSubmit)}>
        <div className="boxnewtweet">
            <textarea placeholder="Tweet something..." {...register("newTweet")} value={tweetValue} onChange={(event) => setTweetValue(event.target.value)}></textarea>
            <button>Tweet</button>
            {errors.newTweet && <p className="error">{errors.newTweet?.message}</p>}
            {errors.apiError && <p className="error">{errors.apiError?.message}</p>}
        </div>
      </form>
    </section>
  );
}

export default NewTweet;