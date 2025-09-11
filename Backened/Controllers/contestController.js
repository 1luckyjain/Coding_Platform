const Contest = require("../Models/ContestModel");

exports.getContests = async (req, res) => {
  const data = await Contest.find();
  res.status(200).json({
    status: "success",
    results: data.length,
    data: { data },
  });
};

exports.createContest = async (req, res) => {
  const contest = await Contest.create(req.body);

  res.status(201).json({
    status: "success",
    data: { contest },
  });
};
