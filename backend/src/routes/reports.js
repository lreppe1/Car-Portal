const express = require("express");
const Booking = require("../models/Booking");

const router = express.Router();

router.get("/summary", async (req, res) => {
  try {
    const totalBookings = await Booking.countDocuments();
    const paidBookings = await Booking.countDocuments({ paymentStatus: "paid" });
    const pendingBookings = await Booking.countDocuments({ paymentStatus: "pending" });
    const failedBookings = await Booking.countDocuments({ paymentStatus: "failed" });

    const revenueData = await Booking.aggregate([
      { $match: { paymentStatus: "paid" } },
      { $group: { _id: null, totalRevenue: { $sum: "$totalAmount" } } },
    ]);

    res.json({
      totalBookings,
      paidBookings,
      pendingBookings,
      failedBookings,
      totalRevenue: revenueData[0]?.totalRevenue || 0,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;