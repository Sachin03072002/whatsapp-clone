import React from "react";
import Styles from "../assets/css/Navbar.module.css";
import { useNavigate } from "react-router-dom";
function Navbar({
  friendName,
  backColor,
  friendPhoto,
  conversation,
  friendStatus,
  inputFcoused,
}) {
  // const [searchMessage, setSearchMessage] = useState([]);
  const navigate = useNavigate();
  // useEffect(() => {
  //   if (conversation) {
  //     const collegeList = conversation.map((item) => {
  //       return {
  //         value: item.message,
  //         label: item.message,
  //       };
  //     });
  //     // setSearchMessage([...collegeList]);
  //   }
  // }, [conversation]);
  const handleBack = async () => {
    await navigate(-1);
  };

  return (
    <nav style={{ backgroundColor: backColor }} className={Styles.nav}>
      <div className="container-fluid">
        <div className={Styles.dp}>
          <img src={friendPhoto} alt="." className={Styles.dp} />
          <span className={Styles.name}>
            {friendName}
            <br />
            {inputFcoused ? "Typing.." : friendStatus ? "Online" : "Offline"}
          </span>
          <i
            className={`fa-solid fa-arrow-right-to-bracket ${Styles.back}`}
            onClick={handleBack}
          ></i>
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
