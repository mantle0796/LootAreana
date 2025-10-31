import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Trophy, Coins, Zap, Shield, Gamepad2 } from 'lucide-react';
import { FloatingElement, GlowCard } from '@/components/animations/Effects';

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-20 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-purple-900/20 to-transparent pointer-events-none"></div>
        
        <div className="container mx-auto max-w-6xl relative z-10">
          <div className="text-center mb-16">
            <FloatingElement delay={0}>
              <h1 className="text-6xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 bg-clip-text text-transparent">
                Welcome to Loot Arena
              </h1>
            </FloatingElement>
            
            <FloatingElement delay={0.2}>
              <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto">
                Play exciting Web3 mini-games, earn <span className="text-yellow-400 font-bold">LTK tokens</span>, and compete on Flow testnet
              </p>
            </FloatingElement>

            <FloatingElement delay={0.4}>
              <div className="flex gap-4 justify-center flex-wrap">
                <Link href="/games">
                  <Button size="lg" className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-lg px-8 py-6">
                    <Gamepad2 className="w-5 h-5 mr-2" />
                    Start Playing
                  </Button>
                </Link>
                <Button size="lg" variant="outline" className="border-purple-500/50 hover:bg-purple-500/20 text-lg px-8 py-6">
                  Learn More
                </Button>
              </div>
            </FloatingElement>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16">
            {[
              { icon: Trophy, label: 'Games Available', value: '4+' },
              { icon: Coins, label: 'Tokens Distributed', value: '10K+' },
              { icon: Zap, label: 'Active Players', value: '500+' },
            ].map((stat, idx) => (
              <GlowCard key={idx}>
                <Card className="bg-black/40 border-purple-500/30 backdrop-blur-xl text-center">
                  <CardContent className="pt-6">
                    <stat.icon className="w-12 h-12 mx-auto mb-4 text-purple-400" />
                    <div className="text-4xl font-bold text-white mb-2">{stat.value}</div>
                    <div className="text-gray-400">{stat.label}</div>
                  </CardContent>
                </Card>
              </GlowCard>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-16 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            Why Loot Arena?
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: Shield,
                title: 'Secure & Transparent',
                description: 'Built on Flow blockchain with smart contract security',
              },
              {
                icon: Coins,
                title: 'Earn Real Tokens',
                description: 'Win LTK tokens by playing games and completing challenges',
              },
              {
                icon: Zap,
                title: 'Instant Rewards',
                description: 'Get your rewards instantly with fast blockchain transactions',
              },
            ].map((feature, idx) => (
              <GlowCard key={idx}>
                <Card className="bg-black/40 border-purple-500/30 backdrop-blur-xl h-full">
                  <CardHeader>
                    <feature.icon className="w-12 h-12 text-purple-400 mb-4" />
                    <CardTitle className="text-white">{feature.title}</CardTitle>
                    <CardDescription className="text-gray-400">
                      {feature.description}
                    </CardDescription>
                  </CardHeader>
                </Card>
              </GlowCard>
            ))}
          </div>
        </div>
      </section>

      {/* Games Showcase */}
      <section className="py-20 px-4 bg-purple-900/10">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-16 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            Featured Games
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[
              {
                title: '🎯 Wordle',
                description: 'Guess the word in 5 attempts. Pay 5 LTK to play, win up to 25 LTK!',
                href: '/games/wordle',
              },
              {
                title: '🎲 Dice Roll',
                description: 'Roll 1 or 6 to win 2x your bet. Buy rolls and accumulate rewards!',
                href: '/games/dice',
              },
              {
                title: '🪙 Coin Flip',
                description: 'Heads or tails? Double your tokens with each correct guess!',
                href: '/games/coinflip',
              },
              {
                title: '🎰 Slots',
                description: 'Spin the reels for massive jackpot rewards!',
                href: '/games/slots',
              },
            ].map((game, idx) => (
              <GlowCard key={idx}>
                <Link href={game.href}>
                  <Card className="bg-black/40 border-purple-500/30 backdrop-blur-xl hover:border-purple-400/50 transition-all cursor-pointer h-full">
                    <CardHeader>
                      <CardTitle className="text-white text-2xl">{game.title}</CardTitle>
                      <CardDescription className="text-gray-400 text-base">
                        {game.description}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Button className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700">
                        Play Now
                      </Button>
                    </CardContent>
                  </Card>
                </Link>
              </GlowCard>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-white">
            Ready to Start Winning?
          </h2>
          <p className="text-xl text-gray-300 mb-8">
            Connect your wallet and claim your free daily tokens to get started!
          </p>
          <Link href="/games">
            <Button size="lg" className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-xl px-12 py-8">
              <Trophy className="w-6 h-6 mr-2" />
              Enter the Arena
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}

