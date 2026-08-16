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

  // ---------------- CURRENT ORDER ----------------

  const fetchCurrentOrder = async () => {
    try {
      const res = await api.get(
        "/session/my-current-order"
      );

      setCurrentOrder(res.data.data || null);
    } catch (err) {
      console.log(
        "Current order error:",
        err
      );
    } finally {
      setCheckingOrder(false);
    }
  };

  useEffect(() => {
    fetchCurrentOrder();

    const interval = setInterval(
      fetchCurrentOrder,
      10000
    );

    return () => clearInterval(interval);
  }, []);

  // ---------------- PLACE ORDER ----------------

  const handleOrder = async () => {
    try {
      setLoading(true);
      setError("");

      await placeOrder();

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

  // ---------------- REWARD ----------------

  const rewardPoints = settings
    ? Math.floor(
      (subtotal *
        settings.rewardPercentage) /
      100
    )
    : 0;

  return (
    <div className="max-w-5xl mx-auto px-6 py-10">

      {/* ================================================= */}
      {/* CURRENT ORDER */}
      {/* ================================================= */}

      {!checkingOrder && currentOrder && (
        <div className="mb-12">

          <div className="flex items-center justify-between mb-6">

            <div>

              <div className="flex items-center gap-3">

                <ShoppingBag
                  className="text-sbGreen"
                  size={28}
                />

                <h1 className="text-3xl font-black">
                  Current Order
                </h1>

              </div>

              <p className="text-gray-500 mt-2">
                Items already ordered
              </p>

            </div>

            <button
              onClick={fetchCurrentOrder}
              className="flex items-center gap-2 px-4 py-2 border rounded-xl bg-white hover:bg-gray-50"
            >
              <RefreshCw size={17} />
              Refresh
            </button>

          </div>

          <div className="bg-white rounded-3xl shadow-sm border overflow-hidden">

            {/* STATUS */}

            <div className="bg-sbDark text-white p-6">

              <div className="flex items-center gap-4">

                <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center">

                  {currentOrder.status ===
                    "bill_requested" ? (
                    <CheckCircle2
                      className="text-sbGold"
                      size={25}
                    />
                  ) : (
                    <Clock
                      className="text-sbGold"
                      size={25}
                    />
                  )}

                </div>

                <div>

                  <div className="flex items-center gap-3">

                    <h2 className="text-xl font-black">
                      {currentOrder.status ===
                        "bill_requested"
                        ? "Bill Requested"
                        : "Order Accepted"}
                    </h2>

                    <span className="bg-sbGold text-black px-3 py-1 rounded-full text-xs font-black uppercase">
                      {currentOrder.status.replace(
                        "_",
                        " "
                      )}
                    </span>

                  </div>

                  <p className="text-white/60 text-sm mt-1">
                    Order #
                    {currentOrder._id
                      .slice(-6)
                      .toUpperCase()}
                  </p>

                </div>

              </div>

            </div>

            {/* CURRENT ITEMS */}

            <div className="p-6">

              <div className="space-y-4">

                {currentOrder.items.map(
                  (item, index) => (

                    <div
                      key={
                        item._id ||
                        index
                      }
                      className="flex justify-between items-center border-b pb-4 last:border-0 last:pb-0"
                    >

                      <div>

                        <h3 className="font-bold text-lg">
                          {item.itemName}
                        </h3>

                        {item.variantName && (
                          <p className="text-sm text-gray-500">
                            {item.variantName}
                          </p>
                        )}

                        <p className="text-sm text-gray-500">
                          Qty:{" "}
                          {item.quantity}
                        </p>

                      </div>

                      <div className="text-right">

                        <p className="font-black">
                          ₹
                          {item.price *
                            item.quantity}
                        </p>

                        <p className="text-green-600 text-sm font-bold">
                          +
                          {(settings
                            ? Math.floor(
                              (item.price *
                                settings.rewardPercentage) /
                              100
                            )
                            : 0) *
                            item.quantity}{" "}
                          points
                        </p>

                      </div>

                    </div>

                  )
                )}

              </div>

              <div className="border-t mt-6 pt-5 flex justify-between">

                <span className="font-bold">
                  Current Order Total
                </span>

                <span className="text-2xl font-black">
                  ₹
                  {currentOrder.totalAmount ||
                    currentOrder.subtotal}
                </span>

              </div>

            </div>

          </div>

        </div>
      )}

      {/* ================================================= */}
      {/* NEW CART */}
      {/* ================================================= */}

      <div>

        <div className="flex items-center gap-4 mb-8">

          <div className="w-14 h-14 rounded-2xl bg-sbGreen/10 flex items-center justify-center">

            <ShoppingCart
              className="text-sbGreen"
              size={28}
            />

          </div>

          <div>

            <h1 className="text-3xl font-black">
              {currentOrder
                ? "Add More Items"
                : "My Cart"}
            </h1>

            <p className="text-gray-500">

              {currentOrder
                ? "Want something else? Add it to your order."
                : "Review your order before placing it."}

            </p>

          </div>

        </div>

        {/* ERROR */}

        {error && (
          <div className="mb-6 bg-red-50 text-red-600 p-4 rounded-2xl flex gap-3">

            <AlertCircle size={20} />

            {error}

          </div>
        )}

        {/* EMPTY CART */}

        {cart.length === 0 ? (

          <div className="bg-white border rounded-3xl p-12 text-center">

            <ShoppingCart
              size={50}
              className="mx-auto text-gray-300"
            />

            <h2 className="text-2xl font-black mt-5">
              {currentOrder
                ? "Ready for something else?"
                : "Your Cart is Empty"}
            </h2>

            <p className="text-gray-500 mt-2">

              {currentOrder
                ? "Go to the menu and add another item."
                : "Add something delicious to get started."}

            </p>

          </div>

        ) : (

          <>

            {/* CART ITEMS */}

            <div className="space-y-5">

              {cart.map((item) => (

                <div
                  key={
                    item.menuId +
                    item.variantName
                  }
                  className="bg-white border rounded-3xl p-6"
                >

                  <div className="flex flex-col md:flex-row justify-between gap-5">

                    <div>

                      <h2 className="font-black text-xl">
                        {item.itemName}
                      </h2>

                      {item.variantName && (
                        <p className="text-gray-500">
                          {item.variantName}
                        </p>
                      )}

                      <p className="mt-2 font-bold">
                        ₹{item.price}
                      </p>

                      <p className="text-green-600 text-sm font-bold mt-1">
                        +{(settings
                            ? Math.floor(
                              (item.price *
                                settings.rewardPercentage) /
                              100
                            )
                            : 0) *
                            item.quantity}{" "}
                        Reward Points
                      </p>

                    </div>

                    {/* CONTROLS */}

                    <div className="flex items-center gap-3">

                      <button
                        onClick={() =>
                          decreaseQuantity(
                            item.menuId,
                            item.variantName
                          )
                        }
                        className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center"
                      >
                        <Minus size={18} />
                      </button>

                      <span className="w-8 text-center font-black">
                        {item.quantity}
                      </span>

                      <button
                        onClick={() =>
                          increaseQuantity(
                            item.menuId,
                            item.variantName
                          )
                        }
                        className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center"
                      >
                        <Plus size={18} />
                      </button>

                      <button
                        onClick={() =>
                          removeFromCart(
                            item.menuId,
                            item.variantName
                          )
                        }
                        className="w-10 h-10 bg-red-50 text-red-500 rounded-xl flex items-center justify-center"
                      >
                        <Trash2 size={18} />
                      </button>

                    </div>

                  </div>

                </div>

              ))}

            </div>

            {/* SUMMARY */}

            <div className="mt-10 bg-white border rounded-3xl p-7">

              <div className="flex justify-between">

                <span className="text-gray-500">
                  New Items Subtotal
                </span>

                <span className="font-black">
                  ₹{subtotal}
                </span>

              </div>

              <div className="flex justify-between mt-4">

                <span className="text-gray-500">
                  Reward Points
                </span>

                <span className="font-black text-green-600">
                  +{rewardPoints}
                </span>

              </div>

              <button
                onClick={handleOrder}
                disabled={loading}
                className="mt-7 w-full bg-sbGreen text-white py-4 rounded-2xl font-black text-lg disabled:opacity-50"
              >

                {loading
                  ? "Placing Order..."
                  : currentOrder
                    ? "Add to Current Order"
                    : "Place Order"}

              </button>

            </div>

          </>

        )}

      </div>

    </div>
  );
} 