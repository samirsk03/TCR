  import bcrypt from "bcryptjs";
  import User from "../models/User.js";
  import generateToken from "../utils/generateToken.js";

 // Register
export const register = async (req, res) => {
  try {
    const { name, phone, password, role } = req.body;

    if (!name || !phone || !password) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    const userExists = await User.findOne({ phone });

    if (userExists) {
      return res.status(400).json({
        success: false,
        message: "User already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      phone,
      password: hashedPassword,
      role: role || "customer",
    });

    const token = generateToken(user._id);

    res.status(201).json({
      success: true,
      token,
      user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

  // Login
  export const login = async (req, res) => {
    try {
      const { phone, password } = req.body;

      const user = await User.findOne({ phone });

      if (!user) {
        return res.status(401).json({
          success: false,
          message: "Invalid credentials",
        });
      }

      const isMatch = await bcrypt.compare(
        password,
        user.password
      );

      if (!isMatch) {
        return res.status(401).json({
          success: false,
          message: "Invalid credentials",
        });
      }

      const token = generateToken(user._id);

      res.status(200).json({
        success: true,
        token,
        user,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  };

  // Admin Login
export const adminLogin = async (req, res) => {
  try {
    const { phone, password } = req.body;

    const user = await User.findOne({ phone });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    const isMatch = await bcrypt.compare(
      password,
      user.password
    );

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    // Only Admin & Staff

    if (
      user.role !== "admin" &&
      user.role !== "staff"
    ) {
      return res.status(403).json({
        success: false,
        message:
          "You are not authorized to access the Admin Panel.",
      });
    }

    const token = generateToken(user._id);

    res.status(200).json({
      success: true,
      token,
      user,
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};

  // Current User
  export const getMe = async (req, res) => {
    res.status(200).json({
      success: true,
      user: req.user,
    });
  };