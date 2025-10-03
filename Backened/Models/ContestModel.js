const mongoose = require("mongoose");

const ContestSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
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
    rules: {
      type: String,
      default: "",
    },
    problems: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Problem", // reference Problem model
      },
    ],
    visibility: {
      type: String,
      enum: ["public", "private"],
      default: "public",
    },
  },
  {
    timestamps: true,
  }
);

// Auto-populate problems on find
ContestSchema.pre(/^find/, function (next) {
  this.populate("problems");
  next();
});

const Contest = mongoose.model("Contest", ContestSchema);
module.exports = Contest;
