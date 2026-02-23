import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Plus, Search, Edit, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { getUsers, createUser, updateUser, deleteUser } from "@/services/api/userApi";
import type { User, UserRequest } from "@/services/api/userApi";
import { UserFormDialog } from "./components/UserFormDialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

export default function UserManagementPage() {
    const [searchTerm, setSearchTerm] = useState("");

    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState<User | null>(null);

    const [page] = useState(0);
    const { data: pagedData, isLoading, refetch } = useQuery({
        queryKey: ["users-list", page],
        queryFn: () => getUsers(page, 10, "id", "desc"),
    });

    const users = pagedData?.content || [];

    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleAddUser = () => {
        setSelectedUser(null);
        setIsDialogOpen(true);
    };

    const handleEdit = (user: User) => {
        setSelectedUser(user);
        setIsDialogOpen(true);
    };

    const handleDelete = async (user: User) => {
        if (!confirm(`Apakah Anda yakin ingin menghapus pengguna ${user.username}?`)) return;
        try {
            await deleteUser(user.id);
            toast.success("Pengguna berhasil dihapus.");
            refetch();
        } catch (error: any) {
            toast.error(error.response?.data?.message || "Gagal menghapus pengguna.");
        }
    };

    const handleDialogSubmit = async (data: UserRequest) => {
        setIsSubmitting(true);
        try {
            if (selectedUser) {
                await updateUser(selectedUser.id, data);
                toast.success("Pengguna berhasil diperbarui.");
            } else {
                await createUser(data);
                toast.success("Pengguna berhasil ditambahkan.");
            }
            setIsDialogOpen(false);
            refetch();
        } catch (error: any) {
            toast.error(error.response?.data?.message || "Gagal menyimpan pengguna.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const filteredUsers = users?.filter(user =>
        user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.name.toLowerCase().includes(searchTerm.toLowerCase())
    ) || [];

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Manajemen Pengguna</h1>
                    <p className="text-muted-foreground mt-1">Atur hak akses, role, dan akun pengguna sistem SMAP.</p>
                </div>
                <Button onClick={handleAddUser}>
                    <Plus className="mr-2 h-4 w-4" /> Tambah User
                </Button>
            </div>

            <div className="flex items-center justify-between">
                <div className="relative w-72">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Cari Username atau Nama..."
                        className="pl-8"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            <div className="rounded-md border bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Username</TableHead>
                            <TableHead>Nama Lengkap</TableHead>
                            <TableHead>Role Akses</TableHead>
                            <TableHead>Email</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="text-right">Aksi</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {isLoading ? (
                            Array.from({ length: 5 }).map((_, i) => (
                                <TableRow key={i}>
                                    <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                                    <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                                    <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                                    <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                                    <TableCell><Skeleton className="h-4 w-16" /></TableCell>
                                    <TableCell className="text-right"><Skeleton className="h-8 w-16 ml-auto" /></TableCell>
                                </TableRow>
                            ))
                        ) : filteredUsers.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={6} className="h-24 text-center">
                                    Tidak ada data pengguna ditemukan.
                                </TableCell>
                            </TableRow>
                        ) : (
                            filteredUsers.map((user) => (
                                <TableRow key={user.id}>
                                    <TableCell className="font-medium">{user.username}</TableCell>
                                    <TableCell>{user.name}</TableCell>
                                    <TableCell>
                                        <Badge variant="outline" className={
                                            user.role === 'ADMIN' ? 'bg-purple-50 text-purple-700 border-purple-200' :
                                                user.role === 'PEGAWAI' ? 'bg-blue-50 text-foreground border-blue-200' :
                                                    'bg-slate-50 text-foreground border-slate-200'
                                        }>
                                            {user.role}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>{user.email}</TableCell>
                                    <TableCell>
                                        {user.active ? (
                                            <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200">Aktif</Badge>
                                        ) : (
                                            <Badge variant="outline" className="bg-rose-50 text-rose-700 border-rose-200">Nonaktif</Badge>
                                        )}
                                    </TableCell>
                                    <TableCell className="text-right space-x-2">
                                        <Button variant="ghost" size="icon" onClick={() => handleEdit(user)}>
                                            <Edit className="h-4 w-4 text-foreground" />
                                        </Button>
                                        <Button variant="ghost" size="icon" onClick={() => handleDelete(user)}>
                                            <Trash2 className="h-4 w-4 text-rose-600" />
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>

            <UserFormDialog
                isOpen={isDialogOpen}
                onClose={() => setIsDialogOpen(false)}
                user={selectedUser}
                onSubmit={handleDialogSubmit}
                isLoading={isSubmitting}
            />
        </div >
    );
}
