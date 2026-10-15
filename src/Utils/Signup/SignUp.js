import { fetchAction } from "../fetchUtil";
export const userExits = async (username, token) => {
  return await fetchAction("GET", token, null, `/carpool/v1/user/${username}`);
};

export const createUser = async (userPayload) => {
  return await fetchAction(
    "POST",
    null,
    userPayload,
    `/carpool/v1/user/signup`
  );
};
