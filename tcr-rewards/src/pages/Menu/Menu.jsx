
import { useEffect, useMemo, useState } from "react";
import { Search, Star, Plus, Minus, ShoppingCart } from "lucide-react";
import { useNavigate } from "react-router-dom";

import api from "../../services/api";
import { useCart } from "../../context/CartContext";

const Menu = () => {
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [maxPrice, setMaxPrice] = useState(5000);

  const { cart, addToCart, increaseQuantity, decreaseQuantity } = useCart();
  const navigate = useNavigate();

  // Total quantity of items in the cart
  const totalCartItems = cart.reduce(
    (total, item) => total + item.quantity,
    0
  );

  useEffect(() => {
    fetchMenu();
  }, []);

  const fetchMenu = async () => {
    try {
      setLoading(true);
      const res = await api.get("/menus");
      setMenuItems(res.data.data || []);
    } catch (err) {
      console.error("Unable to fetch menu:", err);
    } finally {
      setLoading(false);
    }
  };

  const getVariantName = (item) => {
    return item.variants?.length > 0 ? item.variants[0].name : "";
  };

  const getItemQuantity = (item) => {
    const variantName = getVariantName(item);

    const cartLine = cart.find(
      (c) =>
        c.menuId === item._id &&
        c.variantName === variantName
    );

    return cartLine?.quantity || 0;
  };

  const handleAddToCart = (item) => {
    if (item.variants?.length > 0) {
      const firstVariant = item.variants[0];

      addToCart({
        menuId: item._id,
        itemName: item.name,
        variantName: firstVariant.name,
        price: firstVariant.price,
        rewardPoints: firstVariant.rewardPoints,
        image: item.image,
      });

      return;
    }

    addToCart({
      menuId: item._id,
      itemName: item.name,
      variantName: "",
      price: item.price,
      rewardPoints: item.rewardPoints,
      image: item.image,
    });
  };

  const handleIncrement = (item) => {
    increaseQuantity(item._id, getVariantName(item));
  };

  const handleDecrement = (item) => {
    decreaseQuantity(item._id, getVariantName(item));
  };

  // Categories displayed as text only
  const menuCategories = useMemo(() => {
    const categories = [{ id: "all", label: "All Items" }];

    menuItems.forEach((item) => {
      if (
        item.category &&
        !categories.some((category) => category.id === item.category)
      ) {
        categories.push({
          id: item.category,
          label: item.category,
        });
      }
    });

    return categories;
  }, [menuItems]);

  const filteredItems = menuItems.filter((item) => {
    const matchesCategory =
      activeCategory === "all" ||
      item.category === activeCategory;

    const matchesSearch = (item.name || "")
      .toLowerCase()
      .includes(searchQuery.toLowerCase());

    const price = Number(
      item.variants?.length > 0
        ? item.variants[0].price
        : item.price
    ) || 0;

    const matchesPrice = price <= maxPrice;

    return matchesCategory && matchesSearch && matchesPrice;
  });

  return (
    <div className="relative min-h-screen bg-[#faf8f4] pb-28">

      {/* Header */}
      <header className="relative overflow-hidden bg-sbDark px-4 pb-12 pt-10 text-sbCream sm:px-6 sm:pb-16 sm:pt-14">
        <div className="relative z-10 mx-auto max-w-7xl">
          <p className="mb-2 text-xs font-bold uppercase tracking-[0.25em] text-sbGold">
            The Chocolate Room
          </p>

          <h1 className="mb-6 text-3xl font-black tracking-tight sm:text-5xl">
            Our <span className="text-sbGold">Menu</span>
          </h1>

          {/* Search */}
          <div className="group relative max-w-xl">
            <Search
              size={19}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-sbDark/40"
            />

            <input
              type="text"
              placeholder="Search food and beverages..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-2xl border border-white/10 bg-white py-3.5 pl-11 pr-4 text-sm font-medium text-sbDark outline-none transition focus:ring-2 focus:ring-sbGold sm:py-4"
            />
          </div>
        </div>

        <div className="pointer-events-none absolute -right-16 -top-20 h-64 w-64 rounded-full bg-sbGreen/10 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-24 left-10 h-52 w-52 rounded-full bg-sbGold/10 blur-3xl" />
      </header>

      {/* Text-only Categories */}
      <div className="sticky top-16 z-30 border-b border-gray-100 bg-white/95 shadow-sm backdrop-blur-md md:top-20">
        <div className="mx-auto flex max-w-7xl items-center gap-2 overflow-x-auto px-4 py-3 [scrollbar-width:none] sm:px-6 [&::-webkit-scrollbar]:hidden">
          {menuCategories.map((category) => {
            const isActive = activeCategory === category.id;

            return (
              <button
                key={category.id}
                type="button"
                onClick={() => setActiveCategory(category.id)}
                className={`shrink-0 rounded-full border px-4 py-2.5 text-xs font-bold capitalize transition-all sm:px-5 sm:text-sm ${
                  isActive
                    ? "border-sbGreen bg-sbGreen text-white shadow-md"
                    : "border-gray-200 bg-white text-sbDark/65 hover:border-sbGreen hover:text-sbGreen"
                }`}
              >
                {category.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Menu Catalog */}
      <main className="mx-auto max-w-7xl px-3 py-5 sm:px-6 sm:py-8">

        {/* Result count and price filter */}
        <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
          <p className="text-sm font-semibold text-sbDark/60">
            {filteredItems.length} items available
          </p>

          <div className="flex items-center gap-3 rounded-xl border border-gray-200 bg-white px-3 py-2">
            <label
              htmlFor="maxPrice"
              className="whitespace-nowrap text-xs font-semibold text-sbDark/70"
            >
              Max ₹{maxPrice}
            </label>

            <input
              id="maxPrice"
              type="range"
              min="100"
              max="5000"
              step="100"
              value={maxPrice}
              onChange={(e) => setMaxPrice(Number(e.target.value))}
              className="w-24 cursor-pointer accent-sbGreen sm:w-32"
            />
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-5 lg:grid-cols-4">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((item) => (
              <div
                key={item}
                className="animate-pulse overflow-hidden rounded-2xl border border-gray-100 bg-white p-3 sm:rounded-3xl sm:p-4"
              >
                <div className="mb-3 aspect-[4/3] rounded-xl bg-gray-100" />
                <div className="mb-2 h-4 w-3/4 rounded bg-gray-100" />
                <div className="h-4 w-1/2 rounded bg-gray-100" />
              </div>
            ))}
          </div>
        ) : filteredItems.length > 0 ? (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-5 lg:grid-cols-4 xl:grid-cols-4">

            {filteredItems.map((item) => {
              const quantity = getItemQuantity(item);
              const price =
                item.variants?.length > 0
                  ? item.variants[0].price
                  : item.price;

              return (
                <div
                  key={item._id}
                  className="group relative flex min-w-0 flex-col overflow-hidden rounded-2xl border border-gray-100 bg-white p-3 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-lg sm:rounded-3xl sm:p-4"
                >
                  {/* Product Image */}
                  <div className="relative mb-3 aspect-[4/3] overflow-hidden rounded-xl bg-sbCream/60 sm:rounded-2xl">
                    {item.image ? (
                      <img
                        src={item.image}
                        alt={item.name}
                        loading="lazy"
                        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center text-sm text-sbDark/40">
                        No image
                      </div>
                    )}

                    {item.popular && (
                      <span className="absolute left-2 top-2 rounded-full bg-sbGold px-2.5 py-1 text-[9px] font-extrabold uppercase tracking-wide text-white shadow sm:text-[10px]">
                        Popular
                      </span>
                    )}

                    {/* Veg / non-veg indicator */}
                    {item.foodType && (
                      <span className="absolute right-2 top-2 flex h-5 w-5 items-center justify-center rounded border border-white bg-white/95 shadow-sm">
                        <span
                          className={`h-2.5 w-2.5 rounded-full ${
                            item.foodType === "veg"
                              ? "bg-green-600"
                              : "bg-red-600"
                          }`}
                        />
                      </span>
                    )}
                  </div>

                  {/* Product Details */}
                  <div className="flex flex-1 flex-col">
                    {item.rating != null && (
                      <div className="mb-2 flex items-center gap-1 self-start rounded-md bg-sbGold/10 px-2 py-1 text-sbGold">
                        <Star size={12} fill="currentColor" />
                        <span className="text-[10px] font-bold">
                          {item.rating}
                        </span>
                      </div>
                    )}

                    <h3 className="line-clamp-2 min-h-10 text-sm font-extrabold leading-snug text-sbDark transition-colors group-hover:text-sbGreen sm:text-base">
                      {item.name}
                    </h3>

                    {item.description && (
                      <p className="mt-1 line-clamp-2 text-[11px] leading-relaxed text-sbDark/50 sm:text-xs">
                        {item.description}
                      </p>
                    )}

                    {/* Price and Quantity */}
                    <div className="mt-auto flex items-center justify-between gap-2 border-t border-gray-100 pt-3 mt-3">
                      <div className="min-w-0">
                        <p className="text-[10px] text-sbDark/45">
                          Price
                        </p>
                        <p className="truncate text-base font-black text-sbDark sm:text-xl">
                          ₹{price}
                        </p>
                      </div>

                      {quantity > 0 ? (
                        <div className="flex shrink-0 items-center gap-1 rounded-xl bg-sbGreen p-1 text-white shadow-sm sm:gap-2 sm:p-1.5">
                          <button
                            type="button"
                            onClick={() => handleDecrement(item)}
                            aria-label={`Remove one ${item.name}`}
                            className="flex h-7 w-7 items-center justify-center rounded-lg transition hover:bg-white/20 sm:h-8 sm:w-8"
                          >
                            <Minus size={15} />
                          </button>

                          <span className="min-w-4 text-center text-xs font-extrabold">
                            {quantity}
                          </span>

                          <button
                            type="button"
                            onClick={() => handleIncrement(item)}
                            aria-label={`Add one ${item.name}`}
                            className="flex h-7 w-7 items-center justify-center rounded-lg transition hover:bg-white/20 sm:h-8 sm:w-8"
                          >
                            <Plus size={15} />
                          </button>
                        </div>
                      ) : (
                        <button
                          type="button"
                          onClick={() => handleAddToCart(item)}
                          aria-label={`Add ${item.name} to cart`}
                          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-sbGreen text-white shadow-md transition hover:bg-sbDark active:scale-95 sm:h-10 sm:w-10"
                        >
                          <Plus size={19} />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="py-20 text-center">
            <h2 className="text-xl font-extrabold text-sbDark">
              No items found
            </h2>
            <p className="mt-2 text-sm text-sbDark/50">
              Try another category or search term.
            </p>

            <button
              type="button"
              onClick={() => {
                setActiveCategory("all");
                setSearchQuery("");
                setMaxPrice(5000);
              }}
              className="mt-5 rounded-xl bg-sbGreen px-5 py-2.5 text-sm font-bold text-white transition hover:bg-sbDark"
            >
              Reset Filters
            </button>
          </div>
        )}
      </main>

      {/* Floating Go To Cart Button - fixed to viewport */}
      {totalCartItems > 0 && (
        <button
          type="button"
          onClick={() => navigate("/cart")}
          className="fixed bottom-5 left-4 z-[9999] flex items-center gap-3 rounded-2xl bg-sbGreen px-4 py-3 text-white shadow-2xl ring-1 ring-black/5 transition hover:bg-sbDark active:scale-95 sm:bottom-6 sm:left-6 sm:px-5 sm:py-4"
        >
          <span className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-white/15">
            <ShoppingCart size={21} />

            <span className="absolute -right-2 -top-2 flex h-5 min-w-5 items-center justify-center rounded-full bg-sbGold px-1 text-[10px] font-black text-white ring-2 ring-sbGreen">
              {totalCartItems}
            </span>
          </span>

          <span className="text-left">
            <span className="block text-sm font-extrabold">
              Go to Cart
            </span>
            <span className="block text-[10px] text-white/75">
              {totalCartItems} {totalCartItems === 1 ? "item" : "items"} selected
            </span>
          </span>
        </button>
      )}
    </div>
  );
};

export default Menu;
