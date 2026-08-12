// src/data/dummyData.js
export const menuCategories = [
  { id: 'all', label: 'All', emoji: '🍽️' },
  { id: 'beverages', label: 'Drinks', emoji: '☕' },
  { id: 'snacks', label: 'Food', emoji: '🥐' },
  { id: 'mains', label: 'Mains', emoji: '🍜' },
  { id: 'desserts', label: 'Sweets', emoji: '🍰' },
];

const baseProducts = [
  { name: 'Signature Cold Brew', price: 220, emoji: '🧋', isVeg: true },
  { name: 'Hazelnut Latte', price: 195, emoji: '☕', isVeg: true },
  { name: 'Mango Refresher', price: 170, emoji: '🥭', isVeg: true },
  { name: 'Matcha Oat Latte', price: 210, emoji: '🍵', isVeg: true },
  { name: 'Classic Cappuccino', price: 160, emoji: '☕', isVeg: true },
  { name: 'Butter Croissant', price: 120, emoji: '🥐', isVeg: true },
  { name: 'Avocado Toast', price: 210, emoji: '🥑', isVeg: true },
  { name: 'Cheese Sandwich', price: 180, emoji: '🥪', isVeg: true },
  { name: 'Peri Peri Wrap', price: 280, emoji: '🌯', isVeg: false },
  { name: 'Pasta Primavera', price: 320, emoji: '🍝', isVeg: true },
];

export const menuItems = Array.from({ length: 50 }, (_, i) => {
  const base = baseProducts[i % baseProducts.length];
  return {
    id: `m${i + 1}`,
    name: `${base.name} ${i > 9 ? `(v${Math.floor(i/10)})` : ''}`,
    category: i % 4 === 0 ? 'beverages' : (i % 4 === 1 ? 'snacks' : (i % 4 === 2 ? 'mains' : 'desserts')),
    price: base.price + (i * 2),
    rating: (4 + Math.random()).toFixed(1),
    description: `Delicious ${base.name} prepared fresh daily with high quality ingredients.`,
    emoji: base.emoji,
    isVeg: base.isVeg,
    popular: i % 5 === 0,
    points: Math.floor((base.price + (i * 2)) / 10),
    calories: Math.floor(150 + Math.random() * 300) + ' kcal',
  };
});

export const offers = [
  { id: 'o1', title: 'Happy Hours ☕', subtitle: '20% off all beverages', description: 'Every day 3PM – 5PM', gradient: 'from-sbGreen to-sbDark', tag: 'LIMITED TIME' },
  { id: 'o2', title: 'Double Points', subtitle: 'Earn 2x rewards today!', description: 'On all orders above ₹300', gradient: 'from-sbGold to-amber-700', tag: 'TODAY ONLY' },
  { id: 'o3', title: 'Weekend Brunch', subtitle: '₹50 off on mains', description: 'Every Sat & Sun, 9AM – 12PM', gradient: 'from-amber-600 to-orange-700', tag: 'WEEKEND' },
  { id: 'o4', title: 'Refer & Earn', subtitle: '+100 bonus points', description: 'For every friend you refer', gradient: 'from-rose-700 to-rose-900', tag: 'ONGOING' },
  { id: 'o5', title: 'First Visit Bonus', subtitle: 'Free Cookie', description: 'On your first order above ₹500', gradient: 'from-stone-600 to-stone-800', tag: 'NEW USER' },
];

export const dummyTransactions = [
  { id: 't1', date: '2025-04-24', bill: 'BILL#2045', amount: 520, pointsEarned: 52, pointsRedeemed: 0, description: 'Hazelnut Latte × 2 + Croissant' },
  { id: 't2', date: '2025-04-22', bill: 'BILL#2041', amount: 320, pointsEarned: 0, pointsRedeemed: 50, description: 'Review Bonus – Google Review' },
  { id: 't3', date: '2025-04-20', bill: 'BILL#2038', amount: 745, pointsEarned: 75, pointsRedeemed: 0, description: 'Pasta Primavera + Cold Brew + Brownie' },
];

export const walletStats = {
  lastVisitDate: '2025-04-24',
  totalVisits: 12,
  lifetimeTotalAmount: 8450,
  pointsEarned: 127,
  pointsRedeemed: 50,
};

export const TIER_THRESHOLDS = { silver: 0, gold: 500, platinum: 1500 };
export const TAX_RATE = 0.05;
