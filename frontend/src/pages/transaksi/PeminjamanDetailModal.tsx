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
import type { Peminjaman } from "@/services/api/peminjamanApi";

interface PeminjamanDetailModalProps {
    isOpen: boolean;
    onClose: () => void;
    data: Peminjaman | null;
}

export function PeminjamanDetailModal({ isOpen, onClose, data }: PeminjamanDetailModalProps) {
    if (!data) return null;

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="text-xl">Detail Peminjaman Barang</DialogTitle>
                    <DialogDescription>
                        Informasi lengkap registrasi peminjaman aset.
                    </DialogDescription>
                </DialogHeader>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-4">
                    {/* Kolom Kiri: Info Utama & Peminjam */}
                    <div className="space-y-4">
                        <div className="bg-slate-50 dark:bg-slate-900 p-4 rounded-lg border">
                            <h3 className="font-semibold mb-3 text-sm text-muted-foreground uppercase tracking-wider">Informasi Registrasi</h3>
                            <div className="grid grid-cols-3 gap-2 text-sm">
                                <div className="text-muted-foreground">No. Register</div>
                                <div className="col-span-2 font-medium">{data.noRegister}</div>

                                <div className="text-muted-foreground">Tanggal</div>
                                <div className="col-span-2">{new Date(data.createdAt).toLocaleDateString('id-ID')}</div>

                                <div className="text-muted-foreground">Status</div>
                                <div className="col-span-2">
                                    {data.status === 'DIPINJAM' ? (
                                        <Badge variant="outline" className="bg-orange-50 text-orange-700 border-orange-200">Di Pinjam</Badge>
                                    ) : (
                                        <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200">Selesai</Badge>
                                    )}
                                </div>

                                <div className="text-muted-foreground mt-2">Tgl Pinjam</div>
                                <div className="col-span-2 mt-2">{new Date(data.tglPinjam).toLocaleDateString('id-ID')}</div>

                                <div className="text-muted-foreground">Tgl Kembali</div>
                                <div className="col-span-2">{data.tglKembaliRencana ? new Date(data.tglKembaliRencana).toLocaleDateString('id-ID') : '-'}</div>
                            </div>
                        </div>

                        <div className="bg-slate-50 dark:bg-slate-900 p-4 rounded-lg border">
                            <h3 className="font-semibold mb-3 text-sm text-muted-foreground uppercase tracking-wider">Tujuan & Keterangan</h3>
                            <div className="grid grid-cols-3 gap-2 text-sm">
                                <div className="text-muted-foreground">Keperluan</div>
                                <div className="col-span-2 font-medium">{data.keperluan}</div>

                                <div className="text-muted-foreground">Keterangan</div>
                                <div className="col-span-2">{data.keterangan || '-'}</div>
                            </div>
                        </div>
                    </div>

                    {/* Kolom Kanan: Peminjam & Penanggung Jawab */}
                    <div className="space-y-4">
                        <div className="bg-blue-50 dark:bg-slate-900 p-4 rounded-lg border border-blue-100 dark:border-slate-800">
                            <h3 className="font-semibold mb-3 text-sm text-foreground dark:text-foreground uppercase tracking-wider">Data Peminjam</h3>
                            <div className="grid grid-cols-3 gap-2 text-sm">
                                <div className="text-muted-foreground">Nama</div>
                                <div className="col-span-2 font-medium">{data.peminjamName}</div>

                                <div className="text-muted-foreground">Bidang</div>
                                <div className="col-span-2">{data.peminjamBidang || '-'}</div>

                                <div className="text-muted-foreground">Jabatan</div>
                                <div className="col-span-2">{data.peminjamJabatan || '-'}</div>

                                <div className="text-muted-foreground">NIP</div>
                                <div className="col-span-2">{data.peminjamNip || '-'}</div>
                            </div>
                        </div>

                        <div className="bg-slate-50 dark:bg-slate-900 p-4 rounded-lg border">
                            <h3 className="font-semibold mb-3 text-sm text-muted-foreground uppercase tracking-wider">Penanggung Jawab (PJ)</h3>
                            <div className="grid grid-cols-3 gap-2 text-sm">
                                <div className="text-muted-foreground">Nama PJ</div>
                                <div className="col-span-2 font-medium">{data.penanggungJawabName || '-'}</div>

                                <div className="text-muted-foreground">NIP PJ</div>
                                <div className="col-span-2">{data.penanggungJawabNip || '-'}</div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="mt-4">
                    <h3 className="font-semibold mb-3">Daftar Barang Dipinjam</h3>
                    <div className="rounded-md border">
                        <Table>
                            <TableHeader className="bg-slate-50 dark:bg-slate-900">
                                <TableRow>
                                    <TableHead className="w-12">No.</TableHead>
                                    <TableHead>Barang</TableHead>
                                    <TableHead>Kode / NUP</TableHead>
                                    <TableHead>Keterangan</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead className="text-right">Total/Jumlah</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {data.detailBarang?.map((detail, index) => (
                                    <TableRow key={detail.id}>
                                        <TableCell>{index + 1}</TableCell>
                                        <TableCell className="font-medium">{detail.namaBarang}</TableCell>
                                        <TableCell>
                                            <div className="flex flex-col">
                                                <span>{detail.kodeBarang}</span>
                                                <span className="text-xs text-muted-foreground">{detail.nup || '-'}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell>{detail.keterangan || '-'}</TableCell>
                                        <TableCell>
                                            <Badge variant="secondary" className="font-normal text-xs">{detail.kondisiPinjam}</Badge>
                                        </TableCell>
                                        <TableCell className="text-right">1</TableCell>
                                    </TableRow>
                                ))}
                                {(!data.detailBarang || data.detailBarang.length === 0) && (
                                    <TableRow>
                                        <TableCell colSpan={6} className="text-center h-16 text-muted-foreground">Belum ada rincian barang</TableCell>
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
