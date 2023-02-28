import './NewTweet.scss';
import { useState, useEffect } from "react";
import * as yup from 'yup'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'

function NewTweet() {

    const [passwordShown, setPasswordShown] = useState(false);

    type Form = {
      email: string;
      password: string;
      apiError: string
    }
    
    const formSchema = yup.object().shape({
      email: yup.string()
        .required("Toto pole je povinné!")
        .email("E-mail není ve validním formátu!")
        ,
      password: yup.string()
        .required("Toto pole je povinné!")
        ,
    })

    const {setError, register, handleSubmit, formState: { errors } } = useForm<Form>({ 
      resolver: yupResolver(formSchema)
    });

    return (
      <section className="newtweet">
        <div className="boxnewtweet">
            <textarea placeholder="Tweetněte něco..."></textarea>
            <button>Tweet</button>
        </div>
      </section>
    )
  }

  export default NewTweet