import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import type { Perawatan } from "@/services/api/perawatanApi";

interface PerawatanDetailModalProps {
    isOpen: boolean;
    onClose: () => void;
    data: Perawatan | null;
}

export function PerawatanDetailModal({ isOpen, onClose, data }: PerawatanDetailModalProps) {
    if (!data) return null;

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto w-full">
                <DialogHeader>
                    <DialogTitle className="text-xl">Detail Perawatan Aset</DialogTitle>
                    <DialogDescription>
                        Informasi lengkap registrasi perawatan atau perbaikan aset.
                    </DialogDescription>
                </DialogHeader>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-4">
                    {/* Kolom Kiri: Info Utama & Pengaju */}
                    <div className="space-y-4">
                        <div className="bg-slate-50 dark:bg-slate-900 p-4 rounded-lg border">
                            <h3 className="font-semibold mb-3 text-sm text-muted-foreground uppercase tracking-wider">Informasi Registrasi</h3>
                            <div className="grid grid-cols-3 gap-2 text-sm">
                                <div className="text-muted-foreground">No. Tiket</div>
                                <div className="col-span-2 font-medium">{data.noRegister}</div>

                                <div className="text-muted-foreground">Status</div>
                                <div className="col-span-2">
                                    {data.status === 'PERAWATAN' ? (
                                        <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">Di Rawat</Badge>
                                    ) : (
                                        <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200">Selesai</Badge>
                                    )}
                                </div>

                                <div className="text-muted-foreground mt-2">Dibuat Pada</div>
                                <div className="col-span-2 mt-2">{new Date(data.createdAt).toLocaleDateString('id-ID')}</div>

                                <div className="text-muted-foreground mt-2">Tgl Service</div>
                                <div className="col-span-2 mt-2">{new Date(data.tglService).toLocaleDateString('id-ID')}</div>

                                <div className="text-muted-foreground">Target Selesai</div>
                                <div className="col-span-2">{data.tglSelesaiRencana ? new Date(data.tglSelesaiRencana).toLocaleDateString('id-ID') : '-'}</div>

                                <div className="text-muted-foreground">Selesai Aktual</div>
                                <div className="col-span-2">{data.tglSelesaiAktual ? new Date(data.tglSelesaiAktual).toLocaleDateString('id-ID') : '-'}</div>
                            </div>
                        </div>

                        <div className="bg-slate-50 dark:bg-slate-900 p-4 rounded-lg border">
                            <h3 className="font-semibold mb-3 text-sm text-muted-foreground uppercase tracking-wider">Subjek & Keterangan</h3>
                            <div className="grid grid-cols-3 gap-2 text-sm">
                                <div className="text-muted-foreground">Hal / Subjek</div>
                                <div className="col-span-2 font-medium">{data.hal}</div>

                                <div className="text-muted-foreground">Keterangan</div>
                                <div className="col-span-2">{data.keterangan || '-'}</div>
                            </div>
                        </div>
                    </div>

                    {/* Kolom Kanan: Pengaju & Teknisi */}
                    <div className="space-y-4">
                        <div className="bg-blue-50 dark:bg-slate-900 p-4 rounded-lg border border-blue-100 dark:border-slate-800">
                            <h3 className="font-semibold mb-3 text-sm text-foreground dark:text-foreground uppercase tracking-wider">Pihak Pelapor / Pengaju</h3>
                            <div className="grid grid-cols-3 gap-2 text-sm">
                                <div className="text-muted-foreground">Nama</div>
                                <div className="col-span-2 font-medium">{data.diajukanOlehName}</div>

                                <div className="text-muted-foreground">Bidang</div>
                                <div className="col-span-2">{data.diajukanOlehBidang || '-'}</div>

                                <div className="text-muted-foreground">Jabatan</div>
                                <div className="col-span-2">{data.diajukanOlehJabatan || '-'}</div>

                                <div className="text-muted-foreground">NIP</div>
                                <div className="col-span-2">{data.diajukanOlehNip || '-'}</div>
                            </div>
                        </div>

                        <div className="bg-slate-50 dark:bg-slate-900 p-4 rounded-lg border">
                            <h3 className="font-semibold mb-3 text-sm text-muted-foreground uppercase tracking-wider">Penanggung Jawab / Teknisi</h3>
                            <div className="grid grid-cols-3 gap-2 text-sm">
                                <div className="text-muted-foreground">Nama Teknisi</div>
                                <div className="col-span-2 font-medium">{data.penanggungJawabName || '-'}</div>

                                <div className="text-muted-foreground">NIP / ID</div>
                                <div className="col-span-2">{data.penanggungJawabNip || '-'}</div>

                                <div className="text-muted-foreground">Jabatan / Bag.</div>
                                <div className="col-span-2">{data.penanggungJawabJabatan || '-'}</div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="mt-4">
                    <h3 className="font-semibold mb-3">Daftar Barang Diservis</h3>
                    <div className="rounded-md border">
                        <Table>
                            <TableHeader className="bg-slate-50 dark:bg-slate-900">
                                <TableRow>
                                    <TableHead className="w-12">No.</TableHead>
                                    <TableHead>Barang</TableHead>
                                    <TableHead>Kode / NUP</TableHead>
                                    <TableHead>Gejala / Keluhan</TableHead>
                                    <TableHead>Tindakan Perbaikan</TableHead>
                                    <TableHead>Garansi Sampai</TableHead>
                                    <TableHead>Kondisi</TableHead>
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
                                        <TableCell className="text-sm max-w-[200px]">{detail.gejala || '-'}</TableCell>
                                        <TableCell className="text-sm max-w-[200px]">{detail.perbaikan || '-'}</TableCell>
                                        <TableCell className="text-sm">{detail.garansi ? new Date(detail.garansi).toLocaleDateString('id-ID') : '-'}</TableCell>
                                        <TableCell>
                                            <Badge variant="secondary" className="font-normal text-xs">{detail.kondisiKembali || 'Diproses'}</Badge>
                                        </TableCell>
                                    </TableRow>
                                ))}
                                {(!data.detailBarang || data.detailBarang.length === 0) && (
                                    <TableRow>
                                        <TableCell colSpan={7} className="text-center h-16 text-muted-foreground">Belum ada rincian barang</TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
