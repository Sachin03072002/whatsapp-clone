import React from "react";
import Styles from "../assets/css/HomePage.module.css";

import Login from "./Login";
function HomePage() {
  return (
    <React.Fragment>
      <main className={Styles.homeMain}>
        <section className={Styles.homeSection}>
          <img
            src="https://venticaremedicalinc.com/wp-content/uploads/2018/06/whatsapp_PNG1-1-600x587.png"
            alt="friends"
            className={Styles.homeImg}
          />
          <Login />
        </section>
      </main>
    </React.Fragment>
  );
}

export default HomePage;
