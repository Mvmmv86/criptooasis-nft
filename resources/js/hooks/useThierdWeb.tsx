import { createThirdwebClient, getContract, readContract } from 'thirdweb';
import { useActiveAccount } from "thirdweb/react";
import {sepolia, ethereum} from "thirdweb/chains";
import { ethers6Adapter } from "thirdweb/adapters/ethers6";
import { useMemo } from 'react';

export const useThierdWeb = () => {
    const account = useActiveAccount();

    const environments = import.meta.env;
    const CONTRACT_ADDRESS = environments.VITE_CONTRACT_ADDRESS;
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
        fetchOwnerOf
    };
}
