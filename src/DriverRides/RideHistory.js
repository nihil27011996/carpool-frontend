import React, { useState, useEffect, useCallback } from "react";
import { useSelector } from "react-redux";
import styles from "./rideHistory.module.css";
import { fetchRide } from "../Utils/ride";
import PastRides from "./Component/PastRides.js";
const RideHistory = () => {
  const [rideData, setRideData] = useState([]);
  const [error, setError] = useState("");
  const driverData = useSelector((state) => state.user.userData);
  const fetchRideData = useCallback(async () => {
    setError("");
    try {
      const response = await fetchRide(driverData.id, driverData.token);
      if (!response.ok) throw new Error("Unable to load your ride history.");
      const data = await response.json();
      if (!Array.isArray(data)) throw new Error("Invalid ride response.");
      setRideData(data);
    } catch (error) { setError(error.message); }
  }, [driverData.id, driverData.token]);
  useEffect(() => { fetchRideData(); }, [fetchRideData]);
  return <div className={styles.rideHistoryContainer}>
    {error && <p role="alert">{error}</p>}
    <PastRides rideData={rideData} driverData={driverData} updateRideData={fetchRideData} />
  </div>;
};
export default RideHistory;
