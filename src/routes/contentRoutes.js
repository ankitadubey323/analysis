// import {createContent } from "../controllers/contentControllers.js";
// import validationanalyzeContent from '../middlewear/validation.js';

// import express from "express";
// const router = express.Router();

// router.post("/content", validationanalyzeContent,createContent);


// export default router

import express from "express";
import {
  createContent,
  getAllContent,
  getContentById,
  deleteContent,
  getStats,
} from "../controllers/contentControllers.js";
import validationanalyzeContent from "../middlewear/validation.js";

const router = express.Router();

// ─────────────────────────────────────────────────────────────────
// IMPORTANT: fixed routes (/stats) MUST come before dynamic /:id
// If /:id comes first, Express treats "stats" as an ID → wrong function runs
// ─────────────────────────────────────────────────────────────────

// POST  /api/content         → create + analyse
router.post("/content",         validationanalyzeContent, createContent);

// GET   /api/content/stats   → counts (total, flagged, pending…)
router.get("/content/stats",    getStats);

// GET   /api/content         → paginated list  ?page=1&limit=20
router.get("/content",          getAllContent);

// GET   /api/content/:id     → single document
router.get("/content/:id",      getContentById);

// DELETE /api/content/:id    → delete document
router.delete("/content/:id",   deleteContent);

export default router;
