'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useAccount } from 'wagmi';

interface PendingRewardsContextType {
  pendingRewards: number;
  addReward: (amount: number) => void;
  resetRewards: () => void;
  getPendingRewards: () => number;
}

const PendingRewardsContext = createContext<PendingRewardsContextType | undefined>(undefined);

export function PendingRewardsProvider({ children }: { children: ReactNode }) {
  const { address } = useAccount();
  const [pendingRewards, setPendingRewards] = useState(0);

  // Load pending rewards from localStorage when wallet connects
  useEffect(() => {
    if (address) {
      const stored = localStorage.getItem(`pendingRewards_${address}`);
      if (stored) {
        setPendingRewards(parseFloat(stored));
      }
    } else {
      setPendingRewards(0);
    }
  }, [address]);

  // Save pending rewards to localStorage whenever they change
  useEffect(() => {
    if (address) {
      localStorage.setItem(`pendingRewards_${address}`, pendingRewards.toString());
    }
  }, [pendingRewards, address]);

  const addReward = (amount: number) => {
    setPendingRewards((prev) => prev + amount);
  };

  const resetRewards = () => {
    setPendingRewards(0);
    if (address) {
      localStorage.removeItem(`pendingRewards_${address}`);
    }
  };

  const getPendingRewards = () => {
    return pendingRewards;
  };

  return (
    <PendingRewardsContext.Provider value={{ pendingRewards, addReward, resetRewards, getPendingRewards }}>
      {children}
    </PendingRewardsContext.Provider>
  );
}

export function usePendingRewards() {
  const context = useContext(PendingRewardsContext);
  if (context === undefined) {
    throw new Error('usePendingRewards must be used within a PendingRewardsProvider');
  }
  return context;
}
