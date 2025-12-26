import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Lock, User, AlertCircle, Mail } from 'lucide-react';
import { useSearchParams, useNavigate } from 'react-router-dom';

export default function Login() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);
    const { login, loginWithToken } = useAuth();
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    useEffect(() => {
        const token = searchParams.get('token');
        const errorParam = searchParams.get('error');

        if (token) {
            const user = {
                id: searchParams.get('id'),
                username: searchParams.get('username'),
                role: searchParams.get('role'),
                name: searchParams.get('name') || searchParams.get('username')
            };
            loginWithToken(token, user);
            navigate('/'); // clean URL
        } else if (errorParam) {
            setError(errorParam === 'auth_failed' ? 'Google Authentication Failed' : 'Login Failed');
        }
    }, [searchParams, loginWithToken, navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        const res = await login(username, password);
        if (!res.success) {
            setError(res.error);
        }
    };

    const handleGoogleLogin = () => {
        window.location.href = 'http://localhost:5001/api/auth/google';
    };

    return (
        <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex items-center justify-center p-4">
            <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-xl w-full max-w-md border border-gray-200 dark:border-gray-700">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold bg-gradient-to-r from-violet-600 to-indigo-600 bg-clip-text text-transparent">
                        QSR Admin
                    </h1>
                    <p className="text-gray-500 dark:text-gray-400 mt-2">Sign in to manage your restaurant</p>
                </div>

                {error && (
                    <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-lg text-sm flex items-center gap-2">
                        <AlertCircle className="w-4 h-4" />
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-1">
                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Username</label>
                        <div className="relative">
                            <User className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                            <input
                                type="text"
                                value={username}
                                onChange={e => setUsername(e.target.value)}
                                className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 focus:ring-2 focus:ring-violet-500 outline-none transition-all"
                                placeholder="Enter your username"
                            />
                        </div>
                    </div>

                    <div className="space-y-1">
                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Password</label>
                        <div className="relative">
                            <Lock className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                            <input
                                type="password"
                                value={password}
                                onChange={e => setPassword(e.target.value)}
                                className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 focus:ring-2 focus:ring-violet-500 outline-none transition-all"
                                placeholder="••••••••"
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        className="w-full py-3 bg-violet-600 hover:bg-violet-700 text-white font-bold rounded-xl shadow-lg shadow-violet-600/20 transition-all active:scale-95"
                    >
                        Sign In
                    </button>

                    <div className="relative flex items-center justify-center my-6">
                        <div className="border-t border-gray-200 dark:border-gray-700 w-full absolute"></div>
                        <span className="bg-white dark:bg-gray-800 px-3 text-xs text-gray-500 z-10 uppercase font-medium">Or continue with</span>
                    </div>

                    <button
                        type="button"
                        onClick={handleGoogleLogin}
                        className="w-full py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 font-bold rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors flex items-center justify-center gap-2"
                    >
                        <Mail className="w-5 h-5 text-red-500" />
                        Google
                    </button>
                </form>




            </div>
        </div>
    );
}
