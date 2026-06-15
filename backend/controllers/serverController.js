import pool from "../config/supabase.js";
import crypto from "crypto";

export const createServer = async (req, res) => {
  try {
    const { name, description, github_url, tags, install_command } = req.body;

    if (!name || name.trim().length < 2) {
      return res.status(400).json({ success: false, message: "Server name is required and must be at least 2 characters" });
    }
    if (name.trim().length > 80) {
      return res.status(400).json({ success: false, message: "Server name must be 80 characters or fewer" });
    }
    if (description && description.trim().length > 500) {
      return res.status(400).json({ success: false, message: "Description must be 500 characters or fewer" });
    }
    if (github_url && github_url.trim().length > 0) {
      try {
        const url = new URL(github_url);
        if (!["http:", "https:"].includes(url.protocol)) throw new Error();
      } catch {
        return res.status(400).json({ success: false, message: "Invalid GitHub URL" });
      }
    }

    const cleanTags = Array.isArray(tags)
      ? tags.map(t => t.trim().toLowerCase()).filter(Boolean).slice(0, 8)
      : [];

    const { rows } = await pool.query(
      `INSERT INTO servers (id, user_id, name, description, github_url, tags, install_command, views, likes)
       VALUES ($1, $2, $3, $4, $5, $6, $7, 0, 0) RETURNING *`,
      [
        crypto.randomUUID(),
        req.user.id,
        name.trim(),
        description?.trim() || null,
        github_url?.trim() || null,
        cleanTags,
        install_command?.trim() || null,
      ]
    );

    return res.status(201).json({ success: true, server: rows[0] });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

export const updateServer = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, github_url, tags, install_command } = req.body;

    // Verify ownership
    const existing = await pool.query(
      "SELECT * FROM servers WHERE id = $1 AND user_id = $2",
      [id, req.user.id]
    );
    if (existing.rows.length === 0) {
      return res.status(404).json({ success: false, message: "Server not found or you don't have permission to edit it" });
    }

    if (!name || name.trim().length < 2) {
      return res.status(400).json({ success: false, message: "Server name must be at least 2 characters" });
    }
    if (name.trim().length > 80) {
      return res.status(400).json({ success: false, message: "Server name must be 80 characters or fewer" });
    }
    if (description && description.trim().length > 500) {
      return res.status(400).json({ success: false, message: "Description must be 500 characters or fewer" });
    }
    if (github_url && github_url.trim().length > 0) {
      try {
        const url = new URL(github_url);
        if (!["http:", "https:"].includes(url.protocol)) throw new Error();
      } catch {
        return res.status(400).json({ success: false, message: "Invalid GitHub URL" });
      }
    }

    const cleanTags = Array.isArray(tags)
      ? tags.map(t => t.trim().toLowerCase()).filter(Boolean).slice(0, 8)
      : [];

    const { rows } = await pool.query(
      `UPDATE servers SET
        name = $1,
        description = $2,
        github_url = $3,
        install_command = $4,
        tags = $5
       WHERE id = $6 AND user_id = $7
       RETURNING *`,
      [
        name.trim(),
        description?.trim() || null,
        github_url?.trim() || null,
        install_command?.trim() || null,
        cleanTags,
        id,
        req.user.id,
      ]
    );

    return res.json({ success: true, server: rows[0] });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

export const getServers = async (req, res) => {
  try {
    const { search, tag, sort = "views", page = 1, limit = 50 } = req.query;
    const offset = (parseInt(page) - 1) * parseInt(limit);

    let query = "SELECT * FROM servers WHERE 1=1";
    const params = [];
    let i = 1;

    if (search) {
      query += ` AND (name ILIKE $${i} OR description ILIKE $${i} OR $${i + 1} = ANY(tags))`;
      params.push(`%${search}%`, search.toLowerCase());
      i += 2;
    }

    if (tag && tag !== "All") {
      query += ` AND $${i} = ANY(tags)`;
      params.push(tag.toLowerCase());
      i++;
    }

    const sortMap = {
      views: "views DESC, created_at DESC",
      likes: "likes DESC, created_at DESC",
      newest: "created_at DESC",
    };
    query += ` ORDER BY ${sortMap[sort] || sortMap.views}`;
    query += ` LIMIT $${i} OFFSET $${i + 1}`;
    params.push(parseInt(limit), offset);

    const { rows } = await pool.query(query, params);
    return res.json({ success: true, servers: rows });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

export const getServerById = async (req, res) => {
  try {
    const { rows } = await pool.query("SELECT * FROM servers WHERE id = $1", [req.params.id]);
    if (!rows[0]) return res.status(404).json({ success: false, message: "Server not found" });
    return res.json({ success: true, server: rows[0] });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};
