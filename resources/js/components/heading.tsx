import { ReactNode } from 'react';

export default function Heading({ title, description, action }: { title: string; description?: string, action?: ReactNode }) {
    return (
        <div className="mb-8 space-y-0.5">
            <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold tracking-tight">{title}</h2>
                {action}
            </div>
            {description && <p className="text-sm text-muted-foreground">{description}</p>}
        </div>
    );
}
