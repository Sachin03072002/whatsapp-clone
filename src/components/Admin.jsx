import React from "react";
import { useNavigate } from "react-router-dom";
import Styles from "../assets/css/Admin.module.css";
import Profile from "./Profile";

function Admin({ adminId, adminName, adminPhoto, status }) {
  const navigate = useNavigate();

  // Handle the click event on the image
  const handleImageClick = () => {
    navigate(`/whatsapp-web/profile/${adminId}`);
  };

  return (
    <React.Fragment>
      <div className={Styles.box}>
        <img
          src={adminPhoto}
          alt="."
          className={Styles.img}
          onClick={handleImageClick} // Add onClick handler to call handleImageClick
        />
      </div>
    </React.Fragment>
  );
}

export default Admin;
