import React from "react";
import "@testing-library/jest-dom";
import { render, screen, act } from "@testing-library/react";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./Slice/authSlice";
import userReducer from "./Slice/userSlice";
import App from "./App";

jest.mock("./LandingPage/Home", () => () => <h1>Welcome to Carpool</h1>);
jest.mock("./PostCommute/DriverCreateRide", () => () => <h1>Create a ride</h1>);
jest.mock("./Homepage/Driver/DriverHome", () => () => <h1>Driver account</h1>);
jest.mock("./Homepage/Rider/RiderHome", () => () => <h1>Rider account</h1>);

function setup(path, role, expiryTime = Date.now() + 60000) {
  window.history.replaceState({}, "", path);
  const user = role ? { id: "123", userId: "user-123", token: "test-token", commuterType: role } : null;
  if (role) {
    localStorage.setItem("auth", user.token);
    sessionStorage.setItem("authTime", expiryTime);
  }
  const store = configureStore({ reducer: { authUser: authReducer, user: userReducer },
    preloadedState: { authUser: { isAuthenticated: !!role, expiryTime }, user: { userData: user } } });
  render(<Provider store={store}><App /></Provider>);
  return store;
}
beforeEach(() => { localStorage.clear(); sessionStorage.clear(); });
afterEach(() => jest.useRealTimers());
test("renders the public home page", async () => {
  setup("/");
  expect(await screen.findByRole("heading", { name: "Welcome to Carpool" })).toBeInTheDocument();
});
test("renders an authorized nested driver route", async () => {
  setup("/createRide", "Driver");
  expect(await screen.findByRole("heading", { name: "Create a ride" })).toBeInTheDocument();
});
test("redirects a rider away from driver routes", async () => {
  setup("/createRide", "Rider");
  expect(await screen.findByRole("button", { name: "Login" })).toBeInTheDocument();
  expect(window.location.pathname).toBe("/login");
});
test("clears expired persisted sessions before rendering protected content", async () => {
  const store = setup("/createRide", "Driver", Date.now() - 1);
  expect(await screen.findByRole("button", { name: "Login" })).toBeInTheDocument();
  expect(store.getState().user.userData).toBeNull();
  expect(localStorage.getItem("auth")).toBeNull();
  expect(sessionStorage.getItem("authTime")).toBeNull();
});
test("expires a session while the app remains open", async () => {
  jest.useFakeTimers();
  const store = setup("/driverHome", "Driver", Date.now() + 1000);
  await act(async () => {});
  await act(async () => { jest.advanceTimersByTime(1001); });
  expect(store.getState().authUser.isAuthenticated).toBe(false);
  expect(store.getState().user.userData).toBeNull();
});
test("logout removes the token and profile", async () => {
  const store = setup("/driverHome", "Driver");
  const logout = await screen.findByRole("link", { name: "Logout" });
  await act(async () => logout.click());
  expect(store.getState().user.userData).toBeNull();
  expect(localStorage.getItem("auth")).toBeNull();
});
