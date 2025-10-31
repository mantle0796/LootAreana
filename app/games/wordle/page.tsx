'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, Coins, ArrowLeft } from 'lucide-react';
import { useAccount } from 'wagmi';
import { useTokenBalance } from '@/hooks/useToken';
import { usePayWordleEntry, useMintWordleReward } from '@/hooks/useWordleToken';
import { WORDLE_ENTRY_FEE, MAX_WORDLE_ATTEMPTS, calculateWordleReward } from '@/contracts/tokenABI';
import { toast } from 'sonner';
import Link from 'next/link';

const WORD_LIST = ['REACT', 'REDUX', 'CHAIN', 'TOKEN', 'SMART', 'BLOCK', 'STAKE', 'DEFI', 'WALLT', 'PROOF'];

type LetterStatus = 'correct' | 'present' | 'absent' | 'empty';

interface Tile {
  letter: string;
  status: LetterStatus;
}

const KEYBOARD_ROWS = [
  ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
  ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
  ['ENTER', 'Z', 'X', 'C', 'V', 'B', 'N', 'M', 'BACK'],
];

export default function WordlePage() {
  const { address, isConnected } = useAccount();
  const { balance, refetch: refetchBalance } = useTokenBalance();
  const { payEntry, isPending: isPaymentPending, isSuccess: isPaymentSuccess } = usePayWordleEntry();
  const { mintReward, isPending: isRewardPending, isSuccess: isRewardSuccess } = useMintWordleReward();

  const [hasPaid, setHasPaid] = useState(false);
  const [showPaymentDialog, setShowPaymentDialog] = useState(false);
  const [targetWord, setTargetWord] = useState('');
  const [currentGuess, setCurrentGuess] = useState('');
  const [guesses, setGuesses] = useState<Tile[][]>([]);
  const [gameOver, setGameOver] = useState(false);
  const [won, setWon] = useState(false);
  const [attemptsUsed, setAttemptsUsed] = useState(0);
  const [keyboardStatus, setKeyboardStatus] = useState<Record<string, LetterStatus>>({});

  useEffect(() => {
    if (!targetWord) {
      const randomWord = WORD_LIST[Math.floor(Math.random() * WORD_LIST.length)];
      setTargetWord(randomWord);
    }
  }, [targetWord]);

  useEffect(() => {
    if (isPaymentSuccess) {
      setHasPaid(true);
      setShowPaymentDialog(false);
      refetchBalance();
    }
  }, [isPaymentSuccess, refetchBalance]);

  useEffect(() => {
    if (isRewardSuccess) {
      refetchBalance();
      setHasPaid(false);
      resetGame();
    }
  }, [isRewardSuccess, refetchBalance]);

  const handlePayment = async () => {
    if (!address) {
      toast.error('Please connect your wallet');
      return;
    }

    if (balance < WORDLE_ENTRY_FEE) {
      toast.error(`Insufficient balance. You need ${WORDLE_ENTRY_FEE} LTK.`);
      return;
    }

    await payEntry();
  };

  const resetGame = () => {
    const randomWord = WORD_LIST[Math.floor(Math.random() * WORD_LIST.length)];
    setTargetWord(randomWord);
    setCurrentGuess('');
    setGuesses([]);
    setGameOver(false);
    setWon(false);
    setAttemptsUsed(0);
    setKeyboardStatus({});
  };

  const handleKeyPress = (key: string) => {
    if (gameOver || !hasPaid) return;

    if (key === 'ENTER') {
      if (currentGuess.length !== 5) {
        toast.error('Word must be 5 letters!');
        return;
      }
      submitGuess();
    } else if (key === 'BACK') {
      setCurrentGuess((prev) => prev.slice(0, -1));
    } else if (currentGuess.length < 5) {
      setCurrentGuess((prev) => prev + key);
    }
  };

  const submitGuess = () => {
    const newGuess: Tile[] = currentGuess.split('').map((letter, idx) => {
      let status: LetterStatus = 'absent';
      if (targetWord[idx] === letter) {
        status = 'correct';
      } else if (targetWord.includes(letter)) {
        status = 'present';
      }
      
      // Update keyboard status
      const currentStatus = keyboardStatus[letter];
      if (!currentStatus || status === 'correct' || (status === 'present' && currentStatus !== 'correct')) {
        setKeyboardStatus((prev) => ({ ...prev, [letter]: status }));
      }

      return { letter, status };
    });

    const newGuesses = [...guesses, newGuess];
    setGuesses(newGuesses);
    setAttemptsUsed(newGuesses.length);

    if (currentGuess === targetWord) {
      setWon(true);
      setGameOver(true);
      const reward = calculateWordleReward(newGuesses.length);
      toast.success(`🎉 You won! Minting ${reward} LTK reward...`);
      setTimeout(() => {
        if (address) {
          mintReward(reward);
        }
      }, 1000);
    } else if (newGuesses.length >= MAX_WORDLE_ATTEMPTS) {
      setGameOver(true);
      toast.error(`Game over! The word was ${targetWord}`);
      setTimeout(() => {
        setHasPaid(false);
        resetGame();
      }, 3000);
    }

    setCurrentGuess('');
  };

  const getKeyStatus = (key: string): LetterStatus => {
    return keyboardStatus[key] || 'empty';
  };

  const currentRow = guesses.length;
  const emptyRows = MAX_WORDLE_ATTEMPTS - guesses.length - (currentGuess ? 1 : 0);

  return (
    <div className="min-h-screen py-20 px-4">
      <div className="max-w-2xl mx-auto">
        <Link href="/games" className="inline-flex items-center text-purple-400 hover:text-purple-300 mb-8">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Games
        </Link>

        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            🎯 Wordle
          </h1>
          <p className="text-gray-400 text-lg mb-4">
            Guess the 5-letter word in {MAX_WORDLE_ATTEMPTS} attempts
          </p>
          
          <div className="flex justify-center gap-4 mb-4">
            <div className="bg-purple-500/20 border border-purple-500/50 rounded-lg px-6 py-3">
              <div className="text-gray-400 text-sm">Entry Fee</div>
              <div className="flex items-center gap-2">
                <Coins className="w-5 h-5 text-yellow-400" />
                <span className="text-white font-bold text-xl">{WORDLE_ENTRY_FEE} LTK</span>
              </div>
            </div>
            <div className="bg-purple-500/20 border border-purple-500/50 rounded-lg px-6 py-3">
              <div className="text-gray-400 text-sm">Your Balance</div>
              <div className="flex items-center gap-2">
                <Coins className="w-5 h-5 text-yellow-400" />
                <span className="text-white font-bold text-xl">{balance.toFixed(2)} LTK</span>
              </div>
            </div>
          </div>

          {!hasPaid && (
            <Button
              onClick={() => setShowPaymentDialog(true)}
              disabled={!isConnected}
              size="lg"
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
            >
              {isConnected ? `Pay ${WORDLE_ENTRY_FEE} LTK to Play` : 'Connect Wallet'}
            </Button>
          )}

          {hasPaid && (
            <div className="text-green-400 font-semibold">
              ✅ Paid! Attempts: {attemptsUsed}/{MAX_WORDLE_ATTEMPTS}
            </div>
          )}
        </div>

        {/* Game Board */}
        <div className="mb-8 flex flex-col items-center gap-2">
          {/* Previous guesses */}
          {guesses.map((guess, rowIdx) => (
            <div key={rowIdx} className="flex gap-2">
              {guess.map((tile, colIdx) => (
                <motion.div
                  key={colIdx}
                  initial={{ rotateX: 0 }}
                  animate={{ rotateX: 360 }}
                  transition={{ delay: colIdx * 0.1, duration: 0.5 }}
                  className={`w-14 h-14 border-2 rounded flex items-center justify-center text-2xl font-bold ${
                    tile.status === 'correct'
                      ? 'bg-green-600 border-green-500 text-white'
                      : tile.status === 'present'
                      ? 'bg-yellow-600 border-yellow-500 text-white'
                      : 'bg-gray-700 border-gray-600 text-white'
                  }`}
                >
                  {tile.letter}
                </motion.div>
              ))}
            </div>
          ))}

          {/* Current guess row */}
          {!gameOver && hasPaid && (
            <div className="flex gap-2">
              {Array.from({ length: 5 }).map((_, idx) => (
                <div
                  key={idx}
                  className={`w-14 h-14 border-2 rounded flex items-center justify-center text-2xl font-bold ${
                    currentGuess[idx]
                      ? 'border-purple-500 bg-purple-500/20 text-white'
                      : 'border-gray-600 bg-gray-800'
                  }`}
                >
                  {currentGuess[idx] || ''}
                </div>
              ))}
            </div>
          )}

          {/* Empty rows */}
          {Array.from({ length: emptyRows }).map((_, rowIdx) => (
            <div key={`empty-${rowIdx}`} className="flex gap-2">
              {Array.from({ length: 5 }).map((_, colIdx) => (
                <div
                  key={colIdx}
                  className="w-14 h-14 border-2 border-gray-700 bg-gray-900 rounded"
                />
              ))}
            </div>
          ))}
        </div>

        {/* Keyboard */}
        {hasPaid && !gameOver && (
          <div className="flex flex-col gap-2 items-center">
            {KEYBOARD_ROWS.map((row, rowIdx) => (
              <div key={rowIdx} className="flex gap-1">
                {row.map((key) => (
                  <Button
                    key={key}
                    onClick={() => handleKeyPress(key)}
                    size="sm"
                    className={`${
                      key === 'ENTER' || key === 'BACK' ? 'px-4' : 'w-10'
                    } h-12 ${
                      getKeyStatus(key) === 'correct'
                        ? 'bg-green-600 hover:bg-green-700'
                        : getKeyStatus(key) === 'present'
                        ? 'bg-yellow-600 hover:bg-yellow-700'
                        : getKeyStatus(key) === 'absent'
                        ? 'bg-gray-700 hover:bg-gray-800'
                        : 'bg-gray-600 hover:bg-gray-700'
                    }`}
                  >
                    {key}
                  </Button>
                ))}
              </div>
            ))}
          </div>
        )}

        {/* Payment Dialog */}
        <Dialog open={showPaymentDialog} onOpenChange={setShowPaymentDialog}>
          <DialogContent className="bg-black/95 border-purple-500/50 text-white">
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold">Pay to Play Wordle</DialogTitle>
              <DialogDescription className="text-gray-400">
                Pay {WORDLE_ENTRY_FEE} LTK to get {MAX_WORDLE_ATTEMPTS} attempts
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 py-4">
              <div className="bg-purple-500/10 border border-purple-500/30 rounded-lg p-4">
                <h3 className="text-white font-semibold mb-2">Reward Structure:</h3>
                <ul className="text-gray-400 text-sm space-y-1">
                  <li>• Win on attempt 1: <span className="text-green-400 font-bold">25 LTK</span></li>
                  <li>• Win on attempt 2: <span className="text-green-400 font-bold">20 LTK</span></li>
                  <li>• Win on attempt 3: <span className="text-green-400 font-bold">15 LTK</span></li>
                  <li>• Win on attempt 4: <span className="text-green-400 font-bold">10 LTK</span></li>
                  <li>• Win on attempt 5: <span className="text-green-400 font-bold">5 LTK</span></li>
                </ul>
              </div>

              <div className="flex gap-3">
                <Button
                  onClick={() => setShowPaymentDialog(false)}
                  variant="outline"
                  className="flex-1 border-purple-500/30 hover:bg-purple-500/20"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handlePayment}
                  disabled={isPaymentPending || balance < WORDLE_ENTRY_FEE}
                  className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                >
                  {isPaymentPending ? 'Processing...' : `Pay ${WORDLE_ENTRY_FEE} LTK`}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
