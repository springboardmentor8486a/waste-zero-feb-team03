import mongoose from "mongoose";

const opportunitySchema = new mongoose.Schema(
  {
    ngo_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
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
      index: true,
    },

    status: {
      type: String,
      enum: ["open", "closed", "in-progress"],
      default: "open",
      index: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Opportunity", opportunitySchema);