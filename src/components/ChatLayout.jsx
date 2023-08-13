import React, { useEffect, useState } from "react";
import Styles from "../assets/css/ChatLayout.module.css";
import { Outlet, useParams } from "react-router-dom";
import firebase from "firebase/compat/app";
import "firebase/compat/firestore";
import Admin from "./Admin";
import FriendAside from "./FriendAside";
import Status from "./Status";
function ChatLayout() {
  const params = useParams();

  const adminId = params.adminId;

  const [userFriendData, setUserFriendData] = useState([]);

  const [adminData, setAdminData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSearch, setIsSearch] = useState(true);
  const [showStatus, setShowStatus] = useState(false);
  const [hasRecentUpdate, setHasRecentUpdate] = useState(false);
  const [isActive, setIsActive] = useState(true);
  // eslint-disable-next-line
  const userActivityEvents = ["mousemove", "mousedown", "keydown", "scroll"];

  // Callback function to receive the boolean value from Status component
  const handleCheckRecentUpdate = (hasUpdate) => {
    setHasRecentUpdate(hasUpdate);
  };
  const hideSearchBar = () => {
    setIsSearch(false);
  };
  const ViewUserStatus = () => {
    setShowStatus((val) => !val);
  };

  useEffect(() => {
    const setActive = () => {
      setIsActive(true);
    };
    const setInActive = () => {
      setIsActive(false);
    };
    //Attach event listeners to track activity
    userActivityEvents.forEach((event) => {
      document.addEventListener(event, setInActive);
    });
    const inActivityTimer = setInterval(() => {
      setInActive();
    }, 5000);
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
      userActivityEvents.forEach((event) => {
        document.removeEventListener(event, setActive);
      });
      clearInterval(friendIntervalId);
      clearInterval(inActivityTimer);
    };
    // eslint-disable-next-line
  }, [adminId, userActivityEvents]);
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
                ViewUserStatus={ViewUserStatus}
                hasUpdate={hasRecentUpdate}
                activity={isActive}
              />
            )}
          </div>
          <hr className={Styles.line} />
          <div className={Styles.div}>
            {showStatus ? (
              <Status
                adminId={adminData.id}
                adminPhoto={adminData.photo}
                adminName={adminData.name}
                checkRecentUpdate={handleCheckRecentUpdate}
              />
            ) : (
              <>
                {isSearch && (
                  <>
                    <div>
                      <h1 className={Styles.H1}>
                        <input
                          type="search"
                          name="search"
                          id="search-bar"
                          placeholder="Search.."
                          className={Styles.searchinput}
                        />
                      </h1>
                    </div>
                    <hr className={Styles.horizontal} />
                  </>
                )}
                <div className={Styles.friendList}>
                  {isLoading ? (
                    <div>
                      <img
                        src="https://edumars.net/skin/web/images/loading.gif"
                        className={Styles.loader}
                        alt="loader"
                      />
                    </div>
                  ) : userFriendData.length > 0 ? (
                    userFriendData.map((item, i) => (
                      <FriendAside
                        key={i}
                        UserId={item.id}
                        UserName={item.name}
                        UserPhoto={item.photo}
                        UserOnline={item.status}
                        hideSearchBar={hideSearchBar}
                      />
                    ))
                  ) : (
                    <p>No Data Found</p>
                  )}
                </div>
              </>
            )}
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
