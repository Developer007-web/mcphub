import express from "express";
import authMiddleware from "../middleware/auth.js";
import { createServer, getServers, getServerById, updateServer } from "../controllers/serverController.js";
import pool from "../config/supabase.js";

const router = express.Router();

router.get("/", getServers);

router.get("/:id", getServerById);

router.post("/", authMiddleware, createServer);

// Edit server (owner only)
router.put("/:id", authMiddleware, updateServer);

// Increment view count
router.post("/:id/view", async (req, res) => {
  try {
    await pool.query("UPDATE servers SET views = views + 1 WHERE id = $1", [req.params.id]);
    res.json({ success: true });
  } catch {
    res.status(500).json({ success: false });
  }
});

// Like a server
router.post("/:id/like", async (req, res) => {
  try {
    const { rows } = await pool.query(
      "UPDATE servers SET likes = likes + 1 WHERE id = $1 RETURNING likes",
      [req.params.id]
    );
    if (!rows[0]) return res.status(404).json({ success: false, message: "Server not found" });
    res.json({ success: true, likes: rows[0].likes });
  } catch {
    res.status(500).json({ success: false });
  }
});

export default router;
