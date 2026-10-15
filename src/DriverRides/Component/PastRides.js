import React, { useState } from "react";
import { updateStatus } from "../../Utils/ride";
import styles from "./PatRides.module.css";

const PastRides = ({ rideData, driverData, updateRideData }) => {
  const [error, setError] = useState("");
  return (
    <div className={styles.pastRidesContainer}>
      {error && <p role="alert">{error}</p>}
      <div className={styles.title}>
        <span>{`${driverData.userEmail} Created Rides`}</span>
      </div>
      <div className={styles.pastRidesCount}>
        <span>{`Past Rides Count (${rideData.length})`}</span>
      </div>
      <div className={styles.rideContainer}>
        {rideData.length > 0 ? (
          <div className={styles.rideContainerDetails}>
            {rideData.map((ride) => (
              <div key={ride.rideId || ride._id} className={styles.detailsContainer}>
                <div key={ride.id} className={styles.rideDetails}>
                  <div className={styles.contentDetails}>
                    <span>{`Destination: ${ride.Destination}`}</span>
                  </div>
                  <div className={styles.contentDetails}>
                    <span>{`Time: ${new Date(ride.PickUpTime).toLocaleString(
                      "en-Us",
                      {
                        year: "numeric", // "2025"
                        month: "long", // "February"
                        day: "numeric", // "23"
                        hour: "numeric", // "10 AM" or "10 PM"
                        minute: "2-digit", // "20"
                        hour12: true, // Use 12-hour clock
                      }
                    )}`}</span>
                  </div>
                  <div className={styles.contentDetails}>
                    <span>{`Cost: ${ride.Cost}`}</span>
                  </div>
                </div>
                <div className={styles.buttonsContainer}>
                  <button
                    disabled={
                      ride.status.toLowerCase() !== "available" ? true : false
                    }
                    onClick={async (e) => {
                      e.preventDefault();
                      setError("");
                      try {
                        const response = await updateStatus(ride.rideId, { status: "cancelled" }, driverData.token);
                        if (!response.ok) throw new Error("Unable to cancel the ride. Please try again.");
                        await updateRideData();
                      } catch (error) { setError(error.message); }

                    }}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <>No Data to Display</>
        )}
      </div>
    </div>
  );
};

export default PastRides;
