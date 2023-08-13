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
    const intervalId = setInterval(() => {
      setCurrentIndex((prevIndex) =>
        prevIndex === statusData?.file?.length - 1 ? 0 : prevIndex + 1
      );
    }, 30000);

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
              className={Styles.carouselContainer} // Apply custom CSS class for styling
            >
              {statusData.file.map((image, index) => (
                <div key={index} className={Styles.carouselItem}>
                  <img
                    src={image.image} // Update to the correct image source
                    key={index}
                    alt={`Status`}
                    className={Styles.statusImg}
                  />
                  {image.text && (
                    <p className={`legend ${Styles.legend}`}>
                      {image.text}{" "}
                      {/* Display the text associated with the image */}
                    </p>
                  )}
                </div>
              ))}
            </Carousel>
          )}
        </div>
      )}
    </div>
  );
}

export default StatusViewer;
