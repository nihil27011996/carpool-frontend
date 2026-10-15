import React from "react";

const DriverProfilePicture = ({ imageUrl, handleClick, handleImageUpload }) => {
  const handleUpload = (e) => {
    handleClick();
  };

  return (
    <div className="driver-profile-image-container">
      <div className="driver-profile-image">
        <img src={imageUrl} alt="John" />
      </div>
      <div className="driver-profile-container">
        <input
          type="file"
          id="fileInput"
          onChange={handleImageUpload}
          style={{ display: "none" }}
        />
        <button className="driver-profile-button" onClick={handleUpload}>
          Upload Image
        </button>
      </div>
    </div>
  );
};
export default DriverProfilePicture;
