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
      .required("Toto pole je povinné!")
      .max(500, "Tweet nesmí být delší než 500 znaků!")
      .min(1)
  });

  const {setError, register, handleSubmit, formState: { errors } } = useForm<NewTweetForm>({ 
    resolver: yupResolver(formSchema)
  });

  const onSubmit = (data: NewTweetForm) => {
    axios.post("/api/addTweet", {
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
        message: "Někde nastala chyba, zkuste to znovu!"
      });
    });
  };

  return (
    <section className="newtweet">
      <form className="data" onSubmit={handleSubmit(onSubmit)}>
        <div className="boxnewtweet">
            <textarea placeholder="Tweetněte něco..." {...register("newTweet")} value={tweetValue} onChange={(event) => setTweetValue(event.target.value)}></textarea>
            <button>Tweet</button>
            {errors.newTweet && <p className="error">{errors.newTweet?.message}</p>}
            {errors.apiError && <p className="error">{errors.apiError?.message}</p>}
        </div>
      </form>
    </section>
  );
}

export default NewTweet;