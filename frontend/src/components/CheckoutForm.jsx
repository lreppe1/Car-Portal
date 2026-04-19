import { useState } from "react";
import { CardElement, useElements, useStripe } from "@stripe/react-stripe-js";

export default function CheckoutForm({ clientSecret, onSuccess }) {
  const stripe = useStripe();
  const elements = useElements();

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!stripe || !elements) {
      setMessage("Stripe has not loaded yet.");
      return;
    }

    const cardElement = elements.getElement(CardElement);

    if (!cardElement) {
      setMessage("Card form not loaded.");
      return;
    }

    setLoading(true);
    setMessage("");

    const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
      payment_method: {
        card: cardElement,
      },
    });

    if (error) {
      console.log("STRIPE PAYMENT ERROR:", error);
      setMessage(error.message || "Payment failed.");
      setLoading(false);
      return;
    }

    console.log("PAYMENT INTENT RESULT:", paymentIntent);

    if (paymentIntent && paymentIntent.status === "succeeded") {
      await onSuccess(paymentIntent.id);
      setMessage("Payment successful!");
    } else {
      setMessage(`Payment status: ${paymentIntent?.status || "unknown"}`);
    }

    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} style={styles.form}>
      <div style={styles.cardBox}>
        <CardElement
          options={{
            style: {
              base: {
                fontSize: "16px",
                color: "#111827",
                "::placeholder": {
                  color: "#6b7280",
                },
              },
              invalid: {
                color: "#dc2626",
              },
            },
          }}
        />
      </div>

      <button type="submit" disabled={!stripe || loading} style={styles.button}>
        {loading ? "Processing..." : "Pay Now"}
      </button>

      {message && <p style={styles.message}>{message}</p>}
    </form>
  );
}

const styles = {
  form: {
    display: "grid",
    gap: "16px",
  },
  cardBox: {
    padding: "14px 16px",
    border: "1px solid #d1d5db",
    borderRadius: "10px",
    background: "white",
  },
  button: {
    padding: "12px 16px",
    border: "none",
    borderRadius: "8px",
    background: "#111827",
    color: "white",
    fontWeight: "600",
    cursor: "pointer",
  },
  message: {
    margin: 0,
  },
};