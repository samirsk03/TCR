import { useState } from "react";
import { useCart } from "../../context/CartContext";
import { useStoreSettings } from "../../context/StoreSettingContext";

export default function Cart() {
  const {
    cart,
    subtotal,
    rewardTotal,
    increaseQuantity,
    decreaseQuantity,
    removeFromCart,
    placeOrder,
  } = useCart();

  const [loading, setLoading] = useState(false);
  const { settings } = useStoreSettings();


  const handleOrder = async () => {
    try {
      setLoading(true);

      await placeOrder();

      alert("Order Placed Successfully 🎉");
    } catch (err) {
      alert(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  };

  if (cart.length === 0) {
    return (
      <div className="p-10 text-center">
        <h1 className="text-3xl font-bold">Your Cart is Empty</h1>
      </div>
    );
  }



  return (
    <div className="max-w-4xl mx-auto p-6">

      <h1 className="text-3xl font-bold mb-8">
        My Cart
      </h1>

      <div className="space-y-5">

        {cart.map((item) => (

          <div
            key={item.menuId + item.variantName}
            className="border rounded-lg p-5 flex justify-between items-center"
          >

            <div>

              <h2 className="font-semibold text-xl">
                {item.itemName}
              </h2>

              {item.variantName && (
                <p className="text-gray-500">
                  {item.variantName}
                </p>
              )}

              <p className="mt-2">
                ₹{item.price}
              </p>

              <p className="text-green-600">
                Reward :{" "}
                {settings
                  ? Math.floor(
                    (item.price * settings.rewardPercentage) / 100
                  )
                  : 0}{" "}
                Points
              </p>

            </div>

            <div className="flex items-center gap-3">

              <button
                onClick={() =>
                  decreaseQuantity(
                    item.menuId,
                    item.variantName
                  )
                }
                className="px-3 py-1 bg-gray-200 rounded"
              >
                -
              </button>

              <span className="font-bold">
                {item.quantity}
              </span>

              <button
                onClick={() =>
                  increaseQuantity(
                    item.menuId,
                    item.variantName
                  )
                }
                className="px-3 py-1 bg-gray-200 rounded"
              >
                +
              </button>

              <button
                onClick={() =>
                  removeFromCart(
                    item.menuId,
                    item.variantName
                  )
                }
                className="text-red-500"
              >
                Remove
              </button>

            </div>

          </div>

        ))}

      </div>

      <div className="mt-10 border-t pt-6">

        <h2 className="text-xl">
          Subtotal : ₹{subtotal}
        </h2>

        <h2 className="text-xl mt-2">
          Reward Points : {
            settings
              ? Math.floor(
                (subtotal *
                  settings.rewardPercentage) /
                100
              )
              : 0
          }
        </h2>

        <button
          onClick={handleOrder}
          disabled={loading}
          className="mt-6 bg-green-600 text-white px-8 py-3 rounded-lg"
        >
          {loading ? "Placing Order..." : "Place Order"}
        </button>

      </div>

    </div>
  );
}