import { fetchAction } from "./fetchUtil";

export const fetchOngoingRide = async (userId, token) => {
  return await fetchAction(
    "GET",
    token,
    null,
    `/carpool/v1/rides?driverId=${userId}&status=available`
  );
};

export const fetchRide = async (userId, token) => {
  return await fetchAction(
    "GET",
    token,
    null,
    `/carpool/v1/rides?driver=${userId}`
  );
};

export const createRide = async (body, token) => {
  return await fetchAction("POST", token, body, `/carpool/v1/rides/`);
};

export const updateStatus = async (userId, body, token) => {
  return await fetchAction("PUT", token, body, `/carpool/v1/rides/${userId}`);
};

export const fetchRequestedRide = async (userId, token) => {
  return await fetchAction(
    "GET",
    token,
    null,
    `/carpool/v1/rideRequest?driver=${userId}&CommuteStatus=pending`
  );
};

export const rejectRide = async (requestId, body, token) => {
  return await fetchAction(
    "PATCH",
    token,
    body,
    `/carpool/v1/rideRequest/request/${requestId}`
  );
};

export const findRider = async (token) => {
  return await fetchAction(
    "GET",
    token,
    null,
    "/carpool/v1/rides?status=available"
  );
};
