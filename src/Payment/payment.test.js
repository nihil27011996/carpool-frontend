import React from "react";
import "@testing-library/jest-dom";
import { render, screen, fireEvent } from "@testing-library/react";
import Payment from "./payment";
jest.mock("react-stripe-checkout", () => ({ token, amount, disabled }) => <button disabled={disabled} onClick={() => token({ id: "stripe-token" })}>Pay {amount}</button>);
jest.mock("react-confetti", () => () => null);
beforeEach(() => {
  process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY = "pk_test_example";
  global.fetch = jest.fn();
});
afterEach(() => { delete global.fetch; });
test("keeps failed payments retryable and never shows success", async () => {
  fetch.mockResolvedValue({ ok: true, json: async () => ({ success: false }) });
  render(<Payment cost={12.34} />);
  fireEvent.click(screen.getByRole("button", { name: "Pay 1234" }));
  expect(await screen.findByRole("alert")).toHaveTextContent("Payment failed");
  expect(screen.queryByText("Payment Successful!")).not.toBeInTheDocument();
  expect(screen.getByRole("button")).toBeEnabled();
});
test("uses the actual fare and only shows success after server confirmation", async () => {
  fetch.mockResolvedValue({ ok: true, json: async () => ({ success: true }) });
  render(<Payment cost={12.34} requestId="request-1" />);
  fireEvent.click(screen.getByRole("button"));
  expect(await screen.findByRole("status")).toHaveTextContent("Payment Successful!");
  expect(JSON.parse(fetch.mock.calls[0][1].body)).toEqual({ token: "stripe-token", cost: 1234, requestId: "request-1" });
});
test("does not offer checkout without a valid ride fare", () => {
  render(<Payment />);
  expect(screen.getByRole("alert")).toHaveTextContent("valid fare");
  expect(screen.queryByRole("button")).not.toBeInTheDocument();
});
