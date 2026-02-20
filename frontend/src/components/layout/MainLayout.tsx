import { Outlet } from 'react-router-dom';

export const MainLayout = () => {
    return (
        <div className="min-h-screen flex flex-col md:flex-row bg-slate-50 dark:bg-slate-900">
            {/* Sidebar Placeholder */}
            <aside className="w-full md:w-64 bg-slate-800 text-white flex-shrink-0">
                <div className="p-4 text-2xl font-bold">SMAP</div>
                <nav className="mt-4 px-2 space-y-2">
                    {/* Navigation Links Placeholder */}
                    <div className="px-4 py-2 hover:bg-slate-700 rounded cursor-pointer">Dashboard</div>
                    <div className="px-4 py-2 hover:bg-slate-700 rounded cursor-pointer">Transaksi</div>
                    <div className="px-4 py-2 hover:bg-slate-700 rounded cursor-pointer">Data Barang</div>
                </nav>
            </aside>

            {/* Main Content */}
            <div className="flex-1 flex flex-col">
                {/* Topbar Placeholder */}
                <header className="h-16 bg-white dark:bg-slate-800 shadow flex items-center justify-between px-6 shrink-0">
                    <div className="font-semibold text-lg">Halaman</div>
                    <div className="flex items-center gap-4">
                        <span>Admin</span>
                    </div>
                </header>

                {/* Page Content */}
                <main className="flex-1 p-6 overflow-auto">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};
