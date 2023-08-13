import React, { useState, useEffect } from "react";
import Navbar from "../Navbar";
import firebase from "firebase/compat/app";
import "firebase/compat/firestore";
import { useParams } from "react-router-dom";
import Conversation from "../Conversation";
import Styles from "../../assets/css/FriendChatbBox.module.css";
import { format } from "date-fns";

function FriendChatBox() {
  const params = useParams();
  const adminId = params.adminId;
  const friendId = params.friendId;
  const [friendData, setFriendData] = useState([]);
  const [conversationData, setConversationData] = useState([]);
  const [generatedId, setGeneratedId] = useState(null);
  const [message, setMessage] = useState("");
  const [isfriendTyping, setIsFriendTyping] = useState(false);

  function generateConversationId(str1, str2) {
    const sortedIds = [str1, str2].sort();
    return sortedIds.join("");
  }

  const conversationId = generateConversationId(adminId, friendId);

  async function onSubmitHandler(event) {
    event.preventDefault();
    if (message.trim() === "") {
      return;
    }
    const time = format(new Date(), "hh:mm a");

    const newMessage = { friendId: adminId, message, time };

    const conversationSnapshot = await firebase
      .firestore()
      .collection("friendsConversation")
      .where("conversationId", "==", conversationId)
      .get();

    if (conversationSnapshot.docs[0]) {
      const docData = conversationSnapshot.docs[0].data();
      const conversation = [...docData.conversation, newMessage];
      const docId = conversationSnapshot.docs[0].id;
      await firebase
        .firestore()
        .collection("friendsConversation")
        .doc(docId)
        .update({ conversation });
    } else {
      await firebase
        .firestore()
        .collection("friendsConversation")
        .add({
          conversationId: conversationId,
          conversation: [newMessage],
        });
    }

    setMessage("");
  }

  useEffect(() => {
    const conversationId = generateConversationId(adminId, friendId);
    setGeneratedId(conversationId);
    const intervalId = setInterval(async () => {
      const friendSnapshot = await firebase
        .firestore()
        .collection("users")
        .where("id", "==", friendId)
        .get();
      setFriendData(friendSnapshot.docs[0].data());
      const conversationSnapshot = await firebase
        .firestore()
        .collection("friendsConversation")
        .where("conversationId", "==", conversationId)
        .get();

      if (conversationSnapshot.docs[0]) {
        setConversationData(conversationSnapshot.docs[0].data());
      }
    }, 1000);
    //listen for friends typing status
    const friendTypingListener = firebase
      .firestore()
      .collection("typingStatus")
      .doc(friendId)
      .onSnapshot((doc) => {
        const friendTypingStatus = doc.data()?.[adminId] || false;
        setIsFriendTyping(friendTypingStatus);
      });

    return () => {
      clearInterval(intervalId);
      friendTypingListener();
    };
    // eslint-disable-next-line
  }, [friendId, adminId]);

  // Simulate emitting friend's typing status
  const setFriendTypingStatus = async (isTyping) => {
    firebase
      .firestore()
      .collection("typingStatus")
      .doc(adminId)
      .set(
        {
          [friendId]: isTyping,
        },
        { merge: true }
      );
  };

  return (
    <section className={Styles.section}>
      <Navbar
        friendName={friendData.name}
        friendStatus={friendData.status}
        backColor={friendData.backColor}
        friendPhoto={friendData.photo}
        conversation={conversationData.conversation}
        friendTyping={isfriendTyping}
      />

      <Conversation
        conversation={conversationData.conversation}
        uniqueId={generatedId}
      />

      <form onSubmit={onSubmitHandler} className={Styles.form}>
        <div className={Styles.inputGroup}>
          <input
            type="text"
            id="inputField"
            className={Styles.input}
            placeholder="Type Here . . ."
            onChange={(e) => {
              const isTyping = e.target.value !== "";
              setFriendTypingStatus(isTyping);
              setMessage(e.target.value);
            }}
            value={message}
          />
          <button
            style={{ borderLeft: "1px solid #333" }}
            className={Styles.button}
            type="submit"
            id="button-addon2"
          >
            <i className="fa-solid fa-play"></i>
          </button>
        </div>
      </form>
    </section>
  );
}

export default FriendChatBox;
