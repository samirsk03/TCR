
import { useEffect, useState } from "react";
import api from "../services/api";
import { useStoreSettings } from "../context/StoreSettingContext";

export default function PendingOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const { settings } = useStoreSettings();

  const [acceptingId, setAcceptingId] = useState(null);
  const [cancellingId, setCancellingId] = useState(null);
  const [cancellingItemId, setCancellingItemId] = useState(null);

  const fetchOrders = async () => {
    try {
      const res = await api.get("/order-request/pending");
      setOrders(res.data.data || []);
    } catch (err) {
      console.error(err);
      alert(
        err.response?.data?.message ||
          "Failed to fetch pending orders."
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleRefresh = async () => {
    setRefreshing(true);
    fetchOrders();
  };

  const handleAccept = async (id) => {
    try {
      setAcceptingId(id);

      await api.patch(`/order-request/${id}/accept`);

      alert("Order Accepted Successfully");
      fetchOrders();
    } catch (err) {
      console.error(err);
      alert(
        err.response?.data?.message ||
          "Unable to accept order."
      );
    } finally {
      setAcceptingId(null);
    }
  };

  const handleCancel = async (id) => {
    if (!window.confirm("Are you sure you want to cancel this order?")) {
      return;
    }

    try {
      setCancellingId(id);

      await api.patch(`/order-request/${id}/cancel`);

      alert("Order Cancelled Successfully");
      fetchOrders();
    } catch (err) {
      console.error(err);
      alert(
        err.response?.data?.message ||
          "Unable to cancel order."
      );
    } finally {
      setCancellingId(null);
    }
  };

  // Cancel individual item
const handleCancelItem = async (orderId, itemId, itemName) => {
  if (!window.confirm(`Are you sure you want to cancel ${itemName}?`)) {
    return;
  }

  try {
    setCancellingItemId(itemId);

    const res = await api.patch(
      `/order-request/${orderId}/item/${itemId}/cancel`
    );

    // Immediately update the frontend using the updated order
    const updatedOrder = res.data.data;

    setOrders((prevOrders) =>
      prevOrders
        .map((order) =>
          order._id === orderId ? updatedOrder : order
        )
        .filter(
          (order) =>
            order.status === "pending" &&
            order.items.length > 0
        )
    );

    alert("Item Cancelled Successfully");

  } catch (err) {
    console.error("Cancel item error:", err);

    alert(
      err.response?.data?.message ||
        "Unable to cancel item."
    );
  } finally {
    setCancellingItemId(null);
  }
};
  if (loading) {
    return (
      <div className="p-8">
        <h1 className="text-3xl font-bold mb-8">
          Pending Orders
        </h1>
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-8">

      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold">
          Pending Orders
        </h1>

        <button
          onClick={handleRefresh}
          disabled={refreshing}
          className="bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-50"
        >
          {refreshing ? "Refreshing..." : "Refresh"}
        </button>
      </div>

      {orders.length === 0 && (
        <div className="bg-white border rounded-lg p-10 text-center">
          <h2 className="text-xl font-semibold">
            No Pending Orders
          </h2>
        </div>
      )}

      <div className="space-y-6">

        {orders.map((order) => {
          const total = order.items.reduce(
            (sum, item) =>
              sum + item.price * item.quantity,
            0
          );

          const reward = settings
            ? Math.floor(
                (total * settings.rewardPercentage) / 100
              )
            : 0;

          return (
            <div
              key={order._id}
              className="border rounded-lg p-4 sm:p-6 bg-white shadow"
            >

              <div className="flex flex-col sm:flex-row justify-between gap-4">

                <div>
                  <h2 className="text-xl font-bold">
                    {order.customerId?.name}
                  </h2>

                  <p className="text-gray-600">
                    {order.customerId?.phone}
                  </p>

                  <p className="text-sm text-gray-400 mt-2">
                    {new Date(order.createdAt).toLocaleString()}
                  </p>

                  <p className="text-sm font-semibold text-gray-600 mt-2">
                    Table: {order.tableNumber}
                  </p>
                </div>

                <div className="flex gap-2">

                  <button
                    onClick={() => handleCancel(order._id)}
                    disabled={
                      cancellingId === order._id ||
                      acceptingId === order._id
                    }
                    className="bg-red-600 text-white px-4 py-2 rounded disabled:opacity-50"
                  >
                    {cancellingId === order._id
                      ? "Cancelling..."
                      : "Cancel Order"}
                  </button>

                  <button
                    onClick={() => handleAccept(order._id)}
                    disabled={
                      acceptingId === order._id ||
                      cancellingId === order._id
                    }
                    className="bg-green-600 text-white px-4 py-2 rounded disabled:opacity-50"
                  >
                    {acceptingId === order._id
                      ? "Accepting..."
                      : "Accept"}
                  </button>

                </div>
              </div>

              <div className="mt-6 overflow-x-auto">

                <table className="w-full border text-sm">

                  <thead>
                    <tr className="bg-gray-100">
                      <th className="border p-2 text-left">Item</th>
                      <th className="border p-2">Variant</th>
                      <th className="border p-2">Qty</th>
                      <th className="border p-2">Price</th>
                      <th className="border p-2">Reward</th>
                      <th className="border p-2">Total</th>
                      <th className="border p-2">Action</th>
                    </tr>
                  </thead>

                  <tbody>
                    {order.items.map((item, index) => (
                      <tr key={item._id || index}>

                        <td className="border p-2">
                          {item.itemName}
                        </td>

                        <td className="border p-2 text-center">
                          {item.variantName || "-"}
                        </td>

                        <td className="border p-2 text-center">
                          {item.quantity}
                        </td>

                        <td className="border p-2 text-center">
                          ₹{item.price}
                        </td>

                        <td className="border p-2 text-center">
                          {settings
                            ? Math.floor(
                                (item.price *
                                  settings.rewardPercentage) /
                                  100
                              )
                            : 0}
                        </td>

                        <td className="border p-2 text-center">
                          ₹{item.price * item.quantity}
                        </td>

                        <td className="border p-2 text-center">
                          <button
                            onClick={() =>
                              handleCancelItem(
                                order._id,
                                item._id,
                                item.itemName
                              )
                            }
                            disabled={
                              !item._id ||
                              cancellingItemId === item._id ||
                              acceptingId === order._id ||
                              cancellingId === order._id
                            }
                            className="bg-red-50 text-red-600 hover:bg-red-100 px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap disabled:opacity-50"
                          >
                            {cancellingItemId === item._id
                              ? "Removing..."
                              : "Cancel Item"}
                          </button>
                        </td>

                      </tr>
                    ))}
                  </tbody>

                </table>
              </div>

              <div className="mt-6 flex justify-end">
                <div className="text-right space-y-2">

                  <h3 className="text-lg font-semibold">
                    Total Amount: ₹{total.toFixed(2)}
                  </h3>

                  <h3 className="text-green-600 font-semibold">
                    Reward Points: {reward}
                  </h3>

                </div>
              </div>

            </div>
          );
        })}
      </div>
    </div>
  );
}
