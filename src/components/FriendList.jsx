import React from "react";
import Styles from "../assets/css/FriendList.module.css";
function FriendList({ UserId, UserName, UserPhoto, UserOnline }) {
  const onlineStatus = UserOnline ? { color: "lightgreen" } : { color: "red" };

  return (
    <div>
      <section key={UserId}>
        <div className={Styles.box}>
          <i
            className={`fa-solid fa-circle fa-xs ${Styles.onlineStatusDot}`}
            style={onlineStatus}
          ></i>
          <img src={UserPhoto} alt="friend-img" className={Styles.img} />
          <div className={Styles.insideDiv}>
            <h1 className={Styles.H1}>{UserName}</h1>
          </div>
        </div>
      </section>
    </div>
  );
}

export default FriendList;
