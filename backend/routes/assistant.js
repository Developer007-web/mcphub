import express from "express";

const router = express.Router();

router.get("/", (req, res) => {
  res.json({
    message: "Assistant route working"
  });
});

export default router;