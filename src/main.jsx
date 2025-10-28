import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
<<<<<<< HEAD
import App from './App.jsx'
import { ThirdwebProvider } from "thirdweb/react";

createRoot(document.getElementById('root')).render(
  <StrictMode>
      <ThirdwebProvider>
          <App />
      </ThirdwebProvider>
  </StrictMode>,
=======
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
>>>>>>> origin/development
)
