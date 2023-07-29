import React, { useState, useEffect } from "react";
import Styles from "../assets/css/Navbar.module.css";
function Navbar({
  friendName,
  backColor,
  friendPhoto,
  conversation,
  friendStatus,
  inputFcoused,
}) {
  const [searchMessage, setSearchMessage] = useState([]);

  useEffect(() => {
    if (conversation) {
      const collegeList = conversation.map((item) => {
        return {
          value: item.message,
          label: item.message,
        };
      });
      setSearchMessage([...collegeList]);
    }
  }, [conversation]);
  return (
    <nav style={{ borderRadius: "1rem", backgroundColor: backColor }}>
      <div className="container-fluid">
        <div className="">
          <img src={friendPhoto} alt="." className={Styles.dp} />
          <span className={Styles.name}>
            {friendName}
            <br />
            {inputFcoused ? "Typing.." : friendStatus ? "Online" : "Offline"}
          </span>
        </div>
        {/* {searchMessage && (
          <Select
            options={searchMessage}
            isClearable
            isSearchable
            style={{
              container: (base) => ({
                ...base,
                width: "40%",
                minWidth: 400,
                marginRight: "25px",
              }),
            }} */}
        {/* /> )} */}
      </div>
    </nav>
  );
}

export default Navbar;
