export const TOKEN_CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_TOKEN_CONTRACT_ADDRESS as `0x${string}` || '0x506B41359218BCac5B648b78a56cA315365487ec';

export const TOKEN_ABI = [
  {
    inputs: [{ internalType: 'address', name: 'account', type: 'address' }],
    name: 'balanceOf',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'address', name: 'to', type: 'address' },
      { internalType: 'uint256', name: 'amount', type: 'uint256' },
    ],
    name: 'mint',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'address', name: 'to', type: 'address' },
      { internalType: 'uint256', name: 'amount', type: 'uint256' },
    ],
    name: 'transfer',
    outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
    stateMutability: 'nonpayable',
    type: 'function',
  },
] as const;

// Wordle game constants
export const WORDLE_ENTRY_FEE = 5; // 5 LTK to play
export const MAX_WORDLE_ATTEMPTS = 5;

export function calculateWordleReward(attempts: number): number {
  // Linear reward: 5 LTK × (6 - attempts used)
  // Win on attempt 1: 25 LTK
  // Win on attempt 2: 20 LTK
  // Win on attempt 3: 15 LTK
  // Win on attempt 4: 10 LTK
  // Win on attempt 5: 5 LTK
  return 5 * (6 - attempts);
}
