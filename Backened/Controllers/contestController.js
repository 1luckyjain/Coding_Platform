const mongoose = require("mongoose");
const Contest = require("../Models/ContestModel");
const Problem = require("../Models/ProblemModel");

/* ================================
   GET ALL CONTESTS
================================ */
exports.getContests = async (req, res) => {
  try {
    const contests = await Contest.find()
      .sort({ startTime: 1 })
      .populate("problems");

    res.status(200).json({
      status: "success",
      results: contests.length,
      data: contests,
    });
  } catch (err) {
    res.status(500).json({
      status: "error",
      message: err.message,
    });
  }
};

/* ================================
   CREATE CONTEST (FIXED & IMPROVED)
================================ */
exports.createContest = async (req, res) => {
  try {
    const {
      title,
      description,
      startTime,
      endTime,
      rules = "",
      visibility = "public",
      problems = [],        // existing problem IDs
      customProblems = [],  // custom problems from frontend
    } = req.body;

    /* ✅ Validation */
    if (!title || !description || !startTime || !endTime) {
      return res.status(400).json({
        status: "fail",
        message: "Missing required fields",
      });
    }

    if (new Date(endTime) <= new Date(startTime)) {
      return res.status(400).json({
        status: "fail",
        message: "endTime must be greater than startTime",
      });
    }

    /* 1️⃣ Create contest first */
    const contest = await Contest.create({
      title,
      description,
      startTime,
      endTime,
      rules,
      visibility,
      problems: [],
      createdBy: req.user?.id,
    });

    const problemIdsToAttach = [];

    /* 2️⃣ Attach existing DB problems (only valid ObjectIds) */
    if (Array.isArray(problems)) {
      for (const id of problems) {
        if (mongoose.Types.ObjectId.isValid(id)) {
          const p = await Problem.findById(id);
          if (p) problemIdsToAttach.push(p._id);
        }
      }
    }

    /* 3️⃣ Create & attach custom problems */
    if (Array.isArray(customProblems) && customProblems.length > 0) {
      const createdProblems = await Promise.all(
        customProblems.map((p) =>
          Problem.create({
            title: p.title || "Custom Problem",
            description: p.description || "",
            difficulty: p.difficulty || "Medium",
            contest: contest._id,
          })
        )
      );

      createdProblems.forEach((p) => problemIdsToAttach.push(p._id));
    }

    /* 4️⃣ Update contest with problems */
    if (problemIdsToAttach.length > 0) {
      contest.problems = problemIdsToAttach;
      await contest.save();
    }

    /* 5️⃣ Populate problems before sending response */
    await contest.populate("problems");

    res.status(201).json({
      status: "success",
      data: contest,
    });
  } catch (err) {
    console.error("Create contest error:", err);
    res.status(500).json({
      status: "error",
      message: err.message,
    });
  }
};

/* ================================
   ADD PROBLEMS TO CONTEST (OPTIONAL)
================================ */
exports.addProblemsToContest = async (req, res) => {
  try {
    const { contestId } = req.body;

    if (!contestId) {
      return res.status(400).json({
        status: "fail",
        message: "contestId is required",
      });
    }

    const problems = await Problem.find({ contest: contestId });

    const contest = await Contest.findByIdAndUpdate(
      contestId,
      {
        $addToSet: {
          problems: { $each: problems.map((p) => p._id) },
        },
      },
      { new: true }
    ).populate("problems");

    if (!contest) {
      return res.status(404).json({
        status: "fail",
        message: "Contest not found",
      });
    }

    res.status(200).json({
      status: "success",
      data: contest,
    });
  } catch (err) {
    res.status(500).json({
      status: "error",
      message: err.message,
    });
  }
};

/* ================================
   PARTICIPATE IN CONTEST
================================ */
exports.participateInContest = async (req, res) => {
  try {
    const contestId = req.params.id;
    const userId = req.user.id;

    const contest = await Contest.findById(contestId);

    if (!contest) {
      return res.status(404).json({
        status: "fail",
        message: "Contest not found",
      });
    }

    const now = new Date();

    // ❌ Contest ended
    if (now > new Date(contest.endTime)) {
      return res.status(400).json({
        status: "fail",
        message: "Contest has already ended",
      });
    }

    // ❌ Already participated
    if (contest.participants.includes(userId)) {
      return res.status(400).json({
        status: "fail",
        message: "You have already participated",
      });
    }

    contest.participants.push(userId);
    contest.participantsCount += 1;

    await contest.save();

    res.status(200).json({
      status: "success",
      message: "Participation successful",
      data: contest,
    });
  } catch (err) {
    res.status(500).json({
      status: "error",
      message: err.message,
    });
  }
};
