import { useSelector } from "react-redux";
import React, { useState } from "react";
import { riderProfileDetails } from "../../../Utils/utils";
import styles from "../Component/driverprofileDetails.module.css";
import SubmitButton from "../../../Components/Common/SubmitButton";
const DriverProfileDetails = ({ profileData }) => {
  const user = useSelector((state) => state.user.userData);
  const [message, setMessage] = useState("");
  // State to hold input values
  const [driverName, setDriverName] = useState(profileData?.userName || "");
  const [driverEmail, setDriverEmail] = useState(profileData?.userEmail || "");
  const [driverPhone, setDriverPhone] = useState(profileData?.PhoneNumber || "");
  const [licenseNumber, setLicenseNumber] = useState(
    profileData.driverDetails?.licenseNumber || ""
  );
  const [make, setMake] = useState(profileData.driverDetails?.vehicle?.make || "");
  const [model, setModel] = useState(profileData.driverDetails?.vehicle?.model || "");
  const [year, setYear] = useState(profileData.driverDetails?.vehicle?.year || "");
  const [platNumber, setPlatNumber] = useState(
    profileData.driverDetails?.vehicle?.plateNumber || ""
  );

  // Function to handle the Save button click
  const handleSave = async () => {
    setMessage("");
    try {
      const response = await riderProfileDetails(user.userId, user.token, { userName: driverName, userEmail: driverEmail, PhoneNumber: driverPhone,
        driverDetails: { licenseNumber, vehicle: { make, model, year, plateNumber: platNumber } } });
      const data = await response.json();
      if (!response.ok || !data) throw new Error("Unable to save profile.");
      setMessage("Profile saved.");
    } catch (error) { setMessage(error.message); }
  };

  return (
    <>
      {message && <p role="status">{message}</p>}
      <div className={styles.driverVechileContainer}>
        <div className={styles.driverDetails}>
          <div className={styles.riderDetailsContainer}>
            <label>Driver UserName</label>
            <input
              type="text"
              required={true}
              value={driverName}
              onChange={(e) => setDriverName(e.target.value)}
            />
          </div>
          <div className={styles.riderDetailsContainer}>
            <label>Email:</label>
            <input
              type="email" // Changed to type email for better input validation
              required={true}
              value={driverEmail}
              onChange={(e) => setDriverEmail(e.target.value)}
            />
          </div>
          <div className={styles.riderDetailsContainer}>
            <label>Phone Number:</label>
            <input
              type="tel" // Changed to type tel for phone number format
              required={true}
              value={driverPhone}
              onChange={(e) => setDriverPhone(e.target.value)}
            />
          </div>
        </div>
        <div className={styles.vehicleDetails}>
          <div className={styles.riderDetailsContainer}>
            <label>License Number:</label>
            <input
              type="tel" // Changed to type tel for phone number format
              required={true}
              value={licenseNumber}
              onChange={(e) => setLicenseNumber(e.target.value)}
            />
          </div>
          <div className={styles.riderDetailsContainer}>
            <label>Vehicle Make</label>
            <input
              type="tel" // Changed to type tel for phone number format
              required={true}
              value={make}
              onChange={(e) => setMake(e.target.value)}
            />
          </div>
          <div className={styles.riderDetailsContainer}>
            <label>Vehicle Model:</label>
            <input
              type="tel" // Changed to type tel for phone number format
              required={true}
              value={model}
              onChange={(e) => setModel(e.target.value)}
            />
          </div>
          <div className={styles.riderDetailsContainer}>
            <label>Vehicle Year:</label>
            <input
              type="tel" // Changed to type tel for phone number format
              required={true}
              value={year}
              onChange={(e) => setYear(e.target.value)}
            />
          </div>
          <div className={styles.riderDetailsContainer}>
            <label>Vehicle Plate Number</label>
            <input
              type="tel" // Changed to type tel for phone number format
              required={true}
              value={platNumber}
              onChange={(e) => setPlatNumber(e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className={styles.riderRatingContainer}>
        <label>Ratings:</label> {profileData.ratings}
      </div>
      <SubmitButton submitform={handleSave} text="Save" />
    </>
  );
};

export default DriverProfileDetails;
