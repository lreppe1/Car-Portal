import { useMemo, useState } from "react";
import api from "../api";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import CheckoutForm from "../components/CheckoutForm";

const stripeKey = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || "";

export default function BookingPage() {
  const [form, setForm] = useState({
    customerName: "",
    email: "",
    carModel: "",
    pickupDate: "",
    dropoffDate: "",
    totalAmount: 150,
  });

  const [booking, setBooking] = useState(null);
  const [clientSecret, setClientSecret] = useState("");
  const [status, setStatus] = useState("");

  const stripePromise = useMemo(() => {
    if (!stripeKey.startsWith("pk_test_")) {
      return null;
    }
    return loadStripe(stripeKey);
  }, []);

  const updateField = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const createBooking = async (e) => {
    e.preventDefault();

    try {
      setStatus("");

      const bookingRes = await api.post("/bookings", {
        customerName: form.customerName.trim(),
        email: form.email.trim(),
        carModel: form.carModel.trim(),
        pickupDate: form.pickupDate,
        dropoffDate: form.dropoffDate,
        totalAmount: Number(form.totalAmount),
      });

      setBooking(bookingRes.data);

      if (!stripeKey.startsWith("pk_test_")) {
        setStatus(
          "Booking created, but Stripe is not configured correctly in the frontend. Use a real publishable key that starts with pk_test_."
        );
        return;
      }

      const paymentRes = await api.post("/payments/create-payment-intent", {
        bookingId: bookingRes.data._id,
      });

      setClientSecret(paymentRes.data.clientSecret);
      setStatus("Booking created. Complete payment below.");
    } catch (error) {
      console.log("BOOKING / PAYMENT ERROR:", error);
      console.log("ERROR RESPONSE:", error.response?.data);
      setStatus(
        error.response?.data?.error || error.message || "Booking failed"
      );
    }
  };

  const handlePaymentSuccess = async (paymentIntentId) => {
    try {
      await api.post("/payments/confirm-success", {
        bookingId: booking._id,
        paymentIntentId,
      });

      setStatus("Payment successful and booking confirmed!");
    } catch (error) {
      console.log("CONFIRM PAYMENT ERROR:", error);
      console.log("CONFIRM PAYMENT RESPONSE:", error.response?.data);
      setStatus(error.response?.data?.error || "Payment save failed");
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <h1 style={styles.heading}>Book a Car</h1>

        {!booking && (
          <form onSubmit={createBooking} style={styles.form}>
            <input
              name="customerName"
              placeholder="Name"
              value={form.customerName}
              onChange={updateField}
              required
            />

            <input
              name="email"
              type="email"
              placeholder="Email"
              value={form.email}
              onChange={updateField}
              required
            />

            <input
              name="carModel"
              placeholder="Car"
              value={form.carModel}
              onChange={updateField}
              required
            />

            <input
              name="pickupDate"
              type="date"
              value={form.pickupDate}
              onChange={updateField}
              required
            />

            <input
              name="dropoffDate"
              type="date"
              value={form.dropoffDate}
              onChange={updateField}
              required
            />

            <input
              name="totalAmount"
              type="number"
              min="0"
              step="1"
              value={form.totalAmount}
              onChange={updateField}
              required
            />

            <button type="submit" style={styles.button}>
              Create Booking
            </button>
          </form>
        )}

        {status && <p style={styles.status}>{status}</p>}

        {clientSecret && stripePromise && (
          <div style={styles.paymentWrap}>
            <h2 style={styles.subheading}>Complete Payment</h2>
            <Elements stripe={stripePromise}>
              <CheckoutForm
                clientSecret={clientSecret}
                onSuccess={handlePaymentSuccess}
              />
            </Elements>
          </div>
        )}
      </div>
    </div>
  );
}

const styles = {
  page: {
    padding: "32px",
    display: "flex",
    justifyContent: "center",
  },
  card: {
    width: "100%",
    maxWidth: "700px",
    background: "white",
    padding: "24px",
    borderRadius: "12px",
    border: "1px solid #ddd",
    boxShadow: "0 8px 24px rgba(0,0,0,0.08)",
  },
  heading: {
    marginTop: 0,
    marginBottom: "20px",
  },
  subheading: {
    marginTop: "24px",
    marginBottom: "12px",
  },
  form: {
    display: "grid",
    gap: "12px",
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
  status: {
    marginTop: "16px",
  },
  paymentWrap: {
    marginTop: "24px",
  },
};