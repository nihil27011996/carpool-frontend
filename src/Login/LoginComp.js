import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import styles from "./Login.module.css";
import { useDispatch } from "react-redux";
import { storeUser } from "../Slice/userSlice.js";
import { storeAuth } from "../Slice/authSlice.js";
import SubmitButton from "../Components/Common/SubmitButton.js";
import { login } from "../Utils/utils.js";
import ToastComponent from "../Components/Common/ToastMessage.js";
/* import { setupConnection } from '../Slice/socketSlice'; */

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [disable, setDisable] = useState(true);
  const [errorFlag, setErrorFlag] = useState(false);
  const [error, setError] = useState("");
  const [passwordType, setPasswordType] = useState("password");
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    setDisable(!username || !password);
  }, [username, password]);

  const handleUsernameChange = (e) => {
    e.preventDefault();
    setUsername(e.target.value);
  };

  const handlePasswordChange = (e) => {
    e.preventDefault();
    setPassword(e.target.value);
  };

  const handleSubmit = async () => {
    const payload = {
      userName: username,
      userPassword: password,
    };
    try {
      const response = await login(payload);
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Username or password is incorrect.");
      if (!data.token || !["Rider", "Driver"].includes(data.commuterType)) throw new Error("The login response is incomplete.");
      const expiryTime = Date.now() + 3600000;
      localStorage.setItem("auth", data.token);
      sessionStorage.setItem("authTime", expiryTime);
      dispatch(storeUser({ userData: data }));
      dispatch(storeAuth({ isAuthenticated: true, expiryTime }));
      setErrorFlag(false);
      navigate(data.commuterType === "Rider" ? "/searchRide" : "/createRide");
    } catch (error) {
      setError(error.message || "Unable to log in. Please try again.");
      setErrorFlag(true);
      setTimeout(() => {
        setErrorFlag(false);
      }, 10000);
      return;
    }

    setError("");
    setErrorFlag(false);

    const existingRecordData = await existingRecordResponse.json();
    handleSession(existingRecordData.token);
    dispatch(
      storeUser({
        userData: existingRecordData,
      })
    );
    dispatch(
      storeAuth({
        isAuthenticated: true,
        expiryTime: Date.now() + 3600000,
      })
    );
    setTimer();
    setTimeout(() => {
      if (existingRecordData.commuterType === "Rider") {
        navigate("/searchRide");
      } else if (existingRecordData.commuterType === "Driver") {
        navigate("/createRide");
      }
    }, 100);
  };

  const togglePasswordType = (e) => {
    e.preventDefault();
    if (passwordType === "text") {
      setPasswordType((type) => (type = "password"));
    } else {
      setPasswordType((type) => (type = "text"));
    }
  };

  return (
    <div className={styles.loginparentcontainer}>
      <main className={styles.mainLogin}>
        {errorFlag ? (
          <ToastComponent visibility={errorFlag} message={error} />
        ) : (
          <></>
        )}
        <div className={styles.formContainer}>
          <form className={styles.loginForm}>
            <h1 className={styles.headingText}>Welcome back!</h1>
            <p className={styles.welcomeText}>Login to book your ride...</p>
            <div className={styles.inputContainer}>
              <input
                key="username"
                type="text"
                value={username}
                placeholder="User Name"
                onChange={handleUsernameChange}
                className={errorFlag ? styles.userNameError : styles.userName}
                required={true}
              />
              {/* <label className={styles.inputLabel}>Username</label> */}
            </div>

            <div className={styles.inputContainer}>
              <input
                key="password"
                type={passwordType}
                value={password}
                placeholder="Password"
                onChange={handlePasswordChange}
                className={errorFlag ? styles.userNameError : styles.userName}
                required={true}
              />
              {/* <label>Password</label> */}
              <div className={styles.iconContainer}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  className={styles.profileIcon}
                  onClick={togglePasswordType}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                  />
                </svg>
              </div>
            </div>
            {errorFlag ? (
              <div
                style={{
                  color: "red",
                  fontWeight: "bold",
                  wordWrap: "break-word", // Breaks long words to prevent overflow
                  whiteSpace: "normal", // Ensures text behaves in a standard way regarding whitespace
                  overflowWrap: "break-word", // Ensures any text exceeding the width of the container breaks onto a new line
                }}
              >
                {error}
              </div>
            ) : null}

            <SubmitButton
              submitform={handleSubmit}
              buttonStyle={styles.submitButton}
              disabled={disable}
              text="Login"
            ></SubmitButton>
            <div>
              <span>Don't have an account?</span>&nbsp;
              <Link className={styles.linkText} to="/createProfile">
                Sign Up
              </Link>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
};

export default Login;
