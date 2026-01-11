const mongoose = require("mongoose");

const ProblemSchema = new mongoose.Schema(
  {
    contest: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Contest",
      required: false, // Made optional for standalone problems
    },
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    difficulty: {
      type: String,
      enum: ["Easy", "Medium", "Hard"],
      required: true,
    },
    acceptance: {
      type: String,
      default: "0.0%",
    },
    constraints: {
      type: String,
      required: true,
    },
    examples: [
      {
        input: { type: String, required: true },
        output: { type: String, required: true },
        explanation: { type: String },
      },
    ],
    statement: {
      type: String,
      required: true,
    },
    inputFormat: {
      type: String,
      required: true,
    },
    outputFormat: {
      type: String,
      required: true,
    },
    timeLimit: {
      type: String,
      default: "1s",
    },
    memoryLimit: {
      type: String,
      default: "256MB",
    },
    testCases: [
      {
        input: { type: String, required: true },
        output: { type: String, required: true },
        isHidden: { type: Boolean, default: false },
      },
    ],
    tags: [String], // e.g. ['dp', 'graph', 'math']
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Problem", ProblemSchema);
 