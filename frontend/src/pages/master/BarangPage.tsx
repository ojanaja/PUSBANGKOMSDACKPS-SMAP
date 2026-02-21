import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus, Edit, Trash2, Search, MoreHorizontal } from "lucide-react";
import { toast } from "sonner";
import { getBarang, deleteBarang } from "@/services/api/barangApi";
import type { Barang } from "@/services/api/barangApi";
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
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
import { BarangForm } from "@/pages/master/BarangForm";

export default function BarangPage() {
    const queryClient = useQueryClient();
    const [page, setPage] = useState(0);
    const [search, setSearch] = useState("");
    const [debouncedSearch, setDebouncedSearch] = useState("");

    const [isFormOpen, setIsFormOpen] = useState(false);
    const [selectedBarang, setSelectedBarang] = useState<Barang | undefined>(undefined);
    const [itemToDelete, setItemToDelete] = useState<number | null>(null);

    useEffect(() => {
        const timer = setTimeout(() => setDebouncedSearch(search), 500);
        return () => clearTimeout(timer);
    }, [search]);

    useEffect(() => {
        setPage(0);
    }, [debouncedSearch]);

    const { data, isLoading } = useQuery({
        queryKey: ["barang-list", page, debouncedSearch],
        queryFn: () => getBarang(page, 10, debouncedSearch),
    });

    const deleteMutation = useMutation({
        mutationFn: deleteBarang,
        onSuccess: async () => {
            toast.success("Barang berhasil dihapus");
            await queryClient.invalidateQueries({ queryKey: ["barang-list"] });
            await queryClient.invalidateQueries({ queryKey: ["barang-informasi-list"] });
            await queryClient.invalidateQueries({ queryKey: ["dashboard-summary"] });
        },
        onError: (error: any) => {
            toast.error(error?.response?.data?.message || "Gagal menghapus barang");
        },
    });

    const handleEdit = (barang: Barang) => {
        setSelectedBarang(barang);
        setIsFormOpen(true);
    };

    const handleAdd = () => {
        setSelectedBarang(undefined);
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

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Master Data Barang</h1>
                    <p className="text-muted-foreground mt-1">Kelola data inventaris sarana dan prasarana.</p>
                </div>
                <Button onClick={handleAdd}>
                    <Plus className="mr-2 h-4 w-4" /> Tambah Barang
                </Button>
            </div>

            <div className="flex items-center justify-between">
                <div className="relative w-72">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Cari nama atau NUP..."
                        className="pl-8"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
            </div>

            <div className="rounded-md border bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-[50px] text-center">No</TableHead>
                            <TableHead>KODE BARANG</TableHead>
                            <TableHead>NUP</TableHead>
                            <TableHead>NAMA BARANG</TableHead>
                            <TableHead>MERK/TYPE</TableHead>
                            <TableHead>GUDANG</TableHead>
                            <TableHead>LOKASI</TableHead>
                            <TableHead className="text-center">KONDISI</TableHead>
                            <TableHead className="text-center">STATUS</TableHead>
                            <TableHead className="text-right w-[70px]">AKSI</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {isLoading ? (
                            Array.from({ length: 5 }).map((_, i) => (
                                <TableRow key={i}>
                                    <TableCell><Skeleton className="h-4 w-8" /></TableCell>
                                    <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                                    <TableCell><Skeleton className="h-4 w-12" /></TableCell>
                                    <TableCell><Skeleton className="h-4 w-40" /></TableCell>
                                    <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                                    <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                                    <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                                    <TableCell><Skeleton className="h-4 w-16" /></TableCell>
                                    <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                                    <TableCell className="text-right"><Skeleton className="h-8 w-8 ml-auto" /></TableCell>
                                </TableRow>
                            ))
                        ) : data?.content.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={10} className="h-24 text-center">
                                    Tidak ada data barang ditemukan.
                                </TableCell>
                            </TableRow>
                        ) : (
                            data?.content.map((item, index) => (
                                <TableRow key={item.id}>
                                    <TableCell className="text-center font-medium">
                                        {page * 10 + index + 1}.
                                    </TableCell>
                                    <TableCell className="font-semibold">{item.kodeBarang}</TableCell>
                                    <TableCell>{item.nup || "-"}</TableCell>
                                    <TableCell>{item.namaBarang}</TableCell>
                                    <TableCell>{item.merkType || "-"}</TableCell>
                                    <TableCell className="uppercase">{item.gudang || "-"}</TableCell>
                                    <TableCell>{item.lokasi || "-"}</TableCell>
                                    <TableCell className="text-center">
                                        <span className={`px-2 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase
                      ${item.kondisi === 'BAIK' ? 'bg-emerald-100 text-emerald-800' :
                                                item.kondisi === 'RUSAK_RINGAN' ? 'bg-amber-100 text-amber-800' : 'bg-red-100 text-red-800'}`}>
                                            {item.kondisi.replace('_', ' ')}
                                        </span>
                                    </TableCell>
                                    <TableCell className="text-center">
                                        <span className={`px-2 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase
                      ${item.status === 'TERSEDIA' ? 'bg-blue-100 text-blue-800' :
                                                item.status === 'DIPINJAM' ? 'bg-purple-100 text-purple-800' : 'bg-orange-100 text-orange-800'}`}>
                                            {item.status === 'TERSEDIA' ? 'ADA' : item.status}
                                        </span>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" className="h-8 w-8 p-0">
                                                    <MoreHorizontal className="h-4 w-4" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuItem onClick={() => handleEdit(item)}>
                                                    <Edit className="mr-2 h-4 w-4" /> Edit
                                                </DropdownMenuItem>
                                                <DropdownMenuItem onClick={() => handleDelete(item.id)} className="text-red-600 focus:text-red-600">
                                                    <Trash2 className="mr-2 h-4 w-4" /> Hapus
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>

            {/* Pagination Controls */}
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

            <BarangForm
                isOpen={isFormOpen}
                onClose={() => setIsFormOpen(false)}
                initialData={selectedBarang}
            />

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
