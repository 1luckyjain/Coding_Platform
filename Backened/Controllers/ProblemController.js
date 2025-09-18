const Problem = require("../Models/ProblemModel");
const Contest = require("../Models/ContestModel");

exports.getProblems = async (req, res) => {
  try {
    const data = await Problem.find();
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ message: "Error fetching problems" });
  }
};

exports.deleteProblem = async (req, res) => {
  try {
    const { id } = req.params;
    await Problem.findByIdAndDelete(id);
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ message: "Error deleting problem" });
  }
};

exports.addProblem = async (req, res) => {
  try {
    const problem = await Problem.create(req.body);
    await problem.save();
    res.status(201).json(problem);
  } catch (error) {
    res.status(500).json({ message: "Error adding problem" });
  }
};
