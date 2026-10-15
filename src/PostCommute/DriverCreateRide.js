import React, { useState, useEffect, useRef, useCallback } from "react";
import { useJsApiLoader, Autocomplete } from "@react-google-maps/api";
import styles from "./CreateRide.module.css";
import { useSelector } from "react-redux";
import { fetchOngoingRide, createRide } from "../Utils/ride.js";
import SubmitButton from "../Components/Common/SubmitButton.js";
const libraries = ["places"];
const DriverRide = () => {
  const parsedData = useSelector((state) => state.user.userData);
  const [pickUpTime, setPickUpTime] = useState("");
  const [cost, setCost] = useState(0);
  const [seats, setSeats] = useState(0);
  const [showButton, setShowButton] = useState(false);
  const [error, setError] = useState("");
  const [errorFlag, setErrorFlag] = useState(false);

  const handleSeatsChange = (e) => {
    setSeats(e.target.value);
  };

  const handleCostChange = (e) => {
    if (e.target.value !== 0) {
      setCost(e.target.value);
    }
  };

  const fetchData = useCallback(async () => {
    try {
      const existingRecord = await fetchOngoingRide(
        parsedData.id,
        parsedData.token
      );
      if (!existingRecord.ok) throw new Error("Failed to load ongoing rides");
      const reponse = await existingRecord.json();
      // Check if the response is null or undefined
      if (reponse.length === 0) {
        // This checks for both null and undefined
        setShowButton(true);
        setError("No ongoing ride found."); // More specific error message
        setErrorFlag(false);
      } else {
        setShowButton(false);
      }
    } catch (error) {
      console.error(error); // Log the error to the console
      setError("Failed to fetch profile data");
      setErrorFlag(true);
      setShowButton(false); // Ensure button is hidden on error
    }
  }, [parsedData.id, parsedData.token]);

  useEffect(() => { fetchData(); }, [fetchData]);


  const originRef = useRef();
  const destinationRef = useRef();
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_API,
    libraries: libraries,
  });

  if (!isLoaded) {
    return <div>loading......</div>;
  }
  const handleGeocodeLocation = async (location) => {
    const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(location)}&key=${process.env.REACT_APP_GOOGLE_API}`;
    try {
      const response = await fetch(url);
      const data = await response.json();
      if (data.status === "OK") {
        const { lat, lng } = data.results[0].geometry.location;
        const locationObject = { latProp: lat, lngProp: lng };
        //console.log(locationObject.latProp)
        return locationObject;
      } else {
        setError("Error while requesting geocoding API");
      }
    } catch (error) {
      setError("Error while requesting geocoding API");
    }
  };

  const PostRide = async () => {
    setErrorFlag(false);
    if (!originRef.current.value.trim() || !destinationRef.current.value.trim() || !Number.isInteger(Number(seats)) || Number(seats) <= 0 || !Number.isFinite(Number(cost)) || Number(cost) <= 0 || !pickUpTime || !Number.isFinite(Date.parse(pickUpTime)) || Date.parse(pickUpTime) <= Date.now()) {
      setError("Enter both locations, a future pickup time, positive seats, and a positive fare.");
      setErrorFlag(true);
      return;
    }
    const origin = await handleGeocodeLocation(originRef.current.value);
    const destination = await handleGeocodeLocation(
      destinationRef.current.value
    );

    if (!origin || !destination) {
      setErrorFlag(true);
      return;
    }
    try {
      const ridePayload = {
        driver: parsedData.id, // Assuming this is an ObjectId from the "userAuths" collection
        StartingLocation: originRef.current.value,
        Destination: destinationRef.current.value,
        status: "available",
        Cost: Number(cost),
        PickUpTime: new Date(pickUpTime).toISOString(),
        OriginLatitude: origin.latProp,
        OriginLongitude: origin.lngProp,
        DestinationLatitude: destination.latProp,
        DestinationLongitude: destination.lngProp,
        Availableseats: Number(seats),
      };
      const responseData = await createRide(ridePayload, parsedData.token);
      if (!responseData.ok) {
        setError("Failed to create the Post");
        setErrorFlag(true);
        return;
      }
      setShowButton(false);
      originRef.current.value = "";
      setSeats(0);
      setCost(0);
      destinationRef.current.value = "";
    } catch (error) {
      setError("Unable to create the ride. Please try again.");
      setErrorFlag(true);
    }
  };

  return (
    <div className={styles.createPageContainer}>
      <div className={styles.addRideContainer}>
        <div className={styles.loginFormContainer}>
          <form className={styles.loginForm}>
            {errorFlag && <p role="alert">{error}</p>}
            <div className={styles.inputContainer}>
              <input aria-label="Pickup time" type="datetime-local" value={pickUpTime} onChange={(e) => setPickUpTime(e.target.value)} className={styles.inputbox} required />
            </div>
            <div className={styles.inputContainer}>
              <Autocomplete className={styles.inputContainer}>
                <input
                  id="StartingLocation"
                  type="text"
                  name="StartingLocation"
                  ref={originRef}
                  className={styles.inputbox}
                  autoFocus={true}
                  required={true}
                />
              </Autocomplete>
              <label>From?</label>
            </div>
            <div className={styles.inputContainer}>
              <Autocomplete className={styles.inputContainer}>
                <input
                  id="Destination"
                  type="text"
                  name="StartingLocation"
                  ref={destinationRef}
                  className={styles.inputbox}
                  autoFocus={true}
                  required={true}
                  placeholder="To?"
                />
              </Autocomplete>
              <label>To?</label>
            </div>
            <div className={styles.inputContainer}>
              <input
                id="seats"
                placeholder="Seats"
                value={seats}
                name="seats"
                onChange={handleSeatsChange}
                className={styles.inputbox}
              />
              <label>Seats</label>
            </div>
            <div className={styles.inputContainer}>
              <input
                id="cost"
                placeholder="Cost"
                value={cost}
                name="Cost"
                onChange={handleCostChange}
                className={styles.inputbox}
              />
              <label>Cost</label>
            </div>
            {showButton === true ? (
              <div className={styles.inputContainer}>
                <SubmitButton
                  submitform={PostRide}
                  className={styles.submitButton}
                  text="Create the Ride"
                ></SubmitButton>
              </div>
            ) : (
              <div className={styles.alert}>
                <span className={styles.closebtn}>&times;</span>
                <strong>Hold on!</strong> Complete the previous Ride to start
                one!
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};

export default DriverRide;
