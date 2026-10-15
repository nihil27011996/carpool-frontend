import React, { useEffect } from "react";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import RideHistory from "./DriverRides/RideHistory.js";
import { useDispatch, useSelector } from "react-redux";
import { logout, isSessionValid } from "./Utils/session";
import { ProtectedRoutes } from "./Utils/ProtectedRoutes.js";
const Layout = React.lazy(() => import("./Components/Common/Layout.js"));
const Search = React.lazy(() => import("./Search/search.js"));
const ResetPassword = React.lazy(() =>
  import("./ResetPassword/ResetPassword.js")
);
const CreateProfile = React.lazy(() => import("./User/UserProfileCreation.js"));
const DriverComp = React.lazy(() =>
  import("./PostCommute/DriverCreateRide.js")
);
const Login = React.lazy(() => import("./Login/LoginComp.js"));
const Home = React.lazy(() => import("./LandingPage/Home.js"));
const DriverHome = React.lazy(() => import("./Homepage/Driver/DriverHome.js"));

const Payment = React.lazy(() => import("./Payment/payment.js"));
const DriverApproval = React.lazy(() =>
  import("./DriverApproval/driverApproval.js")
);
const DriverPastRides = React.lazy(() =>
  import("./DriverTrips/driverPastRides.js")
);
const RiderPastRides = React.lazy(() => import("./MyTrips/riderPastRides.js"));
const RiderHome = React.lazy(() => import("./Homepage/Rider/RiderHome.js"));

const protectedPages = [
  ["/createRide", "Driver", DriverComp], ["/searchRide", "Rider", Search],
  ["/driverHome", "Driver", DriverHome], ["/pastRide", "Driver", RideHistory],
  ["/riderHome", "Rider", RiderHome], ["/driverApproval", "Driver", DriverApproval],
  ["/pastRides", "Driver", DriverPastRides], ["/riderpastRides", "Rider", RiderPastRides],
];
const CarpoolApplication = () => {
  const dispatch = useDispatch();
  const { isAuthenticated, expiryTime } = useSelector((state) => state.authUser);
  const { userData } = useSelector((state) => state.user);
  useEffect(() => {
    const auth = { isAuthenticated, expiryTime };
    if (!isSessionValid(auth, userData)) {
      if (isAuthenticated || userData || localStorage.getItem("auth")) dispatch(logout());
      return;
    }
    const expire = () => {
      if (!isSessionValid(auth, userData)) dispatch(logout());
    };
    const timer = setTimeout(expire, Math.max(0, Number(expiryTime) - Date.now()));
    window.addEventListener("focus", expire);
    window.addEventListener("storage", expire);
    return () => {
      clearTimeout(timer);
      window.removeEventListener("focus", expire);
      window.removeEventListener("storage", expire);
    };
  }, [dispatch, isAuthenticated, expiryTime, userData]);
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/homePage" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/createProfile" element={<CreateProfile />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />
        <Route path="/payment" element={<ProtectedRoutes allowedRoles={["Rider"]}><Payment /></ProtectedRoutes>} />
        <Route element={<Layout userType={userData?.commuterType} userData={userData} />}>
          {protectedPages.map(([path, role, Page]) => (
            <Route key={path} path={path} element={<ProtectedRoutes allowedRoles={[role]}><Page /></ProtectedRoutes>} />
          ))}
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
};
export default CarpoolApplication;
