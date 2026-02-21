import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Plus, Search, Eye } from "lucide-react";
import { getPeminjaman } from "@/services/api/peminjamanApi";
import type { Peminjaman } from "@/services/api/peminjamanApi";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { PeminjamanForm } from "@/pages/transaksi/PeminjamanForm";
import { PeminjamanDetailModal } from "@/pages/transaksi/PeminjamanDetailModal";

export default function PeminjamanPage() {
    const [page, setPage] = useState(0);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [selectedPeminjaman, setSelectedPeminjaman] = useState<Peminjaman | null>(null);

    const { data, isLoading } = useQuery({
        queryKey: ["peminjaman-list", page],
        queryFn: () => getPeminjaman(page, 10),
    });

    const handleCheckout = () => {
        setIsFormOpen(true);
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Transaksi Peminjaman</h1>
                    <p className="text-muted-foreground mt-1">Kelola sirkulasi peminjaman aset (checkout) dan pengembalian (checkin).</p>
                </div>
                <Button onClick={handleCheckout}>
                    <Plus className="mr-2 h-4 w-4" /> Pinjam Aset
                </Button>
            </div>

            <div className="flex items-center justify-between">
                <div className="relative w-72">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input placeholder="Cari No Register..." className="pl-8" />
                </div>
            </div>

            <div className="rounded-md border bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-12">No.</TableHead>
                            <TableHead>Register</TableHead>
                            <TableHead>Peminjam</TableHead>
                            <TableHead>Keperluan</TableHead>
                            <TableHead>Keterangan</TableHead>
                            <TableHead>Tgl Kembali</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="text-right">Aksi</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {isLoading ? (
                            Array.from({ length: 5 }).map((_, i) => (
                                <TableRow key={i}>
                                    <TableCell><Skeleton className="h-4 w-6" /></TableCell>
                                    <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                                    <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                                    <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                                    <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                                    <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                                    <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                                    <TableCell className="text-right"><Skeleton className="h-8 w-8 ml-auto" /></TableCell>
                                </TableRow>
                            ))
                        ) : data?.content.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={8} className="h-24 text-center">
                                    Tidak ada data transaksi peminjaman.
                                </TableCell>
                            </TableRow>
                        ) : (
                            data?.content.map((item, index) => (
                                <TableRow key={item.id}>
                                    <TableCell>{(page * 10) + index + 1}</TableCell>
                                    <TableCell className="font-medium">{item.noRegister}</TableCell>
                                    <TableCell>{item.peminjamName}</TableCell>
                                    <TableCell className="max-w-[200px] truncate">{item.keperluan}</TableCell>
                                    <TableCell className="max-w-[200px] truncate">{item.keterangan || '-'}</TableCell>
                                    <TableCell>{item.tglKembaliRencana ? new Date(item.tglKembaliRencana).toLocaleDateString('id-ID') : '-'}</TableCell>
                                    <TableCell>
                                        {item.status === 'DIPINJAM' ? (
                                            <Badge variant="outline" className="bg-orange-50 text-orange-700 border-orange-200">Di Pinjam</Badge>
                                        ) : (
                                            <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200">Selesai</Badge>
                                        )}
                                    </TableCell>
                                    <TableCell className="text-right space-x-2">
                                        <Button variant="ghost" size="icon" onClick={() => setSelectedPeminjaman(item)}>
                                            <Eye className="h-4 w-4 text-foreground" />
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>

            <div className="flex items-center justify-end space-x-2">
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPage(p => Math.max(0, p - 1))}
                    disabled={page === 0 || isLoading}
                >
                    Previous
                </Button>
                <div className="text-sm font-medium">
                    Halaman {page + 1} dari {data?.totalPages || 1}
                </div>
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPage(p => p + 1)}
                    disabled={data?.last || isLoading}
                >
                    Next
                </Button>
            </div>

            <PeminjamanForm isOpen={isFormOpen} onClose={() => setIsFormOpen(false)} />
            <PeminjamanDetailModal
                isOpen={!!selectedPeminjaman}
                onClose={() => setSelectedPeminjaman(null)}
                data={selectedPeminjaman}
            />
        </div>
    );
}
