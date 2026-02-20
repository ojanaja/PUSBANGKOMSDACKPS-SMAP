import { useAuthStore } from '../../store/useAuthStore';

export default function LoginPage() {
    const setAuth = useAuthStore((state) => state.setAuth);

    const handleLogin = () => {
        setAuth(
            { id: 1, name: 'Admin', username: 'admin', role: 'ADMIN' },
            'dummy-jwt-token'
        );
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-100 dark:bg-slate-900">
            <div className="p-8 bg-white dark:bg-slate-800 rounded shadow-md w-full max-w-sm">
                <h1 className="text-2xl font-bold mb-6 text-center">SMAP Login</h1>
                <button
                    onClick={handleLogin}
                    className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
                >
                    Masuk sebagai Admin (Demo)
                </button>
            </div>
        </div>
    );
}
