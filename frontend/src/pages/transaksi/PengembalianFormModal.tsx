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
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                <form onSubmit={handleSubmit}>
                    <DialogHeader>
                        <DialogTitle>Formulir Pengembalian Pinjaman</DialogTitle>
                        <DialogDescription>
                            Registrasi: {data.noRegister} | Peminjam: {data.peminjamName}
                        </DialogDescription>
                    </DialogHeader>

                    <div className="grid gap-6 py-4">
                        <div className="bg-slate-50 dark:bg-slate-900 border rounded-lg p-4 space-y-4">
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="keterangan" className="text-right font-medium">Keterangan Kembali</Label>
                                <Input
                                    id="keterangan"
                                    className="col-span-3"
                                    placeholder="Catatan pengembalian barang..."
                                    value={keterangan}
                                    onChange={(e) => setKeterangan(e.target.value)}
                                />
                            </div>

                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="fileBA" className="text-right font-medium">Berita Acara (Max 2MB)</Label>
                                <Input
                                    id="fileBA"
                                    type="file"
                                    accept="application/pdf,image/jpeg,image/png"
                                    className="col-span-3 text-sm"
                                    onChange={(e) => setFileBA(e.target.files ? e.target.files[0] : null)}
                                />
                            </div>
                        </div>

                        <div>
                            <h3 className="font-semibold mb-3 text-sm uppercase tracking-wider text-muted-foreground">Daftar Barang Dikembalikan</h3>
                            <div className="rounded-md border overflow-x-auto">
                                <Table>
                                    <TableHeader className="bg-slate-50 dark:bg-slate-900 text-xs">
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
                                                <TableCell className="font-medium text-sm">{detail.namaBarang}</TableCell>
                                                <TableCell className="text-sm">
                                                    <div className="flex flex-col">
                                                        <span>{detail.kodeBarang}</span>
                                                        <span className="text-xs text-muted-foreground">{detail.nup || '-'}</span>
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <Badge variant="secondary" className="font-normal text-xs">{detail.kondisiPinjam}</Badge>
                                                </TableCell>
                                                <TableCell>
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
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </div>
                        </div>
                    </div>

                    <DialogFooter>
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
