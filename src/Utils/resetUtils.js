import { fetchAction } from "./fetchUtil";

export const resetPassword = async (body) => {
  return await fetchAction("POST", null, body, `/user/resetPassword`);
};
