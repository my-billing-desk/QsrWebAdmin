import React, { createContext, useState, useContext, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem('token'));
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const initAuth = async () => {
            if (token) {
                // Set default header immediately
                api.defaults.headers.common['Authorization'] = `Bearer ${token}`;

                // Restore session from local storage first for UI speed
                const storedUser = localStorage.getItem('user');
                if (storedUser) {
                    setUser(JSON.parse(storedUser));
                }

                try {
                    // Fetch fresh profile from backend
                    const res = await api.get('/auth/me');
                    if (res.data.success !== false) { // check for success flag if API wrapper returns it, but auth controller returns explicit object
                        // AuthController 'sendLoginResponse' returns { token, user: {...} } or { user: ... } ? 
                        // It returns res.json({ token, user: ... }).
                        const { user: freshUser, token: freshToken } = res.data;

                        setUser(freshUser);
                        localStorage.setItem('user', JSON.stringify(freshUser));
                        if (freshToken) {
                            // Update token if rotated (optional, but good practice)
                            localStorage.setItem('token', freshToken);
                            setToken(freshToken);
                        }
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

            const { token, user } = res.data;

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
