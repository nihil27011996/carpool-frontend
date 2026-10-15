import React from "react";
import { Outlet } from "react-router-dom";
import DriverNavBar from "../../Navbar/driver/navBarComponent-driver";
import RiderNavbar from "../../Navbar/rider/navBarComponent-rider";
import styles from "./Layout.module.css";
import { Outlet } from "react-router-dom";

const MainContainer = styled.div`
  height: 100%;
  width: 100%;
`;

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
      <Outlet />
    </>
  );
};

export default Layout;
