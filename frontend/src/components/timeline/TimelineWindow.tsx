import './TimelineWindow.scss';
import { Link, useNavigate } from "react-router-dom";
import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { solid } from '@fortawesome/fontawesome-svg-core/import.macro';
import axios from 'axios';
import * as yup from 'yup'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import NewTweet from './NewTweet';
import Tweet from './Tweet';

function TimelineWindow() {

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

    const navigate = useNavigate()
    const routeChange = () =>{ 
      let path = `../registration`; 
      navigate(path);
    }

    return (
      <section className="timeline_window">
        <p></p>
        <NewTweet></NewTweet>
        <p></p>
        <Tweet></Tweet>
      </section>
    )
  }

  export default TimelineWindow