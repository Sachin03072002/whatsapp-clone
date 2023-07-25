import React, { useState, useEffect } from "react";
import Select from "react-select";

function Navbar({ friendName, backColor, friendPhoto, conversation }) {
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
    <nav
      className="navbar navbar-light"
      style={{ borderRadius: "1rem", backgroundColor: backColor }}
    >
      <div className="container-fluid">
        <div className="d-flex flex-grow justify-content-center">
          <img
            src="https://pluspng.com/img-png/user-png-icon-young-user-icon-2400.png"
            alt="."
            style={{ borderRadius: "50%", width: "75px" }}
          />
          <span className="mx-3 display-5">{friendName}</span>
        </div>
        {searchMessage && (
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
            }}
          />
        )}
      </div>
    </nav>
  );
}

export default Navbar;
