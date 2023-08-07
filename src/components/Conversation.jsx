import React, { useEffect, useState } from "react";
import Styles from "../assets/css/Conversation.module.css";
import { useParams } from "react-router-dom";
import firebase from "firebase/compat/app";
import "firebase/compat/firestore";
function Conversation({ conversation, uniqueId }) {
  const params = useParams();
  const friendId = params.friendId;
  const adminId = params.adminId;
  const [conversationData, setConversationData] = useState(null);
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
      })();
    } else {
      setConversationData(null);
    }
  }, [conversation, uniqueId]);
  if (!uniqueId) {
    return null;
  }

  return (
    <React.Fragment>
      <section className={Styles.section}>
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
    </React.Fragment>
  );
}

export default Conversation;
