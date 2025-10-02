const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

// Registracija
router.post("/register", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Paprasta email validacija
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: "Incorrect e-mail format" });
    }

    // Slaptažodžio taisyklės
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
    if (!passwordRegex.test(password)) {
      return res.status(400).json({ 
        message: "Password must be 8 letters long and have letters and numbers."
      });
    }

    // Patikrinti ar jau egzistuoja
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: "User with that email address already exists." });

    // Hash slaptažodžio
    const hashedPassword = await bcrypt.hash(password, 10);

    // Išsaugoti DB
    const newUser = new User({ email, password: hashedPassword });
    await newUser.save();

    res.json({token, message: "Successfully registered" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// Prisijungimas
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Rasti vartotoją
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Bad email or password" });

    // Patikrinti slaptažodį
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return res.status(400).json({ message: "Bad email or password" });

    // Sukurti token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1h" });

    res.json({ token });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// Apsaugotas route (pvz. profilis)
router.get("/profile", authMiddleware, async (req, res) => {
  const user = await User.findById(req.user.id).select("-password");
  res.json(user);
});

// Bonus: gauti visus vartotojus
router.get("/users", authMiddleware, async (req, res) => {
  const users = await User.find().select("email");
  res.json(users);
});

module.exports = router;
