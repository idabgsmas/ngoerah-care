export default function DashboardLoading() {
    return (
        <div className="space-y-6 animate-in fade-in duration-300">
            {/* Header skeleton */}
            <div className="space-y-2">
                <div className="skeleton h-7 w-56"></div>
                <div className="skeleton h-4 w-96"></div>
            </div>

            {/* Stat cards skeleton */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {[...Array(4)].map((_, i) => (
                    <div key={i} className="rounded-lg border dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm border-l-4 border-l-slate-200 dark:border-l-slate-700">
                        <div className="flex items-center justify-between pb-2">
                            <div className="skeleton h-4 w-28"></div>
                            <div className="skeleton h-4 w-4 rounded-full"></div>
                        </div>
                        <div className="skeleton h-8 w-12 mt-2"></div>
                        <div className="skeleton h-3 w-36 mt-2"></div>
                    </div>
                ))}
            </div>

            {/* Table skeleton */}
            <div className="grid gap-4 lg:grid-cols-7">
                <div className="lg:col-span-4 rounded-lg border dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm">
                    <div className="skeleton h-5 w-44 mb-1"></div>
                    <div className="skeleton h-4 w-72 mb-4"></div>
                    <div className="space-y-3">
                        {[...Array(5)].map((_, i) => (
                            <div key={i} className="flex items-center gap-4">
                                <div className="skeleton h-7 w-7 rounded-full"></div>
                                <div className="flex-1 space-y-1.5">
                                    <div className="skeleton h-4 w-32"></div>
                                    <div className="skeleton h-3 w-20"></div>
                                </div>
                                <div className="skeleton h-5 w-16 rounded-full"></div>
                                <div className="skeleton h-4 w-12"></div>
                            </div>
                        ))}
                    </div>
                </div>
                <div className="lg:col-span-3 rounded-lg border dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm">
                    <div className="skeleton h-5 w-44 mb-1"></div>
                    <div className="skeleton h-4 w-64 mb-4"></div>
                    <div className="space-y-4">
                        {[...Array(5)].map((_, i) => (
                            <div key={i} className="flex items-start gap-4 pb-4 border-b border-slate-100 last:border-0">
                                <div className="flex-1 space-y-1.5">
                                    <div className="skeleton h-4 w-28"></div>
                                    <div className="skeleton h-3 w-full"></div>
                                </div>
                                <div className="skeleton h-3 w-10"></div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}
