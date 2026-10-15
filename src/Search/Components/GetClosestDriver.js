import React, { useEffect, useState } from "react";
import "./GetClosestDriver.css";
import { useNavigate } from "react-router-dom";
import { findRider } from "../../Utils/ride";
import { requestRide } from "../../Utils/rideRequest";
//import ClosestCustomer from "./closestCustomer";

// Function to calculate the Haversine distance between two points
function haversine(lat1, lon1, lat2, lon2) {
  const R = 6371; // Earth's radius in kilometers
  const phi1 = (lat1 * Math.PI) / 180;
  const phi2 = (lat2 * Math.PI) / 180;
  const deltaPhi = ((lat2 - lat1) * Math.PI) / 180;
  const deltaLambda = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(deltaPhi / 2) ** 2 +
    Math.cos(phi1) * Math.cos(phi2) * Math.sin(deltaLambda / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

const GetClosestDriver = (props) => {
  const navigate = useNavigate();
  //console.log(props.origin)
  const [closestDriver, setClosestDriver] = useState({});
  const [paymentComp, setPaymentComp] = useState("");

  useEffect(() => {
    fetchDrivers(props.startLat, props.startLon, props.endLat, props.endLon);
  }, []);

  const fetchDrivers = async (
    userStartLat,
    userStartLon,
    userEndLat,
    userEndLon
  ) => {
    try {
      const response = await findRider(props.token); // Replace with actual API endpoint to fetch drivers
      if (!response.ok) {
        throw new Error("Failed to fetch drivers");
      }

      const drivers = await response.json();
      console.log("drivers", drivers);
      //const closestdriver = getClosestDriver(userStartLat, userStartLon, userEndLat, userEndLon, drivers);
      let ClosestDriver = null;
      let minDistance = 5; // Initialize with a very large value
      drivers.forEach((driver) => {
        console.log("data", driver);
        // Extract driver and user location coordinates from their addresses
        const startDistance = haversine(
          userStartLat,
          userStartLon,
          driver.OriginLatitude,
          driver.OriginLongitude
        );
        const endDistance = haversine(
          userEndLat,
          userEndLon,
          driver.DestinationLatitude,
          driver.DestinationLongitude
        );
        const totalDistance = startDistance + endDistance;
        if (totalDistance < minDistance) {
          minDistance = totalDistance;
          ClosestDriver = driver;
        }
      });
      setClosestDriver(ClosestDriver);
    } catch (error) {
      console.error(error);
    }
  };
  //fetchDrivers(props.startLat, props.startLon, props.endLat, props.endLon);
  const getClosestDriver = async (
    userStartLat,
    userStartLon,
    userEndLat,
    userEndLon,
    drivers
  ) => {
    let ClosestDriver = null;
    let minDistance = 5; // Initialize with a very large value
    drivers.forEach((driver) => {
      // Extract driver and user location coordinates from their addresses
      const startDistance = haversine(
        userStartLat,
        userStartLon,
        driver.OriginLatitude,
        driver.OriginLongitude
      );
      const endDistance = haversine(
        userEndLat,
        userEndLon,
        driver.DestinationLatitude,
        driver.DestinationLongitude
      );
      const totalDistance = startDistance + endDistance;
      ////console.log(startDistance);

      if (totalDistance < minDistance) {
        minDistance = totalDistance;
        ClosestDriver = driver;
      }
    });

    /*     for (const driver of drivers) {
      const startDistance = haversine(userStartLat, userStartLon, driver.OriginLatitude, driver.OriginLongitude);
      const endDistance = haversine(userEndLat, userEndLon, driver.DestinationLatitude, driver.DestinationLongitude);
      const totalDistance = startDistance + endDistance;
      if (totalDistance < 1) {
        minDistance = totalDistance;
        ClosestDriver = driver;
        ////console.log('sdas')
      }
    } */

    return ClosestDriver;
  };

  const handlesendRequsttoDriver = async () => {
    try {
      const response = await requestRide(
        {
          driver: closestDriver.driver._id,
          rider: props.riderID,
          OriginLatitude: props.startLat,
          OriginLongitude: props.startLon,
          DestinationLatitude: props.endLat,
          DestinationLongitude: props.endLon,
          Riderseats: props.seats,
          StartingLocation: props.origin,
          Destination: props.destination,
          PickUpTime: props.PickUpTime,
          seatsRequested: props.seats,
          ride: closestDriver._id,
          Cost:
            (closestDriver.Cost / closestDriver.Availableseats) * props.seats,
        },
        props.token
      );
      const responsedata = await response.json();
      ////console.log(responsedata);
    } catch (error) {
      console.error(error);
    } finally {
      navigate("/riderHome");
      alert("Request Sent!");
    }
  };
  /* else if (existingRecordData.CommuterStatus == 'Requested' && existingRecordData.DriverOrderNumber == closestDriver.DriverOrderNumber){

      }
    //console.log(recordExists)
    if (recordExists.length>0) {
    alert('You have already requested');
    return;
   
    }
    else {
      try {
        const response = await fetch(`http://localhost:9000/rideRequest/${props.riderID}`, { //fetch api with the call back function
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            riderOrderNumber: closestDriver.DriverOrderNumber,
            DriverOrderNumber: newOrderNumber,
            DriverId: closestDriver.driverId,
            RiderId: props.riderID,
            OriginLatitude: props.startLat ,
            OriginLongitude: props.startLon,
            DestinationLatitude: props.endLat,
            DestinationLongitude: props.endLon,
            Riderseats: props.seats,
            CommuteStatus:"Requested"}),
        });
        const responsedata = await response.json();
        ////console.log(responsedata);
  
      } catch (error) {
        console.error(error);
      }
    } */
  console.log("drivers data", closestDriver);
  return (
    <div className="main_driver">
      {closestDriver !== null ? (
        <div className="driver-det">
          <details>
            <summary>Driver Found!</summary>
            <p>Closest Driver Available : {closestDriver.driver?.userName}</p>
            <p> Driver Order Number : {closestDriver.rideId}</p>
            <p>
              Total Cost : ${" "}
              {(closestDriver.Cost / closestDriver.Availableseats) *
                props.seats}
            </p>
            <div>
              <button
                className="req"
                type="submit"
                onClick={handlesendRequsttoDriver}
              >
                REQUEST
              </button>
            </div>
          </details>
        </div>
      ) : (
        <div className="driver-det">
          <details>
            <summary>Driver Not Found!</summary>
            <p>
              Sorry! No drivers heading your ride Destination. Please try again
              later OR change the Destination.
            </p>
          </details>
        </div>
      )}
      {/* <ClosestCustomer/> */}

      {/*payment*/}

  return <div className="main_driver">
    {error && <p role="alert">{error}</p>}
    {loading ? <p role="status">Searching for drivers...</p> : closestDriver ? (
      <div className="driver-det">
        <h3>Driver Found!</h3>
        <p>Driver: {closestDriver.driver?.userName || closestDriver.driver?.UserId}</p>
        <p>Ride: {closestDriver.rideId}</p>
        <p>Total Cost: ${((closestDriver.Cost / closestDriver.Availableseats) * Number(seats)).toFixed(2)}</p>
        <button className="req" type="button" disabled={sending} onClick={sendRequest}>{sending ? "Sending..." : "REQUEST"}</button>
      </div>
    ) : !error && <p>No drivers match your route, seats, and pickup time. Please try another search.</p>}
  </div>;
};

export default GetClosestDriver;
