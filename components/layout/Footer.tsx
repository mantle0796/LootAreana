import Link from 'next/link';
import { Github, Twitter } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="border-t border-purple-500/20 bg-black/50 backdrop-blur-xl mt-20">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-white font-bold text-lg mb-4">Loot Arena</h3>
            <p className="text-gray-400 text-sm">
              Play exciting Web3 mini-games and earn LTK tokens on Flow testnet.
            </p>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4">Games</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/games/wordle" className="text-gray-400 hover:text-purple-400 text-sm">
                  Wordle
                </Link>
              </li>
              <li>
                <Link href="/games/dice" className="text-gray-400 hover:text-purple-400 text-sm">
                  Dice Roll
                </Link>
              </li>
              <li>
                <Link href="/games/coinflip" className="text-gray-400 hover:text-purple-400 text-sm">
                  Coin Flip
                </Link>
              </li>
              <li>
                <Link href="/games/slots" className="text-gray-400 hover:text-purple-400 text-sm">
                  Slots
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4">Connect</h4>
            <div className="flex gap-4">
              <a href="#" className="text-gray-400 hover:text-purple-400 transition-colors">
                <Github className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-purple-400 transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-purple-500/20 mt-8 pt-8 text-center">
          <p className="text-gray-400 text-sm">
            © 2025 Loot Arena. Built on Flow Testnet. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
