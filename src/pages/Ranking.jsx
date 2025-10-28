import React, { useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card.jsx';
import { Badge } from '@/components/ui/badge.jsx';
import { Trophy, Medal, Award } from 'lucide-react';
import ParticleBackground from '../components/ParticleBackground';
import RetrowaveGrid from '../components/RetrowaveGrid';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { initScrollAnimations } from "../utils/scrollAnimation.js";
import '../App.css';

const Ranking = () => {
  useEffect(() => {
    initScrollAnimations();
  }, []);

  // Mock data for top holders
  const topHolders = [
    {
      rank: 1,
      address: "0x52AB839E3B207DF534343C5FC91BFA2656E85D43",
      quantity: 5,
      icon: Trophy,
      color: "text-yellow-400",
      bgColor: "bg-yellow-400/10"
    },
    {
      rank: 2,
      address: "0x52AB839E3B207DF534343C5FC91BFA2656E85D43",
      quantity: 5,
      icon: Medal,
      color: "text-green-400",
      bgColor: "bg-green-400/10"
    },
    {
      rank: 3,
      address: "0x52AB839E3B207DF534343C5FC91BFA2656E85D43",
      quantity: 5,
      icon: Award,
      color: "text-yellow-600",
      bgColor: "bg-yellow-600/10"
    }
  ];

  // Mock data for ranking table
  const rankingData = [
    { rank: 4, address: "0x52AB839E3B207DF534343C5FC91BFA2656E85D43", quantity: 7 },
    { rank: 5, address: "0x52AB839E3B207DF534343C5FC91BFA2656E85D43", quantity: 6 },
    { rank: 6, address: "0x52AB839E3B207DF534343C5FC91BFA2656E85D43", quantity: 4 },
    { rank: 7, address: "0x52AB839E3B207DF534343C5FC91BFA2656E85D43", quantity: 10 },
    { rank: 8, address: "0x52AB839E3B207DF534343C5FC91BFA2656E85D43", quantity: 11 },
    { rank: 9, address: "0x52AB839E3B207DF534343C5FC91BFA2656E85D43", quantity: 9 },
    { rank: 10, address: "0x52AB839E3B207DF534343C5FC91BFA2656E85D43", quantity: 13 }
  ];

  return (
    <div className="min-h-screen relative overflow-x-hidden">
      {/* Retrowave static background */}
      <div
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: `
            linear-gradient(to bottom, #06011a7e 10%, #2d1147be 50%, #06011aff 100%),
            url('/images/retrowave-bg.jpg')
          `,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundAttachment: 'scroll', 
          backgroundRepeat: 'no-repeat',
        }}
      />

      {/* Animated backgrounds */}
      <ParticleBackground />
      <RetrowaveGrid />
      
      {/* Navbar */}
      <Navbar />
      
      <div className="relative z-10 pt-24 pb-16 px-4">
        <div className="container mx-auto max-w-6xl">
          {/* Header */}
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-6xl font-bold mb-8 fade-in-up gradient-text" data-delay="0.5s">
              Top Holders
            </h1>
            <p className="text-xl text-white/80 max-w-3xl mx-auto fade-in-left" data-delay="0.7s">
              Os três principais holders da CriptoOasis Genesis são pioneiros na economia digital. Cada um possui uma NFT que representa uma obra de arte exclusiva e acesso a oportunidades de investimento em uma comunidade vibrante. Juntos, moldam o futuro da CriptoOasis, trazendo valor real para todos
            </p>
          </div>

          {/* Top 3 Holders */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            {topHolders.map((holder, index) => {
              const IconComponent = holder.icon;
              return (
                <Card 
                  key={holder.rank} 
                  className={`bg-black/40 border border-white/20 backdrop-blur-sm fade-in-up`} 
                  data-delay={`${0.5 + index * 0.2}s`}
                >
                  <CardContent className="p-8 text-center">
                    <div className="mb-6">
                      <Badge className={`${holder.bgColor} ${holder.color} text-lg px-4 py-2 mb-4`}>
                        #{holder.rank.toString().padStart(2, '0')}
                      </Badge>
                    </div>
                    
                    <div className="space-y-4">
                      <div>
                        <p className="text-white/70 text-sm mb-1">Quantidade</p>
                        <p className={`text-2xl font-bold ${holder.color}`}>{holder.quantity} NFTs</p>
                      </div>
                      
                      <div>
                        <p className="text-white/70 text-sm mb-1">Wallet</p>
                        <p className="font-mono text-xs break-all">{holder.address.slice(0, 10)}...{holder.address.slice(-8)}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Ranking Table */}
          <Card className="bg-black/40 border border-white/20 backdrop-blur-sm fade-in-up" data-delay="1.1s">
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-white/10">
                      <th className="text-left p-4 text-white/70">Ranking</th>
                      <th className="text-left p-4 text-white/70">Wallet</th>
                      <th className="text-center p-4 text-white/70">Quantidade</th>
                    </tr>
                  </thead>
                  <tbody>
                    {rankingData.map((holder, index) => (
                      <tr 
                        key={holder.rank} 
                        className="border-b border-white/5 hover:bg-white/5 transition-colors"
                      >
                        <td className="p-4">
                          <span className="text-white/80">#{holder.rank.toString().padStart(2, '0')}</span>
                        </td>
                        <td className="p-4">
                          <span className="font-mono text-white/80 text-sm">{holder.address.slice(0, 10)}...{holder.address.slice(-8)}</span>
                        </td>
                        <td className="p-4 text-center">
                          <span className="font-bold text-white">{holder.quantity}</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Ranking;
