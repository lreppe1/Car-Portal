const express = require("express");

const router = express.Router();

/**
 * POST /api/auth/login
 * Simple admin login using env credentials
 */
router.post("/login", (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    // Check against .env admin credentials
    if (
      email === process.env.ADMIN_EMAIL &&
      password === process.env.ADMIN_PASSWORD
    ) {
      return res.json({
        message: "Login successful",
        user: {
          email,
          role: "admin",
        },
      });
    }

    // Invalid login
    return res.status(401).json({ error: "Invalid credentials" });
  } catch (error) {
    console.error("LOGIN ERROR:", error);
    return res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;