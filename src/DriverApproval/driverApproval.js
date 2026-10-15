import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { fetchRequestedRide, rejectRide } from "../Utils/ride.js";
import styles from "./DriverApproval.module.css";

const Driverapproval = () => {
  const driverData = useSelector((state) => state.user.userData);
  const driverId = driverData?.id;

  const [rideRequest, setRideRequest] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    showRequestedRide();
  }, []);

  const showRequestedRide = async () => {
    try {
      const responseData = await fetchRequestedRide(
        driverId,
        driverData?.token
      );
      if (!responseData.ok) throw new Error("Fetch failed");

      const response = await responseData.json();
      setRideRequest(response);
    } catch (error) {
      console.error("Failed to fetch ride requests:", error);
      setError("Failed to fetch ride requests");
    }
  };

  const removeRequest = async (requestId, body) => {
    try {
      const responseData = await rejectRide(requestId, body, driverData?.token);
      if (!responseData.ok) throw new Error("Failed to reject ride");

      setRideRequest((prevRequests) =>
        prevRequests.filter((req) => req.requestId !== requestId)
      );
    } catch (error) {
      console.error("Error rejecting ride:", error);
    }
  };

  return (
    <div className={styles.approvalMain}>
      <div className={styles.title}>
        <span>Incoming Ride Requests</span>
      </div>
      <div className={styles.cardContainer}>
        <div className={styles.rideGrid}>
          {rideRequest.length > 0 ? (
            rideRequest.map((c) => (
              <div className={styles.card} key={c._id}>
                <div className={styles.cardContent}>
                  <div>
                    <strong>Destination:</strong> {c.destination}
                  </div>
                  <div>
                    <strong>Time:</strong> {new Date(c.time).toLocaleString()}
                  </div>
                  <div>
                    <strong>Cost:</strong> ${c.cost}
                  </div>
                  <div>
                    <strong>User:</strong> {c.driver?.UserId}
                  </div>
                </div>
                <div className={styles.buttonGroup}>
                  <button
                    className={`${styles.btn} ${styles.accept}`}
                    onClick={() => console.log("Accept clicked")}
                  >
                    Accept
                  </button>
                  <button
                    className={`${styles.btn} ${styles.reject}`}
                    onClick={() => removeRequest(c.requestId, {})}
                  >
                    Reject
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p>No ride requests at the moment.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Driverapproval;
