import { useState, useEffect } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { createPerawatan } from "@/services/api/perawatanApi";
import type { PerawatanRequest } from "@/services/api/perawatanApi";
import type { Barang } from "@/services/api/barangApi";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";

interface PerawatanFormProps {
    isOpen: boolean;
    onClose: () => void;
    preselectedBarang?: Barang;
}

export function PerawatanForm({ isOpen, onClose, preselectedBarang }: PerawatanFormProps) {
    const queryClient = useQueryClient();

    const [formData, setFormData] = useState<PerawatanRequest>({
        hal: "",
        tglSelesaiRencana: "",
        details: [],
    });

    const [barangId, setBarangId] = useState("");
    const [keluhan, setKeluhan] = useState("");

    // Reset when modal opens
    useEffect(() => {
        if (isOpen) {
            setFormData({
                hal: "",
                tglSelesaiRencana: "",
                details: [],
            });
            setBarangId(preselectedBarang ? preselectedBarang.id.toString() : "");
            setKeluhan("");
        }
    }, [isOpen, preselectedBarang]);

    const mutation = useMutation({
        mutationFn: createPerawatan,
        onSuccess: () => {
            toast.success("Perawatan berhasil diajukan");
            queryClient.invalidateQueries({ queryKey: ["perawatan-list"] });
            queryClient.invalidateQueries({ queryKey: ["dashboard-summary"] });
            onClose();
        },
        onError: (error: any) => {
            toast.error(error?.response?.data?.message || "Gagal mengajukan perawatan");
        },
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!barangId || !keluhan) {
            toast.error("Silakan masukkan ID Barang dan Keluhan");
            return;
        }

        const requestData: PerawatanRequest = {
            ...formData,
            details: [
                {
                    barangId: parseInt(barangId),
                    gejala: keluhan
                }
            ]
        };
        mutation.mutate(requestData);
    };

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="sm:max-w-[500px]">
                <form onSubmit={handleSubmit}>
                    <DialogHeader>
                        <DialogTitle>Pengajuan Perawatan Baru</DialogTitle>
                        <DialogDescription>
                            Isi data keruskan atau perawatan berkala sarana dan prasarana.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="hal" className="text-right font-medium">Hal/Subjek</Label>
                            <Input id="hal" required placeholder="Contoh: AC Mati" className="col-span-3" value={formData.hal} onChange={(e) => setFormData({ ...formData, hal: e.target.value })} />
                        </div>

                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="tglSelesaiRencana" className="text-right font-medium">Target Selesai</Label>
                            <Input id="tglSelesaiRencana" type="date" required className="col-span-3" value={formData.tglSelesaiRencana} onChange={(e) => setFormData({ ...formData, tglSelesaiRencana: e.target.value })} />
                        </div>

                        <div className="border-t pt-4 mt-2">
                            <h4 className="text-sm font-semibold mb-3">Detail Aset Bermasalah</h4>
                            <div className="grid gap-4">
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <Label htmlFor="barangId" className="text-right font-medium">Barang ID</Label>
                                    <Input id="barangId" type="number" required placeholder="Contoh: 2" className="col-span-3" value={barangId} onChange={(e) => setBarangId(e.target.value)} />
                                </div>

                                <div className="grid grid-cols-4 items-center gap-4">
                                    <Label htmlFor="keluhan" className="text-right font-medium">Keluhan Utama</Label>
                                    <Input id="keluhan" required className="col-span-3" placeholder="Deskripsi keluhan" value={keluhan} onChange={(e) => setKeluhan(e.target.value)} />
                                </div>
                            </div>
                        </div>

                    </div>

                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={onClose} disabled={mutation.isPending}>Batal</Button>
                        <Button type="submit" disabled={mutation.isPending}>
                            {mutation.isPending ? "Memproses..." : "Ajukan Perawatan"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
