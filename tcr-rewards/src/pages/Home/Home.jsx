// src/pages/Home/Home.jsx
import { useAuth } from '../../context/AuthContext';
import { useRewards } from '../../context/RewardsContext';
import { Link } from 'react-router-dom';
import { Star, ChevronRight, Coffee, Tag, ArrowRight } from 'lucide-react';
import { offers, menuCategories } from '../../data/dummyData';

const Home = () => {
   const { user, isLoggedIn } = useAuth();
   const { points, currentTier } = useRewards();



   

   return (
      <div className="animate-fade-in flex flex-col bg-sbCream pb-24 md:pb-0">

         {/* Dynamic Greeting & Rewards Card */}
         <section className="bg-sbDark text-sbCream pt-16 pb-24 px-6 md:px-12 relative overflow-hidden">
            <div className="max-w-[1440px] mx-auto relative z-10 flex flex-col md:flex-row justify-between items-center gap-16">
               <div className="text-center md:text-left">
                  <h1 className="text-4xl md:text-7xl font-black mb-6 leading-[1.1] tracking-tighter">
                     {isLoggedIn ? `Welcome back, \n${user.name.split(' ')[0]}! ✨` : 'Crafting Moments, \nOne Cup at a Time.'}
                  </h1> 
                  
                  <p className="text-lg md:text-xl opacity-70 mb-10 max-w-xl font-medium leading-relaxed">
                     Experience the art of handcrafted coffee. Earn exclusive stars and unlock premium rewards with every sip.
                  </p>
                  {!isLoggedIn && (
                     <Link to="/signup" className="sb-btn-primary py-5 px-12 text-lg shadow-2xl">Join The Chocolate Room® Rewards</Link>
                  )}
               </div>

               {isLoggedIn && (
                  <div className="bg-white/10 backdrop-blur-xl p-10 rounded-[3rem] border border-white/20 w-full max-w-md text-center transform hover:scale-[1.02] transition-all shadow-3xl">
                     <div className="flex justify-center mb-8">
                        <div className="bg-sbGreen p-5 rounded-3xl text-white shadow-2xl relative">
                           <Star size={40} fill="currentColor" />
                           <div className="absolute -top-3 -right-3 bg-sbGold text-[10px] px-3 py-1 rounded-full font-black shadow-lg">{currentTier}</div>
                        </div>
                     </div>
                     <p className="text-[10px] font-black uppercase tracking-[0.4em] opacity-40 mb-3">Star Balance</p>
                     <h2 className="text-7xl font-black mb-10 tracking-tighter text-white">{points} <span className="text-2xl opacity-40 font-bold">Stars</span></h2>
                     <Link to="/wallet" className="inline-flex items-center gap-3 bg-white text-sbDark font-black px-10 py-4 rounded-2xl hover:bg-sbLight transition-all shadow-lg text-sm uppercase tracking-widest">
                        View Wallet <ArrowRight size={18} />
                     </Link>
                  </div>
               )}
            </div>

            {/* Abstract shapes for a unique look */}
            <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-sbGreen/20 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2"></div>
            <div className="absolute bottom-0 left-0 w-80 h-80 bg-sbGold/10 rounded-full blur-[100px] translate-y-1/2 -translate-x-1/2"></div>
         </section>

         {/* Handcrafted Curations */}
         <section className="py-20 px-6 md:px-12 max-w-[1440px] mx-auto w-full -mt-16 relative z-20">
            <div className="bg-white/70 backdrop-blur-md rounded-[3rem] shadow-2xl p-10 md:p-16 border border-white/50">
               <h2 className="text-2xl font-black text-sbDark mb-12 flex items-center justify-between tracking-tight">
                  <span>Handcrafted <span className="text-sbGreen">Curations</span></span>
                  <Link to="/menu" className="text-sbGold text-[10px] font-black uppercase tracking-[0.2em] hover:text-sbGreen transition-colors border-b-2 border-sbGold/20 pb-1">Full Menu</Link>
               </h2>
               <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-10">
                  {menuCategories.map((cat) => (
                     <Link key={cat.id} to="/menu" className="flex flex-col items-center gap-6 group">
                        <div className="w-20 h-20 md:w-28 md:h-28 rounded-[2rem] bg-sbCream flex items-center justify-center text-4xl md:text-5xl group-hover:scale-110 group-hover:bg-sbLight transition-all shadow-sm group-hover:shadow-xl group-hover:-rotate-3">
                           {cat.emoji}
                        </div>
                        <span className="text-xs font-black text-sbDark/40 uppercase tracking-[0.2em] group-hover:text-sbGreen transition-colors">{cat.label}</span>
                     </Link>
                  ))}
               </div>
            </div>
         </section>

         {/* Latest Offers */}
         <section className="py-20 px-6 md:px-12 max-w-[1440px] mx-auto w-full">
            <div className="flex items-center justify-between mb-12">
               <h2 className="text-3xl font-black text-sbDark tracking-tighter">Exclusive <span className="text-sbGreen">Offers</span></h2>
               <Link to="/offers" className="text-sbDark/40 hover:text-sbGreen font-black text-xs uppercase tracking-widest transition-all flex items-center gap-2">
                  View all <ChevronRight size={18} />
               </Link>
            </div>
            <div className="flex gap-10 overflow-x-auto pb-12 hide-scrollbar snap-x">
               {offers.map((offer) => (
                  <div key={offer.id} className={`min-w-[340px] md:min-w-[500px] rounded-[3.5rem] bg-gradient-to-br ${offer.gradient} p-12 text-white flex flex-col justify-between snap-center shadow-3xl hover:shadow-sbGreen/20 transition-all group relative overflow-hidden`}>
                     <div className="relative z-10">
                        <span className="bg-white/20 backdrop-blur-md px-5 py-2 rounded-xl text-[10px] font-black tracking-[0.2em] uppercase mb-8 inline-block shadow-sm">
                           {offer.tag}
                        </span>
                        <h3 className="text-4xl md:text-5xl font-black mb-4 group-hover:translate-x-3 transition-transform duration-500 tracking-tighter leading-none">{offer.title}</h3>
                        <p className="text-xl opacity-80 font-bold">{offer.subtitle}</p>
                     </div>
                     <div className="flex justify-between items-end mt-12 relative z-10">
                        <p className="text-sm opacity-60 max-w-[220px] font-medium leading-relaxed">{offer.description}</p>
                        <button className="bg-white text-sbDark font-black px-8 py-3 rounded-2xl text-xs uppercase tracking-widest shadow-xl hover:scale-105 transition-all">Claim Now</button>
                     </div>
                     {/* Background decoration */}
                     <div className="absolute top-0 right-0 w-40 h-40 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl"></div>
                  </div>
               ))}
            </div>
         </section>

         {/* Why Join Us? */}
         <section className="bg-sbDark text-sbCream py-24 px-6 md:px-12 rounded-[4rem] mx-6 md:mx-12 mb-20 shadow-3xl">
            <div className="max-w-5xl mx-auto text-center">
               <h2 className="text-4xl md:text-6xl font-black mb-8 tracking-tighter">Why join <span className="text-sbGold">The Chocolate Room?</span></h2>
               <p className="text-sbCream/60 text-lg mb-20 max-w-2xl mx-auto font-medium">We believe every cup should be a celebration. Our rewards program is designed to bring you closer to the flavors you love.</p>

               <div className="grid grid-cols-1 md:grid-cols-3 gap-16">
                  <div className="flex flex-col items-center group">
                     <div className="w-20 h-20 bg-white/5 rounded-3xl flex items-center justify-center text-sbGold shadow-xl mb-8 group-hover:bg-sbGold group-hover:text-white transition-all transform group-hover:-rotate-6">
                        <Tag size={36} />
                     </div>
                     <h4 className="font-black text-xl mb-4 tracking-tight">Member Deals</h4>
                     <p className="text-sm text-sbCream/40 font-medium">Early access to new drops and seasonal favorites.</p>
                  </div>
                  <div className="flex flex-col items-center group">
                     <div className="w-20 h-20 bg-white/5 rounded-3xl flex items-center justify-center text-sbGold shadow-xl mb-8 group-hover:bg-sbGold group-hover:text-white transition-all transform group-hover:rotate-6">
                        <Coffee size={36} />
                     </div>
                     <h4 className="font-black text-xl mb-4 tracking-tight">Free Refills</h4>
                     <p className="text-sm text-sbCream/40 font-medium">Your second cup is always on the house while you're here.</p>
                  </div>
                  <div className="flex flex-col items-center group">
                     <div className="w-20 h-20 bg-white/5 rounded-3xl flex items-center justify-center text-sbGold shadow-xl mb-8 group-hover:bg-sbGold group-hover:text-white transition-all transform group-hover:-rotate-3">
                        <Star size={36} />
                     </div>
                     <h4 className="font-black text-xl mb-4 tracking-tight">Birthday Magic</h4>
                     <p className="text-sm text-sbCream/40 font-medium">A special treat to celebrate your journey with us.</p>
                  </div>
               </div>
            </div>
         </section>

         {/* Footer */}
         <footer className="py-20 px-6 text-center">
            <div className="max-w-[1440px] mx-auto">
               <div className="flex items-center justify-center gap-4 mb-10">
                  <div className="w-10 h-10 rounded-full bg-white shadow-md flex items-center justify-center p-1 overflow-hidden">
                     <img src="/logo.png" alt="The Chocolate Room" className="w-full h-full object-contain" />
                  </div>
                  <span className="font-black text-sbDark text-xl tracking-tighter">The Chocolate Room <span className="text-sbGreen">Salunke Vihar @</span></span>
               </div>
               <p className="text-[10px] font-black text-sbDark/20 uppercase tracking-[0.4em]">
                  Handcrafted with love • Since 2024 • All Rights Reserved
               </p>
            </div>
         </footer>

      </div>
   );
};

export default Home;
