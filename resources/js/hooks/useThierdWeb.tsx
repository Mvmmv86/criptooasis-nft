import {
    createThirdwebClient,
    getContract,
    prepareContractCall,
    readContract,
    sendTransaction,
    waitForReceipt
} from 'thirdweb';
import { useActiveAccount } from "thirdweb/react";
import {sepolia, ethereum} from "thirdweb/chains";
import { ethers6Adapter } from "thirdweb/adapters/ethers6";
import { useMemo } from 'react';
import { getRpcClient, eth_getBalance } from "thirdweb/rpc";

export const useThierdWeb = () => {
    const account = useActiveAccount();

    const environments = import.meta.env;
    const CONTRACT_ADDRESS = environments.VITE_CONTRACT_ADDRESS;
    const TREASURY_ADDRESS = environments.VITE_TREASURY_ADDRESS;
    const ROYALTY_ADDRESS = environments.VITE_ROYALTY_ADDRESS;
    const chain = useMemo(() =>
            environments.VITE_CHAIN_NAME === 'sepolia' ? sepolia : ethereum,
        []);

    const client = useMemo(() => createThirdwebClient({
        clientId: environments.VITE_THIRD_WEB_CLIENT_ID,
        secretKey: environments.VITE_THIRD_WEB_SECRET,
    }), []);

    const contract = getContract({
        client,
        address: CONTRACT_ADDRESS,
        chain: chain,
    });

    const rpcRequest = getRpcClient({ client, chain });

    const fetchSigner = async () => {
        if(!client || !chain || !account) {
            return null;
        }

        return await ethers6Adapter.signer.toEthers({
            client,
            chain: chain,
            account,
        });
    }

    const fetchMaxSupply = async () => {
        return await readContract({
            contract,
            method: "function maxSupply() view returns (uint256)",
            params: [],
        });
    };

    const fetchCurrentSupply = async () => {
        return await readContract({
            contract,
            method: "function getCurrentSupply() external view returns (uint256)",
            params: []
        });
    };

    const fetchMinPrice = async () => {
        return await readContract({
            contract,
            method: "function minPrice() external view returns (uint256)",
            params: []
        })
    };

    const fetchMaxPerWallet = async () => {
        return await readContract({
            contract,
            method: "function maxPerWallet() external view returns (uint256)",
            params: []
        })
    }

    const fetchMintedPerWallet = async (address: string) => {
        return await readContract({
            contract,
            method: "function getAmountMinted(address) external view returns (uint256)",
            params: [address]
        })
    }

    const fetchOwnerOf = async (tokenUri: string) => {
        return await readContract({
            contract,
            method: "function ownerOf(uint256) view returns (address)",
            params: [BigInt(tokenUri)]
        });
    }

    const fetchBalance = async (address: string) => {
        return await eth_getBalance(rpcRequest, {
            address: address,
        });
    }

    const fetchTreasuryBalance = async () => {
        return fetchBalance(TREASURY_ADDRESS);
    }

    const fetchRoyaltyBalance = async () => {
        return fetchBalance(ROYALTY_ADDRESS);
    }

    const fetchPaused = async () => {
        return await readContract({
            contract,
            method: "function paused() view returns (bool)",
            params: []
        });
    }

    const pause = async () => {
        console.log(account);
        if (!account) {
            return;
        }

        const transaction = prepareContractCall({
            contract,
            method: "function pause()",
            params: [],
        });

        const tx =  await sendTransaction({account, transaction});

        return await waitForReceipt({...tx, maxBlocksWaitTime: 3});
    }

    const unpause = async () => {
        if (!account) {
            return;
        }

        const transaction = prepareContractCall({
            contract,
            method: "function unpause()",
            params: [],
        });

        const tx = await sendTransaction({account, transaction});

        return await waitForReceipt({...tx, maxBlocksWaitTime: 3});
    }

    return {
        client,
        account,
        chain,
        contract,
        fetchSigner,
        fetchCurrentSupply,
        fetchMaxSupply,
        fetchMinPrice,
        fetchMaxPerWallet,
        fetchMintedPerWallet,
        fetchOwnerOf,
        fetchBalance,
        fetchRoyaltyBalance,
        fetchTreasuryBalance,
        fetchPaused,
        pause,
        unpause,
        TREASURY_ADDRESS,
        ROYALTY_ADDRESS
    };
}
