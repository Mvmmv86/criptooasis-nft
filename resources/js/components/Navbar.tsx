import React from 'react';
import { Twitter, MessageCircle } from 'lucide-react';
import { ConnectButton } from "thirdweb/react";
import { useThierdWeb } from "@/hooks/useThierdWeb";
import { lightTheme } from "thirdweb/react";
import NavLogo from './NavLogo';

const Navbar = ({ showScrollButtons = false, scrollToSection = null }) => {
    const {client, chain} = useThierdWeb();

    return (
        <nav className="fixed top-0 w-full z-50 bg-black/20 backdrop-blur-md border-b border-white/10">
            <div className="container mx-auto px-4 py-4 flex justify-between items-center">
                <NavLogo />

                <div className="hidden md:flex space-x-6">
                    {showScrollButtons ? (
                        <>
                            <button onClick={() => scrollToSection('mint')} className="hover:text-yellow-400 transition-colors">Mint</button>
                            <button onClick={() => scrollToSection('about')} className="hover:text-yellow-400 transition-colors">Sobre</button>
                            <button onClick={() => scrollToSection('benefits')} className="hover:text-yellow-400 transition-colors">Benefícios</button>
                            <button onClick={() => scrollToSection('roadmap')} className="hover:text-yellow-400 transition-colors">Roadmap</button>
                            <button onClick={() => scrollToSection('faq')} className="hover:text-yellow-400 transition-colors">FAQ</button>
                        </>
                    ) : (
                        <>
                            <a href="/" className="hover:text-yellow-400 transition-colors">Mint</a>
                            <a href="/" className="hover:text-yellow-400 transition-colors">Sobre</a>
                            <a href="/" className="hover:text-yellow-400 transition-colors">Benefícios</a>
                            <a href="/" className="hover:text-yellow-400 transition-colors">Roadmap</a>
                            <a href="/" className="hover:text-yellow-400 transition-colors">FAQ</a>
                        </>
                    )}
                    <a href="/ranking" className="hover:text-yellow-400 transition-colors">Ranking</a>
                </div>

                <div className="flex items-center space-x-4">
                    <a href="#" className="text-white/70 hover:text-white transition-colors">
                        <Twitter size={20}/>
                    </a>
                    <a href="#" className="text-white/70 hover:text-white transition-colors">
                        <MessageCircle size={20}/>
                    </a>
                    <div><ConnectButton client={client} theme={lightTheme({
                        colors: {
                            modalBg: "white",
                        },
                    })} chain={chain}/></div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
