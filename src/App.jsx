import {useState, useEffect, useCallback} from 'react';
import { Button } from '@/components/ui/button.jsx';
import { Card, CardContent } from '@/components/ui/card.jsx';
import { Badge } from '@/components/ui/badge.jsx';
import { Wallet, Minus, Plus, ExternalLink, Twitter, MessageCircle, Globe, Users, DollarSign, Gift, BarChart3, Shield, TrendingUp, Award, BookOpen, Handshake, Eye } from 'lucide-react';
import './App.css';
import {ConnectButton, ClaimButton, lightTheme} from "thirdweb/react";
import { sepolia } from "thirdweb/chains";
import {useThierdweb} from "@/hooks/useThierdweb.js";
import { getContract } from "thirdweb";
import { getTotalClaimedSupply, getTotalUnclaimedSupply, getActiveClaimCondition, balanceOf} from "thirdweb/extensions/erc721";
import {useCountdown} from "@/hooks/useCountdown.js";

function App() {
  const { days, hours, minutes, seconds } = useCountdown({ initialDays: 6, initialHours: 23, initialMinutes: 59, initialSeconds: 58 });

  const {client, account, contract} = useThierdweb();

  const [totalClaimedSupply, setTotalClaimedSupply] = useState(0);
  const [totalUnclaimedSupply, setTotalUnclaimedSupply] = useState(0);
  const [totalSupply, setTotalSupply] = useState(0);
  const [claimConditions, setClaimConditions] = useState({});
  const [isConnected, setIsConnected] = useState(false);
  const [userMintedCount, setUserMintedCount] = useState(0);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
      if(!contract) {
          return;
      }

      loadData();
  }, [success]);

  useEffect(() => {
    if(!account) {
      return;
    }
    (async () => {
      const mintedCount = await balanceOf({ contract, owner: account.address });

      setUserMintedCount(Number(mintedCount));
    })();
  }, [account, success]);

  const loadData  = async() => {
    const totalClaimedSupply = await getTotalClaimedSupply({ contract });
    const totalUnclaimedSupply = await getTotalUnclaimedSupply({ contract });
    const claimCondition = await getActiveClaimCondition({ contract });

    setTotalClaimedSupply(Number(totalClaimedSupply));
    setTotalUnclaimedSupply(Number(totalUnclaimedSupply));
    setTotalSupply(Number(totalClaimedSupply) + Number(totalUnclaimedSupply));
    setClaimConditions(claimCondition);
  }

  const [quantity, setQuantity] = useState(1);
  const [isMinting, setIsMinting] = useState(false);
  const [mintError, setMintError] = useState('');
  const [mintSuccess, setMintSuccess] = useState('');
  const [txHash, setTxHash] = useState('');
  const [error, setError] = useState(null);

  // Smooth scroll function
  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleMint = async () => {
    // if (!isConnected) {
    //   setMintError('Por favor, conecte sua wallet primeiro');
    //   return;
    // }

    // if (!canMint(quantity, userMintedCount)) {
    //   setMintError('Quantidade inválida ou limite excedido');
    //   return;
    // }

    setIsMinting(true);
    setMintError('');
    setMintSuccess('');

    // try {
    //   const result = await mintNFT(quantity);
    //   setTxHash(result.hash);
    //   setMintSuccess(`Mint realizado com sucesso! ${quantity} NFT(s) mintado(s).`);
    //
    //   // Update user minted count
    //   const newCount = await getMintedByWallet(account);
    //   setUserMintedCount(newCount);
    // } catch (error) {
    //   console.error('Erro no mint:', error);
    //   setMintError(error.message || 'Erro ao realizar mint');
    // } finally {
    //   setIsMinting(false);
    // }
  };

  const increaseQuantity = () => {
    if (quantity < 5 && quantity + userMintedCount < 5) {
      setQuantity(quantity + 1);
    }
  };

  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  const totalCost = (0.08 * quantity).toFixed(4);
  const totalCostUSD = (300 * quantity).toFixed(2);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 text-white">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-black/20 backdrop-blur-md border-b border-white/10">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center font-bold text-black">
              CO
            </div>
            <span className="text-xl font-bold">CRIPTO OASIS</span>
          </div>
          
          <div className="hidden md:flex space-x-6">
            <button onClick={() => scrollToSection('mint')} className="hover:text-yellow-400 transition-colors">Mint</button>
            <button onClick={() => scrollToSection('about')} className="hover:text-yellow-400 transition-colors">Sobre</button>
            <button onClick={() => scrollToSection('benefits')} className="hover:text-yellow-400 transition-colors">Benefícios</button>
            <button onClick={() => scrollToSection('roadmap')} className="hover:text-yellow-400 transition-colors">Roadmap</button>
            <button onClick={() => scrollToSection('faq')} className="hover:text-yellow-400 transition-colors">FAQ</button>
          </div>

          <div className="flex items-center space-x-4">
            <a href="#" className="text-white/70 hover:text-white transition-colors">
              <Twitter size={20} />
            </a>
            <a href="#" className="text-white/70 hover:text-white transition-colors">
              <MessageCircle size={20} />
            </a>
            <a href="#" className="text-white/70 hover:text-white transition-colors">
              <Globe size={20} />
            </a>

            <div><ConnectButton client={client} theme={lightTheme({
              colors: {
                modalBg: "white",
              },
            })} chain={sepolia} /></div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section id="hero" className="pt-24 pb-16 px-4">
        <div className="container mx-auto text-center">
          <div className="mb-8">
            <div className="text-6xl mb-4">🌴</div>
            <h1 className="text-6xl md:text-8xl font-bold mb-4">
              <span className="text-white">CRIPTO</span>
              <br />
              <span className="text-yellow-400">OASIS</span>
            </h1>
            <p className="text-xl md:text-2xl text-white/80 max-w-4xl mx-auto mb-12">
              Sua chave para o oásis da nova economia. NFT Genesis com benefícios reais, 
              renda passiva e acesso vitalício a uma comunidade exclusiva de 350 membros.
            </p>
          </div>

          {/* Countdown */}
          <div className="mb-12">
            <h3 className="text-lg text-white/60 mb-6">TEMPO RESTANTE PARA MINT ESPECIAL</h3>
            <div className="flex justify-center space-x-8">
              <div className="text-center">
                <div className="text-4xl md:text-6xl font-bold text-yellow-400">{days.toString().padStart(2, '0')}</div>
                <div className="text-sm text-white/60">Days</div>
              </div>
              <div className="text-center">
                <div className="text-4xl md:text-6xl font-bold text-yellow-400">{hours.toString().padStart(2, '0')}</div>
                <div className="text-sm text-white/60">Hours</div>
              </div>
              <div className="text-center">
                <div className="text-4xl md:text-6xl font-bold text-yellow-400">{minutes.toString().padStart(2, '0')}</div>
                <div className="text-sm text-white/60">Minutes</div>
              </div>
              <div className="text-center">
                <div className="text-4xl md:text-6xl font-bold text-yellow-400">{seconds.toString().padStart(2, '0')}</div>
                <div className="text-sm text-white/60">Seconds</div>
              </div>
            </div>
          </div>

          {/* Features Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <Card className="fluorescent-card">
              <CardContent className="p-8 text-center">
                <Users className="w-12 h-12 text-yellow-400 mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-yellow-400 mb-2">350 Únicos</h3>
                <p className="text-white/70">Comunidade exclusiva limitada</p>
              </CardContent>
            </Card>

            <Card className="fluorescent-card">
              <CardContent className="p-8 text-center">
                <DollarSign className="w-12 h-12 text-yellow-400 mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-yellow-400 mb-2">Renda Passiva</h3>
                <p className="text-white/70">6-10% ROI anual projetado</p>
              </CardContent>
            </Card>

            <Card className="fluorescent-card">
              <CardContent className="p-8 text-center">
                <Gift className="w-12 h-12 text-yellow-400 mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-yellow-400 mb-2">Benefícios VIP</h3>
                <p className="text-white/70">Acesso vitalício e brindes</p>
              </CardContent>
            </Card>

            <Card className="fluorescent-card">
              <CardContent className="p-8 text-center">
                <BarChart3 className="w-12 h-12 text-yellow-400 mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-yellow-400 mb-2">Transparência</h3>
                <p className="text-white/70">Dashboard público em tempo real</p>
              </CardContent>
            </Card>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              onClick={() => scrollToSection('mint')}
              size="lg" 
              className="fluorescent-button bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-lg px-8 py-4"
            >
              MINT AGORA - $300
            </Button>
            <Button 
              onClick={() => scrollToSection('about')}
              variant="outline" 
              size="lg" 
              className="fluorescent-button border-white/30 text-white hover:bg-white/10 text-lg px-8 py-4"
            >
              Saiba Mais
            </Button>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-16 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-6xl font-bold mb-8">
              <span className="text-orange-400">SOBRE O</span>{' '}
              <span className="text-purple-400">PROJETO</span>
            </h2>
            <p className="text-xl text-white/80 max-w-4xl mx-auto">
              CriptoOasis Genesis não é apenas uma NFT - é seu passaporte para uma nova forma de investir e participar da 
              economia digital. Combinamos arte exclusiva com utilidade real, criando valor tangível para uma comunidade seleta de holders.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h3 className="text-2xl font-bold text-yellow-400 mb-6">O Diferencial</h3>
              <p className="text-white/80 mb-6">
                Enquanto 99% dos projetos NFT prometem utilidade futura que nunca se materializa, 
                CriptoOasis Genesis entrega valor real desde o primeiro dia.
              </p>
              <p className="text-white/80 mb-8">
                Nossa abordagem combina exclusividade garantida (apenas 350 unidades), transparência total 
                (dashboard público) e benefícios tangíveis (renda passiva + brindes).
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white/5 p-6 rounded-lg border border-white/10">
                  <Eye className="w-8 h-8 text-blue-400 mb-3" />
                  <h4 className="font-bold mb-2">Transparência Total</h4>
                  <p className="text-sm text-white/70">
                    Dashboard público com todas as operações em tempo real. Auditoria externa trimestral e relatórios detalhados.
                  </p>
                </div>

                <div className="bg-white/5 p-6 rounded-lg border border-white/10">
                  <TrendingUp className="w-8 h-8 text-green-400 mb-3" />
                  <h4 className="font-bold mb-2">Modelo Sustentável</h4>
                  <p className="text-sm text-white/70">
                    40% do capital em operações rentáveis (trading, DeFi, investimentos). ROI projetado de 6-10% ao ano.
                  </p>
                </div>

                <div className="bg-white/5 p-6 rounded-lg border border-white/10">
                  <Users className="w-8 h-8 text-purple-400 mb-3" />
                  <h4 className="font-bold mb-2">Comunidade Exclusiva</h4>
                  <p className="text-sm text-white/70">
                    Apenas 350 membros vitalícios. Acesso a grupo VIP, decisões estratégicas e networking premium.
                  </p>
                </div>

                <div className="bg-white/5 p-6 rounded-lg border border-white/10">
                  <Gift className="w-8 h-8 text-yellow-400 mb-3" />
                  <h4 className="font-bold mb-2">Benefícios Reais</h4>
                  <p className="text-sm text-white/70">
                    Brindes físicos, educação premium, mentoria personalizada e participação nos lucros.
                  </p>
                </div>
              </div>
            </div>

            <div className="text-center">
              <div className="relative w-64 h-64 mx-auto mb-8">
                <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 via-orange-500 to-purple-600 rounded-full animate-spin-slow"></div>
                <div className="absolute inset-2 bg-gradient-to-br from-purple-900 to-blue-900 rounded-full flex items-center justify-center">
                  <div className="text-6xl">🏝️</div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-yellow-400">350</div>
                  <div className="text-sm text-white/60">NFTs Únicos</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-yellow-400">$300</div>
                  <div className="text-sm text-white/60">Preço de Mint</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-yellow-400">6-10%</div>
                  <div className="text-sm text-white/60">ROI Anual</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-yellow-400">$1K</div>
                  <div className="text-sm text-white/60">Benefícios/Ano</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mint Section */}
      <section id="mint" className="py-16 px-4">
        <div className="container mx-auto max-w-2xl">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">MINT OFICIAL</h2>
            <p className="text-xl text-white/80">
              Garanta sua NFT CriptoOasis Genesis e torne-se membro vitalício da comunidade mais exclusiva do cripto.
            </p>
          </div>

          <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
            <CardContent className="p-8">
              <h3 className="text-2xl font-bold mb-6 text-center">MINT CRIPTOOASIS GENESIS</h3>
              
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <span className="text-white/70">Mintados</span>
                  <span className="font-bold">{ totalClaimedSupply } / { totalSupply }</span>
                </div>
                
                <div className="w-full bg-white/10 rounded-full h-2">
                  <div className="bg-gradient-to-r from-green-500 to-emerald-600 h-2 rounded-full" style={{width: (totalClaimedSupply / totalSupply) * 100 +'%'}}></div>
                </div>
                
                <div className="text-center text-white/70">
                  { totalUnclaimedSupply } NFTs restantes
                </div>

                <div className="border-t border-white/10 pt-6">
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-2xl font-bold">0.08 ETH</span>
                    <span className="text-white/70">≈ $300 USD</span>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Quantidade</label>
                      <div className="flex items-center space-x-4">
                        <Button
                          onClick={decreaseQuantity}
                          disabled={quantity <= 1}
                          variant="outline"
                          size="sm"
                          className="border-white/30 text-white hover:bg-white/10"
                        >
                          <Minus className="w-4 h-4" />
                        </Button>
                        <span className="text-2xl font-bold w-8 text-center">{quantity}</span>
                        <Button
                          onClick={increaseQuantity}
                          disabled={quantity >= 5 || quantity >= totalUnclaimedSupply}
                          variant="outline"
                          size="sm"
                          className="border-white/30 text-white hover:bg-white/10"
                        >
                          <Plus className="w-4 h-4" />
                        </Button>
                      </div>
                      <p className="text-xs text-white/60 mt-1">Máximo 5 NFTs por wallet</p>
                    </div>

                    <div className="border-t border-white/10 pt-4">
                      <div className="flex justify-between items-center mb-4">
                        <span className="font-medium">Custo Total</span>
                        <div className="text-right">
                          <div className="font-bold">{totalCost} ETH</div>
                          <div className="text-sm text-white/70">≈ ${totalCostUSD} USD</div>
                        </div>
                      </div>

                      {!account ? (
                          <div className="text-center"><ConnectButton client={client} theme={lightTheme({
                            colors: {
                              modalBg: "white",
                            },
                          })} chain={sepolia}/></div>
                      ) : (
                          <div className="text-center">
                              <ClaimButton
                                  contractAddress={contract.address}
                                  chain={sepolia}
                                  client={client}
                                  claimParams={{
                                    type: "ERC721",
                                    quantity: BigInt(quantity),
                                  }}
                                  onError={(err) => {
                                    setError(err.message);
                                    console.log(err);
                                  }}
                                  onTransactionConfirmed={() => {
                                    setSuccess(true);
                                  }}
                              >
                                  Mint
                              </ClaimButton>
                          </div>
                      )}

                      {account && (
                        <div className="mt-4 text-center">
                          <p className="text-sm text-white/70">
                            Wallet conectada: {account.address?.slice(0, 6)}...{account.address?.slice(-4)}
                          </p>
                          <p className="text-xs text-white/60">
                            Você já mintou: {userMintedCount}/5 NFTs
                          </p>
                        </div>
                      )}

                      {error && (
                        <div className="mt-4 p-3 bg-red-500/20 border border-red-500/30 rounded-lg">
                          <p className="text-red-300 text-sm">{error}</p>
                        </div>
                      )}

                      {success && (
                          <div className="mt-4 p-3 bg-green-500/20 border border-green-500/30 rounded-lg">
                            <p className="text-green-300 text-sm">NFT mintada com sucesso!</p>
                          </div>
                      )}

                      {mintError && (
                        <div className="mt-4 p-3 bg-red-500/20 border border-red-500/30 rounded-lg">
                          <p className="text-red-300 text-sm">{mintError}</p>
                        </div>
                      )}

                      {mintSuccess && (
                        <div className="mt-4 p-3 bg-green-500/20 border border-green-500/30 rounded-lg">
                          <p className="text-green-300 text-sm">{mintSuccess}</p>
                          {txHash && (
                            <a
                              href={`https://etherscan.io/tx/${txHash}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-green-300 hover:text-green-200 text-xs flex items-center mt-2"
                            >
                              Ver transação <ExternalLink className="w-3 h-3 ml-1" />
                            </a>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="border-t border-white/10 pt-4 text-center text-sm text-white/60">
                  <p>Rede: Ethereum Mainnet</p>
                  <p>Contrato verificado no Etherscan</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Benefits Section */}
      <section id="benefits" className="py-16 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-6xl font-bold mb-8">BENEFÍCIOS EXCLUSIVOS</h2>
            <p className="text-xl text-white/80 max-w-3xl mx-auto">
              Holders da CriptoOasis Genesis desfrutam de benefícios únicos e vitalícios
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="fluorescent-card">
              <CardContent className="p-8">
                <DollarSign className="w-12 h-12 text-green-400 mb-4" />
                <h3 className="text-xl font-bold mb-4">Renda Passiva</h3>
                <p className="text-white/70 mb-4">
                  Distribuição trimestral de lucros das operações. ROI projetado de 6-10% ao ano.
                </p>
                <div className="text-green-400 font-bold">~$18-30 por trimestre</div>
              </CardContent>
            </Card>

            <Card className="fluorescent-card">
              <CardContent className="p-8">
                <Award className="w-12 h-12 text-purple-400 mb-4" />
                <h3 className="text-xl font-bold mb-4">Acesso VIP</h3>
                <p className="text-white/70 mb-4">
                  Grupo exclusivo de 350 membros com acesso a conteúdos premium e decisões estratégicas.
                </p>
                <div className="text-purple-400 font-bold">Acesso vitalício</div>
              </CardContent>
            </Card>

            <Card className="fluorescent-card">
              <CardContent className="p-8">
                <Gift className="w-12 h-12 text-yellow-400 mb-4" />
                <h3 className="text-xl font-bold mb-4">Brindes Físicos</h3>
                <p className="text-white/70 mb-4">
                  Camisetas personalizadas, ingressos para eventos e produtos exclusivos.
                </p>
                <div className="text-yellow-400 font-bold">~$200/ano em brindes</div>
              </CardContent>
            </Card>

            <Card className="fluorescent-card">
              <CardContent className="p-8">
                <BookOpen className="w-12 h-12 text-blue-400 mb-4" />
                <h3 className="text-xl font-bold mb-4">Educação Premium</h3>
                <p className="text-white/70 mb-4">
                  Aulas exclusivas sobre DeFi, Trading e Blockchain com especialistas.
                </p>
                <div className="text-blue-400 font-bold">~$500/ano em educação</div>
              </CardContent>
            </Card>

            <Card className="fluorescent-card">
              <CardContent className="p-8">
                <Handshake className="w-12 h-12 text-orange-400 mb-4" />
                <h3 className="text-xl font-bold mb-4">Networking Elite</h3>
                <p className="text-white/70 mb-4">
                  Conexões com investidores e empreendedores da comunidade cripto.
                </p>
                <div className="text-orange-400 font-bold">~$300/ano em eventos</div>
              </CardContent>
            </Card>

            <Card className="fluorescent-card">
              <CardContent className="p-8">
                <Eye className="w-12 h-12 text-cyan-400 mb-4" />
                <h3 className="text-xl font-bold mb-4">Transparência Total</h3>
                <p className="text-white/70 mb-4">
                  Dashboard público com todas as operações e performance em tempo real.
                </p>
                <div className="text-cyan-400 font-bold">100% transparente</div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-16 px-4">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-6xl font-bold mb-8">PERGUNTAS FREQUENTES</h2>
          </div>

          <div className="space-y-6">
            <Card className="fluorescent-card">
              <CardContent className="p-8">
                <h3 className="text-xl font-bold mb-4">Como funciona a renda passiva?</h3>
                <p className="text-white/70">
                  40% do capital arrecadado é investido em operações rentáveis (trading algorítmico, DeFi, investimentos estratégicos). 
                  Os lucros são distribuídos trimestralmente para todos os holders de forma proporcional.
                </p>
              </CardContent>
            </Card>

            <Card className="fluorescent-card">
              <CardContent className="p-8">
                <h3 className="text-xl font-bold mb-4">Os benefícios são realmente vitalícios?</h3>
                <p className="text-white/70">
                  Sim! Uma vez holder, você mantém acesso permanente ao grupo VIP, distribuição de lucros, brindes e todos os benefícios. 
                  Não há taxas recorrentes ou renovações.
                </p>
              </CardContent>
            </Card>

            <Card className="fluorescent-card">
              <CardContent className="p-8">
                <h3 className="text-xl font-bold mb-4">Como posso acompanhar as operações?</h3>
                <p className="text-white/70">
                  Teremos um dashboard público onde todos podem acompanhar em tempo real as operações, performance dos investimentos 
                  e distribuição de lucros. Transparência total é nosso compromisso.
                </p>
              </CardContent>
            </Card>

            <Card className="fluorescent-card">
              <CardContent className="p-8">
                <h3 className="text-xl font-bold mb-4">Qual a diferença para outras NFTs?</h3>
                <p className="text-white/70">
                  Enquanto a maioria promete utilidade futura, nós entregamos valor real desde o dia 1. Modelo econômico sustentável, 
                  transparência total e benefícios tangíveis comprovados.
                </p>
              </CardContent>
            </Card>

            <Card className="fluorescent-card">
              <CardContent className="p-8">
                <h3 className="text-xl font-bold mb-4">Posso vender minha NFT depois?</h3>
                <p className="text-white/70">
                  Sim, as NFTs podem ser negociadas normalmente no OpenSea e outras plataformas. O novo proprietário automaticamente 
                  herda todos os benefícios e direitos.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Roadmap Section */}
      <section id="roadmap" className="py-16 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-6xl font-bold mb-8">ROADMAP</h2>
            <p className="text-xl text-white/80 max-w-3xl mx-auto">
              Nossa jornada para construir o oásis da nova economia digital
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <Card className="fluorescent-card">
              <CardContent className="p-8">
                <Badge className="bg-green-500/20 text-green-400 mb-4">Q1 2024 - CONCLUÍDO</Badge>
                <h3 className="text-xl font-bold mb-4">Lançamento</h3>
                <ul className="text-white/70 space-y-2 text-sm">
                  <li>• Mint das 350 NFTs Genesis</li>
                  <li>• Criação da comunidade VIP</li>
                  <li>• Dashboard de transparência</li>
                  <li>• Primeiros investimentos</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="fluorescent-card">
              <CardContent className="p-8">
                <Badge className="bg-yellow-500/20 text-yellow-400 mb-4">Q2 2024 - EM ANDAMENTO</Badge>
                <h3 className="text-xl font-bold mb-4">Expansão</h3>
                <ul className="text-white/70 space-y-2 text-sm">
                  <li>• Primeira distribuição de lucros</li>
                  <li>• Parcerias estratégicas</li>
                  <li>• Eventos presenciais</li>
                  <li>• Educação premium</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="fluorescent-card">
              <CardContent className="p-8">
                <Badge className="bg-blue-500/20 text-blue-400 mb-4">Q3 2024 - PLANEJADO</Badge>
                <h3 className="text-xl font-bold mb-4">Inovação</h3>
                <ul className="text-white/70 space-y-2 text-sm">
                  <li>• Plataforma de staking</li>
                  <li>• Marketplace exclusivo</li>
                  <li>• Token de governança</li>
                  <li>• Expansão internacional</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="fluorescent-card">
              <CardContent className="p-8">
                <Badge className="bg-purple-500/20 text-purple-400 mb-4">Q4 2024 - FUTURO</Badge>
                <h3 className="text-xl font-bold mb-4">Evolução</h3>
                <ul className="text-white/70 space-y-2 text-sm">
                  <li>• Metaverso CriptoOasis</li>
                  <li>• DAO completa</li>
                  <li>• Fundo de investimento</li>
                  <li>• Legado duradouro</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 border-t border-white/10">
        <div className="container mx-auto text-center">
          <div className="flex items-center justify-center space-x-2 mb-6">
            <div className="w-8 h-8 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center font-bold text-black">
              CO
            </div>
            <span className="text-xl font-bold">CRIPTO OASIS</span>
          </div>
          
          <div className="flex justify-center space-x-6 mb-6">
            <a href="#" className="text-white/70 hover:text-white transition-colors">
              <Twitter size={24} />
            </a>
            <a href="#" className="text-white/70 hover:text-white transition-colors">
              <MessageCircle size={24} />
            </a>
            <a href="#" className="text-white/70 hover:text-white transition-colors">
              <Globe size={24} />
            </a>
          </div>
          
          <p className="text-white/60 text-sm">
            © 2024 CriptoOasis Genesis. Todos os direitos reservados.
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;

