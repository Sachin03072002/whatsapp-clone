import React, { useEffect, useState } from "react";
import Styles from "../assets/css/FriendAside.module.css";
import { NavLink, useParams } from "react-router-dom";
import firebase from "firebase/compat/app";
import "firebase/compat/firestore";
function FriendAside({ UserId, UserName, UserPhoto, UserOnline }) {
  // const [isHidden, setIsHidden] = useState(false);
  const params = useParams();
  const [lastMessage, setLastMessage] = useState();
  const adminId = params.adminId;
  const conversationId = generateConversationID(adminId, UserId);
  const activeNavLink = { backgroundColor: "#333", color: "aliceBlue" };
  const onlineStatus = UserOnline ? { color: "lightgreen" } : { color: "red" };
  function generateConversationID(str1, str2) {
    if (str1 < str2) {
      return str1 + str2;
    } else {
      return str2 + str1;
    }
  }

  useEffect(() => {
    const updateLastMessage = async () => {
      const docRef = firebase
        .firestore()
        .collection("lastConversation")
        .doc(conversationId);
      await docRef.set({ lastMessage: lastMessage || "" });
    };
    updateLastMessage();
  }, [conversationId, lastMessage]);
  useEffect(() => {
    const intervalId = setInterval(async () => {
      const docRef = firebase
        .firestore()
        .collection("lastConversation")
        .doc(conversationId);
      //check if the document exists
      const docSnapshot = await docRef.get();
      if (docSnapshot.exists) {
        setLastMessage(docSnapshot.data().lastMessage);
      } else {
        //handle the case when the document is not found
        console.log("document does not exist");
        //create a new document
        await docRef.set({ lastMessage: "" });
      }
    }, 1000);
    return () => {
      clearInterval(intervalId);
    };
  }, [conversationId]);

  return (
    <section key={UserId}>
      <NavLink
        to={`${UserId}`}
        className={Styles.box}
        style={({ isActive }) => {
          return isActive ? activeNavLink : null;
        }}
      >
        <i
          className={`fa-solid fa-circle fa-xs ${Styles.onlineStatusDot}`}
          style={onlineStatus}
        ></i>
        <img src={UserPhoto} alt="friend-img" className={Styles.img} />
        <div className={Styles.insideDiv}>
          <h1 className={Styles.H1}>{UserName}</h1>
          {lastMessage && <small>{lastMessage}</small>}
        </div>
      </NavLink>
    </section>
  );
}

export default FriendAside;
