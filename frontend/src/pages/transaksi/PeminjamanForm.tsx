import { useState, useEffect } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { createPeminjaman } from "@/services/api/peminjamanApi";
import type { PeminjamanRequest } from "@/services/api/peminjamanApi";
import { getBarang } from "@/services/api/barangApi";
import type { Barang } from "@/services/api/barangApi";
import { useAuthStore } from "@/store/useAuthStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { PlusCircle, Trash2 } from "lucide-react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
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

interface PeminjamanFormProps {
    isOpen: boolean;
    onClose: () => void;
    preselectedBarang?: Barang;
}

export function PeminjamanForm({ isOpen, onClose, preselectedBarang }: PeminjamanFormProps) {
    const queryClient = useQueryClient();
    const { user } = useAuthStore();

    const [formData, setFormData] = useState<PeminjamanRequest>({
        keperluan: "",
        keterangan: "",
        tglKembaliRencana: "",
        barangIds: [],
    });

    const [selectedBarangList, setSelectedBarangList] = useState<Barang[]>([]);
    const [selectedBarangId, setSelectedBarangId] = useState<string>("");

    // Reset when modal opens
    useEffect(() => {
        if (isOpen) {
            setFormData({
                keperluan: "",
                keterangan: "",
                tglKembaliRencana: "",
                barangIds: preselectedBarang ? [preselectedBarang.id] : [],
            });
            setSelectedBarangList(preselectedBarang ? [preselectedBarang] : []);
            setSelectedBarangId("");
        }
    }, [isOpen, preselectedBarang]);

    // Fetch Barang Tersedia
    const { data: barangData, isLoading: isLoadingBarang } = useQuery({
        queryKey: ["barang-tersedia-list"],
        queryFn: () => getBarang(0, 1000, ""),
        enabled: isOpen,
    });

    const availableBarang = barangData?.content.filter(b => b.status === "TERSEDIA") || [];

    const handleAddBarang = () => {
        if (!selectedBarangId) return;
        const barang = availableBarang.find(b => b.id.toString() === selectedBarangId);
        if (barang && !selectedBarangList.some(b => b.id === barang.id)) {
            setSelectedBarangList([...selectedBarangList, barang]);
            setFormData(prev => ({ ...prev, barangIds: [...prev.barangIds, barang.id] }));
        }
        setSelectedBarangId("");
    };

    const handleRemoveBarang = (id: number) => {
        setSelectedBarangList(selectedBarangList.filter(b => b.id !== id));
        setFormData(prev => ({ ...prev, barangIds: prev.barangIds.filter(bId => bId !== id) }));
    };

    const mutation = useMutation({
        mutationFn: createPeminjaman,
        onSuccess: () => {
            toast.success("Peminjaman berhasil diajukan");
            queryClient.invalidateQueries({ queryKey: ["peminjaman-list"] });
            queryClient.invalidateQueries({ queryKey: ["dashboard-summary"] });
            onClose();
        },
        onError: (error: any) => {
            toast.error(error?.response?.data?.message || "Gagal mengajukan peminjaman");
        },
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (formData.barangIds.length === 0) {
            toast.error("Silakan pilih minimal 1 Barang yang akan dipinjam.");
            return;
        }

        mutation.mutate(formData);
    };

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="max-w-4xl max-h-[90vh] flex flex-col p-0">
                <form onSubmit={handleSubmit} className="flex flex-col h-full">
                    <DialogHeader className="px-6 py-4 border-b">
                        <DialogTitle className="text-xl text-teal-600 dark:text-teal-400 font-bold uppercase tracking-wider">
                            Peminjaman Barang
                        </DialogTitle>
                        <DialogDescription>
                            Lengkapi rincian data peminjam dan pilih barang yang akan dipinjam.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="flex-1 overflow-y-auto p-6 space-y-6">

                        {/* Upper Section: 2 Columns */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4 text-sm">

                            {/* Left Column */}
                            <div className="space-y-4">
                                <div className="grid grid-cols-3 items-center gap-4">
                                    <Label className="text-right font-medium text-muted-foreground">REGISTER</Label>
                                    <Input readOnly disabled value="[Generate Otomatis]" className="col-span-2 bg-slate-50" />
                                </div>
                                <div className="grid grid-cols-3 items-center gap-4">
                                    <Label className="text-right font-medium text-muted-foreground">TANGGAL</Label>
                                    <Input type="date" readOnly disabled value={new Date().toISOString().split("T")[0]} className="col-span-2 bg-slate-50" />
                                </div>
                                <div className="grid grid-cols-3 items-start gap-4">
                                    <Label className="text-right font-medium text-muted-foreground mt-2">PEMINJAM</Label>
                                    <Textarea readOnly disabled value={user?.name || ""} className="col-span-2 bg-slate-50 resize-none h-16" />
                                </div>
                                <div className="grid grid-cols-3 items-start gap-4">
                                    <Label className="text-right font-medium text-muted-foreground mt-2">BIDANG</Label>
                                    <Textarea readOnly disabled value={user?.bidang || "-"} className="col-span-2 bg-slate-50 resize-none h-16" />
                                </div>
                            </div>

                            {/* Right Column */}
                            <div className="space-y-4">
                                <div className="grid grid-cols-3 items-center gap-4">
                                    <Label className="text-right font-medium text-muted-foreground">PENANGGUNG JAWAB</Label>
                                    <Input readOnly disabled placeholder="Ditetapkan saat Persetujuan/Pengembalian" className="col-span-2 bg-slate-50" />
                                </div>
                                <div className="grid grid-cols-3 items-center gap-4">
                                    <Label className="text-right font-medium text-muted-foreground">NIP</Label>
                                    <Input readOnly disabled value={user?.nip || "-"} className="col-span-2 bg-slate-50" />
                                </div>
                                <div className="grid grid-cols-3 items-center gap-4">
                                    <Label className="text-right font-medium text-muted-foreground">JABATAN</Label>
                                    <Input readOnly disabled value={user?.jabatan || "-"} className="col-span-2 bg-slate-50" />
                                </div>
                            </div>

                        </div>

                        <div className="border-t pt-4 space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4 text-sm">
                                <div className="space-y-4">
                                    <div className="grid grid-cols-3 items-start gap-4">
                                        <Label htmlFor="keperluan" className="text-right font-medium text-muted-foreground mt-2">KEPERLUAN <span className="text-red-500">*</span></Label>
                                        <Textarea
                                            id="keperluan"
                                            required
                                            className="col-span-2 resize-none h-20"
                                            placeholder="Tuliskan keperluan peminjaman..."
                                            value={formData.keperluan}
                                            onChange={(e) => setFormData({ ...formData, keperluan: e.target.value })}
                                        />
                                    </div>
                                    <div className="grid grid-cols-3 items-start gap-4">
                                        <Label htmlFor="keterangan" className="text-right font-medium text-muted-foreground mt-2">KETERANGAN</Label>
                                        <Textarea
                                            id="keterangan"
                                            className="col-span-2 resize-none h-20 border-blue-400 focus-visible:ring-blue-400"
                                            placeholder="Keterangan operasional..."
                                            value={formData.keterangan || ""}
                                            onChange={(e) => setFormData({ ...formData, keterangan: e.target.value })}
                                        />
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <div className="grid grid-cols-3 items-center gap-4">
                                        <Label className="text-right font-medium text-muted-foreground">TANGGAL PINJAM</Label>
                                        <Input type="date" value={new Date().toISOString().split("T")[0]} readOnly disabled className="col-span-2 bg-slate-50" />
                                    </div>
                                    <div className="grid grid-cols-3 items-center gap-4">
                                        <Label htmlFor="tglKembaliRencana" className="text-right font-medium text-muted-foreground">TANGGAL KEMBALI</Label>
                                        <Input
                                            id="tglKembaliRencana"
                                            type="date"
                                            className="col-span-2"
                                            value={formData.tglKembaliRencana || ""}
                                            onChange={(e) => setFormData({ ...formData, tglKembaliRencana: e.target.value })}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Selected Barang Table Section */}
                        <div className="border rounded-md overflow-hidden">
                            <div className="bg-slate-100 dark:bg-slate-800 p-3 border-b flex items-center justify-between gap-4">
                                <h4 className="font-semibold text-sm">Daftar Barang yang Dipinjam</h4>
                                <div className="flex items-center gap-2 flex-1 max-w-md ml-auto">
                                    <Select value={selectedBarangId} onValueChange={setSelectedBarangId}>
                                        <SelectTrigger className="bg-white">
                                            <SelectValue placeholder={isLoadingBarang ? "Memuat..." : "Pilih Barang Tersedia..."} />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {availableBarang.map(b => (
                                                <SelectItem key={b.id} value={b.id.toString()}>
                                                    {b.kodeBarang} - {b.namaBarang}
                                                </SelectItem>
                                            ))}
                                            {availableBarang.length === 0 && !isLoadingBarang && (
                                                <SelectItem value="empty" disabled>Tidak ada barang tersedia</SelectItem>
                                            )}
                                        </SelectContent>
                                    </Select>
                                    <Button type="button" size="sm" onClick={handleAddBarang} disabled={!selectedBarangId || selectedBarangId === "empty"}>
                                        <PlusCircle className="w-4 h-4 mr-1" /> Tambah
                                    </Button>
                                </div>
                            </div>

                            <Table>
                                <TableHeader>
                                    <TableRow className="bg-slate-50 dark:bg-slate-900 border-b-2">
                                        <TableHead className="w-[50px] font-bold text-center">NO</TableHead>
                                        <TableHead className="font-bold border-l">BARANG</TableHead>
                                        <TableHead className="w-[100px] font-bold border-l text-center">JUMLAH</TableHead>
                                        <TableHead className="w-[200px] font-bold border-l text-center">STATUS</TableHead>
                                        <TableHead className="w-[70px] font-bold border-l text-center">AKSI</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {selectedBarangList.length === 0 ? (
                                        <TableRow>
                                            <TableCell colSpan={5} className="text-center h-24 text-muted-foreground">
                                                Belum ada barang yang dipilih.
                                            </TableCell>
                                        </TableRow>
                                    ) : (
                                        selectedBarangList.map((item, index) => (
                                            <TableRow key={item.id}>
                                                <TableCell className="text-center font-medium border-r">{index + 1}.</TableCell>
                                                <TableCell className="border-r">
                                                    <div className="font-semibold">{item.namaBarang}</div>
                                                    <div className="text-xs text-muted-foreground">{item.kodeBarang} / {item.nup || "-"}</div>
                                                </TableCell>
                                                <TableCell className="border-r text-center font-medium">1</TableCell>
                                                <TableCell className="border-r text-center text-xs">
                                                    <span className="px-2 py-1 bg-amber-100 text-amber-800 rounded-sm font-semibold">
                                                        DIMINTA
                                                    </span>
                                                </TableCell>
                                                <TableCell className="text-center">
                                                    <Button
                                                        type="button"
                                                        variant="ghost"
                                                        size="sm"
                                                        className="text-red-500 hover:text-red-700 hover:bg-red-50"
                                                        onClick={() => handleRemoveBarang(item.id)}
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </Button>
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    )}
                                </TableBody>
                            </Table>
                        </div>
                    </div>

                    <DialogFooter className="px-6 py-4 border-t bg-slate-50 dark:bg-slate-900 justify-center sm:justify-center gap-2">
                        <Button type="submit" disabled={mutation.isPending} className="bg-cyan-500 hover:bg-cyan-600 text-white min-w-[100px]">
                            {mutation.isPending ? "Proses..." : "Update"}
                        </Button>
                        <Button type="button" variant="destructive" disabled={mutation.isPending} className="bg-red-500 hover:bg-red-600 min-w-[100px]">
                            Delete
                        </Button>
                        <Button type="button" variant="secondary" onClick={onClose} disabled={mutation.isPending} className="bg-slate-200 hover:bg-slate-300 text-foreground min-w-[100px]">
                            Cancel
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
