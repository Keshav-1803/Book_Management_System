const User = require('../models/userModel');  // Importing the User model
const jwt = require('jsonwebtoken');  // For generating JWT tokens

// POST /register - Create a new user
exports.registerUser = async (req, res) => {
  try {
    const { title, name, phone, email, password, address } = req.body;

    // Validation checks
    if (!title || !name || !phone || !email || !password) {
      return res.status(400).json({ status: false, message: "All fields are mandatory." });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ status: false, message: "User already exists." });
    }

    // Create a new user
    const user = new User({
      title,
      name,
      phone,
      email,
      password,  // Ideally hash the password before saving
      address,
    });

    // Save the user to the database
    await user.save();
    res.status(201).json({ status: true, message: "User created successfully", data: user });

  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};

// POST /login - User login and generate JWT token
exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ status: false, message: "Email and Password are required." });
    }

    // Find user by email
    const user = await User.findOne({ email });
    if (!user || user.password !== password) {  // Password should be hashed in real-world apps
      return res.status(401).json({ status: false, message: "Invalid credentials." });
    }

    // Generate JWT token
    const token = jwt.sign({ userId: user._id }, 'your_secret_key', { expiresIn: '1h' });

    res.status(200).json({ status: true, message: "Login successful", data: { token } });
    
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};
