import {createThirdwebClient, getContract} from "thirdweb";
import { useActiveAccount, useReadContract } from "thirdweb/react";
import {sepolia} from "thirdweb/chains";

export const useThierdweb = () => {
    const account = useActiveAccount();

    const client = createThirdwebClient({
        clientId: "72c66260fe3da5277b59af3b5d1c3e0c" ,
        secretKey: "iQiC4baW0gbAVFXVP645R4vUXEmgXrmkF3CeHvTOKln-HLEtVBSDT9XerEo3_omltaabskD128MmCA5Vijx1JA"
    });

    const contract = getContract({
        address: "0xecD23B7F4129523701708302877Ea49434EeCebB",
        chain: sepolia,
        client: client,
    });

    return {
        client,
        account,
        contract,
    };
}