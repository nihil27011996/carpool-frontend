function haversine(lat1, lon1, lat2, lon2) {
  const R = 6371; // Earth's radius in kilometers
  const phi1 = (lat1 * Math.PI) / 180;
  const phi2 = (lat2 * Math.PI) / 180;
  const deltaPhi = ((lat2 - lat1) * Math.PI) / 180;
  const deltaLambda = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(deltaPhi / 2) ** 2 +
    Math.cos(phi1) * Math.cos(phi2) * Math.sin(deltaLambda / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

export function selectClosestRide(drivers, { startLat, startLon, endLat, endLon, seats, PickUpTime }) {
  let closest = null;
  let minDistance = 5;
  if (!Number.isInteger(Number(seats)) || Number(seats) <= 0) return null;
  if (!Number.isFinite(Date.parse(PickUpTime))) return null;
  for (const driver of drivers) {
    if (Number(driver.Availableseats) < Number(seats) || !Number.isFinite(Number(driver.Cost)) || Number(driver.Cost) <= 0) continue;
    if (!driver.PickUpTime || !Number.isFinite(Date.parse(driver.PickUpTime)) || Math.abs(Date.parse(driver.PickUpTime) - Date.parse(PickUpTime)) > 3600000) continue;
    const coordinates = [startLat, startLon, endLat, endLon, driver.OriginLatitude, driver.OriginLongitude, driver.DestinationLatitude, driver.DestinationLongitude];
    if (coordinates.some((value) => value == null || value === "" || !Number.isFinite(Number(value)))) continue;
    const distance = haversine(startLat, startLon, driver.OriginLatitude, driver.OriginLongitude) + haversine(endLat, endLon, driver.DestinationLatitude, driver.DestinationLongitude);
    if (distance < minDistance) { minDistance = distance; closest = driver; }
  }
  return closest;
}
