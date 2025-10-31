'use client';

import Link from 'next/link';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { Button } from '@/components/ui/button';
import { Coins, Trophy } from 'lucide-react';
import { useTokenBalance, useDailyClaim } from '@/hooks/useToken';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

export default function Navbar() {
  const { balance, refetch } = useTokenBalance();
  const { claim, isPending, canClaim, timeUntilNextClaim } = useDailyClaim();
  const [timeRemaining, setTimeRemaining] = useState('');

  useEffect(() => {
    if (!canClaim && timeUntilNextClaim > 0) {
      const hours = Math.floor(timeUntilNextClaim / 3600);
      const minutes = Math.floor((timeUntilNextClaim % 3600) / 60);
      setTimeRemaining(`${hours}h ${minutes}m`);
    }
  }, [canClaim, timeUntilNextClaim]);

  useEffect(() => {
    const interval = setInterval(() => {
      refetch();
    }, 5000);
    return () => clearInterval(interval);
  }, [refetch]);

  const handleClaim = () => {
    if (!canClaim) {
      toast.error(`You can claim again in ${timeRemaining}`);
      return;
    }
    claim();
  };

  return (
    <nav className="border-b border-purple-500/20 bg-black/50 backdrop-blur-xl sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent hover:scale-105 transition-transform">
            <Trophy className="inline-block w-7 h-7 mr-2 text-purple-400" />
            Loot Arena
          </Link>

          <div className="hidden md:flex items-center space-x-6">
            <Link href="/" className="text-gray-300 hover:text-purple-400 transition-colors">
              Home
            </Link>
            <Link href="/games" className="text-gray-300 hover:text-purple-400 transition-colors">
              Games
            </Link>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-lg bg-purple-500/10 border border-purple-500/30">
              <Coins className="w-5 h-5 text-yellow-400" />
              <span className="text-white font-semibold">{balance.toFixed(2)}</span>
              <span className="text-purple-300 text-sm">LTK</span>
            </div>

            <Button
              onClick={handleClaim}
              disabled={!canClaim || isPending}
              size="sm"
              className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 disabled:opacity-50"
            >
              {isPending ? 'Claiming...' : canClaim ? 'Claim 100 LTK' : `${timeRemaining}`}
            </Button>

            <ConnectButton />
          </div>
        </div>
      </div>
    </nav>
  );
}
