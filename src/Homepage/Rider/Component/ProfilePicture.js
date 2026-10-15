import React from "react";
import styles from "../RiderHome.module.css";
const ProfilePicture = ({ imageUrl, handleClick, handleImageUpload }) => {

  const onClickImageUpload = async (e) => {
    e.preventDefault();
    const file = e.target.files[0];
    if (file) handleImageUpload(file);
  };

  const handleUpload = (e) => {
    handleClick();
  };

  return (
    <div className={styles.riderProfileImageContainer}>
      <div className={styles.riderProfileImage}>
        <img src={imageUrl} alt="John" />
      </div>

      <div className={styles.riderProfileContainer}>
        <input
          type="file"
          id="fileInput"
          onChange={onClickImageUpload}
          style={{ display: "none" }}
        />
        <button className={styles.riderProfileButton} onClick={handleUpload}>
          Upload Image
        </button>
      </div>
    </div>
  );
};

export default ProfilePicture;
