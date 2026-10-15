import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { createUser } from "../Utils/Signup/SignUp";
import styles from "./ProfileCreation.module.css";

const ProfileCreation = () => {
  const [username, setUsername] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [vehcileMake, setvehcileMake] = useState("");
  const [vehcileModel, setvehcileModel] = useState("");
  const [vehcileYear, setvehcileYear] = useState("");
  const [vehcilePlate, setvehcilePlate] = useState("");
  const [licenseNumber, setlicenseNumber] = useState("");
  const [email, setEmail] = useState("");
  const [commuterType, setcommuterType] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const [showDriverInput, setDhowDriverInput] = useState(false);


  const handleUsernameChange = (event) => {
    setUsername(event.target.value);
  };

  const handleNameChange = (event) => {
    setName(event.target.value);
  };

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };

  const handleEmailChange = (event) => {
    setEmail(event.target.value);
  };

  const handlecommuterTypeChange = (event) => {
    setcommuterType(event.target.value);
    if (event.target.value === "Driver") {
      setDhowDriverInput(true);
    } else setDhowDriverInput(false);
  };

  const handleLicenseNumberChange = (event) => {
    setlicenseNumber(event.target.value);
  };

  const handlePhoneNumberChange = (event) => {
    setPhoneNumber(event.target.value);
  };
  const handleVehcileMakeChange = (event) => {
    setvehcileMake(event.target.value);
  };

  const handleVehcileModelChange = (event) => {
    setvehcileModel(event.target.value);
  };
  const handleVehcileyearChange = (event) => {
    setvehcileYear(event.target.value);
  };
  const handleVehcilePlateNumberChange = (event) => {
    setvehcilePlate(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    if (!email || !username || !password || !phoneNumber || !commuterType) {
      setError("Please fill out all required fields and select a commuter type.");
      return;
    }
    if (commuterType === "Driver" && (!licenseNumber || !vehcileMake || !vehcileModel || !vehcileYear || !vehcilePlate)) {
      setError("Please fill out all driver and vehicle details.");
      return;
    }
    try {
      const payload = {
        userName: username, userPassword: password, userEmail: email,
        commuterType, PhoneNumber: phoneNumber,
        ...(commuterType === "Driver" ? { driverDetails: {
          licenseNumber, vehicle: { make: vehcileMake, model: vehcileModel,
            year: vehcileYear, plateNumber: vehcilePlate }
        }} : {})
      };
      const response = await createUser(payload);
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Unable to create your profile.");
      navigate("/login");
    } catch (error) {
      setError(error.message || "Unable to create your profile. Please try again.");
    }
  };

  return (
    <div className={styles.registerParentContainer}>
      <div className={styles.registerContainer}>
        <form className={styles.signUpForm} onSubmit={handleSubmit}>
          {error && <p role="alert">{error}</p>}
          <h1>Create your driver profile</h1>
          <div className={styles.subText}>Register to Book a Ride</div>
          <div className={styles.inputDiv}>
            <div className={styles.inputLabelContainer}>
              <div className={styles.labelContainer}>Email Address</div>
              <input
                type="email"
                value={email}
                onChange={handleEmailChange}
                autoFocus={true}
                required={true}
                placeholder="Email"
                className={styles.inputStyling}
              />
            </div>
            <div className={styles.inputLabelContainer}>
              <div className={styles.labelContainer}>User Name</div>
              <input
                type="text"
                value={username}
                onChange={handleUsernameChange}
                autoFocus={true}
                required={true}
                placeholder="Username"
                className={styles.inputStyling}
              />
            </div>
            <div className={styles.inputLabelContainer}>
              <div className={styles.labelContainer}>Name</div>
              <input
                type="text"
                value={name}
                onChange={handleNameChange}
                autoFocus={true}
                required={true}
                placeholder="name"
                className={styles.inputStyling}
              />
            </div>
            <div className={styles.inputLabelContainer}>
              <div className={styles.labelContainer}>Password</div>
              <input
                required={true}
                type="password"
                value={password}
                onChange={handlePasswordChange}
                placeholder="Password"
                className={styles.inputStyling}
              />
            </div>
            <div className={styles.inputLabelContainer}>
              <div className={styles.labelContainer}>Phone Number</div>
              <input
                required={true}
                type="text"
                value={phoneNumber}
                onChange={handlePhoneNumberChange}
                placeholder="Phone Number"
                className={styles.inputStyling}
              />
            </div>
            {showDriverInput ? (
              <>
                <div className={styles.inputLabelContainer}>
                  <div className={styles.labelContainer}>License Number</div>
                  <input
                    required={true}
                    type="text"
                    value={licenseNumber}
                    onChange={handleLicenseNumberChange}
                    placeholder="License Number"
                    className={styles.inputStyling}
                  />
                </div>
                <div className={styles.inputLabelContainer}>
                  <div className={styles.labelContainer}>Vehicle Make</div>
                  <input
                    required={true}
                    type="text"
                    value={vehcileMake}
                    onChange={handleVehcileMakeChange}
                    placeholder="Vehicle Make"
                    className={styles.inputStyling}
                  />
                </div>
                <div className={styles.inputLabelContainer}>
                  <div className={styles.labelContainer}>Vehicle Model</div>
                  <input
                    required={true}
                    type="text"
                    value={vehcileModel}
                    onChange={handleVehcileModelChange}
                    placeholder="Vehicle Model"
                    className={styles.inputStyling}
                  />
                </div>
                <div className={styles.inputLabelContainer}>
                  <div className={styles.labelContainer}>Vehicle year</div>
                  <input
                    required={true}
                    type="text"
                    value={vehcileYear}
                    onChange={handleVehcileyearChange}
                    placeholder="Vehicle year"
                    className={styles.inputStyling}
                  />
                </div>
                <div className={styles.inputLabelContainer}>
                  <div className={styles.labelContainer}>
                    Vehicle Plate Number
                  </div>
                  <input
                    required={true}
                    type="text"
                    value={vehcilePlate}
                    onChange={handleVehcilePlateNumberChange}
                    placeholder="Vehicle Plate Number"
                    className={styles.inputStyling}
                  />
                </div>
              </>
            ) : (
              <></>
            )}
          </div>

          <div className={styles.selector}>
            <select
              id="commuterType"
              name="commuterType"
              value={commuterType}
              onChange={handlecommuterTypeChange}
            >
              <option value="">Select</option>
              <option value="Rider">Rider</option>
              <option value="Driver">Driver</option>
            </select>
          </div>
          <button type="submit" className={styles.submitButton}>CREATE PROFILE</button>
          <div>
            <span>Already have an Account?</span>&nbsp;
            <Link className={styles.linkText} to="/login">
              Login
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProfileCreation;
