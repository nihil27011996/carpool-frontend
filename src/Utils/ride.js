import { fetchAction } from "./fetchUtil";

export const fetchOngoingRide = (userId, token) =>
  fetchAction("GET", token, null, `/carpool/v1/rides?driverId=${userId}&status=available`);

export const fetchRide = (userId, token) =>
  fetchAction("GET", token, null, `/carpool/v1/rides?driverId=${userId}`);

export const createRide = (body, token) =>
  fetchAction("POST", token, body, "/carpool/v1/rides/");

export const updateStatus = (rideId, body, token) =>
  fetchAction("PUT", token, body, `/carpool/v1/rides/${rideId}`);

export const fetchRequestedRide = (userId, token) =>
  fetchAction("GET", token, null, `/carpool/v1/rideRequest?driver=${userId}&CommuteStatus=pending`);

export const rejectRide = (requestId, body, token) =>
  fetchAction("PATCH", token, body, `/carpool/v1/rideRequest/request/${requestId}`);

export const findNearbyRide = (search, token) => {
  const query = new URLSearchParams({
    startLat: search.startLat,
    startLon: search.startLon,
    endLat: search.endLat,
    endLon: search.endLon,
    seats: search.seats,
    PickUpTime: search.PickUpTime,
  });
  return fetchAction("GET", token, null, `/carpool/v1/rides/nearby?${query}`);
};
