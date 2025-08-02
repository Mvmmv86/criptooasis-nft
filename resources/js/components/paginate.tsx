import { ChevronRightIcon, ChevronLeftIcon } from 'lucide-react';
interface PaginateProps {
    page:number;
    lastPage: number;
    links: {
        url: string;
        active: boolean;
        label: string;
    }[]
}
export default function Paginate({page, lastPage, links}: PaginateProps) {
    if (lastPage <= 1) {
        return null;
    }

    const previous = links[0];
    const next = links[links.length - 1];

    return (
        <div className="flex items-center justify-between px-4 py-3 sm:px-6">
            <div className="flex flex-1 justify-between sm:hidden">
                <div>
                    {page > 1 && (
                        <a
                            href={previous.url}
                            className="relative inline-flex items-center rounded-md border px-4 py-2 text-sm font-medium hover:bg-sidebar-accent"
                        >
                            Previous
                        </a>
                    )}
                </div>
                <div>
                    {page < lastPage && (
                        <a
                            href={next.url}
                            className="relative ml-3 inline-flex items-center rounded-md border px-4 py-2 text-sm font-medium hover:bg-sidebar-accent"
                        >
                            Next
                        </a>
                    )}
                </div>
            </div>
            <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-end">
                <div>
                    <nav aria-label="Pagination" className="isolate inline-flex -space-x-px rounded-md shadow-xs">
                        {links.map((link, index) => (
                            <a
                                key={index}
                                href={link.url ?? '#'}
                                aria-current="page"
                                className="relative inline-flex items-center px-4 py-2 text-sm font-semibold border hover:bg-sidebar-accent focus:z-20 focus:outline-offset-0"
                                {...(+link.label === page && {
                                    className: 'bg-sidebar relative inline-flex items-center px-4 py-2 text-sm font-semibold border hover:bg-sidebar-accent focus:z-20 focus:outline-offset-0'
                                })}
                            >
                                {index === 0 ? (
                                    <ChevronLeftIcon aria-hidden="true" className="size-5" />
                                ) : (index === links.length - 1 ? (
                                    <ChevronRightIcon aria-hidden="true" className="size-5" />
                                ) : link.label)}
                            </a>
                        ))}
                    </nav>
                </div>
            </div>
        </div>
    )
}
