// src/pages/Auth/ResetPassword.js
import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { resetPassword } from "../Utils/resetUtils";
import styles from "./ResetPassword.module.css";

const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      setMessage("Passwords do not match");
      return;
    }

    try {
      const res = await resetPassword({
        resetPasswordToken: token,
        newPassword,
      });
      setMessage(res.data.message || "Password reset successfully");
      setTimeout(() => navigate("/login"), 2000);
    } catch (err) {
      setMessage("Reset link is invalid or expired.");
    }
  };

  return (
    <div className={styles.resetMainContainer}>
      <div className={styles.container}>
        <h2 className={styles.heading}>Reset Password</h2>
        <form className={styles.form} onSubmit={handleSubmit}>
          <input
            className={styles.input}
            type="password"
            placeholder="New password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
          />
          <input
            className={styles.input}
            type="password"
            placeholder="Confirm new password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
          <button className={styles.button} type="submit">
            Reset Password
          </button>
        </form>
        {message && <p className={styles.message}>{message}</p>}
      </div>
    </div>
  );
};

export default ResetPassword;
