// src/context/RewardsContext.jsx
import { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { dummyTransactions, TIER_THRESHOLDS } from '../data/dummyData';

const RewardsContext = createContext(null);

export const RewardsProvider = ({ children }) => {
  const [points, setPoints] = useState(() => {
    try {
      const saved = localStorage.getItem('tcr_points');
      return saved ? parseInt(saved, 10) : 250;
    } catch {
      return 250;
    }
  });

  const [transactions, setTransactions] = useState(() => {
    try {
      const saved = localStorage.getItem('tcr_transactions');
      return saved ? JSON.parse(saved) : dummyTransactions;
    } catch {
      return dummyTransactions;
    }
  });

  useEffect(() => {
    localStorage.setItem('tcr_points', points.toString());
    localStorage.setItem('tcr_transactions', JSON.stringify(transactions));
  }, [points, transactions]);

  const addPoints = useCallback((amount, description) => {
    setPoints((prev) => prev + amount);
    const newTransaction = {
      id: `t_${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
      bill: `BILL#${Math.floor(Math.random() * 9000) + 1000}`,
      amount: 0,
      pointsEarned: amount,
      pointsRedeemed: 0,
      description,
    };
    setTransactions((prev) => [newTransaction, ...prev]);
  }, []);

  const redeemPoints = useCallback((amount, description) => {
    if (points >= amount) {
      setPoints((prev) => prev - amount);
      const newTransaction = {
        id: `t_${Date.now()}`,
        date: new Date().toISOString().split('T')[0],
        bill: `BILL#${Math.floor(Math.random() * 9000) + 1000}`,
        amount: 0,
        pointsEarned: 0,
        pointsRedeemed: amount,
        description,
      };
      setTransactions((prev) => [newTransaction, ...prev]);
      return true;
    }
    return false;
  }, [points]);

  const addTransaction = useCallback((transaction) => {
    setTransactions((prev) => [transaction, ...prev]);
    if (transaction.pointsEarned) {
      setPoints((prev) => prev + transaction.pointsEarned);
    }
    if (transaction.pointsRedeemed) {
      setPoints((prev) => prev - transaction.pointsRedeemed);
    }
  }, []);

  const getTier = useCallback((currentPoints) => {
    if (currentPoints >= TIER_THRESHOLDS.platinum) return 'Platinum';
    if (currentPoints >= TIER_THRESHOLDS.gold) return 'Gold';
    return 'Silver';
  }, []);

  const currentTier = getTier(points);

  return (
    <RewardsContext.Provider
      value={{
        points,
        transactions,
        addPoints,
        redeemPoints,
        addTransaction,
        currentTier,
        getTier,
      }}
    >
      {children}
    </RewardsContext.Provider>
  );
};

export const useRewards = () => {
  const ctx = useContext(RewardsContext);
  if (!ctx) throw new Error('useRewards must be used within RewardsProvider');
  return ctx;
};
