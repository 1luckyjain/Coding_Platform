const mongoose = require("mongoose");

const ProblemSchema = new mongoose.Schema(
  {
    contest: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Contest",
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
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
      type: Number,
      default: 1, // in seconds
    },
    memoryLimit: {
      type: Number,
      default: 256, // in MB
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
