import React, {useEffect, useState} from 'react';
import {
    Box,
    AppBar,
    Toolbar,
    Typography,
    IconButton
} from '@mui/material';
import { Menu } from 'lucide-react';
import Sidebar from './Sidebar';
import DashboardContent from './DashboardContent';
import ManageProfile from '../manage-profile/ManageProfile';
import SassaAccount from "../sassa-account/SassaAccount";
import PaymentsAndTransfers from "../payments-and-transfers/PaymentsAndTransfers";
import QuickLinks from "../quick-links/QuickLinks";

const Dashboard = ({ themePreference, setThemePreference, user,onLogout }) => {
    const [mobileOpen, setMobileOpen] = useState(false);
    const [currentPage, setCurrentPage] = useState('home');
    const drawerWidth = 260;

    const [preferences, setPreferences] = useState({
        theme: themePreference,
        emailNotifications: true,
        smsNotifications: false,
        marketingEmails: false,
        securityAlerts: true,
        language: 'en',
        currency: 'ZAR',
        twoFactorAuth: false,
    });

    useEffect(() => {
        console.log('user', user)
    }, [user]);

    const [loading, setLoading] = useState(false);

    const handleDrawerToggle = () => {
        setMobileOpen(!mobileOpen);
    };

    const handleNavigation = (route) => {
        setCurrentPage(route);
    };

    const handlePreferencesChange = (event) => {
        const { name, checked, value } = event.target;
        const newValue = checked !== undefined ? checked : value;
        setPreferences(prev => ({
            ...prev,
            [name]: newValue
        }));
        if (name === 'theme') {
            setThemePreference(newValue);
        }
    };

    const handleSavePreferences = async () => {
        setLoading(true);
        try {
            await new Promise(resolve => setTimeout(resolve, 1000));

            localStorage.setItem('userPreferences', JSON.stringify(preferences));

            console.log('Preferences saved:', preferences);
        } catch (error) {
            console.error('Error saving preferences:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = () => {
        if (window.confirm('Are you sure you want to logout?')) {
            onLogout();
        }
    };

    const renderCurrentPage = () => {
        switch (currentPage) {
            case 'home':
                return <DashboardContent user={user}  />;
            case 'manage-profile':
                return (
                    <ManageProfile
                        user={user}
                        preferences={preferences}
                        onPreferencesChange={handlePreferencesChange}
                        onSavePreferences={handleSavePreferences}
                        preferencesLoading={loading}
                    />
                );
            case 'sassa-account':
                return <SassaAccount user={user} />;
            case 'payments':
                return <PaymentsAndTransfers user={user} />;
            case 'quick-links':
                return <QuickLinks/>
            default:
                return <DashboardContent user={user}/>;
        }
    };

    return (
        <Box sx={{ display: 'flex', bgcolor: 'background.default', minHeight: '100vh' }}>
            <AppBar
                position="fixed"
                sx={{
                    width: { md: `calc(100% - ${drawerWidth}px)` },
                    ml: { md: `${drawerWidth}px` },
                    display: { md: 'none' },
                    bgcolor: '#1e293b',
                    zIndex: (theme) => theme.zIndex.drawer + 1,
                }}
            >
                <Toolbar>
                    <IconButton
                        color="inherit"
                        aria-label="open drawer"
                        edge="start"
                        onClick={handleDrawerToggle}
                    >
                        <Menu />
                    </IconButton>
                    <Typography variant="h6" noWrap component="div" sx={{ color: '#facc15' }}>
                        Relief Hub
                    </Typography>
                </Toolbar>
            </AppBar>

            {/* Sidebar */}
            <Box
                component="nav"
                sx={{
                    width: { md: drawerWidth },
                    flexShrink: { md: 0 }
                }}
            >
                <Sidebar
                    logout={onLogout}
                    mobileOpen={mobileOpen}
                    onClose={handleDrawerToggle}
                    onNavigate={handleNavigation}
                    drawerWidth={drawerWidth}
                />
            </Box>

            <Box
                component="main"
                sx={{
                    flexGrow: 1,
                    width: { xs: '100%', md: `calc(100% - ${drawerWidth}px)` },
                    minWidth: 0,
                }}
            >
                {renderCurrentPage()}
            </Box>
        </Box>
    );
};

export default Dashboard;