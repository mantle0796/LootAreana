'use client';

import { Button } from '@/components/ui/button';
import { usePendingRewards } from '@/contexts/PendingRewardsContext';
import { useRewardTokens } from '@/hooks/useToken';
import { Coins, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';
import { useAccount } from 'wagmi';

export default function ClaimRewardsButton() {
  const { pendingRewards, resetRewards, getPendingRewards } = usePendingRewards();
  const { reward, isPending, isSuccess } = useRewardTokens();
  const { address } = useAccount();
  const [showButton, setShowButton] = useState(false);

  useEffect(() => {
    const rewards = getPendingRewards();
    setShowButton(rewards > 0);
  }, [pendingRewards, getPendingRewards]);

  // Reset rewards after successful claim
  useEffect(() => {
    if (isSuccess) {
      resetRewards();
      setShowButton(false);
    }
  }, [isSuccess, resetRewards]);

  if (!showButton) return null;

  const handleClaim = async () => {
    const amount = getPendingRewards();
    if (amount <= 0 || !address) return;

    await reward(address, amount);
  };

  return (
    <AnimatePresence>
      {showButton && (
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 50, scale: 0.9 }}
          transition={{ type: 'spring', damping: 20 }}
          className="fixed bottom-6 right-6 z-50"
        >
          <motion.div
            animate={{
              boxShadow: [
                '0 0 20px rgba(168, 85, 247, 0.4)',
                '0 0 40px rgba(236, 72, 153, 0.6)',
                '0 0 20px rgba(168, 85, 247, 0.4)',
              ],
            }}
            transition={{ duration: 2, repeat: Infinity }}
            className="rounded-full"
          >
            <Button
              onClick={handleClaim}
              disabled={isPending}
              size="lg"
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold shadow-2xl px-8 py-6 text-lg relative overflow-hidden group"
            >
              {/* Sparkle effect */}
              <motion.div
                className="absolute inset-0 opacity-0 group-hover:opacity-100"
                initial={false}
              >
                <Sparkles className="absolute top-2 right-2 w-4 h-4 text-yellow-300 animate-pulse" />
                <Sparkles className="absolute bottom-2 left-2 w-3 h-3 text-pink-300 animate-pulse" style={{ animationDelay: '0.5s' }} />
              </motion.div>

              {isPending ? (
                <>
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                    className="mr-2"
                  >
                    <Coins className="w-6 h-6" />
                  </motion.div>
                  Claiming...
                </>
              ) : (
                <>
                  <Coins className="w-6 h-6 mr-2 text-yellow-400" />
                  <div className="flex flex-col items-start">
                    <span className="text-xs text-purple-200">Claim Rewards</span>
                    <span className="text-xl font-extrabold text-yellow-400">
                      {pendingRewards} LTK
                    </span>
                  </div>
                </>
              )}
            </Button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
