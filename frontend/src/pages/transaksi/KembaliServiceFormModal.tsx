import { useState, useEffect } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { selesaiPerawatan } from "@/services/api/perawatanApi";
import type { Perawatan, PerawatanSelesaiRequest } from "@/services/api/perawatanApi";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from "@/components/ui/dialog";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

interface KembaliServiceFormModalProps {
    isOpen: boolean;
    onClose: () => void;
    data: Perawatan | null;
}

export function KembaliServiceFormModal({ isOpen, onClose, data }: KembaliServiceFormModalProps) {
    const queryClient = useQueryClient();
    const [keterangan, setKeterangan] = useState("");

    const [detailSelesai, setDetailSelesai] = useState<Record<number, {
        perbaikan: string;
        garansi: string;
        kondisiKembali: 'BAIK' | 'KURANG_BAIK' | 'RUSAK_BERAT';
    }>>({});

    useEffect(() => {
        if (data && isOpen) {
            setKeterangan("");
            const initialMap: Record<number, any> = {};
            data.detailBarang.forEach(detail => {
                initialMap[detail.barangId] = {
                    perbaikan: detail.perbaikan || "",
                    garansi: "",
                    kondisiKembali: 'BAIK'
                };
            });
            setDetailSelesai(initialMap);
        }
    }, [data, isOpen]);

    const mutation = useMutation({
        mutationFn: ({ id, req }: { id: number, req: PerawatanSelesaiRequest }) => selesaiPerawatan(id, req),
        onSuccess: () => {
            toast.success("Status perawatan berhasil diselesaikan");
            queryClient.invalidateQueries({ queryKey: ["perawatan-list"] });
            queryClient.invalidateQueries({ queryKey: ["dashboard-summary"] });
            onClose();
        },
        onError: (error: any) => {
            toast.error(error?.response?.data?.message || "Gagal memproses penyelesaian");
        },
    });

    const handleDetailChange = (barangId: number, field: string, value: string) => {
        setDetailSelesai(prev => ({
            ...prev,
            [barangId]: {
                ...prev[barangId],
                [field]: value
            }
        }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!data) return;

        for (const [_, val] of Object.entries(detailSelesai)) {
            if (!val.perbaikan) {
                toast.error("Mohon isi tindakan perbaikan untuk semua barang");
                return;
            }
        }

        const requestPayload: PerawatanSelesaiRequest = {
            keterangan,
            detailSelesaiMap: detailSelesai
        };

        mutation.mutate({ id: data.id, req: requestPayload });
    };

    if (!data) return null;

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
                <form onSubmit={handleSubmit}>
                    <DialogHeader>
                        <DialogTitle>Proses Kembali Service</DialogTitle>
                        <DialogDescription>
                            Selesaikan tiket perawatan <span className="font-medium text-foreground dark:text-slate-200">{data.noRegister}</span> dan catat hasil perbaikan serta garansi.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="py-4 space-y-6">
                        {/* Detail Daftar Barang */}
                        <div className="space-y-4">
                            <h3 className="font-semibold text-sm">Update Kondisi Barang</h3>

                            {data.detailBarang.map((item, idx) => (
                                <div key={item.id} className="p-4 border rounded-md bg-slate-50 dark:bg-slate-900 space-y-3">
                                    <div className="flex justify-between items-start mb-2 border-b pb-2 border-slate-200 dark:border-slate-800">
                                        <div>
                                            <span className="font-semibold text-sm">{idx + 1}. {item.namaBarang}</span>
                                            <div className="text-xs text-muted-foreground flex items-center gap-2 mt-1">
                                                <span>SN/Kode: <span className="font-mono">{item.kodeBarang}</span></span>
                                                <span>•</span>
                                                <span>Gejala: {item.gejala}</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="space-y-1.5">
                                            <Label className="text-xs text-muted-foreground">Tindakan Perbaikan</Label>
                                            <Input
                                                placeholder="Contoh: Ganti LCD, Instal ulang OS..."
                                                value={detailSelesai[item.barangId]?.perbaikan || ""}
                                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleDetailChange(item.barangId, 'perbaikan', e.target.value)}
                                                required
                                            />
                                        </div>

                                        <div className="space-y-1.5">
                                            <Label className="text-xs text-muted-foreground">Masa Garansi / Asuransi (Opsional)</Label>
                                            <Input
                                                type="date"
                                                value={detailSelesai[item.barangId]?.garansi || ""}
                                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleDetailChange(item.barangId, 'garansi', e.target.value)}
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-1.5">
                                        <Label className="text-xs text-muted-foreground">Kondisi Final</Label>
                                        <Select
                                            value={detailSelesai[item.barangId]?.kondisiKembali}
                                            onValueChange={(val) => handleDetailChange(item.barangId, 'kondisiKembali', val)}
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder="Pilih Kondisi" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="BAIK">Baik</SelectItem>
                                                <SelectItem value="KURANG_BAIK">Kurang Baik</SelectItem>
                                                <SelectItem value="RUSAK_BERAT">Rusak Berat</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>

                                </div>
                            ))}
                        </div>

                        {/* Catatan Tambahan */}
                        <div className="space-y-2 pt-2 border-t border-slate-200 dark:border-slate-800">
                            <Label htmlFor="catatan" className="font-semibold text-sm">Catatan Umum / Laporan Teknisi (Opsional)</Label>
                            <Textarea
                                id="catatan"
                                placeholder="Tambahkan catatan teknisi atau kesimpulan perbaikan..."
                                className="min-h-[80px]"
                                value={keterangan}
                                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setKeterangan(e.target.value)}
                            />
                        </div>
                    </div>

                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={onClose} disabled={mutation.isPending}>Batal</Button>
                        <Button type="submit" disabled={mutation.isPending}>
                            {mutation.isPending ? "Menyimpan Data..." : "Selesaikan Perbaikan"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
