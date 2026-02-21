import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus, Search, Eye } from "lucide-react";
import { toast } from "sonner";
import { getPerawatan } from "@/services/api/perawatanApi";
import type { Perawatan } from "@/services/api/perawatanApi";
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
import { PerawatanForm } from "@/pages/transaksi/PerawatanForm";
import { PerawatanDetailModal } from "@/pages/transaksi/PerawatanDetailModal";

export default function PerawatanPage() {
    const queryClient = useQueryClient();
    const [page, setPage] = useState(0);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [selectedPerawatan, setSelectedPerawatan] = useState<Perawatan | null>(null);

    const { data, isLoading } = useQuery({
        queryKey: ["perawatan-list", page],
        queryFn: () => getPerawatan(page, 10),
    });

    const handleCheckout = () => {
        setIsFormOpen(true);
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Perawatan Aset</h1>
                    <p className="text-muted-foreground mt-1">Lacak tiket perawatan perbaikan maupun perawatan berkala.</p>
                </div>
                <Button onClick={handleCheckout}>
                    <Plus className="mr-2 h-4 w-4" /> Ajukan Perawatan
                </Button>
            </div>

            <div className="flex items-center justify-between">
                <div className="relative w-72">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input placeholder="Cari No Tiket..." className="pl-8" />
                </div>
            </div>

            <div className="rounded-md border bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>No. Tiket</TableHead>
                            <TableHead>Diajukan Oleh</TableHead>
                            <TableHead>Tgl Pengajuan</TableHead>
                            <TableHead>Estimasi Selesai</TableHead>
                            <TableHead>Masalah (Hal)</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="text-right">Aksi</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {isLoading ? (
                            Array.from({ length: 5 }).map((_, i) => (
                                <TableRow key={i}>
                                    <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                                    <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                                    <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                                    <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                                    <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                                    <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                                    <TableCell className="text-right"><Skeleton className="h-8 w-8 ml-auto" /></TableCell>
                                </TableRow>
                            ))
                        ) : data?.content.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={7} className="h-24 text-center">
                                    Tidak ada data perawatan yang aktif.
                                </TableCell>
                            </TableRow>
                        ) : (
                            data?.content.map((item) => (
                                <TableRow key={item.id}>
                                    <TableCell className="font-medium">{item.noRegister}</TableCell>
                                    <TableCell>{item.diajukanOlehName}</TableCell>
                                    <TableCell>{new Date(item.tglService).toLocaleDateString('id-ID')}</TableCell>
                                    <TableCell>{new Date(item.tglSelesaiRencana).toLocaleDateString('id-ID')}</TableCell>
                                    <TableCell className="max-w-[200px] truncate">{item.hal}</TableCell>
                                    <TableCell>
                                        {item.status === 'PERAWATAN' ? (
                                            <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">Di Rawat</Badge>
                                        ) : (
                                            <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200">Selesai</Badge>
                                        )}
                                    </TableCell>
                                    <TableCell className="text-right space-x-2">
                                        <Button variant="ghost" size="icon" onClick={() => setSelectedPerawatan(item)}>
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
            <PerawatanForm isOpen={isFormOpen} onClose={() => setIsFormOpen(false)} />
            <PerawatanDetailModal isOpen={!!selectedPerawatan} onClose={() => setSelectedPerawatan(null)} data={selectedPerawatan} />
        </div>
    );
}
