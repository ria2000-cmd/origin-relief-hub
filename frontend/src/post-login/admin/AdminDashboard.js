import React from 'react';
import { Box, Typography, Grid, Card, CardContent, Paper } from '@mui/material';
import { Users, CreditCard, BarChart3, AlertTriangle } from 'lucide-react';

const AdminDashboard = () => {
    // Mock data for admin stats
    const stats = [
        {
            title: 'Total Users',
            value: '1,247',
            change: '+12%',
            icon: <Users size={24} />,
            color: '#10b981'
        },
        {
            title: 'Pending Payments',
            value: '89',
            change: '-5%',
            icon: <CreditCard size={24} />,
            color: '#f59e0b'
        },
        {
            title: 'Monthly Revenue',
            value: 'R 45,230',
            change: '+18%',
            icon: <BarChart3 size={24} />,
            color: '#3b82f6'
        },
        {
            title: 'Support Tickets',
            value: '23',
            change: '+2%',
            icon: <AlertTriangle size={24} />,
            color: '#ef4444'
        }
    ];

    const AdminCard = ({ title, value, change, icon, color }) => (
        <Card sx={{
            borderRadius: 3,
            boxShadow: 2,
            transition: 'all 0.2s ease',
            '&:hover': {
                boxShadow: 4,
                transform: 'translateY(-2px)'
            }
        }}>
            <CardContent sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Box>
                        <Typography variant="body2" color="text.secondary" gutterBottom>
                            {title}
                        </Typography>
                        <Typography variant="h4" fontWeight="bold" color="text.primary">
                            {value}
                        </Typography>
                        <Typography
                            variant="body2"
                            sx={{
                                color: change.startsWith('+') ? '#10b981' : '#ef4444',
                                fontWeight: 600
                            }}
                        >
                            {change} from last month
                        </Typography>
                    </Box>
                    <Box sx={{
                        p: 2,
                        borderRadius: 2,
                        bgcolor: `${color}20`,
                        color: color
                    }}>
                        {icon}
                    </Box>
                </Box>
            </CardContent>
        </Card>
    );

    return (
        <Box sx={{ p: 3, mt: { xs: 8, md: 0 }, minHeight: '100vh', bgcolor: '#f8fafc' }}>
            {/* Header */}
            <Typography variant="h4" fontWeight="bold" sx={{ color: '#facc15', mb: 1 }}>
                Admin Dashboard
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
                Overview of system performance and key metrics
            </Typography>

            {/* Stats Cards */}
            <Grid container spacing={3} sx={{ mb: 4 }}>
                {stats.map((stat, index) => (
                    <Grid item xs={12} sm={6} lg={3} key={index}>
                        <AdminCard {...stat} />
                    </Grid>
                ))}
            </Grid>

            {/* Quick Actions */}
            <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                    <Paper sx={{ p: 3, borderRadius: 3, boxShadow: 2 }}>
                        <Typography variant="h6" fontWeight="600" gutterBottom>
                            Recent Activity
                        </Typography>
                        <Box sx={{ mt: 2 }}>
                            <Typography variant="body2" color="text.secondary">
                                • New user registration: john.doe@example.com
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                • Payment processed: R1,250.00
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                • Support ticket resolved: #12455
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                • System backup completed
                            </Typography>
                        </Box>
                    </Paper>
                </Grid>

                <Grid item xs={12} md={6}>
                    <Paper sx={{ p: 3, borderRadius: 3, boxShadow: 2 }}>
                        <Typography variant="h6" fontWeight="600" gutterBottom>
                            System Status
                        </Typography>
                        <Box sx={{ mt: 2 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                <Box sx={{
                                    width: 8,
                                    height: 8,
                                    borderRadius: '50%',
                                    bgcolor: '#10b981',
                                    mr: 1
                                }} />
                                <Typography variant="body2">API Services: Operational</Typography>
                            </Box>
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                <Box sx={{
                                    width: 8,
                                    height: 8,
                                    borderRadius: '50%',
                                    bgcolor: '#10b981',
                                    mr: 1
                                }} />
                                <Typography variant="body2">Database: Healthy</Typography>
                            </Box>
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                <Box sx={{
                                    width: 8,
                                    height: 8,
                                    borderRadius: '50%',
                                    bgcolor: '#f59e0b',
                                    mr: 1
                                }} />
                                <Typography variant="body2">Email Service: Degraded</Typography>
                            </Box>
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                <Box sx={{
                                    width: 8,
                                    height: 8,
                                    borderRadius: '50%',
                                    bgcolor: '#10b981',
                                    mr: 1
                                }} />
                                <Typography variant="body2">Storage: 78% Used</Typography>
                            </Box>
                        </Box>
                    </Paper>
                </Grid>
            </Grid>
        </Box>
    );
};

export default AdminDashboard;