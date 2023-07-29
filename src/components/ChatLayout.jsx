import React, { useEffect, useState } from "react";
import Styles from "../assets/css/ChatLayout.module.css";
import { Outlet, useParams } from "react-router-dom";
import firebase from "firebase/compat/app";
import "firebase/compat/firestore";
import Admin from "./Admin";
import FriendAside from "./FriendAside";
function ChatLayout() {
  const params = useParams();
  const adminId = params.AdminId;

  const [userFriendData, setUserFriendData] = useState([]);

  const [adminData, setAdminData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    //setting up the logged in current user
    (async () => {
      const adminSnapshot = await firebase
        .firestore()
        .collection("users")
        .where("id", "==", adminId)
        .get();
      setAdminData(adminSnapshot.docs[0].data());
    })();

    //setting up the logged in current user friend list
    const friendIntervalId = setInterval(async () => {
      try {
        const Friendsnapshot = await firebase
          .firestore()
          .collection("users")
          .where("id", "==", adminId) // Assuming your document IDs are the same as the user IDs
          .get();
        const userData = Friendsnapshot.docs[0].data();
        if (userData) {
          const friendIds = userData.friends;
          const friendDetails = [];
          const fetchFriends = async () => {
            const fetchPromises = friendIds.map(async (friendId) => {
              const friendsnapshot = await firebase
                .firestore()
                .collection("users")
                .where("id", "==", friendId)
                .get();
              const friendData = friendsnapshot.docs[0].data();
              return friendData;
            });
            return Promise.all(fetchPromises);
          };
          const friendDetailsData = await fetchFriends();
          friendDetailsData.forEach((friendData) => {
            friendDetails.push(friendData);
          });
          setUserFriendData(friendDetails);
        }

        setIsLoading(false);
      } catch (error) {
        console.error("Error retrieving user's friend list:", error);
        setIsLoading(false);
      }
    }, 1000);
    return () => {
      clearInterval(friendIntervalId);
    };
  }, [adminId]);
  return (
    <main className={Styles.main}>
      <section className={Styles.section}>
        <aside className={Styles.aside}>
          <div>
            {adminData && (
              <Admin
                adminId={adminData.id}
                adminName={adminData.name}
                adminPhoto={adminData.photo}
                status={adminData.status}
              />
            )}
          </div>
          <div className={Styles.div}>
            <h1 className="display-6 text-center my-5">
              <input
                type="search"
                name="search"
                id="search-bar"
                placeholder="Search.."
                className={Styles.searchinput}
              />
            </h1>
            <div className={Styles.friendList}>
              {isLoading ? (
                <p>Loading...</p>
              ) : userFriendData.length > 0 ? (
                userFriendData.map((item, i) => (
                  <FriendAside
                    key={i}
                    UserId={item.id}
                    UserName={item.name}
                    UserPhoto={item.photo}
                    UserOnline={item.status}
                  />
                ))
              ) : (
                <p>No Data Found</p>
              )}
            </div>
          </div>
        </aside>
        <div className={Styles.chatBox}>
          <Outlet />
        </div>
      </section>
    </main>
  );
}

export default ChatLayout;
