const Problem = require("../Models/ProblemModel");
const Contest = require("../Models/ContestModel");
const Judge0Service = require("../Services/Judge0Service");

exports.getProblems = async (req, res) => {
  try {
    const data = await Problem.find();
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ message: "Error fetching problems" });
  }
};

exports.getProblemById = async (req, res) => {
  try {
    const { id } = req.params;
    const problem = await Problem.findById(id);
    if (!problem) {
      return res.status(404).json({ message: "Problem not found" });
    }
    res.status(200).json(problem);
  } catch (error) {
    res.status(500).json({ message: "Error fetching problem" });
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

// Run code against test cases
exports.runCode = async (req, res) => {
  try {
    const { sourceCode, language, input, problemId } = req.body;

    if (!sourceCode || !language) {
      return res.status(400).json({ 
        message: "Source code and language are required" 
      });
    }

    // Prepare code for execution
    const preparedCode = Judge0Service.prepareCodeForExecution(
      sourceCode, 
      language, 
      problemId
    );

    // Submit to Judge0
    const result = await Judge0Service.submitCode(
      preparedCode, 
      language, 
      input || ''
    );

    res.status(200).json(result);
  } catch (error) {
    console.error('Run code error:', error);
    res.status(500).json({ 
      message: "Error running code",
      error: error.message 
    });
  }
};

// Submit code for final evaluation
exports.submitCode = async (req, res) => {
  try {
    const { sourceCode, language, problemId } = req.body;

    if (!sourceCode || !language || !problemId) {
      return res.status(400).json({ 
        message: "Source code, language, and problem ID are required" 
      });
    }

    // Get problem details
    const problem = await Problem.findById(problemId);
    if (!problem) {
      return res.status(404).json({ message: "Problem not found" });
    }

    // Prepare code for execution
    const preparedCode = Judge0Service.prepareCodeForExecution(
      sourceCode, 
      language, 
      problemId
    );

    const results = [];
    let allPassed = true;

    // Run against all test cases
    for (const testCase of problem.testCases) {
      const result = await Judge0Service.submitCode(
        preparedCode, 
        language, 
        testCase.input,
        testCase.output
      );

      results.push({
        input: testCase.input,
        expectedOutput: testCase.output,
        actualOutput: result.output,
        status: result.status,
        success: result.success,
        time: result.time,
        memory: result.memory,
        isHidden: testCase.isHidden
      });

      if (!result.success) {
        allPassed = false;
      }
    }

    // Calculate score based on passed test cases
    const passedTestCases = results.filter(r => r.success).length;
    const totalTestCases = results.length;
    const score = Math.round((passedTestCases / totalTestCases) * 100);

    res.status(200).json({
      success: allPassed,
      score,
      passedTestCases,
      totalTestCases,
      results,
      message: allPassed ? "All test cases passed!" : "Some test cases failed"
    });

  } catch (error) {
    console.error('Submit code error:', error);
    res.status(500).json({ 
      message: "Error submitting code",
      error: error.message 
    });
  }
};

// Get supported languages
exports.getSupportedLanguages = async (req, res) => {
  try {
    const languages = await Judge0Service.getSupportedLanguages();
    res.status(200).json(languages);
  } catch (error) {
    res.status(500).json({ message: "Error fetching supported languages" });
  }
};

// Add sample problems (for testing)
exports.addSampleProblems = async (req, res) => {
  try {
    const sampleProblems = [
      {
        title: "Two Sum",
        description: `Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.

You may assume that each input would have exactly one solution, and you may not use the same element twice.

You can return the answer in any order.`,
        statement: `Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.`,
        difficulty: "Easy",
        acceptance: "45.8%",
        constraints: `2 <= nums.length <= 10^4
-10^9 <= nums[i] <= 10^9
-10^9 <= target <= 10^9
Only one valid answer exists.`,
        inputFormat: "The input consists of an array of integers and a target integer.",
        outputFormat: "Return the indices of the two numbers that add up to the target.",
        examples: [
          {
            input: "nums = [2,7,11,15], target = 9",
            output: "[0,1]",
            explanation: "Because nums[0] + nums[1] == 9, we return [0, 1]."
          }
        ],
        tags: ["Array", "Hash Table"],
        testCases: [
          {
            input: "nums = [2,7,11,15], target = 9",
            output: "[0,1]",
            isHidden: false
          },
          {
            input: "nums = [3,2,4], target = 6",
            output: "[1,2]",
            isHidden: false
          },
          {
            input: "nums = [3,3], target = 6",
            output: "[0,1]",
            isHidden: true
          }
        ]
      }
    ];

    const insertedProblems = await Problem.insertMany(sampleProblems);
    res.status(201).json({
      message: "Sample problems added successfully",
      problems: insertedProblems
    });
  } catch (error) {
    res.status(500).json({ 
      message: "Error adding sample problems",
      error: error.message 
    });
  }
};
