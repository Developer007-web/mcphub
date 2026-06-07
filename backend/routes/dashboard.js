import express from "express";
import authMiddleware from "../middleware/auth.js";
import pool from "../config/supabase.js";

const router = express.Router();

// Public stats for Explore page
router.get("/public-stats", async (req, res) => {
  try {
    const [servers, users, agg] = await Promise.all([
      pool.query("SELECT COUNT(*) FROM servers"),
      pool.query("SELECT COUNT(*) FROM users"),
      pool.query("SELECT COALESCE(SUM(views),0) AS total_views, COALESCE(SUM(likes),0) AS total_likes FROM servers"),
    ]);
    res.json({
      success: true,
      totalServers: parseInt(servers.rows[0].count),
      totalUsers: parseInt(users.rows[0].count),
      totalViews: parseInt(agg.rows[0].total_views),
      totalLikes: parseInt(agg.rows[0].total_likes),
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Authenticated: my servers
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

// Authenticated: my stats (total views + likes across all my servers)
router.get("/my-stats", authMiddleware, async (req, res) => {
  try {
    const { rows } = await pool.query(
      `SELECT
        COUNT(*) AS total_servers,
        COALESCE(SUM(views), 0) AS total_views,
        COALESCE(SUM(likes), 0) AS total_likes
       FROM servers WHERE user_id = $1`,
      [req.user.id]
    );
    return res.json({
      success: true,
      totalServers: parseInt(rows[0].total_servers),
      totalViews: parseInt(rows[0].total_views),
      totalLikes: parseInt(rows[0].total_likes),
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
});

// Authenticated: delete a server
router.delete("/my-servers/:id", authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const { rows } = await pool.query(
      "SELECT * FROM servers WHERE id = $1 AND user_id = $2",
      [id, req.user.id]
    );

    if (rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Server not found or you don't have permission to delete it",
      });
    }

    await pool.query("DELETE FROM servers WHERE id = $1", [id]);
    return res.json({ success: true, message: "Server deleted successfully" });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
});

export default router;