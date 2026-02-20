import { createBrowserRouter, Navigate } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import { RoleGuard } from './components/guards/RoleGuard';
import { MainLayout } from './components/layout/MainLayout';

const DashboardPage = lazy(() => import('./pages/dashboard/DashboardPage'));
const LoginPage = lazy(() => import('./pages/auth/LoginPage'));

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
            // {
            //   path: 'transaksi/peminjaman',
            //   element: (
            //     <RoleGuard allowedRoles={['ADMIN', 'PETUGAS']}>
            //       <Suspense fallback={<div className="p-8">Loading Transaksi...</div>}>
            //         <PeminjamanPage />
            //       </Suspense>
            //     </RoleGuard>
            //   ),
            // },
            {
                path: 'unauthorized',
                element: <div className="p-8 text-red-500 font-bold">Unauthorized Access</div>,
            }
        ],
    },
]);
