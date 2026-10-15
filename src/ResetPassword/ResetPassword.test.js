import React from "react";
import "@testing-library/jest-dom";
import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import ResetPassword from "./ResetPassword";
import { resetPassword } from "../Utils/resetUtils";
jest.mock("../Utils/resetUtils");
const setup = () => {
  render(<MemoryRouter initialEntries={["/reset-password/reset-token"]}><Routes><Route path="/reset-password/:token" element={<ResetPassword />} /></Routes></MemoryRouter>);
  fireEvent.change(screen.getByPlaceholderText("New password"), { target: { value: "new-password" } });
  fireEvent.change(screen.getByPlaceholderText("Confirm new password"), { target: { value: "new-password" } });
  fireEvent.click(screen.getByRole("button", { name: "Reset Password" }));
};
test("parses Fetch responses and sends the backend password field", async () => {
  jest.useFakeTimers();
  resetPassword.mockResolvedValue({ ok: true, json: async () => ({}) });
  setup();
  expect(await screen.findByText("Password reset successfully")).toBeInTheDocument();
  expect(resetPassword).toHaveBeenCalledWith({ resetPasswordToken: "reset-token", userPassword: "new-password" });
  jest.clearAllTimers();
  jest.useRealTimers();
});
test("does not show success for invalid reset tokens", async () => {
  resetPassword.mockResolvedValue({ ok: false, json: async () => ({ message: "expired" }) });
  setup();
  expect(await screen.findByText("Reset link is invalid or expired.")).toBeInTheDocument();
});
