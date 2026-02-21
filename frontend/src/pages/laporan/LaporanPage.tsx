import { useState } from "react";
import { Download, FileText } from "lucide-react";
import { toast } from "sonner";
import { downloadLaporanBarangCsv } from "@/services/api/laporanApi";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function LaporanPage() {
    const [isDownloading, setIsDownloading] = useState(false);

    const handleDownloadBarang = async () => {
        try {
            setIsDownloading(true);
            toast.info("Sedang menyiapkan dokumen CSV Anda...");
            await downloadLaporanBarangCsv();
            toast.success("Laporan berhasil diunduh.");
        } catch (error) {
            toast.error("Gagal mengunduh laporan. Silakan coba lagi.");
        } finally {
            setIsDownloading(false);
        }
    };

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Laporan & Rekapitulasi</h1>
                <p className="text-muted-foreground mt-1">Unduh data master dan riwayat transaksi untuk analisis lebih lanjut.</p>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                <Card className="flex flex-col h-full shadow-sm hover:shadow-md transition-shadow">
                    <CardHeader>
                        <div className="flex items-center gap-2 mb-2 text-foreground">
                            <FileText className="h-5 w-5" />
                        </div>
                        <CardTitle>Master Data Barang</CardTitle>
                        <CardDescription>
                            Ekspor seluruh daftar inventaris sarana dan prasarana beserta status dan kondisinya dalam format CSV.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="mt-auto">
                        <Button
                            className="w-full"
                            onClick={handleDownloadBarang}
                            disabled={isDownloading}
                        >
                            <Download className="mr-2 h-4 w-4" />
                            {isDownloading ? "Menyiapkan..." : "Unduh CSV"}
                        </Button>
                    </CardContent>
                </Card>

                {/* Placeholders for upcoming report features */}
                <Card className="flex flex-col h-full shadow-sm opacity-60">
                    <CardHeader>
                        <div className="flex items-center gap-2 mb-2 text-orange-600">
                            <FileText className="h-5 w-5" />
                        </div>
                        <CardTitle>Riwayat Transaksi Peminjaman</CardTitle>
                        <CardDescription>
                            Rekapitulasi sirkulasi barang yang dipinjam beserta penanggung jawabnya. (Segera Hadir)
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="mt-auto">
                        <Button className="w-full" variant="outline" disabled>
                            Tersedia Segera
                        </Button>
                    </CardContent>
                </Card>

                <Card className="flex flex-col h-full shadow-sm opacity-60">
                    <CardHeader>
                        <div className="flex items-center gap-2 mb-2 text-emerald-600">
                            <FileText className="h-5 w-5" />
                        </div>
                        <CardTitle>Riwayat Perawatan & Service</CardTitle>
                        <CardDescription>
                            Data tiket kerusakan dan riwayat pemeliharaan berkala infrastruktur. (Segera Hadir)
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="mt-auto">
                        <Button className="w-full" variant="outline" disabled>
                            Tersedia Segera
                        </Button>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
