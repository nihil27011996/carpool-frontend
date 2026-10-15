const apiUrl = process.env.REACT_APP_BACKEND_URL;

export const resetPassword = async (body) => {
  const resetPassord = await fetch(`${apiUrl}/carpool/v1/user/resetPassword`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  return resetPassord;
};
