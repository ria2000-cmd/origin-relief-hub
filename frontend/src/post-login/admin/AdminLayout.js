import React, { useState } from 'react';
import {
    Box,
    AppBar,
    Toolbar,
    Typography,
    IconButton
} from '@mui/material';
import { Menu } from 'lucide-react';
import AdminSidebar from './AdminSidebar';
import AdminDashboard from './AdminDashboard';
import ManageUsers from './ManageUsers';
import ManagePayments from './ManagePayments';
import ViewReports from './ViewReports';

const AdminLayout = () => {
    const [mobileOpen, setMobileOpen] = useState(false);
    const [currentPage, setCurrentPage] = useState('dashboard');
    const drawerWidth = 260;

    const handleDrawerToggle = () => {
        setMobileOpen(!mobileOpen);
    };

    const handleNavigation = (route) => {
        setCurrentPage(route);
    };

    const renderCurrentPage = () => {
        switch (currentPage) {
            case 'dashboard':
                return <AdminDashboard />;
            case 'manage-users':
                return <ManageUsers />;
            case 'manage-payments':
                return <ManagePayments />;
            case 'view-reports':
                return <ViewReports />;
            default:
                return <AdminDashboard />;
        }
    };

    return (
        <Box sx={{ display: 'flex', bgcolor: '#f8fafc', minHeight: '100vh' }}>
            {/* Mobile AppBar */}
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
                        Relief Hub Admin
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
                <AdminSidebar
                    mobileOpen={mobileOpen}
                    onClose={handleDrawerToggle}
                    onNavigate={handleNavigation}
                    drawerWidth={drawerWidth}
                />
            </Box>

            {/* Main Content */}
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

export default AdminLayout;