import React, { useState, useEffect } from 'react';
import {
    Box,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Button,
    Typography,
    TextField,
    Grid,
    Chip,
    IconButton,
    Menu,
    MenuItem,
    Alert,
    InputAdornment
} from '@mui/material';
import {
    Search,
    Plus,
    Eye,
    CheckCircle,
    XCircle,
    MoreVertical,
    Download,
    Filter,
    Calendar,
    DollarSign
} from 'lucide-react';

const ManagePayments = () => {
    const [payments, setPayments] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('All');
    const [anchorEl, setAnchorEl] = useState(null);
    const [selectedPayment, setSelectedPayment] = useState(null);

    useEffect(() => {
        // Load payments from API or mock data
        const mockPayments = [
            {
                id: 1,
                user: 'John Doe',
                email: 'john.doe@example.com',
                amount: 1850,
                status: 'Completed',
                type: 'Grant Payment',
                date: '2024-03-10',
                transactionId: 'TXN-12345',
                paymentMethod: 'Bank Transfer'
            },
            {
                id: 2,
                user: 'Jane Smith',
                email: 'jane.smith@example.com',
                amount: 2100,
                status: 'Pending',
                type: 'Emergency Relief',
                date: '2024-03-12',
                transactionId: 'TXN-12346',
                paymentMethod: 'Bank Transfer'
            },
            {
                id: 3,
                user: 'Bob Johnson',
                email: 'bob.johnson@example.com',
                amount: 1500,
                status: 'Failed',
                type: 'Grant Payment',
                date: '2024-03-11',
                transactionId: 'TXN-12347',
                paymentMethod: 'Mobile Money'
            },
            {
                id: 4,
                user: 'Alice Brown',
                email: 'alice.brown@example.com',
                amount: 3200,
                status: 'Processing',
                type: 'Disability Grant',
                date: '2024-03-13',
                transactionId: 'TXN-12348',
                paymentMethod: 'Bank Transfer'
            },
        ];
        setPayments(mockPayments);
    }, []);

    const handleMenuOpen = (event, payment) => {
        setAnchorEl(event.currentTarget);
        setSelectedPayment(payment);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
        setSelectedPayment(null);
    };

    const handleViewDetails = (payment) => {
        console.log('View payment details:', payment);
        handleMenuClose();
    };

    const handleApprove = (payment) => {
        console.log('Approve payment:', payment);
        setPayments(payments.map(p =>
            p.id === payment.id ? { ...p, status: 'Completed' } : p
        ));
        handleMenuClose();
    };

    const handleReject = (payment) => {
        console.log('Reject payment:', payment);
        setPayments(payments.map(p =>
            p.id === payment.id ? { ...p, status: 'Failed' } : p
        ));
        handleMenuClose();
    };

    const filteredPayments = payments.filter(payment => {
        const matchesSearch = payment.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
            payment.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
            payment.transactionId.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = filterStatus === 'All' || payment.status === filterStatus;
        return matchesSearch && matchesStatus;
    });

    const getStatusColor = (status) => {
        switch (status) {
            case 'Completed': return 'success';
            case 'Pending': return 'warning';
            case 'Processing': return 'info';
            case 'Failed': return 'error';
            default: return 'default';
        }
    };

    const getTypeColor = (type) => {
        switch (type) {
            case 'Grant Payment': return 'primary';
            case 'Emergency Relief': return 'error';
            case 'Disability Grant': return 'secondary';
            default: return 'default';
        }
    };

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-ZA', {
            style: 'currency',
            currency: 'ZAR',
        }).format(amount);
    };

    const getTotalAmount = () => {
        return filteredPayments.reduce((sum, payment) => sum + payment.amount, 0);
    };

    const getStatusCounts = () => {
        return {
            completed: filteredPayments.filter(p => p.status === 'Completed').length,
            pending: filteredPayments.filter(p => p.status === 'Pending').length,
            processing: filteredPayments.filter(p => p.status === 'Processing').length,
            failed: filteredPayments.filter(p => p.status === 'Failed').length,
        };
    };

    const statusCounts = getStatusCounts();

    return (
        <Box>
            {/* Header Section */}
            <Typography variant="h4" fontWeight="bold" sx={{ color: '#facc15', mb: 1 }}>
                Manage Payments
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
                Monitor and manage all system payments and transactions
            </Typography>

            {/* Statistics Cards */}
            <Grid container spacing={3} sx={{ mb: 3 }}>
                <Grid item xs={12} sm={6} md={3}>
                    <Paper sx={{ p: 2, borderRadius: 2, bgcolor: '#f0fdf4', border: '1px solid #bbf7d0' }}>
                        <Typography variant="body2" color="#166534" gutterBottom>Completed</Typography>
                        <Typography variant="h5" fontWeight="bold" color="#166534">{statusCounts.completed}</Typography>
                    </Paper>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <Paper sx={{ p: 2, borderRadius: 2, bgcolor: '#fffbeb', border: '1px solid #fde68a' }}>
                        <Typography variant="body2" color="#d97706" gutterBottom>Pending</Typography>
                        <Typography variant="h5" fontWeight="bold" color="#d97706">{statusCounts.pending}</Typography>
                    </Paper>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <Paper sx={{ p: 2, borderRadius: 2, bgcolor: '#eff6ff', border: '1px solid #bfdbfe' }}>
                        <Typography variant="body2" color="#1d4ed8" gutterBottom>Processing</Typography>
                        <Typography variant="h5" fontWeight="bold" color="#1d4ed8">{statusCounts.processing}</Typography>
                    </Paper>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <Paper sx={{ p: 2, borderRadius: 2, bgcolor: '#fef2f2', border: '1px solid #fecaca' }}>
                        <Typography variant="body2" color="#dc2626" gutterBottom>Failed</Typography>
                        <Typography variant="h5" fontWeight="bold" color="#dc2626">{statusCounts.failed}</Typography>
                    </Paper>
                </Grid>
            </Grid>

            {/* Action Bar */}
            <Paper sx={{ p: 3, mb: 3, borderRadius: 3, boxShadow: 2 }}>
                <Grid container spacing={2} alignItems="center">
                    <Grid item xs={12} md={4}>
                        <TextField
                            fullWidth
                            size="small"
                            placeholder="Search payments..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            InputProps={{
                                startAdornment: <Search size={20} style={{ marginRight: 8, color: '#6b7280' }} />
                            }}
                        />
                    </Grid>
                    <Grid item xs={12} md={2}>
                        <TextField
                            fullWidth
                            select
                            size="small"
                            label="Status"
                            value={filterStatus}
                            onChange={(e) => setFilterStatus(e.target.value)}
                        >
                            <MenuItem value="All">All Status</MenuItem>
                            <MenuItem value="Completed">Completed</MenuItem>
                            <MenuItem value="Pending">Pending</MenuItem>
                            <MenuItem value="Processing">Processing</MenuItem>
                            <MenuItem value="Failed">Failed</MenuItem>
                        </TextField>
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
                            <Button
                                variant="outlined"
                                startIcon={<Download size={16} />}
                                sx={{ textTransform: 'none' }}
                            >
                                Export Report
                            </Button>
                            <Button
                                variant="gold"
                                startIcon={<Plus size={16} />}
                                sx={{ textTransform: 'none' }}
                            >
                                Process Payment
                            </Button>
                        </Box>
                    </Grid>
                </Grid>
            </Paper>

            {/* Summary Alert */}
            <Alert severity="info" sx={{ mb: 3 }}>
                Showing {filteredPayments.length} of {payments.length} payments •
                Total Amount: <strong>{formatCurrency(getTotalAmount())}</strong>
            </Alert>

            {/* Payments Table */}
            <Paper sx={{ borderRadius: 3, boxShadow: 2, overflow: 'hidden' }}>
                <TableContainer>
                    <Table>
                        <TableHead sx={{ bgcolor: '#f8fafc' }}>
                            <TableRow>
                                <TableCell sx={{ fontWeight: 600, color: '#374151' }}>User Details</TableCell>
                                <TableCell sx={{ fontWeight: 600, color: '#374151' }}>Amount</TableCell>
                                <TableCell sx={{ fontWeight: 600, color: '#374151' }}>Type</TableCell>
                                <TableCell sx={{ fontWeight: 600, color: '#374151' }}>Status</TableCell>
                                <TableCell sx={{ fontWeight: 600, color: '#374151' }}>Date</TableCell>
                                <TableCell sx={{ fontWeight: 600, color: '#374151' }}>Transaction ID</TableCell>
                                <TableCell sx={{ fontWeight: 600, color: '#374151' }}>Method</TableCell>
                                <TableCell sx={{ fontWeight: 600, color: '#374151', textAlign: 'center' }}>Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {filteredPayments.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={8} sx={{ textAlign: 'center', py: 4 }}>
                                        <Typography color="text.secondary">
                                            {searchTerm ? 'No payments found matching your search.' : 'No payments found.'}
                                        </Typography>
                                    </TableCell>
                                </TableRow>
                            ) : (
                                filteredPayments.map((payment) => (
                                    <TableRow
                                        key={payment.id}
                                        sx={{
                                            '&:hover': { bgcolor: '#f8fafc' },
                                            transition: 'background-color 0.2s ease'
                                        }}
                                    >
                                        <TableCell>
                                            <Box>
                                                <Typography variant="body2" fontWeight={500}>
                                                    {payment.user}
                                                </Typography>
                                                <Typography variant="caption" color="text.secondary">
                                                    {payment.email}
                                                </Typography>
                                            </Box>
                                        </TableCell>
                                        <TableCell>
                                            <Typography variant="body2" fontWeight={600} color="primary.main">
                                                {formatCurrency(payment.amount)}
                                            </Typography>
                                        </TableCell>
                                        <TableCell>
                                            <Chip
                                                label={payment.type}
                                                color={getTypeColor(payment.type)}
                                                size="small"
                                                variant="outlined"
                                            />
                                        </TableCell>
                                        <TableCell>
                                            <Chip
                                                label={payment.status}
                                                color={getStatusColor(payment.status)}
                                                size="small"
                                            />
                                        </TableCell>
                                        <TableCell>
                                            <Typography variant="body2" color="text.secondary">
                                                {new Date(payment.date).toLocaleDateString()}
                                            </Typography>
                                        </TableCell>
                                        <TableCell>
                                            <Typography variant="body2" color="text.secondary" sx={{ fontFamily: 'monospace' }}>
                                                {payment.transactionId}
                                            </Typography>
                                        </TableCell>
                                        <TableCell>
                                            <Typography variant="body2" color="text.secondary">
                                                {payment.paymentMethod}
                                            </Typography>
                                        </TableCell>
                                        <TableCell sx={{ textAlign: 'center' }}>
                                            <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center' }}>
                                                <IconButton
                                                    size="small"
                                                    onClick={() => handleViewDetails(payment)}
                                                    sx={{ color: '#3b82f6' }}
                                                >
                                                    <Eye size={16} />
                                                </IconButton>
                                                <IconButton
                                                    size="small"
                                                    onClick={(e) => handleMenuOpen(e, payment)}
                                                >
                                                    <MoreVertical size={16} />
                                                </IconButton>
                                            </Box>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Paper>

            {/* Action Menu */}
            <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}
            >
                <MenuItem onClick={() => handleViewDetails(selectedPayment)}>
                    <Eye size={16} style={{ marginRight: 8 }} />
                    View Details
                </MenuItem>
                {selectedPayment?.status === 'Pending' && (
                    <>
                        <MenuItem onClick={() => handleApprove(selectedPayment)} sx={{ color: 'success.main' }}>
                            <CheckCircle size={16} style={{ marginRight: 8 }} />
                            Approve Payment
                        </MenuItem>
                        <MenuItem onClick={() => handleReject(selectedPayment)} sx={{ color: 'error.main' }}>
                            <XCircle size={16} style={{ marginRight: 8 }} />
                            Reject Payment
                        </MenuItem>
                    </>
                )}
            </Menu>
        </Box>
    );
};

export default ManagePayments;