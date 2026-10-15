import { fetchAction } from "./fetchUtil";
export const requestRide = async (body, token) => {
  return await fetchAction("POST", token, body, `/carpool/v1/rideRequest/`);
};
