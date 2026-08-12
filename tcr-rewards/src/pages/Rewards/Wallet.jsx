import { useAuth } from "../../context/AuthContext";
import { useEffect, useMemo, useState } from "react";
import api from "../../services/api";

import {
  Star,
  History,
  Clock,
  UserCheck,
  Wallet as WalletIcon,
  TrendingUp,
  TrendingDown,
  Search,
  Filter,
} from "lucide-react";

const Wallet = () => {
  const { user } = useAuth();

  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [paymentFilter, setPaymentFilter] = useState("all");
  const [sortBy, setSortBy] = useState("latest");

  const fetchTransactions = async () => {
    try {
      const res = await api.get("/session/my-transactions");
      setTransactions(res.data.data || []);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  const stats = useMemo(() => {
    return {
      availablePoints: user?.rewardPoints || 0,

      earned: transactions.reduce(
        (sum, t) => sum + (t.earnedPoints || 0),
        0
      ),

      redeemed: transactions.reduce(
        (sum, t) => sum + (t.redeemedPoints || 0),
        0
      ),

      spend: transactions.reduce(
        (sum, t) => sum + (t.totalAmount || 0),
        0
      ),

      savings: transactions.reduce(
        (sum, t) =>
          sum +
          (t.manualDiscount || 0) +
          (t.rewardDiscount || 0),
        0
      ),

      visits: user?.visitCount || 0,

      lastVisit:
        transactions.length > 0
          ? transactions[0].paidAt
          : null,
    };
  }, [transactions, user]);

  const filteredTransactions = useMemo(() => {
    let data = [...transactions];

    if (paymentFilter !== "all") {
      data = data.filter(
        (t) => t.paymentMethod === paymentFilter
      );
    }

    if (search.trim()) {
      data = data.filter((bill) =>
        bill.items.some((i) =>
          i.itemName
            .toLowerCase()
            .includes(search.toLowerCase())
        )
      );
    }

    data.sort((a, b) =>
      sortBy === "latest"
        ? new Date(b.paidAt) - new Date(a.paidAt)
        : new Date(a.paidAt) - new Date(b.paidAt)
    );

    return data;
  }, [
    transactions,
    paymentFilter,
    search,
    sortBy,
  ]);

  return (
    <div className="animate-fade-in min-h-screen pb-24">

      {/* HERO */}

      <section className="bg-sbDark text-white py-14">

        <div className="max-w-6xl mx-auto px-6">

          <div className="text-center">

            <h1 className="text-5xl font-black">
              Rewards Wallet
            </h1>

            <p className="mt-3 text-white/70">
              Every visit brings you closer to free coffee.
            </p>

            <div className="mt-8 inline-flex items-center gap-5 bg-white/10 backdrop-blur rounded-full px-10 py-5 border border-white/20">

              <span className="text-6xl font-black">
                {stats.availablePoints}
              </span>

              <Star
                size={48}
                className="fill-yellow-400 text-yellow-400"
              />

            </div>

            <p className="mt-4 text-white/60 uppercase tracking-[0.3em] text-xs">
              Available Reward Points
            </p>

          </div>

        </div>

      </section>

      {/* STATS */}

      <section className="max-w-7xl mx-auto px-6 -mt-10 relative z-20">

        <div className="grid lg:grid-cols-6 md:grid-cols-3 grid-cols-2 gap-5">

          <div className="bg-white rounded-3xl shadow p-6">

            <TrendingUp className="text-green-600" />

            <p className="text-xs uppercase mt-4 text-gray-400">
              Earned
            </p>

            <h2 className="text-3xl font-black mt-2">
              {stats.earned}
            </h2>

          </div>

          <div className="bg-white rounded-3xl shadow p-6">

            <TrendingDown className="text-orange-500" />

            <p className="text-xs uppercase mt-4 text-gray-400">
              Redeemed
            </p>

            <h2 className="text-3xl font-black mt-2">
              {stats.redeemed}
            </h2>

          </div>

          <div className="bg-white rounded-3xl shadow p-6">

            <WalletIcon className="text-sbGold" />

            <p className="text-xs uppercase mt-4 text-gray-400">
              Lifetime Spend
            </p>

            <h2 className="text-3xl font-black mt-2">
              ₹{stats.spend}
            </h2>

          </div>

          <div className="bg-white rounded-3xl shadow p-6">

            <Star className="fill-sbGreen text-sbGreen" />

            <p className="text-xs uppercase mt-4 text-gray-400">
              Total Savings
            </p>

            <h2 className="text-3xl font-black mt-2">
              ₹{stats.savings}
            </h2>

          </div>

          <div className="bg-white rounded-3xl shadow p-6">

            <UserCheck className="text-purple-600" />

            <p className="text-xs uppercase mt-4 text-gray-400">
              Visits
            </p>

            <h2 className="text-3xl font-black mt-2">
              {stats.visits}
            </h2>

          </div>

          <div className="bg-white rounded-3xl shadow p-6">

            <Clock className="text-blue-600" />

            <p className="text-xs uppercase mt-4 text-gray-400">
              Last Visit
            </p>

            <h2 className="text-lg font-black mt-3">

              {stats.lastVisit
                ? new Date(
                    stats.lastVisit
                  ).toLocaleDateString()
                : "-"}

            </h2>

          </div>

        </div>

      </section>

      {/* FILTER BAR */}

      <section className="max-w-7xl mx-auto px-6 mt-10">

        <div className="bg-white rounded-3xl shadow p-5 flex flex-wrap gap-4 items-center">

          <div className="flex items-center gap-2 bg-gray-100 rounded-xl px-4 py-3 flex-1">

            <Search size={18} />

            <input
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
              placeholder="Search items..."
              className="bg-transparent outline-none w-full"
            />

          </div>

          <select
            value={paymentFilter}
            onChange={(e) =>
              setPaymentFilter(e.target.value)
            }
            className="px-4 py-3 rounded-xl border"
          >
            <option value="all">All Payments</option>
            <option value="cash">Cash</option>
            <option value="upi">UPI</option>
            <option value="card">Card</option>
          </select>

          <select
            value={sortBy}
            onChange={(e) =>
              setSortBy(e.target.value)
            }
            className="px-4 py-3 rounded-xl border"
          >
            <option value="latest">
              Latest First
            </option>
            <option value="oldest">
              Oldest First
            </option>
          </select>

        </div>

      </section>

      {/* Transaction History */}

<section className="py-12 px-6">

  <div className="max-w-7xl mx-auto">

    <div className="flex items-center gap-3 mb-8">

      <History className="text-sbGreen" size={28} />

      <div>

        <h2 className="text-3xl font-black">
          Transaction History
        </h2>

        <p className="text-gray-500">
          Every bill you've paid at The Chocolate Room
        </p>

      </div>

    </div>

    {loading ? (

      <div className="grid gap-6">

        {[1,2,3].map((i)=>(
          <div
            key={i}
            className="h-44 rounded-3xl bg-gray-200 animate-pulse"
          />
        ))}

      </div>

    ) : filteredTransactions.length===0 ? (

      <div className="bg-white rounded-3xl p-20 text-center shadow">

        <History
          size={60}
          className="mx-auto text-gray-300"
        />

        <h3 className="mt-5 text-2xl font-black">
          No Transactions Found
        </h3>

        <p className="text-gray-500 mt-2">
          Looks like you haven't placed an order yet.
        </p>

      </div>

    ) : (

      <div className="space-y-6">

        {filteredTransactions.map((bill)=>(

          <details
            key={bill._id}
            className="group bg-white rounded-3xl shadow hover:shadow-xl transition-all duration-300 overflow-hidden"
          >

            <summary className="cursor-pointer list-none p-8 flex flex-col lg:flex-row justify-between gap-6">

              <div>

                <div className="flex items-center gap-3">

                  <span className="bg-sbLight px-3 py-1 rounded-lg text-xs font-black tracking-widest">

                    BILL #{bill._id.slice(-6).toUpperCase()}

                  </span>

                  <span className="bg-green-100 text-green-700 px-3 py-1 rounded-lg text-xs font-black uppercase">

                    {bill.status}

                  </span>

                </div>

                <h3 className="mt-4 text-2xl font-black">

                  {bill.items
                    .map(i=>i.itemName)
                    .join(", ")}

                </h3>

                <p className="text-gray-500 mt-2">

                  {new Date(
                    bill.paidAt
                  ).toLocaleString()}

                </p>

              </div>

              <div className="text-right">

                <p className="text-gray-400 text-sm">
                  Total Paid
                </p>

                <h2 className="text-4xl font-black">

                  ₹{bill.totalAmount}

                </h2>

                <p className="mt-3 text-green-600 font-bold">

                  +{bill.earnedPoints} Reward Points

                </p>

              </div>

            </summary>

            {/* Receipt */}

            <div className="border-t bg-gray-50 px-8 py-8">

              <h4 className="font-black text-xl mb-6">

                Receipt Details

              </h4>

              <div className="space-y-3">

                {bill.items.map(item=>(

                  <div
                    key={item._id}
                    className="flex justify-between"
                  >

                    <div>

                      <p className="font-bold">

                        {item.itemName}

                        {item.variantName &&
                          ` (${item.variantName})`}

                      </p>

                      <p className="text-sm text-gray-500">

                        Qty : {item.quantity}

                      </p>

                    </div>

                    <p className="font-bold">

                      ₹{item.price}

                    </p>

                  </div>

                ))}

              </div>

              <div className="border-t mt-8 pt-6 space-y-3">

                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>₹{bill.subtotal}</span>
                </div>

                <div className="flex justify-between">
                  <span>GST ({bill.gstPercentage}%)</span>
                  <span>₹{bill.gst}</span>
                </div>

                <div className="flex justify-between">

                  <span>Manual Discount</span>

                  <span className="text-red-500">

                    -₹{bill.manualDiscount}

                  </span>

                </div>

                {bill.rewardDiscount>0 &&(

                  <div className="flex justify-between">

                    <span>Reward Discount</span>

                    <span className="text-red-500">

                      -₹{bill.rewardDiscount}

                    </span>

                  </div>

                )}

                {bill.redeemedPoints>0 &&(

                  <div className="flex justify-between">

                    <span>Redeemed Points</span>

                    <span className="text-orange-500">

                      {bill.redeemedPoints}

                    </span>

                  </div>

                )}

                <div className="flex justify-between">

                  <span>Reward Earned</span>

                  <span className="text-green-600">

                    +{bill.earnedPoints}

                  </span>

                </div>

                <div className="flex justify-between">

                  <span>Payment Method</span>

                  <span className="uppercase">

                    {bill.paymentMethod}

                  </span>

                </div>

                {bill.discountReason &&(

                  <div className="rounded-xl bg-yellow-50 p-4 mt-4">

                    <p className="font-bold text-sm">

                      Discount Reason

                    </p>

                    <p className="text-gray-600 mt-1">

                      {bill.discountReason}

                    </p>

                  </div>

                )}

                <div className="border-t pt-5 mt-5 flex justify-between">

                  <span className="text-xl font-black">

                    Total Paid

                  </span>

                  <span className="text-3xl font-black text-sbGreen">

                    ₹{bill.totalAmount}

                  </span>

                </div>

              </div>

            </div>

          </details>

        ))}

      </div>

    )}

  </div>

</section>

</div>
);
};

export default Wallet;