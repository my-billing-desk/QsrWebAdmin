import React, { createContext, useState, useContext, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(() => {
        const t = localStorage.getItem('token');
        if (t === 'undefined' || t === 'null') {
            localStorage.removeItem('token');
            return null;
        }
        return t;
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const initAuth = async () => {
            if (token) {
                // Set default header immediately
                api.defaults.headers.common['Authorization'] = `Bearer ${token}`;

                // Restore session from local storage first for UI speed
                const storedUser = localStorage.getItem('user');
                if (storedUser && storedUser !== 'undefined' && storedUser !== 'null') {
                    try {
                        setUser(JSON.parse(storedUser));
                    } catch (e) {
                        console.error("Error parsing stored user", e);
                        localStorage.removeItem('user');
                    }
                }

                try {
                    // Fetch fresh profile from backend
                    const res = await api.get('/auth/me');
                    // /auth/me returns the user object directly
                    const freshUser = res.data;

                    if (freshUser && freshUser.id) {
                        setUser(freshUser);
                        localStorage.setItem('user', JSON.stringify(freshUser));
                    }
                } catch (error) {
                    console.error("Failed to refresh session:", error);
                    if (error.response?.status === 401) {
                        logout();
                    }
                }
            }
            setLoading(false);
        };

        initAuth();
    }, [token]);

    const login = async (username, password, extra = {}) => {
        try {
            const res = await api.post('/auth/login', { username, password, ...extra });

            // Handle Ambiguity (300)
            if (res.status === 300) {
                return { success: false, error: 'Multiple accounts found', tenants: res.data.tenants };
            }

            const { token, user, daysLeft } = res.data;
            if (daysLeft !== undefined) {
                user.daysLeft = daysLeft;
                user.trialDaysLeft = daysLeft;
            }

            localStorage.setItem('token', token);
            localStorage.setItem('user', JSON.stringify(user));

            setToken(token);
            setUser(user);
            api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
            return { success: true };
        } catch (error) {
            console.error("Login failed", error);
            if (error.response?.status === 300) {
                return { success: false, error: 'Multiple accounts found', tenants: error.response.data.tenants };
            }
            return { success: false, error: error.response?.data?.error || 'Login failed' };
        }
    };

    const loginWithToken = (token, userData) => {
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(userData));
        setToken(token);
        setUser(userData);
        api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    };

    const logout = () => {
        setToken(null);
        setUser(null);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        delete api.defaults.headers.common['Authorization'];
    };

    return (
        <AuthContext.Provider value={{ user, token, login, loginWithToken, logout, loading }}>
            {!loading && children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
