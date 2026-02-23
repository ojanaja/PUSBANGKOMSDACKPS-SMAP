import { useState, useEffect } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import type { Peminjaman } from "@/services/api/peminjamanApi";
import apiClient from "@/services/apiClient";

interface PengembalianFormModalProps {
    isOpen: boolean;
    onClose: () => void;
    data: Peminjaman | null;
}

export function PengembalianFormModal({ isOpen, onClose, data }: PengembalianFormModalProps) {
    const queryClient = useQueryClient();

    const [keterangan, setKeterangan] = useState("");
    const [fileBA, setFileBA] = useState<File | null>(null);
    const [kondisiMap, setKondisiMap] = useState<Record<number, string>>({});

    useEffect(() => {
        if (isOpen && data) {
            setKeterangan("");
            setFileBA(null);
            const initialMap: Record<number, string> = {};
            data.detailBarang.forEach(detail => {
                initialMap[detail.barangId] = detail.kondisiPinjam;
            });
            setKondisiMap(initialMap);
        }
    }, [isOpen, data]);

    const mutation = useMutation({
        mutationFn: async () => {
            if (!data) return;

            const requestBlob = {
                kondisiKembaliMap: kondisiMap,
                keterangan: keterangan
            };

            const formData = new FormData();
            formData.append('request', new Blob([JSON.stringify(requestBlob)], { type: 'application/json' }));

            if (fileBA) {
                formData.append('file', fileBA);
            }

            const response = await apiClient.post(`/transaksi/peminjaman/${data.id}/kembali`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                }
            });
            return response.data;
        },
        onSuccess: () => {
            toast.success("Barang berhasil dikembalikan");
            queryClient.invalidateQueries({ queryKey: ["pengembalian-list"] });
            queryClient.invalidateQueries({ queryKey: ["dashboard-summary"] });
            onClose();
        },
        onError: (error: any) => {
            toast.error(error?.response?.data?.message || "Gagal memproses pengembalian");
        },
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        mutation.mutate();
    };

    const handleKondisiChange = (barangId: number, newKondisi: string) => {
        setKondisiMap(prev => ({ ...prev, [barangId]: newKondisi }));
    };

    if (!data) return null;

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="w-[95vw] sm:max-w-4xl max-h-[90vh] overflow-y-auto">
                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    <DialogHeader>
                        <DialogTitle>Formulir Pengembalian Pinjaman</DialogTitle>
                        <DialogDescription>
                            Registrasi: {data.noRegister} | Peminjam: {data.peminjamName}
                        </DialogDescription>
                    </DialogHeader>

                    <div className="bg-slate-50 dark:bg-slate-900 border rounded-lg p-4 space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-[150px_1fr] items-center gap-2 md:gap-4">
                            <Label htmlFor="keterangan" className="md:text-right font-medium">Keterangan Kembali</Label>
                            <Input
                                id="keterangan"
                                placeholder="Catatan pengembalian barang..."
                                value={keterangan}
                                onChange={(e) => setKeterangan(e.target.value)}
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-[150px_1fr] items-center gap-2 md:gap-4">
                            <Label htmlFor="fileBA" className="md:text-right font-medium">Berita Acara (Max 2MB)</Label>
                            <Input
                                id="fileBA"
                                type="file"
                                accept="application/pdf,image/jpeg,image/png"
                                className="text-sm file:mr-4 file:py-1 file:px-3 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-slate-100 file:text-slate-700 hover:file:bg-slate-200"
                                onChange={(e) => setFileBA(e.target.files ? e.target.files[0] : null)}
                            />
                        </div>
                    </div>

                    <div>
                        <h3 className="font-semibold mb-3 text-sm uppercase tracking-wider text-muted-foreground">
                            Daftar Barang Dikembalikan
                        </h3>
                        <div className="rounded-md border overflow-x-auto">
                            <Table className="min-w-[600px]">
                                <TableHeader className="bg-slate-50 dark:bg-slate-900 text-xs whitespace-nowrap">
                                    <TableRow>
                                        <TableHead className="w-12">No.</TableHead>
                                        <TableHead>Barang</TableHead>
                                        <TableHead>Kode / NUP</TableHead>
                                        <TableHead>Kondisi Pinjam</TableHead>
                                        <TableHead className="w-48">Kondisi Kembali</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {data.detailBarang?.map((detail, index) => (
                                        <TableRow key={detail.id}>
                                            <TableCell>{index + 1}</TableCell>
                                            <TableCell className="font-medium text-sm min-w-[150px]">{detail.namaBarang}</TableCell>
                                            <TableCell className="text-sm whitespace-nowrap">
                                                <div className="flex flex-col">
                                                    <span>{detail.kodeBarang}</span>
                                                    <span className="text-xs text-muted-foreground">{detail.nup || '-'}</span>
                                                </div>
                                            </TableCell>
                                            <TableCell className="whitespace-nowrap">
                                                <Badge variant="secondary" className="font-normal text-xs">{detail.kondisiPinjam}</Badge>
                                            </TableCell>
                                            <TableCell className="min-w-[150px]">
                                                <div className="w-full">
                                                    <Select
                                                        value={kondisiMap[detail.barangId] || detail.kondisiPinjam}
                                                        onValueChange={(val) => handleKondisiChange(detail.barangId, val)}
                                                    >
                                                        <SelectTrigger className="w-full text-xs h-8">
                                                            <SelectValue placeholder="Pilih Kondisi" />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            <SelectItem value="BAIK">BAIK</SelectItem>
                                                            <SelectItem value="RUSAK_RINGAN">RUSAK RINGAN</SelectItem>
                                                            <SelectItem value="RUSAK_BERAT">RUSAK BERAT</SelectItem>
                                                        </SelectContent>
                                                    </Select>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                    {(!data.detailBarang || data.detailBarang.length === 0) && (
                                        <TableRow>
                                            <TableCell colSpan={5} className="text-center h-16 text-muted-foreground">
                                                Belum ada rincian barang
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </div>
                    </div>

                    <DialogFooter className="mt-4">
                        <Button type="button" variant="outline" onClick={onClose} disabled={mutation.isPending}>Batal</Button>
                        <Button type="submit" disabled={mutation.isPending} className="bg-emerald-600 hover:bg-emerald-700 text-white">
                            {mutation.isPending ? "Memproses..." : "Selesaikan Pengembalian"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}