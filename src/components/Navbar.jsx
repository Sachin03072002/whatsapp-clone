import React from "react";
import Styles from "../assets/css/Navbar.module.css";
import { useNavigate } from "react-router-dom";

function Navbar({
  friendName,
  backColor,
  friendPhoto,
  conversation,
  friendStatus,
  friendTyping,
}) {
  const navigate = useNavigate();
  const typingStatusStyle = {
    color: friendTyping ? "green" : "inherit", // Change color to green if friend is typing
  };

  const typingStatusClass = friendTyping
    ? "animate__animated animate__pulse animate__infinite"
    : "";

  const handleBack = async () => {
    await navigate(-1);
  };

  return (
    <nav style={{ backgroundColor: backColor }} className={Styles.nav}>
      <div className="container-fluid">
        <div className={Styles.dp}>
          <img src={friendPhoto} alt="." className={Styles.dp} />
          <span className={Styles.name}>
            {friendName}
            <br />
            <span className={typingStatusClass} style={typingStatusStyle}>
              {friendTyping ? (
                <b>Typing..</b>
              ) : friendStatus ? (
                "Online"
              ) : (
                "Offline"
              )}
            </span>
          </span>
          <i
            className={`fa-solid fa-arrow-right-to-bracket ${Styles.back}`}
            onClick={handleBack}
          ></i>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
