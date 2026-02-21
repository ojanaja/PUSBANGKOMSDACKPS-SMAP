import { createBrowserRouter, Navigate } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import { RoleGuard } from '@/components/guards/RoleGuard';
import { MainLayout } from '@/components/layout/MainLayout';

const DashboardPage = lazy(() => import('@/pages/dashboard/DashboardPage'));
const LoginPage = lazy(() => import('@/pages/auth/LoginPage'));
const BarangPage = lazy(() => import('@/pages/master/BarangPage'));
const PeminjamanPage = lazy(() => import('@/pages/transaksi/PeminjamanPage'));
const PengembalianPage = lazy(() => import('@/pages/transaksi/PengembalianPage'));
const PerawatanPage = lazy(() => import('@/pages/transaksi/PerawatanPage'));
const KembaliServicePage = lazy(() => import('@/pages/transaksi/KembaliServicePage'));
const LaporanPage = lazy(() => import('@/pages/laporan/LaporanPage'));
const UserManagementPage = lazy(() => import('@/pages/system/UserManagementPage'));
const InformasiBarangPage = lazy(() => import('@/pages/informasi/InformasiBarangPage'));

export const router = createBrowserRouter([
    {
        path: '/login',
        element: (
            <Suspense fallback={<div className="p-8">Loading Login...</div>}>
                <LoginPage />
            </Suspense>
        ),
    },
    {
        path: '/',
        element: (
            <RoleGuard>
                <MainLayout />
            </RoleGuard>
        ),
        children: [
            {
                index: true,
                element: <Navigate to="/dashboard" replace />,
            },
            {
                path: 'dashboard',
                element: (
                    <Suspense fallback={<div className="p-8">Loading Dashboard...</div>}>
                        <DashboardPage />
                    </Suspense>
                ),
            },
            {
                path: 'master/barang',
                element: (
                    <RoleGuard allowedRoles={['ADMIN', 'PETUGAS']}>
                        <Suspense fallback={<div className="p-8">Loading Barang...</div>}>
                            <BarangPage />
                        </Suspense>
                    </RoleGuard>
                ),
            },
            {
                path: 'transaksi/peminjaman',
                element: (
                    <RoleGuard allowedRoles={['ADMIN', 'PETUGAS', 'PEMINJAM']}>
                        <Suspense fallback={<div className="p-8">Loading Transaksi...</div>}>
                            <PeminjamanPage />
                        </Suspense>
                    </RoleGuard>
                ),
            },
            {
                path: 'transaksi/pengembalian-pinjaman',
                element: (
                    <RoleGuard allowedRoles={['ADMIN', 'PETUGAS']}>
                        <Suspense fallback={<div className="p-8">Loading Pengembalian...</div>}>
                            <PengembalianPage />
                        </Suspense>
                    </RoleGuard>
                ),
            },
            {
                path: 'transaksi/perawatan',
                element: (
                    <RoleGuard allowedRoles={['ADMIN', 'PETUGAS']}>
                        <Suspense fallback={<div className="p-8">Loading Transaksi...</div>}>
                            <PerawatanPage />
                        </Suspense>
                    </RoleGuard>
                ),
            },
            {
                path: 'transaksi/kembali-service',
                element: (
                    <RoleGuard allowedRoles={['ADMIN', 'PETUGAS']}>
                        <Suspense fallback={<div className="p-8">Loading Kembali Service...</div>}>
                            <KembaliServicePage />
                        </Suspense>
                    </RoleGuard>
                ),
            },
            {
                path: 'laporan',
                element: (
                    <RoleGuard allowedRoles={['ADMIN', 'PETUGAS']}>
                        <Suspense fallback={<div className="p-8">Loading Laporan...</div>}>
                            <LaporanPage />
                        </Suspense>
                    </RoleGuard>
                ),
            },
            {
                path: 'informasi/barang',
                element: (
                    <RoleGuard allowedRoles={['ADMIN', 'PETUGAS', 'PEMINJAM']}>
                        <Suspense fallback={<div className="p-8">Loading Informasi...</div>}>
                            <InformasiBarangPage />
                        </Suspense>
                    </RoleGuard>
                ),
            },
            {
                path: 'system/users',
                element: (
                    <RoleGuard allowedRoles={['ADMIN']}>
                        <Suspense fallback={<div className="p-8">Loading System...</div>}>
                            <UserManagementPage />
                        </Suspense>
                    </RoleGuard>
                ),
            },
            {
                path: 'unauthorized',
                element: <div className="p-8 text-red-500 font-bold">Unauthorized Access</div>,
            },
            {
                path: '*',
                element: (
                    <div className="flex flex-col items-center justify-center p-12 text-center h-[50vh]">
                        <h2 className="text-2xl font-bold text-foreground dark:text-slate-100 mb-2">Segera Hadir / Under Construction</h2>
                        <p className="text-muted-foreground dark:text-muted-foreground">Modul ini dalam tahap pengembangan tahap selanjutnya.</p>
                    </div>
                ),
            }
        ],
    },
]);
