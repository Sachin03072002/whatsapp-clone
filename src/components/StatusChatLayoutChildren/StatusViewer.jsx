import React, { useState, useEffect } from "react";
import Navbar from "../Navbar";
import { useParams } from "react-router-dom";
import Styles from "../../assets/css/StatusViewer.module.css";
import firebase from "firebase/compat/app";
import "firebase/compat/firestore";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";
function StatusViewer() {
  const params = useParams();
  const adminId = params.adminId;
  const statusId = params.statusId;
  const [adminData, setAdminData] = useState(null);
  const [statusData, setStatusData] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const fetchAdminData = async () => {
      try {
        const adminSnapshot = await firebase
          .firestore()
          .collection("users")
          .where("id", "==", adminId)
          .get();

        setAdminData(adminSnapshot.docs[0].data());
      } catch (err) {
        console.log("error", err);
      }
    };
    // Fetch the status data from Firestore
    const fetchStatusData = async () => {
      try {
        const statusSnapshot = await firebase
          .firestore()
          .collection("status")
          .where("statusSnapshot.id", "==", statusId)
          .get();

        if (!statusSnapshot.empty) {
          setStatusData(statusSnapshot.docs[0].data().statusSnapshot);
        }
      } catch (error) {
        console.error("Error fetching status data:", error);
      }
    };

    fetchAdminData();
    fetchStatusData();
  }, [adminId, statusId]);

  useEffect(() => {
    // Set interval to update the currentIndex every 30 seconds
    const intervalId = setInterval(() => {
      setCurrentIndex((prevIndex) =>
        prevIndex === statusData?.file?.length - 1 ? 0 : prevIndex + 1
      );
    }, 30000);

    // Clear the interval when the component unmounts
    return () => clearInterval(intervalId);
  }, [statusData]);
  return (
    <div>
      {adminData && (
        <Navbar
          friendName={adminData.name}
          friendPhoto={adminData.photo}
          friendStatus={adminData.status}
        />
      )}

      {statusData && (
        <div className={Styles.container}>
          {statusData.file && (
            <Carousel
              selectedItem={currentIndex}
              showStatus={false}
              showThumbs={false}
              autoPlay
              interval={15000}
            >
              {/* {statusData.file.map((image, index) => { */}
              {/* console.log(image); */}
              <div>
                <img
                  src={statusData.file[0]}
                  alt={`Status`}
                  className={Styles.statusImg}
                />
                <p className={`legend ${Styles.legend}`}>{statusData.text}</p>
              </div>
              ;{/* })} */}
            </Carousel>
          )}
        </div>
      )}
    </div>
  );
}

export default StatusViewer;
