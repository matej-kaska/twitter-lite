import './Dropdown.scss';
import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { solid, regular } from '@fortawesome/fontawesome-svg-core/import.macro';
import axios from 'axios';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useForm } from 'react-hook-form';

const Dropdown = () => {
  const [showOptions, setShowOptions] = useState(false);
  const [bioOpen, setBioOpen] = useState(false);
  const [deleteUserOpen, setDeleteUserOpen] = useState(false);
  const id_of_user = localStorage.getItem("id_of_user")

  type Form = {
    bio: string;
    apiError: string
  }
  
  const formSchema = yup.object().shape({
    bio: yup.string()
      .required("Toto pole je povinné!")
      .max(500)
      .min(1)
      ,
  })

  const {setError, register, handleSubmit, formState: { errors } } = useForm<Form>({ 
    resolver: yupResolver(formSchema)
  });

  const handleButtonClick = () => {
    setShowOptions(!showOptions);
  };

  const handleEditBioClick = () => {
    setBioOpen(true);
    setShowOptions(!showOptions);
  };

  const handleDeleteAccountClick = () => {
    setDeleteUserOpen(true);
    setShowOptions(!showOptions);
  };

  const changeBio = (data: Form) => {
    axios.post("../changeBio",{
        user_id: id_of_user,
        text: data.bio
    })
    .then(response => {
        window.location.reload()
    })
    .catch(error => {
        console.error(error);
    });
  }

  useEffect(() => {
    const handleEscapeKeyPress = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setShowOptions(false);
        setDeleteUserOpen(false);
        setBioOpen(false);
      }
    };

    window.addEventListener('keydown', handleEscapeKeyPress);

    return () => {
      window.removeEventListener('keydown', handleEscapeKeyPress);
    };
  }, []);

  return (
    <div className="dropdown">
      <FontAwesomeIcon onClick={handleButtonClick} className="buttonSvgDotsAlone" icon={solid("ellipsis")}/>
      {showOptions && (
        <div className="options">
          <button onClick={handleEditBioClick}><FontAwesomeIcon icon={solid("pen-to-square")}/>&nbsp;Změnit bio</button>
          <button className="delete" onClick={handleDeleteAccountClick}><FontAwesomeIcon icon={solid("trash")}/>&nbsp;Smazat účet</button>
        </div>
      )}
      {bioOpen && (
        <div className="modal-container">
            <div className="modal bio">
                <form onSubmit={handleSubmit(changeBio)}>
                    <div className="top-bar">
                        Změňte své bio:
                        <button className="X" onClick={() => setBioOpen(false)}><FontAwesomeIcon icon={solid("x")}/></button>
                    </div>
                    <div className="biotext">
                        <textarea {...register("bio")} placeholder="Napište své nové bio..."></textarea>
                        <button>Změnit</button>
                    </div>
                </form>
            </div>
        </div>
    )}
    {deleteUserOpen && (
        <div className="modal-container">
        <div className="modal">
            <div className="top-bar">
                Chcete smazat svůj účet?
                <button className="X" onClick={() => setDeleteUserOpen(false)}><FontAwesomeIcon icon={solid("x")}/></button>
            </div>
            <div className="usertext">
                <button className="Yes">Ano</button>
                <button className="No" onClick={() => setDeleteUserOpen(false)}>Ne</button>
            </div>
        </div>
    </div>
    )}
    </div>
    
  );
};

export default Dropdown;