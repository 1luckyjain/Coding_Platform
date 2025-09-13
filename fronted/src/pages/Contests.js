import React, { useState } from "react";
import CreateContest from "./CreateContest";
import Header from "./Header";

const Contests = () => {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [showForm, setShowForm] = useState(false);

  const [contests, setContests] = useState([
    {
      id: 1,
      title: "Algorithm Challenge 2024",
      description:
        "Test your algorithmic skills with challenging problems covering arrays, graphs, and dynamic programming.",
      status: "Active",
      date: "Jan 20, 2024 10:00 AM - Jan 20, 2024 2:00 PM",
      participants: 156,
      problems: 3,
      remaining: "2h 15m remaining",
    },
    {
      id: 2,
      title: "Data Structures Marathon",
      description:
        "Comprehensive contest focusing on fundamental data structures and their applications.",
      status: "Upcoming",
      date: "Jan 25, 2024 9:00 AM - Jan 25, 2024 1:00 PM",
      participants: 89,
      problems: 3,
    },
  ]);

  const handleCreate = (newContest) => {
    setContests([...contests, newContest]);
    setShowForm(false);
  };

  const filteredContests = contests.filter((contest) => {
    const matchesSearch = contest.title
      .toLowerCase()
      .includes(search.toLowerCase());
    const matchesStatus =
      statusFilter === "All" || contest.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <>
      <Header />
      <div className="p-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold">Contests</h1>
            <p className="text-gray-600">
              Manage and participate in coding contests
            </p>
          </div>
          <button
            onClick={() => setShowForm(true)}
            className="px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg shadow hover:opacity-90 transition"
          >
            + Create Contest
          </button>
        </div>

        {/* Show Create Contest Form */}
        {showForm && <CreateContest onCreate={handleCreate} />}

        {/* Search + Filter */}
        {!showForm && (
          <>
            <div className="flex items-center gap-4 mb-6">
              <input
                type="text"
                placeholder="Search contests..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="border rounded-lg px-4 py-2 w-full focus:ring focus:ring-blue-300"
              />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="border rounded-lg px-4 py-2"
              >
                <option value="All">All Status</option>
                <option value="Active">Active</option>
                <option value="Upcoming">Upcoming</option>
                <option value="Completed">Completed</option>
              </select>
            </div>

            {/* Contest Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {filteredContests.map((contest) => (
                <div
                  key={contest.id}
                  className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition"
                >
                  <div className="flex justify-between items-center mb-2">
                    <h2 className="text-xl font-semibold">{contest.title}</h2>
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium ${
                        contest.status === "Active"
                          ? "bg-green-100 text-green-600"
                          : contest.status === "Upcoming"
                          ? "bg-blue-100 text-blue-600"
                          : "bg-gray-200 text-gray-600"
                      }`}
                    >
                      {contest.status}
                    </span>
                  </div>

                  <p className="text-gray-600 mb-4">{contest.description}</p>

                  <div className="text-sm text-gray-500 space-y-1 mb-4">
                    <p>📅 {contest.date}</p>
                    <p>👥 {contest.participants} participants</p>
                    {contest.status === "Active" && (
                      <p>⏳ {contest.remaining}</p>
                    )}
                    <p>{contest.problems} problems</p>
                  </div>

                  {contest.status === "Active" && (
                    <button className="w-full py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition">
                      Join Contest
                    </button>
                  )}
                  {contest.status === "Upcoming" && (
                    <button className="w-full py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition">
                      View Details
                    </button>
                  )}
                  {contest.status === "Completed" && (
                    <button className="w-full py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition">
                      View Results
                    </button>
                  )}
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default Contests;
