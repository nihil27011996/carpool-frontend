import React, { useState, useEffect } from "react";
import * as firebase from "../../Config/firebase-config.js";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import "../Driver/DriverHome.css";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { driverDetails } from "../../Utils/utils.js";
import DriverProfilePicture from "../Driver/Component/DriverProfilePicture.js";
import DriverProfileDetails from "../Driver/Component/DriverProfileDetails.js";
import Loader from "../../loaderComponent/Loader.js";
const DriverRide = () => {
  /*  const storedData = localStorage.getItem('driver');
  const driverData = JSON.parse(storedData); */

  const { userData } = useSelector((state) => state.user);
  const driverId = userData?.userId;
  const [profileData, setProfileData] = useState();
  const [rating, setRating] = useState(0);
  const [error, setError] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [load, setLoad] = useState(false);
  const navigate = useNavigate();
  useEffect(() => {
    if (!userData) {
      navigate("/login");
    }
  }, [userData, navigate]);

  useEffect(() => {
  const fetchProfileInformation = async () => {
    setLoad(true);
    try {
      const response = await driverDetails(driverId, userData?.token);
      if (response.ok) {
        const data = await response.json();
        setProfileData(data);
        fetchProfileImage();
        calculateAverageRating(data?.ratings);
        setError("");
      } else {
        throw new Error("Failed to fetch profile data");
      }
    } catch (error) {
      setError(error.message);
      console.error(error);
    } finally {
      setLoad(false);
    }
  };

  const fetchProfileImage = async () => {
    const userImageRef = ref(
      firebase.storage,
      `${driverId}/${driverId}_profile_image`
    );
    try {
      const url = await getDownloadURL(userImageRef);
      setImageUrl(url);
    } catch (error) {
      console.error("Error fetching profile image:", error);
      setImageUrl(
        "https://as2.ftcdn.net/v2/jpg/00/65/77/27/1000_F_65772719_A1UV5kLi5nCEWI0BNLLiFaBPEkUbv5Fv.jpg"
      );
    }
  };

  const calculateAverageRating = (ratings) => {
    if (ratings && ratings.length > 0) {
      const sum = ratings.reduce((acc, rating) => acc + rating, 0);
      const average = sum / ratings.length;
      console.log("Average rating:", average);
      setRating(average); // Assuming setRating exists
    } else {
      setRating(0); // Assuming setRating exists
    }
  };

    fetchProfileInformation();
  }, [driverId, userData?.token]);

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const imageRef = ref(
      firebase.storage,
      `${driverId}/${driverId}_profile_image`
    );
    try {
      const snapshot = await uploadBytes(imageRef, file);
      const downloadURL = await getDownloadURL(snapshot.ref);
      setImageUrl(downloadURL);
      setLoad(false);
    } catch (error) {
      console.error("Error uploading image:", error);
    }
  };

  const handleClick = () => {
    document.getElementById("fileInput").click();
  };

  return (
    <div className="driver-home-main-page">
      {error && <p role="alert">{error}</p>}
      <p>Average rating: {rating}</p>
      {load ? (
        <>
          <Loader />
        </>
      ) : (
        <div className="driver-profle-container">
          <div className="driver-card">
            <DriverProfilePicture
              imageUrl={imageUrl}
              handleClick={handleClick}
              handleImageUpload={handleImageUpload}
            />
            {profileData ? (
              <div className="driver-profile-details">
                <DriverProfileDetails profileData={profileData} />
              </div>
            ) : (
              <>
                {!error && <Loader />}
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default DriverRide;
