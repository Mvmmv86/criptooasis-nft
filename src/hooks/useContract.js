import { useState, useEffect, useCallback } from 'react';
import { ethers } from 'ethers';
import { useWeb3 } from './useWeb3';

// Endereço do contrato (será atualizado após deploy)
const CONTRACT_ADDRESS = "0x074714bdA7475235791258434Fb5737Fdc54b9d4"; // Placeholder

// ABI do contrato NFT
const CONTRACT_ABI = [
    "function mint(uint256 quantity) external payable",
    "function totalSupply() external view returns (uint256)",
    "function remainingSupply() external view returns (uint256)",
    "function MINT_PRICE() external view returns (uint256)",
    "function MAX_PER_WALLET() external view returns (uint256)",
    "function maxTotalSupply() external view returns (uint256)",
    "function totalCount() external view returns (uint256)",
    "function mintingActive() external view returns (bool)",
    "function mintedByWallet(address) external view returns (uint256)",
    "function canMint(address wallet, uint256 quantity) external view returns (bool)",
    "function owner() external view returns (address)",
    "function toggleMinting() external",
    "function emergencyWithdraw() external",
    "event NFTMinted(address indexed to, uint256 tokenId, uint256 quantity)",
    "event MintingStatusChanged(bool active)",
    "function claimCondition() view returns (uint256 currentStartId, uint256 count)"
];

export const useContract = () => {
    const { signer, provider, account } = useWeb3();
    const [contract, setContract] = useState(null);
    const [contractData, setContractData] = useState({
        totalSupply: 0,
        remainingSupply: 350,
        mintPrice: '0.08',
        maxPerWallet: 5,
        maxSupply: 350,
        mintingActive: true
    });
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    // Criar instância do contrato
    useEffect(() => {
        if (provider && CONTRACT_ADDRESS !== "0x0000000000000000000000000000000000000000") {
            try {
                const contractInstance = new ethers.Contract(
                    CONTRACT_ADDRESS,
                    CONTRACT_ABI,
                    signer || provider
                );

                setContract(contractInstance);
            } catch (error) {
                console.error("Erro ao criar contrato:", error);
                setError("Erro ao conectar com o contrato");
            }
        }
    }, [signer, provider]);

    // Buscar dados do contrato
    const fetchContractData = useCallback(async () => {
        if (!contract) {
            // Dados mockados para desenvolvimento
            setContractData({
                totalSupply: 129,
                remainingSupply: 221,
                mintPrice: '0.08',
                maxPerWallet: 5,
                maxSupply: 350,
                mintingActive: true
            });
            return;
        }

        try {
            setIsLoading(true);
            
            const [
                totalSupply,
                // remainingSupply,
                // mintPrice,
                // maxPerWallet,
                maxSupply,
                // mintingActive
            ] = await Promise.all([
                contract.totalSupply(),
                // contract.remainingSupply(),
                // contract.MINT_PRICE(),
                // contract.MAX_PER_WALLET(),
                contract.totalCount(),
                // contract.mintingActive()
            ]);

            console.log(maxSupply);

            setContractData({
                totalSupply: Number(totalSupply),
                // remainingSupply: Number(remainingSupply),
                // mintPrice: ethers.formatEther(mintPrice),
                // maxPerWallet: Number(maxPerWallet),
                maxSupply: Number(maxSupply),
                // mintingActive
            });
        } catch (error) {
            console.error("Erro ao buscar dados do contrato:", error);
            setError("Erro ao carregar dados do contrato");
        } finally {
            setIsLoading(false);
        }
    }, [contract]);

    // Função para mintar NFT
    const mintNFT = useCallback(async (quantity) => {
        if (!contract || !signer) {
            throw new Error("Contrato ou signer não disponível");
        }

        if (!contractData.mintingActive) {
            throw new Error("Mint não está ativo no momento");
        }

        try {
            setIsLoading(true);
            setError(null);

            // Calcular custo total
            const mintPrice = ethers.parseEther(contractData.mintPrice);
            const totalCost = mintPrice * BigInt(quantity);
            
            // Estimar gas
            const gasEstimate = await contract.mint.estimateGas(quantity, {
                value: totalCost
            });
            
            // Adicionar 20% de margem no gas
            const gasLimit = gasEstimate * 120n / 100n;

            // Executar transação
            const transaction = await contract.mint(quantity, {
                value: totalCost,
                gasLimit: gasLimit
            });

            return transaction;
        } catch (error) {
            console.error("Erro no mint:", error);
            
            // Tratar erros específicos
            if (error.code === 'INSUFFICIENT_FUNDS') {
                throw new Error("Saldo insuficiente para completar a transação");
            } else if (error.message.includes('Max supply exceeded')) {
                throw new Error("Quantidade excede o supply máximo");
            } else if (error.message.includes('Exceeds max per wallet')) {
                throw new Error("Quantidade excede o limite por carteira");
            } else if (error.message.includes('Incorrect ETH value')) {
                throw new Error("Valor em ETH incorreto");
            } else {
                throw new Error(error.message || "Erro desconhecido no mint");
            }
        } finally {
            setIsLoading(false);
        }
    }, [contract, signer, contractData]);

    // Verificar se pode mintar
    const canMint = useCallback(async (walletAddress, quantity) => {
        if (!contract || !walletAddress) return false;
        return false;
        try {
            return await contract.canMint(walletAddress, quantity);
        } catch (error) {
            console.error("Erro ao verificar elegibilidade:", error);
            return false;
        }
    }, [contract]);

    // Obter quantidade já mintada por uma carteira
    const getMintedByWallet = useCallback(async (walletAddress) => {
        if (!contract || !walletAddress) return 0;
        
        try {
            const minted = await contract.mintedByWallet(walletAddress);
            return Number(minted);
        } catch (error) {
            console.error("Erro ao obter quantidade mintada:", error);
            return 0;
        }
    }, [contract]);

    // Verificar se é o owner do contrato
    const isOwner = useCallback(async () => {
        if (!contract || !account) return false;
        
        try {
            const owner = await contract.owner();
            return owner.toLowerCase() === account.toLowerCase();
        } catch (error) {
            console.error("Erro ao verificar ownership:", error);
            return false;
        }
    }, [contract, account]);

    // Alternar status do minting (apenas owner)
    const toggleMinting = useCallback(async () => {
        if (!contract || !signer) {
            throw new Error("Contrato ou signer não disponível");
        }

        try {
            const transaction = await contract.toggleMinting();
            await transaction.wait();
            await fetchContractData(); // Atualizar dados
            return transaction;
        } catch (error) {
            console.error("Erro ao alternar minting:", error);
            throw error;
        }
    }, [contract, signer, fetchContractData]);

    // Retirar fundos (apenas owner)
    const withdrawFunds = useCallback(async () => {
        if (!contract || !signer) {
            throw new Error("Contrato ou signer não disponível");
        }

        try {
            const transaction = await contract.emergencyWithdraw();
            await transaction.wait();
            return transaction;
        } catch (error) {
            console.error("Erro ao retirar fundos:", error);
            throw error;
        }
    }, [contract, signer]);

    // Carregar dados iniciais
    useEffect(() => {
        fetchContractData();
    }, [fetchContractData]);

    return {
        contract,
        contractData,
        isLoading,
        error,
        mintNFT,
        canMint,
        getMintedByWallet,
        isOwner,
        toggleMinting,
        withdrawFunds,
        fetchContractData,
        CONTRACT_ADDRESS
    };
};

