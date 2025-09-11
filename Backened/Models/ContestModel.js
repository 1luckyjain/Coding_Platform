const mongoose = require("mongoose");

const ContestSchema = new mongoose.Schema(
  {
    contest_id: {
      type: String,
      required: true,
      unique: true,
    },
    title: {
      type: String,
      required: true,
    },
    startTime: {
      type: Date,
      required: true,
    },
    endTime: {
      type: Date,
      required: true,
    },
    problems: [
      {
        description: String,
        problem_id: String,
        title: String,
        difficulty: { type: String, enum: ["easy", "medium", "hard"] },
        testcases: [
          {
            input: String,
          },
        ],
      },
    ],

    description: {
      type: String,
      required: true,
    },
    participants: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Contest", ContestSchema);
const contestModel = mongoose.model("contests", ContestSchema);
