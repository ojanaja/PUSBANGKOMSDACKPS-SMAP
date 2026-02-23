import { useState, useEffect } from "react";
import { useAuthStore } from "@/store/useAuthStore";
import { updateProfile } from "@/services/api/userApi";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { User, Shield, KeyRound } from "lucide-react";

export default function ProfilePage() {
    const { user, setAuth, token } = useAuthStore();

    const [formData, setFormData] = useState({
        name: "",
        username: "",
        email: "",
        nip: "",
        jabatan: "",
        bidang: "",
        password: "",
        role: "PEGAWAI" as any,
        isActive: true,
        permissions: [] as string[]
    });

    useEffect(() => {
        if (user) {
            setFormData({
                name: user.name || "",
                username: user.username || "",
                email: (user as any).email || "",
                nip: user.nip || "",
                jabatan: user.jabatan || "",
                bidang: user.bidang || "",
                password: "",
                role: user.role,
                isActive: true,
                permissions: user.permissions || []
            });
        }
    }, [user]);

    const mutation = useMutation({
        mutationFn: updateProfile,
        onSuccess: (data) => {
            toast.success("Profile berhasil diperbarui.");
            if (token) {
                setAuth({
                    ...user!,
                    name: data.namaLengkap,
                    nip: data.nip,
                    jabatan: data.jabatan,
                    bidang: data.bidang
                }, token);
            }
            setFormData(prev => ({ ...prev, password: "" }));
        },
        onError: (error: any) => {
            const msg = error.response?.data?.message || "Gagal memperbarui profile";
            toast.error(msg);
        }
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.name || !formData.email) {
            toast.error("Nama Lengkap dan Email wajib diisi.");
            return;
        }
        mutation.mutate({
            username: formData.username,
            email: formData.email,
            password: formData.password ? formData.password : undefined,
            role: formData.role,
            namaLengkap: formData.name,
            nip: formData.nip,
            jabatan: formData.jabatan,
            bidang: formData.bidang,
            isActive: true,
            permissions: formData.permissions
        });
    };

    return (
        <div className="max-w-3xl mx-auto space-y-6 w-full">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Akun Saya</h1>
                <p className="text-muted-foreground mt-1">Kelola informasi pribadi dan pengaturan keamanan Anda.</p>
            </div>

            <form onSubmit={handleSubmit}>
                <div className="grid gap-6">
                    {/* Data Pribadi */}
                    <Card>
                        <CardHeader className="border-b space-y-1 pb-4 bg-slate-50/50 dark:bg-slate-900/50">
                            <div className="flex items-center gap-2">
                                <User className="w-5 h-5 text-indigo-600" />
                                <CardTitle className="text-lg">Informasi Pribadi</CardTitle>
                            </div>
                            <CardDescription>
                                Informasi ini akan digunakan saat Anda mengisi formulir pengajuan.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="grid gap-6 pt-6">
                            <div className="grid md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label>Nama Lengkap <span className="text-red-500">*</span></Label>
                                    <Input name="name" value={formData.name} onChange={handleChange} required />
                                </div>
                                <div className="space-y-2">
                                    <Label>NIP / NIK</Label>
                                    <Input name="nip" value={formData.nip} onChange={handleChange} placeholder="Misal: 198001012005011002" />
                                </div>
                            </div>
                            <div className="grid md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label>Jabatan</Label>
                                    <Input name="jabatan" value={formData.jabatan} onChange={handleChange} placeholder="Staf / Sub Koordinator" />
                                </div>
                                <div className="space-y-2">
                                    <Label>Bidang / Unit Kerja</Label>
                                    <Input name="bidang" value={formData.bidang} onChange={handleChange} placeholder="Bina Marga" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Akun & Keamanan */}
                    <Card>
                        <CardHeader className="border-b space-y-1 pb-4 bg-slate-50/50 dark:bg-slate-900/50">
                            <div className="flex items-center gap-2">
                                <Shield className="w-5 h-5 text-emerald-600" />
                                <CardTitle className="text-lg">Akun & Kredensial</CardTitle>
                            </div>
                            <CardDescription>
                                Kelola email dan sandi untuk login.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="grid gap-6 pt-6">
                            <div className="grid md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label>Username</Label>
                                    <Input value={formData.username} disabled className="bg-slate-100 dark:bg-slate-800 text-slate-500 font-medium" />
                                    <p className="text-[10px] text-muted-foreground mt-1">Username tidak dapat diubah.</p>
                                </div>
                                <div className="space-y-2">
                                    <Label>Email <span className="text-red-500">*</span></Label>
                                    <Input type="email" name="email" value={formData.email} onChange={handleChange} required />
                                </div>
                            </div>
                            <div className="border-t pt-4 mt-2">
                                <div className="space-y-2 max-w-sm">
                                    <Label className="flex items-center gap-2"><KeyRound className="w-4 h-4" /> Ganti Kata Sandi</Label>
                                    <Input type="password" name="password" value={formData.password} onChange={handleChange} placeholder="Biarkan kosong jika tidak ingin mengubah" />
                                </div>
                            </div>
                        </CardContent>
                        <CardFooter className="pt-6 pb-6 border-t bg-slate-50 flex justify-end dark:bg-slate-900/50">
                            <Button type="submit" disabled={mutation.isPending} className="bg-indigo-600 hover:bg-indigo-700 min-w-[120px]">
                                {mutation.isPending ? "Menyimpan..." : "Simpan Perubahan"}
                            </Button>
                        </CardFooter>
                    </Card>
                </div>
            </form>
        </div>
    );
}
