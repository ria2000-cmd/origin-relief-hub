import React, { useState } from 'react';
import {
    Box,
    Paper,
    Typography,
    Grid,
    Card,
    CardContent,
    Button,
    TextField,
    MenuItem,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Chip,
    Divider,
    Tabs,
    Tab,
    Alert,
    Snackbar
} from '@mui/material';
import {
    TrendingUp,
    TrendingDown,
    Users,
    DollarSign,
    Activity,
    Calendar,
    Download,
    BarChart3,
    PieChart,
    RefreshCw
} from 'lucide-react';

const ViewReports = () => {
    const [currentTab, setCurrentTab] = useState(0);
    const [dateRange, setDateRange] = useState('month');
    const [reportType, setReportType] = useState('overview');
    const [snackbar, setSnackbar] = useState({
        open: false,
        message: '',
        severity: 'success'
    });

    // Mock data for reports
    const overviewStats = {
        totalUsers: { value: 1247, change: '+12.5%', trend: 'up' },
        totalRevenue: { value: 'R 245,890', change: '+18.2%', trend: 'up' },
        totalPayments: { value: 892, change: '+8.4%', trend: 'up' },
        activeUsers: { value: 789, change: '-3.2%', trend: 'down' }
    };

    const recentTransactions = [
        { id: 1, user: 'John Doe', type: 'Electricity', amount: 150, date: '2025-10-18', status: 'Completed' },
        { id: 2, user: 'Jane Smith', type: 'Cash Send', amount: 500, date: '2025-10-18', status: 'Processing' },
        { id: 3, user: 'Bob Johnson', type: 'Bank Transfer', amount: 1850, date: '2025-10-17', status: 'Completed' },
        { id: 4, user: 'Alice Brown', type: 'Electricity', amount: 200, date: '2025-10-17', status: 'Completed' },
        { id: 5, user: 'Charlie Wilson', type: 'Cash Send', amount: 750, date: '2025-10-16', status: 'Failed' },
    ];

    const userGrowth = [
        { month: 'April', users: 850 },
        { month: 'May', users: 920 },
        { month: 'June', users: 1050 },
        { month: 'July', users: 1120 },
        { month: 'August', users: 1180 },
        { month: 'September', users: 1220 },
        { month: 'October', users: 1247 },
    ];

    const paymentBreakdown = [
        { type: 'Electricity', count: 342, amount: 45230 },
        { type: 'Cash Send', count: 278, amount: 89450 },
        { type: 'Bank Transfer', count: 198, amount: 85670 },
        { type: 'Mobile Money', count: 74, amount: 25540 },
    ];

    const topUsers = [
        { name: 'John Doe', transactions: 45, totalSpent: 12450 },
        { name: 'Jane Smith', transactions: 38, totalSpent: 10890 },
        { name: 'Bob Johnson', transactions: 32, totalSpent: 9870 },
        { name: 'Alice Brown', transactions: 28, totalSpent: 8450 },
        { name: 'Charlie Wilson', transactions: 24, totalSpent: 7230 },
    ];

    const handleTabChange = (event, newValue) => {
        setCurrentTab(newValue);
    };

    const handleExportReport = () => {
        try {
            let csvData = [];
            let filename = '';

            if (currentTab === 0) {
                // Export Overview
                filename = `overview_report_${new Date().toISOString().split('T')[0]}.csv`;
                csvData = [
                    ['Metric', 'Value', 'Change'],
                    ['Total Users', overviewStats.totalUsers.value, overviewStats.totalUsers.change],
                    ['Total Revenue', overviewStats.totalRevenue.value, overviewStats.totalRevenue.change],
                    ['Total Payments', overviewStats.totalPayments.value, overviewStats.totalPayments.change],
                    ['Active Users', overviewStats.activeUsers.value, overviewStats.activeUsers.change],
                ];
            } else if (currentTab === 1) {
                // Export Transactions
                filename = `transactions_report_${new Date().toISOString().split('T')[0]}.csv`;
                csvData = [
                    ['ID', 'User', 'Type', 'Amount', 'Date', 'Status'],
                    ...recentTransactions.map(t => [t.id, t.user, t.type, `R ${t.amount}`, t.date, t.status])
                ];
            } else if (currentTab === 2) {
                // Export Payment Breakdown
                filename = `payment_breakdown_${new Date().toISOString().split('T')[0]}.csv`;
                csvData = [
                    ['Type', 'Count', 'Total Amount'],
                    ...paymentBreakdown.map(p => [p.type, p.count, `R ${p.amount.toFixed(2)}`])
                ];
            } else if (currentTab === 3) {
                // Export Top Users
                filename = `top_users_${new Date().toISOString().split('T')[0]}.csv`;
                csvData = [
                    ['Name', 'Transactions', 'Total Spent'],
                    ...topUsers.map(u => [u.name, u.transactions, `R ${u.totalSpent.toFixed(2)}`])
                ];
            }

            const csv = csvData.map(row => row.join(',')).join('\n');
            const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
            const link = document.createElement('a');
            const url = URL.createObjectURL(blob);

            link.setAttribute('href', url);
            link.setAttribute('download', filename);
            link.style.visibility = 'hidden';

            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);

            setSnackbar({
                open: true,
                message: 'Report exported successfully!',
                severity: 'success'
            });
        } catch (error) {
            console.error('Export error:', error);
            setSnackbar({
                open: true,
                message: 'Failed to export report',
                severity: 'error'
            });
        }
    };

    const handleRefresh = () => {
        setSnackbar({
            open: true,
            message: 'Reports refreshed successfully!',
            severity: 'success'
        });
    };

    const StatCard = ({ title, value, change, trend, icon: Icon, color }) => (
        <Card sx={{
            height: '100%',
            borderRadius: 3,
            boxShadow: 2,
            transition: 'all 0.2s ease',
            '&:hover': {
                boxShadow: 4,
                transform: 'translateY(-2px)'
            }
        }}>
            <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                    <Typography variant="body2" color="text.secondary" fontWeight={500}>
                        {title}
                    </Typography>
                    <Box sx={{
                        p: 1,
                        borderRadius: 2,
                        bgcolor: `${color}20`,
                        color: color
                    }}>
                        <Icon size={20} />
                    </Box>
                </Box>
                <Typography variant="h4" fontWeight="bold" gutterBottom>
                    {value}
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    {trend === 'up' ? (
                        <TrendingUp size={16} color="#10b981" />
                    ) : (
                        <TrendingDown size={16} color="#ef4444" />
                    )}
                    <Typography
                        variant="body2"
                        sx={{
                            color: trend === 'up' ? '#10b981' : '#ef4444',
                            fontWeight: 600
                        }}
                    >
                        {change}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        vs last period
                    </Typography>
                </Box>
            </CardContent>
        </Card>
    );

    return (
        <Box sx={{ p: 3, mt: { xs: 8, md: 0 }, minHeight: '100vh', bgcolor: '#f8fafc' }}>
            {/* Header */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Box>
                    <Typography variant="h4" fontWeight="bold" sx={{ color: '#facc15', mb: 1 }}>
                        View Reports
                    </Typography>
                    <Typography variant="body1" color="text.secondary">
                        Comprehensive analytics and reporting dashboard
                    </Typography>
                </Box>
                <Box sx={{ display: 'flex', gap: 1 }}>
                    <Button
                        variant="outlined"
                        startIcon={<RefreshCw size={18} />}
                        onClick={handleRefresh}
                        sx={{ textTransform: 'none' }}
                    >
                        Refresh
                    </Button>
                    <Button
                        variant="contained"
                        startIcon={<Download size={18} />}
                        onClick={handleExportReport}
                        sx={{
                            bgcolor: '#facc15',
                            color: '#1e3a8a',
                            textTransform: 'none',
                            '&:hover': { bgcolor: '#eab308' }
                        }}
                    >
                        Export Report
                    </Button>
                </Box>
            </Box>

            {/* Filters */}
            <Paper sx={{ p: 2, mb: 3, borderRadius: 3 }}>
                <Grid container spacing={2} alignItems="center">
                    <Grid item xs={12} md={4}>
                        <TextField
                            fullWidth
                            select
                            size="small"
                            label="Date Range"
                            value={dateRange}
                            onChange={(e) => setDateRange(e.target.value)}
                        >
                            <MenuItem value="today">Today</MenuItem>
                            <MenuItem value="week">Last 7 Days</MenuItem>
                            <MenuItem value="month">Last 30 Days</MenuItem>
                            <MenuItem value="quarter">Last 90 Days</MenuItem>
                            <MenuItem value="year">Last Year</MenuItem>
                            <MenuItem value="custom">Custom Range</MenuItem>
                        </TextField>
                    </Grid>
                    <Grid item xs={12} md={4}>
                        <TextField
                            fullWidth
                            select
                            size="small"
                            label="Report Type"
                            value={reportType}
                            onChange={(e) => setReportType(e.target.value)}
                        >
                            <MenuItem value="overview">Overview</MenuItem>
                            <MenuItem value="detailed">Detailed</MenuItem>
                            <MenuItem value="summary">Summary</MenuItem>
                        </TextField>
                    </Grid>
                    <Grid item xs={12} md={4}>
                        <Alert severity="info" sx={{ py: 0 }}>
                            Showing data for: Last 30 Days
                        </Alert>
                    </Grid>
                </Grid>
            </Paper>

            {/* Statistics Cards */}
            <Grid container spacing={3} sx={{ mb: 3 }}>
                <Grid item xs={12} sm={6} lg={3}>
                    <StatCard
                        title="Total Users"
                        value={overviewStats.totalUsers.value}
                        change={overviewStats.totalUsers.change}
                        trend={overviewStats.totalUsers.trend}
                        icon={Users}
                        color="#3b82f6"
                    />
                </Grid>
                <Grid item xs={12} sm={6} lg={3}>
                    <StatCard
                        title="Total Revenue"
                        value={overviewStats.totalRevenue.value}
                        change={overviewStats.totalRevenue.change}
                        trend={overviewStats.totalRevenue.trend}
                        icon={DollarSign}
                        color="#10b981"
                    />
                </Grid>
                <Grid item xs={12} sm={6} lg={3}>
                    <StatCard
                        title="Total Payments"
                        value={overviewStats.totalPayments.value}
                        change={overviewStats.totalPayments.change}
                        trend={overviewStats.totalPayments.trend}
                        icon={Activity}
                        color="#f59e0b"
                    />
                </Grid>
                <Grid item xs={12} sm={6} lg={3}>
                    <StatCard
                        title="Active Users"
                        value={overviewStats.activeUsers.value}
                        change={overviewStats.activeUsers.change}
                        trend={overviewStats.activeUsers.trend}
                        icon={TrendingUp}
                        color="#8b5cf6"
                    />
                </Grid>
            </Grid>

            {/* Tabs */}
            <Paper sx={{ borderRadius: 3, mb: 3 }}>
                <Tabs
                    value={currentTab}
                    onChange={handleTabChange}
                    variant="scrollable"
                    scrollButtons="auto"
                    sx={{
                        '& .MuiTab-root': { textTransform: 'none', fontWeight: 500 },
                        '& .Mui-selected': { color: '#facc15' },
                        '& .MuiTabs-indicator': { bgcolor: '#facc15' }
                    }}
                >
                    <Tab label="Overview" icon={<BarChart3 size={18} />} iconPosition="start" />
                    <Tab label="Recent Transactions" icon={<Activity size={18} />} iconPosition="start" />
                    <Tab label="Payment Breakdown" icon={<PieChart size={18} />} iconPosition="start" />
                    <Tab label="Top Users" icon={<Users size={18} />} iconPosition="start" />
                </Tabs>
            </Paper>

            {/* Tab Content */}
            {currentTab === 0 && (
                <Grid container spacing={3}>
                    {/* User Growth Chart */}
                    <Grid item xs={12} lg={8}>
                        <Paper sx={{ p: 3, borderRadius: 3, boxShadow: 2 }}>
                            <Typography variant="h6" fontWeight="600" gutterBottom>
                                User Growth Trend
                            </Typography>
                            <Divider sx={{ mb: 3 }} />
                            <Box sx={{ overflowX: 'auto' }}>
                                <Box sx={{ display: 'flex', alignItems: 'flex-end', gap: 2, minWidth: 500, height: 300 }}>
                                    {userGrowth.map((data, index) => (
                                        <Box key={index} sx={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1 }}>
                                            <Typography variant="caption" fontWeight="600">
                                                {data.users}
                                            </Typography>
                                            <Box
                                                sx={{
                                                    width: '100%',
                                                    height: `${(data.users / 1300) * 100}%`,
                                                    bgcolor: '#facc15',
                                                    borderRadius: '4px 4px 0 0',
                                                    minHeight: 20,
                                                    transition: 'all 0.3s ease'
                                                }}
                                            />
                                            <Typography variant="caption" color="text.secondary">
                                                {data.month}
                                            </Typography>
                                        </Box>
                                    ))}
                                </Box>
                            </Box>
                        </Paper>
                    </Grid>

                    {/* Quick Stats */}
                    <Grid item xs={12} lg={4}>
                        <Paper sx={{ p: 3, borderRadius: 3, boxShadow: 2, height: '100%' }}>
                            <Typography variant="h6" fontWeight="600" gutterBottom>
                                Quick Stats
                            </Typography>
                            <Divider sx={{ mb: 2 }} />
                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <Typography variant="body2" color="text.secondary">
                                        Avg. Transaction Value
                                    </Typography>
                                    <Typography variant="body2" fontWeight="600">
                                        R 275.50
                                    </Typography>
                                </Box>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <Typography variant="body2" color="text.secondary">
                                        Success Rate
                                    </Typography>
                                    <Chip label="94.2%" color="success" size="small" />
                                </Box>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <Typography variant="body2" color="text.secondary">
                                        Failed Transactions
                                    </Typography>
                                    <Typography variant="body2" fontWeight="600" color="error">
                                        52
                                    </Typography>
                                </Box>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <Typography variant="body2" color="text.secondary">
                                        Pending Payments
                                    </Typography>
                                    <Typography variant="body2" fontWeight="600" color="warning.main">
                                        28
                                    </Typography>
                                </Box>
                                <Divider />
                                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <Typography variant="body2" color="text.secondary">
                                        New Users (Today)
                                    </Typography>
                                    <Typography variant="body2" fontWeight="600" color="primary">
                                        +15
                                    </Typography>
                                </Box>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <Typography variant="body2" color="text.secondary">
                                        Revenue (Today)
                                    </Typography>
                                    <Typography variant="body2" fontWeight="600" color="success.main">
                                        R 12,450
                                    </Typography>
                                </Box>
                            </Box>
                        </Paper>
                    </Grid>
                </Grid>
            )}

            {/* Recent Transactions Tab */}
            {currentTab === 1 && (
                <Paper sx={{ borderRadius: 3, boxShadow: 2, overflow: 'hidden' }}>
                    <TableContainer>
                        <Table>
                            <TableHead sx={{ bgcolor: '#f8fafc' }}>
                                <TableRow>
                                    <TableCell sx={{ fontWeight: 600 }}>ID</TableCell>
                                    <TableCell sx={{ fontWeight: 600 }}>User</TableCell>
                                    <TableCell sx={{ fontWeight: 600 }}>Type</TableCell>
                                    <TableCell sx={{ fontWeight: 600 }}>Amount</TableCell>
                                    <TableCell sx={{ fontWeight: 600 }}>Date</TableCell>
                                    <TableCell sx={{ fontWeight: 600 }}>Status</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {recentTransactions.map((transaction) => (
                                    <TableRow key={transaction.id} sx={{ '&:hover': { bgcolor: '#f8fafc' } }}>
                                        <TableCell>{transaction.id}</TableCell>
                                        <TableCell>{transaction.user}</TableCell>
                                        <TableCell>{transaction.type}</TableCell>
                                        <TableCell fontWeight="600">R {transaction.amount.toFixed(2)}</TableCell>
                                        <TableCell>{transaction.date}</TableCell>
                                        <TableCell>
                                            <Chip
                                                label={transaction.status}
                                                color={
                                                    transaction.status === 'Completed' ? 'success' :
                                                    transaction.status === 'Processing' ? 'warning' : 'error'
                                                }
                                                size="small"
                                            />
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Paper>
            )}

            {/* Payment Breakdown Tab */}
            {currentTab === 2 && (
                <Paper sx={{ p: 3, borderRadius: 3, boxShadow: 2 }}>
                    <Typography variant="h6" fontWeight="600" gutterBottom>
                        Payment Type Distribution
                    </Typography>
                    <Divider sx={{ mb: 3 }} />
                    <TableContainer>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell sx={{ fontWeight: 600 }}>Payment Type</TableCell>
                                    <TableCell sx={{ fontWeight: 600 }}>Transaction Count</TableCell>
                                    <TableCell sx={{ fontWeight: 600 }}>Total Amount</TableCell>
                                    <TableCell sx={{ fontWeight: 600 }}>Percentage</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {paymentBreakdown.map((payment, index) => {
                                    const total = paymentBreakdown.reduce((sum, p) => sum + p.amount, 0);
                                    const percentage = ((payment.amount / total) * 100).toFixed(1);
                                    return (
                                        <TableRow key={index} sx={{ '&:hover': { bgcolor: '#f8fafc' } }}>
                                            <TableCell fontWeight="600">{payment.type}</TableCell>
                                            <TableCell>{payment.count}</TableCell>
                                            <TableCell fontWeight="600" color="success.main">
                                                R {payment.amount.toFixed(2)}
                                            </TableCell>
                                            <TableCell>
                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                    <Box
                                                        sx={{
                                                            width: `${percentage}%`,
                                                            height: 8,
                                                            bgcolor: '#facc15',
                                                            borderRadius: 1,
                                                            minWidth: 20
                                                        }}
                                                    />
                                                    <Typography variant="body2">{percentage}%</Typography>
                                                </Box>
                                            </TableCell>
                                        </TableRow>
                                    );
                                })}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Paper>
            )}

            {/* Top Users Tab */}
            {currentTab === 3 && (
                <Paper sx={{ p: 3, borderRadius: 3, boxShadow: 2 }}>
                    <Typography variant="h6" fontWeight="600" gutterBottom>
                        Top 5 Users by Activity
                    </Typography>
                    <Divider sx={{ mb: 3 }} />
                    <TableContainer>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell sx={{ fontWeight: 600 }}>Rank</TableCell>
                                    <TableCell sx={{ fontWeight: 600 }}>User Name</TableCell>
                                    <TableCell sx={{ fontWeight: 600 }}>Total Transactions</TableCell>
                                    <TableCell sx={{ fontWeight: 600 }}>Total Spent</TableCell>
                                    <TableCell sx={{ fontWeight: 600 }}>Avg. per Transaction</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {topUsers.map((user, index) => (
                                    <TableRow key={index} sx={{ '&:hover': { bgcolor: '#f8fafc' } }}>
                                        <TableCell>
                                            <Chip
                                                label={`#${index + 1}`}
                                                color={index === 0 ? 'warning' : 'default'}
                                                size="small"
                                            />
                                        </TableCell>
                                        <TableCell fontWeight="600">{user.name}</TableCell>
                                        <TableCell>{user.transactions}</TableCell>
                                        <TableCell fontWeight="600" color="success.main">
                                            R {user.totalSpent.toFixed(2)}
                                        </TableCell>
                                        <TableCell>
                                            R {(user.totalSpent / user.transactions).toFixed(2)}
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Paper>
            )}

            {/* Snackbar */}
            <Snackbar
                open={snackbar.open}
                autoHideDuration={4000}
                onClose={() => setSnackbar({ ...snackbar, open: false })}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            >
                <Alert
                    onClose={() => setSnackbar({ ...snackbar, open: false })}
                    severity={snackbar.severity}
                    sx={{ width: '100%' }}
                >
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </Box>
    );
};

export default ViewReports;
