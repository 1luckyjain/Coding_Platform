import React, { useState } from "react";
import { problemsData } from "../data/problemData";
import CreateCustomProblem from "./CreateCustomProblem";

const CreateContest = ({ onCreate }) => {
  const [form, setForm] = useState({
    title: "",
    description: "",
    startTime: "",
    endTime: "",
  });

  const [search, setSearch] = useState("");
  const [selectedProblems, setSelectedProblems] = useState([]);
  const [customProblems, setCustomProblems] = useState([]);
  const [showCustomModal, setShowCustomModal] = useState(false);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  /* ---------------- SELECT EXISTING PROBLEMS ---------------- */

  const toggleProblem = (problem) => {
    const exists = selectedProblems.find((p) => p.id === problem.id);
    if (exists) {
      setSelectedProblems(selectedProblems.filter((p) => p.id !== problem.id));
    } else {
      setSelectedProblems([...selectedProblems, problem]);
    }
  };

  const move = (index, dir) => {
    const copy = [...selectedProblems];
    const newIndex = index + dir;
    if (newIndex < 0 || newIndex >= copy.length) return;
    [copy[index], copy[newIndex]] = [copy[newIndex], copy[index]];
    setSelectedProblems(copy);
  };

  /* ---------------- SUBMIT ---------------- */

  const handleSubmit = (e) => {
    e.preventDefault();

    if (selectedProblems.length === 0 && customProblems.length === 0) {
      alert("Add at least one problem");
      return;
    }

    const contest = {
      id: Date.now(),
      title: form.title,
      description: form.description,
      startTime: form.startTime,
      endTime: form.endTime,

      problemIds: selectedProblems.map((p) => p.id),
      customProblems: customProblems,

      status: "Upcoming",
      participants: 0,
    };

    onCreate(contest);

    setForm({ title: "", description: "", startTime: "", endTime: "" });
    setSelectedProblems([]);
    setCustomProblems([]);
  };

  /* ---------------- FILTER ---------------- */

  const filteredProblems = problemsData.filter(
    (p) =>
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.tags.some((t) => t.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="max-w-5xl mx-auto bg-white p-6 rounded-xl shadow">
      <h2 className="text-2xl font-bold mb-4">Create Contest</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          name="title"
          placeholder="Contest Title"
          className="border w-full px-4 py-2 rounded"
          value={form.title}
          onChange={handleChange}
          required
        />

        <textarea
          name="description"
          placeholder="Contest Description"
          className="border w-full px-4 py-2 rounded"
          value={form.description}
          onChange={handleChange}
          required
        />

        <div className="grid grid-cols-2 gap-4">
          <input
            type="datetime-local"
            name="startTime"
            className="border px-4 py-2 rounded"
            value={form.startTime}
            onChange={handleChange}
            required
          />
          <input
            type="datetime-local"
            name="endTime"
            className="border px-4 py-2 rounded"
            value={form.endTime}
            onChange={handleChange}
            required
          />
        </div>

        {/* ---------------- EXISTING PROBLEMS ---------------- */}

        <h3 className="font-semibold mt-6">Add Existing Problems</h3>

        <input
          placeholder="Search problems..."
          className="border px-3 py-2 w-full rounded"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 max-h-64 overflow-y-auto border p-3 rounded">
          {filteredProblems.map((p) => {
            const selected = selectedProblems.some((sp) => sp.id === p.id);
            return (
              <button
                type="button"
                key={p.id}
                onClick={() => toggleProblem(p)}
                className={`border px-3 py-2 rounded text-left ${
                  selected ? "bg-blue-100 border-blue-400" : "hover:bg-gray-50"
                }`}
              >
                <div className="font-medium">{p.title}</div>
                <div className="text-sm text-gray-500">
                  {p.difficulty} • {p.tags.join(", ")}
                </div>
              </button>
            );
          })}
        </div>

        <button
          type="button"
          onClick={() => setShowCustomModal(true)}
          className="text-blue-600 underline mt-3"
        >
          + Add Custom Problem
        </button>

        {/* ---------------- ORDER ---------------- */}

        <h3 className="font-semibold mt-4">Contest Problems Order</h3>

        {selectedProblems.map((p, i) => (
          <div
            key={p.id}
            className="flex justify-between items-center border px-3 py-2 rounded mb-2"
          >
            <span>
              {i + 1}. {p.title}
            </span>
            <div className="space-x-2">
              <button type="button" onClick={() => move(i, -1)}>
                ↑
              </button>
              <button type="button" onClick={() => move(i, 1)}>
                ↓
              </button>
            </div>
          </div>
        ))}

        {/* ---------------- CUSTOM PROBLEMS ---------------- */}

        {customProblems.length > 0 && (
          <>
            <h3 className="font-semibold mt-4">Custom Problems</h3>
            {customProblems.map((p, i) => (
              <div
                key={p.id}
                className="border px-3 py-2 rounded mb-2 bg-purple-50"
              >
                {i + 1}. {p.title} ({p.difficulty})
              </div>
            ))}
          </>
        )}

        <button
          type="submit"
          className="w-full py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded"
        >
          Create Contest
        </button>
      </form>

      {/* ---------------- MODAL ---------------- */}

      {showCustomModal && (
        <CreateCustomProblem
          onAdd={(problem) =>
            setCustomProblems([...customProblems, problem])
          }
          onClose={() => setShowCustomModal(false)}
        />
      )}
    </div>
  );
};

export default CreateContest;
