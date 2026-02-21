import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Check, Search, Eye } from "lucide-react";
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
import { KembaliServiceFormModal } from "@/pages/transaksi/KembaliServiceFormModal";
import { PerawatanDetailModal } from "@/pages/transaksi/PerawatanDetailModal";

export default function KembaliServicePage() {
    const [page, setPage] = useState(0);
    const [selectedPerawatanService, setSelectedPerawatanService] = useState<Perawatan | null>(null);
    const [selectedPerawatanDetail, setSelectedPerawatanDetail] = useState<Perawatan | null>(null);

    const { data, isLoading } = useQuery({
        queryKey: ["perawatan-list", page],
        queryFn: () => getPerawatan(page, 10),
    });

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Selesai Service / Perawatan</h1>
                    <p className="text-muted-foreground mt-1">Proses penyelesaian tiket perawatan aset yang sudah di service.</p>
                </div>
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
                            <TableHead>Pengaju</TableHead>
                            <TableHead>Tgl Masuk</TableHead>
                            <TableHead>Estimasi</TableHead>
                            <TableHead>Hal</TableHead>
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
                                        <Button variant="ghost" size="icon" title="Lihat Detail" onClick={() => setSelectedPerawatanDetail(item)}>
                                            <Eye className="h-4 w-4 text-foreground dark:text-foreground" />
                                        </Button>
                                        {item.status === 'PERAWATAN' && (
                                            <Button variant="outline" size="sm" onClick={() => setSelectedPerawatanService(item)} className="border-emerald-200 text-emerald-600 bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-950 dark:hover:bg-emerald-900 dark:text-emerald-400">
                                                <Check className="mr-2 h-4 w-4" /> Proses Selesai
                                            </Button>
                                        )}
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

            <KembaliServiceFormModal
                isOpen={!!selectedPerawatanService}
                onClose={() => setSelectedPerawatanService(null)}
                data={selectedPerawatanService}
            />
            <PerawatanDetailModal
                isOpen={!!selectedPerawatanDetail}
                onClose={() => setSelectedPerawatanDetail(null)}
                data={selectedPerawatanDetail}
            />
        </div>
    );
}
