import { fetchAction } from "./fetchUtil";

export const resetPassword = (body) =>
  fetchAction("POST", null, body, "/carpool/v1/user/resetPassword");
