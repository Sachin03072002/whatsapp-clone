import React, { useState } from "react";
import Styles from "../assets/css/HomePage.module.css";
import { useNavigate } from "react-router-dom";
import firebase from "firebase/compat/app";
import "firebase/compat/firestore";
function Login() {
  const [emailId, setEmailId] = useState();
  const [password, setPassword] = useState();
  const navigate = useNavigate();
  async function onSubmitHandler(event) {
    event.preventDefault();

    // Validate that both emailId and password have values
    if (!emailId || !password) {
      console.log(emailId);
      console.log(password);
      console.error("emailId and password are required.");
      return;
    }

    // Separate where clauses for emailId and password
    const snapshot = await firebase
      .firestore()
      .collection("users")
      .where("email", "==", emailId)
      .where("password", "==", password)
      .get();

    if (snapshot.docs.length > 0) {
      console.log(snapshot.docs);
      const docId = snapshot.docs[0].id;
      const doc = snapshot.docs[0].data();
      console.log(doc);
      navigate(`/whatsapp/${doc.id}`);
      await firebase
        .firestore()
        .collection("users")
        .doc(docId)
        .update({ status: true });
    } else {
      navigate("/whatsappweb/signup");
      console.log("redirected");
    }
  }

  return (
    <div>
      <form className={Styles.homeForm} onSubmit={onSubmitHandler}>
        <h1>Welcome to Whatsapp</h1>
        <input
          type="text"
          className="form-control my-3"
          id="inputEmail3"
          placeholder="Enter ID..."
          required
          value={emailId}
          onChange={(e) => {
            setEmailId(e.target.value);
          }}
        />
        <input
          type="password"
          className="form-control my-3"
          id="password"
          placeholder="Enter Your Password.."
          required
          value={password}
          onChange={(e) => {
            setPassword(e.target.value);
          }}
        />
        <div className="d-flex justify-content-between w-100">
          <button className="button" type="submit">
            Log In
          </button>
          <button
            type="button"
            className="button"
            onClick={() => {
              setEmailId("");
              setPassword("");
            }}
          >
            Clear
          </button>
          <button
            type="button"
            className="button-signup"
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
