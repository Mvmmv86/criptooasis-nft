import { useState, useEffect, useCallback } from 'react';
import { ethers } from 'ethers';
import {useThierdweb} from "@/hooks/useThierdWeb.js";

const environments = import.meta.env;

const CONTRACT_ADDRESS = environments.VITE_CONTRACT_ADDRESS;

const CONTRACT_ABI = [
    "function mint(uint256 quantity) external payable",
    "function maxSupply() external view returns (uint256)",
    "function getCurrentSupply() external view returns (uint256)",
    "function minPrice() external view returns (uint256)",
    "function maxPerWallet() external view returns (uint256)",
    "function isPaused() external view returns (bool)",
    "function getAmountMinted(address) external view returns (uint256)",
    "function owner() external view returns (address)",
    "event MintCompleted(uint256 tokenId, address owner)"
];

export const useContract = () => {
    const {account, signer} = useThierdweb();

    const [contract, setContract] = useState(null);
    const [contractData, setContractData] = useState({
        maxSupply: 0,
        currentSupply: 0,
        mintPrice: '0',
        maxPerWallet: 0,
    });
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!signer) {
            return;
        }

        try {
            const contractInstance = new ethers.Contract(
                CONTRACT_ADDRESS,
                CONTRACT_ABI,
                signer
            );
            setContract(contractInstance);
        } catch (error) {
            console.error("Erro ao criar contrato:", error);
            setError("Erro ao conectar com o contrato");
        }
    }, [signer]);

    const fetchContractData = useCallback(async () => {
        if (!contract) {
            return;
        }

        try {
            setIsLoading(true);

            console.log('Heree');
            const [
                maxSupply,
                currentSupply,
                mintPrice,
                maxPerWallet,
            ] = await Promise.all([
                contract.maxSupply(),
                contract.getCurrentSupply(),
                contract.minPrice(),
                contract.maxPerWallet(),
            ]);

            setContractData({
                maxSupply: Number(maxSupply),
                currentSupply: Number(currentSupply),
                mintPrice: ethers.formatEther(mintPrice),
                maxPerWallet: Number(maxPerWallet),
            });
        } catch (error) {
            console.error("Erro ao buscar dados do contrato:", error);
            setError("Erro ao carregar dados do contrato");
        } finally {
            setIsLoading(false);
        }
    }, [contract]);

    const mintNFT = useCallback(async (quantity) => {
        if (!contract || !signer) {
            throw new Error("Contrato ou signer não disponível");
        }

        try {
            setIsLoading(true);
            setError(null);

            const mintPrice = ethers.parseEther(contractData.mintPrice);
            const totalCost = mintPrice * BigInt(quantity);

            const transaction = await contract.mint(quantity, {
                value: totalCost,
            });

            const receipt = await transaction.wait();

            if (receipt.status !== 1) {
                throw new Error("Transação falhou ao ser minerada.");
            }

            return receipt;
        } catch (error) {

            if (error.code === 'INSUFFICIENT_FUNDS') {
                throw new Error("Saldo insuficiente para completar a transação");
            } else if (error.code === 'ACTION_REJECTED') {
                throw new Error("Operação cancelada");
            } else if (error.message.includes('Max supply exceeded')) {
                throw new Error("Quantidade excede o supply máximo");
            } else if (error.message.includes('Exceeds max per wallet')) {
                throw new Error("Quantidade excede o limite por carteira");
            } else if (error.message.includes('Incorrect ETH value')) {
                throw new Error("Valor em ETH incorreto");
            } else {
                throw new Error("Erro ao mintar a NFT, tente novamente");
            }
        } finally {
            setIsLoading(false);
        }
    }, [contract, signer, contractData]);

    const getMintedByWallet = useCallback(async (walletAddress) => {
        if (!contract || !walletAddress) return 0;
        
        try {
            const minted = await contract.getAmountMinted(walletAddress);
            return Number(minted);
        } catch (error) {
            console.error("Erro ao obter quantidade mintada:", error);
            return 0;
        }
    }, [contract]);

    const isOwner = useCallback(async () => {
        if (!contract || !account) return false;
        
        try {
            const owner = await contract.owner();

            return owner.toLowerCase() === account.address;
        } catch (error) {
            console.error("Erro ao verificar ownership:", error);
            return false;
        }
    }, [contract, account]);

    useEffect(() => {
        fetchContractData();
    }, [fetchContractData]);

    return {
        contract,
        contractData,
        isLoading,
        error,
        mintNFT,
        getMintedByWallet,
        isOwner,
        fetchContractData,
        CONTRACT_ADDRESS,
        isConnected: !!account
    };
};

