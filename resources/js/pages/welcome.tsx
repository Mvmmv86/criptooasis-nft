import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button.jsx';
import { Card, CardContent } from '@/components/ui/card.jsx';
import { Badge } from '@/components/ui/badge.jsx';
import { Minus, Plus, ExternalLink, MessageCircle, Twitter, Globe, Users, DollarSign, Gift, BarChart3, TrendingUp, Award, BookOpen, Handshake, Eye } from 'lucide-react';
import { useContract } from '@/hooks/useContract';
import ParticleBackground from '@/components/ParticleBackground'
import RetrowaveGrid from '@/components/RetrowaveGrid'
import NavLogo from '@/components/NavLogo';
import Footer from '@/components/Footer';
import {useCountdown} from "@/hooks/useCountdown.js";
import {ConnectButton, lightTheme} from "thirdweb/react"
import { initScrollAnimations } from "@/utils/scrollAnimation.js";
import LoadingScreen from '@/components/LoadingScreen';

import {useThierdWeb} from "@/hooks/useThierdWeb.js";
import Navbar from "@/components/Navbar";

export default function Welcome() {

    useEffect(() => {
        initScrollAnimations();
    }, []);

    const { contractData, mintNFT, fetchMintedPerWallet, isLoading: contractLoading, isConnected, fetchContractData } = useContract();
    const { timeLeft, timeFinished } = useCountdown();

    const [isLoading, setIsLoading] = useState(true);
    const [quantity, setQuantity] = useState(1);
    const [isMinting, setIsMinting] = useState(false);
    const [mintError, setMintError] = useState('');
    const [mintSuccess, setMintSuccess] = useState('');
    const [txHash, setTxHash] = useState('');
    const [userMintedCount, setUserMintedCount] = useState(0);

    const {client, account, chain} = useThierdWeb();

    const scrollToSection = (sectionId) => {
        const element = document.getElementById(sectionId);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
        }
    };

    useEffect(() => {
        if (isConnected && account) {
            console.log('Here');
            loadMintedPerWallet(account?.address);
        }
    }, [isConnected, account]);

    const loadMintedPerWallet = async (address: string) => {
        const mintedPerWallet = await fetchMintedPerWallet(address);

        setUserMintedCount(Number(mintedPerWallet));
    }

    const handleMint = async () => {
        if (!timeFinished) {
            setMintError('Por favor, aguarde o lançamento da NFT');
            return;
        }

        if (!isConnected) {
            setMintError('Por favor, conecte sua wallet primeiro');
            return;
        }

        setIsMinting(true);
        setMintError('');
        setMintSuccess('');

        try {
            const result = await mintNFT(quantity);
            setTxHash(result.hash);
            setMintSuccess(`Mint realizado com sucesso! ${quantity} NFT(s) mintado(s).`);

            loadMintedPerWallet(account?.address || '');
            fetchContractData();
        } catch (error) {
            console.error('Erro no mint:', error);
            setMintError(error.message || 'Erro ao realizar mint');
        } finally {
            setIsMinting(false);
        }
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

    const totalCost = (Number(contractData.mintPrice) * quantity).toFixed(4);

    return (
        <>
            {isLoading &&(
                <LoadingScreen onComplete={() => setIsLoading(false)} duration={1000} />
            )}
            <div className="min-h-screen relative overflow-x-hidden ">
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
                <div className='relative z-10'>
                    <Navbar showScrollButtons={true} scrollToSection={scrollToSection} />

                    <section id="hero" className="pt-24 pb-16 px-4 relative overflow-hidden ">
                        <div className="container mx-auto text-center max-w-5xl">
                            <div className="mb-6 fade-in-down" data-delay="0.8s">
                                <img
                                    src="/logo/logo.png"
                                    alt="Cripto Oasis Logo"
                                    className="mx-auto w-auto h-auto max-w-full mb-6"

                                />
                            </div>
                            <p className="text-xl md:text-2xl text-white/80 max-w-4xl mx-auto mb-12 fade-in-left"
                               data-delay="1s">
                                Sua chave para o oásis da nova economia. NFT Genesis com benefícios reais, renda passiva e acesso vitalício a uma comunidade exclusiva de 350 membros.
                            </p>
                            <div className="countdown-container max-w-2xl mx-auto mb-12 fade-in-up">
                                <p className="text-lg mb-6 font-normal">TEMPO RESTANTE PARA MINT ESPECIAL</p>
                                <div className="flex justify-center space-x-4 md:space-x-6">
                                    {['days', 'hours', 'minutes', 'seconds'].map((unit) => (
                                        <div key={unit} className="text-center">
                                            <div className="bg-black/65 rounded-lg px-4 py-3 md:px-6 md:py-5 text-pink-500 text-3xl md:text-5xl font-extrabold tracking-wide ">
                                                {timeLeft[unit].toString().padStart(2, '0')}
                                            </div>
                                            <div className="text-[7px] md:text-xs text-pink-700 font-semibold tracking-widest mt-1 uppercase">
                                                {unit.charAt(0).toUpperCase() + unit.slice(1)}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>


                            {/* Features Grid */}
                            <div className="flex flex-col md:flex-row justify-center items-stretch gap-6 mt-12 px-4 md:px-0">
                                <div className="fluorescent-card rounded-xl fade-in-up" data-delay="0.5s">
                                    <Users className="w-8 h-8 text-yellow-400 mb-2" />
                                    <h3 className="text-green-400 font-bold">350 Unicos</h3>
                                    <p className="text-white/60 text-sm">Comunidade exclusiva limitada</p>
                                </div>

                                <div className="fluorescent-card rounded-xl fade-in-down" data-delay="0.7s">
                                    <Handshake className="w-8 h-8 text-yellow-400 mb-2" />
                                    <h3 className="text-green-400 font-bold">Ecossistema de Vantagens</h3>
                                    <p className="text-white/60 text-sm">Perks, drops e eventuais distribuições aprovadas.</p>
                                </div>

                                <div className="fluorescent-card  rounded-xl fade-in-up" data-delay="0.9s">
                                    <Gift className="w-8 h-8 text-yellow-400 mb-2" />
                                    <h3 className="text-green-400 font-bold">Benefícios VIP</h3>
                                    <p className="text-white/60 text-sm">Acesso vitalício e brindes</p>
                                </div>

                                <div className="fluorescent-card rounded-xl fade-in-down" data-delay="1.1s">
                                    <BarChart3 className="w-8 h-8 text-yellow-400 mb-2" />
                                    <h3 className="text-green-400 font-bold">Transparência</h3>
                                    <p className="text-white/60 text-sm">Dashboard público em tempo real</p>
                                </div>
                            </div>


                            <div className="flex flex-col sm:flex-row gap-4 justify-center mt-12">
                                <Button
                                    onClick={() => scrollToSection('mint')}
                                    size="lg"
                                    className="fluorescent-button bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-lg px-8 py-4 text-white font-bold fade-in-left" data-delay="0.8s"
                                >
                                    MINT AGORA - 0.08 ETH
                                </Button>
                                <Button
                                    onClick={() => scrollToSection('about')}
                                    variant="outline"
                                    size="lg"
                                    className="fluorescent-button border-pink-400/50 text-white hover:bg-pink-500/20 text-lg px-8 py-4 fade-in-right" data-delay="1s"
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
                                <h2 className="text-4xl md:text-6xl font-bold mb-8 text-yellow-400 fade-in-left" data-delay="0.5s">
                                    SOBRE O PROJETO
                                </h2>
                                <p className="text-xl text-white/80 max-w-4xl mx-auto fade-in-right" data-delay="0.7s">
                                    CriptoOasis Genesis não é apenas uma NFT - é seu passaporte para uma nova forma de investir e participar da
                                    economia digital. Combinamos arte exclusiva com utilidade real, criando valor tangível para uma comunidade seleta de holders.
                                </p>
                            </div>

                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
                                <div>
                                    <h3 className="text-2xl font-bold text-yellow-400 mb-6 fade-in-down" data-delay="0.5s">O DIFERENCIAL</h3>
                                    <p className="text-white/80 mb-6 fade-in-left" data-delay="0.6s">
                                        Enquanto 99% dos projetos NFT prometem utilidade futura que nunca se materializa,
                                        CriptoOasis Genesis entrega valor real desde o primeiro dia.
                                    </p>
                                    <p className="text-white/80 mb-8 fade-in-left" data-delay="0.7s">
                                        Unimos arte e utilidades concretas (governança, conteúdos, experiências e perks) para 350 membros vitalícios, criando um ecossistema de vantagens que evolui com as decisões da comunidade.
                                    </p>
                                    <Button
                                        onClick={() => scrollToSection('benefits')}
                                        className="bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white px-8 py-3 rounded-lg mb-8"
                                    >
                                        Entenda mais sobre
                                    </Button>
                                </div>

                                <div className="text-center">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="bg-white/5 p-6 rounded-lg border border-white/10 fade-in-left" data-delay="0.5s">
                                            <Eye className="w-8 h-8 text-blue-400 mb-3" />
                                            <h4 className="font-bold mb-2">Transparência Total</h4>
                                            <p className="text-sm text-white/70">
                                                Dashboard público com todas as operações em tempo real. Auditoria externa trimestral e relatórios detalhados.
                                            </p>
                                        </div>

                                        <div className="bg-white/5 p-6 rounded-lg border border-white/10 fade-in-right" data-delay="0.5s">
                                            <TrendingUp className="w-8 h-8 text-green-400 mb-3" />
                                            <h4 className="font-bold mb-2">Modelo Sustentável</h4>
                                            <p className="text-sm text-white/70">
                                                 40% operações market-neutral; 60% reservas/utilidades. Sem alavancagem+rebalance mensal+transparência on-chain. Distribuições apenas com excedente e aprovação em governança. Sem promessa de rentabilidade.
                                            </p>
                                        </div>

                                        <div className="bg-white/5 p-6 rounded-lg border border-white/10 fade-in-left" data-delay="0.7s">
                                            <Users className="w-8 h-8 text-purple-400 mb-3" />
                                            <h4 className="font-bold mb-2">Comunidade Exclusiva</h4>
                                            <p className="text-sm text-white/70">
                                                Apenas 350 membros vitalícios. Acesso a grupo VIP, decisões estratégicas e networking premium.
                                            </p>
                                        </div>

                                        <div className="bg-white/5 p-6 rounded-lg border border-white/10 fade-in-right" data-delay="0.7s">
                                            <Gift className="w-8 h-8 text-yellow-400 mb-3" />
                                            <h4 className="font-bold mb-2">Benefícios Reais</h4>
                                            <p className="text-sm text-white/70">
                                                Brindes físicos, educação premium, aulas e materiais exclusivos para holders e participação em potenciais distribuições.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Mint Section */}
                    <section id="mint" className="py-16 px-4">
                        <div className="container mx-auto max-w-2xl">
                            <div className="text-center mb-12 ">
                                <h2 className="text-4xl md:text-5xl font-bold mb-4 gradient-text fade-in-up" data-delay="0.5s">MINT OFICIAL</h2>
                                <p className="text-xl text-white/80 fade-in-left" data-delay="0.7s">
                                    Garanta sua NFT CriptoOasis Genesis e torne-se membro vitalício da comunidade mais exclusiva do cripto.
                                </p>
                            </div>

                            <Card className="bg-black/65 border-white/10 backdrop-blur-sm fade-in-up" data-delay="0.9s">
                                <CardContent className="p-8">
                                    <h3 className="text-2xl font-bold mb-6 text-center">MINT CRIPTOOASIS GENESIS</h3>

                                    <div className="space-y-6">
                                        <div className="flex justify-between items-center">
                                            <span className="text-white/70">Mintados</span>
                                            <span className="font-bold">{ contractData.currentSupply } / { contractData.maxSupply }</span>
                                        </div>

                                        <div className="w-full bg-white/10 rounded-full h-2">
                                            <div className="bg-gradient-to-r from-green-500 to-emerald-600 h-2 rounded-full" style={{width: (contractData.currentSupply / contractData.maxSupply * 100) + '%'}}></div>
                                        </div>

                                        <div className="text-center text-white/70">
                                            { contractData.maxSupply - contractData.currentSupply } NFTs restantes
                                        </div>

                                        <div className="border-t border-white/10 pt-6">
                                            <div className="flex justify-between items-center mb-4">
                                                <span className="text-2xl font-bold">0.08 ETH</span>
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
                                                            className="border-white/30 text-white hover:bg-white/10 fade-in-left" data-delay="1.1s"
                                                        >
                                                            <Minus className="w-4 h-4" />
                                                        </Button>
                                                        <span className="text-2xl font-bold w-8 text-center">{quantity}</span>
                                                        <Button
                                                            onClick={increaseQuantity}
                                                            disabled={quantity >= 5 || quantity + userMintedCount >= 5}
                                                            variant="outline"
                                                            size="sm"
                                                            className="border-white/30 text-white hover:bg-white/10 fade-in-right" data-delay="1.3s"
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
                                                        </div>
                                                    </div>

                                                    {!isConnected ? (
                                                        <div className="text-center"><ConnectButton client={client} theme={lightTheme({
                                                            colors: {
                                                                modalBg: "white",
                                                            },
                                                        })} chain={chain}/></div>
                                                    ) : (
                                                        <Button
                                                            onClick={handleMint}
                                                            disabled={isMinting || contractLoading || quantity + userMintedCount > 5 || !timeFinished}
                                                            className="fluorescent-button w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700"
                                                            size="lg"
                                                        >
                                                            {isMinting ? 'Mintando...' : `Mint ${quantity} NFT${quantity > 1 ? 's' : ''}`}
                                                        </Button>
                                                    )}

                                                    {isConnected && (
                                                        <div className="mt-4 text-center">
                                                            <p className="text-sm text-white/70">
                                                                Wallet conectada: {account?.address?.slice(0, 6)}...{account?.address?.slice(-4)}
                                                            </p>
                                                            <p className="text-xs text-white/60">
                                                                Você já mintou: {userMintedCount}/5 NFTs
                                                            </p>
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
                                                                    Ver transação <ExternalLink className="w-3 h-3 ml-1"/>
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
                                <h2 className="text-4xl md:text-6xl font-bold mb-8 gradient-text fade-in-up" data-delay="0.7s">BENEFÍCIOS EXCLUSIVOS</h2>
                                <p className="text-xl text-white/80 max-w-3xl mx-auto fade-in-left" data-delay="0.9s">
                                    Holders da CriptoOasis Genesis desfrutam de benefícios únicos e vitalícios
                                </p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                <Card className="fluorescent-card fade-in-left" data-delay="1.2s" >
                                    <CardContent className="p-8">
                                        <DollarSign className="w-12 h-12 text-green-400 mb-4" />
                                        <h3 className="text-xl font-bold mb-4">Economia do Clube</h3>
                                        <p className="text-white/70 mb-4">
                                            Distribuições eventuais, condicionadas a excedente de caixa da tesouraria e voto da comunidade. Sem promessa de rentabilidade.
                                        </p>
                                        <div className="text-green-400 font-bold">~$18-30 por trimestre</div>
                                    </CardContent>
                                </Card>

                                <Card className="fluorescent-card fade-in-left" data-delay="0.8s" >
                                    <CardContent className="p-8">
                                        <Award className="w-12 h-12 text-purple-400 mb-4" />
                                        <h3 className="text-xl font-bold mb-4">Acesso VIP</h3>
                                        <p className="text-white/70 mb-4">
                                            Grupo exclusivo de 350 membros com acesso a conteúdos premium e decisões estratégicas.
                                        </p>
                                        <div className="text-purple-400 font-bold">Acesso vitalício</div>
                                    </CardContent>
                                </Card>

                                <Card className="fluorescent-card fade-in-left" data-delay="0.4s" >
                                    <CardContent className="p-8">
                                        <Gift className="w-12 h-12 text-yellow-400 mb-4" />
                                        <h3 className="text-xl font-bold mb-4">Perks & Kits</h3>
                                        <p className="text-white/70 mb-4">
                                            Kits, whitelist, descontos e experiências com parceiros. Entregas sujeitas a calendário, estoque e regras do programa.
                                        </p>
                                        <div className="text-yellow-400 font-bold">~$200/ano em brindes</div>
                                    </CardContent>
                                </Card>

                                <Card className="fluorescent-card fade-in-right" data-delay="1.2s" >
                                    <CardContent className="p-8">
                                        <BookOpen className="w-12 h-12 text-blue-400 mb-4" />
                                        <h3 className="text-xl font-bold mb-4">Educação Premium</h3>
                                        <p className="text-white/70 mb-4">
                                            Trilhas exclusivas de DeFi, Trading e Blockchain e aulas ao vivo com especialistas. Material exclusivo e completo on-demand para revisão.
                                        </p>
                                        <div className="text-blue-400 font-bold">~$500/ano em educação</div>
                                    </CardContent>
                                </Card>

                                <Card className="fluorescent-card fade-in-right" data-delay="0.8s" >
                                    <CardContent className="p-8">
                                        <Handshake className="w-12 h-12 text-orange-400 mb-4" />
                                        <h3 className="text-xl font-bold mb-4">Networking Elite</h3>
                                        <p className="text-white/70 mb-4">
                                            Conexões com investidores e empreendedores da comunidade cripto.
                                        </p>
                                    </CardContent>
                                </Card>

                                <Card className="fluorescent-card fade-in-right" data-delay="0.4s" >
                                    <CardContent className="p-8">
                                        <Eye className="w-12 h-12 text-cyan-400 mb-4" />
                                        <h3 className="text-xl font-bold mb-4">Transparência Total</h3>
                                        <p className="text-white/70 mb-4">
                                            Dashboard público com todas as operações.
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
                                <h2 className="text-4xl md:text-6xl font-bold mb-8 fade-in-up" data-delay="0.4s" >ROADMAP</h2>
                                <p className="text-xl text-white/80 max-w-3xl mx-auto fade-in-down" data-delay="0.6s" >
                                    Nossa jornada para construir o oásis da nova economia digital
                                </p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                                <Card className="fluorescent-card fade-in-left" data-delay="1s">
                                    <CardContent className="p-8">
                                        <Badge className="bg-green-500/20 text-green-400 mb-4">Q4 2025 — Lançamento (em preparo | nov/01)</Badge>
                                        <h3 className="text-xl font-bold mb-4">Lançamento</h3>
                                        <ul className="text-white/70 space-y-2 text-sm">
                                            <li>• Mint Genesis (350)</li>
                                            <li>• Criação da comunidade VIP Genesis</li>
                                            <li>• Dashboard de transparência</li>
                                            <li>• Regras do Programa + Política de Tesouraria</li>
                                            <li>• Distribuições iniciais (perks & kits)</li>
                                        </ul>
                                    </CardContent>
                                </Card>

                                <Card className="fluorescent-card fade-in-left" data-delay="0.6s" >
                                    <CardContent className="p-8">
                                        <Badge className="bg-yellow-500/20 text-yellow-400 mb-4">Q4 2025 - Q1 2026 - Expansão (pós mint)</Badge>
                                        <h3 className="text-xl font-bold mb-4">Expansão</h3>
                                        <ul className="text-white/70 space-y-2 text-sm">
                                            <li>• Calendário de aulas premium e mentorias</li>
                                            <li>• Votações regulares</li>
                                            <li>• Perks trimestrais com parceiros</li>
                                            <li>• Meetups & networking de comunidade</li>
                                            <li>• Programa de vantagens: avaliar distribuições eventuais quando houver excedente de caixa e aprovação em governança</li>
                                        </ul>
                                    </CardContent>
                                </Card>

                                <Card className="fluorescent-card fade-in-right" data-delay="0.6s" >
                                    <CardContent className="p-8">
                                        <Badge className="bg-blue-500/20 text-blue-400 mb-4">Q1 - Q2 - 2026 - Inovação (planejado)</Badge>
                                        <h3 className="text-xl font-bold mb-4">Inovação</h3>
                                        <ul className="text-white/70 space-y-2 text-sm">
                                            <li>• Marketplace de utilidades (whitelists, descontos, kits)</li>
                                            <li>• Delegação de voto e roles avançadas no Discord</li>
                                            <li>• Integrações on-chain (verificação e transparência)</li>
                                            <li>• Parcerias externas e cocriar trilhas com especialistas</li>
                                        </ul>
                                    </CardContent>
                                </Card>

                                <Card className="fluorescent-card fade-in-right" data-delay="1s" >
                                    <CardContent className="p-8">
                                        <Badge className="bg-purple-500/20 text-purple-400 mb-4">Q3-Q4 2026 - Evolução (futuro)</Badge>
                                        <h3 className="text-xl font-bold mb-4">Evolução</h3>
                                        <ul className="text-white/70 space-y-2 text-sm">
                                            <li>• Evento anual Cripto Oasis</li>
                                            <li>• DAO completa</li>
                                            <li>• Informe anual de desenvolvimento do ecossistema</li>
                                            <li>• Roadmap 2027 definido pela assembleia de holders</li>
                                        </ul>
                                    </CardContent>
                                </Card>
                            </div>
                        </div>
                    </section>

                    {/* FAQ Section */}
                    <section id="faq" className="py-16 px-4">
                        <div className="container mx-auto max-w-4xl">
                            <div className="text-center mb-16">
                                <h2 className="text-4xl md:text-6xl font-bold mb-8 gradient-text fade-in-right" data-delay="0.6s" >PERGUNTAS FREQUENTES</h2>
                            </div>

                            <div className="space-y-6">
                                <Card className="bg-white/5 border-white/10 fade-in-left" data-delay="0.9s">
                                    <CardContent className="p-8">
                                        <h3 className="text-xl font-bold mb-4">Os benefícios são realmente vitalícios?</h3>
                                        <p className="text-white/70">
                                            Sim! Uma vez holder, você mantém acesso permanente ao grupo VIP, distribuição de lucros, brindes e todos os benefícios.
                                            Não há taxas recorrentes ou renovações.
                                        </p>
                                    </CardContent>
                                </Card>

                                <Card className="bg-white/5 border-white/10  fade-in-left" data-delay="0.8s">
                                    <CardContent className="p-8">
                                        <h3 className="text-xl font-bold mb-4">Como posso acompanhar as operações?</h3>
                                        <p className="text-white/70">
                                            Teremos um dashboard público, onde todos poderão acompanhar a performance do ecossistema. Transparência total é o nosso compromisso.
                                        </p>
                                    </CardContent>
                                </Card>

                                <Card className="bg-white/5 border-white/10 fade-in-left" data-delay="0.7s">
                                    <CardContent className="p-8">
                                        <h3 className="text-xl font-bold mb-4">Qual a diferença para outras NFTs?</h3>
                                        <p className="text-white/70">
                                            Enquanto a maioria promete utilidade futura, nós entregamos valor real desde o dia 1. Modelo econômico sustentável,
                                            transparência total e benefícios tangíveis comprovados.
                                        </p>
                                    </CardContent>
                                </Card>

                                <Card className="bg-white/5 border-white/10 fade-in-left" data-delay="0.6s">
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



                    {/* Footer */}
                    <Footer/>
                </div>
            </div>
        </>
    );
}
