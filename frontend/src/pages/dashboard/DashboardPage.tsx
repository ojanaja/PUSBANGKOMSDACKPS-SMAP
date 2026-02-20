export default function DashboardPage() {
    return (
        <div>
            <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="p-6 bg-white dark:bg-slate-800 rounded shadow border-l-4 border-blue-500">
                    <h2 className="text-slate-500 dark:text-slate-400 text-sm uppercase font-semibold">Total Barang</h2>
                    <p className="text-3xl font-bold mt-2">1,204</p>
                </div>
                <div className="p-6 bg-white dark:bg-slate-800 rounded shadow border-l-4 border-orange-500">
                    <h2 className="text-slate-500 dark:text-slate-400 text-sm uppercase font-semibold">Dipinjam</h2>
                    <p className="text-3xl font-bold mt-2">45</p>
                </div>
                <div className="p-6 bg-white dark:bg-slate-800 rounded shadow border-l-4 border-yellow-500">
                    <h2 className="text-slate-500 dark:text-slate-400 text-sm uppercase font-semibold">Dirawat</h2>
                    <p className="text-3xl font-bold mt-2">12</p>
                </div>
                <div className="p-6 bg-white dark:bg-slate-800 rounded shadow border-l-4 border-red-500">
                    <h2 className="text-slate-500 dark:text-slate-400 text-sm uppercase font-semibold">Rusak</h2>
                    <p className="text-3xl font-bold mt-2">8</p>
                </div>
            </div>
        </div>
    );
}
