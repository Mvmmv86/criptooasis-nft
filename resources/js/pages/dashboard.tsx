import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem, NFT } from '@/types';
import { Head } from '@inertiajs/react';
import Paginate from '@/components/paginate';
import { toEther } from 'thirdweb';
import { useCallback, useEffect, useState } from 'react';
import { toBigInt } from 'ethers';
import { useThierdWeb } from '@/hooks/useThierdWeb';
import ShowNft from '@/components/show-nft';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
];

interface Pagination {
    data: NFT[],
    current_page: number,
    last_page:number,
    links: {
        url: string;
        active: boolean;
        label: string;
    }[]
}

interface DashboardProps {
    nfts: Pagination
}

export default function Dashboard({ nfts }: DashboardProps) {

    const [maxSupply, setMaxSupply] = useState(toBigInt(0));
    const [currentSupply, setCurrentSupply] = useState(toBigInt(0));
    const [treasuryWalletBalance, setTreasuryWalletBalance] = useState('');
    const [royaltyWalletBalance, setRoyaltyWalletBalance] = useState('');
    const [isLoadingSupply, setIsLoadingSupply] = useState(false);
    const [isLoadingWalletBalance, setIsLoadingWalletBalance] = useState(false);

    const {
        contract,
        fetchCurrentSupply,
        fetchMaxSupply,
        fetchRoyaltyBalance,
        fetchTreasuryBalance,
        TREASURY_ADDRESS,
        ROYALTY_ADDRESS
    } = useThierdWeb();

    const supplyData = useCallback(async () => {
        setIsLoadingSupply(true);

        const maxSupply = await fetchMaxSupply();
        const currentSupply = await fetchCurrentSupply();

        setMaxSupply(maxSupply);
        setCurrentSupply(currentSupply);
        setIsLoadingSupply(false);
    },[contract]);

    const walletBalances = useCallback(async () => {
        setIsLoadingWalletBalance(true);

        const treasuryAddress = await fetchTreasuryBalance();
        const royaltyAddress = await fetchRoyaltyBalance();

        setRoyaltyWalletBalance(toEther(royaltyAddress));
        setTreasuryWalletBalance(toEther(treasuryAddress));
        setIsLoadingWalletBalance(false);
    }, []);

    useEffect(() => {
        supplyData();
        walletBalances();
    }, []);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4 overflow-x-auto">
                <div className="grid auto-rows-min gap-4 md:grid-cols-3">
                    <div
                        className="p-4 flex flex-col gap-2 rounded-xl border border-sidebar-border/70 dark:border-sidebar-border">
                        <h2 className="font-bold">Total Supply</h2>
                        {isLoadingSupply ? (
                            <div className="w-36 h-6 bg-sidebar-accent animate-pulse rounded"></div>
                        ) : (
                            <p>{Number(maxSupply)}</p>
                        )}
                    </div>
                    <div
                        className="p-4 flex flex-col gap-2 rounded-xl border border-sidebar-border/70 dark:border-sidebar-border">
                        <h2 className="font-bold">Total Minted</h2>
                        {isLoadingSupply ? (
                            <div className="w-36 h-6 bg-sidebar-accent animate-pulse rounded"></div>
                        ) : (
                            <p>{Number(currentSupply)}</p>
                        )}
                    </div>
                    <div
                        className="p-4 flex flex-col gap-2 rounded-xl border border-sidebar-border/70 dark:border-sidebar-border">
                        <h2 className="font-bold">Total Remaining</h2>
                        {isLoadingSupply ? (
                            <div className="w-36 h-6 bg-sidebar-accent animate-pulse rounded"></div>
                        ) : (
                            <p>{Number(maxSupply) - Number(currentSupply)}</p>
                        )}
                    </div>
                </div>
                <div className="grid auto-rows-min gap-4 md:grid-cols-2">
                    <div
                        className="p-4 flex flex-col gap-2 rounded-xl border border-sidebar-border/70 dark:border-sidebar-border">
                        <div className="flex justify-between gap-2 items-center">
                            <h2 className="font-bold">Treasury Wallet</h2>
                            <a target="_blank" href={'https://etherscan.io/address/' + TREASURY_ADDRESS}>{TREASURY_ADDRESS}</a>
                        </div>
                        {isLoadingWalletBalance ? (
                            <div className="w-36 h-6 bg-sidebar-accent animate-pulse rounded"></div>
                        ) : (
                            <p>{Number(treasuryWalletBalance)}</p>
                        )}
                    </div>
                    <div
                        className="p-4 flex flex-col gap-2 rounded-xl border border-sidebar-border/70 dark:border-sidebar-border">
                        <div className="flex justify-between gap-2 items-center">
                            <h2 className="font-bold">Royalty Wallet</h2>
                            <a target="_blank" href={"https://etherscan.io/address/" + ROYALTY_ADDRESS}>{ROYALTY_ADDRESS}</a>
                        </div>
                        {isLoadingWalletBalance ? (
                            <div className="w-36 h-6 bg-sidebar-accent animate-pulse rounded"></div>
                        ) : (
                            <p>{Number(royaltyWalletBalance)}</p>
                        )}
                    </div>
                </div>
                <div
                    className="relative flex-1 overflow-x-auto rounded-xl border border-sidebar-border/70 dark:border-sidebar-border ">
                    <table className="table-auto w-full text-left whitespace-nowrap">
                        <thead>
                        <tr>
                            <th className="p-4 w-fit">Token ID</th>
                            <th className="p-4">Image</th>
                            <th className="p-4">Name</th>
                            <th className="p-4">Description</th>
                            <th className="p-4">Owner</th>
                        </tr>
                        </thead>
                        <tbody>
                        {
                            nfts.data.map((item, index) => (
                                <tr key={index} className="border-y">
                                    <td className="p-4 w-fit">
                                        <span>{item.token_id ?? '--'}</span>
                                    </td>
                                    <td className="p-4">
                                        <div className="w-32 h-32">
                                            <img src={item.image_url} className="w-full h-full" />
                                        </div>
                                    </td>
                                    <td className="p-4">
                                        <ShowNft nft={item}/>
                                    </td>
                                    <td className="p-4">
                                        <span className="line-clamp-1">{item.description}</span>
                                    </td>
                                    <td className="p-4">
                                        {item.owner
                                            ? (
                                                <a target="_blank"
                                                   href={"https://etherscan.io/address/" + item.owner}>{item.owner}</a>
                                            ) : (
                                                <span>None</span>
                                            )}
                                    </td>
                                </tr>
                            ))
                        }
                        </tbody>
                    </table>
                </div>
                <Paginate page={nfts?.current_page || 1} lastPage={nfts?.last_page || 0} links={nfts?.links || []} />
            </div>
        </AppLayout>
    );
}
