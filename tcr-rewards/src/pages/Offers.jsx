// src/pages/Offers.jsx
import { useEffect, useState } from "react";
import api from "../services/api";
import { Tag, ArrowRight } from 'lucide-react';

const themeMap = {
  brown: "from-[#4E342E] to-[#2E1A17]",
  orange: "from-[#E67E22] to-[#D35400]",
  red: "from-[#C2185B] to-[#880E4F]",
  blue: "from-[#1565C0] to-[#0D47A1]",
  green: "from-[#2E7D32] to-[#1B5E20]",
  grey: "from-[#616161] to-[#424242]",
};

const Offers = () => {
  const [offers, setOffers] = useState([]);

  const fetchOffers = async () => {
    try {
      const res = await api.get("/offers");

      setOffers(res.data.data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchOffers();
  }, []);
  return (
    <div className="animate-fade-in flex flex-col min-h-screen p-6 md:p-12 lg:p-20">
      <header className="mb-16">
        <h1 className="text-4xl md:text-5xl font-bold mb-4 text-sbDark">Current Offers</h1>
        <p className="text-gray-500 text-lg">Discover the latest deals and rewards at The Chocolate Room.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl">
        {offers.map((offer) => (
          <div
            key={offer._id}
            className={`relative overflow-hidden rounded-3xl p-8 relative overflow-hidden rounded-3xl p-8 text-white shadow-xl hover:scale-[1.02] transition-all duration-300 group text-white shadow-xl hover:scale-[1.02] transition-all duration-300 group`}
          >
            <div className="flex flex-col h-full justify-between min-h-[200px]">
              <div>
                <span className="inline-block bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-[10px] font-bold tracking-widest uppercase mb-4">
                  {offer.badge}
                </span>
                <h2 className="text-3xl font-bold mb-2">{offer.title}</h2>
                <h3 className="text-xl font-medium opacity-90 mb-4">{offer.terms}</h3>
                <p className="text-sm opacity-80">{offer.description}</p>
              </div>

              <button className="flex items-center gap-2 font-bold text-sm mt-8 group-hover:gap-4 transition-all">
                Details <ArrowRight size={18} />
              </button>
            </div>

            {/* Decorative Icon */}
            <div className="absolute -bottom-4 -right-4 opacity-10 group-hover:opacity-20 transition-opacity">
              <Tag size={120} />
            </div>
          </div>
        ))}
      </div>

      <section className="mt-20 bg-sbCream p-10 rounded-3xl text-center border border-sbLight">
        <h2 className="text-2xl font-bold text-sbDark mb-4">Have a promo code?</h2>
        <p className="text-gray-600 mb-8">Enter your code below to redeem exclusive rewards.</p>
        <div className="max-w-md mx-auto flex gap-4">
          <input
            type="text"
            placeholder="Enter code"
            className="sb-input !border-2 !border-gray-200 !rounded-xl !px-6 !py-3 bg-white"
          />
          <button className="sb-btn-black px-8">Apply</button>
        </div>
      </section>
    </div>
  );
};

export default Offers;
