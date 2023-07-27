import React, { useEffect, useState } from "react";
import Styles from "../assets/css/Profile.module.css";
import { useParams } from "react-router-dom";
import firebase from "firebase/compat/app";
import "firebase/compat/firestore";

function Profile() {
  const params = useParams();
  const adminId = params.AdminId;
  const [adminData, setAdminData] = useState(null);
  const [newImage, setNewImage] = useState(null); // State to store the new image file
  const [dpPreview, setDpPreview] = useState(null);

  const [showForm, setShowForm] = useState(false); // State to control form visibility

  // Function to handle the profile picture file change
  // const handleFileChange = (event) => {
  //   const file = event.target.files[0];
  //   if (file) {
  //     const reader = new FileReader();
  //     reader.onloadend = () => {
  //       setDpPreview(reader.result); // Update the preview with the selected file
  //     };
  //     reader.readAsDataURL(file);
  //     setNewImage(file); // Set the new image for updating later
  //   }
  // };

  useEffect(() => {
    (async () => {
      const adminSnapshot = await firebase
        .firestore()
        .collection("users")
        .where("id", "==", adminId)
        .get();

      if (!adminSnapshot.empty) {
        setAdminData(adminSnapshot.docs[0].data());
        setDpPreview(adminData.photo);
      } else {
        // Handle the case where the admin with the given ID is not found
        console.log("Admin not found.");
      }
    })();
  }, [adminId]);

  const updateImage = async () => {
    console.log("ia am loaded");
    // Check if a new image is selected before proceeding
    if (newImage) {
      try {
        // Update the 'photo' field in Firestore with the new image URL
        await firebase.firestore().collection("users").doc(adminId).update({
          photo: newImage.name,
        });

        console.log("Image updated successfully!");

        // Hide the form after submitting
        setShowForm(false);
        setNewImage(null); // Reset the new image state
      } catch (error) {
        console.error("Error updating image: ", error);
      }
    }
  };

  // const handleImageChange = (e) => {
  //   const file = e.target.files[0];
  //   setNewImage(file);
  // };

  return (
    <div className={Styles.container}>
      <div className={Styles.DetailsGrid}>
        <div className={Styles.photoGrid}>
          {adminData && dpPreview && (
            <>
              <img
                src={adminData.photo ? adminData.photo : dpPreview}
                alt="profile"
                className={Styles.img}
                onClick={() => setShowForm(!showForm)}
              />
            </>
          )}

          {showForm && (
            <form className={Styles.form}>
              <input
                type="file"
                // onChange={handleImageChange}
              />
              <button
                type="button"
                onClick={updateImage}
                className={Styles.button}
              >
                <i className="fa-solid fa-check-double"></i>
              </button>
              <button
                type="button"
                onClick={() => {
                  setNewImage(null); // Reset the new image state when canceling
                }}
                className={Styles.button}
              >
                <i className="fa-solid fa-xmark"></i>
              </button>
            </form>
          )}
        </div>
        <div className={Styles.info}></div>
      </div>
      <div className={Styles.friendList}></div>
    </div>
  );
}

export default Profile;
