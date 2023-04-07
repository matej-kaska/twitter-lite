import './Dropdown.scss';
import { useState } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { solid } from '@fortawesome/fontawesome-svg-core/import.macro';
import axios from 'axios';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useForm } from 'react-hook-form';
import useEscapeKeyHandler from '../../hooks/useEscapeKeyHandler';

const Dropdown = () => {
  const [showOptions, setShowOptions] = useState(false);
  const [bioOpen, setBioOpen] = useState(false);
  const [deleteUserOpen, setDeleteUserOpen] = useState(false);
  const id_of_user = localStorage.getItem("id_of_user");

  type BioForm = {
    bio: string;
    apiError: string;
  };
  
  const formSchema = yup.object().shape({
    bio: yup.string()
      .required("Toto pole je povinné!")
      .max(500, "Bio nesmí být delší než 500 znaků!")
      .min(1)
  });

  const {setError, register, handleSubmit, formState: { errors } } = useForm<BioForm>({ 
    resolver: yupResolver(formSchema)
  });

  const changeBio = (data: BioForm) => {
    axios.post("../changeBio", {
      user_id: id_of_user,
      text: data.bio
    })
    .then(() => {
      window.location.reload();
    })
    .catch(error => {
      console.error(error);
      setError("apiError", {
        type: "server",
        message: "An error has occurred, try again!"
      });
    });
  };

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

  useEscapeKeyHandler([
    { stateSetter: setShowOptions, isOpen: showOptions },
    { stateSetter: setDeleteUserOpen, isOpen: deleteUserOpen },
    { stateSetter: setBioOpen, isOpen: bioOpen }
  ]);

  return (
    <div className="dropdown">
    <FontAwesomeIcon onClick={handleButtonClick} className="buttonSvgDotsAlone" icon={solid("ellipsis")}/>
    {showOptions &&
    ( <div className="options">
        <button onClick={handleEditBioClick}>
          <FontAwesomeIcon icon={solid("pen-to-square")}/>&nbsp;Change bio
        </button>
        <button className="delete" onClick={handleDeleteAccountClick}>
          <FontAwesomeIcon icon={solid("trash")}/>&nbsp;Delete account
        </button>
      </div> )}
    {bioOpen && 
    ( <div className="modal-container">
        <div className="modal bio">
          <form onSubmit={handleSubmit(changeBio)}>
            <div className="top-bar"> Change bio: <button className="X" onClick={()=> setBioOpen(false)}>
                <FontAwesomeIcon icon={solid("x")}/>
              </button>
            </div>
            <div className="biotext">
              <textarea {...register("bio")} placeholder="Write your new bio..."></textarea>
              {errors.bio && <p className="error">{errors.bio?.message}</p>}
              {errors.apiError && <p className="error">{errors.apiError?.message}</p>}
              <button>Change</button>
            </div>
          </form>
        </div>
    </div> )}
    {deleteUserOpen &&
    ( <div className="modal-container">
        <div className="modal">
          <div className="top-bar"> Do you want to delete your account? <button className="X" onClick={()=> setDeleteUserOpen(false)}>
              <FontAwesomeIcon icon={solid("x")}/>
            </button>
          </div>
          <div className="usertext">
            <button className="Yes">Yes</button>
            <button className="No" onClick={()=> setDeleteUserOpen(false)}>No</button>
          </div>
        </div>
      </div> )}
    </div>
  );
}

export default Dropdown;