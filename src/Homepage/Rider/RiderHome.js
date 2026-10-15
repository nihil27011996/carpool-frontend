import React, { useState, useEffect } from "react";
import styles from "./RiderHome.module.css";
import * as firebase from "../../Config/firebase-config.js";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import ProfilePicture from "./Component/ProfilePicture.js";
import { useSelector } from "react-redux";
import ProfileDetails from "../Rider/Component/ProfileDetails.js";
import { getRiderDetails } from "../../Utils/utils.js";
import Loader from "../../loaderComponent/Loader.js";

const RiderHome = () => {
  /*    const storedData = localStorage.getItem('rider');
  const driverData = JSON.parse(storedData); */
  const driverData = useSelector((state) => state.user.userData);
  const driverId = driverData.userId;
  const [profileData, setProfileData] = useState([]);
  const [error, setError] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [load, setLoad] = useState(true);

  useEffect(() => {
  const defaultImageUrl =
    "https://as2.ftcdn.net/v2/jpg/00/65/77/27/1000_F_65772719_A1UV5kLi5nCEWI0BNLLiFaBPEkUbv5Fv.jpg";

  const fetchImage = async (driverId) => {
    try {
      const userImageRef = await ref(
        firebase.storage,
        `${driverId}/${driverId}_profile_image`
      );
      return await getDownloadURL(userImageRef);
    } catch (error) {
      if (error.code === "storage/object-not-found") {
        return defaultImageUrl;
      } else {
        throw new Error("Failed to fetch image");
      }
    }
  };

  const calculateAverageRating = (ratings) => {
    if (Array.isArray(ratings) && ratings.length > 0) {
      const sum = ratings.reduce((acc, rating) => acc + rating, 0);
      return sum / ratings.length;
    }
    return 0;
  };

  const showProfileInformation = async () => {
    try {
      const response = await getRiderDetails(driverId, driverData.token);
      if (!response.ok) throw new Error("Failed to fetch profile data");

      const data = await response.json();
      setProfileData({ ...data, token: driverData.token });

      const imageUrl = await fetchImage(driverId);
      setImageUrl(imageUrl);

      const averageRating = calculateAverageRating(data.ratings);
      setProfileData({ ...data, token: driverData.token, averageRating });
      console.log(data.ratings);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoad(false);
    }
  };

    showProfileInformation();
  }, [driverId, driverData.token]);

  const handleImageUpload = async (data) => {
    const imageRef = ref(
      firebase.storage,
      `${driverId}/${driverId}_profile_image`
    );
    uploadBytes(imageRef, data)
      .then((image) => {
        getDownloadURL(image.ref)
          .then((downloadURL) => {
            setImageUrl(downloadURL);
          })
          .catch((error) => {
            console.error("Error getting download URL:", error);
          });
      })
      .catch((error) => {
        console.error("Error uploading image:", error);
      });
  };

  const handleClick = () => {
    document.getElementById("fileInput").click();
  };

  return (
    <div className={styles.riderHomeMainPage}>
      {load ? (
        <div
          style={{
            display: "flex", // Use flexbox to center the child component
            justifyContent: "center", // Center horizontally
            alignItems: "center", // Center vertically
            height: "100vh", // Make the div take the full height of the viewport
          }}
        >
          <Loader />
        </div>
      ) : (
        <div className={styles.homePageContainer}>
          <div className={styles.riderProfleContainer}>
            <div className={styles.riderCard}>
              <ProfilePicture
                imageUrl={imageUrl}
                handleClick={handleClick}
                handleImageUpload={handleImageUpload}
              />

              <div className={styles.riderProfileDetails}>
                <ProfileDetails profileData={profileData} />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RiderHome;
