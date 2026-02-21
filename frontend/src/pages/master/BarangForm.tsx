import { useEffect, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { createBarang, updateBarang } from "@/services/api/barangApi";
import type { Barang, BarangRequest } from "@/services/api/barangApi";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { useDropzone } from "react-dropzone";
import imageCompression from "browser-image-compression";
import { uploadFile } from "@/services/api/fileApi";
import { MapContainer, TileLayer, Marker, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { UploadCloud, Loader2, MapPin, X } from "lucide-react";
import L from "leaflet";

delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

function ChangeView({ center }: { center: [number, number] }) {
    const map = useMap();
    map.setView(center, map.getZoom());
    return null;
}

interface BarangFormProps {
    isOpen: boolean;
    onClose: () => void;
    initialData?: Barang;
}

export function BarangForm({ isOpen, onClose, initialData }: BarangFormProps) {
    const queryClient = useQueryClient();
    const isEditing = !!initialData;
    const [isUploading, setIsUploading] = useState(false);
    const [isLocating, setIsLocating] = useState(false);
    const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

    const [formData, setFormData] = useState<BarangRequest>({
        kodeBarang: "",
        nup: "",
        namaBarang: "",
        merkType: "",
        ukuran: "",
        jenisBarang: "",
        gudang: "",
        lokasi: "",
        koordinatPeta: "",
        buktiKepemilikan: "",
        kondisi: "BAIK",
        status: "TERSEDIA",
        tglPerolehan: "",
        photoUrl: "",
        barcodeProduk: "",
        barcodeSn: "",
        keterangan: "",
        tglSurat: "",
        nopol: "",
        pemakai: "",
    });

    useEffect(() => {
        setSelectedFiles([]);
        if (initialData && isOpen) {
            setFormData({
                kodeBarang: initialData.kodeBarang || "",
                nup: initialData.nup || "",
                namaBarang: initialData.namaBarang || "",
                merkType: initialData.merkType || "",
                ukuran: initialData.ukuran || "",
                jenisBarang: initialData.jenisBarang || "",
                gudang: initialData.gudang || "",
                lokasi: initialData.lokasi || "",
                koordinatPeta: initialData.koordinatPeta || "",
                buktiKepemilikan: initialData.buktiKepemilikan || "",
                kondisi: initialData.kondisi || "BAIK",
                status: initialData.status || "TERSEDIA",
                tglPerolehan: initialData.tglPerolehan || "",
                photoUrl: initialData.photoUrl || "",
                barcodeProduk: initialData.barcodeProduk || "",
                barcodeSn: initialData.barcodeSn || "",
                keterangan: initialData.keterangan || "",
                tglSurat: initialData.tglSurat || "",
                nopol: initialData.nopol || "",
                pemakai: initialData.pemakai || "",
            });
        } else if (isOpen) {
            setFormData({
                kodeBarang: "",
                nup: "",
                namaBarang: "",
                merkType: "",
                ukuran: "",
                jenisBarang: "",
                gudang: "",
                lokasi: "",
                koordinatPeta: "",
                buktiKepemilikan: "",
                kondisi: "BAIK",
                status: "TERSEDIA",
                tglPerolehan: "",
                photoUrl: "",
                barcodeProduk: "",
                barcodeSn: "",
                keterangan: "",
                tglSurat: "",
                nopol: "",
                pemakai: "",
            });
        }
    }, [initialData, isOpen]);

    const mutation = useMutation({
        mutationFn: (data: BarangRequest) => {
            return isEditing ? updateBarang(initialData.id, data) : createBarang(data);
        },
        onSuccess: async () => {
            toast.success(`Data barang berhasil ${isEditing ? "diperbarui" : "disimpan"}`);
            await queryClient.invalidateQueries({ queryKey: ["barang-list"] });
            await queryClient.invalidateQueries({ queryKey: ["barang-informasi-list"] });
            await queryClient.invalidateQueries({ queryKey: ["dashboard-summary"] });
            onClose();
        },
        onError: (error: any) => {
            toast.error(error?.response?.data?.message || "Terjadi kesalahan sistem");
        },
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        let finalData = { ...formData };

        if (selectedFiles.length > 0) {
            try {
                setIsUploading(true);

                const compressionOptions = {
                    maxSizeMB: 1,
                    maxWidthOrHeight: 1920,
                    useWebWorker: true,
                    fileType: 'image/webp' as string
                };

                const compressedFiles = await Promise.all(selectedFiles.map(async (file) => {
                    const compressedBlob = await imageCompression(file, compressionOptions);
                    const newName = file.name.replace(/\.[^/.]+$/, "") + ".webp";
                    return new File([compressedBlob], newName, { type: "image/webp" });
                }));

                const uploadedUrls = await Promise.all(compressedFiles.map(file => uploadFile(file)));
                const currentUrls = finalData.photoUrl ? finalData.photoUrl.split(',').map(u => u.trim()).filter(Boolean) : [];
                finalData.photoUrl = [...currentUrls, ...uploadedUrls].join(',');
            } catch (error) {
                toast.error("Gagal mengunggah dan mengompres foto. Silakan coba lagi.");
                setIsUploading(false);
                return;
            } finally {
                setIsUploading(false);
            }
        }

        mutation.mutate(finalData);
    };

    const handleSelectChange = (field: keyof BarangRequest, value: string) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
    };

    const onDrop = (acceptedFiles: File[]) => {
        if (!acceptedFiles?.length) return;

        setSelectedFiles(prev => {
            const newTotal = prev.length + acceptedFiles.length;
            if (newTotal > 5) {
                toast.error("Maksimal 5 foto tambahan yang dapat dipilih");
                return [...prev, ...acceptedFiles.slice(0, 5 - prev.length)];
            }
            return [...prev, ...acceptedFiles];
        });
    };

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: { 'image/*': [] },
        maxFiles: 5,
        disabled: isUploading
    });

    const removeSelectedFile = (index: number, e: React.MouseEvent) => {
        e.stopPropagation();
        setSelectedFiles(prev => prev.filter((_, i) => i !== index));
    };

    const removeExistingFile = (index: number, e: React.MouseEvent) => {
        e.stopPropagation();
        const urls = (formData.photoUrl || '').split(',').filter(Boolean);
        urls.splice(index, 1);
        setFormData({ ...formData, photoUrl: urls.join(',') });
    };

    const handleGetLocation = () => {
        if (!navigator.geolocation) {
            toast.error("Geolocation tidak didukung oleh browser ini");
            return;
        }

        setIsLocating(true);
        navigator.geolocation.getCurrentPosition(
            (position) => {
                setFormData(prev => ({
                    ...prev,
                    koordinatPeta: `${position.coords.latitude}, ${position.coords.longitude}`
                }));
                setIsLocating(false);
                toast.success("Lokasi berhasil didapatkan");
            },
            (_error) => {
                setIsLocating(false);
                toast.error("Gagal mendapatkan lokasi. Pastikan izin lokasi diberikan.");
            },
            { enableHighAccuracy: true }
        );
    };

    const parsedCoords = (): [number, number] | null => {
        if (!formData.koordinatPeta) return null;
        const parts = formData.koordinatPeta.split(',');
        if (parts.length === 2) {
            const lat = parseFloat(parts[0].trim());
            const lng = parseFloat(parts[1].trim());
            if (!isNaN(lat) && !isNaN(lng)) return [lat, lng];
        }
        return null;
    };
    const coords = parsedCoords();

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="sm:max-w-4xl max-h-[90vh] flex flex-col p-0 overflow-hidden">
                <form onSubmit={handleSubmit} className="flex flex-col h-full overflow-hidden">
                    <DialogHeader className="px-6 py-4 border-b shrink-0">
                        <DialogTitle className="text-xl">{isEditing ? "Ubah Data Barang" : "Tambah Formulir Registrasi Barang"}</DialogTitle>
                        <DialogDescription>
                            Lengkapi rincian formulir data inventaris / aset negara di bawah ini. Text box bertanda bintang (*) wajib diisi.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="flex-1 overflow-y-auto p-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">

                            {/* Kiri */}
                            <div className="space-y-4">
                                <div className="space-y-1.5">
                                    <Label htmlFor="kodeBarang" className="text-xs font-medium text-muted-foreground uppercase">Kode Barang <span className="text-red-500">*</span></Label>
                                    <Input id="kodeBarang" required value={formData.kodeBarang} onChange={(e) => setFormData({ ...formData, kodeBarang: e.target.value })} />
                                </div>

                                <div className="space-y-1.5">
                                    <Label htmlFor="nup" className="text-xs font-medium text-muted-foreground uppercase">NUP</Label>
                                    <Input id="nup" value={formData.nup} onChange={(e) => setFormData({ ...formData, nup: e.target.value })} />
                                </div>

                                <div className="space-y-1.5">
                                    <Label htmlFor="namaBarang" className="text-xs font-medium text-muted-foreground uppercase">Nama Barang <span className="text-red-500">*</span></Label>
                                    <Input id="namaBarang" required value={formData.namaBarang} onChange={(e) => setFormData({ ...formData, namaBarang: e.target.value })} />
                                </div>

                                <div className="space-y-1.5">
                                    <Label htmlFor="tglPerolehan" className="text-xs font-medium text-muted-foreground uppercase">Tgl Perolehan</Label>
                                    <Input id="tglPerolehan" type="date" value={formData.tglPerolehan} onChange={(e) => setFormData({ ...formData, tglPerolehan: e.target.value })} />
                                </div>

                                <div className="space-y-1.5">
                                    <Label htmlFor="merkType" className="text-xs font-medium text-muted-foreground uppercase">Merk / Type</Label>
                                    <Input id="merkType" value={formData.merkType} onChange={(e) => setFormData({ ...formData, merkType: e.target.value })} />
                                </div>

                                <div className="space-y-1.5">
                                    <Label htmlFor="ukuran" className="text-xs font-medium text-muted-foreground uppercase">Ukuran</Label>
                                    <Input id="ukuran" value={formData.ukuran} onChange={(e) => setFormData({ ...formData, ukuran: e.target.value })} />
                                </div>

                                <div className="space-y-1.5">
                                    <Label htmlFor="jenisBarang" className="text-xs font-medium text-muted-foreground uppercase">Jenis Barang</Label>
                                    <Select value={formData.jenisBarang} onValueChange={(val) => handleSelectChange('jenisBarang', val)}>
                                        <SelectTrigger><SelectValue placeholder="Pilih Jenis Barang" /></SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="MULTIMEDIA">MULTIMEDIA</SelectItem>
                                            <SelectItem value="KENDARAAN">KENDARAAN</SelectItem>
                                            <SelectItem value="KOMPUTER">KOMPUTER</SelectItem>
                                            <SelectItem value="LAINNYA">LAINNYA</SelectItem>
                                            <SelectItem value="ALAT KANTOR & RUMAH TANGGA">ALAT KANTOR & RUMAH TANGGA</SelectItem>
                                            <SelectItem value="ALAT BESAR">ALAT BESAR</SelectItem>
                                            <SelectItem value="ALAT STUDIO KOMUNIKASI & PEMANCAR">ALAT STUDIO KOMUNIKASI & PEMANCAR</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="space-y-1.5">
                                    <Label htmlFor="nopol" className="text-xs font-medium text-muted-foreground uppercase">Kendaraan</Label>
                                    <Input id="nopol" placeholder="Nomor Polisi" value={formData.nopol} onChange={(e) => setFormData({ ...formData, nopol: e.target.value })} />
                                </div>

                                <div className="space-y-1.5">
                                    <Label htmlFor="buktiKepemilikan" className="text-xs font-medium text-muted-foreground uppercase">Bukti Kepemilikan</Label>
                                    <Input id="buktiKepemilikan" value={formData.buktiKepemilikan} onChange={(e) => setFormData({ ...formData, buktiKepemilikan: e.target.value })} />
                                </div>
                            </div>

                            {/* Kanan */}
                            <div className="space-y-4">
                                <div className="space-y-1.5">
                                    <Label htmlFor="kondisi" className="text-xs font-medium text-muted-foreground uppercase">Kondisi</Label>
                                    <Select value={formData.kondisi} onValueChange={(val) => handleSelectChange('kondisi', val)}>
                                        <SelectTrigger><SelectValue placeholder="Pilih Kondisi" /></SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="BAIK">Kondisi Baik</SelectItem>
                                            <SelectItem value="RUSAK_RINGAN">Rusak Ringan</SelectItem>
                                            <SelectItem value="RUSAK_BERAT">Rusak Berat</SelectItem>
                                            <SelectItem value="HILANG">Hilang</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="space-y-1.5">
                                    <Label htmlFor="gudang" className="text-xs font-medium text-muted-foreground uppercase">Gudang</Label>
                                    <Select value={formData.gudang} onValueChange={(val) => handleSelectChange('gudang', val)}>
                                        <SelectTrigger><SelectValue placeholder="Pilih Gudang" /></SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="UTAMA">UTAMA</SelectItem>
                                            <SelectItem value="EX BALAI">EX BALAI</SelectItem>
                                            <SelectItem value="GEODESI">GEODESI</SelectItem>
                                            <SelectItem value="AULA">AULA</SelectItem>
                                            <SelectItem value="ITCI">ITCI</SelectItem>
                                            <SelectItem value="ASRAMA BARU">ASRAMA BARU</SelectItem>
                                            <SelectItem value="ASRAMA C">ASRAMA C</SelectItem>
                                            <SelectItem value="ASRAMA D">ASRAMA D</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="space-y-1.5">
                                    <Label htmlFor="lokasi" className="text-xs font-medium text-muted-foreground uppercase">Lokasi</Label>
                                    <Input id="lokasi" value={formData.lokasi} onChange={(e) => setFormData({ ...formData, lokasi: e.target.value })} />
                                </div>

                                <div className="space-y-1.5">
                                    <Label htmlFor="koordinatPeta" className="text-xs font-medium text-muted-foreground uppercase">Koordinat</Label>
                                    <div className="flex gap-2">
                                        <Input id="koordinatPeta" placeholder="-6.2088, 106.8456" value={formData.koordinatPeta} onChange={(e) => setFormData({ ...formData, koordinatPeta: e.target.value })} />
                                        <Button
                                            type="button"
                                            variant="secondary"
                                            size="icon"
                                            className="shrink-0"
                                            onClick={handleGetLocation}
                                            disabled={isLocating}
                                            title="Gunakan Lokasi Saat Ini"
                                        >
                                            {isLocating ? <Loader2 className="h-4 w-4 animate-spin" /> : <MapPin className="h-4 w-4" />}
                                        </Button>
                                    </div>
                                    {coords && (
                                        <div className="h-32 w-full mt-2 rounded-md overflow-hidden border border-slate-200 dark:border-slate-800 z-0">
                                            <MapContainer center={coords} zoom={15} style={{ height: '100%', width: '100%', zIndex: 0 }}>
                                                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                                                <Marker position={coords} />
                                                <ChangeView center={coords} />
                                            </MapContainer>
                                        </div>
                                    )}
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-1.5">
                                        <Label htmlFor="barcodeProduk" className="text-xs font-medium text-muted-foreground uppercase">Barcode Produk</Label>
                                        <Input id="barcodeProduk" value={formData.barcodeProduk} onChange={(e) => setFormData({ ...formData, barcodeProduk: e.target.value })} />
                                    </div>
                                    <div className="space-y-1.5">
                                        <Label htmlFor="barcodeSn" className="text-xs font-medium text-muted-foreground uppercase">Barcode SN</Label>
                                        <Input id="barcodeSn" value={formData.barcodeSn} onChange={(e) => setFormData({ ...formData, barcodeSn: e.target.value })} />
                                    </div>
                                </div>

                                <div className="space-y-1.5">
                                    <Label className="text-xs font-medium text-muted-foreground uppercase">Photo Produk</Label>
                                    {/* Existing Photo Previews */}
                                    {formData.photoUrl && formData.photoUrl.split(',').filter(Boolean).length > 0 && (
                                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 mb-2">
                                            {formData.photoUrl.split(',').filter(Boolean).map((url, i) => (
                                                <div key={`existing-${i}`} className="relative group border border-slate-200 dark:border-slate-800 rounded-md overflow-hidden aspect-square flex items-center justify-center bg-slate-50 dark:bg-slate-900">
                                                    <img
                                                        src={url.startsWith('http') ? url : `http://localhost:8080/api${url.replace('/uploads/', '/files/')}`}
                                                        alt="Existing Preview"
                                                        className="w-full h-full object-cover"
                                                    />
                                                    <button type="button" onClick={(e) => removeExistingFile(i, e)} className="absolute top-1 right-1 bg-black/60 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                        <X size={14} />
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    )}

                                    {/* Selected New File Previews */}
                                    {selectedFiles.length > 0 && (
                                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 mb-2">
                                            {selectedFiles.map((file, i) => (
                                                <div key={`new-${i}`} className="relative group border border-slate-200 dark:border-slate-800 rounded-md overflow-hidden aspect-square flex items-center justify-center bg-slate-50 dark:bg-slate-900">
                                                    <img
                                                        src={URL.createObjectURL(file)}
                                                        alt="New Preview"
                                                        className="w-full h-full object-cover"
                                                    />
                                                    <button type="button" onClick={(e) => removeSelectedFile(i, e)} className="absolute top-1 right-1 bg-black/60 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                        <X size={14} />
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    )}

                                    <div
                                        {...getRootProps()}
                                        className={`border-2 border-dashed rounded-lg p-4 text-center cursor-pointer transition-colors ${isDragActive ? 'border-primary bg-primary/5' : 'border-slate-300 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800/50'
                                            }`}
                                    >
                                        <input {...getInputProps()} />
                                        {isUploading ? (
                                            <div className="flex flex-col items-center gap-2 py-4">
                                                <Loader2 className="h-8 w-8 text-primary animate-spin" />
                                                <p className="text-sm text-muted-foreground">Mengunggah {selectedFiles.length} foto...</p>
                                            </div>
                                        ) : (
                                            <div className="flex flex-col items-center gap-2 py-2">
                                                <UploadCloud className="h-8 w-8 text-slate-400" />
                                                <p className="text-sm font-medium">Drag & drop foto tambahan di sini</p>
                                                <p className="text-xs text-muted-foreground">Maksimal 5 file, klik atau seret ke area ini</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Bottom Full Width */}
                            <div className="col-span-1 md:col-span-2 space-y-1.5 border-t pt-4 mt-2">
                                <Label htmlFor="keterangan" className="text-xs font-medium text-muted-foreground uppercase">KETERANGAN</Label>
                                <Textarea
                                    id="keterangan"
                                    className="min-h-[100px]"
                                    placeholder="Tuliskan spesifikasi lengkap, catatan cacat bawaan, atau informasi teknis spesifik..."
                                    value={formData.keterangan}
                                    onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setFormData({ ...formData, keterangan: e.target.value })}
                                />
                            </div>

                        </div>
                    </div>

                    <DialogFooter className="px-6 py-4 border-t bg-slate-50 dark:bg-slate-900/50 mt-auto shrink-0">
                        <Button type="button" variant="outline" onClick={onClose} disabled={mutation.isPending}>Tutup Formulir</Button>
                        <Button type="submit" disabled={mutation.isPending}>
                            {mutation.isPending ? "Mensinkronisasi Data..." : `${isEditing ? 'Simpan Pembaruan' : 'Registrasikan Aset'}`}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
