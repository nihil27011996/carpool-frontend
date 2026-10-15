import React, { useState, useEffect, useRef } from "react";
import DriverPastOrders from "./Components/driverOrderitems.js";
import "./Components/driverOrderitems.js";
import styles from "./driverPastRides.module.css";
import DriverNavBar from "../Navbar/driver/navBarComponent-driver.js";
import { useSelector } from "react-redux";

const DriverPastRides = () => {
  /*   const storedData = localStorage.getItem('driver');
  const driverData = JSON.parse(storedData); */
  const driverData = useSelector((state) => state.user.userData);
  const driverId = driverData.userName;
  const [driverOrders, setDriverOrders] = useState([]);
  const [rating, setsetRating] = useState(0);
  const [error, setError] = useState("");

  useEffect(() => {
    //showRideInformation();
    showCommuterInformation();
  }, []);
  const showCommuterInformation = async () => {
    try {
      const response = await fetch(
        `http://localhost:9000/riderOrders/${driverId}`
      );
      if (response.ok) {
        const orderdata = await response.json();
        const filteredDriverOrder = orderdata.filter(
          (item) =>
            item.DriverPostStatus !== "Cancelled" && item.CommuteStatus !== null
        );
        setDriverOrders(filteredDriverOrder);
      } else {
        setError("Failed to data");
      }
    } catch (error) {
      setError("Failed to fetch profile data");
    }
  };

  const removeRequest = (driverID) => {
    setDriverOrders(
      driverOrders.filter((rideRequests) => rideRequests.DriverId !== driverID)
    );
    fetch(`http://localhost:9000/rideRequest/${driverID}`, {
      //fetch api with the call back function
      method: "DELETE",
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to delete reminder status");
        } else {
          console.log("Successfully deleted");
        }
      })
      .catch((error) => {
        console.error(error);
        // handle the error
      });
  };

  /*   const rideRequestData = Array.isArray(rideRequest) && rideRequest.map(c =>(
    <RideRequestItems 
    key = {c._id}
    userName = {c.RiderId}
    removeRequest = {removeRequest} 
    setDriverOrders = {driverOrders}
    riderseats = {c.Riderseats}
    avaialableseats = {driverOrders.Availableseats}
    //passing the function remove Reminder to the reminde items
    />)
  ); */

  const DriverOrderData =
    Array.isArray(driverOrders) &&
    driverOrders.map((c) => (
      <DriverPastOrders
        key={c._id}
        driverid={c.DriverId}
        //riderId = {c.RiderId}
        removeRequest={removeRequest}
        origin={c.StartingLocation}
        destination={c.Destination}
        orders={c.DriverOrderNumber}
        status={c.DriverPostStatus}
        //passing the function remove Reminder to the reminde items
      />
    ));
  return (
    <div className={styles.driverPastRidesContainer}>
      <div className="grid-conatiner-view-drivers">{DriverOrderData}</div>
    </div>
  );
};

export default DriverPastRides;
