import { selectClosestRide } from "./matching";
const search = { startLat: 41, startLon: -87, endLat: 42, endLon: -88, seats: 2, PickUpTime: "2030-01-01T10:00:00Z" };
const ride = { _id: "ride", Availableseats: 3, Cost: 30, OriginLatitude: 41, OriginLongitude: -87, DestinationLatitude: 42, DestinationLongitude: -88, PickUpTime: search.PickUpTime };
test("matches a nearby ride with sufficient seats and compatible time", () => {
  expect(selectClosestRide([ride], search)).toBe(ride);
});
test.each([
  { Availableseats: 1 }, { PickUpTime: "2030-01-01T14:00:00Z" },
  { OriginLatitude: 45 }, { Cost: 0 }, { OriginLatitude: null },
])("excludes incompatible rides: %o", (change) => {
  expect(selectClosestRide([{ ...ride, ...change }], search)).toBeNull();
});
