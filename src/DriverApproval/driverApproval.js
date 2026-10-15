import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { fetchRequestedRide, rejectRide } from "../Utils/ride.js";
import styles from "./DriverApproval.module.css";

const Driverapproval = () => {
  const driverData = useSelector((state) => state.user.userData);
  const driverId = driverData?.id;

  const [rideRequest, setRideRequest] = useState([]);
  const [error, setError] = useState("");

  const [pendingId, setPendingId] = useState(null);
  useEffect(() => {
    let active = true;
    const load = async () => {
      try {
        const response = await fetchRequestedRide(driverId, driverData?.token);
        if (!response.ok) throw new Error("Failed to fetch ride requests");
        const data = await response.json();
        if (active) setRideRequest(Array.isArray(data) ? data : []);
      } catch (error) {
        if (active) setError(error.message);
      }
    };
    load();
    return () => { active = false; };
  }, [driverId, driverData?.token]);

  const decideRequest = async (requestId, commuterStatus) => {
    setError("");
    setPendingId(requestId);
    try {
      const response = await rejectRide(requestId, { commuterStatus }, driverData?.token);
      const data = await response.json();
      if (!response.ok || !data) throw new Error("The ride request could not be updated. Please try again.");
      setRideRequest((requests) => requests.filter((req) => req.RequestId !== requestId));
    } catch (error) {
      setError(error.message);
    } finally {
      setPendingId(null);
    }
  };

  return (
    <div className={styles.approvalMain}>
      <div className={styles.title}>
        <span>Incoming Ride Requests</span>
      </div>
      {error && <p role="alert">{error}</p>}
      <div className={styles.cardContainer}>
        <div className={styles.rideGrid}>
          {rideRequest.length > 0 ? (
            rideRequest.map((c) => (
              <div className={styles.card} key={c._id}>
                <div className={styles.cardContent}>
                  <div>
                    <strong>Destination:</strong> {c.Destination}
                  </div>
                  <div>
                    <strong>Time:</strong> {new Date(c.PickUpTime).toLocaleString()}
                  </div>
                  <div>
                    <strong>Cost:</strong> ${c.Cost ?? "Unavailable"}
                  </div>
                  <div>
                    <strong>User:</strong> {c.rider?.userName || c.rider?.UserId}
                  </div>
                </div>
                <div className={styles.buttonGroup}>
                  <button
                    className={`${styles.btn} ${styles.accept}`}
                    disabled={pendingId !== null}
                    onClick={() => decideRequest(c.RequestId, "approved")}
                  >
                    Accept
                  </button>
                  <button
                    className={`${styles.btn} ${styles.reject}`}
                    disabled={pendingId !== null}
                    onClick={() => decideRequest(c.RequestId, "rejected")}
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
