// src/pages/Menu/Menu.jsx
import { useEffect, useMemo, useState } from "react";
import api from "../../services/api";
import { Search, Star, ArrowRight } from "lucide-react";
import { useCart } from "../../context/CartContext";

const Menu = () => {
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [maxPrice, setMaxPrice] = useState(5000);
  const { addToCart } = useCart();

  useEffect(() => {

    fetchMenu();

  }, []);

  const fetchMenu = async () => {

    try {

      setLoading(true);

      const res = await api.get("/menus");

      setMenuItems(res.data.data || []);

    } catch (err) {

      console.log(err);

    } finally {

      setLoading(false);

    }

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

  const menuCategories = useMemo(() => {

    const categories = [
      {
        id: "all",
        label: "All",
        emoji: "🍽️",
      },
    ];

    menuItems.forEach((item) => {

      if (
        !categories.find(
          (c) =>
            c.id ===
            item.category
        )
      ) {

        categories.push({

          id: item.category,

          label: item.category,

          emoji: "☕",

        });

      }

    });

    return categories;

  }, [menuItems]);

  const { cart } = useCart();

  console.log(cart);

  const filteredItems = menuItems.filter((item) => {
    const matchesCategory = activeCategory === 'all' || item.category === activeCategory;
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesPrice = item.price <= maxPrice;
    return matchesCategory && matchesSearch && matchesPrice;
  });

  return (
    <div className="animate-fade-in min-h-screen bg-transparent pb-24">

      {/* Header Section */}
      <header className="bg-sbDark text-sbCream pt-16 pb-32 px-6 md:px-12 text-center relative overflow-hidden">
        <div className="max-w-4xl mx-auto relative z-10">
          <h1 className="text-4xl md:text-7xl font-black mb-8 tracking-tighter">Our <span className="text-sbGold text-glow">Collections</span></h1>
          <div className="relative max-w-2xl mx-auto group">
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-sbDark/30 group-focus-within:text-sbGreen transition-colors" size={20} />
            <input
              type="text"
              placeholder="Search for your favorite brew..."
              className="w-full bg-white text-sbDark rounded-3xl py-6 pl-16 pr-8 focus:outline-none shadow-3xl text-lg font-bold placeholder:text-gray-300"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
        {/* Artistic background accents */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-sbGreen/10 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-sbGold/5 rounded-full blur-[80px] translate-y-1/2 -translate-x-1/2"></div>
      </header>

      {/* Categories & Filter Bar */}
      <div className="sticky top-20 md:top-24 bg-white/80 backdrop-blur-xl z-30 shadow-2xl border-b border-gray-100 -mt-16 mx-6 md:mx-12 rounded-[2.5rem] p-6 flex items-center gap-10 overflow-x-auto hide-scrollbar snap-x">
        {menuCategories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setActiveCategory(cat.id)}
            className={`flex flex-col items-center gap-4 transition-all flex-shrink-0 snap-center min-w-[110px] ${activeCategory === cat.id ? 'scale-110' : 'opacity-40 grayscale hover:opacity-100 hover:grayscale-0'
              }`}
          >
            <div className={`w-16 h-16 md:w-20 md:h-20 rounded-[1.8rem] flex items-center justify-center text-3xl md:text-4xl shadow-lg transition-all ${activeCategory === cat.id ? 'bg-sbGreen text-white' : 'bg-sbCream text-sbDark'
              }`}>
              {cat.emoji}
            </div>
            <span className={`text-[10px] font-black uppercase tracking-[0.2em] ${activeCategory === cat.id ? 'text-sbGreen' : 'text-sbDark/40'}`}>
              {cat.label}
            </span>
          </button>
        ))}

        <div className="hidden md:flex flex-col items-center gap-2 border-l border-gray-100 pl-10 ml-4 min-w-[160px]">
          <p className="text-[10px] font-black text-sbDark/20 uppercase tracking-[0.2em]">Max: ₹{maxPrice}</p>
          <input
            type="range"
            min="100"
            max="500"
            value={maxPrice}
            onChange={(e) => setMaxPrice(parseInt(e.target.value))}
            className="w-full h-1.5 bg-sbLight rounded-lg appearance-none cursor-pointer accent-sbGreen"
          />
        </div>
      </div>

      {/* Catalog */}
      <main className="p-8 md:p-16 lg:p-24 max-w-[1536px] mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-16">
          {filteredItems.map((item) => (
            <div key={item.id} className="group relative bg-white rounded-[3.5rem] p-8 hover:shadow-4xl transition-all duration-500 border border-gray-50 flex flex-col">

              {/* Veg Indicator */}
              <div className="absolute top-8 left-8 flex items-center justify-center w-6 h-6 border-2 border-gray-100 rounded-lg bg-white p-1 shadow-sm">
                <div className={`w-full h-full rounded-full ${item.isVeg ? 'bg-green-600' : 'bg-red-600'}`}></div>
              </div>

              {/* Product Visual */}
              <div className="w-full aspect-square rounded-[3rem] bg-sbCream/50 flex items-center justify-center text-8xl md:text-9xl mb-10 shadow-inner group-hover:scale-105 transition-all duration-500 relative overflow-hidden">
                <div className="relative z-10 drop-shadow-2xl">{item.emoji}</div>
                {item.popular && (
                  <div className="absolute top-4 right-4 bg-sbGold text-white text-[9px] font-black px-4 py-1.5 rounded-xl uppercase tracking-widest shadow-lg">Popular</div>
                )}
                {/* Decorative background circle */}
                <div className="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-sbGold/10 to-transparent"></div>
              </div>

              <div className="flex flex-col flex-1">
                <div className="flex items-center gap-3 mb-4">
                  <div className="flex items-center gap-1 bg-sbGold/10 px-3 py-1 rounded-lg text-sbGold">
                    <Star size={14} fill="currentColor" />
                    <span className="text-xs font-black">{item.rating}</span>
                  </div>
                  <span className="text-[10px] text-sbDark/30 font-black uppercase tracking-widest">{item.calories}</span>
                </div>

                <h3 className="font-black text-2xl md:text-3xl text-sbDark mb-3 group-hover:text-sbGreen transition-colors line-clamp-1">
                  {item.name}
                </h3>
                <p className="text-sbDark/40 text-sm mb-10 line-clamp-2 leading-relaxed font-medium italic">
                  "{item.description}"
                </p>

                <div className="mt-auto pt-8 border-t border-sbCream flex items-center justify-between w-full">
                  <div>
                    <p className="text-[10px] font-black text-sbDark/20 uppercase tracking-widest mb-1">Price</p>
                    <p className="text-3xl font-black text-sbDark tracking-tighter">₹{item.price}</p>
                  </div>
                  <button
                    onClick={() => handleAddToCart(item)}
                    className="bg-sbGreen text-white p-4 rounded-2xl shadow-xl hover:bg-sbDark transition-all active:scale-90"
                  >
                    <ArrowRight size={20} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredItems.length === 0 && (
          <div className="py-48 text-center flex flex-col items-center">
            <div className="w-32 h-32 bg-sbCream rounded-[2rem] flex items-center justify-center text-6xl mb-10 opacity-50 shadow-inner">☕</div>
            <h2 className="text-3xl font-black text-sbDark/20 uppercase tracking-[0.3em]">No Match Found</h2>
            <button
              onClick={() => { setActiveCategory('all'); setSearchQuery(''); setMaxPrice(500); }}
              className="mt-12 sb-btn-outline-green"
            >
              Reset Filters
            </button>
          </div>
        )}
      </main>
    </div>
  );
};

export default Menu;
