import { useQuery } from '@tanstack/react-query';
import { Package, Clock, Wrench, AlertTriangle, Activity } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { getDashboardSummary } from '@/services/api/dashboardApi';
import { useAuthStore } from '@/store/useAuthStore';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

export default function DashboardPage() {
    const user = useAuthStore((state) => state.user);

    const { data: stats, isLoading, isError } = useQuery({
        queryKey: ['dashboard-summary'],
        queryFn: getDashboardSummary,
        staleTime: 60000, 
    });

    const chartData = stats ? [
        { name: 'Tersedia', value: stats.barangTersedia, fill: '#10b981' }, 
        { name: 'Dipinjam', value: stats.barangDipinjam, fill: '#3b82f6' }, 
        { name: 'Dirawat', value: stats.barangDirawat, fill: '#f59e0b' },   
        { name: 'Rusak', value: stats.barangRusak, fill: '#ef4444' },       
    ] : [];

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Dashboard Overview</h1>
                <p className="text-muted-foreground mt-1">
                    Welcome back, {user?.name || 'User'}! Here is the summary of your assets.
                </p>
            </div>

            {/* Stats Grid */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <StatCard title="JML BARANG" value={stats?.totalBarang} icon={<Package className="h-4 w-4 text-emerald-500" />} loading={isLoading} />
                <StatCard title="Total Dipinjam" value={stats?.barangDipinjam} icon={<Clock className="h-4 w-4 text-foreground" />} loading={isLoading} />
                <StatCard title="Total Dirawat" value={stats?.barangDirawat} icon={<Wrench className="h-4 w-4 text-amber-500" />} loading={isLoading} />
                <StatCard title="Total Rusak" value={stats?.barangRusak} icon={<AlertTriangle className="h-4 w-4 text-red-500" />} loading={isLoading} />

                {/* Transaksi Aktif */}
                <Card className="col-span-1 md:col-span-3 lg:col-span-3 flex items-center justify-around bg-slate-100 dark:bg-slate-800 border-none shadow-sm">
                    <div className="text-center">
                        <p className="text-sm font-medium text-muted-foreground flex items-center gap-2 justify-center">
                            <Activity className="h-4 w-4" /> Peminjaman Aktif
                        </p>
                        {isLoading ? <Skeleton className="h-8 w-16 mx-auto mt-2" /> : (
                            <h3 className="text-3xl font-bold mt-1 text-foreground dark:text-slate-200">{stats?.peminjamanAktif || 0}</h3>
                        )}
                    </div>
                    <div className="h-12 w-px bg-slate-300 dark:bg-slate-600"></div>
                    <div className="text-center">
                        <p className="text-sm font-medium text-muted-foreground flex items-center gap-2 justify-center">
                            <Wrench className="h-4 w-4" /> Perawatan Aktif
                        </p>
                        {isLoading ? <Skeleton className="h-8 w-16 mx-auto mt-2" /> : (
                            <h3 className="text-3xl font-bold mt-1 text-foreground dark:text-slate-200">{stats?.perawatanAktif || 0}</h3>
                        )}
                    </div>
                </Card>
            </div>

            {/* Charts Section */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7 mt-8">
                <Card className="col-span-1 md:col-span-2 lg:col-span-4 shadow-sm">
                    <CardHeader>
                        <CardTitle>Distribusi Status Barang</CardTitle>
                    </CardHeader>
                    <CardContent className="h-[300px]">
                        {isLoading ? (
                            <div className="h-full w-full flex items-center justify-center">
                                <Skeleton className="h-[250px] w-full" />
                            </div>
                        ) : isError ? (
                            <div className="h-full w-full flex items-center justify-center text-red-500">
                                Gagal memuat grafik.
                            </div>
                        ) : (
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={chartData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#ccc" />
                                    <XAxis dataKey="name" axisLine={false} tickLine={false} />
                                    <YAxis axisLine={false} tickLine={false} />
                                    <Tooltip cursor={{ fill: 'transparent' }} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                                    <Bar dataKey="value" radius={[4, 4, 0, 0]} barSize={40} />
                                </BarChart>
                            </ResponsiveContainer>
                        )}
                    </CardContent>
                </Card>

                <Card className="col-span-1 md:col-span-2 lg:col-span-3 shadow-sm">
                    <CardHeader>
                        <CardTitle>Aktivitas Terkini</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {/* Placeholder for recent activities feed */}
                            <div className="flex items-center gap-4">
                                <div className="h-9 w-9 bg-blue-100 text-foreground rounded-full flex items-center justify-center">
                                    <Clock className="h-4 w-4" />
                                </div>
                                <div className="flex-1 space-y-1">
                                    <p className="text-sm font-medium leading-none">Peminjaman Laptop (PRJ-001)</p>
                                    <p className="text-sm text-muted-foreground">Oleh Budi Santoso</p>
                                </div>
                                <div className="text-sm text-muted-foreground">Baru saja</div>
                            </div>
                            <div className="flex items-center gap-4">
                                <div className="h-9 w-9 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center">
                                    <Wrench className="h-4 w-4" />
                                </div>
                                <div className="flex-1 space-y-1">
                                    <p className="text-sm font-medium leading-none">Perawatan Proyektor (PRW-002)</p>
                                    <p className="text-sm text-muted-foreground">Sedang diproses teknisi</p>
                                </div>
                                <div className="text-sm text-muted-foreground">2 jam lalu</div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}

function StatCard({ title, value, icon, loading }: { title: string, value?: number, icon: React.ReactNode, loading: boolean }) {
    return (
        <Card className="shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground dark:text-slate-300">
                    {title}
                </CardTitle>
                {icon}
            </CardHeader>
            <CardContent>
                {loading ? (
                    <Skeleton className="h-8 w-20" />
                ) : (
                    <div className="text-3xl font-bold">{value !== undefined ? value.toLocaleString() : '0'}</div>
                )}
            </CardContent>
        </Card>
    );
}
