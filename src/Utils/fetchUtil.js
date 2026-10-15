const apiUrl = process.env.REACT_APP_BACKEND_URL;

export const fetchAction = async (method, token, requestBody, basePath) => {
  const upperMethod = method.toUpperCase;
  const options = {
    method: upperMethod,
    headers: {
      Authorization: `Bearer ${token}`,
      ...(upperMethod !== "GET" && { "Content-Type": "application/json" }),
    },
    ...(upperMethod !== "GET" && { body: JSON.stringify(requestBody) }),
  };

  return await fetch(`${apiUrl}${basePath}`, options);
};
