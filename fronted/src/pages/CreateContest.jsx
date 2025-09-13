import React, { useState } from "react";

const CreateContest = ({ onCreate }) => {
  const [form, setForm] = useState({
    title: "",
    description: "",
    startTime: "",
    endTime: "",
    problems: 1,
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const newContest = {
      id: Date.now(), // frontend-only ID
      title: form.title,
      description: form.description,
      status: "Upcoming",
      date: `${new Date(form.startTime).toLocaleString()} - ${new Date(
        form.endTime
      ).toLocaleString()}`,
      participants: 0,
      problems: form.problems,
    };

    onCreate(newContest); // pass contest back to parent (Contests.jsx)
    setForm({
      title: "",
      description: "",
      startTime: "",
      endTime: "",
      problems: 1,
    });
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-lg w-full md:w-1/2 mx-auto">
      <h2 className="text-2xl font-bold mb-4">Create New Contest</h2>
      <form className="space-y-4" onSubmit={handleSubmit}>
        <input
          type="text"
          name="title"
          placeholder="Contest Title"
          value={form.title}
          onChange={handleChange}
          className="border w-full px-4 py-2 rounded-lg"
          required
        />

        <textarea
          name="description"
          placeholder="Contest Description"
          value={form.description}
          onChange={handleChange}
          className="border w-full px-4 py-2 rounded-lg"
          required
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            type="datetime-local"
            name="startTime"
            value={form.startTime}
            onChange={handleChange}
            className="border w-full px-4 py-2 rounded-lg"
            required
          />
          <input
            type="datetime-local"
            name="endTime"
            value={form.endTime}
            onChange={handleChange}
            className="border w-full px-4 py-2 rounded-lg"
            required
          />
        </div>

        <input
          type="number"
          name="problems"
          placeholder="Number of Problems"
          value={form.problems}
          onChange={handleChange}
          className="border w-full px-4 py-2 rounded-lg"
          min="1"
          required
        />

        <button
          type="submit"
          className="w-full py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:opacity-90 transition"
        >
          Create Contest
        </button>
      </form>
    </div>
  );
};

export default CreateContest;
