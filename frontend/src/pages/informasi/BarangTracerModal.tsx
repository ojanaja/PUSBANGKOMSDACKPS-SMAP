import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getBarangHistoryPeminjaman, getBarangHistoryPerawatan } from '@/services/api/barangApi';
import { type Barang } from '@/services/api/barangApi';
import { PeminjamanForm } from '@/pages/transaksi/PeminjamanForm';
import { PerawatanForm } from '@/pages/transaksi/PerawatanForm';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { MapContainer, TileLayer, Marker } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { Image as ImageIcon, MapPin, ClipboardList, Wrench } from "lucide-react";

// Fix for default marker icon in react-leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

interface BarangTracerModalProps {
    isOpen: boolean;
    onClose: () => void;
    barang: Barang;
}

export function BarangTracerModal({ isOpen, onClose, barang }: BarangTracerModalProps) {
    const [activeTab, setActiveTab] = useState('umum');
    const [isPeminjamanFormOpen, setIsPeminjamanFormOpen] = useState(false);
    const [isPerawatanFormOpen, setIsPerawatanFormOpen] = useState(false);

    const { data: peminjamanHistory, isLoading: isLoadingPeminjaman } = useQuery({
        queryKey: ['barang-history-peminjaman', barang.id],
        queryFn: () => getBarangHistoryPeminjaman(barang.id, 0, 100),
        enabled: isOpen && activeTab === 'peminjaman',
    });

    const { data: perawatanHistory, isLoading: isLoadingPerawatan } = useQuery({
        queryKey: ['barang-history-perawatan', barang.id],
        queryFn: () => getBarangHistoryPerawatan(barang.id, 0, 100),
        enabled: isOpen && activeTab === 'perawatan',
    });

    const parsedCoords = (): [number, number] | null => {
        if (!barang.koordinatPeta) return null;
        const parts = barang.koordinatPeta.split(',');
        if (parts.length === 2) {
            const lat = parseFloat(parts[0].trim());
            const lng = parseFloat(parts[1].trim());
            if (!isNaN(lat) && !isNaN(lng)) return [lat, lng];
        }
        return null;
    };
    const coords = parsedCoords();

    return (
        <>
            <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
                <DialogContent className="max-w-6xl sm:max-w-6xl max-h-[90vh] flex flex-col p-0">
                    <DialogHeader className="px-6 py-4 border-b bg-slate-50 dark:bg-slate-900">
                        <DialogTitle className="text-xl text-foreground dark:text-foreground font-bold uppercase tracking-wider flex items-center justify-between">
                            <span>Tracer Alat: {barang.namaBarang}</span>
                        </DialogTitle>
                        <DialogDescription>
                            Informasi lengkap spesifikasi alat dan riwayat peminjaman / perawatan.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="flex-1 overflow-y-auto p-4 sm:p-6 pb-8">
                        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                            <TabsList className="grid w-full max-w-md grid-cols-3 mb-6 bg-slate-100 dark:bg-slate-800">
                                <TabsTrigger value="umum" className="font-semibold cursor-pointer">UMUM</TabsTrigger>
                                <TabsTrigger value="peminjaman" className="font-semibold cursor-pointer">PEMINJAMAN</TabsTrigger>
                                <TabsTrigger value="perawatan" className="font-semibold cursor-pointer">PERAWATAN</TabsTrigger>
                            </TabsList>

                            <TabsContent value="umum" className="space-y-6 mt-0">
                                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                                    {/* Left Col - Info Utama */}
                                    <div className="space-y-4">
                                        <div className="flex items-center gap-2 mb-2 pb-2 border-b">
                                            <h3 className="font-bold text-sm text-muted-foreground uppercase">Informasi Utama</h3>
                                        </div>
                                        <div className="grid grid-cols-3 items-center gap-4">
                                            <Label className="text-right text-muted-foreground font-medium text-xs">KODE BARANG</Label>
                                            <Input readOnly value={barang.kodeBarang} className="col-span-2 bg-slate-50 font-semibold text-sm h-8" />
                                        </div>
                                        <div className="grid grid-cols-3 items-center gap-4">
                                            <Label className="text-right text-muted-foreground font-medium text-xs">NUP</Label>
                                            <Input readOnly value={barang.nup || '-'} className="col-span-2 bg-slate-50 text-sm h-8" />
                                        </div>
                                        <div className="grid grid-cols-3 items-center gap-4">
                                            <Label className="text-right text-muted-foreground font-medium text-xs">NAMA BARANG</Label>
                                            <Input readOnly value={barang.namaBarang} className="col-span-2 bg-slate-50 font-semibold text-foreground text-sm h-8" />
                                        </div>
                                        <div className="grid grid-cols-3 items-center gap-4">
                                            <Label className="text-right text-muted-foreground font-medium text-xs">TANGGAL BUKU</Label>
                                            <Input readOnly value={barang.tglPerolehan || '-'} type="date" className="col-span-2 bg-slate-50 text-sm h-8" />
                                        </div>
                                        <div className="grid grid-cols-3 items-center gap-4">
                                            <Label className="text-right text-muted-foreground font-medium text-xs">MERK / TYPE</Label>
                                            <Input readOnly value={barang.merkType || '-'} className="col-span-2 bg-slate-50 text-sm h-8" />
                                        </div>
                                        <div className="grid grid-cols-3 items-center gap-4">
                                            <Label className="text-right text-muted-foreground font-medium text-xs">UKURAN</Label>
                                            <Input readOnly value={barang.ukuran || '-'} className="col-span-2 bg-slate-50 text-sm h-8" />
                                        </div>
                                        <div className="grid grid-cols-3 items-center gap-4">
                                            <Label className="text-right text-muted-foreground font-medium text-xs">BPKB</Label>
                                            <Input readOnly value={barang.buktiKepemilikan || '-'} className="col-span-2 bg-slate-50 text-sm h-8" />
                                        </div>
                                        <div className="grid grid-cols-3 items-center gap-4">
                                            <Label className="text-right text-muted-foreground font-medium text-xs">STATUS</Label>
                                            <div className="col-span-2">
                                                <span className={`px-3 py-1 text-xs font-bold uppercase rounded-md inline-flex ${barang.status === 'TERSEDIA' ? 'bg-emerald-100 text-emerald-800' :
                                                    barang.status === 'DIPINJAM' ? 'bg-indigo-100 text-indigo-800' :
                                                        'bg-amber-100 text-amber-800'
                                                    }`}>
                                                    {barang.status}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Middle Col - Lokasi & Kondisi */}
                                    <div className="space-y-4">
                                        <div className="flex items-center gap-2 mb-2 pb-2 border-b">
                                            <h3 className="font-bold text-sm text-muted-foreground uppercase">Lokasi & Kondisi</h3>
                                        </div>
                                        <div className="grid grid-cols-3 items-center gap-4">
                                            <Label className="text-right text-muted-foreground font-medium text-xs">KONDISI BMN</Label>
                                            <Input readOnly value={barang.kondisi?.replace('_', ' ') || '-'} className="col-span-2 bg-slate-50 text-sm h-8" />
                                        </div>
                                        <div className="grid grid-cols-3 items-center gap-4">
                                            <Label className="text-right text-muted-foreground font-medium text-xs">GEDUNG</Label>
                                            <Input readOnly value={barang.gudang || '-'} className="col-span-2 bg-slate-50 text-sm h-8" />
                                        </div>
                                        <div className="grid grid-cols-3 items-center gap-4">
                                            <Label className="text-right text-muted-foreground font-medium text-xs">LOKASI</Label>
                                            <Input readOnly value={barang.lokasi || '-'} className="col-span-2 bg-slate-50 text-sm h-8" />
                                        </div>
                                        <div className="grid grid-cols-3 items-center gap-4">
                                            <Label className="text-right text-muted-foreground font-medium text-xs">PEMAKAI</Label>
                                            <Input readOnly value={barang.pemakai || '-'} className="col-span-2 bg-slate-50 text-sm h-8" />
                                        </div>
                                        <div className="grid grid-cols-3 items-center gap-4">
                                            <Label className="text-right text-muted-foreground font-medium text-xs">KOORDINAT GPS</Label>
                                            <Input readOnly value={barang.koordinatPeta || '-'} className="col-span-2 bg-slate-50 text-sm h-8" />
                                        </div>
                                        <div className="grid grid-cols-3 items-start gap-4">
                                            <Label className="text-right text-muted-foreground font-medium text-xs mt-2">KETERANGAN</Label>
                                            <Textarea readOnly value={barang.keterangan || '-'} className="col-span-2 bg-slate-50 min-h-[95px] text-sm" />
                                        </div>
                                    </div>

                                    {/* Right Col - Visual (Photo & Map) */}
                                    <div className="space-y-4">
                                        <div className="flex items-center gap-2 mb-2 pb-2 border-b">
                                            <h3 className="font-bold text-sm text-muted-foreground uppercase">Visual Aset</h3>
                                        </div>

                                        <div className="border rounded-lg overflow-x-auto bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800 flex h-[200px] snap-x snap-mandatory scrollbar-hide">
                                            {barang.photoUrl ? (
                                                barang.photoUrl.split(',').filter(Boolean).map((url, idx) => (
                                                    <div key={idx} className="w-full h-full p-2 flex items-center justify-center shrink-0 snap-center">
                                                        <img
                                                            src={url.startsWith('http') ? url : `http://localhost:8080/api${url.replace('/uploads/', '/files/')}`}
                                                            alt={`${barang.namaBarang} - Photo ${idx + 1}`}
                                                            className="max-w-full max-h-full object-contain rounded-md shadow-sm"
                                                        />
                                                    </div>
                                                ))
                                            ) : (
                                                <div className="w-full h-full flex flex-col items-center justify-center text-muted-foreground gap-2 shrink-0">
                                                    <ImageIcon className="w-8 h-8 opacity-20" />
                                                    <span className="text-xs font-medium">Foto aset tidak tersedia</span>
                                                </div>
                                            )}
                                        </div>

                                        <div className="border rounded-lg overflow-hidden bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800 flex flex-col h-[200px] relative">
                                            {coords ? (
                                                <MapContainer center={coords} zoom={16} style={{ height: '100%', width: '100%', zIndex: 0 }}>
                                                    <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                                                    <Marker position={coords} />
                                                </MapContainer>
                                            ) : (
                                                <div className="w-full h-full flex flex-col items-center justify-center text-muted-foreground gap-2">
                                                    <MapPin className="w-8 h-8 opacity-20" />
                                                    <span className="text-xs font-medium">Koordinat GPS tidak tersedia</span>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                <div className="flex flex-col sm:flex-row gap-4 mt-8 pt-6 border-t border-slate-200 dark:border-slate-800">
                                    <Button
                                        variant="outline"
                                        className="flex-1 h-12 text-sm font-semibold tracking-wide border-indigo-200 text-indigo-700 hover:bg-indigo-50 dark:border-indigo-900 dark:text-indigo-400 dark:hover:bg-indigo-950/50"
                                        onClick={() => setIsPeminjamanFormOpen(true)}
                                    >
                                        <ClipboardList className="w-5 h-5 mr-2" />
                                        DAFTAR PEMINJAMAN
                                    </Button>
                                    <Button
                                        variant="outline"
                                        className="flex-1 h-12 text-sm font-semibold tracking-wide border-amber-200 text-amber-700 hover:bg-amber-50 dark:border-amber-900 dark:text-amber-400 dark:hover:bg-amber-950/50"
                                        onClick={() => setIsPerawatanFormOpen(true)}
                                    >
                                        <Wrench className="w-5 h-5 mr-2" />
                                        DAFTAR SERVICE
                                    </Button>
                                </div>
                            </TabsContent>

                            <TabsContent value="peminjaman" className="mt-0">
                                <div className="border rounded-lg bg-white overflow-hidden shadow-sm">
                                    <Table>
                                        <TableHeader className="bg-indigo-50 dark:bg-indigo-900/30">
                                            <TableRow>
                                                <TableHead className="w-[50px] font-bold text-center">NO</TableHead>
                                                <TableHead className="font-bold border-l">TANGGAL PINJAM</TableHead>
                                                <TableHead className="font-bold border-l">PEMINJAM</TableHead>
                                                <TableHead className="font-bold border-l">KETERANGAN / KEPERLUAN</TableHead>
                                                <TableHead className="font-bold border-l">STATUS</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {isLoadingPeminjaman ? (
                                                <TableRow>
                                                    <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">Memuat riwayat peminjaman...</TableCell>
                                                </TableRow>
                                            ) : peminjamanHistory?.content.length === 0 ? (
                                                <TableRow>
                                                    <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">Belum ada riwayat peminjaman untuk barang ini.</TableCell>
                                                </TableRow>
                                            ) : (
                                                peminjamanHistory?.content.map((history: any, idx: number) => (
                                                    <TableRow key={history.id}>
                                                        <TableCell className="text-center font-medium border-r">{idx + 1}.</TableCell>
                                                        <TableCell className="border-r whitespace-nowrap">{history.tglPinjam || '-'}</TableCell>
                                                        <TableCell className="border-r font-medium text-foreground">{history.peminjamName || '-'}</TableCell>
                                                        <TableCell className="border-r">
                                                            <div className="text-sm">{history.keperluan}</div>
                                                            {history.keterangan && <div className="text-xs text-muted-foreground mt-1">{history.keterangan}</div>}
                                                        </TableCell>
                                                        <TableCell className="whitespace-nowrap">
                                                            <span className={`px-2 py-1 text-xs font-semibold rounded-md ${history.status === 'DISELESAIKAN' ? 'bg-emerald-100 text-emerald-700' :
                                                                history.status === 'DISETUJUI' ? 'bg-blue-100 text-foreground' :
                                                                    'bg-amber-100 text-amber-700'
                                                                }`}>
                                                                {history.status?.replace('_', ' ')}
                                                            </span>
                                                        </TableCell>
                                                    </TableRow>
                                                ))
                                            )}
                                        </TableBody>
                                    </Table>
                                </div>
                            </TabsContent>

                            <TabsContent value="perawatan" className="mt-0">
                                <div className="border rounded-lg bg-white overflow-hidden shadow-sm">
                                    <Table>
                                        <TableHeader className="bg-amber-50 dark:bg-amber-900/30">
                                            <TableRow>
                                                <TableHead className="w-[50px] font-bold text-center">NO</TableHead>
                                                <TableHead className="font-bold border-l">TANGGAL PERBAIKAN</TableHead>
                                                <TableHead className="font-bold border-l">DIAJUKAN OLEH</TableHead>
                                                <TableHead className="font-bold border-l">PERIHAL / KETERANGAN</TableHead>
                                                <TableHead className="font-bold border-l">STATUS</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {isLoadingPerawatan ? (
                                                <TableRow>
                                                    <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">Memuat riwayat perawatan...</TableCell>
                                                </TableRow>
                                            ) : perawatanHistory?.content.length === 0 ? (
                                                <TableRow>
                                                    <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">Belum ada riwayat perbaikan/perawatan untuk barang ini.</TableCell>
                                                </TableRow>
                                            ) : (
                                                perawatanHistory?.content.map((history: any, idx: number) => (
                                                    <TableRow key={history.id}>
                                                        <TableCell className="text-center font-medium border-r">{idx + 1}.</TableCell>
                                                        <TableCell className="border-r whitespace-nowrap">{history.tglService || '-'}</TableCell>
                                                        <TableCell className="border-r font-medium text-foreground">{history.diajukanOlehName || '-'}</TableCell>
                                                        <TableCell className="border-r">
                                                            <div className="text-sm font-medium">{history.hal}</div>
                                                            {history.keterangan && <div className="text-xs text-muted-foreground mt-1">{history.keterangan}</div>}
                                                        </TableCell>
                                                        <TableCell className="whitespace-nowrap">
                                                            <span className={`px-2 py-1 text-xs font-semibold rounded-md ${history.status === 'SELESAI' ? 'bg-emerald-100 text-emerald-700' :
                                                                history.status === 'DISETUJUI' ? 'bg-blue-100 text-foreground' :
                                                                    'bg-amber-100 text-amber-700'
                                                                }`}>
                                                                {history.status?.replace('_', ' ')}
                                                            </span>
                                                        </TableCell>
                                                    </TableRow>
                                                ))
                                            )}
                                        </TableBody>
                                    </Table>
                                </div>
                            </TabsContent>
                        </Tabs>
                    </div>
                </DialogContent>
            </Dialog>

            {isPeminjamanFormOpen && (
                <PeminjamanForm
                    isOpen={isPeminjamanFormOpen}
                    onClose={() => setIsPeminjamanFormOpen(false)}
                    preselectedBarang={barang}
                />
            )}

            {isPerawatanFormOpen && (
                <PerawatanForm
                    isOpen={isPerawatanFormOpen}
                    onClose={() => setIsPerawatanFormOpen(false)}
                    preselectedBarang={barang}
                />
            )}
        </>
    );
}
