import { useState, useEffect, useCallback } from 'react';
import { ethers } from 'ethers';
import detectEthereumProvider from '@metamask/detect-provider';

export const useWeb3 = () => {
    const [provider, setProvider] = useState(null);
    const [signer, setSigner] = useState(null);
    const [account, setAccount] = useState(null);
    const [chainId, setChainId] = useState(null);
    const [isConnected, setIsConnected] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    const connectWallet = useCallback(async () => {
        setIsLoading(true);
        setError(null);

        try {
            const ethereumProvider = await detectEthereumProvider();
            
            if (!ethereumProvider) {
                throw new Error('MetaMask não está instalado. Por favor, instale o MetaMask para continuar.');
            }

            const provider = new ethers.BrowserProvider(ethereumProvider);
            
            // Solicitar acesso às contas
            await provider.send("eth_requestAccounts", []);
            
            const signer = await provider.getSigner();
            const account = await signer.getAddress();
            const network = await provider.getNetwork();
            
            // Verificar se está na rede correta (Ethereum Mainnet = 1)
            // if (network.chainId !== 1n) {
            //     try {
            //         await ethereumProvider.request({
            //             method: 'wallet_switchEthereumChain',
            //             params: [{ chainId: '0x1' }], // Ethereum Mainnet
            //         });
            //     } catch (switchError) {
            //         throw new Error('Por favor, mude para a rede Ethereum Mainnet no MetaMask.');
            //     }
            // }
            
            setProvider(provider);
            setSigner(signer);
            setAccount(account);
            setChainId(Number(network.chainId));
            setIsConnected(true);
            
            // Salvar no localStorage
            localStorage.setItem('walletConnected', 'true');
            
            return { success: true, account };
        } catch (error) {
            console.error("Erro ao conectar carteira:", error);
            setError(error.message);
            return { success: false, error: error.message };
        } finally {
            setIsLoading(false);
        }
    }, []);

    const disconnectWallet = useCallback(() => {
        setProvider(null);
        setSigner(null);
        setAccount(null);
        setChainId(null);
        setIsConnected(false);
        setError(null);
        
        // Remover do localStorage
        localStorage.removeItem('walletConnected');
    }, []);

    const getBalance = useCallback(async () => {
        if (!provider || !account) return '0';
        
        try {
            const balance = await provider.getBalance(account);
            return ethers.formatEther(balance);
        } catch (error) {
            console.error("Erro ao obter saldo:", error);
            return '0';
        }
    }, [provider, account]);

    // Verificar se já estava conectado anteriormente
    useEffect(() => {
        const checkConnection = async () => {
            const wasConnected = localStorage.getItem('walletConnected');
            if (wasConnected === 'true') {
                try {
                    const ethereumProvider = await detectEthereumProvider();
                    if (ethereumProvider) {
                        const provider = new ethers.BrowserProvider(ethereumProvider);
                        const accounts = await provider.listAccounts();
                        
                        if (accounts.length > 0) {
                            await connectWallet();
                        }
                    }
                } catch (error) {
                    console.error("Erro ao reconectar:", error);
                }
            }
        };

        checkConnection();
    }, [connectWallet]);

    // Escutar mudanças de conta e rede
    useEffect(() => {
        const handleAccountsChanged = (accounts) => {
            if (accounts.length === 0) {
                disconnectWallet();
            } else if (accounts[0] !== account) {
                connectWallet();
            }
        };

        const handleChainChanged = () => {
            // Recarregar a página quando a rede mudar
            window.location.reload();
        };

        if (window.ethereum) {
            window.ethereum.on('accountsChanged', handleAccountsChanged);
            window.ethereum.on('chainChanged', handleChainChanged);

            return () => {
                window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
                window.ethereum.removeListener('chainChanged', handleChainChanged);
            };
        }
    }, [account, connectWallet, disconnectWallet]);

    return {
        provider,
        signer,
        account,
        chainId,
        isConnected,
        isLoading,
        error,
        connectWallet,
        disconnectWallet,
        getBalance
    };
};

