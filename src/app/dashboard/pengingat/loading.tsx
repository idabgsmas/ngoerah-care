export default function TableLoading() {
    return (
        <div className="space-y-6 animate-in fade-in duration-300">
            {/* Header skeleton */}
            <div className="flex items-center gap-3">
                <div className="skeleton h-10 w-10 rounded-full"></div>
                <div className="space-y-1.5">
                    <div className="skeleton h-6 w-48"></div>
                    <div className="skeleton h-4 w-80"></div>
                </div>
            </div>

            {/* Filter toolbar skeleton */}
            <div className="flex flex-wrap items-center gap-3">
                <div className="skeleton h-9 w-64"></div>
                <div className="skeleton h-9 w-36"></div>
                <div className="skeleton h-9 w-36"></div>
            </div>

            {/* Table skeleton */}
            <div className="rounded-md border dark:border-slate-800 bg-white dark:bg-slate-900">
                {/* Header row */}
                <div className="flex items-center gap-4 border-b px-4 py-3 bg-slate-50/50">
                    {[...Array(5)].map((_, i) => (
                        <div key={i} className="skeleton h-4 flex-1"></div>
                    ))}
                </div>
                {/* Data rows */}
                {[...Array(8)].map((_, i) => (
                    <div key={i} className="flex items-center gap-4 border-b px-4 py-3.5 last:border-0">
                        {[...Array(5)].map((_, j) => (
                            <div key={j} className={`skeleton h-4 flex-1 ${j === 0 ? 'max-w-[100px]' : ''}`}></div>
                        ))}
                    </div>
                ))}
            </div>

            {/* Pagination skeleton */}
            <div className="flex items-center justify-between">
                <div className="skeleton h-4 w-36"></div>
                <div className="flex gap-2">
                    <div className="skeleton h-9 w-24 rounded-md"></div>
                    <div className="skeleton h-9 w-24 rounded-md"></div>
                </div>
            </div>
        </div>
    )
}
