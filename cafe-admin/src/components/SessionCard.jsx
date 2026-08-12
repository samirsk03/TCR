import { useState } from "react";
import api from "../services/api";
import PaymentModal from "./PaymentModal";
import {
  User,
  Clock,
  ShoppingBag,
  IndianRupee,
  Gift,
  Phone,
  X,
} from "lucide-react";
import { useStoreSettings } from "../context/StoreSettingContext";

export default function SessionCard({
  session,
  refresh,
}) {
  const [loading, setLoading] = useState(false);
  const { settings } = useStoreSettings();
  const [showPaymentModal, setShowPaymentModal] =
    useState(false);

  const [billData, setBillData] = useState(null);

  const [open, setOpen] = useState(false);

  const totalItems = session.items.reduce(
    (sum, item) => sum + item.quantity,
    0
  );

  const handleRequestBill = async () => {
    try {
      setLoading(true);

      await api.patch(
        `/session/${session._id}/request-bill`
      );

      alert("Bill Requested Successfully");

      setOpen(false);

      refresh();
    } catch (err) {
      console.error(err);

      alert(
        err.response?.data?.message ||
        "Unable to request bill."
      );
    } finally {
      setLoading(false);
    }
  };

  const handlePayment = async ({
    paymentMethod,
    redeem,
    manualDiscount,
    discountReason,
  }) => {
    try {
      setLoading(true);

      await api.patch(`/session/${session._id}/pay`, {
        paymentMethod,
        redeem,
        manualDiscount,
        discountReason,
      });

      alert("Payment Successful");

      setShowPaymentModal(false);

      setOpen(false);

      refresh();
    } catch (err) {
      console.error(err);

      alert(
        err.response?.data?.message ||
        "Payment Failed"
      );
    } finally {
      setLoading(false);
    }
  };

  const openPayment = () => {
    setBillData({
      customerName: session.customerId?.name,
      subtotal: session.subtotal,
      gst: session.gst,
      rewardPointsAvailable:
        session.customerId?.rewardPoints || 0,
      rewardDiscount: session.rewardDiscount || 0,
      payableAmount: session.totalAmount,
      earnedPoints: session.earnedPoints || 0,
      earnedWithoutRedeem:
        session.earnedPoints || 0,
    });

    setShowPaymentModal(true);
  };

  return (
    <>
      {/* Compact Card */}

      <div
        onClick={() => setOpen(true)}
        className="bg-white rounded-3xl border border-gray-200 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all cursor-pointer p-5"
      >
        {/* Status */}

        <div className="flex justify-between items-center mb-4">

          <span
            className={`text-xs font-black px-3 py-1 rounded-full uppercase tracking-widest ${session.status === "active"
                ? "bg-green-100 text-green-700"
                : "bg-orange-100 text-orange-700"
              }`}
          >
            {session.status === "active"
              ? "ACTIVE"
              : "BILL READY"}
          </span>

          <Clock size={18} className="text-gray-400" />

        </div>

        {/* Customer */}

        <div className="mb-5">

          <h2 className="text-xl font-black text-sbDark truncate">
            {session.customerId?.name}
          </h2>

          <p className="text-sm text-gray-500 mt-1">
            {Math.floor(
              (Date.now() -
                new Date(session.createdAt)) /
              60000
            )}{" "}
            mins ago
          </p>

        </div>

        {/* Stats */}

        <div className="grid grid-cols-3 gap-4">

          <div>

            <ShoppingBag
              size={18}
              className="text-gray-400 mb-1"
            />

            <p className="text-lg font-black">
              {totalItems}
            </p>

            <p className="text-[10px] uppercase text-gray-400 font-bold">
              Items
            </p>

          </div>

          <div>

            <IndianRupee
              size={18}
              className="text-gray-400 mb-1"
            />

            <p className="text-lg font-black">
              ₹{session.totalAmount}
            </p>

            <p className="text-[10px] uppercase text-gray-400 font-bold">
              Total
            </p>

          </div>

          <div>

            <Gift
              size={18}
              className="text-green-500 mb-1"
            />

            <p className="text-lg font-black text-green-600">
              {
            settings
              ? Math.floor(
                (session.totalAmount *
                  settings.rewardPercentage) /
                100
              )
              : 0
          }
            </p>

            <p className="text-[10px] uppercase text-gray-400 font-bold">
              Reward
            </p>

          </div>

        </div>

      </div>

      {/* Details Modal */}

      {open && (
        <div
          onClick={() => setOpen(false)}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex justify-center items-center p-5"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-8 relative"
          >
            <button
              onClick={() => setOpen(false)}
              className="absolute right-6 top-6"
            >
              <X size={24} />
            </button>
            {/* Customer */}

            <div className="mb-8">

              <h2 className="text-3xl font-black">
                {session.customerId?.name}
              </h2>

              <div className="flex items-center gap-2 mt-2 text-gray-500">
                <Phone size={16} />
                {session.customerId?.phone}
              </div>

              <div className="flex items-center gap-2 mt-2 text-gray-500">
                <Clock size={16} />
                Started :
                {" "}
                {new Date(
                  session.createdAt
                ).toLocaleString("en-IN")}
              </div>

            </div>

            {/* Items */}

            <div className="mb-8">

              <h3 className="font-bold text-lg mb-4">
                Ordered Items
              </h3>

              <div className="space-y-3">

                {session.items.map((item) => (

                  <div
                    key={item._id}
                    className="flex justify-between border-b pb-3"
                  >

                    <div>

                      <p className="font-semibold">
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

            </div>

            {/* Summary */}

            <div className="grid grid-cols-2 gap-4">

              <div className="bg-gray-50 rounded-xl p-4">

                <p className="text-gray-500 text-sm">
                  Subtotal
                </p>

                <p className="text-xl font-black">
                  ₹{session.subtotal}
                </p>

              </div>

              <div className="bg-gray-50 rounded-xl p-4">

                <p className="text-gray-500 text-sm">
                  GST
                </p>

                <p className="text-xl font-black">
                  ₹{session.gst}
                </p>

              </div>

              <div className="bg-gray-50 rounded-xl p-4">

                <p className="text-gray-500 text-sm">
                  Rewards Earned
                </p>

                <p className="text-xl font-black text-green-600">
                  +{settings ? Math.floor((session.totalAmount * settings.rewardPercentage) / 100) : 0}
                </p>

              </div>

              <div className="bg-gray-50 rounded-xl p-4">

                <p className="text-gray-500 text-sm">
                  Wallet Balance
                </p>

                <p className="text-xl font-black">
                  {session.customerId?.rewardPoints}
                </p>

              </div>

              <div className="bg-gray-50 rounded-xl p-4">

                <p className="text-gray-500 text-sm">
                  Total Items
                </p>

                <p className="text-xl font-black">
                  {totalItems}
                </p>

              </div>

              <div className="bg-green-50 rounded-xl p-4 border border-green-200">

                <p className="text-gray-500 text-sm">
                  Payable Amount
                </p>

                <p className="text-3xl font-black text-green-700">
                  ₹{session.totalAmount}
                </p>

              </div>

            </div>

            {/* Buttons */}

            <div className="mt-8">

              {session.status === "active" ? (

                <button
                  onClick={handleRequestBill}
                  disabled={loading}
                  className="w-full bg-orange-600 hover:bg-orange-700 text-white rounded-xl py-4 font-bold"
                >
                  {loading
                    ? "Generating..."
                    : "Generate Bill"}
                </button>

              ) : (

                <button
                  onClick={openPayment}
                  disabled={loading}
                  className="w-full bg-green-700 hover:bg-green-800 text-white rounded-xl py-4 font-bold"
                >
                  Take Payment
                </button>

              )}

            </div>

          </div>

        </div>

      )}

      <PaymentModal
        open={showPaymentModal}
        bill={billData || {}}
        loading={loading}
        onClose={() => setShowPaymentModal(false)}
        onPay={handlePayment}
      />

    </>
  );
}