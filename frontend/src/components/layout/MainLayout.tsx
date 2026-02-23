import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { Toaster } from '@/components/ui/sonner';
import { useAuthStore } from '@/store/useAuthStore';
import { LogOut, User, ChevronDown } from 'lucide-react';
import { ThemeToggle } from '@/components/ThemeToggle';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export const MainLayout = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { user, logout } = useAuthStore();

    const isActive = (path: string) => location.pathname.startsWith(path);

    const navLinkClass = (path: string) =>
        `transition-colors font-medium text-sm flex items-center gap-1 h-9 px-3 rounded-md ${isActive(path) ? 'bg-blue-50 text-foreground dark:bg-blue-900/30 dark:text-foreground' : 'text-muted-foreground hover:bg-slate-100 hover:text-foreground dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-slate-50'}`;

    const handleLogout = () => {
        logout();
        navigate('/login', { replace: true });
    };

    const hasAccess = (menu: string, subMenu?: string) => {
        if (user?.role === 'ADMIN') return true;
        if (!user?.permissions) return false;
        if (subMenu) {
            return user.permissions.includes(`${menu}:${subMenu}`);
        }
        return user.permissions.some(p => p.startsWith(`${menu}:`));
    };

    return (
        <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-900">
            {/* Top Navbar */}
            <header className="sticky top-0 z-50 w-full border-b border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-slate-900/95 backdrop-blur supports-[backdrop-filter]:bg-white/70">
                <div className="container mx-auto flex h-16 items-center px-4 md:px-6 max-w-[1400px]">
                    {/* Logo/Branding */}
                    <div className="mr-8 flex items-center shrink-0">
                        <Link to="/dashboard" className="text-2xl font-black tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
                            SMAP
                        </Link>
                    </div>

                    {/* Desktop Navigation */}
                    <nav className="hidden md:flex items-center space-x-2 flex-1">
                        <Link to="/dashboard" className={navLinkClass('/dashboard')}>Dashboard</Link>

                        {hasAccess('TRANSAKSI') && (
                            <DropdownMenu>
                                <DropdownMenuTrigger className={navLinkClass('/transaksi')}>
                                    Transaksi <ChevronDown className="w-4 h-4 ml-1 opacity-50" />
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="start" className="w-56">
                                    {hasAccess('TRANSAKSI', 'Pengajuan Pinjaman') && <DropdownMenuItem asChild><Link to="/transaksi/peminjaman" className="w-full cursor-pointer">Pengajuan Pinjaman</Link></DropdownMenuItem>}
                                    {hasAccess('TRANSAKSI', 'Pengembalian Pinjaman') && <DropdownMenuItem asChild><Link to="/transaksi/pengembalian-pinjaman" className="w-full cursor-pointer">Pengembalian Pinjaman</Link></DropdownMenuItem>}
                                    <DropdownMenuSeparator />
                                    {hasAccess('TRANSAKSI', 'Pengajuan Perawatan') && <DropdownMenuItem asChild><Link to="/transaksi/perawatan" className="w-full cursor-pointer">Pengajuan Perawatan</Link></DropdownMenuItem>}
                                    {hasAccess('TRANSAKSI', 'Kembali Service') && <DropdownMenuItem asChild><Link to="/transaksi/kembali-service" className="w-full cursor-pointer">Kembali Service</Link></DropdownMenuItem>}
                                </DropdownMenuContent>
                            </DropdownMenu>
                        )}

                        {hasAccess('LAPORAN') && (
                            <DropdownMenu>
                                <DropdownMenuTrigger className={navLinkClass('/laporan')}>
                                    Laporan <ChevronDown className="w-4 h-4 ml-1 opacity-50" />
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="start" className="w-52">
                                    {hasAccess('LAPORAN', 'Peminjaman') && <DropdownMenuItem asChild><Link to="/laporan/peminjaman" className="w-full cursor-pointer">Peminjaman</Link></DropdownMenuItem>}
                                    {hasAccess('LAPORAN', 'Perawatan') && <DropdownMenuItem asChild><Link to="/laporan/perawatan" className="w-full cursor-pointer">Perawatan</Link></DropdownMenuItem>}
                                    {hasAccess('LAPORAN', 'Jatuh Tempo') && <DropdownMenuItem asChild><Link to="/laporan/jatuh-tempo" className="w-full cursor-pointer">Jatuh Tempo</Link></DropdownMenuItem>}
                                    {hasAccess('LAPORAN', 'Daftar Barang') && <DropdownMenuItem asChild><Link to="/laporan/daftar-barang" className="w-full cursor-pointer">Daftar Barang</Link></DropdownMenuItem>}
                                </DropdownMenuContent>
                            </DropdownMenu>
                        )}

                        {hasAccess('INFORMASI') && (
                            <DropdownMenu>
                                <DropdownMenuTrigger className={navLinkClass('/informasi')}>
                                    Informasi <ChevronDown className="w-4 h-4 ml-1 opacity-50" />
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="start" className="w-48">
                                    {hasAccess('INFORMASI', 'Barang') && <DropdownMenuItem asChild><Link to="/informasi/barang" className="w-full cursor-pointer">Barang</Link></DropdownMenuItem>}
                                </DropdownMenuContent>
                            </DropdownMenu>
                        )}

                        {hasAccess('SYSTEM') && (
                            <DropdownMenu>
                                <DropdownMenuTrigger className={navLinkClass('/system')}>
                                    System <ChevronDown className="w-4 h-4 ml-1 opacity-50" />
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="start" className="w-52">
                                    {hasAccess('SYSTEM', 'User') && <DropdownMenuItem asChild><Link to="/system/users" className="w-full cursor-pointer">User</Link></DropdownMenuItem>}
                                    {hasAccess('SYSTEM', 'Role') && <DropdownMenuItem asChild><Link to="/system/roles" className="w-full cursor-pointer">Manajemen Hak Akses</Link></DropdownMenuItem>}
                                </DropdownMenuContent>
                            </DropdownMenu>
                        )}
                    </nav>

                    {/* Right side Profile & Logout */}
                    <div className="flex items-center gap-3 md:gap-4 ml-auto pl-4 shrink-0">
                        <ThemeToggle />
                        <DropdownMenu>
                            <DropdownMenuTrigger className="flex items-center gap-2 text-sm text-foreground dark:text-slate-300 bg-slate-100 dark:bg-slate-800 py-1.5 px-3 rounded-full border border-slate-200 dark:border-slate-700 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">
                                <User className="w-4 h-4 text-foreground dark:text-foreground" />
                                <span className="font-semibold hidden sm:inline-block">
                                    {user?.name || 'Admin'} <span className="opacity-60 text-xs ml-1 font-normal">({user?.role})</span>
                                </span>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-48">
                                <DropdownMenuItem asChild>
                                    <Link to="/system/profile" className="w-full cursor-pointer flex items-center">
                                        <User className="mr-2 h-4 w-4" />
                                        <span>My Profile</span>
                                    </Link>
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem onSelect={handleLogout} className="text-red-600 focus:text-red-600 focus:bg-red-50 dark:focus:bg-red-950">
                                    <LogOut className="mr-2 h-4 w-4" />
                                    <span>Keluar</span>
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </div>

                {/* Mobile Navigation Scrollable Row (Visible only on small screens) */}
                <div className="md:hidden border-t border-slate-200 dark:border-slate-800 py-2 px-4 flex overflow-x-auto gap-2 text-sm whitespace-nowrap bg-white dark:bg-slate-900 shadow-sm">
                    <Link to="/dashboard" className={navLinkClass('/dashboard')}>Dashboard</Link>

                    {hasAccess('TRANSAKSI') && (
                        <DropdownMenu>
                            <DropdownMenuTrigger className={navLinkClass('/transaksi')}>
                                Transaksi <ChevronDown className="w-4 h-4 ml-1 opacity-50" />
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="start" className="w-56">
                                {hasAccess('TRANSAKSI', 'Pengajuan Pinjaman') && <DropdownMenuItem asChild><Link to="/transaksi/peminjaman" className="w-full cursor-pointer">Pengajuan Pinjaman</Link></DropdownMenuItem>}
                                {hasAccess('TRANSAKSI', 'Pengembalian Pinjaman') && <DropdownMenuItem asChild><Link to="/transaksi/pengembalian-pinjaman" className="w-full cursor-pointer">Pengembalian Pinjaman</Link></DropdownMenuItem>}
                                <DropdownMenuSeparator />
                                {hasAccess('TRANSAKSI', 'Pengajuan Perawatan') && <DropdownMenuItem asChild><Link to="/transaksi/perawatan" className="w-full cursor-pointer">Pengajuan Perawatan</Link></DropdownMenuItem>}
                                {hasAccess('TRANSAKSI', 'Kembali Service') && <DropdownMenuItem asChild><Link to="/transaksi/kembali-service" className="w-full cursor-pointer">Kembali Service</Link></DropdownMenuItem>}
                            </DropdownMenuContent>
                        </DropdownMenu>
                    )}

                    {hasAccess('LAPORAN') && (
                        <DropdownMenu>
                            <DropdownMenuTrigger className={navLinkClass('/laporan')}>
                                Laporan <ChevronDown className="w-4 h-4 ml-1 opacity-50" />
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="start" className="w-52">
                                {hasAccess('LAPORAN', 'Peminjaman') && <DropdownMenuItem asChild><Link to="/laporan/peminjaman" className="w-full cursor-pointer">Peminjaman</Link></DropdownMenuItem>}
                                {hasAccess('LAPORAN', 'Perawatan') && <DropdownMenuItem asChild><Link to="/laporan/perawatan" className="w-full cursor-pointer">Perawatan</Link></DropdownMenuItem>}
                                {hasAccess('LAPORAN', 'Jatuh Tempo') && <DropdownMenuItem asChild><Link to="/laporan/jatuh-tempo" className="w-full cursor-pointer">Jatuh Tempo</Link></DropdownMenuItem>}
                                {hasAccess('LAPORAN', 'Daftar Barang') && <DropdownMenuItem asChild><Link to="/laporan/daftar-barang" className="w-full cursor-pointer">Daftar Barang</Link></DropdownMenuItem>}
                            </DropdownMenuContent>
                        </DropdownMenu>
                    )}

                    {hasAccess('INFORMASI') && (
                        <DropdownMenu>
                            <DropdownMenuTrigger className={navLinkClass('/informasi')}>
                                Informasi <ChevronDown className="w-4 h-4 ml-1 opacity-50" />
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="start" className="w-48">
                                {hasAccess('INFORMASI', 'Barang') && <DropdownMenuItem asChild><Link to="/informasi/barang" className="w-full cursor-pointer">Barang</Link></DropdownMenuItem>}
                            </DropdownMenuContent>
                        </DropdownMenu>
                    )}

                    {hasAccess('SYSTEM') && (
                        <DropdownMenu>
                            <DropdownMenuTrigger className={navLinkClass('/system')}>
                                System <ChevronDown className="w-4 h-4 ml-1 opacity-50" />
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="start" className="w-52">
                                {hasAccess('SYSTEM', 'User') && <DropdownMenuItem asChild><Link to="/system/users" className="w-full cursor-pointer">User</Link></DropdownMenuItem>}
                                {hasAccess('SYSTEM', 'Role') && <DropdownMenuItem asChild><Link to="/system/roles" className="w-full cursor-pointer">Manajemen Hak Akses</Link></DropdownMenuItem>}
                            </DropdownMenuContent>
                        </DropdownMenu>
                    )}
                </div>
            </header>

            {/* Main Content Area */}
            <main className="flex-1 flex flex-col max-w-[1400px] w-full mx-auto p-4 md:p-6 lg:p-8 overflow-auto">
                <Outlet />
            </main>
            <Toaster position="top-right" richColors />
        </div>
    );
};
