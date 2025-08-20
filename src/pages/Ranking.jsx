import React from 'react';
import { Card, CardContent } from '@/components/ui/card.jsx';
import { Badge } from '@/components/ui/badge.jsx';
import { Trophy, Medal, Award } from 'lucide-react';

const Ranking = () => {
  // Mock data for top holders
  const topHolders = [
    {
      rank: 1,
      address: "0x1234...5678",
      quantity: 25,
      percentage: 7.14,
      icon: Trophy,
      color: "text-yellow-400",
      bgColor: "bg-yellow-400/10"
    },
    {
      rank: 2,
      address: "0x8765...4321",
      quantity: 18,
      percentage: 5.14,
      icon: Medal,
      color: "text-gray-300",
      bgColor: "bg-gray-300/10"
    },
    {
      rank: 3,
      address: "0x9876...1234",
      quantity: 15,
      percentage: 4.29,
      icon: Award,
      color: "text-amber-600",
      bgColor: "bg-amber-600/10"
    }
  ];

  // Mock data for ranking table
  const rankingData = [
    { rank: 4, address: "0xabcd...efgh", quantity: 12, percentage: 3.43 },
    { rank: 5, address: "0x1111...2222", quantity: 10, percentage: 2.86 },
    { rank: 6, address: "0x3333...4444", quantity: 8, percentage: 2.29 },
    { rank: 7, address: "0x5555...6666", quantity: 7, percentage: 2.00 },
    { rank: 8, address: "0x7777...8888", quantity: 6, percentage: 1.71 },
    { rank: 9, address: "0x9999...aaaa", quantity: 5, percentage: 1.43 },
    { rank: 10, address: "0xbbbb...cccc", quantity: 4, percentage: 1.14 }
  ];

  return (
    <div className="min-h-screen py-16 px-4">
      <div className="container mx-auto max-w-6xl">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-bold mb-8 gradient-text fade-in-up" data-delay="0.5s">
            TOP HOLDERS
          </h1>
          <p className="text-xl text-white/80 max-w-3xl mx-auto fade-in-left" data-delay="0.7s">
            Os maiores holders da comunidade CriptoOasis Genesis. Dados atualizados em tempo real através da API.
          </p>
        </div>

        {/* Top 3 Holders */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {topHolders.map((holder, index) => {
            const IconComponent = holder.icon;
            return (
              <Card 
                key={holder.rank} 
                className={`fluorescent-card ${holder.bgColor} border-white/20 fade-in-up`} 
                data-delay={`${0.5 + index * 0.2}s`}
              >
                <CardContent className="p-8 text-center">
                  <div className="mb-6">
                    <IconComponent className={`w-16 h-16 ${holder.color} mx-auto mb-4`} />
                    <Badge className={`${holder.bgColor} ${holder.color} text-lg px-4 py-2`}>
                      #{holder.rank}
                    </Badge>
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <p className="text-white/70 text-sm mb-1">Endereço</p>
                      <p className="font-mono text-lg">{holder.address}</p>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-white/70 text-sm mb-1">NFTs</p>
                        <p className={`text-2xl font-bold ${holder.color}`}>{holder.quantity}</p>
                      </div>
                      <div>
                        <p className="text-white/70 text-sm mb-1">% Total</p>
                        <p className={`text-2xl font-bold ${holder.color}`}>{holder.percentage}%</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Ranking Table */}
        <Card className="bg-black/65 border-white/10 backdrop-blur-sm fade-in-up" data-delay="1.1s">
          <CardContent className="p-0">
            <div className="p-8 border-b border-white/10">
              <h2 className="text-2xl font-bold text-center">Ranking Completo</h2>
              <p className="text-white/70 text-center mt-2">Top holders da comunidade CriptoOasis Genesis</p>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/10">
                    <th className="text-left p-4 text-white/70">Rank</th>
                    <th className="text-left p-4 text-white/70">Endereço</th>
                    <th className="text-center p-4 text-white/70">NFTs</th>
                    <th className="text-center p-4 text-white/70">% Total</th>
                  </tr>
                </thead>
                <tbody>
                  {rankingData.map((holder, index) => (
                    <tr 
                      key={holder.rank} 
                      className="border-b border-white/5 hover:bg-white/5 transition-colors"
                    >
                      <td className="p-4">
                        <Badge variant="outline" className="border-white/30 text-white">
                          #{holder.rank}
                        </Badge>
                      </td>
                      <td className="p-4">
                        <span className="font-mono">{holder.address}</span>
                      </td>
                      <td className="p-4 text-center">
                        <span className="font-bold text-green-400">{holder.quantity}</span>
                      </td>
                      <td className="p-4 text-center">
                        <span className="font-bold text-blue-400">{holder.percentage}%</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            <div className="p-6 border-t border-white/10 text-center text-sm text-white/60">
              <p>Dados atualizados a cada 15 minutos</p>
              <p className="mt-1">Total de NFTs mintados: 350 / 350</p>
            </div>
          </CardContent>
        </Card>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
          <Card className="bg-white/5 border-white/10 fade-in-left" data-delay="1.3s">
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-green-400 mb-2">350</div>
              <div className="text-white/70">Total NFTs</div>
            </CardContent>
          </Card>
          
          <Card className="bg-white/5 border-white/10 fade-in-up" data-delay="1.5s">
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-blue-400 mb-2">147</div>
              <div className="text-white/70">Holders Únicos</div>
            </CardContent>
          </Card>
          
          <Card className="bg-white/5 border-white/10 fade-in-right" data-delay="1.7s">
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-purple-400 mb-2">2.38</div>
              <div className="text-white/70">NFTs por Holder</div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Ranking;
