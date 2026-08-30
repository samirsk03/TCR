// src/components/BottomNav.jsx
import { NavLink } from 'react-router-dom';
import { Home, Coffee,ShoppingBasket, Wallet, MessageSquare, Tag } from 'lucide-react';

const BottomNav = () => {
  const navItems = [
    { to: '/', icon: Home, label: 'Home' },
    { to: '/menu', icon: Coffee, label: 'Menu' },
    { to: '/wallet', icon: Wallet, label: 'Rewards' },
    { to: '/cart', icon: ShoppingBasket, label: 'Cart' },
    { to: '/review', icon: MessageSquare, label: 'Review' },
    { to: '/offers', icon: Tag, label: 'Offers' },
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-xl border-t border-gray-100 px-4 py-3 flex justify-around items-center z-50 shadow-[0_-10px_30px_-15px_rgba(44,24,16,0.2)]">
      {navItems.map(({ to, icon: Icon, label }) => (
        <NavLink
          key={to}
          to={to}
          className={({ isActive }) => `
            flex flex-col items-center gap-1.5 transition-all duration-300 relative
            ${isActive ? 'text-sbGreen scale-110' : 'text-sbDark/30 hover:text-sbDark'}
          `}
        >
          {({ isActive }) => (
            <>
              <Icon size={22} strokeWidth={isActive ? 2.5 : 2} />
              <span className={`text-[9px] font-black uppercase tracking-[0.15em] ${isActive ? 'opacity-100' : 'opacity-60'}`}>
                {label}
              </span>
              {isActive && (
                <div className="absolute -bottom-2 w-1 h-1 bg-sbGreen rounded-full shadow-[0_0_8px_rgba(107,39,55,0.8)]" />
              )}
            </>
          )}
        </NavLink>
      ))}
    </nav>
  );
};

export default BottomNav;
