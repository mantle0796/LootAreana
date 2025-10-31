'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';
import { Cherry, Coins, Trophy, ArrowLeft, Sparkles } from 'lucide-react';
import { useAccount } from 'wagmi';
import { useTokenBalance } from '@/hooks/useToken';
import { useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { TOKEN_CONTRACT_ADDRESS, TOKEN_ABI } from '@/contracts/tokenABI';
import { toast } from 'sonner';
import PurchaseLivesModal from '@/components/games/PurchaseLivesModal';
import { usePendingRewards } from '@/contexts/PendingRewardsContext';
import { useRewardTokens } from '@/hooks/useToken';
import Link from 'next/link';

const PRICE_PER_SPIN = 5; // 5 LTK per spin

const symbols = [
  { icon: '🍒', name: 'cherry', multiplier: 2 },
  { icon: '🍋', name: 'lemon', multiplier: 2 },
  { icon: '🍊', name: 'orange', multiplier: 3 },
  { icon: '🍇', name: 'grape', multiplier: 4 },
  { icon: '💎', name: 'diamond', multiplier: 10 },
  { icon: '7️⃣', name: 'seven', multiplier: 20 },
];

export default function SlotsPage() {
  const { address, isConnected } = useAccount();
  const { balance, refetch: refetchBalance } = useTokenBalance();
  const { addReward, pendingRewards, resetRewards } = usePendingRewards();
  const { reward, isPending: isClaimPending, isSuccess: isClaimSuccess } = useRewardTokens();
  
  const [showPurchaseModal, setShowPurchaseModal] = useState(false);
  const [remainingSpins, setRemainingSpins] = useState(0);
  const [isSpinning, setIsSpinning] = useState(false);
  const [reels, setReels] = useState([0, 1, 2]);
  const [lastResult, setLastResult] = useState<{ won: boolean; reward: number } | null>(null);
  const [gameHistory, setGameHistory] = useState<{ won: boolean; reward: number }[]>([]);

  const { writeContract, data: hash, isPending: isPaymentPending } = useWriteContract();

  const { isSuccess: isPaymentSuccess } = useWaitForTransactionReceipt({
    hash,
  });

  useEffect(() => {
    if (isPaymentSuccess && hash) {
      toast.success('Payment confirmed! You can now spin the slots.', { id: 'slots-payment' });
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
      toast.loading(`Paying ${totalCost} LTK for ${lives} spins...`, { id: 'slots-payment' });

      const amountInWei = BigInt(Math.floor(totalCost * 1e18));
      await writeContract({
        address: TOKEN_CONTRACT_ADDRESS,
        abi: TOKEN_ABI,
        functionName: 'transfer',
        args: [TOKEN_CONTRACT_ADDRESS, amountInWei],
      });

      toast.loading('Transaction submitted, waiting for confirmation...', { id: 'slots-payment' });
      
      setRemainingSpins(lives);
      refetchBalance();
    } catch (error) {
      console.error('Payment failed:', error);
      toast.error('Payment failed. Please try again.', { id: 'slots-payment' });
    }
  };

  const spin = async () => {
    if (remainingSpins <= 0) {
      toast.error('No spins remaining. Please purchase more spins.');
      setShowPurchaseModal(true);
      return;
    }

    setIsSpinning(true);
    setLastResult(null);

    // Animate reels spinning
    let spinCount = 0;
    const spinInterval = setInterval(() => {
      setReels([
        Math.floor(Math.random() * symbols.length),
        Math.floor(Math.random() * symbols.length),
        Math.floor(Math.random() * symbols.length),
      ]);
      spinCount++;
      if (spinCount > 15) {
        clearInterval(spinInterval);
        finishSpin();
      }
    }, 100);
  };

  const finishSpin = () => {
    const finalReels = [
      Math.floor(Math.random() * symbols.length),
      Math.floor(Math.random() * symbols.length),
      Math.floor(Math.random() * symbols.length),
    ];
    setReels(finalReels);

    // Check for wins
    let reward = 0;
    let won = false;

    // All three match - JACKPOT
    if (finalReels[0] === finalReels[1] && finalReels[1] === finalReels[2]) {
      won = true;
      reward = PRICE_PER_SPIN * symbols[finalReels[0]].multiplier;
    }
    // Two match
    else if (finalReels[0] === finalReels[1] || finalReels[1] === finalReels[2] || finalReels[0] === finalReels[2]) {
      won = true;
      const matchedSymbol = finalReels[0] === finalReels[1] ? finalReels[0] : finalReels[1];
      reward = PRICE_PER_SPIN * (symbols[matchedSymbol].multiplier * 0.5);
    }

    const result = { won, reward };
    setLastResult(result);
    setGameHistory([result, ...gameHistory]);
    setRemainingSpins(remainingSpins - 1);
    setIsSpinning(false);

    if (won) {
      addReward(reward);
      toast.success(`🎉 You won ${reward.toFixed(0)} LTK! (Pending rewards: ${pendingRewards + reward} LTK)`, {
        duration: 5000,
      });
    } else {
      toast.error(`No match. Try again!`);
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
            🎰 Slots
          </h1>
          <p className="text-gray-400 text-lg">
            Match symbols to win big! 3 of a kind = JACKPOT!
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-purple-500/10 border border-purple-500/30 rounded-lg p-4 text-center">
            <div className="text-gray-400 text-sm mb-1">Cost per Spin</div>
            <div className="flex items-center justify-center gap-2">
              <Coins className="w-5 h-5 text-yellow-400" />
              <span className="text-2xl font-bold text-white">{PRICE_PER_SPIN} LTK</span>
            </div>
          </div>

          <div className="bg-purple-500/10 border border-purple-500/30 rounded-lg p-4 text-center">
            <div className="text-gray-400 text-sm mb-1">Remaining Spins</div>
            <div className="text-2xl font-bold text-purple-400">{remainingSpins}</div>
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
            <div className="flex gap-4 mb-8">
              {reels.map((reelIndex, idx) => (
                <motion.div
                  key={idx}
                  animate={isSpinning ? { y: [0, -20, 0] } : { y: 0 }}
                  transition={{ duration: 0.2, delay: idx * 0.1 }}
                  className="w-24 h-24 bg-gradient-to-br from-purple-600 to-pink-600 rounded-xl flex items-center justify-center text-6xl shadow-2xl border-2 border-purple-400"
                >
                  {symbols[reelIndex].icon}
                </motion.div>
              ))}
            </div>

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
                    You Won {lastResult.reward.toFixed(0)} LTK!
                  </div>
                ) : (
                  `No match!`
                )}
              </motion.div>
            )}

            {!isConnected ? (
              <p className="text-gray-400 text-lg">Connect your wallet to play</p>
            ) : remainingSpins <= 0 ? (
              <Button
                onClick={() => setShowPurchaseModal(true)}
                size="lg"
                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold text-xl px-12 py-6"
              >
                <Coins className="w-6 h-6 mr-2" />
                Purchase Spins
              </Button>
            ) : (
              <Button
                onClick={spin}
                disabled={isSpinning}
                size="lg"
                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold text-xl px-12 py-6"
              >
                {isSpinning ? 'Spinning...' : '🎰 SPIN'}
              </Button>
            )}
          </div>
        </div>

        {/* Paytable */}
        <div className="bg-purple-500/10 border border-purple-500/30 rounded-lg p-6 mb-8">
          <h3 className="text-xl font-bold text-white mb-4 text-center">💰 Paytable</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {symbols.map((symbol, idx) => (
              <div key={idx} className="bg-black/30 rounded-lg p-3 text-center">
                <div className="text-3xl mb-2">{symbol.icon}</div>
                <div className="text-sm text-gray-400">3x = {symbol.multiplier}x</div>
                <div className="text-xs text-gray-500">2x = {symbol.multiplier * 0.5}x</div>
              </div>
            ))}
          </div>
        </div>

        {gameHistory.length > 0 && (
          <div className="bg-purple-500/10 border border-purple-500/30 rounded-lg p-6">
            <h3 className="text-xl font-bold text-white mb-4">Recent Spins</h3>
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
                  <Trophy className={`w-8 h-8 ${result.won ? 'text-green-400' : 'text-red-400'}`} />
                  <span className="text-xs text-gray-400">
                    {result.won ? `+${result.reward.toFixed(0)}` : '-'}
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
        pricePerLife={PRICE_PER_SPIN}
        gameName="Slots"
        minLives={1}
        maxLives={20}
        isPending={isPaymentPending}
      />
    </div>
  );
}
