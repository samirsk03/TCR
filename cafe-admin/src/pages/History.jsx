
// src/pages/Admin/History.jsx

import { useEffect, useMemo, useState } from "react";
import api from "../services/api";
import {
  History,
  Receipt,
  IndianRupee,
  Gift,
  Calendar,
} from "lucide-react";

const HistoryPage = () => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [search, setSearch] = useState("");
  const [paymentFilter, setPaymentFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [sortOrder, setSortOrder] = useState("newest");

  const fetchHistory = async () => {
    try {
      const res = await api.get("/session/history");
      setHistory(res.data.data);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  const filteredHistory = useMemo(() => {
    let data = [...history];

    // Search
    if (search.trim()) {
      data = data.filter((bill) => {
        const name = bill.customerId?.name?.toLowerCase() || "";
        const phone = bill.customerId?.phone || "";

        return (
          name.includes(search.toLowerCase()) ||
          phone.includes(search)
        );
      });
    }

    // Payment
    if (paymentFilter !== "all") {
      data = data.filter(
        (bill) =>
          bill.paymentMethod?.toLowerCase() === paymentFilter
      );
    }

    // Status
    if (statusFilter !== "all") {
      data = data.filter(
        (bill) => bill.status === statusFilter
      );
    }

    // From Date
    if (fromDate) {
      data = data.filter(
        (bill) =>
          new Date(bill.paidAt) >= new Date(fromDate)
      );
    }

    // To Date
    if (toDate) {
      const end = new Date(toDate);
      end.setHours(23, 59, 59);

      data = data.filter(
        (bill) =>
          new Date(bill.paidAt) <= end
      );
    }

    // Sort
    data.sort((a, b) => {
      if (sortOrder === "newest") {
        return new Date(b.paidAt) - new Date(a.paidAt);
      }

      return new Date(a.paidAt) - new Date(b.paidAt);
    });

    return data;
  }, [
    history,
    search,
    paymentFilter,
    statusFilter,
    fromDate,
    toDate,
    sortOrder,
  ]);

  return (
    <div className="p-8">

      {/* Header */}

      <div className="flex items-center gap-3 mb-8">
        <History className="text-sbGreen" size={32} />

        <div>
          <h1 className="text-3xl font-black text-sbDark">
            Billing History
          </h1>

          <p className="text-gray-500">
            All paid customer bills
          </p>
        </div>
      </div>

      {/* Filters */}

      <div className="bg-white rounded-3xl shadow border border-gray-100 p-6 mb-8">

        <div className="flex items-center justify-center gap-4 ">

          <input
            type="text"
            placeholder="Search customer..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border rounded-xl px-4 py-3"
          />

          <select
            value={paymentFilter}
            onChange={(e) =>
              setPaymentFilter(e.target.value)
            }
            className="border rounded-xl px-4 py-3"
          >
            <option value="all">All Payments</option>
            <option value="cash">Cash</option>
            <option value="upi">UPI</option>
            <option value="card">Card</option>
          </select>

          {/* <select
            value={statusFilter}
            onChange={(e) =>
              setStatusFilter(e.target.value)
            }
            className="border rounded-xl px-4 py-3"
          >
            <option value="all">All Status</option>
            <option value="paid">Paid</option>
          </select> */}

          <input
            type="date"
            value={fromDate}
            onChange={(e) =>
              setFromDate(e.target.value)
            }
            className="border rounded-xl px-4 py-3"
          />

          <input
            type="date"
            value={toDate}
            onChange={(e) =>
              setToDate(e.target.value)
            }
            className="border rounded-xl px-4 py-3"
          />

          <select
            value={sortOrder}
            onChange={(e) =>
              setSortOrder(e.target.value)
            }
            className="border rounded-xl px-4 py-3"
          >
            <option value="newest">
              Newest First
            </option>
            <option value="oldest">
              Oldest First
            </option>
          </select>

        </div>

      </div>

      {loading ? (
        <div>Loading...</div>
      ) : filteredHistory.length === 0 ? (
        <div className="bg-white rounded-2xl p-8 shadow text-center">
          No Bills Found
        </div>
      ) : (
        <>
          <div className="mb-6 text-gray-500 font-semibold">
            Showing{" "}
            <span className="text-sbGreen">
              {filteredHistory.length}
            </span>{" "}
            Bills
          </div>

          <div className="space-y-5">

            {filteredHistory.map((bill) => (
              <div
                key={bill._id}
                className="bg-white rounded-3xl shadow border border-gray-100 p-6"
              >
                {/* Top */}

                <div className="flex justify-between items-center">

                  <div>

                    <h2 className="font-bold text-xl">
                      {bill.customerId?.name}
                    </h2>

                    <p className="text-sm text-gray-500">
                      {bill.customerId?.phone}
                    </p>

                  </div>

                  <span className="bg-green-100 text-green-700 px-4 py-2 rounded-xl">

                    <p className="font-bold">
                      {new Date(bill.createdAt).toLocaleDateString("en-IN", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      })}
                    </p>

                    <p className="text-sm text-gray-900">
                      Created:{" "}
                      {new Date(bill.createdAt).toLocaleTimeString("en-IN", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>

                    <p className="text-sm text-gray-900">
                      Paid:{" "}
                      {new Date(bill.paidAt).toLocaleTimeString("en-IN", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>

                  </span>



                </div>

                {/* Items */}

                <div className="mt-5 space-y-2">

                  {bill.items.map((item) => (
                    <div
                      key={item._id}
                      className="flex justify-between text-sm"
                    >
                      <span>
                        {item.itemName}

                        {item.variantName &&
                          ` (${item.variantName})`}

                        × {item.quantity}
                      </span>

                      <span>
                        ₹{item.price}
                      </span>

                    </div>
                  ))}

                </div>

                {/* Bottom */}

                <div className="mt-6 grid grid-cols-2 md:grid-cols-5 gap-4">

                  <div className="bg-gray-50 rounded-xl p-4">
                    <IndianRupee size={18} />

                    <p className="text-xs text-gray-500 mt-2">
                      Total Amount
                    </p>

                    <p className="font-black text-lg">
                      ₹{bill.totalAmount}
                    </p>
                  </div>

                  <div className="bg-gray-50 rounded-xl p-4">
                    <IndianRupee size={18} />

                    <p className="text-xs text-gray-500 mt-2">
                      GST
                    </p>

                    <p className="font-black text-lg">
                      ₹{bill.gst}
                    </p>
                  </div>

                  <div className="bg-gray-50 rounded-xl p-4">
                    <IndianRupee size={18} />

                    <p className="text-xs text-gray-500 mt-2">
                      Manual Discount
                    </p>

                    <p className="text-xs text-gray-500">
                      {bill.discountReason || "No reason"}
                    </p>

                    <p className="font-black text-lg">
                      ₹{bill.manualDiscount}
                    </p>
                  </div>

                  <div className="bg-gray-50 rounded-xl p-4">
                    <Gift size={18} />

                    <p className="text-xs text-gray-500 mt-2">
                      Earned
                    </p>

                    <p className="font-black text-lg text-green-600">
                      +{bill.earnedPoints}
                    </p>
                  </div>

                  <div className="bg-gray-50 rounded-xl p-4">
                    <Receipt size={18} />

                    <p className="text-xs text-gray-500 mt-2">
                      Payment
                    </p>

                    <p className="font-black uppercase">
                      {bill.paymentMethod}
                    </p>
                  </div>

                  {/* <div className="bg-gray-50 rounded-xl p-4">
                    <Calendar size={18} />

                    <p className="text-xs text-gray-500 mt-2">
                      Paid On
                    </p>

                    <p className="font-black">
                      {new Date(
                        bill.paidAt
                      ).toLocaleDateString()}
                    </p>
                  </div> */}

                </div>

              </div>
            ))}

          </div>
        </>
      )}
    </div>
  );
};

export default HistoryPage;

