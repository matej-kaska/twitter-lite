import './Dropdown.scss';
import React, { useState } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { solid, regular } from '@fortawesome/fontawesome-svg-core/import.macro';

const Dropdown = () => {
  const [showOptions, setShowOptions] = useState(false);

  const handleButtonClick = () => {
    setShowOptions(!showOptions);
  };

  const handleEditBioClick = () => {
    // Implement edit bio functionality here
  };

  const handleDeleteAccountClick = () => {
    // Implement delete account functionality here
  };

  return (
    <div className="dropdown">
      <FontAwesomeIcon onClick={handleButtonClick} className="buttonSvgDotsAlone" icon={solid("ellipsis")}/>
      {showOptions && (
        <div className="options">
          <button onClick={handleEditBioClick}><FontAwesomeIcon icon={solid("pen-to-square")}/>&nbsp;Změnit bio</button>
          <button className="delete" onClick={handleDeleteAccountClick}><FontAwesomeIcon icon={solid("trash")}/>&nbsp;Smazat účet</button>
        </div>
      )}
    </div>
  );
};

export default Dropdown;