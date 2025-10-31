'use client';

import { useAccount, useReadContract, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { TOKEN_ABI, TOKEN_CONTRACT_ADDRESS } from '@/contracts/tokenABI';
import { useState, useEffect } from 'react';
import { toast } from 'sonner';

export function useTokenBalance() {
  const { address } = useAccount();
  
  const { data: balance, refetch } = useReadContract({
    address: TOKEN_CONTRACT_ADDRESS,
    abi: TOKEN_ABI,
    functionName: 'balanceOf',
    args: address ? [address] : undefined,
  });

  return {
    balance: balance ? Number(balance) / 1e18 : 0,
    refetch,
  };
}

export function useDailyClaim() {
  const { address } = useAccount();
  const { writeContract, data: hash, isPending } = useWriteContract();
  const [lastClaimTime, setLastClaimTime] = useState<number>(0);

  // Store last claim time in localStorage since contract doesn't have this feature
  useEffect(() => {
    if (address) {
      const stored = localStorage.getItem(`lastClaim_${address}`);
      if (stored) {
        setLastClaimTime(Number(stored));
      }
    }
  }, [address]);

  const { isSuccess } = useWaitForTransactionReceipt({
    hash,
  });

  // Show success toast when transaction is confirmed
  useEffect(() => {
    if (isSuccess && hash) {
      toast.success('🎉 100 LTK claimed successfully!', { id: 'daily-claim' });
    }
  }, [isSuccess, hash]);

  const claim = async () => {
    if (!address) return;
    
    try {
      toast.loading('Claiming daily tokens...', { id: 'daily-claim' });
      
      // Mint 100 tokens (100 * 10^18)
      const claimAmount = BigInt(100) * BigInt(10 ** 18);
      await writeContract({
        address: TOKEN_CONTRACT_ADDRESS,
        abi: TOKEN_ABI,
        functionName: 'mint',
        args: [address, claimAmount],
      });
      
      toast.loading('Transaction submitted, waiting for confirmation...', { id: 'daily-claim' });
      
      // Update last claim time in localStorage
      const now = Math.floor(Date.now() / 1000);
      localStorage.setItem(`lastClaim_${address}`, now.toString());
      setLastClaimTime(now);
    } catch (error) {
      console.error('Claim failed:', error);
      toast.error('Failed to claim tokens. Please try again.', { id: 'daily-claim' });
    }
  };

  const canClaim = () => {
    if (!lastClaimTime) return true;
    const now = Math.floor(Date.now() / 1000);
    const oneDayInSeconds = 24 * 60 * 60;
    return now - lastClaimTime >= oneDayInSeconds;
  };

  const getTimeUntilNextClaim = () => {
    if (!lastClaimTime) return 0;
    const now = Math.floor(Date.now() / 1000);
    const oneDayInSeconds = 24 * 60 * 60;
    const timePassed = now - lastClaimTime;
    const timeRemaining = oneDayInSeconds - timePassed;
    return timeRemaining > 0 ? timeRemaining : 0;
  };

  return {
    claim,
    isPending,
    isSuccess,
    canClaim: canClaim(),
    timeUntilNextClaim: getTimeUntilNextClaim(),
  };
}

export function useRewardTokens() {
  const { writeContract, data: hash, isPending } = useWriteContract();

  const { isSuccess } = useWaitForTransactionReceipt({
    hash,
  });

  // Show success toast when reward is minted
  useEffect(() => {
    if (isSuccess && hash) {
      toast.success('🏆 Reward tokens minted!', { id: 'reward' });
    }
  }, [isSuccess, hash]);

  const reward = async (to: string, amount: number) => {
    try {
      toast.loading(`Minting ${amount} LTK reward...`, { id: 'reward' });
      
      const amountInWei = BigInt(Math.floor(amount * 1e18));
      await writeContract({
        address: TOKEN_CONTRACT_ADDRESS,
        abi: TOKEN_ABI,
        functionName: 'mint',
        args: [to as `0x${string}`, amountInWei],
      });
      
      toast.loading('Transaction submitted, waiting for confirmation...', { id: 'reward' });
    } catch (error) {
      console.error('Reward failed:', error);
      toast.error('Failed to mint reward tokens.', { id: 'reward' });
    }
  };

  return {
    reward,
    isPending,
    isSuccess,
  };
}
