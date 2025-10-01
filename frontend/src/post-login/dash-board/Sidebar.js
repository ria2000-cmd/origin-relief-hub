import React, { useState } from 'react';
import {
    Box,
    Drawer,
    List,
    Typography,
    ListItem,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    Avatar,
    Button,
    Divider
} from '@mui/material';
import {
    Home,
    User,
    CreditCard,
    FileText,
    Link,
    LogOut
} from 'lucide-react';

const Sidebar = ({ mobileOpen, onClose, drawerWidth, onNavigate ,logout}) => {
    const [selectedIndex, setSelectedIndex] = useState(0);

    const menuItems = [
        { text: 'Home', icon: <Home size={20} />, route: 'home' },
        { text: 'Manage Profile', icon: <User size={20} />, route: 'manage-profile' },
        { text: 'SASSA Account', icon: <FileText size={20} />, route: 'sassa-account' },
        { text: 'Payments and Transfers', icon: <CreditCard size={20} />, route: 'payments' },
        { text: 'Quick Links', icon: <Link size={20} />, route: 'quick-links' },
    ];

    const handleMenuClick = (index, route) => {
        setSelectedIndex(index);
        if (onNavigate) {
            onNavigate(route);
        }
        if (mobileOpen) {
            onClose();
        }
    };

    const handleLogout = () => {
        logout();
        console.log('Logging out...');
    };

    const drawer = (
        <Box sx={{ height: '100%', bgcolor: '#1e293b', color: 'white', display: 'flex', flexDirection: 'column' }}>
            {/* Sidebar Header */}
            <Box sx={{ p: 3, textAlign: 'center', bgcolor: '#334155' }}>
                <Typography variant="h5" fontWeight="bold" sx={{ color: '#facc15', mb: 1 }}>
                    Relief Hub
                </Typography>
                <Avatar sx={{ bgcolor: '#facc15', color: '#1e293b', width: 32, height: 32, mx: 'auto' }}>
                    R
                </Avatar>
            </Box>

            {/* Sidebar Menu - Takes up remaining space */}
            <Box sx={{ flex: 1, px: 2, py: 3 }}>
                <List sx={{ height: '100%' }}>
                    {menuItems.map((item, index) => (
                        <ListItem key={item.text} disablePadding sx={{ mb: 1 }}>
                            <ListItemButton
                                selected={selectedIndex === index}
                                onClick={() => handleMenuClick(index, item.route)}
                                sx={{
                                    borderRadius: 2,
                                    '&.Mui-selected': {
                                        bgcolor: '#facc15',
                                        color: '#1e293b',
                                        fontWeight: 600,
                                        '&:hover': { bgcolor: '#eab308' }
                                    },
                                    '&:hover': {
                                        bgcolor: '#374151'
                                    }
                                }}
                            >
                                <ListItemIcon sx={{
                                    color: selectedIndex === index ? '#1e293b' : '#94a3b8',
                                    minWidth: 36
                                }}>
                                    {item.icon}
                                </ListItemIcon>
                                <ListItemText
                                    primary={item.text}
                                    sx={{
                                        '& .MuiTypography-root': {
                                            fontWeight: selectedIndex === index ? 600 : 400
                                        }
                                    }}
                                />
                            </ListItemButton>
                        </ListItem>
                    ))}
                </List>
            </Box>

            {/* Logout Button at Bottom */}
            <Box sx={{ p: 2 }}>
                <Divider sx={{ mb: 2, borderColor: '#374151' }} />
                <Button
                    fullWidth
                    onClick={handleLogout}
                    startIcon={<LogOut size={18} />}
                    sx={{
                        color: '#94a3b8', // Neutral gray
                        borderColor: '#374151',
                        border: '1px solid',
                        py: 1,
                        textTransform: 'none',
                        '&:hover': {
                            bgcolor: '#374151',
                            borderColor: '#94a3b8',
                            color: 'white'
                        }
                    }}
                >
                    Logout
                </Button>
            </Box>
        </Box>
    );

    return (
        <>
            {/* Mobile Sidebar */}
            <Drawer
                variant="temporary"
                open={mobileOpen}
                onClose={onClose}
                ModalProps={{ keepMounted: true }}
                sx={{
                    display: { xs: 'block', md: 'none' },
                    '& .MuiDrawer-paper': {
                        boxSizing: 'border-box',
                        width: drawerWidth,
                        height: '100vh',
                    },
                }}
            >
                {drawer}
            </Drawer>

            {/* Desktop Sidebar */}
            <Drawer
                variant="permanent"
                sx={{
                    display: { xs: 'none', md: 'block' },
                    '& .MuiDrawer-paper': {
                        boxSizing: 'border-box',
                        width: drawerWidth,
                        height: '100vh',
                        position: 'relative',
                        whiteSpace: 'nowrap',
                    },
                }}
                open
            >
                {drawer}
            </Drawer>
        </>
    );
};

export default Sidebar;
