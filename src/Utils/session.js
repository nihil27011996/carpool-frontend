import { removeAuth } from "../Slice/authSlice";
import { removeUser } from "../Slice/userSlice";
export const isSessionValid = (auth, user) => Boolean(
  auth.isAuthenticated && user?.token && user.token === localStorage.getItem("auth") &&
  Number(auth.expiryTime) > Date.now() && Number(sessionStorage.getItem("authTime")) > Date.now()
);
export const logout = () => (dispatch) => {
  localStorage.removeItem("auth");
  sessionStorage.removeItem("authTime");
  dispatch(removeAuth());
  dispatch(removeUser());
};
