import React, { useState, useEffect, useCallback } from "react";
import { useSelector } from "react-redux";
import styles from "./rideHistory.module.css";
import { fetchRide } from "../Utils/ride";
import PastRides from "./Component/PastRides.js";
const RideHistory = () => {
  const [rideData, setRideData] = useState([]);
  const [error, setError] = useState("");
  const driverData = useSelector((state) => state.user.userData);

  useEffect(() => {
    fetchRideData();
  }, []);

  const fetchRideData = async () => {
    const responseData = await fetchRide(driverData.id, driverData.token);
    if (!responseData.ok) {
      console.error("failed to fetch data");
      return;
    }
    const response = await responseData.json();
    setRideData(response);
  };

  const updateRideData = async () => {
    await fetchRideData();
  };

  console.log(rideData);
  return (
    <div className={styles.rideHistoryContainer}>
      <PastRides
        rideData={rideData}
        driverData={driverData}
        updateRideData={updateRideData}
      />
    </div>
  );
};
export default RideHistory;
