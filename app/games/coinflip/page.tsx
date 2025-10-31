'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, Coins, ArrowLeft, Sparkles } from 'lucide-react';
import { useAccount } from 'wagmi';
import { useTokenBalance } from '@/hooks/useToken';
import { useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { TOKEN_CONTRACT_ADDRESS, TOKEN_ABI } from '@/contracts/tokenABI';
import { toast } from 'sonner';
import PurchaseLivesModal from '@/components/games/PurchaseLivesModal';
import { usePendingRewards } from '@/contexts/PendingRewardsContext';
import { useRewardTokens } from '@/hooks/useToken';
import Link from 'next/link';

const PRICE_PER_FLIP = 3; // 3 LTK per flip
const WIN_MULTIPLIER = 2; // 2x payout on win

export default function CoinFlipPage() {
  const { address, isConnected } = useAccount();
  const { balance, refetch: refetchBalance } = useTokenBalance();
  const { addReward, pendingRewards, resetRewards } = usePendingRewards();
  const { reward, isPending: isClaimPending, isSuccess: isClaimSuccess } = useRewardTokens();
  
  const [showPurchaseModal, setShowPurchaseModal] = useState(false);
  const [remainingFlips, setRemainingFlips] = useState(0);
  const [isFlipping, setIsFlipping] = useState(false);
  const [currentSide, setCurrentSide] = useState<'heads' | 'tails'>('heads');
  const [selectedSide, setSelectedSide] = useState<'heads' | 'tails' | null>(null);
  const [lastResult, setLastResult] = useState<{ side: 'heads' | 'tails'; won: boolean } | null>(null);
  const [gameHistory, setGameHistory] = useState<{ side: 'heads' | 'tails'; won: boolean }[]>([]);

  const { writeContract, data: hash, isPending: isPaymentPending } = useWriteContract();

  const { isSuccess: isPaymentSuccess } = useWaitForTransactionReceipt({
    hash,
  });

  useEffect(() => {
    if (isPaymentSuccess && hash) {
      toast.success('Payment confirmed! You can now flip the coin.', { id: 'coinflip-payment' });
      setShowPurchaseModal(false);
    }
  }, [isPaymentSuccess, hash]);

  useEffect(() => {
    if (isClaimSuccess) {
      resetRewards();
      refetchBalance();
    }
  }, [isClaimSuccess, resetRewards, refetchBalance]);

  const handleClaimRewards = async () => {
    if (!address || pendingRewards <= 0) return;
    await reward(address, pendingRewards);
  };

  const handlePurchaseLives = async (lives: number, totalCost: number) => {
    if (!address) {
      toast.error('Please connect your wallet');
      return;
    }

    if (balance < totalCost) {
      toast.error(`Insufficient balance. You need ${totalCost} LTK.`);
      return;
    }

    try {
      toast.loading(`Paying ${totalCost} LTK for ${lives} flips...`, { id: 'coinflip-payment' });

      const amountInWei = BigInt(Math.floor(totalCost * 1e18));
      await writeContract({
        address: TOKEN_CONTRACT_ADDRESS,
        abi: TOKEN_ABI,
        functionName: 'transfer',
        args: [TOKEN_CONTRACT_ADDRESS, amountInWei],
      });

      toast.loading('Transaction submitted, waiting for confirmation...', { id: 'coinflip-payment' });
      
      setRemainingFlips(lives);
      refetchBalance();
    } catch (error) {
      console.error('Payment failed:', error);
      toast.error('Payment failed. Please try again.', { id: 'coinflip-payment' });
    }
  };

  const flipCoin = async (choice: 'heads' | 'tails') => {
    if (remainingFlips <= 0) {
      toast.error('No flips remaining. Please purchase more flips.');
      setShowPurchaseModal(true);
      return;
    }

    setSelectedSide(choice);
    setIsFlipping(true);
    setLastResult(null);

    // Animate coin flipping
    let flipCount = 0;
    const flipInterval = setInterval(() => {
      setCurrentSide(flipCount % 2 === 0 ? 'heads' : 'tails');
      flipCount++;
      if (flipCount > 10) {
        clearInterval(flipInterval);
        finishFlip(choice);
      }
    }, 100);
  };

  const finishFlip = (choice: 'heads' | 'tails') => {
    const finalSide: 'heads' | 'tails' = Math.random() < 0.5 ? 'heads' : 'tails';
    setCurrentSide(finalSide);
    
    const won = finalSide === choice;
    const result = { side: finalSide, won };
    
    setLastResult(result);
    setGameHistory([result, ...gameHistory]);
    setRemainingFlips(remainingFlips - 1);
    setIsFlipping(false);
    setSelectedSide(null);

    if (won) {
      const reward = PRICE_PER_FLIP * WIN_MULTIPLIER;
      addReward(reward);
      toast.success(`🎉 You won ${reward} LTK! (Pending rewards: ${pendingRewards + reward} LTK)`, {
        duration: 5000,
      });
    } else {
      toast.error(`Sorry, it was ${finalSide}. Try again!`);
    }
  };

  return (
    <div className="min-h-screen py-20 px-4">
      <div className="max-w-4xl mx-auto">
        <Link href="/games" className="inline-flex items-center text-purple-400 hover:text-purple-300 mb-8">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Games
        </Link>

        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            🪙 Coin Flip
          </h1>
          <p className="text-gray-400 text-lg">
            Choose heads or tails and win {WIN_MULTIPLIER}x your bet!
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-purple-500/10 border border-purple-500/30 rounded-lg p-4 text-center">
            <div className="text-gray-400 text-sm mb-1">Cost per Flip</div>
            <div className="flex items-center justify-center gap-2">
              <Coins className="w-5 h-5 text-yellow-400" />
              <span className="text-2xl font-bold text-white">{PRICE_PER_FLIP} LTK</span>
            </div>
          </div>

          <div className="bg-purple-500/10 border border-purple-500/30 rounded-lg p-4 text-center">
            <div className="text-gray-400 text-sm mb-1">Remaining Flips</div>
            <div className="text-2xl font-bold text-purple-400">{remainingFlips}</div>
          </div>

          <div className="bg-purple-500/10 border border-purple-500/30 rounded-lg p-4 text-center">
            <div className="text-gray-400 text-sm mb-1">Your Balance</div>
            <div className="flex items-center justify-center gap-2">
              <Coins className="w-5 h-5 text-yellow-400" />
              <span className="text-2xl font-bold text-white">{balance.toFixed(2)} LTK</span>
            </div>
          </div>
        </div>

        {/* Pending Rewards Display */}
        {pendingRewards > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8 bg-gradient-to-r from-green-500/20 to-emerald-500/20 border border-green-500/50 rounded-lg p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Trophy className="w-6 h-6 text-green-400" />
                  <span className="text-white font-bold text-xl">Pending Rewards</span>
                </div>
                <div className="text-3xl font-bold text-green-400">{pendingRewards} LTK</div>
              </div>
              <Button
                onClick={handleClaimRewards}
                disabled={isClaimPending}
                size="lg"
                className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-bold px-8 py-6"
              >
                {isClaimPending ? (
                  <>
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                      className="mr-2"
                    >
                      <Coins className="w-5 h-5" />
                    </motion.div>
                    Claiming...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5 mr-2" />
                    Claim {pendingRewards} LTK
                  </>
                )}
              </Button>
            </div>
          </motion.div>
        )}

        <div className="bg-black/50 border border-purple-500/30 rounded-2xl p-12 mb-8">
          <div className="flex flex-col items-center justify-center">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentSide}
                initial={{ rotateY: 0 }}
                animate={isFlipping ? { rotateY: 360 } : { rotateY: 0 }}
                transition={{ duration: 0.2 }}
                className="mb-8"
              >
                <div className={`w-32 h-32 rounded-full flex items-center justify-center text-6xl font-bold ${
                  currentSide === 'heads' 
                    ? 'bg-gradient-to-br from-yellow-500 to-orange-500' 
                    : 'bg-gradient-to-br from-gray-500 to-gray-700'
                } text-white shadow-2xl`}>
                  {currentSide === 'heads' ? '👑' : 'T'}
                </div>
              </motion.div>
            </AnimatePresence>

            {lastResult && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className={`text-2xl font-bold mb-4 ${
                  lastResult.won ? 'text-green-400' : 'text-red-400'
                }`}
              >
                {lastResult.won ? (
                  <div className="flex items-center gap-2">
                    <Trophy className="w-8 h-8" />
                    You Won {PRICE_PER_FLIP * WIN_MULTIPLIER} LTK!
                  </div>
                ) : (
                  `It was ${lastResult.side}!`
                )}
              </motion.div>
            )}

            {!isConnected ? (
              <p className="text-gray-400 text-lg">Connect your wallet to play</p>
            ) : remainingFlips <= 0 ? (
              <Button
                onClick={() => setShowPurchaseModal(true)}
                size="lg"
                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold text-xl px-12 py-6"
              >
                <Coins className="w-6 h-6 mr-2" />
                Purchase Flips
              </Button>
            ) : (
              <div className="flex gap-4">
                <Button
                  onClick={() => flipCoin('heads')}
                  disabled={isFlipping}
                  size="lg"
                  className="bg-gradient-to-r from-yellow-600 to-orange-600 hover:from-yellow-700 hover:to-orange-700 text-white font-bold text-xl px-12 py-6"
                >
                  👑 Heads
                </Button>
                <Button
                  onClick={() => flipCoin('tails')}
                  disabled={isFlipping}
                  size="lg"
                  className="bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 text-white font-bold text-xl px-12 py-6"
                >
                  Tails
                </Button>
              </div>
            )}
          </div>
        </div>

        {gameHistory.length > 0 && (
          <div className="bg-purple-500/10 border border-purple-500/30 rounded-lg p-6">
            <h3 className="text-xl font-bold text-white mb-4">Recent Flips</h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-3">
              {gameHistory.slice(0, 12).map((result, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className={`p-3 rounded-lg border ${
                    result.won
                      ? 'bg-green-500/20 border-green-500/50'
                      : 'bg-red-500/20 border-red-500/50'
                  } flex flex-col items-center gap-2`}
                >
                  <div className={`text-3xl ${result.won ? 'text-green-400' : 'text-red-400'}`}>
                    {result.side === 'heads' ? '👑' : 'T'}
                  </div>
                  <span className="text-xs text-gray-400">
                    {result.won ? `+${PRICE_PER_FLIP * WIN_MULTIPLIER}` : '-'}
                  </span>
                </motion.div>
              ))}
            </div>
          </div>
        )}
      </div>

      <PurchaseLivesModal
        isOpen={showPurchaseModal}
        onClose={() => setShowPurchaseModal(false)}
        onPurchase={handlePurchaseLives}
        pricePerLife={PRICE_PER_FLIP}
        gameName="Coin Flip"
        minLives={1}
        maxLives={20}
        isPending={isPaymentPending}
      />
    </div>
  );
}
