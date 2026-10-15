const apiUrl = process.env.REACT_APP_BACKEND_URL;

export const fetchOngoingRide = async (userId, token) => {
  const getRide = await fetch(
    `${apiUrl}/carpool/v1/rides?driverId=${userId}&status=available`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`, // Include the token in the Authorization header
      },
    }
  );

  return getRide;
};

export const fetchRide = async (userId, token) => {
  const getRide = await fetch(`${apiUrl}/carpool/v1/rides?driverId=${userId}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`, // Include the token in the Authorization header
    },
  });

  return getRide;
};

export const createRide = async (body, token) => {
  const postRide = await fetch(`${apiUrl}/carpool/v1/rides/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`, // Include the token in the Authorization header
    },
    body: JSON.stringify(body),
  });

  return postRide;
};

export const updateStatus = async (userId, body, token) => {
  const updateRide = await fetch(`${apiUrl}/carpool/v1/rides/${userId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`, // Include the token in the Authorization header
    },
    body: JSON.stringify(body),
  });

  return updateRide;
};

export const fetchRequestedRide = async (userId, token) => {
  const fetchRequestedRide = await fetch(
    `${apiUrl}/carpool/v1/rideRequest?driver=${userId}&CommuteStatus=pending`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`, // Include the token in the Authorization header
      },
    }
  );

  return fetchRequestedRide;
};

export const rejectRide = async (requestId, body, token) => {
  const rejectRide = await fetch(
    `${apiUrl}/carpool/v1/rideRequest/request/${requestId}`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`, // Include the token in the Authorization header
      },
      body: JSON.stringify(body),
    }
  );

  return rejectRide;
};

export const findRider = async (token) => {
  const findRider = await fetch(`${apiUrl}/carpool/v1/rides?status=available`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`, // Include the token in the Authorization header
    },
  });

  return findRider;
};

export const findNearbyRide = async (search, token) => {
  const query = new URLSearchParams({
    startLat: search.startLat,
    startLon: search.startLon,
    endLat: search.endLat,
    endLon: search.endLon,
    seats: search.seats,
    PickUpTime: search.PickUpTime,
  });
  return fetch(`${apiUrl}/carpool/v1/rides/nearby?${query}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
};

export const requestRide = async (body, token) => {
  const requestRide = await fetch(`${apiUrl}/carpool/v1/rideRequest/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`, // Include the token in the Authorization header
    },
    body: JSON.stringify(body),
  });

  return requestRide;
};
