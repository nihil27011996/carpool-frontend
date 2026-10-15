import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import RiderPastOrders from "./riderOrderitems.js";
import { useDispatch } from "react-redux";
import styles from "./riderPastRides.module.css";
import RiderNavBar from "../Navbar/rider/navBarComponent-rider.js";
import styled from "styled-components";
import { riderRequestDetails } from "../Utils/utils.js";
import { removeRider } from "../../src/Slice/riderSlice.js";

const Main = styled.main`
  height: 95%;
  width: 100%;
`;
const RiderMyTrips = () => {
  /* const storedData = localStorage.getItem('rider'); */
  const driverData = useSelector((state) => state.user.userData);
  const driverId = driverData?.userName;
  const [riderOrders, setRiderOrders] = useState([]);
  const [rating, setsetRating] = useState(0);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();

  if (!driverData) {
    navigate("/login");
  }

  useEffect(() => {
    showCommuterInformation();
  }, []);
  const showCommuterInformation = async () => {
    try {
      const response = await riderRequestDetails(
        driverData.userId,
        driverData.token
      );

      if (response.status.toString() === "401".toString()) {
        dispatch(removeRider());
        navigate("/login");
      }
      if (!response.ok) {
        console.error("there is no value from the database");
        return;
      }
      const orderdata = await response.json();

      console.log(orderdata);

      if (Array.isArray(orderdata)) {
        const filteredDriverOrder = orderdata.filter(
          (item) => item.DriverPostStatus !== "Cancelled" // Change column5 to the desired column for filtering
        );
        //console.log(filteredDriverOrder)
        setRiderOrders(filteredDriverOrder);
      } else if (orderdata.DriverPostStatus !== "Cancelled") {
        setRiderOrders(orderdata);
      } else {
        setError("Failed to data");
      }
    } catch (error) {
      setError("Failed to fetch profile data");
    }
  };

  const removeRequest = (riderID) => {
    setRiderOrders(
      riderOrders.filter((rideRequests) => rideRequests.RiderId !== riderID)
    );
    fetch(`http://localhost:9000/rideRequest/${riderID}`, {
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
    setRiderOrders = {riderOrders}
    riderseats = {c.Riderseats}
    avaialableseats = {riderOrders.Availableseats}
    //passing the function remove Reminder to the reminde items
    />)
  ); */

  const DriverOrderData =
    Array.isArray(riderOrders) &&
    riderOrders.map((c) => (
      <RiderPastOrders
        key={c._id}
        driverid={c.DriverId}
        riderId={driverId}
        removeRequest={removeRequest}
        origin={c.StartingLocation}
        destination={c.Destination}
        driverorders={c.DriverOrderNumber}
        riderorders={c.RiderOrderNumber}
        status={c.CommuteStatus}
        cost={c.Cost}
        //passing the function remove Reminder to the reminde items
      />
    ));
  return (
    <>
      <RiderNavBar />
      <main className={styles.ridermain}>
        <div className={styles.riderpastridescontainer}>
          {/* <div className="grid-conatiner-view-riders">{DriverOrderData}</div> */}
          <table className={styles.riderTable}>
            <thead>
              <tr>
                <th>Driver Name</th>
                <th>Cost</th>
                <th>Destination</th>
              </tr>
            </thead>
            <tbody>{DriverOrderData}</tbody>
          </table>
        </div>
      </main>
    </>
  );
};

export default RiderMyTrips;
