import pool from "../config/supabase.js";

export const getStats = async (req, res) => {
  try {
    const { rows } = await pool.query("SELECT COUNT(*) FROM servers");

    res.json({
      success: true,
      totalServers: parseInt(rows[0].count)
    });

  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message
    });
  }
};