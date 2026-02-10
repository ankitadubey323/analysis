import mongoose from "mongoose";

/**
 * Content Schema - Updated for AI Analysis
 * Minimal changes to work with groqService and analysisService
 */

const contentSchema = new mongoose.Schema(
  {
    // ========================================
    // ORIGINAL CONTENT
    // ========================================
    text: {
      type: String,
      required: true,
      trim: true,
      maxlength: 10000,
    },

    // User who submitted (you can add this later if needed)
    userId: {
      type: String,
      default: "anonymous",
    },

    // ========================================
    // PROCESSING STATUS
    // ========================================
    status: {
      type: String,
      enum: ["pending", "processing", "completed", "failed"],
      default: "pending",
    },

    // ========================================
    // AI ANALYSIS RESULTS
    // This is what groqService returns
    // ========================================
    analysis: {
      // Toxicity Detection
      toxicity: {
        is_toxic: Boolean,
        toxicity_score: Number, // 0-100
        categories: [String],
        severity: String, // low, medium, high, critical
        explanation: String,
      },

      // Sentiment Analysis
      sentiment: {
        sentiment: String, // positive, negative, neutral, mixed
        confidence: Number, // 0-1
        emotions: [String],
        tone: String,
      },

      // Summary
      summary: String,

      // Keywords
      keywords: [String],

      // Language
      language: String,

      // Processing metadata
      processingTime: Number,
      model: String,
    },

    // ========================================
    // FLAGGING & MODERATION
    // This is what analysisService decides
    // ========================================
    
    // Is this content flagged?
    isFlagged: {
      type: Boolean,
      default: false,
    },

    // What action to take?
    moderationAction: {
      type: String,
      enum: ["none", "warned", "hidden", "removed"],
      default: "none",
    },

    // Risk level
    riskLevel: {
      type: String,
      enum: ["low", "medium", "high", "critical"],
      default: "low",
    },

    // ========================================
    // ERROR HANDLING
    // ========================================
    error: {
      message: String,
      timestamp: Date,
    },
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt
  }
);

// ========================================
// INDEXES FOR BETTER PERFORMANCE
// ========================================
contentSchema.index({ status: 1 });
contentSchema.index({ isFlagged: 1 });
contentSchema.index({ createdAt: -1 });

const Content = mongoose.model("Content", contentSchema);

export default Content;
