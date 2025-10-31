'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Coins, Minus, Plus } from 'lucide-react';
import { motion } from 'framer-motion';

interface PurchaseLivesModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPurchase: (lives: number, totalCost: number) => void;
  pricePerLife: number;
  gameName: string;
  minLives?: number;
  maxLives?: number;
  isPending?: boolean;
}

export default function PurchaseLivesModal({
  isOpen,
  onClose,
  onPurchase,
  pricePerLife,
  gameName,
  minLives = 1,
  maxLives = 20,
  isPending = false,
}: PurchaseLivesModalProps) {
  const [lives, setLives] = useState(5);

  const totalCost = lives * pricePerLife;

  const increment = () => {
    if (lives < maxLives) setLives(lives + 1);
  };

  const decrement = () => {
    if (lives > minLives) setLives(lives - 1);
  };

  const handlePurchase = () => {
    onPurchase(lives, totalCost);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-black/95 border-purple-500/50 text-white">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            Purchase Lives - {gameName}
          </DialogTitle>
          <DialogDescription className="text-gray-400">
            Choose how many lives/chances you want to buy
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Lives Selector */}
          <div className="space-y-3">
            <label className="text-sm font-medium text-purple-300">Number of Lives</label>
            <div className="flex items-center gap-4">
              <Button
                onClick={decrement}
                disabled={lives <= minLives}
                variant="outline"
                size="icon"
                className="border-purple-500/30 hover:bg-purple-500/20"
              >
                <Minus className="w-4 h-4" />
              </Button>
              
              <Input
                type="number"
                value={lives}
                onChange={(e) => {
                  const val = parseInt(e.target.value) || minLives;
                  setLives(Math.max(minLives, Math.min(maxLives, val)));
                }}
                className="text-center text-2xl font-bold bg-purple-500/10 border-purple-500/30 text-white w-24"
                min={minLives}
                max={maxLives}
              />
              
              <Button
                onClick={increment}
                disabled={lives >= maxLives}
                variant="outline"
                size="icon"
                className="border-purple-500/30 hover:bg-purple-500/20"
              >
                <Plus className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Pricing Info */}
          <div className="space-y-2 p-4 rounded-lg bg-purple-500/10 border border-purple-500/30">
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Price per life:</span>
              <span className="text-purple-300 font-semibold">{pricePerLife} LTK</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Number of lives:</span>
              <span className="text-white font-semibold">×{lives}</span>
            </div>
            <div className="border-t border-purple-500/30 pt-2 mt-2">
              <div className="flex justify-between items-center">
                <span className="text-white font-bold">Total Cost:</span>
                <motion.div
                  key={totalCost}
                  initial={{ scale: 1.2, color: '#c07eff' }}
                  animate={{ scale: 1, color: '#ffffff' }}
                  className="flex items-center gap-2"
                >
                  <Coins className="w-5 h-5 text-yellow-400" />
                  <span className="text-2xl font-bold text-yellow-400">{totalCost}</span>
                  <span className="text-purple-300">LTK</span>
                </motion.div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <Button
              onClick={onClose}
              variant="outline"
              className="flex-1 border-purple-500/30 hover:bg-purple-500/20"
              disabled={isPending}
            >
              Cancel
            </Button>
            <Button
              onClick={handlePurchase}
              className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
              disabled={isPending}
            >
              {isPending ? (
                <>Processing...</>
              ) : (
                <>
                  <Coins className="w-4 h-4 mr-2" />
                  Pay & Start
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
