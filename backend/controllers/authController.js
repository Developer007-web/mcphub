import pool from "../config/supabase.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "crypto";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const signup = async (req, res) => {
  try {
    const { email, password, username } = req.body;

    // Validation
    if (!email || !password || !username) {
      return res.status(400).json({
        success: false,
        message: "Email, password, and username are required",
      });
    }

    if (!EMAIL_REGEX.test(email)) {
      return res.status(400).json({ success: false, message: "Invalid email address" });
    }

    if (username.trim().length < 3 || username.trim().length > 32) {
      return res.status(400).json({
        success: false,
        message: "Username must be between 3 and 32 characters",
      });
    }

    if (!/^[a-zA-Z0-9_-]+$/.test(username)) {
      return res.status(400).json({
        success: false,
        message: "Username can only contain letters, numbers, hyphens, and underscores",
      });
    }

    if (password.length < 8) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 8 characters",
      });
    }

    // Check email uniqueness
    const emailCheck = await pool.query(
      "SELECT id FROM users WHERE email = $1",
      [email.toLowerCase()]
    );
    if (emailCheck.rows.length > 0) {
      return res.status(409).json({ success: false, message: "Email already in use" });
    }

    // Check username uniqueness
    const usernameCheck = await pool.query(
      "SELECT id FROM users WHERE LOWER(username) = LOWER($1)",
      [username]
    );
    if (usernameCheck.rows.length > 0) {
      return res.status(409).json({ success: false, message: "Username already taken" });
    }

    const passwordHash = await bcrypt.hash(password, 12);
    const userId = crypto.randomUUID();

    const { rows } = await pool.query(
      "INSERT INTO users (id, email, username, password_hash) VALUES ($1, $2, $3, $4) RETURNING id, email, username",
      [userId, email.toLowerCase(), username.trim(), passwordHash]
    );

    const token = jwt.sign(
      { id: rows[0].id, email: rows[0].email },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    return res.status(201).json({
      success: true,
      message: "Account created successfully",
      token,
      user: rows[0],
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
    }

    const { rows } = await pool.query(
      "SELECT * FROM users WHERE email = $1",
      [email.toLowerCase()]
    );

    const user = rows[0];

    // Same error for missing user and wrong password — prevents user enumeration
    if (!user || !(await bcrypt.compare(password, user.password_hash))) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    return res.status(200).json({
      success: true,
      token,
      user: { id: user.id, email: user.email, username: user.username },
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

export const me = async (req, res) => {
  try {
    const { rows } = await pool.query(
      "SELECT id, email, username, created_at FROM users WHERE id = $1",
      [req.user.id]
    );

    if (!rows[0]) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    return res.status(200).json({ success: true, user: rows[0] });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};