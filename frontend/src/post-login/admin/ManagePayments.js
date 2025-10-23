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
    InputAdornment,
    Snackbar,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    CircularProgress,
    FormControl,
    InputLabel,
    Select
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
import AdminService from '../../service/admin-service';

const ManagePayments = () => {
    const [payments, setPayments] = useState([]);
    const [users, setUsers] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('All');
    const [anchorEl, setAnchorEl] = useState(null);
    const [selectedPayment, setSelectedPayment] = useState(null);
    const [loading, setLoading] = useState(true);
    const [snackbar, setSnackbar] = useState({
        open: false,
        message: '',
        severity: 'success'
    });

    // Process Payment Dialog
    const [processDialogOpen, setProcessDialogOpen] = useState(false);
    const [processLoading, setProcessLoading] = useState(false);
    const [paymentFormData, setPaymentFormData] = useState({
        userId: '',
        userName: '',
        email: '',
        amount: '',
        type: 'Grant Payment',
        paymentMethod: 'Bank Transfer',
        description: ''
    });

    useEffect(() => {
        fetchUsers();
        fetchPayments();
    }, []);

    const fetchUsers = async () => {
        try {
            const response = await AdminService.getAllUsers();
            console.log('Users response:', response);

            let usersData = [];

            // Handle different response structures
            if (response.data && response.data.content && Array.isArray(response.data.content)) {
                usersData = response.data.content;
            } else if (Array.isArray(response.data)) {
                usersData = response.data;
            }

            console.log('Parsed users:', usersData);
            setUsers(usersData);
        } catch (error) {
            console.error('Error fetching users:', error);
            setSnackbar({
                open: true,
                message: 'Failed to load users',
                severity: 'error'
            });
        }
    };

    const fetchPayments = async () => {
        setLoading(true);
        try {
            // For now, use mock data - you can replace this with actual API call
            const mockPayments = [
            {
                id: 1,
                user: 'Ria Maluta',
                email: 'ree@gmail.com',
                amount: 1850,
                status: 'Completed',
                type: 'Grant Payment',
                date: '2024-03-10',
                transactionId: 'TXN-12345',
                paymentMethod: 'Bank Transfer'
            },
            {
                id: 2,
                user: 'Ria Maluta',
                email: 'riam@interfile.co.za',
                amount: 2100,
                status: 'Pending',
                type: 'Emergency Relief',
                date: '2024-03-12',
                transactionId: 'TXN-12346',
                paymentMethod: 'Bank Transfer'
            },
            {
                id: 3,
                user: 'hulk hulk',
                email: 'riammm@interfile.co.za',
                amount: 1500,
                status: 'Failed',
                type: 'Grant Payment',
                date: '2024-03-11',
                transactionId: 'TXN-12347',
                paymentMethod: 'Mobile Money'
            },
        ];
            setPayments(mockPayments);
        } catch (error) {
            console.error('Error fetching payments:', error);
            setSnackbar({
                open: true,
                message: 'Failed to load payments',
                severity: 'error'
            });
        } finally {
            setLoading(false);
        }
    };

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

    // Export to CSV Function
    const handleExportCSV = () => {
        try {
            // Define CSV headers
            const headers = [
                'Transaction ID',
                'User Name',
                'Email',
                'Amount (ZAR)',
                'Type',
                'Status',
                'Payment Method',
                'Date',
                'Total Amount'
            ];

            // Convert payments data to CSV format
            const csvData = filteredPayments.map(payment => {
                return [
                    payment.transactionId || '',
                    payment.user || '',
                    payment.email || '',
                    payment.amount || 0,
                    payment.type || '',
                    payment.status || '',
                    payment.paymentMethod || '',
                    payment.date || '',
                    formatCurrency(payment.amount)
                ].map(field => {
                    // Escape fields that contain commas, quotes, or newlines
                    const fieldStr = String(field);
                    if (fieldStr.includes(',') || fieldStr.includes('"') || fieldStr.includes('\n')) {
                        return `"${fieldStr.replace(/"/g, '""')}"`;
                    }
                    return fieldStr;
                }).join(',');
            });

            // Add summary row
            const summaryRow = [
                '',
                '',
                '',
                '',
                '',
                '',
                '',
                'TOTAL:',
                formatCurrency(getTotalAmount())
            ].join(',');

            // Combine headers, data, and summary
            const csv = [
                headers.join(','),
                ...csvData,
                '',
                summaryRow,
                '',
                `Report Generated: ${new Date().toLocaleString()}`,
                `Total Transactions: ${filteredPayments.length}`,
                `Completed: ${statusCounts.completed}`,
                `Pending: ${statusCounts.pending}`,
                `Processing: ${statusCounts.processing}`,
                `Failed: ${statusCounts.failed}`
            ].join('\n');

            // Create blob and download
            const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
            const link = document.createElement('a');
            const url = URL.createObjectURL(blob);

            link.setAttribute('href', url);
            link.setAttribute('download', `payment_report_${new Date().toISOString().split('T')[0]}.csv`);
            link.style.visibility = 'hidden';

            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);

            setSnackbar({
                open: true,
                message: `Successfully exported ${filteredPayments.length} payments to CSV`,
                severity: 'success'
            });
        } catch (error) {
            console.error('Error exporting CSV:', error);
            setSnackbar({
                open: true,
                message: 'Failed to export CSV. Please try again.',
                severity: 'error'
            });
        }
    };

    const handleCloseSnackbar = () => {
        setSnackbar({ ...snackbar, open: false });
    };

    // Process Payment Functions
    const handleOpenProcessDialog = () => {
        setProcessDialogOpen(true);
    };

    const handleCloseProcessDialog = () => {
        setProcessDialogOpen(false);
        setPaymentFormData({
            userId: '',
            userName: '',
            email: '',
            amount: '',
            type: 'Grant Payment',
            paymentMethod: 'Bank Transfer',
            description: ''
        });
    };

    const handlePaymentFormChange = (e) => {
        const { name, value } = e.target;
        setPaymentFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleUserSelection = (e) => {
        const selectedUserId = e.target.value;
        const selectedUser = users.find(user => user.id === selectedUserId);

        if (selectedUser) {
            setPaymentFormData(prev => ({
                ...prev,
                userId: selectedUserId,
                userName: selectedUser.fullName || selectedUser.displayName || '',
                email: selectedUser.email || ''
            }));
        }
    };

    const handleProcessPayment = async () => {
        // Validate form
        if (!paymentFormData.userId || !paymentFormData.amount) {
            setSnackbar({
                open: true,
                message: 'Please select a user and enter an amount',
                severity: 'error'
            });
            return;
        }

        if (parseFloat(paymentFormData.amount) <= 0) {
            setSnackbar({
                open: true,
                message: 'Amount must be greater than 0',
                severity: 'error'
            });
            return;
        }

        setProcessLoading(true);

        try {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1500));

            // Create new payment
            const newPayment = {
                id: payments.length + 1,
                user: paymentFormData.userName,
                email: paymentFormData.email,
                amount: parseFloat(paymentFormData.amount),
                status: 'Processing',
                type: paymentFormData.type,
                date: new Date().toISOString().split('T')[0],
                transactionId: `TXN-${Date.now().toString().slice(-5)}`,
                paymentMethod: paymentFormData.paymentMethod,
                description: paymentFormData.description
            };

            // Add to payments list
            setPayments([newPayment, ...payments]);

            setSnackbar({
                open: true,
                message: `Payment of ${formatCurrency(parseFloat(paymentFormData.amount))} processed successfully`,
                severity: 'success'
            });

            handleCloseProcessDialog();
        } catch (error) {
            console.error('Error processing payment:', error);
            setSnackbar({
                open: true,
                message: 'Failed to process payment. Please try again.',
                severity: 'error'
            });
        } finally {
            setProcessLoading(false);
        }
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
                                onClick={handleExportCSV}
                                disabled={filteredPayments.length === 0}
                            >
                                Export Report
                            </Button>
                            <Button
                                variant="gold"
                                startIcon={<Plus size={16} />}
                                sx={{ textTransform: 'none' }}
                                onClick={handleOpenProcessDialog}
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

            {/* Process Payment Dialog */}
            <Dialog
                open={processDialogOpen}
                onClose={handleCloseProcessDialog}
                maxWidth="sm"
                fullWidth
            >
                <DialogTitle sx={{ bgcolor: '#facc15', color: '#1e3a8a', fontWeight: 'bold' }}>
                    Process New Payment
                </DialogTitle>
                <DialogContent sx={{ mt: 2 }}>
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <FormControl fullWidth required disabled={processLoading}>
                                <InputLabel>Select User</InputLabel>
                                <Select
                                    value={paymentFormData.userId}
                                    onChange={handleUserSelection}
                                    label="Select User"
                                >
                                    {users.length === 0 ? (
                                        <MenuItem disabled>No users available</MenuItem>
                                    ) : (
                                        users.map((user) => (
                                            <MenuItem key={user.id} value={user.id}>
                                                {user.fullName || user.displayName || user.username || 'Unknown User'} ({user.email})
                                            </MenuItem>
                                        ))
                                    )}
                                </Select>
                            </FormControl>
                        </Grid>
                        {paymentFormData.userId && (
                            <Grid item xs={12}>
                                <Alert severity="info" sx={{ py: 0.5 }}>
                                    <Typography variant="body2">
                                        <strong>Selected User:</strong> {paymentFormData.userName}
                                    </Typography>
                                    <Typography variant="body2">
                                        <strong>Email:</strong> {paymentFormData.email}
                                    </Typography>
                                </Alert>
                            </Grid>
                        )}
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="Amount (ZAR)"
                                name="amount"
                                type="number"
                                value={paymentFormData.amount}
                                onChange={handlePaymentFormChange}
                                required
                                disabled={processLoading}
                                InputProps={{
                                    startAdornment: <InputAdornment position="start">R</InputAdornment>,
                                }}
                                inputProps={{ min: 0, step: 0.01 }}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                select
                                label="Payment Type"
                                name="type"
                                value={paymentFormData.type}
                                onChange={handlePaymentFormChange}
                                disabled={processLoading}
                            >
                                <MenuItem value="Grant Payment">Grant Payment</MenuItem>
                                <MenuItem value="Emergency Relief">Emergency Relief</MenuItem>
                                <MenuItem value="Disability Grant">Disability Grant</MenuItem>
                                <MenuItem value="Child Support">Child Support</MenuItem>
                                <MenuItem value="Old Age Pension">Old Age Pension</MenuItem>
                            </TextField>
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                select
                                label="Payment Method"
                                name="paymentMethod"
                                value={paymentFormData.paymentMethod}
                                onChange={handlePaymentFormChange}
                                disabled={processLoading}
                            >
                                <MenuItem value="Bank Transfer">Bank Transfer</MenuItem>
                                <MenuItem value="Mobile Money">Mobile Money</MenuItem>
                                <MenuItem value="Cash">Cash</MenuItem>
                                <MenuItem value="Check">Check</MenuItem>
                            </TextField>
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Description (Optional)"
                                name="description"
                                value={paymentFormData.description}
                                onChange={handlePaymentFormChange}
                                multiline
                                rows={3}
                                disabled={processLoading}
                                placeholder="Add any additional notes..."
                            />
                        </Grid>
                    </Grid>
                </DialogContent>
                <DialogActions sx={{ px: 3, pb: 2 }}>
                    <Button
                        onClick={handleCloseProcessDialog}
                        disabled={processLoading}
                        sx={{ textTransform: 'none' }}
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={handleProcessPayment}
                        variant="contained"
                        disabled={processLoading}
                        startIcon={processLoading ? <CircularProgress size={16} /> : <Plus size={16} />}
                        sx={{
                            bgcolor: '#facc15',
                            color: '#1e3a8a',
                            textTransform: 'none',
                            '&:hover': { bgcolor: '#eab308' }
                        }}
                    >
                        {processLoading ? 'Processing...' : 'Process Payment'}
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Snackbar for notifications */}
            <Snackbar
                open={snackbar.open}
                autoHideDuration={4000}
                onClose={handleCloseSnackbar}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            >
                <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%' }}>
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </Box>
    );
};

export default ManagePayments;