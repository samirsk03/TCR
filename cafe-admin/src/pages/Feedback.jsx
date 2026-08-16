import { useEffect, useMemo, useState } from "react";
import {
  Star,
  MessageSquare,
  Search,
  RefreshCw,
  User,
  Calendar,
  Phone,
  AlertCircle,
} from "lucide-react";
import api from "../services/api";

const Feedback = () => {
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [ratingFilter, setRatingFilter] = useState("all");

  // ----------------------------------------
  // FETCH ALL FEEDBACK
  // ----------------------------------------

  const fetchFeedback = async () => {
    try {
      setLoading(true);
      setError("");

      const res = await api.get("/feedback");

      setFeedbacks(res.data.data || []);
    } catch (err) {
      console.error("Feedback fetch error:", err);

      setError(
        err.response?.data?.message ||
          "Unable to load feedback."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFeedback();
  }, []);

  // ----------------------------------------
  // STATS
  // ----------------------------------------

  const stats = useMemo(() => {
    const total = feedbacks.length;

    const average =
      total > 0
        ? (
            feedbacks.reduce(
              (sum, item) => sum + item.rating,
              0
            ) / total
          ).toFixed(1)
        : "0.0";

    const fiveStars = feedbacks.filter(
      (item) => item.rating === 5
    ).length;

    const lowRatings = feedbacks.filter(
      (item) => item.rating <= 2
    ).length;

    return {
      total,
      average,
      fiveStars,
      lowRatings,
    };
  }, [feedbacks]);

  // ----------------------------------------
  // FILTER
  // ----------------------------------------

  const filteredFeedbacks = useMemo(() => {
    let data = [...feedbacks];

    if (ratingFilter !== "all") {
      data = data.filter(
        (item) =>
          item.rating === Number(ratingFilter)
      );
    }

    if (search.trim()) {
      const searchText = search.toLowerCase();

      data = data.filter((item) => {
        const name =
          item.customerId?.name?.toLowerCase() || "";

        const phone =
          item.customerId?.phone?.toLowerCase() || "";

        const comment =
          item.comment?.toLowerCase() || "";

        return (
          name.includes(searchText) ||
          phone.includes(searchText) ||
          comment.includes(searchText)
        );
      });
    }

    return data;
  }, [feedbacks, ratingFilter, search]);

  // ----------------------------------------
  // STARS
  // ----------------------------------------

  const renderStars = (rating) => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            size={18}
            className={
              star <= rating
                ? "fill-yellow-400 text-yellow-400"
                : "text-gray-300"
            }
          />
        ))}
      </div>
    );
  };

  return (
    <div className="p-6 md:p-8 space-y-8">

      {/* ----------------------------------------
          HEADER
      ---------------------------------------- */}

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">

        <div>

          <div className="flex items-center gap-3">

            <div className="w-12 h-12 rounded-2xl bg-purple-100 text-purple-600 flex items-center justify-center">
              <MessageSquare size={24} />
            </div>

            <div>

              <h1 className="text-3xl font-black text-gray-900">
                Customer Feedback
              </h1>

              <p className="text-gray-500 mt-1">
                See what your customers are saying
              </p>

            </div>

          </div>

        </div>

        <button
          onClick={fetchFeedback}
          disabled={loading}
          className="flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-gray-900 text-white font-bold hover:bg-gray-800 transition disabled:opacity-50"
        >
          <RefreshCw
            size={18}
            className={loading ? "animate-spin" : ""}
          />

          Refresh
        </button>

      </div>

      {/* ----------------------------------------
          STATS
      ---------------------------------------- */}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">

        <div className="bg-white rounded-2xl shadow-sm border p-6">

          <MessageSquare className="text-purple-600" />

          <p className="text-sm text-gray-500 mt-4">
            Total Feedback
          </p>

          <h2 className="text-3xl font-black mt-1">
            {stats.total}
          </h2>

        </div>

        <div className="bg-white rounded-2xl shadow-sm border p-6">

          <Star className="text-yellow-500 fill-yellow-400" />

          <p className="text-sm text-gray-500 mt-4">
            Average Rating
          </p>

          <h2 className="text-3xl font-black mt-1">
            {stats.average}
          </h2>

        </div>

        <div className="bg-white rounded-2xl shadow-sm border p-6">

          <Star className="text-green-600 fill-green-600" />

          <p className="text-sm text-gray-500 mt-4">
            5 Star Reviews
          </p>

          <h2 className="text-3xl font-black mt-1">
            {stats.fiveStars}
          </h2>

        </div>

        <div className="bg-white rounded-2xl shadow-sm border p-6">

          <AlertCircle className="text-red-500" />

          <p className="text-sm text-gray-500 mt-4">
            Low Ratings
          </p>

          <h2 className="text-3xl font-black mt-1">
            {stats.lowRatings}
          </h2>

        </div>

      </div>

      {/* ----------------------------------------
          FILTERS
      ---------------------------------------- */}

      <div className="bg-white rounded-2xl shadow-sm border p-5">

        <div className="flex flex-col md:flex-row gap-4">

          <div className="relative flex-1">

            <Search
              size={20}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
            />

            <input
              type="text"
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
              placeholder="Search customer or feedback..."
              className="w-full pl-12 pr-4 py-3 rounded-xl bg-gray-50 border border-gray-200 outline-none focus:border-gray-400"
            />

          </div>

          <select
            value={ratingFilter}
            onChange={(e) =>
              setRatingFilter(e.target.value)
            }
            className="px-5 py-3 rounded-xl border border-gray-200 bg-white font-medium outline-none"
          >
            <option value="all">
              All Ratings
            </option>

            <option value="5">
              ⭐ 5 Stars
            </option>

            <option value="4">
              ⭐ 4 Stars
            </option>

            <option value="3">
              ⭐ 3 Stars
            </option>

            <option value="2">
              ⭐ 2 Stars
            </option>

            <option value="1">
              ⭐ 1 Star
            </option>
          </select>

        </div>

      </div>

      {/* ----------------------------------------
          ERROR
      ---------------------------------------- */}

      {error && (

        <div className="bg-red-50 border border-red-200 text-red-700 rounded-2xl p-5 flex items-center gap-3">

          <AlertCircle size={22} />

          <span className="font-medium">
            {error}
          </span>

        </div>

      )}

      {/* ----------------------------------------
          LOADING
      ---------------------------------------- */}

      {loading ? (

        <div className="grid gap-5">

          {[1, 2, 3].map((item) => (

            <div
              key={item}
              className="h-48 bg-gray-200 rounded-2xl animate-pulse"
            />

          ))}

        </div>

      ) : filteredFeedbacks.length === 0 ? (

        /* ----------------------------------------
            EMPTY
        ---------------------------------------- */

        <div className="bg-white rounded-2xl border shadow-sm p-16 text-center">

          <MessageSquare
            size={60}
            className="mx-auto text-gray-300"
          />

          <h3 className="text-2xl font-black mt-5">
            No Feedback Found
          </h3>

          <p className="text-gray-500 mt-2">
            No customer feedback matches your filters.
          </p>

        </div>

      ) : (

        /* ----------------------------------------
            FEEDBACK LIST
        ---------------------------------------- */

        <div className="space-y-5">

          {filteredFeedbacks.map((item) => (

            <div
              key={item._id}
              className="bg-white rounded-2xl border shadow-sm p-6 hover:shadow-md transition"
            >

              <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6">

                {/* CUSTOMER */}

                <div className="flex gap-4">

                  <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center shrink-0">
                    <User
                      size={22}
                      className="text-gray-500"
                    />
                  </div>

                  <div>

                    <h3 className="font-black text-lg">
                      {item.customerId?.name ||
                        "Unknown Customer"}
                    </h3>

                    <div className="flex flex-wrap items-center gap-4 mt-1 text-sm text-gray-500">

                      <span className="flex items-center gap-1">
                        <Phone size={14} />
                        {item.customerId?.phone ||
                          "No phone"}
                      </span>

                      <span className="flex items-center gap-1">
                        <Calendar size={14} />

                        {item.createdAt
                          ? new Date(
                              item.createdAt
                            ).toLocaleString()
                          : "-"}
                      </span>

                    </div>

                  </div>

                </div>

                {/* RATING */}

                <div className="flex flex-col items-start lg:items-end gap-2">

                  {renderStars(item.rating)}

                  <span className="text-sm font-bold text-gray-500">
                    {item.rating}/5
                  </span>

                </div>

              </div>

              {/* COMMENT */}

              <div className="mt-6 bg-gray-50 rounded-xl p-5">

                <p className="text-gray-700 leading-relaxed">
                  "{item.comment}"
                </p>

              </div>

            </div>

          ))}

        </div>

      )}

    </div>
  );
};

export default Feedback;