// src/pages/Admin/History.jsx

import { useEffect, useMemo, useState } from "react";
import api from "../services/api";
import {
  History,
  Receipt,
  IndianRupee,
  Gift,
  XCircle,
} from "lucide-react";

const HistoryPage = () => {
  const [bills, setBills] = useState([]);
  const [cancelled, setCancelled] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [search, setSearch] = useState("");
  const [paymentFilter, setPaymentFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all"); // all | paid | cancelled
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [sortOrder, setSortOrder] = useState("newest");

  const fetchHistory = async () => {
    setLoading(true);
    try {
      const [billsRes, cancelledRes] = await Promise.all([
        api.get("/session/history"),
        api.get("/order-request/cancelled"),
      ]);

      setBills(billsRes.data.data || []);
      setCancelled(cancelledRes.data.data || []);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  // Normalize both shapes into one common record, tagged by type,
  // with a single `date` field to sort/filter on so the rest of
  // the filter logic doesn't need to know which type it's looking at.
  const combined = useMemo(() => {
    const paidRecords = bills.map((bill) => ({
      type: "paid",
      id: bill._id,
      customer: bill.customerId,
      date: bill.paidAt,
      raw: bill,
    }));

    const cancelledRecords = cancelled.map((order) => ({
      type: "cancelled",
      id: order._id,
      customer: order.customerId,
      date: order.cancelledAt,
      raw: order,
    }));

    return [...paidRecords, ...cancelledRecords];
  }, [bills, cancelled]);

  const filteredHistory = useMemo(() => {
    let data = [...combined];

    // Status
    if (statusFilter !== "all") {
      data = data.filter((record) => record.type === statusFilter);
    }

    // Search
    if (search.trim()) {
      data = data.filter((record) => {
        const name = record.customer?.name?.toLowerCase() || "";
        const phone = record.customer?.phone || "";

        return (
          name.includes(search.toLowerCase()) || phone.includes(search)
        );
      });
    }

    // Payment — only meaningful for paid bills; cancelled orders
    // have no payment method, so they're excluded once a specific
    // payment filter is chosen.
    if (paymentFilter !== "all") {
      data = data.filter(
        (record) =>
          record.type === "paid" &&
          record.raw.paymentMethod?.toLowerCase() === paymentFilter
      );
    }

    // From Date
    if (fromDate) {
      data = data.filter(
        (record) => record.date && new Date(record.date) >= new Date(fromDate)
      );
    }

    // To Date
    if (toDate) {
      const end = new Date(toDate);
      end.setHours(23, 59, 59);

      data = data.filter(
        (record) => record.date && new Date(record.date) <= end
      );
    }

    // Sort
    data.sort((a, b) => {
      const diff = new Date(b.date) - new Date(a.date);
      return sortOrder === "newest" ? diff : -diff;
    });

    return data;
  }, [
    combined,
    search,
    paymentFilter,
    statusFilter,
    fromDate,
    toDate,
    sortOrder,
  ]);

  const paidCount = combined.filter((r) => r.type === "paid").length;
  const cancelledCount = combined.filter((r) => r.type === "cancelled").length;

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
            {paidCount} paid · {cancelledCount} cancelled
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-3xl shadow border border-gray-100 p-6 mb-8">
        <div className="flex items-center justify-center gap-4 flex-wrap">
          <input
            type="text"
            placeholder="Search customer..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border rounded-xl px-4 py-3"
          />

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="border rounded-xl px-4 py-3"
          >
            <option value="all">All Status</option>
            <option value="paid">Paid</option>
            <option value="cancelled">Cancelled</option>
          </select>

          <select
            value={paymentFilter}
            onChange={(e) => setPaymentFilter(e.target.value)}
            className="border rounded-xl px-4 py-3"
          >
            <option value="all">All Payments</option>
            <option value="cash">Cash</option>
            <option value="upi">UPI</option>
            <option value="card">Card</option>
            <option value="swiggy">Swiggy</option>
            <option value="zomato">Zomato</option>
          </select>

          <input
            type="date"
            value={fromDate}
            onChange={(e) => setFromDate(e.target.value)}
            className="border rounded-xl px-4 py-3"
          />

          <input
            type="date"
            value={toDate}
            onChange={(e) => setToDate(e.target.value)}
            className="border rounded-xl px-4 py-3"
          />

          <select
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
            className="border rounded-xl px-4 py-3"
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
          </select>
        </div>
      </div>

      {loading ? (
        <div>Loading...</div>
      ) : filteredHistory.length === 0 ? (
        <div className="bg-white rounded-2xl p-8 shadow text-center">
          No Records Found
        </div>
      ) : (
        <>
          <div className="mb-6 text-gray-500 font-semibold">
            Showing{" "}
            <span className="text-sbGreen">{filteredHistory.length}</span>{" "}
            Records
          </div>

          <div className="space-y-5">
            {filteredHistory.map((record) =>
              record.type === "paid" ? (
                <PaidBillCard key={record.id} bill={record.raw} />
              ) : (
                <CancelledOrderCard key={record.id} order={record.raw} />
              )
            )}
          </div>
        </>
      )}
    </div>
  );
};

const PaidBillCard = ({ bill }) => (
  <div className="bg-white rounded-3xl shadow border border-gray-100 p-6">
    <div className="flex justify-between items-center">
      <div>
        <h2 className="font-bold text-xl">{bill.customerId?.name}</h2>
        <p className="text-sm text-gray-500">{bill.customerId?.phone}</p>
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

    <div className="mt-5 space-y-2">
      {bill.items.map((item) => (
        <div key={item._id} className="flex justify-between text-sm">
          <span>
            {item.itemName}
            {item.variantName && ` (${item.variantName})`} × {item.quantity}
          </span>
          <span>₹{item.price}</span>
        </div>
      ))}
    </div>

    <div className="mt-6 grid grid-cols-2 md:grid-cols-5 gap-4">
      <div className="bg-gray-50 rounded-xl p-4">
        <IndianRupee size={18} />
        <p className="text-xs text-gray-500 mt-2">Total Amount</p>
        <p className="font-black text-lg">₹{bill.totalAmount}</p>
      </div>

      <div className="bg-gray-50 rounded-xl p-4">
        <IndianRupee size={18} />
        <p className="text-xs text-gray-500 mt-2">GST</p>
        <p className="font-black text-lg">₹{bill.gst}</p>
      </div>

      <div className="bg-gray-50 rounded-xl p-4">
        <IndianRupee size={18} />
        <p className="text-xs text-gray-500 mt-2">Manual Discount</p>
        <p className="text-xs text-gray-500">
          {bill.discountReason || "No reason"}
        </p>
        <p className="font-black text-lg">₹{bill.manualDiscount}</p>
      </div>

      <div className="bg-gray-50 rounded-xl p-4">
        <Gift size={18} />
        <p className="text-xs text-gray-500 mt-2">Earned</p>
        <p className="font-black text-lg text-green-600">
          +{bill.earnedPoints}
        </p>
      </div>

      <div className="bg-gray-50 rounded-xl p-4">
        <Receipt size={18} />
        <p className="text-xs text-gray-500 mt-2">Payment</p>
        <p className="font-black uppercase">{bill.paymentMethod}</p>
      </div>
    </div>
  </div>
);

const CancelledOrderCard = ({ order }) => (
  <div className="bg-white rounded-3xl shadow border border-gray-100 border-l-4 border-l-red-500 p-6">
    <div className="flex justify-between items-center">
      <div>
        <h2 className="font-bold text-xl">{order.customerId?.name}</h2>
        <p className="text-sm text-gray-500">{order.customerId?.phone}</p>
      </div>

      <span className="bg-red-100 text-red-700 px-4 py-2 rounded-xl flex items-center gap-2">
        <XCircle size={16} />
        <div>
          <p className="font-bold text-sm">Cancelled</p>
          <p className="text-xs text-gray-700">
            {new Date(order.cancelledAt).toLocaleString("en-IN", {
              day: "2-digit",
              month: "short",
              hour: "2-digit",
              minute: "2-digit",
            })}
          </p>
        </div>
      </span>
    </div>

    <div className="mt-5 space-y-2">
      {order.items.map((item, i) => (
        <div key={i} className="flex justify-between text-sm">
          <span>
            {item.itemName}
            {item.variantName && ` (${item.variantName})`} × {item.quantity}
          </span>
          <span>₹{item.price}</span>
        </div>
      ))}
    </div>

    <div className="mt-4 flex justify-between items-center text-sm">
      <p className="text-gray-500">
        Cancelled by: {order.cancelledBy?.name || "-"}
      </p>
      <p className="text-red-600 font-medium">{order.cancelReason}</p>
    </div>
  </div>
);

export default HistoryPage;