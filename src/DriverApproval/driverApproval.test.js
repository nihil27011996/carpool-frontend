import React from "react";
import "@testing-library/jest-dom";
import { render, screen, fireEvent } from "@testing-library/react";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import Approval from "./driverApproval";
import { fetchRequestedRide, rejectRide } from "../Utils/ride";
jest.mock("../Utils/ride");
const request = { _id: "mongo-id", RequestId: "request-1", Destination: "Chicago", PickUpTime: "2030-01-01", rider: { userName: "Alice" } };
const setup = () => render(<Provider store={configureStore({ reducer: { user: () => ({ userData: { id: "driver-1", token: "token" } }) } })}><Approval /></Provider>);
beforeEach(() => { jest.clearAllMocks(); fetchRequestedRide.mockResolvedValue({ ok: true, json: async () => [request] }); });
test("sends the backend decision contract and removes successful requests", async () => {
  rejectRide.mockResolvedValue({ ok: true, json: async () => request });
  setup();
  fireEvent.click(await screen.findByRole("button", { name: "Accept" }));
  expect(await screen.findByText("No ride requests at the moment.")).toBeInTheDocument();
  expect(rejectRide).toHaveBeenCalledWith("request-1", { commuterStatus: "approved" }, "token");
});
test("keeps requests visible when the backend returns no updated request", async () => {
  rejectRide.mockResolvedValue({ ok: true, json: async () => null });
  setup();
  fireEvent.click(await screen.findByRole("button", { name: "Reject" }));
  expect(await screen.findByRole("alert")).toHaveTextContent("could not be updated");
  expect(screen.getByText("Chicago")).toBeInTheDocument();
});
