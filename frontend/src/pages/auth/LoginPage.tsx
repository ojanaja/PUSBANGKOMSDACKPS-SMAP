import { useState } from 'react';
import { useNavigate } from 'react-router';
import { useAuthStore } from '@/store/useAuthStore';
import { login } from '@/services/api/authApi';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { toast } from 'sonner';
import { Package } from 'lucide-react';

export default function LoginPage() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const setAuth = useAuthStore((state) => state.setAuth);
    const navigate = useNavigate();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!username || !password) {
            toast.error("Mohon isi username dan password.");
            return;
        }

        setIsLoading(true);
        try {
            const data = await login({ username, password });

            setAuth(
                {
                    id: data.id,
                    name: data.name,
                    username: data.username,
                    role: data.role,
                    nip: data.nip,
                    jabatan: data.jabatan,
                    bidang: data.bidang
                },
                data.token
            );

            toast.success(`Selamat datang, ${data.name}!`);
            navigate('/dashboard', { replace: true });
        } catch (error: any) {
            const msg = error.response?.data?.message || 'Username atau password salah.';
            toast.error(msg);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-900 px-4">
            <Card className="w-full max-w-md shadow-lg border-t-4 border-t-blue-600">
                <CardHeader className="space-y-1 items-center justify-center text-center pb-8">
                    <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mb-4 text-foreground dark:text-foreground">
                        <Package className="w-6 h-6" />
                    </div>
                    <CardTitle className="text-2xl font-bold tracking-tight">Login SMAP</CardTitle>
                    <CardDescription>
                        Sistem Manajemen Sarana Prasarana
                    </CardDescription>
                </CardHeader>
                <form onSubmit={handleLogin}>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="username">Username</Label>
                            <Input
                                id="username"
                                type="text"
                                placeholder="Masukkan username..."
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                disabled={isLoading}
                                autoFocus
                            />
                        </div>
                        <div className="space-y-2">
                            <div className="flex items-center justify-between">
                                <Label htmlFor="password">Password</Label>
                            </div>
                            <Input
                                id="password"
                                type="password"
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                disabled={isLoading}
                            />
                        </div>
                    </CardContent>
                    <CardFooter className="flex flex-col gap-4 mt-2">
                        <Button
                            className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                            type="submit"
                            disabled={isLoading}
                        >
                            {isLoading ? "Otentikasi..." : "Masuk ke Sistem"}
                        </Button>
                        <p className="text-xs text-center text-muted-foreground">
                            Gunakan kredensial akun yang telah didaftarkan oleh Administrator.
                        </p>
                    </CardFooter>
                </form>
            </Card>
        </div>
    );
}
