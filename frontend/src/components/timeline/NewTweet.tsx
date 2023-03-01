import './NewTweet.scss';
import { useState, useEffect } from "react";
import * as yup from 'yup'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import axios from 'axios';

function NewTweet() {

    const [passwordShown, setPasswordShown] = useState(false);

    type Form = {
      tweet: string;
      apiError: string
    }
    
    const formSchema = yup.object().shape({
      tweet: yup.string()
        .required("Toto pole je povinné!")
        .max(500)
        .min(1)
        ,
    })

    const {setError, register, handleSubmit, formState: { errors } } = useForm<Form>({ 
      resolver: yupResolver(formSchema)
    });

    const onSubmit = (data: Form) => {
      axios.post("/addTweet",{
        tweet: data.tweet,
      })
      .catch(err => {
        setError("apiError", {
          type: "server",
          message: "Někde nastala chyba zkuste to znovu!",
        });
      })
    }

    return (
      <section className="newtweet">
        <form className="data" onSubmit={handleSubmit(onSubmit)}>
          <div className="boxnewtweet">
              <textarea placeholder="Tweetněte něco..." {...register("tweet")}></textarea>
              <button>Tweet</button>
          </div>
          {errors.apiError && <p className="error">{errors.apiError?.message}</p>}
        </form>
      </section>
    )
  }

  export default NewTweet