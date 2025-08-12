import { type BreadcrumbItem } from '@/types';
import { Switch, } from '@headlessui/react';
import { Head } from '@inertiajs/react';
import { useEffect, useState } from 'react';

import HeadingSmall from '@/components/heading-small';
import AppLayout from '@/layouts/app-layout';
import SettingsLayout from '@/layouts/settings/layout';
import { useThierdWeb } from '@/hooks/useThierdWeb';
import { ConnectButton, lightTheme } from 'thirdweb/react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Contract settings',
        href: '/settings/contract',
    },
];

export default function Contract() {

    const { fetchPaused, pause, unpause, account, client, chain } = useThierdWeb();

    const [isPaused, setIsPaused] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const load = async() => {
        setIsLoading(true);

        const isPaused = await fetchPaused();

        setIsPaused(isPaused);
        setIsLoading(false);
    }

    const onChangeStatus = async (value: boolean) => {
        setIsLoading(true);

        try {
            if (value) {
                const pauseContract = await pause();
                console.log(pauseContract);
                if (pauseContract?.status === 'success') {
                    setIsPaused(true);
                }
            } else {
                const unpauseContract = await unpause();

                if (unpauseContract?.status === 'success') {
                    setIsPaused(false);
                }
            }
        }catch (error) {
            console.error(error);
        }

        setIsLoading(false);
    }

    useEffect(() => {
        load();
    }, []);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Contract settings" />

            <SettingsLayout>
                <div className="space-y-6">
                    <div className="flex items-center gap-2 justify-between">
                        <HeadingSmall title="Contract information" description="Update status from your contract" />
                        <div>
                            <ConnectButton client={client} theme={lightTheme({
                                colors: {
                                    modalBg: "white",
                                },
                            })} chain={chain}/>
                        </div>
                    </div>

                    {account && (
                        <div>
                            {isLoading ? (
                                <div className="w-36 h-8 bg-sidebar-accent animate-pulse rounded"></div>
                            ) : (
                                <div className="flex items-center gap-4">
                                    <span>{ isPaused ? 'Unpause' : 'Pause' }</span>
                                    <Switch
                                        checked={isPaused}
                                        onChange={(value) => onChangeStatus(value)}
                                        className="group relative flex h-7 w-14 cursor-pointer rounded-full bg-white/10 p-1 ease-in-out focus:not-data-focus:outline-none data-checked:bg-white/10 data-focus:outline data-focus:outline-white"
                                    >
                                      <span
                                          aria-hidden="true"
                                          className="pointer-events-none inline-block size-5 translate-x-0 rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out group-data-checked:translate-x-7"
                                      />
                                    </Switch>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </SettingsLayout>
        </AppLayout>
    );
}
