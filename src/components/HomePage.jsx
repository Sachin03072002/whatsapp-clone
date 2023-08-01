import React from "react";
import Styles from "../assets/css/HomePage.module.css";
import Logo from "../assets/images/logo.png";
import Login from "./Login";
function HomePage() {
  return (
    <React.Fragment>
      <main className={Styles.homeMain}>
        <section className={Styles.homeSection}>
          <img src={Logo} alt="friends" className={Styles.homeImg} />
          <Login />
        </section>
      </main>
    </React.Fragment>
  );
}

export default HomePage;
