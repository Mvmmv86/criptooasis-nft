import '../css/app.css';

import { createInertiaApp } from '@inertiajs/react';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import { createRoot } from 'react-dom/client';
import { initializeTheme } from './hooks/use-appearance';
import { ThirdwebProvider } from "thirdweb/react";
import {sepolia, ethereum} from "thirdweb/chains";
import { StrictMode } from 'react'

const appName = import.meta.env.VITE_APP_NAME || 'Laravel';
const chainName = import.meta.env.VITE_CHAIN_NAME || 'ethereum';

createInertiaApp({
    title: (title) => title ? `${title} - ${appName}` : appName,
    resolve: (name) => resolvePageComponent(`./pages/${name}.tsx`, import.meta.glob('./pages/**/*.tsx')),
    setup({ el, App, props }) {
        const root = createRoot(el);

        root.render(
            <ThirdwebProvider activeChain={chainName === 'sepolia' ? sepolia : ethereum}>
                <StrictMode>
                    <App {...props} />
                </StrictMode>
            </ThirdwebProvider>
        );
    },
    progress: {
        color: '#4B5563',
    },
});

// This will set light / dark mode on load...
initializeTheme();
