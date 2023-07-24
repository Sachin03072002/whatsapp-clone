import React from "react";
import { useNavigate } from "react-router-dom";
import Styles from "../assets/css/Admin.module.css";
function Admin({ adminId, adminName, adminPhoto, status }) {
  const Navigate = useNavigate();
  return (
    <React.Fragment>
      <div className={Styles.box}>
        <img
          src={adminPhoto}
          alt="."
          className={Styles.img}
          // onClick={Navigate()}
        />

        {/* <div className={Styles.insideDiv}>
          <h5 className={Styles.H1}>{adminName}</h5>
          <div className={Styles.outsideDiv}>
            <button
              //   onClick={onLogOutHandle
              type="button"
              className="btn btn-danger my-2"
            >
              <i className="fa-solid fa-right-from-bracket">&nbsp; Logout</i>
            </button>
          </div>
        </div> */}
        {/* <hr /> */}
      </div>
    </React.Fragment>
  );
}

export default Admin;
