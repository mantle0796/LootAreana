'use client';

import { useAccount, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { TOKEN_ABI, TOKEN_CONTRACT_ADDRESS, WORDLE_ENTRY_FEE } from '@/contracts/tokenABI';
import { useEffect } from 'react';
import { toast } from 'sonner';

export function usePayWordleEntry() {
  const { address } = useAccount();
  const { writeContract, data: hash, isPending } = useWriteContract();

  const { isSuccess } = useWaitForTransactionReceipt({
    hash,
  });

  useEffect(() => {
    if (isSuccess && hash) {
      toast.success(`Payment of ${WORDLE_ENTRY_FEE} LTK confirmed! You can now play.`, { id: 'wordle-payment' });
    }
  }, [isSuccess, hash]);

  const payEntry = async () => {
    if (!address) return false;

    try {
      toast.loading(`Paying ${WORDLE_ENTRY_FEE} LTK entry fee...`, { id: 'wordle-payment' });

      const amountInWei = BigInt(WORDLE_ENTRY_FEE) * BigInt(10 ** 18);
      await writeContract({
        address: TOKEN_CONTRACT_ADDRESS,
        abi: TOKEN_ABI,
        functionName: 'transfer',
        args: [TOKEN_CONTRACT_ADDRESS, amountInWei],
      });

      toast.loading('Transaction submitted, waiting for confirmation...', { id: 'wordle-payment' });
      return true;
    } catch (error) {
      console.error('Payment failed:', error);
      toast.error('Payment failed. Please try again.', { id: 'wordle-payment' });
      return false;
    }
  };

  return {
    payEntry,
    isPending,
    isSuccess,
  };
}

export function useMintWordleReward() {
  const { address } = useAccount();
  const { writeContract, data: hash, isPending } = useWriteContract();

  const { isSuccess } = useWaitForTransactionReceipt({
    hash,
  });

  useEffect(() => {
    if (isSuccess && hash) {
      toast.success('🎉 Wordle reward minted successfully!', { id: 'wordle-reward' });
    }
  }, [isSuccess, hash]);

  const mintReward = async (rewardAmount: number) => {
    if (!address) return false;

    try {
      toast.loading(`Minting ${rewardAmount} LTK reward...`, { id: 'wordle-reward' });

      const amountInWei = BigInt(Math.floor(rewardAmount * 1e18));
      await writeContract({
        address: TOKEN_CONTRACT_ADDRESS,
        abi: TOKEN_ABI,
        functionName: 'mint',
        args: [address, amountInWei],
      });

      toast.loading('Transaction submitted, waiting for confirmation...', { id: 'wordle-reward' });
      return true;
    } catch (error) {
      console.error('Reward minting failed:', error);
      toast.error('Failed to mint reward. Please try again.', { id: 'wordle-reward' });
      return false;
    }
  };

  return {
    mintReward,
    isPending,
    isSuccess,
  };
}
