import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { NFT } from '@/types';

interface ShowNFTProps {
    nft: NFT
}

export default function ShowNft({ nft }: ShowNFTProps) {
    return (
        <Dialog>
            <DialogTrigger asChild>
                <a href="#" className="hover:underline">{ nft.name }</a>
            </DialogTrigger>
            <DialogContent className="w-full sm:max-w-2xl">
                <div className="mt-8 flex gap-2">
                    <div className="rounded-xl overflow-hidden">
                        <div className="w-60 h-60">
                            <img src={nft.image_url} className="w-full h-full" />
                        </div>
                    </div>
                    <div
                        className="p-2 flex-1 flex flex-col gap-2">
                        <h2 className="font-bold">#{nft.uri}</h2>
                        <p>{nft.name}</p>
                        <p className="text-sm">{nft.description}</p>
                        <hr className="my-2"/>
                        <h2 className="font-bold">Attributes:</h2>
                        <div className="mt-2 grid auto-rows-min gap-4 md:grid-cols-2">
                            {nft.attributes?.map((attribute: { trait_type: string, value: string }, index: number) => (
                                <div key={index} className="flex flex-col gap-2 p-4 rounded-xl border border-sidebar-border/70 dark:border-sidebar-border">
                                    <p className="font-semibold text-sm">{attribute.trait_type}</p>
                                    <p className="font-normal text-sm">{attribute.value}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
