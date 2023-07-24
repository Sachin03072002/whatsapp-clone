import React, { useState } from "react";
import Styles from "../assets/css/HomePage.module.css";
import firebase from "firebase/compat/app";
import "firebase/compat/firestore";
import { useNavigate } from "react-router-dom"; // Import Redirect for redirection
import { v4 as uuidv4 } from "uuid";
import {
  NotificationContainer,
  NotificationManager,
} from "react-notifications";
import "react-notifications/lib/notifications.css";

function Signup() {
  const [dpPreview, setDpPreview] = useState(
    "https://askmescript.com/upload/photos/2020/04/EZQXmD79fDXYYB7CpoDb_22_2564e94001831683083bda12432b7e56_image.png"
  ); // State to hold the profile picture preview
  const navigate = useNavigate();

  // Function to handle the profile picture file change
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setDpPreview(reader.result); // Update the preview with the selected file
      };
      reader.readAsDataURL(file);
    }
  };

  // Function to handle the user details form submission
  const handleUserDetailsSubmit = async (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);

    if (formData.get("password") === formData.get("confirmPassword")) {
      const userData = {
        id: uuidv4(),
        name: formData.get("name"),
        email: formData.get("email"),
        password: formData.get("password"),
        photo: dpPreview,
        status: true,
        friends: [],
      };
      const userAvailable = await firebase
        .firestore()
        .collection("users")
        .where("email", "==", userData.email)
        .get();
      if (userAvailable.docs.length > 0) {
        //notification
        navigate("/");
        setTimeout(() => {
          NotificationManager.success("User Already Exist", "Success");
        }, 1000);
      } else {
        const newUserRef = await firebase
          .firestore()
          .collection("users")
          .add(userData);
        console.log("New user Added", newUserRef.id);
        navigate("/");
        setTimeout(() => {
          NotificationManager.success("User Added Successfully", "Success");
        }, 1000);
      }
    } else {
      //notification
      setTimeout(() => {
        NotificationManager.error("Invalid Credentials", "Error");
      }, 1000);
    }
    event.target.reset();

    // Reset the dpPreview state to the initial value
    setDpPreview(
      "https://askmescript.com/upload/photos/2020/04/EZQXmD79fDXYYB7CpoDb_22_2564e94001831683083bda12432b7e56_image.png"
    );
  };

  // Function to handle the profile picture form submission
  const handleDpSubmit = (event) => {
    event.preventDefault();
    const dpFile = event.target.dpInput.files[0];
    console.log(dpFile);
  };

  return (
    <React.Fragment>
      <NotificationContainer />
      <main className={Styles.homeMain}>
        <h1>Create New Account..</h1>
        <section className={Styles.homeSection}>
          <form onSubmit={handleDpSubmit} className={Styles.Dpform}>
            <label htmlFor="dpInput">
              Profile Picture:
              <input
                type="file"
                id="dpInput"
                accept="image/*"
                style={{ display: "none" }}
                onChange={handleFileChange}
              />
            </label>
            {dpPreview && (
              <img
                src={dpPreview}
                alt="Profile Preview"
                className={Styles.DpImg}
              />
            )}
            <br />
            <button type="submit">Upload</button>
          </form>
          <form
            onSubmit={handleUserDetailsSubmit}
            className={Styles.DetailsForm}
          >
            <label htmlFor="name">
              Full Name:&nbsp;
              <input type="text" name="name" required />
            </label>
            <br />
            <label htmlFor="email">Email Address:</label>&nbsp;
            <input type="email" name="email" required />
            <br />
            <label htmlFor="password">Password:</label>&emsp;
            <input type="password" name="password" required />
            <br />
            <label htmlFor="confirmPassword">Confirm Password:</label>
            &nbsp;
            <input type="password" name="confirmPassword" required />
            <br />
            <button type="submit">Submit</button>
            <button>
              <a href="/" onClick={navigate("/")}>
                Login
              </a>
            </button>
          </form>
        </section>
      </main>
    </React.Fragment>
  );
}

export default Signup;
