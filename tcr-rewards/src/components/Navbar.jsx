// src/components/Navbar.jsx
import { Link, NavLink } from 'react-router-dom';
import { MapPin, LogOut, User } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout, isLoggedIn } = useAuth();

  return (
    <nav className="glass-nav">
      <div className="max-w-[1440px] mx-auto px-6 md:px-12 h-20 md:h-24 flex items-center justify-between">

        {/* Left: Logo & Links */}
        <div className="flex items-center gap-8 md:gap-12">
          <Link to="/" className="flex items-center gap-3 transition-transform active:scale-95 group">
            <div className="w-12 h-12 md:w-14 md:h-14 rounded-full bg-white shadow-md flex items-center justify-center p-1 group-hover:rotate-6 transition-transform overflow-hidden">
              <img src="/logo.png" alt="The Chocolate Room" className="w-full h-full object-contain" />
            </div>
            <div className="flex flex-col leading-tight">
              <span className="font-black text-sbDark text-lg md:text-xl tracking-tight capitalize">The Chocolate Room</span>
              <span className="font-bold text-sbGreen text-[9px] md:text-[10px] uppercase tracking-widest">Salunke Vihar @ Rewards</span>
            </div>
          </Link>

          <div className="hidden md:flex items-center gap-10 uppercase font-black text-[10px] tracking-[0.2em]">
            <NavLink to="/menu" className={({ isActive }) => isActive ? 'text-sbGreen' : 'text-sbDark/60 hover:text-sbGreen transition-colors'}>Menu</NavLink>
            <NavLink to="/wallet" className={({ isActive }) => isActive ? 'text-sbGreen' : 'text-sbDark/60 hover:text-sbGreen transition-colors'}>Rewards</NavLink>
            <NavLink to="/review" className={({ isActive }) => isActive ? 'text-sbGreen' : 'text-sbDark/60 hover:text-sbGreen transition-colors'}>Review</NavLink>
            <NavLink to="/offers" className={({ isActive }) => isActive ? 'text-sbGreen' : 'text-sbDark/60 hover:text-sbGreen transition-colors'}>Offers</NavLink>
            <NavLink to="/cart" className={({ isActive }) => isActive ? 'text-sbGreen' : 'text-sbDark/60 hover:text-sbGreen transition-colors'}>Cart</NavLink>
          </div>
        </div>

        {/* Right: User Actions */}
        <div className="flex items-center gap-4 md:gap-8">
          <div className="hidden lg:flex items-center gap-2 font-bold text-[10px] uppercase tracking-widest text-sbDark/40 hover:text-sbGreen cursor-pointer transition-colors">
            <MapPin size={16} />
            <span>Find a store</span>
          </div>

          {isLoggedIn && user ? (
            <div className="flex items-center gap-4">
              <Link to="/profile" className="flex items-center gap-3 font-bold text-[10px] uppercase tracking-widest bg-sbLight px-5 py-2.5 rounded-xl hover:bg-sbGold hover:text-white transition-all shadow-sm">
                <User size={16} />
                <span>{user?.name?.split(' ')[0] || "User"}</span>
              </Link>
              <button onClick={logout} className="p-2 text-sbDark/20 hover:text-red-600 transition-colors">
                <LogOut size={20} />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-4">
              <Link to="/login" className="text-sbDark font-bold text-xs uppercase tracking-widest hover:text-sbGreen transition-colors">Sign in</Link>
              <Link to="/signup" className="sb-btn-black py-2.5 px-6 text-[10px] uppercase tracking-widest">Join now</Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
