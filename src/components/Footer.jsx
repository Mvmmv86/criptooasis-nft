import React from 'react';
import { Twitter, MessageCircle, Globe } from 'lucide-react'; // Assuming you're using lucide-react for icons
import NavLogo from './NavLogo'; // Adjust this path based on where NavLogo.jsx is located

const Footer = () => {
  return (
    <footer className="py-12 px-4 border-t border-white/10">
      <div className="container mx-auto text-center">
        {/* NavLogo component replacing the CO div and text */}
        <div className="flex items-center justify-center mb-6">
          <NavLogo /> 
        </div>

        <div className="flex justify-center space-x-6 mb-6">
          <a href="#" className="text-white/70 hover:text-white transition-colors" aria-label="Twitter">
            <Twitter size={24} />
          </a>
          <a href="#" className="text-white/70 hover:text-white transition-colors" aria-label="Telegram or Messaging App">
            <MessageCircle size={24} />
          </a>
          <a href="#" className="text-white/70 hover:text-white transition-colors" aria-label="Website or Globe">
            <Globe size={24} />
          </a>
        </div>

        <p className="text-white/60 text-sm">
          © 2025 CriptoOasis Genesis. Todos os direitos reservados.
        </p>
      </div>
    </footer>
  );
};

export default Footer;