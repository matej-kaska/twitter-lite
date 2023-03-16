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
      .required("Toto pole je povinné!")
      .email("E-mail není ve validním formátu!")
      .max(320, "E-mail není ve validním formátu!")
      ,
    username: yup.string()
      .required("Toto pole je povinné!")
      .min(6, "Přezdívka musí být minimálně 6 znaků dlouhá!")
      .max(40, "Přezdívka nesmí být delší než 40 znaků!")
      .trim()
      ,
    name: yup.string()
      .required("Toto pole je povinné!")
      .max(40, "Jméno nesmí být delší než 40 znaků!")
      ,
    password: yup.string()
      .required("Toto pole je povinné!")
      .min(8, "Heslo musí být minimálně 8 znaků dlouhé!")
      .max(50, "Heslo nesmí být delší než 50 znaků!")
      ,
    confirmPwd: yup.string()
      .required("Toto pole je povinné!")
      .oneOf([yup.ref("password")], "Hesla se neshodují!")
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
      if (error.response.data.error_message.includes("Email is already regisred!")) {
        setError("email", {
          type: "server",
          message: 'Tento email je již používán!'
        });
      } else if (error.response.data.error_message.includes("Username is already regisred!")){
        setError("username", {
          type: "server",
          message: 'Tato přezdívka je již používána!'
        });
      }
      else {
        setError('apiError', {
          type: "server",
          message: 'Někde nastala chyba, zkuste to znovu!'
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
          <h1>Vytvořit účet</h1>
          <div>
            <input placeholder="Zadejte e-mail" id="email" {...register("email")}/>
            {errors.email && <p className="error">{errors.email.message}</p>}
          </div>
          <div>
            <input placeholder="Zadejte přezdívku" id="username" {...register("username")}/>
            {errors.username && <p className="error">{errors.username.message}</p>}
          </div>
          <div>
            <input placeholder="Zadejte celé jméno" id="name" {...register("name")}/>
            {errors.name && <p className="error">{errors.name.message}</p>}
          </div>
          <div>
            <input type={passwordShown ? "text" : "password" } placeholder="Zadejte heslo" id="password" {...register('password')}/>
            <FontAwesomeIcon className="eye" onClick={togglePassword} icon={passwordShown ? solid("eye") : solid("eye-slash")}/>
            {errors.password && <p className="error">{errors.password.message}</p>}
          </div>
          <div>
            <input type={passwordShown ? "text" : "password" } placeholder="Ověření hesla" id="confirmPassword" {...register('confirmPwd')}/>
            {errors.confirmPwd && <p className="error">{errors.confirmPwd.message}</p>}
          </div>
          {errors.apiError && <p className="error">{errors.apiError?.message}</p>}
          {isSuccessfullySubmitted && <p className="success">Registrace proběhla v pořádku.</p>}
          <button className="button-register">Zaregistrovat se</button>
          <button className="button-login" onClick={routeChange}>Zpět na přihlášení</button>
        </form>
      </div>
    </section>
  );
}

export default RegistrationWindow;