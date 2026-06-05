import express from "express";
import authMiddleware from "../middleware/auth.js";
import pool from "../config/supabase.js";

const router = express.Router();

router.get("/public-stats", async (req, res) => {
  try {
    const servers = await pool.query("SELECT COUNT(*) FROM servers");
    const users = await pool.query("SELECT COUNT(*) FROM users");
    res.json({
      success: true,
      totalServers: parseInt(servers.rows[0].count),
      totalUsers: parseInt(users.rows[0].count)
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.get("/stats", async (req, res) => {
  try {
    const { rows } = await pool.query("SELECT COUNT(*) FROM servers");
    res.json({ success: true, totalServers: parseInt(rows[0].count) });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.get("/my-servers", authMiddleware, async (req, res) => {
  try {
    const { rows } = await pool.query(
      "SELECT * FROM servers WHERE user_id = $1 ORDER BY created_at DESC",
      [req.user.id]
    );
    return res.json({ success: true, servers: rows });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
});

// DELETE a server — only owner can delete
router.delete("/my-servers/:id", authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;

    // Check the server belongs to this user
    const { rows } = await pool.query(
      "SELECT * FROM servers WHERE id = $1 AND user_id = $2",
      [id, req.user.id]
    );

    if (rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Server not found or you don't have permission to delete it"
      });
    }

    await pool.query("DELETE FROM servers WHERE id = $1", [id]);

    return res.json({ success: true, message: "Server deleted successfully" });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
});

router.get("/", (req, res) => {
  res.json({ success: true, message: "Dashboard route working" });
});

export default router;