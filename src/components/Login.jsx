import React, { useState } from "react";
import Styles from "../assets/css/HomePage.module.css";
import { useNavigate } from "react-router-dom";
import firebase from "firebase/compat/app";
import "firebase/compat/firestore";
import {
  NotificationContainer,
  NotificationManager,
} from "react-notifications";
import "react-notifications/lib/notifications.css";
function Login() {
  const [emailId, setEmailId] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  async function onSubmitHandler(event) {
    event.preventDefault();

    // Validate that both emailId and password have values
    if (!emailId || !password) {
      console.error("emailId and password are required.");
      setTimeout(() => {
        NotificationManager.error("Credentials Required", "Error");
      }, 1000);
      return;
    }

    // Check if the email exists in the database
    const snapshot = await firebase
      .firestore()
      .collection("users")
      .where("email", "==", emailId)
      .get();

    if (snapshot.docs.length > 0) {
      // Email exists in the database, now check for the password match
      const doc = snapshot.docs[0].data();
      if (doc.password === password) {
        // Password match, log in the user

        const docId = snapshot.docs[0].id;

        setTimeout(() => {
          NotificationManager.success("Successfully Logged In..", "Success");
        }, 1000);
        navigate(`/whatsappweb/${doc.id}`);
        await firebase
          .firestore()
          .collection("users")
          .doc(docId)
          .update({ status: true });
      } else {
        // Incorrect Password
        setTimeout(() => {
          NotificationManager.error("Incorrect Password", "Error");
        }, 1000);
        setPassword("");
      }
    } else {
      // User Not Found
      setTimeout(() => {
        NotificationManager.error("User Not Found", "Error");
      }, 1000);
      navigate("/whatsappweb/signup");
    }
  }

  return (
    <div>
      <NotificationContainer />
      <form className={Styles.homeForm} onSubmit={onSubmitHandler}>
        <h1>Welcome to Whatsapp</h1>
        <input
          type="text"
          className={Styles.input}
          id="inputEmail3"
          placeholder="Enter ID..."
          required
          value={emailId}
          onChange={(e) => setEmailId(e.target.value)}
        />
        <input
          type="password"
          className={Styles.input}
          id="password"
          placeholder="Enter Your Password.."
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <div className="d-flex justify-content-between w-100">
          <button className={Styles.button} type="submit">
            Log In
          </button>
          <button
            type="button"
            className={Styles.button}
            onClick={() => {
              setEmailId("");
              setPassword("");
            }}
          >
            Clear
          </button>
          <button
            type="button"
            className={Styles.button}
            onClick={() => {
              setEmailId("");
              setPassword("");
            }}
          >
            <a href="/whatsappweb/signup">SignUp...</a>
          </button>
        </div>
      </form>
    </div>
  );
}

export default Login;
