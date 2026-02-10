// import Content from "../models/content.js";
// // import performAnalysis from "../services/analysisService.js";
// import analysisService from "../services/analysisService.js";


// export const createContent = async (req, res) => {
//   try {
//     const { text } = req.body;

//     if (!text) {
//       return res.status(400).json({ message: "Text is required" });
//     }
// // string receive ho gya hai ab usko db m store krna hai or status pending rakhna hai taki background job usko process kr ske
//     const content = await Content.create({
//       text,
//       status: "pending"
//     });
//     analysisService.performAnalysis(content._id); // Start analysis in the background



//     res.status(201).json({
//       message: "Analysis in progress",
//       contentId: content._id
//     });
//     // Simulate background processing with a timeout (replace with actual analysis logic)
//     // setTimeout(async () => {
//     //     await content.findupdate({ _id: content._id }, { status: "completed", result: "Analysis result here" });
//     setTimeout(async () => {
//       await Content.findByIdAndUpdate(
//         content._id,
//         {
//           status: "completed",
//           result: "Analysis result here"
//         }
//       );
//     }, 3000);


   
//   } catch (error) {
//     console.error("CREATE CONTENT ERROR 👉", error);
//   res.status(500).json({
//     message: "Error creating content",
//     error: error.message
//   });
//   }
// };


// export default { createContent };


import Content from "../models/content.js";
import analysisService from "../services/analysisService.js";
import { paginateQuery } from "../utils/pagination.js";
import logger from "../utils/logger.js";

// ─────────────────────────────────────────────────────────────────
// CREATE CONTENT
// Your existing function — only added logger, removed the setTimeout
// (setTimeout was wrong — analysis already runs in background via
//  analysisService.performAnalysis)
// ─────────────────────────────────────────────────────────────────
export const createContent = async (req, res) => {
  try {
    const { text } = req.body;

    if (!text) {
      return res.status(400).json({ message: "Text is required" });
    }

    // Save to DB with status "pending"
    const content = await Content.create({
      text,
      status: "pending",
    });

    logger.info(`Content created → ${content._id}`);

    // Start AI analysis in background (don't await — user gets response instantly)
    analysisService.performAnalysis(content._id);

    logger.info(`Analysis started in background for → ${content._id}`);

    // Respond immediately — analysis is running in background
    return res.status(201).json({
      message: "Analysis in progress",
      contentId: content._id,
    });

    // ❌ REMOVED the setTimeout — it was overwriting your AI analysis result
    // with the dummy string "Analysis result here"
    // analysisService.performAnalysis() already updates the DB when done

  } catch (error) {
    logger.error("CREATE CONTENT ERROR →", error);
    return res.status(500).json({
      message: "Error creating content",
      error: error.message,
    });
  }
};

// ─────────────────────────────────────────────────────────────────
// GET ALL CONTENT  ← PAGINATION ADDED
// ─────────────────────────────────────────────────────────────────
// URL examples:
//   GET /api/content
//   GET /api/content?page=2&limit=10
//   GET /api/content?status=completed
//   GET /api/content?isFlagged=true&page=1&limit=5
// ─────────────────────────────────────────────────────────────────
export const getAllContent = async (req, res) => {
  try {
    // Build filter from query params (all optional)
    const filter = {};

    if (req.query.status) {
      filter.status = req.query.status;
      // values: pending | processing | completed | failed
    }

    if (req.query.isFlagged !== undefined) {
      // URL gives string "true"/"false" → convert to boolean
      filter.isFlagged = req.query.isFlagged === "true";
    }

    if (req.query.moderationAction) {
      filter.moderationAction = req.query.moderationAction;
      // values: none | warned | hidden | removed
    }

    logger.info(`getAllContent → filter: ${JSON.stringify(filter)}`);

    // paginateQuery runs TWO DB calls in parallel:
    //   1. Content.find(filter).skip(skip).limit(limit)  → page of data
    //   2. Content.countDocuments(filter)                → total count
    const result = await paginateQuery(
      Content,  // model
      filter,   // which docs
      {
        page:   req.query.page,   // from URL  (default → 1)
        limit:  req.query.limit,  // from URL  (default → 20)
        sort:   { createdAt: -1 },// newest first
        select: "text status isFlagged moderationAction createdAt",
      }
    );

    logger.success(`getAllContent → returned ${result.data.length} items`);

    return res.status(200).json({
      success: true,
      data:       result.data,
      pagination: result.pagination,
      /*
        pagination = {
          currentPage:  1,
          itemsPerPage: 20,
          totalItems:   95,
          totalPages:   5,
          hasNextPage:  true,
          hasPrevPage:  false,
          nextPage:     2,
          prevPage:     null
        }
      */
    });

  } catch (error) {
    logger.error("GET ALL CONTENT ERROR →", error);
    return res.status(500).json({
      message: "Error fetching content",
      error: error.message,
    });
  }
};

// ─────────────────────────────────────────────────────────────────
// GET SINGLE CONTENT BY ID
// ─────────────────────────────────────────────────────────────────
export const getContentById = async (req, res) => {
  try {
    const content = await Content.findById(req.params.id);

    if (!content) {
      logger.warn(`Content not found → ${req.params.id}`);
      return res.status(404).json({ message: "Content not found" });
    }

    logger.info(`Fetched content → ${req.params.id}`);

    return res.status(200).json({
      success: true,
      data: content,
    });

  } catch (error) {
    logger.error("GET CONTENT BY ID ERROR →", error);
    return res.status(500).json({
      message: "Error fetching content",
      error: error.message,
    });
  }
};

// ─────────────────────────────────────────────────────────────────
// DELETE CONTENT BY ID
// ─────────────────────────────────────────────────────────────────
export const deleteContent = async (req, res) => {
  try {
    const content = await Content.findByIdAndDelete(req.params.id);

    if (!content) {
      logger.warn(`Delete failed — not found → ${req.params.id}`);
      return res.status(404).json({ message: "Content not found" });
    }

    logger.success(`Content deleted → ${req.params.id}`);

    return res.status(200).json({
      success: true,
      message: "Content deleted successfully",
    });

  } catch (error) {
    logger.error("DELETE CONTENT ERROR →", error);
    return res.status(500).json({
      message: "Error deleting content",
      error: error.message,
    });
  }
};

// ─────────────────────────────────────────────────────────────────
// GET STATS (no pagination — just counts)
// ─────────────────────────────────────────────────────────────────
export const getStats = async (req, res) => {
  try {
    const stats = await Content.aggregate([
      {
        $group: {
          _id:     null,
          total:   { $sum: 1 },
          flagged: { $sum: { $cond: ["$isFlagged", 1, 0] } },
          pending: { $sum: { $cond: [{ $eq: ["$status", "pending"] },   1, 0] } },
          completed:{ $sum:{ $cond: [{ $eq: ["$status", "completed"] }, 1, 0] } },
          failed:  { $sum: { $cond: [{ $eq: ["$status", "failed"] },    1, 0] } },
        },
      },
    ]);

    logger.info("Stats fetched");

    return res.status(200).json({
      success: true,
      data: stats[0] || {
        total: 0, flagged: 0, pending: 0, completed: 0, failed: 0,
      },
    });

  } catch (error) {
    logger.error("GET STATS ERROR →", error);
    return res.status(500).json({
      message: "Error fetching stats",
      error: error.message,
    });
  }
};

export default { createContent, getAllContent, getContentById, deleteContent, getStats };