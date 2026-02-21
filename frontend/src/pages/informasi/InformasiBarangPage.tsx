import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getBarang, deleteBarang } from '@/services/api/barangApi';
import type { Barang } from '@/services/api/barangApi';
import { PageHeader } from '@/components/ui/page-header';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { Plus, Edit2, Trash2, Search, FileText } from 'lucide-react';
import { BarangForm } from '@/pages/master/BarangForm';
import { BarangTracerModal } from '@/pages/informasi/BarangTracerModal';
import { toast } from 'sonner';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export default function InformasiBarangPage() {
    const queryClient = useQueryClient();
    const [page, setPage] = useState(0);
    const [search, setSearch] = useState('');
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [isTracerOpen, setIsTracerOpen] = useState(false);
    const [selectedBarang, setSelectedBarang] = useState<Barang | null>(null);
    const [itemToDelete, setItemToDelete] = useState<number | null>(null);

    const { data: barangData, isLoading } = useQuery({
        queryKey: ['barang-informasi-list', page, search],
        queryFn: () => getBarang(page, 10, search),
    });

    const deleteMutation = useMutation({
        mutationFn: deleteBarang,
        onSuccess: () => {
            toast.success('Barang berhasil dihapus');
            queryClient.invalidateQueries({ queryKey: ['barang-informasi-list'] });
            queryClient.invalidateQueries({ queryKey: ['barang-list'] });
            queryClient.invalidateQueries({ queryKey: ['dashboard-summary'] });
        },
        onError: () => {
            toast.error('Gagal menghapus barang');
        },
    });

    const handleEdit = (barang: Barang) => {
        setSelectedBarang(barang);
        setIsFormOpen(true);
    };

    const handleDelete = (id: number) => {
        setItemToDelete(id);
    };

    const confirmDelete = () => {
        if (itemToDelete !== null) {
            deleteMutation.mutate(itemToDelete);
            setItemToDelete(null);
        }
    };

    const handleDetail = (barang: Barang) => {
        setSelectedBarang(barang);
        setIsTracerOpen(true);
    };

    return (
        <div className="space-y-6">
            <PageHeader
                title="Informasi Data Barang (Tracer)"
                description="Manajemen master data barang dan pelacakan riwayat peminjaman & perawatan aset."
            />

            <div className="flex items-center justify-between gap-4">
                <div className="relative flex-1 max-w-sm">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                        placeholder="Cari nama atau NUP..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="pl-9 bg-white"
                    />
                </div>
                <Button onClick={() => { setSelectedBarang(null); setIsFormOpen(true); }} className="bg-blue-600 hover:bg-blue-700 text-white">
                    <Plus className="w-4 h-4 mr-2" />
                    Tambah Barang
                </Button>
            </div>

            <div className="bg-white dark:bg-slate-900 rounded-lg shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden">
                <Table>
                    <TableHeader className="bg-slate-50 dark:bg-slate-800/50">
                        <TableRow>
                            <TableHead className="w-[50px] text-center font-bold">NO</TableHead>
                            <TableHead className="font-bold">KODE BARANG</TableHead>
                            <TableHead className="font-bold">NUP</TableHead>
                            <TableHead className="font-bold">NAMA BARANG</TableHead>
                            <TableHead className="font-bold">MERK / TYPE</TableHead>
                            <TableHead className="font-bold">GUDANG</TableHead>
                            <TableHead className="font-bold">LOKASI</TableHead>
                            <TableHead className="font-bold text-center">KONDISI</TableHead>
                            <TableHead className="font-bold text-center">STATUS</TableHead>
                            <TableHead className="w-[150px] text-center font-bold">AKSI</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {isLoading ? (
                            <TableRow>
                                <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                                    Memuat data...
                                </TableCell>
                            </TableRow>
                        ) : barangData?.content.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                                    Tidak ada data barang.
                                </TableCell>
                            </TableRow>
                        ) : (
                            barangData?.content.map((item, index) => (
                                <TableRow key={item.id} className="hover:bg-slate-50/50">
                                    <TableCell className="text-center font-medium border-r">{page * 10 + index + 1}.</TableCell>
                                    <TableCell className="font-semibold text-foreground">{item.kodeBarang}</TableCell>
                                    <TableCell className="text-muted-foreground">{item.nup || "-"}</TableCell>
                                    <TableCell className="font-medium">{item.namaBarang}</TableCell>
                                    <TableCell className="text-muted-foreground">{item.merkType || "-"}</TableCell>
                                    <TableCell className="text-muted-foreground uppercase">{item.gudang || "-"}</TableCell>
                                    <TableCell className="text-muted-foreground">{item.lokasi || "-"}</TableCell>
                                    <TableCell className="text-center">
                                        <span className={`px-2.5 py-1 text-[10px] uppercase tracking-wider font-bold rounded-full ${item.kondisi === 'BAIK' ? 'bg-emerald-100 text-emerald-800' :
                                            item.kondisi === 'RUSAK_RINGAN' ? 'bg-amber-100 text-amber-800' :
                                                'bg-red-100 text-red-800'
                                            }`}>
                                            {item.kondisi?.replace('_', ' ')}
                                        </span>
                                    </TableCell>
                                    <TableCell className="text-center">
                                        <span className={`px-2.5 py-1 text-[10px] uppercase tracking-wider font-bold rounded-full ${item.status === 'TERSEDIA' ? 'bg-blue-100 text-blue-800' :
                                            item.status === 'DIPINJAM' ? 'bg-purple-100 text-purple-800' :
                                                'bg-orange-100 text-orange-800'
                                            }`}>
                                            {item.status === 'TERSEDIA' ? 'ADA' : item.status}
                                        </span>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center justify-center gap-1">
                                            <Button title="Detail & History Tracer" variant="ghost" size="icon" onClick={() => handleDetail(item)} className="text-foreground hover:text-foreground hover:bg-blue-50">
                                                <FileText className="w-4 h-4" />
                                            </Button>
                                            <Button title="Edit Alat" variant="ghost" size="icon" onClick={() => handleEdit(item)} className="text-amber-500 hover:text-amber-700 hover:bg-amber-50">
                                                <Edit2 className="w-4 h-4" />
                                            </Button>
                                            <Button title="Hapus Alat" variant="ghost" size="icon" onClick={() => handleDelete(item.id)} className="text-red-500 hover:text-red-700 hover:bg-red-50">
                                                <Trash2 className="w-4 h-4" />
                                            </Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>

                {/* Pagination */}
                {barangData && barangData.totalPages > 1 && (
                    <div className="flex items-center justify-between px-4 py-3 border-t bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800">
                        <div className="text-sm text-muted-foreground">
                            Menampilkan {page * 10 + 1} s/d {Math.min((page + 1) * 10, barangData.totalElements)} dari {barangData.totalElements} data
                        </div>
                        <div className="flex items-center gap-2">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setPage(p => Math.max(0, p - 1))}
                                disabled={page === 0}
                            >
                                Sebelumnya
                            </Button>
                            <div className="text-sm font-medium px-2">
                                Halaman {page + 1} dari {barangData.totalPages}
                            </div>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setPage(p => Math.min(barangData.totalPages - 1, p + 1))}
                                disabled={page >= barangData.totalPages - 1 || isLoading}
                            >
                                Selanjutnya
                            </Button>
                        </div>
                    </div>
                )}
            </div>

            {isFormOpen && (
                <BarangForm
                    isOpen={isFormOpen}
                    onClose={() => { setIsFormOpen(false); setSelectedBarang(null); }}
                    initialData={selectedBarang || undefined}
                />
            )}

            {isTracerOpen && selectedBarang && (
                <BarangTracerModal
                    isOpen={isTracerOpen}
                    onClose={() => { setIsTracerOpen(false); setSelectedBarang(null); }}
                    barang={selectedBarang}
                />
            )}

            <AlertDialog open={itemToDelete !== null} onOpenChange={(open) => !open && setItemToDelete(null)}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Apakah Anda yakin?</AlertDialogTitle>
                        <AlertDialogDescription>
                            Tindakan ini tidak dapat dibatalkan. Data barang akan dihapus secara permanen.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Batal</AlertDialogCancel>
                        <AlertDialogAction onClick={confirmDelete} className="bg-red-600 hover:bg-red-700 text-white">
                            Hapus
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}
