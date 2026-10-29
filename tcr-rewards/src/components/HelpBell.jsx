
import { useState } from "react";
import { BellRing, LoaderCircle, CheckCircle2 } from "lucide-react";
import api from "../services/api";

export default function HelpBell() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [success, setSuccess] = useState(false);

  const handleHelpRequest = async () => {
    if (loading) return;

    try {
      setLoading(true);
      setMessage("");
      setSuccess(false);

      const res = await api.post("/help-request");

      setSuccess(true);
      setMessage(
        res.data.message || "Help requested! Our staff will assist you shortly."
      );
    } catch (error) {
      setSuccess(false);
      setMessage(
        error.response?.data?.message ||
          "Unable to send your request. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed bottom-24 right-4 z-50 flex flex-col items-end gap-2">
      {message && (
        <div
          role="status"
          className={`max-w-[280px] rounded-xl border px-4 py-3 text-sm shadow-lg ${
            success
              ? "border-green-200 bg-white text-green-800"
              : "border-red-200 bg-white text-red-700"
          }`}
        >
          <div className="flex items-start gap-2">
            {success && (
              <CheckCircle2 size={18} className="mt-0.5 shrink-0" />
            )}
            <span>{message}</span>
          </div>
        </div>
      )}

      <button
        type="button"
        onClick={handleHelpRequest}
        disabled={loading}
        aria-label="Request staff assistance"
        title="Need help? Tap here"
        className="flex h-14 w-14 items-center justify-center rounded-full bg-[#9b6a32] text-white shadow-xl transition hover:bg-[#805326] active:scale-95 disabled:cursor-not-allowed disabled:opacity-70"
      >
        {loading ? (
          <LoaderCircle size={25} className="animate-spin" />
        ) : (
          <BellRing size={25} />
        )}
      </button>
    </div>
  );
}
