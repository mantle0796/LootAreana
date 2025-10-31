'use client';

import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { GlowCard } from '@/components/animations/Effects';
import { motion } from 'framer-motion';
import { useTokenBalance } from '@/hooks/useToken';
import { Coins, ArrowLeft } from 'lucide-react';

const games = [
  {
    id: 'wordle',
    title: '🎯 Wordle',
    description: 'Guess the 5-letter word in 5 attempts',
    entryFee: '5 LTK',
    maxReward: '25 LTK',
    href: '/games/wordle',
    gradient: 'from-green-600 to-emerald-600',
  },
  {
    id: 'dice',
    title: '🎲 Dice Roll',
    description: 'Roll 1 or 6 to win double your bet',
    entryFee: '2 LTK per roll',
    maxReward: '4 LTK per win',
    href: '/games/dice',
    gradient: 'from-blue-600 to-cyan-600',
  },
  {
    id: 'coinflip',
    title: '🪙 Coin Flip',
    description: 'Heads or tails? 50/50 chance to double',
    entryFee: '3 LTK per flip',
    maxReward: '6 LTK per win',
    href: '/games/coinflip',
    gradient: 'from-yellow-600 to-orange-600',
  },
  {
    id: 'slots',
    title: '🎰 Slots',
    description: 'Spin the reels for massive jackpots',
    entryFee: '5 LTK per spin',
    maxReward: '100+ LTK',
    href: '/games/slots',
    gradient: 'from-purple-600 to-pink-600',
  },
];

export default function GamesPage() {
  const { balance } = useTokenBalance();

  return (
    <div className="min-h-screen py-20 px-4">
      <div className="container mx-auto max-w-6xl">
        <Link href="/" className="inline-flex items-center text-purple-400 hover:text-purple-300 mb-8">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Home
        </Link>

        <div className="text-center mb-12">
          <h1 className="text-5xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            Choose Your Game
          </h1>
          <p className="text-gray-400 text-lg mb-6">
            Pick a game and start earning LTK tokens!
          </p>
          
          <div className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-purple-500/20 border border-purple-500/50">
            <Coins className="w-6 h-6 text-yellow-400" />
            <span className="text-white font-semibold text-xl">{balance.toFixed(2)} LTK</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {games.map((game, idx) => (
            <motion.div
              key={game.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
            >
              <GlowCard>
                <Card className="bg-black/40 border-purple-500/30 backdrop-blur-xl hover:border-purple-400/50 transition-all h-full">
                  <CardHeader>
                    <CardTitle className="text-white text-3xl mb-2">{game.title}</CardTitle>
                    <CardDescription className="text-gray-400 text-base">
                      {game.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-purple-500/10 border border-purple-500/30 rounded-lg p-3">
                        <div className="text-gray-400 text-xs mb-1">Entry Fee</div>
                        <div className="text-white font-bold">{game.entryFee}</div>
                      </div>
                      <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-3">
                        <div className="text-gray-400 text-xs mb-1">Max Reward</div>
                        <div className="text-green-400 font-bold">{game.maxReward}</div>
                      </div>
                    </div>
                    
                    <Link href={game.href}>
                      <Button className={`w-full bg-gradient-to-r ${game.gradient} hover:opacity-90 text-white font-bold text-lg py-6`}>
                        Play Now
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              </GlowCard>
            </motion.div>
          ))}
        </div>

        <div className="mt-16 text-center">
          <div className="bg-purple-500/10 border border-purple-500/30 rounded-lg p-8 max-w-2xl mx-auto">
            <h3 className="text-white font-bold text-2xl mb-4">💡 Pro Tip</h3>
            <p className="text-gray-400">
              Don't have enough tokens? Claim your daily 100 LTK reward from the navbar!
              Connect your wallet and come back every 24 hours for free tokens.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
