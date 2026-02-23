import { useState, useEffect } from "react";
import type { User, UserRequest } from "@/services/api/userApi";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ScrollArea } from "@/components/ui/scroll-area";

const AVAILABLE_PERMISSIONS = [
    { menu: 'TRANSAKSI', subMenu: 'Pengajuan Pinjaman' },
    { menu: 'TRANSAKSI', subMenu: 'Pengembalian Pinjaman' },
    { menu: 'TRANSAKSI', subMenu: 'Pengajuan Perawatan' },
    { menu: 'TRANSAKSI', subMenu: 'Kembali Service' },
    { menu: 'LAPORAN', subMenu: 'Peminjaman' },
    { menu: 'LAPORAN', subMenu: 'Perawatan' },
    { menu: 'LAPORAN', subMenu: 'Jatuh Tempo' },
    { menu: 'LAPORAN', subMenu: 'Daftar Barang' },
    { menu: 'INFORMASI', subMenu: 'Barang' },
    { menu: 'SYSTEM', subMenu: 'User' },
    { menu: 'SYSTEM', subMenu: 'Role' },
];

interface UserFormDialogProps {
    isOpen: boolean;
    onClose: () => void;
    user: User | null;
    onSubmit: (data: UserRequest) => void;
    isLoading: boolean;
}

export function UserFormDialog({ isOpen, onClose, user, onSubmit, isLoading }: UserFormDialogProps) {
    const isEdit = !!user;

    const [formData, setFormData] = useState<UserRequest>({
        username: "",
        email: "",
        password: "",
        role: "PEGAWAI",
        name: "",
        nip: "",
        jabatan: "",
        bidang: "",
        active: true,
        permissions: []
    });

    useEffect(() => {
        if (isOpen) {
            if (user) {
                setFormData({
                    username: user.username,
                    email: user.email,
                    password: "",
                    role: user.role,
                    name: user.name,
                    nip: user.nip || "",
                    jabatan: user.jabatan || "",
                    bidang: user.bidang || "",
                    active: user.active,
                    permissions: user.permissions || []
                });
            } else {
                setFormData({
                    username: "",
                    email: "",
                    password: "",
                    role: "PEGAWAI",
                    name: "",
                    nip: "",
                    jabatan: "",
                    bidang: "",
                    active: true,
                    permissions: []
                });
            }
        }
    }, [isOpen, user]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSelectChange = (name: string, value: string) => {
        setFormData({ ...formData, [name]: value });
    };

    const handlePermissionToggle = (menu: string, subMenu: string) => {
        const key = `${menu}:${subMenu}`;
        setFormData((prev) => {
            const perms = prev.permissions || [];
            if (perms.includes(key)) {
                return { ...prev, permissions: perms.filter(p => p !== key) };
            } else {
                return { ...prev, permissions: [...perms, key] };
            }
        });
    };

    const handleToggleAll = (checked: boolean) => {
        if (checked) {
            setFormData(prev => ({ ...prev, permissions: AVAILABLE_PERMISSIONS.map(p => `${p.menu}:${p.subMenu}`) }));
        } else {
            setFormData(prev => ({ ...prev, permissions: [] }));
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const payload = { ...formData };
        if (isEdit && !payload.password) {
            delete payload.password;
        }
        onSubmit(payload);
    };

    const allChecked = formData.permissions?.length === AVAILABLE_PERMISSIONS.length && AVAILABLE_PERMISSIONS.length > 0;

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="max-w-[95vw] lg:max-w-5xl xl:max-w-6xl h-[90vh] flex flex-col p-0 gap-0 overflow-hidden">
                <DialogHeader className="px-6 py-4 border-b shrink-0 bg-slate-50 dark:bg-slate-900/50">
                    <DialogTitle className="text-xl">{isEdit ? "Edit Pengguna" : "Tambah Pengguna Baru"}</DialogTitle>
                    <DialogDescription>
                        Lengkapi profil pengguna dan tentukan hak akses spesifik ke dalam sistem.
                    </DialogDescription>
                </DialogHeader>

                <div className="flex-1 overflow-hidden">
                    <form id="user-form" onSubmit={handleSubmit} className="h-full flex flex-col md:flex-row divide-y md:divide-y-0 md:divide-x dark:divide-slate-800">
                        {/* LEFT COLUMN - Profile Data */}
                        <ScrollArea className="flex-1 p-6 h-full md:w-1/2 lg:w-[40%]">
                            <div className="space-y-4 pr-4">
                                <div className="space-y-2">
                                    <Label>Nama Lengkap <span className="text-red-500">*</span></Label>
                                    <Input name="name" value={formData.name} onChange={handleChange} placeholder="Nama Lengkap" required />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label>Username <span className="text-red-500">*</span></Label>
                                        <Input name="username" value={formData.username} onChange={handleChange} placeholder="username_unik" required disabled={isEdit} />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Email <span className="text-red-500">*</span></Label>
                                        <Input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="email@domain.com" required />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label>Password {isEdit ? "(Opsional)" : <span className="text-red-500">*</span>}</Label>
                                    <Input type="password" name="password" value={formData.password} onChange={handleChange} placeholder={isEdit ? "Kosongkan jika tidak diubah" : "Minimal 6 karakter"} required={!isEdit} minLength={6} />
                                </div>

                                <div className="border-t my-4 pt-4 space-y-4">
                                    <h4 className="font-semibold text-sm text-muted-foreground">Detail Pekerjaan</h4>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label>NIP / NIK</Label>
                                            <Input name="nip" value={formData.nip || ""} onChange={handleChange} placeholder="Nomor Induk Pegawai" />
                                        </div>
                                        <div className="space-y-2">
                                            <Label>Jabatan</Label>
                                            <Input name="jabatan" value={formData.jabatan || ""} onChange={handleChange} placeholder="Jabatan" />
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label>Bidang / Unit</Label>
                                            <Input name="bidang" value={formData.bidang || ""} onChange={handleChange} placeholder="Unit Kerja" />
                                        </div>
                                        <div className="space-y-2">
                                            <Label>Base Role <span className="text-red-500">*</span></Label>
                                            <Select value={formData.role} onValueChange={(val) => handleSelectChange("role", val)}>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Pilih Role Dasar" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="ADMIN">ADMIN</SelectItem>
                                                    <SelectItem value="PEGAWAI">PEGAWAI</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </ScrollArea>

                        {/* RIGHT COLUMN - Permissions Table */}
                        <div className="flex-1 flex flex-col h-full bg-slate-50/50 dark:bg-slate-900/20 md:w-1/2 lg:w-[60%]">
                            <div className="p-4 border-b bg-white dark:bg-slate-950 flex items-center justify-between shrink-0">
                                <div>
                                    <h3 className="font-semibold text-sm">Hak Akses Menu</h3>
                                    <p className="text-xs text-muted-foreground">Tentukan menu apa saja yang dapat diakses pengguna ini.</p>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <Checkbox
                                        id="selectAll"
                                        checked={allChecked}
                                        onCheckedChange={(checked) => handleToggleAll(checked as boolean)}
                                    />
                                    <Label htmlFor="selectAll" className="text-sm font-medium cursor-pointer">Pilih Semua</Label>
                                </div>
                            </div>
                            <ScrollArea className="flex-1 p-0">
                                <Table>
                                    <TableHeader className="bg-slate-100 dark:bg-slate-800 sticky top-0 z-10">
                                        <TableRow>
                                            <TableHead className="w-[50px] text-center">No</TableHead>
                                            <TableHead>Menu Utama</TableHead>
                                            <TableHead>Sub Menu / Akses</TableHead>
                                            <TableHead className="text-center w-[100px]">Beri Akses</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {AVAILABLE_PERMISSIONS.map((perm, index) => {
                                            const key = `${perm.menu}:${perm.subMenu}`;
                                            const isChecked = formData.permissions?.includes(key);

                                            return (
                                                <TableRow key={key} className={isChecked ? "bg-blue-50/50 dark:bg-blue-900/10" : ""}>
                                                    <TableCell className="text-center font-medium">{index + 1}</TableCell>
                                                    <TableCell className="font-semibold text-slate-700 dark:text-slate-300">
                                                        {perm.menu}
                                                    </TableCell>
                                                    <TableCell>{perm.subMenu}</TableCell>
                                                    <TableCell className="text-center">
                                                        <Checkbox
                                                            checked={isChecked}
                                                            onCheckedChange={() => handlePermissionToggle(perm.menu, perm.subMenu)}
                                                            className="data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600"
                                                        />
                                                    </TableCell>
                                                </TableRow>
                                            );
                                        })}
                                    </TableBody>
                                </Table>
                            </ScrollArea>
                        </div>
                    </form>
                </div>

                <DialogFooter className="px-6 py-4 border-t shrink-0 bg-slate-50 dark:bg-slate-900/50 flex justify-between sm:justify-between items-center">
                    <p className="text-xs text-muted-foreground hidden sm:block">
                        {formData.permissions?.length} hak akses dipilih.
                    </p>
                    <div className="flex items-center gap-2 w-full sm:w-auto">
                        <Button type="button" variant="outline" onClick={onClose} disabled={isLoading} className="flex-1 sm:flex-none">
                            Batal
                        </Button>
                        <Button type="submit" form="user-form" disabled={isLoading} className="flex-1 sm:flex-none bg-blue-600 hover:bg-blue-700 text-white shadow-sm">
                            {isLoading ? "Menyimpan..." : "Simpan Pengguna"}
                        </Button>
                    </div>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
