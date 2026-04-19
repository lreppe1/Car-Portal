const express = require("express");
const Stripe = require("stripe");
const Booking = require("../models/Booking");

const router = express.Router();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

router.post("/create-payment-intent", async (req, res) => {
  try {
    const { bookingId } = req.body;

    const booking = await Booking.findById(bookingId);

    if (!booking) {
      return res.status(404).json({ error: "Booking not found" });
    }

    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(Number(booking.totalAmount) * 100),
      currency: "usd",
      payment_method_types: ["card"],
      metadata: {
        bookingId: booking._id.toString(),
      },
    });

    res.json({
      clientSecret: paymentIntent.client_secret,
    });
  } catch (error) {
    console.error("CREATE PAYMENT INTENT ERROR:", error);
    res.status(500).json({ error: error.message });
  }
});

router.post("/confirm-success", async (req, res) => {
  try {
    const { bookingId, paymentIntentId } = req.body;

    const booking = await Booking.findById(bookingId);

    if (!booking) {
      return res.status(404).json({ error: "Booking not found" });
    }

    booking.paymentStatus = "paid";
    booking.paymentIntentId = paymentIntentId || "";
    await booking.save();

    res.json({
      message: "Payment successful and booking updated",
      booking,
    });
  } catch (error) {
    console.error("CONFIRM PAYMENT ERROR:", error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;