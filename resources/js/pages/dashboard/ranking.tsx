import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem, NFT } from '@/types';
import { Head } from '@inertiajs/react';
import Paginate from '@/components/paginate';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Ranking',
        href: '/ranking',
    },
];

interface Pagination {
    data: {
        total: number,
        owner: string
    }[],
    current_page: number,
    last_page:number,
    links: {
        url: string;
        active: boolean;
        label: string;
    }[]
}

interface RankingProps {
    owners: Pagination,
    tops: {
        total: number,
        owner: string
    }[]
}

export default function Ranking({ owners, tops }: RankingProps) {

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Ranking" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4 overflow-x-auto">
                <div className="grid auto-rows-min gap-4 md:grid-cols-3">
                    <div
                        className="p-4 flex flex-col gap-2 rounded-xl border border-sidebar-border/70 dark:border-sidebar-border">
                        <h2 className="font-bold">Top 1</h2>
                        <p>{tops?.[0]?.owner ?? '--'}</p>
                    </div>
                    <div
                        className="p-4 flex flex-col gap-2 rounded-xl border border-sidebar-border/70 dark:border-sidebar-border">
                        <h2 className="font-bold">Top 2</h2>
                        <p>{tops?.[1]?.owner ?? '--'}</p>
                    </div>
                    <div
                        className="p-4 flex flex-col gap-2 rounded-xl border border-sidebar-border/70 dark:border-sidebar-border">
                        <h2 className="font-bold">Top 3</h2>
                        <p>{tops?.[2]?.owner ?? '--'}</p>
                    </div>
                </div>
                <div
                    className="relative flex-1 overflow-x-auto rounded-xl border border-sidebar-border/70 dark:border-sidebar-border ">
                    <table className="table-auto w-full text-left whitespace-nowrap">
                        <thead>
                        <tr>
                            <th className="p-4 w-fit">Owner</th>
                            <th className="p-4">Quantity</th>
                        </tr>
                        </thead>
                        <tbody>
                        {
                            owners.data.map((item, index) => (
                                <tr key={index} className="border-y">
                                    <td className="p-4 w-fit">
                                        <span>{item.owner}</span>
                                    </td>
                                    <td className="p-4">
                                        <span>{item.total}</span>
                                    </td>
                                </tr>
                            ))
                        }
                        </tbody>
                    </table>
                </div>
                <Paginate page={owners?.current_page || 1} lastPage={owners?.last_page || 0} links={owners?.links || []} />
            </div>
        </AppLayout>
    );
}
