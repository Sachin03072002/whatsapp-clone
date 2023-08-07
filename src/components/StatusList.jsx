import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import Styles from "../assets/css/StatusList.module.css";

function StatusList({
  statuskey,
  statusId,
  adminId,
  adminPhoto,
  text,
  statusImg,
  adminName,
  isRecent,
  updateVisitorArray,
  handleDeleteStatus,
  isdelete,
}) {
  const activeNavLink = { backgroundColor: "#333", color: "aliceBlue" };
  const [isHoverCross, setIsHoverCross] = useState(false);

  const handleNavClick = () => {
    updateVisitorArray(statusId);
  };

  return (
    <NavLink
      to={`/whatsappweb/${adminId}/status/${statusId}`}
      className={Styles.link}
      style={({ isActive }) => {
        return isActive ? activeNavLink : null;
      }}
      onClick={handleNavClick}
    >
      <div className={Styles.box}>
        <img
          src={adminPhoto}
          alt="admin-img"
          className={Styles.img}
          style={
            isRecent
              ? { border: "2px solid green" }
              : { border: "2px solid grey" } // Conditionally apply green border for isRecent, grey border otherwise
          }
        />
        <div className={Styles.insideDiv}>
          <h1 className={Styles.H1}>{adminName}</h1>
          {isdelete && (
            <button
              className={Styles.add}
              onMouseEnter={() => setIsHoverCross(true)}
              onMouseLeave={() => setIsHoverCross(false)}
              onClick={handleDeleteStatus}
            >
              <i
                className="fa-solid fa-x"
                style={isHoverCross ? { color: "red" } : null}
              ></i>
            </button>
          )}
        </div>
      </div>
    </NavLink>
  );
}

export default StatusList;
