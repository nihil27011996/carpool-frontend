import React, { useState } from "react";
import StripeCheckout from "react-stripe-checkout";
import Confetti from "react-confetti";

const Payment = ({ riderEmail, cost, requestId }) => {
  const [paymentComplete, setPaymentComplete] = useState(false);
  const [error, setError] = useState("");
  const [processing, setProcessing] = useState(false);
  const amount = Math.round(Number(cost) * 100);
  const stripeKey = process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY;
  const handleToken = async (token) => {
    setError("");
    setProcessing(true);
    try {
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/payment/`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${localStorage.getItem("auth")}` },
        body: JSON.stringify({ token: token.id, cost: amount, requestId }),
      });
      const data = await response.json();
      if (!response.ok || data.success !== true) throw new Error(data.message || "Payment failed. Please try again.");
      setPaymentComplete(true);
    } catch (error) {
      setError(error.message || "Unable to process payment. Please try again.");
    } finally {
      setProcessing(false);
    }
  };
  if (!Number.isSafeInteger(amount) || amount <= 0) return <p role="alert">Select a ride with a valid fare before paying.</p>;
  if (!stripeKey) return <p role="alert">Payments are currently unavailable.</p>;
  return (
    <div>
      {error && <p role="alert">{error}</p>}
      {paymentComplete ? <p role="status">Payment Successful!</p> : (
        <StripeCheckout stripeKey={stripeKey} token={handleToken} amount={amount}
          email={riderEmail} disabled={processing} name="Carpooling app" description="Ride payment" />
      )}
      {paymentComplete && <Confetti width={window.innerWidth} height={window.innerHeight} numberOfPieces={500} recycle={false} />}
    </div>
  );
};
export default Payment;
