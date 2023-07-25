import React from "react";
import Styles from "../assets/css/Conversation.module.css";
function Conversation() {
  return (
    <React.Fragment>
      <section className={Styles.section}>
        {conversationData &&
          conversationData.map((item, index) => {
            return (
              <React.Fragment key={index}>
                {item.friendID === friendId && (
                  <div className={Styles.friendBox}>
                    <div className={Styles.friend}>
                      <p>{item.message}</p>
                      <span>{item.time}</span>
                    </div>
                  </div>
                )}
                {item.friendID === adminId && (
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
