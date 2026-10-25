
import { useEffect, useState } from "react";
import {
  ShoppingCart,
  Clock,
  CheckCircle2,
  RefreshCw,
  ShoppingBag,
  AlertCircle,
  Plus,
  Minus,
  Trash2,
} from "lucide-react";

import { useCart } from "../../context/CartContext";
import { useStoreSettings } from "../../context/StoreSettingContext";
import api from "../../services/api";

export default function Cart() {
  const {
    cart,
    subtotal,
    increaseQuantity,
    decreaseQuantity,
    removeFromCart,
    placeOrder,
  } = useCart();

  const { settings } = useStoreSettings();

  const [loading, setLoading] = useState(false);
  const [currentOrder, setCurrentOrder] = useState(null);
  const [checkingOrder, setCheckingOrder] = useState(true);
  const [error, setError] = useState("");
  const [tableNumber, setTableNumber] = useState("");

  const fetchCurrentOrder = async () => {
    try {
      const res = await api.get("/session/my-current-order");
      const order = res.data.data || null;

      setCurrentOrder(order);

      // Reuse the table number for any additional order
      if (order?.tableNumber) {
        setTableNumber(String(order.tableNumber));
      }
    } catch (err) {
      console.log("Current order error:", err);
    } finally {
      setCheckingOrder(false);
    }
  };

  useEffect(() => {
    fetchCurrentOrder();

    const interval = setInterval(fetchCurrentOrder, 10000);

    return () => clearInterval(interval);
  }, []);

  const handleOrder = async () => {
    try {
      setLoading(true);
      setError("");

      const selectedTable = currentOrder
        ? String(currentOrder.tableNumber || "").trim()
        : tableNumber.trim();

      if (!selectedTable) {
        setError("Please enter your table number.");
        return;
      }

      if (cart.length === 0) {
        setError("Please add items to your cart first.");
        return;
      }

      await placeOrder(selectedTable);
      await fetchCurrentOrder();

      alert("Order Placed Successfully 🎉");
    } catch (err) {
      setError(
        err.response?.data?.message ||
          err.message ||
          "Unable to place order."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleBringBill = async () => {
    try {
      setLoading(true);
      setError("");

      await api.patch("/session/my-current-order/request-bill");
      await fetchCurrentOrder();

      alert("Bill requested! Our staff will assist you shortly.");
    } catch (err) {
      setError(
        err.response?.data?.message || "Unable to request bill."
      );
    } finally {
      setLoading(false);
    }
  };

  const rewardPoints = settings
    ? Math.floor((subtotal * settings.rewardPercentage) / 100)
    : 0;

  const formatPrice = (amount) => Number(amount || 0).toFixed(2);

  return (
    <div className="min-h-screen bg-[#fffaf5] px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        {/* Page Header */}
        <div className="mb-6 flex items-center gap-3">
          <div className="rounded-2xl bg-[#f5e7d5] p-3 text-[#9b6a32]">
            <ShoppingCart size={25} />
          </div>

          <div>
            <h1 className="text-2xl font-bold text-[#35251d]">
              My Cart
            </h1>
            <p className="text-sm text-[#8b7769]">
              Review your items before ordering
            </p>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-5 flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">
            <AlertCircle size={18} className="mt-0.5 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Current Order */}
        {checkingOrder ? (
          <div className="mb-6 rounded-2xl border border-[#eee0d2] bg-white p-5 text-sm text-[#8b7769]">
            Checking your current order...
          </div>
        ) : currentOrder ? (
          <div className="mb-6 rounded-2xl border border-[#e7d3bd] bg-white p-5 shadow-sm">
            <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
              <div className="flex items-start gap-3">
                <div className="rounded-xl bg-[#f5e7d5] p-3 text-[#9b6a32]">
                  <ShoppingBag size={23} />
                </div>

                <div>
                  <h2 className="text-lg font-bold text-[#35251d]">
                    Your Current Order
                  </h2>

                  <p className="mt-1 text-sm text-[#8b7769]">
                    Order ID:{" "}
                    <span className="font-medium text-[#35251d]">
                      {currentOrder._id?.slice(-8).toUpperCase() || "N/A"}
                    </span>
                  </p>

                  {currentOrder.tableNumber && (
                    <p className="mt-1 text-sm font-semibold text-[#9b6a32]">
                      Table: {currentOrder.tableNumber}
                    </p>
                  )}

                  <div className="mt-2 flex items-center gap-2">
                    {currentOrder.status === "active" ? (
                      <>
                        <span className="h-2 w-2 rounded-full bg-green-500" />
                        <span className="text-sm font-medium text-green-700">
                          Order Active
                        </span>
                      </>
                    ) : (
                      <>
                        <Clock size={15} className="text-amber-600" />
                        <span className="text-sm font-medium text-amber-700">
                          Bill Requested
                        </span>
                      </>
                    )}
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={fetchCurrentOrder}
                disabled={loading}
                className="flex items-center justify-center gap-2 rounded-xl border border-[#e7d3bd] px-4 py-2 text-sm font-medium text-[#76502d] transition hover:bg-[#fff7ed] disabled:opacity-50"
              >
                <RefreshCw size={16} />
                Refresh
              </button>
            </div>

            {/* Current Order Items */}
            {currentOrder.items?.length > 0 && (
              <div className="mt-5 border-t border-[#f0e5da] pt-4">
                <h3 className="mb-3 text-sm font-semibold text-[#35251d]">
                  Items in your order
                </h3>

                <div className="space-y-3">
                  {currentOrder.items.map((item, index) => (
                    <div
                      key={item._id || `${item.menuId}-${index}`}
                      className="flex items-center justify-between gap-3 text-sm"
                    >
                      <div>
                        <p className="font-medium text-[#35251d]">
                          {item.itemName}
                        </p>

                        {item.variantName && (
                          <p className="text-xs text-[#8b7769]">
                            {item.variantName}
                          </p>
                        )}

                        <p className="text-xs text-[#8b7769]">
                          Qty: {item.quantity}
                        </p>
                      </div>

                      <p className="font-semibold text-[#35251d]">
                        ₹{formatPrice(item.price * item.quantity)}
                      </p>
                    </div>
                  ))}
                </div>

                <div className="mt-4 flex justify-between border-t border-[#f0e5da] pt-3">
                  <span className="font-semibold text-[#35251d]">
                    Current Order Total
                  </span>

                  <span className="font-bold text-[#9b6a32]">
                    ₹
                    {formatPrice(
                      currentOrder.totalAmount ??
                        currentOrder.subtotal ??
                        currentOrder.items.reduce(
                          (total, item) =>
                            total + item.price * item.quantity,
                          0
                        )
                    )}
                  </span>
                </div>
              </div>
            )}

            {/* Bring Bill */}
            {currentOrder.status === "active" ? (
              <button
                type="button"
                onClick={handleBringBill}
                disabled={loading}
                className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-[#9b6a32] px-5 py-3 font-semibold text-white transition hover:bg-[#805326] disabled:cursor-not-allowed disabled:opacity-50"
              >
                <CheckCircle2 size={19} />
                {loading ? "Please wait..." : "Bring Bill"}
              </button>
            ) : (
              <div className="mt-5 rounded-xl bg-amber-50 p-3 text-center text-sm text-amber-800">
                Your bill has been requested. Our staff will assist you shortly.
              </div>
            )}
          </div>
        ) : null}

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <div className="rounded-2xl border border-[#eee0d2] bg-white p-5 shadow-sm sm:p-6">
              <h2 className="mb-5 text-lg font-bold text-[#35251d]">
                {currentOrder ? "Add More Items" : "Cart Items"}
              </h2>

              {cart.length === 0 ? (
                <div className="py-10 text-center">
                  <div className="mx-auto mb-3 flex h-16 w-16 items-center justify-center rounded-full bg-[#fff3e5] text-[#b58a5a]">
                    <ShoppingCart size={28} />
                  </div>

                  <h3 className="font-semibold text-[#35251d]">
                    Your cart is empty
                  </h3>

                  <p className="mt-1 text-sm text-[#8b7769]">
                    Browse the menu and add something you love.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {cart.map((item) => (
                    <div
                      key={`${item.menuId}-${item.variantName || ""}`}
                      className="flex gap-3 border-b border-[#f0e5da] pb-4 last:border-0 last:pb-0 sm:gap-4"
                    >
                      {/* Product Image */}
                      <div className="h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-[#fff3e5] sm:h-24 sm:w-24">
                        {item.image ? (
                          <img
                            src={item.image}
                            alt={item.itemName}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center text-[#b58a5a]">
                            <ShoppingBag size={25} />
                          </div>
                        )}
                      </div>

                      {/* Product Details */}
                      <div className="min-w-0 flex-1">
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <h3 className="font-semibold text-[#35251d]">
                              {item.itemName}
                            </h3>

                            {item.variantName && (
                              <p className="mt-0.5 text-xs text-[#8b7769]">
                                {item.variantName}
                              </p>
                            )}

                            <p className="mt-1 text-sm text-[#8b7769]">
                              ₹{formatPrice(item.price)} each
                            </p>
                          </div>

                          <button
                            type="button"
                            onClick={() =>
                              removeFromCart(item.menuId, item.variantName || "")
                            }
                            aria-label={`Remove ${item.itemName}`}
                            className="rounded-lg p-2 text-red-500 transition hover:bg-red-50"
                          >
                            <Trash2 size={17} />
                          </button>
                        </div>

                        <div className="mt-3 flex items-center justify-between gap-3">
                          <div className="flex items-center gap-3 rounded-lg border border-[#eee0d2] p-1">
                            <button
                              type="button"
                              onClick={() =>
                                decreaseQuantity(
                                  item.menuId,
                                  item.variantName || ""
                                )
                              }
                              aria-label="Decrease quantity"
                              className="rounded-md p-1 text-[#76502d] hover:bg-[#fff3e5]"
                            >
                              <Minus size={15} />
                            </button>

                            <span className="min-w-4 text-center text-sm font-semibold text-[#35251d]">
                              {item.quantity}
                            </span>

                            <button
                              type="button"
                              onClick={() =>
                                increaseQuantity(
                                  item.menuId,
                                  item.variantName || ""
                                )
                              }
                              aria-label="Increase quantity"
                              className="rounded-md p-1 text-[#76502d] hover:bg-[#fff3e5]"
                            >
                              <Plus size={15} />
                            </button>
                          </div>

                          <p className="font-bold text-[#35251d]">
                            ₹
                            {formatPrice(item.price * item.quantity)}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Summary */}
          <div className="lg:col-span-1">
            <div className="sticky top-5 rounded-2xl border border-[#eee0d2] bg-white p-5 shadow-sm sm:p-6">
              <h2 className="mb-5 text-lg font-bold text-[#35251d]">
                Order Summary
              </h2>

              {/* Table Number */}
              {!currentOrder && (
                <div className="mb-5">
                  <label
                    htmlFor="tableNumber"
                    className="mb-2 block text-sm font-semibold text-[#35251d]"
                  >
                    Table Number
                  </label>

                  <input
                    id="tableNumber"
                    type="text"
                    value={tableNumber}
                    onChange={(e) => setTableNumber(e.target.value)}
                    placeholder="Enter your table number"
                    autoComplete="off"
                    className="w-full rounded-xl border border-[#e7d3bd] bg-[#fffdfb] px-4 py-3 text-sm text-[#35251d] outline-none transition placeholder:text-[#b3a194] focus:border-[#9b6a32] focus:ring-2 focus:ring-[#9b6a32]/15"
                  />

                  <p className="mt-1 text-xs text-[#8b7769]">
                    Enter the table number given to you at the café.
                  </p>
                </div>
              )}

              {currentOrder?.tableNumber && (
                <div className="mb-5 flex items-center justify-between rounded-xl bg-[#fff7ed] p-3">
                  <span className="text-sm text-[#76502d]">
                    Table Number
                  </span>
                  <span className="font-bold text-[#9b6a32]">
                    {currentOrder.tableNumber}
                  </span>
                </div>
              )}

              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-[#8b7769]">Cart Subtotal</span>
                  <span className="font-medium text-[#35251d]">
                    ₹{formatPrice(subtotal)}
                  </span>
                </div>

                <div className="flex justify-between text-sm">
                  <span className="text-[#8b7769]">
                    Estimated Reward Points
                  </span>
                  <span className="font-medium text-green-700">
                    +{rewardPoints} points
                  </span>
                </div>
              </div>

              <div className="my-5 border-t border-dashed border-[#e7d3bd]" />

              <div className="flex items-center justify-between">
                <span className="font-bold text-[#35251d]">
                  Cart Total
                </span>

                <span className="text-xl font-bold text-[#9b6a32]">
                  ₹{formatPrice(subtotal)}
                </span>
              </div>

              <button
                type="button"
                onClick={handleOrder}
                disabled={loading || cart.length === 0}
                className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-[#9b6a32] px-5 py-3 font-semibold text-white transition hover:bg-[#805326] disabled:cursor-not-allowed disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <RefreshCw size={18} className="animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <ShoppingCart size={18} />
                    {currentOrder ? "Add to Current Order" : "Place Order"}
                  </>
                )}
              </button>

              <p className="mt-3 text-center text-xs text-[#8b7769]">
                Your order will be sent to our staff for confirmation.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
