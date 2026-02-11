import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import CreateContest from "./CreateContest";
import Header from "./Header";

/**
 * Contests page — improved interactive UI
 *
 * Assumptions:
 * - GET http://localhost:8080/api/v1/contests returns { data: [ ...contestObjects ] }
 * - Each contest object has at least: _id, title, description, startTime, endTime, createdAt, problems (array)
 * - Optional endpoint: POST /api/v1/contests/:id/participate (expects Authorization header)
 *
 * Requires:
 * - Tailwind CSS
 * - axios
 */

const formatDate = (iso) => {
  if (!iso) return "-";
  const d = new Date(iso);
  return d.toLocaleString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const getStatusFromTimes = (startIso, endIso) => {
  const now = new Date();
  const start = new Date(startIso);
  const end = new Date(endIso);
  if (now < start) return "Upcoming";
  if (now >= start && now <= end) return "Live";
  return "Ended";
};

const formatRelative = (ms) => {
  // ms positive = in future, negative = in past
  const abs = Math.abs(ms);
  const days = Math.floor(abs / (24 * 3600 * 1000));
  const hours = Math.floor((abs % (24 * 3600 * 1000)) / (3600 * 1000));
  const minutes = Math.floor((abs % (3600 * 1000)) / (60 * 1000));
  const seconds = Math.floor((abs % (60 * 1000)) / 1000);

  if (days > 0) return `${days}d ${hours}h`;
  if (hours > 0) return `${hours}h ${minutes}m`;
  if (minutes > 0) return `${minutes}m ${seconds}s`;
  return `${seconds}s`;
};

/* Countdown hook for live countdowns */
const useCountdown = (targetIso) => {
  const [now, setNow] = useState(new Date());
  useEffect(() => {
    if (!targetIso) return;
    const t = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(t);
  }, [targetIso]);
  if (!targetIso) return null;
  const target = new Date(targetIso);
  const diff = target - now;
  return { diff, now };
};

const ContestCard = ({ contest, onParticipate, onView }) => {
  // compute status client-side to avoid stale backend status
  const status = getStatusFromTimes(contest.startTime, contest.endTime);

  const startCountdown = useCountdown(contest.startTime);
  const endCountdown = useCountdown(contest.endTime);

  const startsIn =
    startCountdown && startCountdown.diff > 0
      ? formatRelative(startCountdown.diff)
      : null;
  const endsIn =
    endCountdown && endCountdown.diff > 0 ? formatRelative(endCountdown.diff) : null;

  const participants = contest.participants ?? (contest.participantsCount ?? 0);

  return (
    <div className="bg-white p-5 rounded-2xl shadow hover:shadow-lg transition relative flex flex-col">
      {/* Status badge + timing */}
      <div className="flex justify-between items-start mb-3 gap-2">
        <div>
          <h3 className="text-lg font-semibold">{contest.title}</h3>
          <p className="text-sm text-gray-500 mt-1 line-clamp-2">
            {contest.description || "No description"}
          </p>
        </div>

        <div className="text-right">
          <span
            className={`px-3 py-1 rounded-full text-sm font-medium ${
              status === "Live"
                ? "bg-green-100 text-green-700"
                : status === "Upcoming"
                ? "bg-blue-100 text-blue-700"
                : "bg-gray-100 text-gray-700"
            }`}
          >
            {status}
          </span>
          <div className="mt-2 text-xs text-gray-500">
            <div>Start: {formatDate(contest.startTime)}</div>
            <div>End: {formatDate(contest.endTime)}</div>
          </div>
        </div>
      </div>

      {/* Timing / Live countdown */}
      <div className="flex items-center justify-between mt-4">
        <div className="text-sm text-gray-600">
          {status === "Upcoming" && (
            <div>
              Starts in <strong className="text-gray-900">{startsIn}</strong>
            </div>
          )}

          {status === "Live" && (
            <div>
              Live — ends in{" "}
              <strong className="text-gray-900">
                {endsIn} {/* e.g. "45m 12s" */}
              </strong>
            </div>
          )}

          {status === "Ended" && (
            <div>
              Ended on <strong>{formatDate(contest.endTime)}</strong>
            </div>
          )}
        </div>

        <div className="text-sm text-gray-500">
          👥 <span className="font-medium">{participants}</span>
        </div>
      </div>

      {/* Problems preview */}
      {Array.isArray(contest.problems) && contest.problems.length > 0 && (
        <div className="mt-4 text-sm text-gray-600">
          <div className="font-medium text-sm mb-1">Problems:</div>
          <div className="flex gap-2 flex-wrap">
            {contest.problems.slice(0, 4).map((p, i) => (
              <span
                key={p._id ?? p.id ?? i}
                className="px-2 py-1 bg-gray-50 rounded text-xs border"
                title={p.title ?? p.name ?? "Problem"}
              >
                {p.title ? p.title.slice(0, 24) : `#${i + 1}`}
              </span>
            ))}
            {contest.problems.length > 4 && (
              <span className="px-2 py-1 text-xs text-gray-500">+{contest.problems.length - 4}</span>
            )}
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="mt-5 flex gap-3">
        <button
          onClick={() => onView(contest)}
          className="px-4 py-2 border rounded-lg text-sm hover:bg-gray-50 transition flex-1"
        >
          View details
        </button>

        <button
          onClick={() => onParticipate(contest)}
          disabled={status === "Ended"}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition flex-none ${
            status === "Ended"
              ? "bg-gray-200 text-gray-600 cursor-not-allowed"
              : "bg-gradient-to-r from-indigo-500 to-purple-600 text-white hover:opacity-95"
          }`}
        >
          {status === "Live" ? "Participate" : status === "Upcoming" ? "Register" : "Closed"}
        </button>
      </div>
    </div>
  );
};

const DetailsModal = ({ contest, onClose }) => {
  if (!contest) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative z-10 max-w-2xl w-full bg-white rounded-2xl p-6 shadow-lg">
        <div className="flex justify-between items-start gap-4">
          <div>
            <h2 className="text-2xl font-semibold">{contest.title}</h2>
            <p className="text-sm text-gray-500 mt-1">{contest.description}</p>
          </div>
          <button className="text-gray-500" onClick={onClose}>
            ✕
          </button>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-4 text-sm text-gray-700">
          <div>
            <div className="font-medium">Start</div>
            <div>{formatDate(contest.startTime)}</div>
          </div>
          <div>
            <div className="font-medium">End</div>
            <div>{formatDate(contest.endTime)}</div>
          </div>

          <div className="col-span-2 mt-2">
            <div className="font-medium">Rules</div>
            <div className="text-gray-600">{contest.rules || "No special rules"}</div>
          </div>

          <div className="col-span-2 mt-2">
            <div className="font-medium">Problems ({contest.problems?.length ?? 0})</div>
            <ul className="list-disc ml-5 text-gray-600 mt-1 max-h-48 overflow-y-auto">
              {(contest.problems || []).map((p, i) => (
                <li key={p._id ?? p.id ?? i}>
                  {p.title ?? p.name ?? `Problem ${i + 1}`}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-6 flex justify-end gap-3">
          <button onClick={onClose} className="px-4 py-2 border rounded-lg">
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

const Contests = () => {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [showForm, setShowForm] = useState(false);
  const [contests, setContests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedContest, setSelectedContest] = useState(null);
  const mountedRef = useRef(true);

  useEffect(() => {
    mountedRef.current = true;
    fetchContests();
    return () => {
      mountedRef.current = false;
    };
  }, []);

  const fetchContests = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get("http://localhost:8080/api/v1/contests", {
        headers: {
          Authorization: token ? `Bearer ${token}` : "",
        },
      });
      if (mountedRef.current) {
        // ensure the backend provides dates as ISO; if not, try to convert
        const normalized = (res.data.data || []).map((c) => ({
          ...c,
          startTime: c.startTime ? new Date(c.startTime).toISOString() : null,
          endTime: c.endTime ? new Date(c.endTime).toISOString() : null,
        }));
        setContests(normalized);
      }
    } catch (err) {
      console.error("Failed to fetch contests:", err);
    } finally {
      if (mountedRef.current) setLoading(false);
    }
  };

  const handleCreate = (contest) => {
    // If backend returned the real contest object, it will already have _id
    // Otherwise we do optimistic UI update
    setContests((prev) => [contest, ...prev]);
    setShowForm(false);
  };

  const handleView = (contest) => {
    setSelectedContest(contest);
  };

  const handleParticipate = async (contest) => {
    // Try to call backend participate endpoint if available.
    // If not present, show a friendly message.
    const token = localStorage.getItem("token");
    if (!token) {
      alert("You must be logged in to participate.");
      return;
    }

    if (!contest || !contest._id) {
      alert("Invalid contest");
      return;
    }

    try {
      // optimistic UI update
      setContests((prev) =>
        prev.map((c) =>
          c._id === contest._id
            ? { ...c, participants: (c.participants ?? 0) + 1 }
            : c
        )
      );

      const res = await axios.post(
        `http://localhost:8080/api/v1/contests/${contest._id}/participate`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      // If backend returns updated contest, replace it
      if (res.data?.data) {
        setContests((prev) => prev.map((c) => (c._id === res.data.data._id ? res.data.data : c)));
      } else {
        // otherwise, keep optimistic change
      }
      alert("Participation successful ✅");
    } catch (err) {
      console.error("participation failed:", err);
      // rollback optimistic increment
      setContests((prev) =>
        prev.map((c) =>
          c._id === contest._id
            ? { ...c, participants: Math.max((c.participants ?? 1) - 1, 0) }
            : c
        )
      );
      const message =
        err.response?.data?.message ||
        "Could not register participation. The endpoint might not be implemented.";
      alert(message);
    }
  };

  const filtered = contests.filter((contest) => {
    const matchesSearch =
      contest.title?.toLowerCase().includes(search.toLowerCase()) ||
      contest.description?.toLowerCase().includes(search.toLowerCase());
    const computedStatus = getStatusFromTimes(contest.startTime, contest.endTime);
    const matchesStatus = statusFilter === "All" || computedStatus === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <>
      <Header />
      <div className="p-6 max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold">Contests</h1>
            <p className="text-gray-600 mt-1">Manage and participate in coding contests</p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowForm(true)}
              className="px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg shadow"
            >
              + Create Contest
            </button>
          </div>
        </div>

        {/* Form area */}
        {showForm && (
          <div className="mb-6">
            <CreateContest onCreate={handleCreate} />
          </div>
        )}

        {/* Filters */}
        <div className="flex gap-3 items-center mb-6">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="px-4 py-2 border rounded-lg flex-1"
            placeholder="Search contests or descriptions..."
          />

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 border rounded-lg"
          >
            <option value="All">All</option>
            <option value="Upcoming">Upcoming</option>
            <option value="Live">Live</option>
            <option value="Ended">Ended</option>
          </select>

          <button
            onClick={() => fetchContests()}
            className="px-4 py-2 border rounded-lg"
            title="Refresh"
          >
            Refresh
          </button>
        </div>

        {/* Content */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white p-6 rounded-2xl shadow animate-pulse h-48" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="bg-white p-6 rounded-2xl shadow text-center text-gray-600">
            No contests found. Try creating one!
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {filtered.map((c) => (
              <ContestCard
                key={c._id ?? c.id}
                contest={c}
                onParticipate={handleParticipate}
                onView={handleView}
              />
            ))}
          </div>
        )}
      </div>

      {/* Modal */}
      {selectedContest && (
        <DetailsModal contest={selectedContest} onClose={() => setSelectedContest(null)} />
      )}
    </>
  );
};

export default Contests;
