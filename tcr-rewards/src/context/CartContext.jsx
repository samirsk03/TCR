import {
  createContext,
  useContext,
  useState,
  useCallback,
  useMemo,
  useEffect,
} from "react";

import api from "../services/api";

const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState(() => {
    try {
      const saved = localStorage.getItem("tcr_cart");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem("tcr_cart", JSON.stringify(cart));
  }, [cart]);

  // ---------------- ADD ----------------

  const addToCart = useCallback((item) => {
    setCart((prev) => {
      const index = prev.findIndex(
        (i) =>
          i.menuId === item.menuId &&
          i.variantName === item.variantName
      );

      if (index !== -1) {
        const updated = [...prev];

        updated[index].quantity += 1;

        return updated;
      }

      return [
        ...prev,
        {
          menuId: item.menuId,
          itemName: item.itemName,
          variantName: item.variantName || "",
          quantity: 1,
          price: item.price,
          rewardPoints: item.rewardPoints || 0,
          image: item.image || "",
        },
      ];
    });
  }, []);

  // ---------------- REMOVE ----------------

  const removeFromCart = useCallback(
    (menuId, variantName = "") => {
      setCart((prev) =>
        prev.filter(
          (item) =>
            !(
              item.menuId === menuId &&
              item.variantName === variantName
            )
        )
      );
    },
    []
  );

  // ---------------- INCREASE ----------------

  const increaseQuantity = useCallback(
    (menuId, variantName = "") => {
      setCart((prev) =>
        prev.map((item) =>
          item.menuId === menuId &&
          item.variantName === variantName
            ? {
                ...item,
                quantity: item.quantity + 1,
              }
            : item
        )
      );
    },
    []
  );

  // ---------------- DECREASE ----------------

  const decreaseQuantity = useCallback(
    (menuId, variantName = "") => {
      setCart((prev) =>
        prev
          .map((item) =>
            item.menuId === menuId &&
            item.variantName === variantName
              ? {
                  ...item,
                  quantity: item.quantity - 1,
                }
              : item
          )
          .filter((item) => item.quantity > 0)
      );
    },
    []
  );

  // ---------------- CLEAR ----------------

  const clearCart = useCallback(() => {
    setCart([]);
  }, []);

  // ---------------- TOTALS ----------------

  const subtotal = useMemo(() => {
    return cart.reduce(
      (sum, item) =>
        sum + item.price * item.quantity,
      0
    );
  }, [cart]);

  const rewardTotal = useMemo(() => {
    return cart.reduce(
      (sum, item) =>
        sum +
        item.rewardPoints * item.quantity,
      0
    );
  }, [cart]);

  const itemCount = useMemo(() => {
    return cart.reduce(
      (sum, item) => sum + item.quantity,
      0
    );
  }, [cart]);

  // ---------------- PLACE ORDER ----------------

  const placeOrder = useCallback(async () => {
    if (cart.length === 0) {
      throw new Error("Cart is empty");
    }

    const token = localStorage.getItem("tcr_token");

    const res = await api.post(
      "/order-request",
      {
        items: cart.map((item) => ({
          menuId: item.menuId,
          itemName: item.itemName,
          variantName: item.variantName,
          quantity: item.quantity,
          price: item.price,
          rewardPoints: item.rewardPoints,
        })),
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    clearCart();

    return res.data;
  }, [cart, clearCart]);

  return (
    <CartContext.Provider
      value={{
        cart,

        addToCart,

        removeFromCart,

        increaseQuantity,

        decreaseQuantity,

        clearCart,

        subtotal,

        rewardTotal,

        itemCount,

        placeOrder,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const ctx = useContext(CartContext);

  if (!ctx) {
    throw new Error(
      "useCart must be used inside CartProvider"
    );
  }

  return ctx;
};