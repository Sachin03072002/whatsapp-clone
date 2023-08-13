import React, { useEffect, useState, useRef } from "react";
import Styles from "../assets/css/Conversation.module.css";
import { useParams } from "react-router-dom";
import firebase from "firebase/compat/app";
import "firebase/compat/firestore";

function Conversation({ conversation, uniqueId }) {
  const params = useParams();
  const friendId = params.friendId;
  const adminId = params.adminId;
  const [conversationData, setConversationData] = useState(null);
  const conversationRef = useRef(null);

  useEffect(() => {
    if (conversation) {
      (async () => {
        const lastConversation = conversation[conversation.length - 1].message;
        setConversationData(conversation);
        if (uniqueId) {
          await firebase
            .firestore()
            .collection("lastConversation")
            .doc(uniqueId)
            .update({ lastMessage: lastConversation });
        }
        scrollToLatestMessage();
      })();
    } else {
      setConversationData(null);
    }
  }, [conversation, uniqueId]);

  const scrollToLatestMessage = () => {
    if (conversationRef.current) {
      const scrollHeight = conversationRef.current.scrollHeight;
      conversationRef.current.scrollTop = scrollHeight;
    }
  };

  if (!uniqueId) {
    return null;
  }

  return (
    <section className={Styles.section} ref={conversationRef}>
      {conversationData &&
        conversationData.map((item, index) => {
          return (
            <React.Fragment key={index}>
              {item.friendId === friendId && (
                <div className={Styles.friendBox}>
                  <div className={Styles.friend}>
                    <p>{item.message}</p>
                    <span>{item.time}</span>
                  </div>
                </div>
              )}
              {item.friendId === adminId && (
                <div className={Styles.adminBox}>
                  <div className={Styles.admin}>
                    <p>{item.message}</p>
                    <span>{item.time}</span>
                  </div>
                </div>
              )}
            </React.Fragment>
          );
        })}
    </section>
  );
}

export default Conversation;
