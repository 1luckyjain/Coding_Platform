import React, { useState, useMemo } from "react";
import axios from "axios";
import { problemsData } from "../data/problemData";
import CreateCustomProblem from "./CreateCustomProblem";

/* =========================
   Helpers
========================= */

const getDurationText = (start, end) => {
  if (!start || !end) return "";
  const diff = new Date(end) - new Date(start);
  if (diff <= 0) return "";

  const mins = Math.floor(diff / (1000 * 60));
  const h = Math.floor(mins / 60);
  const m = mins % 60;

  if (h && m) return `${h}h ${m}m`;
  if (h) return `${h} hours`;
  return `${m} minutes`;
};

const CreateContest = ({ onCreate }) => {
  const [form, setForm] = useState({
    title: "",
    description: "",
    startTime: "",
    endTime: "",
    rules: "",
    visibility: "public",
  });

  const [search, setSearch] = useState("");
  const [selectedProblems, setSelectedProblems] = useState([]);
  const [customProblems, setCustomProblems] = useState([]);
  const [showCustomModal, setShowCustomModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const durationText = useMemo(
    () => getDurationText(form.startTime, form.endTime),
    [form.startTime, form.endTime]
  );

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const toggleProblem = (problem) => {
    const exists = selectedProblems.find((p) => p.id === problem.id);
    if (exists) {
      setSelectedProblems(selectedProblems.filter((p) => p.id !== problem.id));
    } else {
      setSelectedProblems([...selectedProblems, problem]);
    }
  };

  /* =========================
     SUBMIT
  ========================= */

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.title || !form.description || !form.startTime || !form.endTime) {
      alert("Please fill all required fields");
      return;
    }

    const diff = new Date(form.endTime) - new Date(form.startTime);
    if (diff <= 0) {
      alert("End time must be after start time");
      return;
    }

    if (diff < 30 * 60 * 1000) {
      alert("Contest duration must be at least 30 minutes");
      return;
    }

    if (selectedProblems.length === 0 && customProblems.length === 0) {
      alert("Add at least one problem");
      return;
    }

    try {
      setSubmitting(true);

      const token = localStorage.getItem("token");
      if (!token) {
        alert("Login required");
        return;
      }

      /* 🔥 IMPORTANT FIX:
         Treat ALL selected problems as CUSTOM problems
         because problemsData uses numeric IDs (not MongoDB ObjectIds)
      */

      const allCustomProblems = [
        ...customProblems,
        ...selectedProblems.map((p) => ({
          title: p.title,
          description: p.description || "",
          difficulty: p.difficulty || "Medium",
        })),
      ];

      const payload = {
        title: form.title,
        description: form.description,
        startTime: new Date(form.startTime).toISOString(),
        endTime: new Date(form.endTime).toISOString(),
        rules: form.rules,
        visibility: form.visibility,
        problems: [], // ❌ DO NOT send numeric ids
        customProblems: allCustomProblems,
      };

      const res = await axios.post(
        "http://localhost:8080/api/v1/contests",
        payload,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      onCreate(res.data.data);

      setForm({
        title: "",
        description: "",
        startTime: "",
        endTime: "",
        rules: "",
        visibility: "public",
      });
      setSelectedProblems([]);
      setCustomProblems([]);
      setShowCustomModal(false);
    } catch (err) {
      alert(err.response?.data?.message || "Contest creation failed");
    } finally {
      setSubmitting(false);
    }
  };

  const filteredProblems = problemsData.filter(
    (p) =>
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      (p.tags || []).some((t) => t.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="max-w-5xl mx-auto bg-white p-8 rounded-2xl shadow">
      <h2 className="text-3xl font-bold mb-6">🏁 Create Contest</h2>

      <form onSubmit={handleSubmit} className="space-y-6">

        {/* BASIC INFO */}
        <div className="bg-gray-50 p-5 rounded-xl space-y-4">
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
        </div>

        {/* TIMING */}
        <div className="bg-gray-50 p-5 rounded-xl space-y-4">
          <h3 className="font-semibold text-lg">⏱ Contest Timing</h3>

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

          {durationText && (
            <div className="text-blue-600 font-medium">
              ⏳ Contest Duration: <b>{durationText}</b>
            </div>
          )}
        </div>

        {/* RULES */}
        <div className="bg-gray-50 p-5 rounded-xl">
          <h3 className="font-semibold mb-2">📝 Rules</h3>
          <textarea
            name="rules"
            placeholder="Contest rules (optional)"
            className="border w-full px-4 py-2 rounded"
            value={form.rules}
            onChange={handleChange}
          />
        </div>

        {/* PROBLEMS */}
        <div className="bg-gray-50 p-5 rounded-xl space-y-4">
          <h3 className="font-semibold">📚 Add Problems</h3>

          <input
            placeholder="Search problems..."
            className="border px-3 py-2 w-full rounded"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 max-h-64 overflow-y-auto">
            {filteredProblems.map((p) => {
              const selected = selectedProblems.some((sp) => sp.id === p.id);
              return (
                <button
                  type="button"
                  key={p.id}
                  onClick={() => toggleProblem(p)}
                  className={`border px-3 py-2 rounded text-left ${
                    selected
                      ? "bg-blue-100 border-blue-400"
                      : "hover:bg-white"
                  }`}
                >
                  <div className="font-medium">{p.title}</div>
                  <div className="text-xs text-gray-500">
                    {p.difficulty} • {(p.tags || []).join(", ")}
                  </div>
                </button>
              );
            })}
          </div>

          <button
            type="button"
            onClick={() => setShowCustomModal(true)}
            className="text-blue-600 underline"
          >
            + Add Custom Problem
          </button>
        </div>

        {/* SUBMIT */}
        <button
          type="submit"
          disabled={submitting}
          className="w-full py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl text-lg font-semibold"
        >
          {submitting ? "Creating Contest..." : "🚀 Create Contest"}
        </button>
      </form>

      {showCustomModal && (
        <CreateCustomProblem
          onAdd={(problem) => setCustomProblems([...customProblems, problem])}
          onClose={() => setShowCustomModal(false)}
        />
      )}
    </div>
  );
};

export default CreateContest;
