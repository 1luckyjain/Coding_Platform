import React, { useState } from "react";

const CreateCustomProblem = ({ onAdd, onClose }) => {
  const [problem, setProblem] = useState({
    title: "",
    difficulty: "Easy",
    statement: "",
    testCases: [{ input: "", output: "" }],
  });

  const handleChange = (e) => {
    setProblem({ ...problem, [e.target.name]: e.target.value });
  };

  const updateTestCase = (index, field, value) => {
    const updated = [...problem.testCases];
    updated[index][field] = value;
    setProblem({ ...problem, testCases: updated });
  };

  const addTestCase = () => {
    setProblem({
      ...problem,
      testCases: [...problem.testCases, { input: "", output: "" }],
    });
  };

  const removeTestCase = (index) => {
    const updated = problem.testCases.filter((_, i) => i !== index);
    setProblem({ ...problem, testCases: updated });
  };

  const handleSubmit = () => {
    if (!problem.title || !problem.statement) {
      alert("Title and statement are required");
      return;
    }

    onAdd({
      ...problem,
      id: `custom-${Date.now()}`,
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-xl w-full max-w-xl">
        <h2 className="text-xl font-bold mb-4">Add Custom Problem</h2>

        <input
          name="title"
          placeholder="Problem Title"
          className="border w-full px-3 py-2 rounded mb-2"
          value={problem.title}
          onChange={handleChange}
        />

        <select
          name="difficulty"
          className="border w-full px-3 py-2 rounded mb-2"
          value={problem.difficulty}
          onChange={handleChange}
        >
          <option>Easy</option>
          <option>Medium</option>
          <option>Hard</option>
        </select>

        <textarea
          name="statement"
          placeholder="Problem Statement"
          className="border w-full px-3 py-2 rounded mb-3"
          rows={4}
          value={problem.statement}
          onChange={handleChange}
        />

        <h3 className="font-semibold mb-2">Test Cases</h3>

        {problem.testCases.map((tc, i) => (
          <div key={i} className="grid grid-cols-2 gap-2 mb-2">
            <input
              placeholder="Input"
              className="border px-2 py-1 rounded"
              value={tc.input}
              onChange={(e) => updateTestCase(i, "input", e.target.value)}
            />
            <input
              placeholder="Expected Output"
              className="border px-2 py-1 rounded"
              value={tc.output}
              onChange={(e) => updateTestCase(i, "output", e.target.value)}
            />
            {problem.testCases.length > 1 && (
              <button
                type="button"
                onClick={() => removeTestCase(i)}
                className="col-span-2 text-red-600 text-sm text-left"
              >
                Remove Test Case
              </button>
            )}
          </div>
        ))}

        <button
          type="button"
          onClick={addTestCase}
          className="text-blue-600 text-sm mb-4"
        >
          + Add Test Case
        </button>

        <div className="flex justify-end gap-2">
          <button onClick={onClose} className="px-4 py-2 border rounded">
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="px-4 py-2 bg-blue-600 text-white rounded"
          >
            Add Problem
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateCustomProblem;
