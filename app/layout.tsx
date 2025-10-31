import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/providers";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Toaster } from "sonner";
import { PendingRewardsProvider } from "@/contexts/PendingRewardsContext";
import ClaimRewardsButton from "@/components/games/ClaimRewardsButton";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Loot Arena - Play & Earn on Flow Testnet",
  description: "Play exciting mini-games and earn tokens on Flow testnet. Wordle, Dice, Coin Flip and more!",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.variable} font-sans antialiased bg-gradient-to-br from-gray-950 via-purple-950 to-gray-950 min-h-screen`}>
        <Providers>
          <PendingRewardsProvider>
            <div className="flex flex-col min-h-screen">
              <Navbar />
              <main className="flex-1">
                {children}
              </main>
              <Footer />
            </div>
            <ClaimRewardsButton />
            <Toaster 
              position="bottom-right" 
              toastOptions={{
                style: {
                  background: 'rgba(0, 0, 0, 0.9)',
                  border: '1px solid rgba(172, 75, 255, 0.3)',
                  color: 'white',
                },
                className: 'sonner-toast',
              }}
              richColors
            />
          </PendingRewardsProvider>
        </Providers>
      </body>
    </html>
  );
}

