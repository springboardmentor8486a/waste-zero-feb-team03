import mongoose from "mongoose";

const opportunitySchema = new mongoose.Schema(
  {
    ngo_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true, // Optimized for "My Opportunities" dashboard
    },

    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
    },

    description: {
      type: String,
      required: [true, "Description is required"],
    },

    required_skills: {
      type: [String],
      default: [],
    },

    duration: {
      type: String,
      required: [true, "Duration is required"],
    },

    location: {
      type: String,
      required: [true, "Location is required"],
      index: true, // Optimized for filtering by location
    },

    // --- MILESTONE 2: APPLICANTS ARRAY ---
    applicants: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],

    status: {
      type: String,
      enum: ["open", "closed", "in-progress"], // Matches Backend Checklist
      default: "open",
      lowercase: true, // Ensures "Open" and "open" are treated the same
      index: true, // Optimized for filtering by status
    },
  },
  { timestamps: true }
);

// Optional: Compound index for NGOs searching their own posts by status
opportunitySchema.index({ ngo_id: 1, status: 1 });

export default mongoose.model("Opportunity", opportunitySchema);