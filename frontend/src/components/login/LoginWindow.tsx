import './LoginWindow.scss';
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { solid } from '@fortawesome/fontawesome-svg-core/import.macro';
import axios from 'axios';
import * as yup from 'yup'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'


function LoginWindow() {

    const [passwordShown, setPasswordShown] = useState(false);
    const [id_of_user, setId_of_user] = useState('');

    type Form = {
      email: string;
      password: string;
      apiError: string
    }
    
    const formSchema = yup.object().shape({
      email: yup.string()
        .required("Toto pole je povinné!")
        .email("E-mail není ve validním formátu!")
        .max(320, "E-mail není ve validním formátu!")
        ,
      password: yup.string()
        .required("Toto pole je povinné!")
        .max(50, "Heslo nesmí být delší než 50 znaků!")
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
    
    // Password toggle handler
    const togglePassword = (e: { stopPropagation: () => void; } ) => {
      e.stopPropagation();
      setPasswordShown(!passwordShown);
    };

    const onSubmit = (data: Form) => {
          axios.post("/login",{
            email: data.email,
            password: data.password
          })
          .then(res => {
            navigate("/");
          }).catch(err => {
            if (err.response.data.error_message.includes("email or password")) {
              setError("password", {
                type: "server",
                message: "Nesprávný email nebo heslo!"
              });
            } else {
              setError("apiError", {
                type: "server",
                message: "Někde nastala chyba zkuste to znovu!",
              });
            }
          })
        }
      
    

    return (
      <section className="login_window">
        <div className="content">
          <form className="data" onSubmit={handleSubmit(onSubmit)}>
          <h1>Twitter Lite</h1>
            <div>
              <input placeholder="Zadejte e-mail" {...register("email")}></input>
              {errors.email && <p className="error">{errors.email.message}</p>}
            </div>
            <div>
              <div className="password">
                <input type={passwordShown ? "text" : "password"} placeholder="Zadejte heslo" {...register("password")}></input>
                <FontAwesomeIcon className="eye" onClick={togglePassword} icon={passwordShown ? solid("eye") : solid("eye-slash")}/>
              </div>
            </div>
            <div>
            {errors.apiError && <p className="error">{errors.apiError?.message}</p>}
            {errors.password && <p className="error">{errors.password.message}</p>}
            </div>
            <button className="button-login">Přihlásit se</button>
            <button className="button-register" onClick={routeChange}>Zaregistrovat se</button>
          </form>
        </div>
      </section>
    )
  }

  export default LoginWindow