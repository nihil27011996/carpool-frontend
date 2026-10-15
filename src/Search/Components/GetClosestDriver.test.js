import React from "react";
import "@testing-library/jest-dom";
import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import Driver from "./GetClosestDriver";
import { findNearbyRide, requestRide } from "../../Utils/ride";
jest.mock("../../Utils/ride");
const props = { startLat: 41, startLon: -87, endLat: 42, endLon: -88, seats: 2, PickUpTime: "2030-01-01T10:00:00Z", token: "token", riderID: "rider" };
const ride = { _id: "ride", driver: { _id: "driver", userName: "Alice" }, Availableseats: 3, Cost: 30, OriginLatitude: 41, OriginLongitude: -87, DestinationLatitude: 42, DestinationLongitude: -88, PickUpTime: props.PickUpTime };
const setup = () => render(<MemoryRouter><Routes><Route path="/" element={<Driver {...props} />} /><Route path="/riderHome" element={<h1>Rider account</h1>} /></Routes></MemoryRouter>);
beforeEach(() => { jest.clearAllMocks(); findNearbyRide.mockResolvedValue({ ok: true, json: async () => ride }); });
test("keeps failed requests on the results screen for retry", async () => {
  requestRide.mockResolvedValue({ ok: false, json: async () => ({ message: "Ride is full" }) });
  setup();
  fireEvent.click(await screen.findByRole("button", { name: "REQUEST" }));
  expect(await screen.findByRole("alert")).toHaveTextContent("Ride is full");
  expect(screen.queryByRole("heading", { name: "Rider account" })).not.toBeInTheDocument();
  expect(screen.getByRole("button")).toBeEnabled();
});
test("navigates only after a successful request", async () => {
  requestRide.mockResolvedValue({ ok: true, json: async () => ({ RequestId: "request" }) });
  setup();
  fireEvent.click(await screen.findByRole("button", { name: "REQUEST" }));
  expect(await screen.findByRole("heading", { name: "Rider account" })).toBeInTheDocument();
  expect(requestRide).toHaveBeenCalledWith(expect.objectContaining({ driver: "driver", rider: "rider", ride: "ride", seatsRequested: 2 }), "token");
});

test("sends matching criteria to the backend", async () => {
  setup();
  await screen.findByText("Driver Found!");
  expect(findNearbyRide).toHaveBeenCalledWith(
    {
      startLat: props.startLat,
      startLon: props.startLon,
      endLat: props.endLat,
      endLon: props.endLon,
      seats: props.seats,
      PickUpTime: props.PickUpTime,
    },
    props.token
  );
});
