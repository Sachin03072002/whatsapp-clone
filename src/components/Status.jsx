import React, { useCallback, useEffect, useState } from "react";
import Styles from "../assets/css/Status.module.css";
import { v4 as uuidv4 } from "uuid";
import Modal from "react-modal";
import firebase from "firebase/compat/app";
import "firebase/compat/firestore";
import StatusList from "./StatusList";
import {
  NotificationContainer,
  NotificationManager,
} from "react-notifications";
import "react-notifications/lib/notifications.css";
function Status({ adminId, adminPhoto, adminName, checkRecentUpdate }) {
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalText, setModalText] = useState("");
  const [imagePreview, setImagePreview] = useState(null);
  const [otherStatus, setOtherStatus] = useState(null);
  const handleModalSubmit = async () => {
    await UpdateStatus();
    setIsModalOpen(false);
    fetchStatusInfo();
    checkRecentUpdate(true);
  };

  // Function to handle the profile picture file change
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.readAsDataURL(file);

      reader.onload = () => {
        // setStatus(file); // Set the new image for updating later
        setImagePreview(reader.result); // Set the image preview URL
      };
    }
  };

  const UpdateStatus = async () => {
    const statusSnapshot = {
      id: uuidv4(),
      adminId: adminId,
      adminName: adminName,
      adminPhoto: adminPhoto,
      file: imagePreview ? [imagePreview] : [],
      text: modalText,
      visitor: [],
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
    };
    await firebase.firestore().collection("status").add({ statusSnapshot });
    setTimeout(() => {
      NotificationManager.success("Status Updated...", "Success");
    }, 1000);
    console.log("updatd");
  };
  const updateVisitorArray = async (statusId) => {
    try {
      // Fetch the status document by ID
      const statusSnapshot = await firebase
        .firestore()
        .collection("status")
        .where("statusSnapshot.id", "==", statusId)
        .get();

      // Check if the status document exists
      if (!statusSnapshot.empty) {
        const statusDoc = statusSnapshot.docs[0];
        const statusDocRef = statusDoc.ref;

        const statusData = statusDoc.data().statusSnapshot;
        const updatedVisitorArray = statusData.visitor || [];

        if (!updatedVisitorArray.includes(adminId)) {
          updatedVisitorArray.push(adminId);
          await statusDocRef.update({
            "statusSnapshot.visitor": updatedVisitorArray,
          });
        }
      }
    } catch (error) {
      console.log("Error updating visitor array:", error);
    }
  };
  const handleDeleteStatus = async () => {
    try {
      const statusSnapshot = await firebase
        .firestore()
        .collection("status")
        .where("statusSnapshot.adminId", "==", adminId)
        .get();
      const id = statusSnapshot.docs[0].id;
      await firebase.firestore().collection("status").doc(id).delete();
      setStatus((prevStatus) => prevStatus.filter((item) => item.id !== id));
      setTimeout(() => {
        NotificationManager.success("Deleted Successfully", "Success");
      }, 1000);
    } catch (error) {
      setTimeout(() => {
        NotificationManager.error("Error Occured", "Error");
      }, 1000);
      console.log(error);
    }
  };
  const fetchStatusInfo = useCallback(async () => {
    try {
      const statusSnapshot = await firebase
        .firestore()
        .collection("status")
        .where("statusSnapshot.adminId", "==", adminId)
        .get();

      if (!statusSnapshot.empty) {
        const statusData = statusSnapshot.docs.map(
          (doc) => doc.data().statusSnapshot
        );

        setStatus(statusData);
      }
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching status data:", error);
    }
  }, [adminId]);
  useEffect(() => {
    const deleteExpiredStatuses = async () => {
      try {
        const statusSnapshot = await firebase
          .firestore()
          .collection("status")
          .where("statusSnapshot.adminId", "==", adminId)
          .get();

        if (!statusSnapshot.empty) {
          const now = firebase.firestore.Timestamp.now();
          const statusesToDelete = [];

          statusSnapshot.forEach((doc) => {
            const statusData = doc.data().statusSnapshot;
            const createdAt = statusData.createdAt;
            const twentyFourHoursInMs = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

            if (
              createdAt &&
              now.toMillis() - createdAt.toMillis() >= twentyFourHoursInMs
            ) {
              statusesToDelete.push(doc.id);
            }
          });

          if (statusesToDelete.length > 0) {
            const batch = firebase.firestore().batch();
            statusesToDelete.forEach((statusId) => {
              const statusRef = firebase
                .firestore()
                .collection("status")
                .doc(statusId);
              batch.delete(statusRef);
            });
            await batch.commit();
            NotificationManager.success("Expired statuses deleted.", "Success");
          }
        }
      } catch (error) {
        console.log("Error deleting expired statuses:", error);
      }
    };

    const otherStatusInfo = async () => {
      try {
        const currentUserSnapshot = await firebase
          .firestore()
          .collection("users")
          .where("id", "==", adminId)
          .get();

        const currentUserData = currentUserSnapshot.docs[0].data();
        const friendsArray = currentUserData.friends || [];

        if (friendsArray.length === 0) {
          // If friendsArray is empty, set otherStatus to an empty object and return
          setOtherStatus({ updatedStatus: [], recentUpdate: [] });
          setIsLoading(false);
          return;
        }

        const OtherSnapshot = await firebase
          .firestore()
          .collection("status")
          .where("statusSnapshot.adminId", "in", friendsArray)
          .get();

        if (!OtherSnapshot.empty) {
          const statusData = OtherSnapshot.docs.map(
            (doc) => doc.data().statusSnapshot
          );

          // Loop over the status data to check if the current user is in the visitor array
          const updatedStatus = [];
          const recentUpdate = [];
          statusData.forEach((item) => {
            const updatedItem = { ...item };
            if (item.visitor.includes(adminId)) {
              // If the current user id is present in the visitor array, update that in updatedStatus

              updatedStatus.push(updatedItem);
            } else {
              // Otherwise, put that in recentUpdate

              recentUpdate.push(updatedItem);
            }
          });
          if (recentUpdate.length > 0) {
            checkRecentUpdate(true);
          } else {
            checkRecentUpdate(false);
          }

          setOtherStatus({ updatedStatus, recentUpdate });
        }

        setIsLoading(false);
      } catch (error) {
        console.log("Error fetching others status Data:", error);
      }
    };
    const interval = setInterval(deleteExpiredStatuses, 3600000);
    deleteExpiredStatuses();

    otherStatusInfo();
    fetchStatusInfo();
    return () => clearInterval(interval);
  }, [adminId, fetchStatusInfo, checkRecentUpdate]);

  return (
    <div>
      <NotificationContainer />
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
        <hr className={Styles.horizontal} />
      </div>
      <div className={Styles.statusList}>
        {isLoading ? (
          <div>
            <img
              src="https://edumars.net/skin/web/images/loading.gif"
              className={Styles.loader}
              alt="loader"
            />
          </div>
        ) : (
          <>
            <div className={Styles.MyStatus}>
              <p>My Status</p>
              {status &&
                status.length > 0 &&
                status.map((item, key) => (
                  <StatusList
                    key={key}
                    statusId={item.id}
                    adminId={adminId}
                    adminPhoto={item.adminPhoto}
                    text={item.text}
                    statusImg={item.file}
                    adminName="My Status"
                    currentUser={adminId}
                    updateVisitorArray={updateVisitorArray}
                    handleDeleteStatus={handleDeleteStatus}
                    isdelete={true}
                  />
                ))}
            </div>

            <div className={Styles.recentUpdate}>
              <p>Recent Update</p>
              <hr />
              {otherStatus &&
                otherStatus.recentUpdate &&
                otherStatus.recentUpdate.map((item, key) => (
                  <StatusList
                    key={key}
                    statusId={item.id}
                    adminId={adminId}
                    adminPhoto={item.adminPhoto}
                    text={item.text}
                    statusImg={item.file}
                    adminName={item.adminName}
                    updateVisitorArray={updateVisitorArray}
                    isRecent={true}
                  />
                ))}
            </div>
            <div className={Styles.viewedUpdate}>
              <p>Viewed Update</p>
              <hr />
              {otherStatus &&
                otherStatus.updatedStatus &&
                otherStatus.updatedStatus.map((item, key) => (
                  <StatusList
                    key={key}
                    statusId={item.id}
                    adminId={adminId}
                    adminPhoto={item.adminPhoto}
                    text={item.text}
                    statusImg={item.file}
                    adminName={item.adminName}
                    updateVisitorArray={updateVisitorArray}
                  />
                ))}
            </div>
            <div className={Styles.icons}>
              <button
                className={Styles.photoSelect}
                onClick={() => setIsModalOpen(true)}
              >
                <i className="fa-solid fa-camera-retro"></i>
              </button>
            </div>

            <Modal
              isOpen={isModalOpen}
              onRequestClose={() => setIsModalOpen(false)}
              className={Styles.customModalStyles}
              ariaHideApp={false}
            >
              <input
                type="file"
                id="dpInput"
                accept="image/*"
                className={Styles.Imginput}
                onChange={handleFileChange}
              />
              {imagePreview && (
                <img
                  src={imagePreview}
                  alt="Preview"
                  className={Styles.imagePreview}
                />
              )}
              <input
                type="text"
                value={modalText}
                onChange={(e) => setModalText(e.target.value)}
                placeholder="Enter your status here"
              />
              <button onClick={handleModalSubmit}>Submit</button>
              <button onClick={() => setIsModalOpen(false)}>Cancel</button>
            </Modal>
          </>
        )}
      </div>
    </div>
  );
}

export default Status;
