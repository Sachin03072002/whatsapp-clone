import React, { useEffect, useState } from "react";
import Styles from "../assets/css/Profile.module.css";
import { useNavigate, useParams } from "react-router-dom";
import firebase from "firebase/compat/app";
import "firebase/compat/firestore";
import "firebase/compat/storage";
import FriendAside from "./FriendAside";
import FriendList from "./FriendList";

function Profile() {
  const params = useParams();
  const adminId = params.AdminId;
  const navigate = useNavigate();
  const [adminData, setAdminData] = useState(null);
  const [newImage, setNewImage] = useState(null); // State to store the new image file
  const [showPen, setShowPen] = useState(false);
  const [showForm, setShowForm] = useState(false); // State to control form visibility
  const [isEditMode, setIsEditMode] = useState(false);
  const [loading, setLoading] = useState(true);
  const [friendList, setFriendList] = useState([]);

  const handlePageChange = () => {
    navigate(-1);
  };
  // Function to handle the profile picture file change
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();

      reader.readAsDataURL(file);
      setNewImage(file); // Set the new image for updating later
    }
  };

  useEffect(() => {
    const fetchAdminData = async () => {
      try {
        const adminSnapshot = await firebase
          .firestore()
          .collection("users")
          .where("id", "==", adminId)
          .get();

        if (!adminSnapshot.empty) {
          setAdminData(adminSnapshot.docs[0].data() || []);
          // setDpPreview(adminData.photo);
        } else {
          // Handle the case where the admin with the given ID is not found
          console.log("Admin not found.");
        }
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };
    fetchAdminData();

    const intervalId = setInterval(async () => {
      const tempSnapshot = [];
      const LoginUserSnapshot = await firebase
        .firestore()
        .collection("users")
        .where("id", "!=", adminId)
        .get();
      LoginUserSnapshot.docs.forEach((doc) => {
        tempSnapshot.push(doc.data());
      });
      if (tempSnapshot) {
        setFriendList(tempSnapshot);
      } else {
        console.log("no data found");
      }
    }, 1000);

    return () => {
      clearInterval(intervalId);
    };
  }, [adminId]);

  async function onLogOutHandler() {
    const snapshot = await firebase
      .firestore()
      .collection("users")
      .where("id", "==", adminId)
      .get();
    const docId = snapshot.docs[0].id;
    await firebase
      .firestore()
      .collection("users")
      .doc(docId)
      .update({ status: false });
    navigate("/");
  }

  const updateImage = async () => {
    if (newImage) {
      try {
        // Upload the new image to Firebase Storage and get the download URL
        const storageRef = firebase.storage().ref();
        const imageRef = storageRef.child(newImage.name);
        await imageRef.put(newImage);
        const photoURL =
          (await imageRef.getDownloadURL()) + "?t=" + new Date().getTime(); // Add the timestamp query parameter

        // Update the 'photo' field in Firestore with the new image URL
        const snapshot = await firebase
          .firestore()
          .collection("users")
          .where("id", "==", adminId)
          .get();
        const docId = snapshot.docs[0].id;
        await firebase
          .firestore()
          .collection("users")
          .doc(docId)
          .update({ photo: photoURL });

        console.log("Image updated successfully!");

        // Hide the form after submitting
        setShowForm(false);
        setNewImage(null); // Reset the new image state
      } catch (error) {
        console.error("Error updating image: ", error);
      }
    }
  };

  const handleUpdateForm = async (e) => {
    e.preventDefault();
    const UpdateFormData = new FormData(e.target);

    const snapshot = await firebase
      .firestore()
      .collection("users")
      .where("id", "==", adminId)
      .get();
    const docId = snapshot.docs[0].id;
    await firebase
      .firestore()
      .collection("users")
      .doc(docId)
      .update({ name: UpdateFormData.get("name") });
    setIsEditMode(!isEditMode);
    console.log("updated");
  };

  return (
    <div className={Styles.container}>
      {loading ? (
        <div>Loading...</div>
      ) : (
        <div className={Styles.DetailsGrid}>
          <button className={Styles.back} onClick={handlePageChange}>
            <i className="fa-solid fa-arrow-left"></i>
          </button>
          <div className={Styles.photoGrid}>
            <button className={Styles.poweroff} onClick={onLogOutHandler}>
              <i className="fa-solid fa-power-off"></i>
            </button>
            {adminData && (
              <>
                <img
                  src={adminData.photo}
                  alt="profile"
                  className={Styles.img}
                  onMouseEnter={() => setShowPen(true)}
                  onMouseLeave={() => setShowPen(false)}
                  onClick={() => setShowForm(!showForm)}
                />
              </>
            )}
            {showPen && (
              <button className={Styles.penButton}>
                <i className="fa-solid fa-pen"></i>
              </button>
            )}

            {showForm && (
              <form className={Styles.form}>
                <input
                  type="file"
                  id="dpInput"
                  accept="image/*"
                  className={Styles.Imginput}
                  onChange={handleFileChange}
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
          <div className={Styles.info}>
            <h2 className={Styles.heading}>Personal Details</h2>
            <form onSubmit={handleUpdateForm}>
              <label htmlFor="name">
                Full Name:&nbsp;
                <input
                  type="text"
                  name="name"
                  value={adminData.name}
                  onChange={(e) =>
                    setAdminData({ ...adminData, name: e.target.value })
                  }
                  className={Styles.input}
                  required
                  disabled={!isEditMode} // Disable the input field based on edit mode
                />
              </label>
              <br />
              <label htmlFor="name">
                Email:&emsp;&emsp;
                <input
                  type="text"
                  name="email"
                  value={adminData.email}
                  className={Styles.input}
                  required
                />
              </label>
              <br />
              {isEditMode ? (
                <div>
                  <button className={Styles.saveButton}>Save Changes </button>
                </div>
              ) : (
                <></>
              )}
            </form>
            <button
              className={Styles.edit}
              onClick={() => setIsEditMode(!isEditMode)}
            >
              <i className="fa-solid fa-user-pen"></i>
            </button>
          </div>
        </div>
      )}
      <hr className={Styles.divider} />
      <div className={Styles.friendList}>
        <h2 className={Styles.heading}>FriendList</h2>
        <hr />
        <input
          type="search"
          name="search"
          id="search"
          placeholder="Search..."
          className={Styles.search}
        />
        <div className={Styles.friendsList}>
          {loading ? (
            <p>Loading...</p>
          ) : friendList.length > 0 ? (
            friendList.map((item, i) => (
              <FriendList
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
    </div>
  );
}

export default Profile;
