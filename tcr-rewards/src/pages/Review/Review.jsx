// src/pages/Review/Review.jsx

import { useState } from "react";
import {
  Star,
  ExternalLink,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";

const Review = () => {
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [feedback, setFeedback] = useState("");

  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  // ----------------------------------------
  // SUBMIT INTERNAL FEEDBACK
  // ----------------------------------------

  const handleInternalSubmit = async (e) => {
    e.preventDefault();

    setError("");

    if (rating === 0) {
      setError("Please select a rating.");
      return;
    }

    if (!feedback.trim()) {
      setError("Please tell us about your experience.");
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await api.post("/feedback", {
        rating,
        comment: feedback.trim(),
      });

      console.log("Feedback submitted:", res.data);

      setSubmitted(true);
    } catch (err) {
      console.error("Feedback submission error:", err);

      setError(
        err.response?.data?.message ||
          "Unable to submit feedback. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  // ----------------------------------------
  // GOOGLE REVIEW
  // ----------------------------------------

  const handleGoogleRedirect = () => {
    window.open(
      "https://www.google.com/search?q=The+Chocolate+Room+Salunke+Vihar+Reviews",
      "_blank"
    );

    setSubmitted(true);
  };

  // ----------------------------------------
  // SUCCESS SCREEN
  // ----------------------------------------

  if (submitted) {
    return (
      <div className="animate-fade-in flex flex-col items-center justify-center text-center min-h-[70vh] px-4">

        <div className="w-24 h-24 bg-sbGreen rounded-3xl flex items-center justify-center text-white mb-8 shadow-xl transform rotate-3">
          <CheckCircle2 size={50} />
        </div>

        <h2 className="text-4xl font-black mb-4 text-sbDark tracking-tight">
          Thank You!
        </h2>

        <p className="text-sbDark/60 text-lg mb-10 max-w-md font-medium leading-relaxed">
          Your feedback is invaluable to us. Thank you for helping us improve
          your experience at The Chocolate Room.
        </p>

        <button
          onClick={() => navigate("/")}
          className="sb-btn-primary py-4 px-12 text-lg"
        >
          Back to Home
        </button>

      </div>
    );
  }

  return (
    <div className="animate-fade-in flex flex-col min-h-screen pb-24">

      {/* ----------------------------------------
          REVIEW HEADER
      ---------------------------------------- */}

      <section className="bg-sbDark text-sbCream py-16 md:py-24 px-4 text-center">

        <div className="max-w-2xl mx-auto">

          <h1 className="text-4xl md:text-6xl font-black mb-6 tracking-tighter">
            Rate your experience
          </h1>

          <div className="inline-block bg-sbGold/20 px-6 py-2 rounded-full mb-12 border border-sbGold/30">

            <p className="text-lg text-sbGold font-bold uppercase tracking-widest">
              We'd love to hear from you
            </p>

          </div>

          {/* STAR RATING */}

          <div className="flex justify-center gap-2 md:gap-4 mb-10 bg-white/5 p-6 md:p-8 rounded-[3rem] inline-flex backdrop-blur-sm border border-white/10">

            {[1, 2, 3, 4, 5].map((star) => (

              <button
                key={star}
                type="button"
                className={`transition-all duration-300 transform outline-none ${
                  star <= (hover || rating)
                    ? "text-sbGold scale-125 -translate-y-2"
                    : "text-white/20 hover:text-white/40"
                }`}
                onClick={() => setRating(star)}
                onMouseEnter={() => setHover(star)}
                onMouseLeave={() => setHover(0)}
              >

                <Star
                  size={56}
                  fill={
                    star <= (hover || rating)
                      ? "currentColor"
                      : "none"
                  }
                  strokeWidth={1.5}
                />

              </button>

            ))}

          </div>

          <p className="font-bold text-white/40 text-sm uppercase tracking-widest">

            {rating > 0
              ? `You selected ${rating} ${
                  rating === 1 ? "Star" : "Stars"
                }`
              : "Tap a star to rate"}

          </p>

        </div>

      </section>

      {/* ----------------------------------------
          FEEDBACK PANEL
      ---------------------------------------- */}

      {rating > 0 && (

        <section className="bg-transparent py-16 px-4 animate-slide-up -mt-8 relative z-10">

          <div className="max-w-xl mx-auto bg-white p-8 md:p-12 rounded-[3rem] shadow-sb border border-gray-100">

            {/* ERROR */}

            {error && (

              <div className="bg-red-50 text-red-600 p-4 rounded-xl text-sm font-bold flex items-center gap-3 mb-8">

                <AlertCircle size={20} />

                <span>{error}</span>

              </div>

            )}

            {/* ----------------------------------------
                4-5 STARS
            ---------------------------------------- */}

            {rating >= 4 ? (

              <div className="text-center flex flex-col items-center">

                <div className="w-20 h-20 bg-green-50 text-green-600 rounded-full flex items-center justify-center mb-6">

                  <Star
                    size={40}
                    fill="currentColor"
                  />

                </div>

                <h3 className="text-3xl font-black text-sbDark mb-4 tracking-tight">
                  We're thrilled!
                </h3>

                <p className="text-gray-500 mb-10 leading-relaxed text-lg">

                  We're happy that you had a great experience!

                  <br />

                  <span className="text-sm">
                    We'd love if you shared it with others on Google.
                  </span>

                </p>

                <button
                  onClick={handleGoogleRedirect}
                  className="sb-btn-primary w-full py-5 rounded-2xl flex items-center justify-center gap-3 text-lg"
                >

                  <ExternalLink size={24} />

                  <span>
                    Share on Google Reviews
                  </span>

                </button>

              </div>

            ) : (

              /* ----------------------------------------
                  1-3 STARS
              ---------------------------------------- */

              <form
                onSubmit={handleInternalSubmit}
                className="space-y-8"
              >

                <div className="text-center mb-8">

                  <h3 className="text-2xl font-black text-sbDark tracking-tight mb-2">
                    Help us improve
                  </h3>

                  <p className="text-gray-500 text-sm">
                    We're sorry we didn't meet your expectations.
                    Please tell us what went wrong.
                  </p>

                </div>

                <div className="space-y-4">

                  <textarea
                    className="sb-input min-h-[180px] bg-gray-50/50 resize-none"
                    placeholder="Tell us about your experience..."
                    value={feedback}
                    onChange={(e) =>
                      setFeedback(e.target.value)
                    }
                    required
                  />

                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="sb-btn-black w-full py-5 rounded-2xl text-lg disabled:opacity-50 flex items-center justify-center"
                >

                  {isSubmitting ? (

                    <span className="animate-spin h-6 w-6 border-4 border-white border-t-transparent rounded-full block" />

                  ) : (

                    "Submit Feedback"

                  )}

                </button>

              </form>

            )}

          </div>

        </section>

      )}

    </div>
  );
};

export default Review;