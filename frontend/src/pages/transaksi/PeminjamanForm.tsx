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
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import {
    Command,
    CommandInput,
    CommandList,
    CommandEmpty,
    CommandGroup,
    CommandItem,
} from "@/components/ui/command";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";

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
        tglPinjam: new Date().toISOString().split("T")[0],
        tglKembaliRencana: "",
        barangIds: [],
        penanggungJawabName: "",
        penanggungJawabNip: "",
        penanggungJawabJabatan: "",
    });

    const [selectedBarangList, setSelectedBarangList] = useState<Barang[]>([]);
    const [selectedBarangId, setSelectedBarangId] = useState<string>("");
    const [barangPopoverOpen, setBarangPopoverOpen] = useState(false);

    useEffect(() => {
        if (isOpen) {
            setFormData({
                keperluan: "",
                keterangan: "",
                tglPinjam: new Date().toISOString().split("T")[0],
                tglKembaliRencana: "",
                barangIds: preselectedBarang ? [preselectedBarang.id] : [],
                penanggungJawabName: "",
                penanggungJawabNip: "",
                penanggungJawabJabatan: "",
            });
            setSelectedBarangList(preselectedBarang ? [preselectedBarang] : []);
            setSelectedBarangId("");
        }
    }, [isOpen, preselectedBarang]);

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
            <DialogContent className="max-w-[95vw] lg:max-w-5xl xl:max-w-6xl max-h-[90vh] flex flex-col p-0 overflow-hidden">
                <form onSubmit={handleSubmit} className="flex flex-col h-full overflow-hidden">
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
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6 text-sm bg-white border border-slate-200 p-6 rounded-lg shadow-sm">

                            {/* Left Column - Detail Peminjam */}
                            <div className="space-y-5">
                                <h4 className="font-bold text-sm text-slate-800 border-b pb-2 flex items-center gap-2">
                                    <div className="w-1.5 h-4 bg-teal-500 rounded-full"></div>
                                    Informasi Peminjam
                                </h4>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-1.5">
                                        <Label className="text-xs font-semibold text-slate-500 uppercase">Register</Label>
                                        <Input readOnly disabled value="[Generate Otomatis]" className="bg-slate-50/50" />
                                    </div>
                                    <div className="space-y-1.5">
                                        <Label className="text-xs font-semibold text-slate-500 uppercase">Tgl Pengajuan</Label>
                                        <Input type="date" readOnly disabled value={new Date().toISOString().split("T")[0]} className="bg-slate-50/50" />
                                    </div>
                                </div>
                                <div className="space-y-1.5">
                                    <Label className="text-xs font-semibold text-slate-500 uppercase">Nama Lengkap</Label>
                                    <Input readOnly disabled value={user?.name || ""} className="bg-slate-50/50" />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-1.5">
                                        <Label className="text-xs font-semibold text-slate-500 uppercase">NIP</Label>
                                        <Input readOnly disabled value={user?.nip || "-"} className="bg-slate-50/50" />
                                    </div>
                                    <div className="space-y-1.5">
                                        <Label className="text-xs font-semibold text-slate-500 uppercase">Jabatan</Label>
                                        <Input readOnly disabled value={user?.jabatan || "-"} className="bg-slate-50/50" />
                                    </div>
                                </div>
                                <div className="space-y-1.5">
                                    <Label className="text-xs font-semibold text-slate-500 uppercase">Bidang</Label>
                                    <Input readOnly disabled value={user?.bidang || "-"} className="bg-slate-50/50" />
                                </div>

                                <div className="space-y-1.5 pt-2">
                                    <Label className="text-xs font-semibold text-slate-500 uppercase">Penanggung Jawab</Label>
                                    <Input
                                        placeholder="Nama Penanggung Jawab"
                                        value={formData.penanggungJawabName || ""}
                                        onChange={(e) => setFormData({ ...formData, penanggungJawabName: e.target.value })}
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-1.5">
                                        <Label className="text-xs font-semibold text-slate-500 uppercase">NIP Penanggung Jawab</Label>
                                        <Input
                                            placeholder="NIP PJ"
                                            value={formData.penanggungJawabNip || ""}
                                            onChange={(e) => setFormData({ ...formData, penanggungJawabNip: e.target.value })}
                                        />
                                    </div>
                                    <div className="space-y-1.5">
                                        <Label className="text-xs font-semibold text-slate-500 uppercase">Jabatan Penanggung Jawab</Label>
                                        <Input
                                            placeholder="Jabatan PJ"
                                            value={formData.penanggungJawabJabatan || ""}
                                            onChange={(e) => setFormData({ ...formData, penanggungJawabJabatan: e.target.value })}
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Right Column - Detail Keperluan */}
                            <div className="space-y-5">
                                <h4 className="font-bold text-sm text-slate-800 border-b pb-2 flex items-center gap-2">
                                    <div className="w-1.5 h-4 bg-indigo-500 rounded-full"></div>
                                    Rincian Keperluan
                                </h4>
                                <div className="space-y-1.5">
                                    <Label htmlFor="keperluan" className="text-xs font-semibold text-slate-700 uppercase">
                                        Keperluan <span className="text-red-500">*</span>
                                    </Label>
                                    <Textarea
                                        id="keperluan"
                                        required
                                        className="resize-none h-24 focus-visible:ring-indigo-500"
                                        placeholder="Tuliskan keperluan peminjaman secara rinci..."
                                        value={formData.keperluan}
                                        onChange={(e) => setFormData({ ...formData, keperluan: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-1.5">
                                    <Label htmlFor="keterangan" className="text-xs font-semibold text-slate-700 uppercase">
                                        Keterangan Tambahan
                                    </Label>
                                    <Textarea
                                        id="keterangan"
                                        className="resize-none h-20 focus-visible:ring-indigo-500"
                                        placeholder="Keterangan operasional atau catatan khusus..."
                                        value={formData.keterangan || ""}
                                        onChange={(e) => setFormData({ ...formData, keterangan: e.target.value })}
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4 pt-2">
                                    <div className="space-y-1.5">
                                        <Label className="text-xs font-semibold text-slate-700 uppercase">Tgl Pinjam <span className="text-red-500">*</span></Label>
                                        <Input
                                            type="date"
                                            required
                                            className="focus-visible:ring-indigo-500"
                                            value={formData.tglPinjam || ""}
                                            onChange={(e) => setFormData({ ...formData, tglPinjam: e.target.value })}
                                        />
                                    </div>
                                    <div className="space-y-1.5">
                                        <Label htmlFor="tglKembaliRencana" className="text-xs font-semibold text-slate-800 uppercase">
                                            Rencana Kembali <span className="text-red-500">*</span>
                                        </Label>
                                        <Input
                                            id="tglKembaliRencana"
                                            type="date"
                                            required
                                            className="border-indigo-200 focus-visible:ring-indigo-500 bg-indigo-50/30"
                                            value={formData.tglKembaliRencana || ""}
                                            onChange={(e) => setFormData({ ...formData, tglKembaliRencana: e.target.value })}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Selected Barang Table Section */}
                        <div className="border border-slate-200 rounded-lg overflow-hidden bg-white mt-4 shadow-sm">
                            <div className="bg-slate-50 dark:bg-slate-800 p-4 border-b flex items-center justify-between gap-4">
                                <h4 className="font-bold text-sm text-slate-800 uppercase tracking-wide">Daftar Barang yang Dipinjam</h4>
                                <div className="flex items-center gap-2 flex-1 max-w-md ml-auto">
                                    <Popover open={barangPopoverOpen} onOpenChange={setBarangPopoverOpen} modal={true}>
                                        <PopoverTrigger asChild>
                                            <Button
                                                type="button"
                                                variant="outline"
                                                role="combobox"
                                                aria-expanded={barangPopoverOpen}
                                                className="flex-1 justify-between bg-white font-normal truncate"
                                            >
                                                <span className="truncate">
                                                    {selectedBarangId
                                                        ? availableBarang.find(b => b.id.toString() === selectedBarangId)?.namaBarang ?? "Pilih barang..."
                                                        : isLoadingBarang ? "Memuat..." : "Cari & pilih barang..."}
                                                </span>
                                                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                            </Button>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-[400px] p-0" align="end">
                                            <Command filter={(value, search) => {
                                                const item = availableBarang.find(b => b.id.toString() === value);
                                                if (!item) return 0;
                                                const label = `${item.kodeBarang} ${item.namaBarang}`.toLowerCase();
                                                return label.includes(search.toLowerCase()) ? 1 : 0;
                                            }}>
                                                <CommandInput placeholder="Ketik nama atau kode barang..." />
                                                <CommandList>
                                                    <CommandEmpty>Tidak ditemukan.</CommandEmpty>
                                                    <CommandGroup>
                                                        {availableBarang.map(b => (
                                                            <CommandItem
                                                                key={b.id}
                                                                value={b.id.toString()}
                                                                onSelect={(val) => {
                                                                    setSelectedBarangId(val === selectedBarangId ? "" : val);
                                                                    setBarangPopoverOpen(false);
                                                                }}
                                                            >
                                                                <Check className={cn("mr-2 h-4 w-4", selectedBarangId === b.id.toString() ? "opacity-100" : "opacity-0")} />
                                                                <div className="flex flex-col">
                                                                    <span className="text-sm font-medium">{b.namaBarang}</span>
                                                                    <span className="text-xs text-muted-foreground">{b.kodeBarang}</span>
                                                                </div>
                                                            </CommandItem>
                                                        ))}
                                                    </CommandGroup>
                                                </CommandList>
                                            </Command>
                                        </PopoverContent>
                                    </Popover>
                                    <Button type="button" size="sm" onClick={handleAddBarang} disabled={!selectedBarangId || selectedBarangId === "empty"}>
                                        <PlusCircle className="w-4 h-4 mr-1" /> Tambah
                                    </Button>
                                </div>
                            </div>

                            <div className="overflow-x-auto">
                                <Table>
                                    <TableHeader>
                                        <TableRow className="bg-slate-100 dark:bg-slate-900 border-b-2">
                                            <TableHead className="w-[50px] font-bold text-center text-slate-700 border-r">NO</TableHead>
                                            <TableHead className="font-bold text-slate-700 border-r min-w-[250px] w-1/3">BARANG</TableHead>
                                            <TableHead className="font-bold text-slate-700 border-r text-center min-w-[200px] w-1/4">KETERANGAN</TableHead>
                                            <TableHead className="w-[140px] font-bold text-slate-700 border-r text-center bg-slate-100">STATUS</TableHead>
                                            <TableHead className="w-[90px] font-bold text-slate-700 text-center border-r">JUMLAH</TableHead>
                                            <TableHead className="w-[80px] font-bold text-slate-700 text-center">AKSI</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {selectedBarangList.length === 0 ? (
                                            <TableRow>
                                                <TableCell colSpan={6} className="text-center h-32 text-slate-500 font-medium">
                                                    Belum ada barang yang ditambah. Silakan pilih dan tambah barang yang akan dipinjam.
                                                </TableCell>
                                            </TableRow>
                                        ) : (
                                            selectedBarangList.map((item, index) => (
                                                <TableRow key={item.id}>
                                                    <TableCell className="text-center font-medium border-r">{index + 1}.</TableCell>
                                                    <TableCell className="border-r">
                                                        <div className="font-semibold text-foreground">{item.namaBarang}</div>
                                                        <div className="text-xs text-muted-foreground">{item.kodeBarang} / NUP: {item.nup || "-"}</div>
                                                    </TableCell>
                                                    <TableCell className="border-r pt-3 align-top">
                                                        <Input placeholder="Keterangan..." className="h-8 text-xs bg-white" />
                                                    </TableCell>
                                                    <TableCell className="border-r text-center pt-3 align-top">
                                                        <Select defaultValue="diminta">
                                                            <SelectTrigger className="h-8 text-xs font-semibold bg-white w-full">
                                                                <SelectValue placeholder="DIMINTA" />
                                                            </SelectTrigger>
                                                            <SelectContent>
                                                                <SelectItem value="diminta" className="text-xs font-semibold text-amber-600">DIMINTA</SelectItem>
                                                                <SelectItem value="dipinjam" className="text-xs font-semibold text-blue-600" disabled>DIPINJAM</SelectItem>
                                                                <SelectItem value="ditolak" className="text-xs font-semibold text-red-600" disabled>DITOLAK</SelectItem>
                                                            </SelectContent>
                                                        </Select>
                                                    </TableCell>
                                                    <TableCell className="text-center font-medium border-r pt-3 align-top">
                                                        <div className="h-8 flex items-center justify-center font-bold">1</div>
                                                    </TableCell>
                                                    <TableCell className="text-center pt-3 align-top">
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
                    </div>

                    <DialogFooter className="px-6 py-4 border-t bg-white dark:bg-slate-900 flex justify-end items-center w-full gap-3 text-sm flex-none">
                        <Button type="button" variant="outline" onClick={onClose} disabled={mutation.isPending} className="min-w-[100px] border-slate-300">
                            Batal
                        </Button>
                        <Button type="submit" disabled={mutation.isPending} className="bg-indigo-600 hover:bg-indigo-700 text-white min-w-[140px] shadow-sm">
                            {mutation.isPending ? "Memproses..." : "Ajukan Peminjaman"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
