const Contest = require("../Models/ContestModel");
const Problem = require("../Models/ProblemModel");

// Get all contests (with problems populated)
exports.getContests = async (req, res) => {
  try {
    const data = await Contest.find().populate("problems");

    res.status(200).json({
      status: "success",
      results: data.length,
      data,
    });
  } catch (err) {
    res.status(500).json({
      status: "error",
      message: err.message,
    });
  }
};

// Create a new contest (and optional problems)
exports.createContest = async (req, res) => {
  try {
    const { title, description, startTime, endTime, rules, visibility } =
      req.body;

    // If problems are provided, create them first

    // Create contest with problem references
    const contest = await Contest.create({
      title,
      description,
      startTime,
      endTime,
      rules,
      visibility,
    });

    res.status(201).json({
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

exports.addProblemsToContest = async (req, res) => {
  try {
    const { contestId } = req.body;
    const AllProblems = await Problem.find({ contest: contestId });
    const contest = await Contest.findByIdAndUpdate(
      contestId,
      { $addToSet: { problems: { $each: AllProblems.map((p) => p._id) } } },
      { new: true }
    ).populate("problems");

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
// const Contest = require("../Models/ContestModel");

// exports.getContests = async (req, res) => {
//   const data = await Contest.find();
//   res.status(200).json({
//     status: "success",
//     results: data.length,
//     data: { data },
//   });
// };

// exports.createContest = async (req, res) => {
//   const contest = await Contest.create(req.body);

//   res.status(201).json({
//     status: "success",
//     data: { contest },
//   });
// };
