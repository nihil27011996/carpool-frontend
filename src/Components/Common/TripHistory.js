import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";

const TripHistory = () => {
  const user = useSelector((state) => state.user.userData);
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  useEffect(() => {
    let active = true;
    const load = async () => {
      try {
        const query = user.commuterType === "Driver" ? `?driver=${encodeURIComponent(user.id)}` : "";
        const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/carpool/v1/rideRequest${query}`, {
          headers: { Authorization: `Bearer ${user.token}` },
        });
        if (!response.ok) throw new Error("Unable to load your trips.");
        const data = await response.json();
        if (!Array.isArray(data)) throw new Error("Invalid trip response.");
        const role = user.commuterType === "Driver" ? "driver" : "rider";
        if (active) setTrips(data.filter((trip) => (trip[role]?._id || trip[role]) === user.id));
      } catch (error) { if (active) setError(error.message); }
      finally { if (active) setLoading(false); }
    };
    load();
    return () => { active = false; };
  }, [user.id, user.token, user.commuterType]);
  return <main style={{ padding: "10rem 2rem 2rem" }}>
    <h1>My Trips</h1>
    {error && <p role="alert">{error}</p>}
    {loading ? <p role="status">Loading trips...</p> : !error && (trips.length ? <table>
      <thead><tr><th>From</th><th>Destination</th><th>Pickup time</th><th>Seats</th><th>Status</th></tr></thead>
      <tbody>{trips.map((trip) => <tr key={trip._id || trip.RequestId}>
        <td>{trip.StartingLocation}</td><td>{trip.Destination}</td>
        <td>{new Date(trip.PickUpTime).toLocaleString()}</td><td>{trip.seatsRequested}</td><td>{trip.CommuteStatus}</td>
      </tr>)}</tbody>
    </table> : <p>No trips to display.</p>)}
  </main>;
};
export default TripHistory;
