import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import AppRouter from './Router.jsx'
import { ThirdwebProvider } from "thirdweb/react";
import {sepolia, ethereum} from "thirdweb/chains";

const environments = import.meta.env;

createRoot(document.getElementById('root')).render(
    <ThirdwebProvider activeChain={environments.VITE_CHAIN_NAME === 'sepolia' ? sepolia : ethereum}>
      <StrictMode>
        <AppRouter />
      </StrictMode>
    </ThirdwebProvider>
)
