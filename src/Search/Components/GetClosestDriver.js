import React, { useEffect, useState } from "react";
import "./GetClosestDriver.css";
import { useNavigate } from "react-router-dom";
import { findNearbyRide } from "../../Utils/ride";
import { requestRide } from "../../Utils/rideRequest";

const GetClosestDriver = (props) => {
  const navigate = useNavigate();
  const [closestDriver, setClosestDriver] = useState(null);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");
  const { startLat, startLon, endLat, endLon, seats, PickUpTime, token } = props;

  useEffect(() => {
    let active = true;
    const load = async () => {
      setLoading(true);
      setError("");
      try {
        const response = await findNearbyRide(
          { startLat, startLon, endLat, endLon, seats, PickUpTime }, token
        );
        if (!response.ok) throw new Error("Failed to fetch available rides.");
        const ride = await response.json();
        if (active) setClosestDriver(ride);
      } catch (loadError) {
        if (active) setError(loadError.message);
      } finally {
        if (active) setLoading(false);
      }
    };
    load();
    return () => { active = false; };
  }, [startLat, startLon, endLat, endLon, seats, PickUpTime, token]);

  const sendRequest = async () => {
    if (!closestDriver || sending) return;
    setSending(true);
    setError("");
    try {
      const response = await requestRide({
        driver: closestDriver.driver?._id || closestDriver.driver,
        rider: props.riderID,
        OriginLatitude: startLat,
        OriginLongitude: startLon,
        DestinationLatitude: endLat,
        DestinationLongitude: endLon,
        StartingLocation: props.origin,
        Destination: props.destination,
        PickUpTime,
        seatsRequested: Number(seats),
        ride: closestDriver._id,
      }, token);
      const data = await response.json();
      if (!response.ok || !data) throw new Error(data?.message || "Unable to send your ride request.");
      navigate("/riderHome");
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setSending(false);
    }
  };

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
