import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import LandingPage from "./pre-login/LandingPage";
import './assets/stylesheet.css';
import getTheme from "./theme/getTheme";
import React, { useState, useMemo, useEffect } from "react";
import Dashboard from "./post-login/dash-board/Dashboard";
import AdminLayout from "./post-login/admin/AdminLayout";

function App() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [userRole, setUserRole] = useState(null);
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);

    const [themePreference, setThemePreference] = useState(() => {
        return localStorage.getItem('themePreference') || 'light';
    });

    const themeMode = useMemo(() => {
        if (themePreference === 'auto') {
            return window.matchMedia('(prefers-color-scheme: dark)').matches
                ? 'dark'
                : 'light';
        }
        return themePreference;
    }, [themePreference]);

    const theme = useMemo(() => getTheme(themeMode), [themeMode]);

    useEffect(() => {
        localStorage.setItem('themePreference', themePreference);
    }, [themePreference]);

    useEffect(() => {
        if (themePreference === 'auto') {
            const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

            const handleChange = () => {
                setThemePreference('auto');
            };

            mediaQuery.addEventListener('change', handleChange);
            return () => mediaQuery.removeEventListener('change', handleChange);
        }
    }, [themePreference]);

    useEffect(() => {
        checkAuthentication();
    }, []);

    const checkAuthentication = () => {
        const token = localStorage.getItem('token');
        const role = localStorage.getItem('userRole');
        const storedUser = localStorage.getItem('user') || sessionStorage.getItem('user');

        if (token && role && storedUser && storedUser !== 'undefined') {
            try {
                const parsedUser = JSON.parse(storedUser);
                setIsAuthenticated(true);
                setUserRole(role);
                setUserData(parsedUser);
            } catch (error) {
                console.error('Error parsing stored user data:', error);
                localStorage.removeItem('token');
                localStorage.removeItem('userRole');
                localStorage.removeItem('user');
                sessionStorage.removeItem('user');
                setIsAuthenticated(false);
                setUserRole(null);
                setUserData(null);
            }
        } else {
            setIsAuthenticated(false);
            setUserRole(null);
            setUserData(null);
        }
        setLoading(false);
    };

    const handleLoginSuccess = (token, role, user) => {
        const actualRole = role || user?.role || 'USER';

        localStorage.setItem('token', token);
        localStorage.setItem('userRole', actualRole);
        localStorage.setItem('user', JSON.stringify(user));

        setIsAuthenticated(true);
        setUserRole(actualRole);
        setUserData(user);

    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('userRole');
        localStorage.removeItem('user');
        localStorage.removeItem('authToken');
        sessionStorage.removeItem('authToken');
        sessionStorage.removeItem('user');

        setIsAuthenticated(false);
        setUserRole(null);
        setUserData(null);
    };

    if (loading) {
        return (
            <ThemeProvider theme={theme}>
                <CssBaseline />
                <div style={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    height: '100vh'
                }}>
                    <div>Loading...</div>
                </div>
            </ThemeProvider>
        );
    }

    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <div className="App">
                {!isAuthenticated ? (
                    <LandingPage onLoginSuccess={handleLoginSuccess} />
                ) : userRole && userRole !== 'USER' ? (
                    <AdminLayout
                        user={userData}
                        onLogout={handleLogout}
                        themePreference={themePreference}
                        setThemePreference={setThemePreference}
                    />
                ) : (
                    <Dashboard
                        user={userData}
                        onLogout={handleLogout}
                        themePreference={themePreference}
                        setThemePreference={setThemePreference}
                    />
                )}
            </div>
        </ThemeProvider>
    );
}

export default App;