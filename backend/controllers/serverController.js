import pool from "../config/supabase.js";
import crypto from "crypto";

export const createServer = async (req, res) => {
  try {
    const { name, description, github_url, tags, install_command } = req.body;
    const { rows } = await pool.query(
      "INSERT INTO servers (id, user_id, name, description, github_url, tags, install_command) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *",
      [crypto.randomUUID(), req.user.id, name, description, github_url, tags, install_command]
    );
    return res.status(201).json({ success: true, server: rows[0] });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

export const getServers = async (req, res) => {
  try {
    const { rows } = await pool.query(
      "SELECT * FROM servers ORDER BY views DESC, created_at DESC"
    );
    return res.json({ success: true, servers: rows });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};