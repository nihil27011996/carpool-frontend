import React, { useState, useEffect, useRef, useCallback } from "react";
import { Link } from "react-router-dom";
import "./RiderHome.css";
import * as firebase from "../../Config/firebase-config.js";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import RiderNavBar from "../../Navbar/rider/navBarComponent-rider.js";
import ProfilePicture from "./Component/ProfilePicture.js";
import { useSelector } from "react-redux";
import ProfileDetails from "../Rider/Component/ProfileDetails.js";

const libraries = ["places"];
const Rider = () => {
  /*    const storedData = localStorage.getItem('rider');
  const driverData = JSON.parse(storedData); */
  const driverData = useSelector((state) => state.rider.rider);
  const driverId = driverData.userName;
  const [profileData, setProfileData] = useState([]);
  const [rating, setsetRating] = useState(0);
  const [error, setError] = useState("");
  const [image, setImage] = useState(null);
  const [imageUrl, setImageUrl] = useState("");

  const showProfileInformation = async () => {
    try {
      const response = await fetch(`http://localhost:9000/riders/${driverId}`);
      if (response.ok) {
        const data = await response.json();
        setProfileData(data);
        try {
          const userImageRef = await ref(
            firebase.storage,
            `${driverData._id}/${driverData._id}_profile_image`
          );
          const url = await getDownloadURL(userImageRef);
          setImageUrl(url);
        } catch (error) {
          if (error.code === "storage/object-not-found") {
            setImageUrl(
              "https://as2.ftcdn.net/v2/jpg/00/65/77/27/1000_F_65772719_A1UV5kLi5nCEWI0BNLLiFaBPEkUbv5Fv.jpg"
            );
          } else {
            setImageUrl(
              "https://as2.ftcdn.net/v2/jpg/00/65/77/27/1000_F_65772719_A1UV5kLi5nCEWI0BNLLiFaBPEkUbv5Fv.jpg"
            );
          }
        }

        const ratings = data.ratings; // Use the updated data from response.json()
        if (ratings.length > 0) {
          const sum = ratings.reduce((acc, rating) => acc + rating, 0);
          const average = sum / ratings.length;
          setsetRating(average);
        } else {
          setsetRating(0);
        }
      } else {
        setError("Failed to fetch profile data");
      }
    } catch (error) {
      setError("Failed to fetch profile data");
    }
  };

  useEffect(() => {
    showProfileInformation();
  }, []);

  const handleImageUpload = async (data) => {
    const imageRef = ref(
      firebase.storage,
      `${driverData._id}/${driverData._id}_profile_image`
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
    /* 
     const fileRef = storageRef.child(`${driverId}/${driverId}_profile_image`);
    await fileRef.put(file);
    const imageUrl = await fileRef.getDownloadURL();
    setImageUrl(imageUrl); */
  };

  const handleClick = () => {
    document.getElementById("fileInput").click();
  };

  return (
    <div className="rider-home-main-page">
      <RiderNavBar />
      {/* <GifComponent /> */}
      <div className="rider-profle-container">
        <div className="rider-card">
          <ProfilePicture
            imageUrl={imageUrl}
            handleClick={handleClick}
            handleImageUpload={handleImageUpload}
          />

          <div className="rider-profile-details">
            <ProfileDetails profileData={profileData} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Rider;
