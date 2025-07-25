import {createThirdwebClient, getContract} from "thirdweb";
import { useActiveAccount, useReadContract } from "thirdweb/react";
import {sepolia, ethereum} from "thirdweb/chains";

export const useThierdweb = () => {
    const account = useActiveAccount();

    const environments = import.meta.env;

    const client = createThirdwebClient({
        clientId: environments.VITE_THIRD_WEB_CLIENT_ID ,
        secretKey: environments.VITE_THIRD_WEB_SECRET
    });

    const contract = getContract({
        address: environments.VITE_CONTRACT_ADDRESS,
        chain: environments.VITE_CHAIN_NAME === 'sepolia' ? sepolia : ethereum,
        client: client,
    });

    return {
        client,
        account,
        contract,
    };
}