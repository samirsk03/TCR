import { useState } from "react";

export default function PaymentModal({
  open,
  onClose,
  bill,
  onPay,
  loading,
}) {
  const [redeem, setRedeem] = useState(true);
  const [paymentMethod, setPaymentMethod] = useState("cash");
  const [manualDiscount, setManualDiscount] = useState(0);
  const [discountReason, setDiscountReason] = useState("");

  if (!open) return null;

  const rewardDiscount = redeem ? bill.rewardDiscount : 0;

  const payableBeforeStaff =
    redeem
      ? bill.payableAmount
      : bill.subtotal + bill.gst;

  const finalPayable = Math.max(
    payableBeforeStaff - manualDiscount,
    0
  );

  const totalDiscount =
    rewardDiscount + manualDiscount;

  return (
  <div className="fixed inset-0 bg-black/60 overflow-y-auto z-50 p-6">

  <div className="min-h-full flex items-center justify-center">

    <div className="bg-white rounded-xl w-[550px] max-w-[95%] shadow-xl max-h-[90vh] overflow-y-auto">

        <div className="border-b p-5">
          <h2 className="text-2xl font-bold">
            ry
          </h2>
        </div>

        <div className="p-6 space-y-4">

          <div className="flex justify-between">
            <span>Customer</span>
            <span className="font-bold">
              {bill.customerName}
            </span>
          </div>

          <div className="flex justify-between">
            <span>Subtotal</span>
            <span>₹{bill.subtotal}</span>
          </div>

          <div className="flex justify-between">
            <span>GST</span>
            <span>₹{bill.gst}</span>
          </div>

          <hr />

          <div className="flex justify-between">
            <span>Wallet Points</span>

            <span className="font-bold text-green-700">
              ⭐ {bill.rewardPointsAvailable}
            </span>
          </div>

          <div className="flex justify-between items-center">

            <span>Redeem Wallet</span>

            <input
              type="checkbox"
              checked={redeem}
              onChange={() => setRedeem(!redeem)}
              className="w-5 h-5"
            />

          </div>

          <div className="flex justify-between">
            <span>Reward Discount</span>

            <span className="text-red-600 font-semibold">
              - ₹{rewardDiscount}
            </span>
          </div>

          <hr />

          <h3 className="font-bold">
            Staff Discount
          </h3>

          <input
            type="number"
            min="0"
            value={manualDiscount}
            onChange={(e) =>
              setManualDiscount(
                Math.max(0, Number(e.target.value))
              )
            }
            placeholder="Discount Amount"
            className="w-full border rounded-lg p-2"
          />

          <textarea
            rows="2"
            disabled={manualDiscount === 0}
            value={discountReason}
            onChange={(e) =>
              setDiscountReason(e.target.value)
            }
            placeholder="Reason for discount"
            className="w-full border rounded-lg p-2 disabled:bg-gray-100"
          />

          <div className="flex justify-between text-sm text-red-600 font-semibold">
            <span>Total Discount</span>
            <span>- ₹{totalDiscount}</span>
          </div>

          <hr />

          <div className="flex justify-between text-2xl font-bold">

            <span>Final Payable</span>

            <span className="text-green-700">
              ₹{finalPayable}
            </span>

          </div>

          <div className="flex justify-between">

            <span>Customer will earn</span>

            <span className="text-green-700 font-bold">

              {redeem
                ? bill.earnedPoints
                : bill.earnedWithoutRedeem}

              {" "}Points

            </span>

          </div>

          <hr />

          <h3 className="font-bold">
            Payment Method
          </h3>

          <div className="flex gap-3">

            {["cash", "upi", "card"].map((method) => (

              <button
                key={method}
                onClick={() => setPaymentMethod(method)}
                className={`px-5 py-2 rounded-lg capitalize transition ${paymentMethod === method
                    ? "bg-green-600 text-white"
                    : "bg-gray-200 hover:bg-gray-300"
                  }`}
              >
                {method}
              </button>

            ))}

          </div>

        </div>

        <div className="border-t p-5 flex justify-end gap-3">

          <button
            onClick={onClose}
            className="px-5 py-2 rounded bg-gray-200 hover:bg-gray-300"
          >
            Cancel
          </button>

          <button
            disabled={loading}
            onClick={() =>
              onPay({
                paymentMethod,
                redeem,
                manualDiscount,
                discountReason,
              })
            }
            className="px-5 py-2 rounded bg-green-600 text-white hover:bg-green-700 disabled:opacity-50"
          >
            {loading
              ? "Processing..."
              : "Complete Payment"}
          </button>

        </div>

      </div>

    </div>
    </div>
  );
}