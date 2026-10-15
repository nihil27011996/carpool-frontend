import React from "react";
import { Outlet } from "react-router-dom";
import DriverNavBar from "../../Navbar/driver/navBarComponent-driver";
import RiderNavbar from "../../Navbar/rider/navBarComponent-rider";
const Layout = ({ userType, children, userData }) => {
  return (
    <>
      {userType === "Rider" ? (
        <RiderNavbar riderData={userData} />
      ) : userType === "Driver" ? (
        <DriverNavBar driver={userData} />
      ) : (
        <></>
      )}
      {children || <Outlet />}
    </>
  );
};

export default Layout;
