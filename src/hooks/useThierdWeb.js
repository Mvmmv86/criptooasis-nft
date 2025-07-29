import {createThirdwebClient} from "thirdweb";
import { useActiveAccount } from "thirdweb/react";
import {sepolia, ethereum} from "thirdweb/chains";
import { ethers6Adapter } from "thirdweb/adapters/ethers6";
import {useEffect, useState} from "react";

export const useThierdweb = () => {
    const account = useActiveAccount();

    const environments = import.meta.env;
    const chain = environments.VITE_CHAIN_NAME === 'sepolia' ? sepolia : ethereum;

    const client = createThirdwebClient({
        clientId: environments.VITE_THIRD_WEB_CLIENT_ID ,
        secretKey: environments.VITE_THIRD_WEB_SECRET
    });

    const [signer, setSigner] = useState(null);

    useEffect(() => {
        if(!client || !chain || !account) {

            setSigner(null);
            return;
        }

        if (signer) {
            return;
        }

        (async () => {
            const signer = await ethers6Adapter.signer.toEthers({
                client,
                chain: chain,
                account,
            });

            setSigner(signer);
        })();
    }, [client, chain, account, signer]);

    return {
        client,
        account,
        chain,
        signer
    };
}