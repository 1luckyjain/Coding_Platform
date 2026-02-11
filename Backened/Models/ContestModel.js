const mongoose = require("mongoose");

const ContestSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
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
        ref: "Problem",
      },
    ],

    visibility: {
      type: String,
      enum: ["public", "private"],
      default: "public",
    },

    participants: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],

    participantsCount: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

/* 🧠 Computed status */
ContestSchema.virtual("status").get(function () {
  const now = new Date();
  if (now < this.startTime) return "Upcoming";
  if (now > this.endTime) return "Ended";
  return "Live";
});

/* Auto populate problems */
ContestSchema.pre(/^find/, function (next) {
  this.populate("problems");
  next();
});

module.exports = mongoose.model("Contest", ContestSchema);
