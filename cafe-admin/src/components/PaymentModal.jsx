import { useState } from "react";
import { useStoreSettings } from "../context/StoreSettingContext";

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

  const { settings } = useStoreSettings();
  

  if (!open) return null;

  // ==========================================
  // STORE SETTINGS
  // ==========================================

  const rewardPercentage = Number(
      settings?.rewardPercentage ?? 0
  );

  const rewardValue = Number(
    settings?.rewardValue ?? 1
  );

  const maxRedeemPercentage = Number(
    settings?.maxRedeemPercentage ?? 0
  );

  const minimumRedeemPoints = Number(
    settings?.minimumRedeemPoints ?? 0
  );

  // ==========================================
  // BILL CALCULATION
  // ==========================================

  const billTotal =
    Number(bill.subtotal || 0) +
    Number(bill.gst || 0);

  // ==========================================
  // WALLET POINTS
  // ==========================================

  const walletPoints = Number(
    bill.rewardPointsAvailable || 0
  );

  // Total rupee value of wallet points
  const walletValue =
    walletPoints * rewardValue;

  // Maximum amount that can be redeemed
  const maxRedeemAmount =
    (billTotal * maxRedeemPercentage) / 100;

  // Customer can redeem only if they have
  // at least the minimum required points
  const canRedeem =
    walletPoints >= minimumRedeemPoints;

  // Actual reward discount
  const rewardDiscount =
    redeem && canRedeem
      ? Math.min(
          walletValue,
          maxRedeemAmount
        )
      : 0;

  // ==========================================
  // FINAL PAYABLE
  // ==========================================

  const payableBeforeStaff = Math.max(
    billTotal - rewardDiscount,
    0
  );

  const finalPayable = Math.max(
    payableBeforeStaff - manualDiscount,
    0
  );

  const totalDiscount =
    rewardDiscount + manualDiscount;

  // ==========================================
  // CUSTOMER WILL EARN
  // ==========================================

  const customerWillEarn = Math.floor(
    (finalPayable * rewardPercentage) / 100
  );

  return (
    <div className="fixed inset-0 bg-black/60 overflow-y-auto z-50 p-6">
      <div className="min-h-full flex items-center justify-center">
        <div className="bg-white rounded-xl w-[550px] max-w-[95%] shadow-xl max-h-[90vh] overflow-y-auto">

          {/* HEADER */}
          <div className="border-b p-5">
            <h2 className="text-2xl font-bold">
              Payment
            </h2>
          </div>

          {/* BODY */}
          <div className="p-6 space-y-4">

            {/* CUSTOMER */}
            <div className="flex justify-between">
              <span>Customer</span>

              <span className="font-bold">
                {bill.customerName}
              </span>
            </div>

            {/* SUBTOTAL */}
            <div className="flex justify-between">
              <span>Subtotal</span>

              <span>
                ₹{Number(bill.subtotal || 0)}
              </span>
            </div>

            {/* GST */}
            <div className="flex justify-between">
              <span>GST</span>

              <span>
                ₹{Number(bill.gst || 0)}
              </span>
            </div>

            <hr />

            {/* BILL TOTAL */}
            <div className="flex justify-between font-semibold">
              <span>Bill Total</span>

              <span>
                ₹{billTotal}
              </span>
            </div>

            {/* WALLET POINTS */}
            <div className="flex justify-between">
              <span>
                Wallet Points
              </span>

              <span className="font-bold text-green-700">
                ⭐ {walletPoints} Points
              </span>
            </div>

            {/* REDEEM WALLET */}
            <div className="flex justify-between items-center">
              <span>
                Redeem Wallet
              </span>

              <input
                type="checkbox"
                checked={redeem}
                disabled={!canRedeem}
                onChange={() =>
                  setRedeem(!redeem)
                }
                className="w-5 h-5"
              />
            </div>

            {/* REWARD DISCOUNT */}
            <div className="flex justify-between">
              <span>
                Reward Discount
              </span>

              <span className="text-red-600 font-semibold">
                - ₹{rewardDiscount}
              </span>
            </div>

            {/* CUSTOMER WILL EARN */}
            <div className="flex justify-between">
              <span>
                Customer will earn
              </span>

              <span className="text-green-700 font-bold">
                {customerWillEarn} Points
              </span>
            </div>

            <hr />

            {/* STAFF DISCOUNT */}
            <h3 className="font-bold">
              Staff Discount
            </h3>

            <input
              type="number"
              min="0"
              value={manualDiscount}
              onChange={(e) =>
                setManualDiscount(
                  Math.max(
                    0,
                    Number(e.target.value)
                  )
                )
              }
              placeholder="Discount Amount"
              className="w-full border rounded-lg p-2"
            />

            {/* DISCOUNT REASON */}
            <textarea
              rows="2"
              disabled={manualDiscount === 0}
              value={discountReason}
              onChange={(e) =>
                setDiscountReason(
                  e.target.value
                )
              }
              placeholder="Reason for discount"
              className="w-full border rounded-lg p-2 disabled:bg-gray-100"
            />

            {/* TOTAL DISCOUNT */}
            <div className="flex justify-between text-sm text-red-600 font-semibold">
              <span>
                Total Discount
              </span>

              <span>
                - ₹{totalDiscount}
              </span>
            </div>

            <hr />

            {/* FINAL PAYABLE */}
            <div className="flex justify-between text-2xl font-bold">
              <span>
                Final Payable
              </span>

              <span className="text-green-700">
                ₹{Number(finalPayable || 0).toFixed(2)}
              </span>
            </div>

            

            <hr />

            {/* PAYMENT METHOD */}
            <h3 className="font-bold">
              Payment Method
            </h3>

            <div className="flex gap-3 flex-wrap">
              {[
                "cash",
                "upi",
                "card",
                "swiggy",
                "zomato",
              ].map((method) => (
                <button
                  key={method}
                  onClick={() =>
                    setPaymentMethod(method)
                  }
                  className={`px-5 py-2 rounded-lg capitalize transition ${
                    paymentMethod === method
                      ? "bg-green-600 text-white"
                      : "bg-gray-200 hover:bg-gray-300"
                  }`}
                >
                  {method}
                </button>
              ))}
            </div>
          </div>

          {/* FOOTER */}
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