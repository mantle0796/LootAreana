'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';
import { Dice1, Dice2, Dice3, Dice4, Dice5, Dice6, Trophy, Coins, ArrowLeft } from 'lucide-react';
import { useAccount } from 'wagmi';
import { useTokenBalance } from '@/hooks/useToken';
import { useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { TOKEN_CONTRACT_ADDRESS, TOKEN_ABI } from '@/contracts/tokenABI';
import { toast } from 'sonner';
import PurchaseLivesModal from '@/components/games/PurchaseLivesModal';
import { usePendingRewards } from '@/contexts/PendingRewardsContext';
import Link from 'next/link';

const PRICE_PER_ROLL = 2; // 2 LTK per roll
const WIN_MULTIPLIER = 2; // 2x payout on win
const WINNING_NUMBERS = [1, 6]; // Win on 1 or 6

const diceIcons = [Dice1, Dice2, Dice3, Dice4, Dice5, Dice6];

export default function DiceRollPage() {
  const { address, isConnected } = useAccount();
  const { balance, refetch: refetchBalance } = useTokenBalance();
  const { addReward, pendingRewards } = usePendingRewards();
  
  const [showPurchaseModal, setShowPurchaseModal] = useState(false);
  const [remainingRolls, setRemainingRolls] = useState(0);
  const [currentDice, setCurrentDice] = useState(1);
  const [isRolling, setIsRolling] = useState(false);
  const [lastResult, setLastResult] = useState<{ number: number; won: boolean } | null>(null);
  const [gameHistory, setGameHistory] = useState<{ number: number; won: boolean }[]>([]);

  const { writeContract, data: hash, isPending: isPaymentPending } = useWriteContract();

  const { isSuccess: isPaymentSuccess } = useWaitForTransactionReceipt({
    hash,
  });

  // Handle successful payment
  useEffect(() => {
    if (isPaymentSuccess && hash) {
      toast.success('Payment confirmed! You can now roll the dice.', { id: 'dice-payment' });
      setShowPurchaseModal(false);
    }
  }, [isPaymentSuccess, hash]);

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
      toast.loading(`Paying ${totalCost} LTK for ${lives} rolls...`, { id: 'dice-payment' });

      // Transfer tokens to contract (burn mechanism)
      const amountInWei = BigInt(Math.floor(totalCost * 1e18));
      await writeContract({
        address: TOKEN_CONTRACT_ADDRESS,
        abi: TOKEN_ABI,
        functionName: 'transfer',
        args: [TOKEN_CONTRACT_ADDRESS, amountInWei],
      });

      toast.loading('Transaction submitted, waiting for confirmation...', { id: 'dice-payment' });
      
      setRemainingRolls(lives);
      refetchBalance();
    } catch (error) {
      console.error('Payment failed:', error);
      toast.error('Payment failed. Please try again.', { id: 'dice-payment' });
    }
  };

  const rollDice = async () => {
    if (remainingRolls <= 0) {
      toast.error('No rolls remaining. Please purchase more rolls.');
      setShowPurchaseModal(true);
      return;
    }

    setIsRolling(true);
    setLastResult(null);

    // Animate dice rolling
    let rollCount = 0;
    const rollInterval = setInterval(() => {
      setCurrentDice(Math.floor(Math.random() * 6) + 1);
      rollCount++;
      if (rollCount > 15) {
        clearInterval(rollInterval);
        finishRoll();
      }
    }, 100);
  };

  const finishRoll = () => {
    const finalNumber = Math.floor(Math.random() * 6) + 1;
    setCurrentDice(finalNumber);
    
    const won = WINNING_NUMBERS.includes(finalNumber);
    const result = { number: finalNumber, won };
    
    setLastResult(result);
    setGameHistory([result, ...gameHistory]);
    setRemainingRolls(remainingRolls - 1);
    setIsRolling(false);

    if (won) {
      const reward = PRICE_PER_ROLL * WIN_MULTIPLIER;
      addReward(reward);
      toast.success(`🎉 You won ${reward} LTK! (Pending rewards: ${pendingRewards + reward} LTK)`, {
        duration: 5000,
      });
    } else {
      toast.error(`Sorry, you rolled ${finalNumber}. Try again!`);
    }
  };

  const DiceIcon = diceIcons[currentDice - 1];

  return (
    <div className="min-h-screen py-20 px-4">
      <div className="max-w-4xl mx-auto">
        <Link href="/games" className="inline-flex items-center text-purple-400 hover:text-purple-300 mb-8">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Games
        </Link>

        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            🎲 Dice Roll
          </h1>
          <p className="text-gray-400 text-lg">
            Roll a <span className="text-purple-400 font-bold">1</span> or{' '}
            <span className="text-purple-400 font-bold">6</span> to win {WIN_MULTIPLIER}x your bet!
          </p>
        </div>

        {/* Game Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-purple-500/10 border border-purple-500/30 rounded-lg p-4 text-center">
            <div className="text-gray-400 text-sm mb-1">Cost per Roll</div>
            <div className="flex items-center justify-center gap-2">
              <Coins className="w-5 h-5 text-yellow-400" />
              <span className="text-2xl font-bold text-white">{PRICE_PER_ROLL} LTK</span>
            </div>
          </div>

          <div className="bg-purple-500/10 border border-purple-500/30 rounded-lg p-4 text-center">
            <div className="text-gray-400 text-sm mb-1">Remaining Rolls</div>
            <div className="text-2xl font-bold text-purple-400">{remainingRolls}</div>
          </div>

          <div className="bg-purple-500/10 border border-purple-500/30 rounded-lg p-4 text-center">
            <div className="text-gray-400 text-sm mb-1">Your Balance</div>
            <div className="flex items-center justify-center gap-2">
              <Coins className="w-5 h-5 text-yellow-400" />
              <span className="text-2xl font-bold text-white">{balance.toFixed(2)} LTK</span>
            </div>
          </div>
        </div>

        {/* Dice Display */}
        <div className="bg-black/50 border border-purple-500/30 rounded-2xl p-12 mb-8">
          <div className="flex flex-col items-center justify-center">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentDice}
                initial={{ rotateX: 0, rotateY: 0, scale: 1 }}
                animate={
                  isRolling
                    ? { rotateX: 360, rotateY: 360, scale: [1, 1.2, 1] }
                    : { rotateX: 0, rotateY: 0, scale: 1 }
                }
                transition={{ duration: 0.3 }}
                className="mb-8"
              >
                <DiceIcon className="w-32 h-32 text-purple-400" />
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
                    You Won {PRICE_PER_ROLL * WIN_MULTIPLIER} LTK!
                  </div>
                ) : (
                  `Better luck next time!`
                )}
              </motion.div>
            )}

            {!isConnected ? (
              <p className="text-gray-400 text-lg">Connect your wallet to play</p>
            ) : remainingRolls <= 0 ? (
              <Button
                onClick={() => setShowPurchaseModal(true)}
                size="lg"
                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold text-xl px-12 py-6"
              >
                <Coins className="w-6 h-6 mr-2" />
                Purchase Rolls
              </Button>
            ) : (
              <Button
                onClick={rollDice}
                disabled={isRolling}
                size="lg"
                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold text-xl px-12 py-6"
              >
                {isRolling ? 'Rolling...' : '🎲 Roll Dice'}
              </Button>
            )}
          </div>
        </div>

        {/* Game History */}
        {gameHistory.length > 0 && (
          <div className="bg-purple-500/10 border border-purple-500/30 rounded-lg p-6">
            <h3 className="text-xl font-bold text-white mb-4">Recent Rolls</h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-3">
              {gameHistory.slice(0, 12).map((result, idx) => {
                const Icon = diceIcons[result.number - 1];
                return (
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
                    <Icon className={`w-8 h-8 ${result.won ? 'text-green-400' : 'text-red-400'}`} />
                    <span className="text-xs text-gray-400">
                      {result.won ? `+${PRICE_PER_ROLL * WIN_MULTIPLIER}` : '-'}
                    </span>
                  </motion.div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Purchase Modal */}
      <PurchaseLivesModal
        isOpen={showPurchaseModal}
        onClose={() => setShowPurchaseModal(false)}
        onPurchase={handlePurchaseLives}
        pricePerLife={PRICE_PER_ROLL}
        gameName="Dice Roll"
        minLives={1}
        maxLives={20}
        isPending={isPaymentPending}
      />
    </div>
  );
}
