import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Styles from "../assets/css/Admin.module.css";
import firebase from "firebase/compat/app";
import "firebase/compat/firestore";

function Admin({ adminId, adminName, adminPhoto, status }) {
  const navigate = useNavigate();
  const [length, setLength] = useState(0);

  // Handle the click event on the image
  const handleImageClick = () => {
    navigate(`/whatsapp-web/profile/${adminId}`);
  };

  const FriendNum = async () => {
    try {
      const snapshot = await firebase
        .firestore()
        .collection("newFriendRequest")
        .where("friendRequest.receiver", "==", adminId)
        .get();
      setLength(snapshot.size);
      console.log(snapshot.size);
    } catch (error) {
      console.error("error fetching data", error);
    }
  };

  // Call FriendNum function whenever the component mounts
  useEffect(() => {
    FriendNum();
  }, []); // The empty dependency array [] ensures it's only called once on mount

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
        <div className={Styles.icon}>{length}</div>
        <img
          src={adminPhoto}
          alt="."
          className={Styles.img}
          onClick={handleImageClick}
        />
      </div>
    </React.Fragment>
  );
}

export default Admin;
