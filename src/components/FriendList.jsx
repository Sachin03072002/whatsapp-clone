import React, { useState } from "react";
import Styles from "../assets/css/FriendList.module.css";
import {
  NotificationContainer,
  NotificationManager,
} from "react-notifications";
import "react-notifications/lib/notifications.css";

import firebase from "firebase/compat/app";
import "firebase/compat/firestore";

function FriendList({
  AdminId,
  UserId,
  UserName,
  UserPhoto,
  UserOnline,
  friendship,
  relationship,

  // onAddFriend,
  // ShowModalForUser,
  // setShowModal,/
}) {
  const onlineStatus = UserOnline ? { color: "lightgreen" } : { color: "red" };
  const hoverColor = friendship ? { color: "red" } : { color: "green" };

  const [isHover, setIsHover] = useState(false);
  const [isHoverCross, setIsHoverCross] = useState(false);
  const [isHoverAccept, setIsHoverAccept] = useState(false);

  const handleAddFriend = async () => {
    console.log("clicked");
    const friendRequest = {
      sender: AdminId,
      receiver: UserId,
      result: false,
    };
    await firebase
      .firestore()
      .collection("newFriendRequest")
      .add({ friendRequest });
    setTimeout(() => {
      NotificationManager.success("Request Send ...", "Success");
    }, 1000);
  };
  const handleAcceptFriendRequest = async () => {
    try {
      // Find the friend request document with the given receiver (AdminId)
      const friendRequestSnapshot = await firebase
        .firestore()
        .collection("newFriendRequest")
        .where("friendRequest.receiver", "==", AdminId)
        .get();

      // Check if there's any friend request from the sender (UserId)
      const friendRequest = friendRequestSnapshot.docs.find(
        (doc) => doc.data().friendRequest.sender === UserId
      );

      if (friendRequest) {
        // Update the friend request result to true
        await firebase
          .firestore()
          .collection("newFriendRequest")
          .doc(friendRequest.id)
          .update({ "friendRequest.result": true });
        //admin friend list update
        const Adminsnapshot = await firebase
          .firestore()
          .collection("users")
          .where("id", "==", AdminId)
          .get();
        const adminDoc = Adminsnapshot.docs[0].data();
        const adminDocId = Adminsnapshot.docs[0].id;

        //user frined list update
        const UserSnapshot = await firebase
          .firestore()
          .collection("users")
          .where("id", "==", UserId)
          .get();
        const userDoc = UserSnapshot.docs[0].data();
        const userDocId = UserSnapshot.docs[0].id;

        //update the friend array for both users
        const UpdatedAdminFriendArray = [...adminDoc.friends, UserId];
        const UpdatedUserFriendArray = [...userDoc.friends, AdminId];
        await firebase
          .firestore()
          .collection("users")
          .doc(adminDocId)
          .update({ friends: UpdatedAdminFriendArray });
        await firebase
          .firestore()
          .collection("users")
          .doc(userDocId)
          .update({ friends: UpdatedUserFriendArray });

        //after updating the list delete it from the friend request
        await firebase
          .firestore()
          .collection("newFriendRequest")
          .doc(friendRequest.id)
          .delete();
        // Show a success notification
        setTimeout(() => {
          NotificationManager.success("Request Accepted...", "Success");
        }, 1000);
      } else {
        // If the friend request is not found
        console.log("Friend request not found for the given sender.");
      }
    } catch (error) {
      console.error("Error accepting friend request:", error);
      setTimeout(() => {
        NotificationManager.error("Failed in Accepting Request..", "Error");
      }, 1000);
    }
  };
  const handlerejectFriendRequest = async () => {
    try {
      // Find the friend request document with the given receiver (AdminId)
      const friendRequestSnapshot = await firebase
        .firestore()
        .collection("newFriendRequest")
        .where("friendRequest.receiver", "==", AdminId)
        .get();

      // Check if there's any friend request from the sender (UserId)
      const friendRequest = friendRequestSnapshot.docs.find(
        (doc) => doc.data().friendRequest.sender === UserId
      );
      if (friendRequest) {
        await firebase
          .firestore()
          .collection("newFriendRequest")
          .doc(friendRequest.id)
          .delete();
        // Show a success notification
        setTimeout(() => {
          NotificationManager.success("Request Declined....", "Success");
        }, 1000);
      }
    } catch (err) {
      console.log(err);
    }
  };
  const handleBlockFriend = async () => {
    try {
      const Adminsnapshot = await firebase
        .firestore()
        .collection("users")
        .where("id", "==", AdminId)
        .get();
      const adminDoc = Adminsnapshot.docs[0].data();
      const adminDocId = Adminsnapshot.docs[0].id;

      const UserSnapshot = await firebase
        .firestore()
        .collection("users")
        .where("id", "==", UserId)
        .get();
      const userDoc = UserSnapshot.docs[0].data();
      const userDocId = UserSnapshot.docs[0].id;

      // Remove the user ID from the admin's friend array
      const updatedAdminFriendArray = adminDoc.friends.filter(
        (friendId) => friendId !== UserId
      );

      // Remove the admin ID from the user's friend array
      const updatedUserFriendArray = userDoc.friends.filter(
        (friendId) => friendId !== AdminId
      );

      await firebase
        .firestore()
        .collection("users")
        .doc(adminDocId)
        .update({ friends: updatedAdminFriendArray });
      await firebase
        .firestore()
        .collection("users")
        .doc(userDocId)
        .update({ friends: updatedUserFriendArray });

      // Show a success notification
      setTimeout(() => {
        NotificationManager.success("User Blocked...", "Success");
      }, 1000);
    } catch (error) {
      console.error("Error blocking friend:", error);
      setTimeout(() => {
        NotificationManager.error("Unable to block USer..", "Error");
      }, 1000);
    }
  };

  return (
    <div>
      <NotificationContainer />
      <section key={UserId}>
        <div className={Styles.box}>
          <i
            className={`fa-solid fa-circle fa-xs ${Styles.onlineStatusDot}`}
            style={onlineStatus}
          ></i>
          <img src={UserPhoto} alt="friend-img" className={Styles.img} />
          <div className={Styles.insideDiv}>
            <h1 className={Styles.H1}>{UserName}</h1>
            {friendship ? (
              <button
                className={Styles.add}
                onMouseEnter={() => setIsHover(true)}
                onMouseLeave={() => setIsHover(false)}
                onClick={handleBlockFriend}
              >
                <i
                  className="fa-solid fa-ban"
                  style={isHover ? hoverColor : null}
                ></i>
              </button>
            ) : !relationship ? (
              <>
                <button
                  className={Styles.add}
                  onMouseEnter={() => setIsHoverAccept(true)}
                  onMouseLeave={() => setIsHoverAccept(false)}
                  onClick={handleAcceptFriendRequest}
                >
                  <i
                    className="fa-solid fa-check-to-slot"
                    style={isHoverAccept ? hoverColor : null}
                  ></i>
                </button>
                <button
                  className={Styles.add}
                  onMouseEnter={() => setIsHoverCross(true)}
                  onMouseLeave={() => setIsHoverCross(false)}
                  onClick={handlerejectFriendRequest}
                >
                  <i
                    className="fa-solid fa-x"
                    style={isHoverCross ? { color: "red" } : null}
                  ></i>
                </button>
              </>
            ) : (
              <button
                className={Styles.add}
                onMouseEnter={() => setIsHover(true)}
                onMouseLeave={() => setIsHover(false)}
                onClick={() => handleAddFriend(UserId, UserName)}
              >
                <i
                  className="fa-solid fa-plus"
                  style={isHover ? hoverColor : null}
                ></i>
              </button>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}

export default FriendList;
