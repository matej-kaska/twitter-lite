import './RegistrationWindow.scss';
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { solid } from '@fortawesome/fontawesome-svg-core/import.macro';

function RegistrationWindow() {
  const [passwordShown, setPasswordShown] = useState(false);
  const [isSuccessfullySubmitted, setIsSuccessfullySubmitted] = useState(false);
  const navigate = useNavigate();

  type RegisterForm = {
    email: string;
    username: string;
    name: string;
    password: string;
    confirmPwd: string;
    apiError: string;
  };

  const formSchema = yup.object().shape({
    email: yup.string()
      .required("This field is required!")
      .email("Email is not in valid format!")
      .max(320, "Email is not in valid format!")
      ,
    username: yup.string()
      .required("This field is required!")
      .min(6, "Username must be longer than 6 characters!")
      .max(40, "Username can't be longer than 40 characters!")
      .trim()
      ,
    name: yup.string()
      .required("This field is required!")
      .max(40, "Name can't be longer than 40 characters!")
      ,
    password: yup.string()
      .required("This field is required!")
      .min(8, "Password must be longer than 8 characters!")
      .max(50, "Password can't be longer than 50 characters!")
      ,
    confirmPwd: yup.string()
      .required("This field is required!")
      .oneOf([yup.ref("password")], "Passwords are not matching!")
  });

  const {setError, register, handleSubmit, formState: { errors } } = useForm<RegisterForm>({ 
    resolver: yupResolver(formSchema)
  });

  const onSubmit = (data: RegisterForm) => {
    axios.post("register", {
      email: data.email,
      username: data.username,
      name: data.name,
      password: data.password
    })
    .then(() => {
      setIsSuccessfullySubmitted(true);
      setTimeout(() => {
        navigate("/login");
      }, 2000);
    }).catch(error => {
      console.error(error);
      if (error.response.data.error_message.includes("Email is already registered!")) {
        setError("email", {
          type: "server",
          message: 'Email is already registered!'
        });
      } else if (error.response.data.error_message.includes("Username is already registered!")){
        setError("username", {
          type: "server",
          message: 'Username is already registered!'
        });
      }
      else {
        setError('apiError', {
          type: "server",
          message: 'An error has occurred, try again!'
        });
      }
    });
  };
  
  const routeChange = () =>{ 
    navigate("../login");
  };

  const togglePassword = () => {
    setPasswordShown(!passwordShown);
  };

  return (
    <section className="registration_window">
      <div className="content">
        <form className="data" onSubmit={handleSubmit(onSubmit)}>
          <h1>Create account</h1>
          <div>
            <input placeholder="Enter email" id="email" {...register("email")}/>
            {errors.email && <p className="error">{errors.email.message}</p>}
          </div>
          <div>
            <input placeholder="Enter username" id="username" {...register("username")}/>
            {errors.username && <p className="error">{errors.username.message}</p>}
          </div>
          <div>
            <input placeholder="Enter name" id="name" {...register("name")}/>
            {errors.name && <p className="error">{errors.name.message}</p>}
          </div>
          <div>
            <input type={passwordShown ? "text" : "password" } placeholder="Enter password" id="password" {...register('password')}/>
            <FontAwesomeIcon className="eye" onClick={togglePassword} icon={passwordShown ? solid("eye") : solid("eye-slash")}/>
            {errors.password && <p className="error">{errors.password.message}</p>}
          </div>
          <div>
            <input type={passwordShown ? "text" : "password" } placeholder="Confirm password" id="confirmPassword" {...register('confirmPwd')}/>
            {errors.confirmPwd && <p className="error">{errors.confirmPwd.message}</p>}
          </div>
          {errors.apiError && <p className="error">{errors.apiError?.message}</p>}
          {isSuccessfullySubmitted && <p className="success">Registration has been successful</p>}
          <button className="button-register">Create account</button>
          <button className="button-login" onClick={routeChange}>Back to log in</button>
        </form>
      </div>
    </section>
  );
}

export default RegistrationWindow;