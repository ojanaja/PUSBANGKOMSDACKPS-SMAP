import { Button } from "@/components/ui/button";
import { ShieldAlert, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function UnauthorizedPage() {
    const navigate = useNavigate();

    return (
        <div className="flex w-full items-center justify-center p-8 min-h-[calc(100vh-80px)]">
            <div className="flex flex-col items-center justify-center space-y-6 text-center max-w-lg bg-white dark:bg-slate-900 shadow-sm border p-12 rounded-2xl">
                <div className="flex h-24 w-24 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/30">
                    <ShieldAlert className="h-12 w-12 text-red-600 dark:text-red-500" />
                </div>
                <div className="space-y-2">
                    <h1 className="text-3xl font-extrabold tracking-tight">Akses Ditolak</h1>
                    <p className="text-muted-foreground text-base">
                        Maaf, Anda tidak memiliki izin yang cukup untuk mengakses halaman atau fitur ini. Silakan hubungi administrator sistem jika Anda merasa ini adalah sebuah kesalahan.
                    </p>
                </div>
                <div className="flex gap-4 pt-4">
                    <Button variant="default" onClick={() => navigate('/dashboard')} className="min-w-[140px]">
                        Ke Dashboard
                    </Button>
                    <Button variant="outline" onClick={() => navigate(-1)} className="min-w-[140px]">
                        <ArrowLeft className="mr-2 h-4 w-4" /> Kembali
                    </Button>
                </div>
            </div>
        </div>
    );
}
