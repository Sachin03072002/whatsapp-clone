import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Styles from "../assets/css/Admin.module.css";
import firebase from "firebase/compat/app";
import "firebase/compat/firestore";

function Admin({ adminId, adminPhoto, ViewUserStatus, hasUpdate }) {
  const navigate = useNavigate();
  const [length, setLength] = useState(0);

  // Handle the click event on the image
  const handleProfileImageClick = () => {
    navigate(`/whatsapp-web/profile/${adminId}`);
  };
  //whenever the component mounts it will call this function
  useEffect(() => {
    const FriendNum = async () => {
      try {
        const snapshot = await firebase
          .firestore()
          .collection("newFriendRequest")
          .where("friendRequest.receiver", "==", adminId)
          .get();
        setLength(snapshot.size);
      } catch (error) {
        console.error("error fetching data", error);
      }
    };
    FriendNum();
  }, [adminId]);

  // Additionally, you might want to update the length whenever new friend requests are added
  // To achieve this, you can use Firestore's snapshot listener
  useEffect(() => {
    const unsubscribe = firebase
      .firestore()
      .collection("newFriendRequest")
      .where("friendRequest.receiver", "==", adminId)
      .onSnapshot((snapshot) => {
        setLength(snapshot.size);
      });

    // Cleanup the listener when the component unmounts
    return () => unsubscribe();
  }, [adminId]); // Make sure to add adminId to the dependency array to re-subscribe when it changes

  return (
    <React.Fragment>
      <div className={Styles.box}>
        <div
          className={Styles.statusICon}
          style={
            hasUpdate ? { color: "green" } : {} // Conditionally apply green border for isRecent, grey border otherwise
          }
        >
          <i
            className="fa-solid fa-circle-radiation"
            onClick={() => ViewUserStatus()}
          ></i>
        </div>
        <div className={Styles.icon}>{length}</div>
        <img
          src={adminPhoto}
          alt="."
          className={Styles.img}
          onClick={handleProfileImageClick}
        />
      </div>
    </React.Fragment>
  );
}

export default Admin;
