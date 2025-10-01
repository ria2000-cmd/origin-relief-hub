import React, { useState, useEffect } from 'react';
import {Box, Typography, Paper, TextField, Button,
    Alert, CircularProgress, InputAdornment, Divider,
    Dialog, DialogTitle, DialogContent, DialogActions,
    List, ListItem, ListItemIcon, ListItemText, Chip
} from '@mui/material';
import {Send, Phone, User, AlertCircle, CheckCircle,
    Copy, MapPin, Store, CreditCard} from 'lucide-react';
import CashSendService from '../../service/cash-send-service'
import SassaService from "../../service/sassa-service";

const CashSend = () => {
    const [balance, setBalance] = useState(0);
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState('');
    const [error, setError] = useState('');
    const [showSuccess, setShowSuccess] = useState(false);
    const [cashSendResult, setCashSendResult] = useState(null);
    const [sassaAccountId, setSassaAccountId] = useState(null);

    const [formData, setFormData] = useState({
        amount: '',
        recipientPhone: '',
        recipientName: '',
        message: ''
    });

    const FEE = 3.50;

    useEffect(() => {
        fetchBalance();
    }, []);

    const fetchBalance = async () => {
        try {
            const result = await SassaService.getSassaBalance();

            if (result.success) {
                setBalance(result.balance);
                setSassaAccountId(result.sassaAccountId);
            } else {
                setBalance(0);
                setError(result.error);
            }
        } catch (err) {
            console.error('Error fetching balance:', err);
            setError('Failed to load balance');
            setBalance(0);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        if (name === 'recipientPhone') {
            const cleaned = value.replace(/\D/g, '');
            setFormData(prev => ({ ...prev, [name]: cleaned }));
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }

        if (error) setError('');
    };

    const getTotalCost = () => {
        const amount = parseFloat(formData.amount) || 0;
        return amount + FEE;
    };

    const validateForm = () => {
        if (!formData.amount || parseFloat(formData.amount) <= 0) {
            setError('Please enter a valid amount');
            return false;
        }

        if (parseFloat(formData.amount) < 10) {
            setError('Minimum cash send amount is R10.00');
            return false;
        }

        if (parseFloat(formData.amount) > 3000) {
            setError('Maximum cash send amount is R3,000.00');
            return false;
        }

        const totalCost = getTotalCost();
        if (totalCost > balance) {
            setError(`Insufficient balance. Available: R${balance.toFixed(2)}, Required: R${totalCost.toFixed(2)}`);
            return false;
        }

        if (!formData.recipientPhone || formData.recipientPhone.length < 10) {
            setError('Please enter a valid phone number (10 digits)');
            return false;
        }

        if (!formData.recipientName || formData.recipientName.trim().length < 2) {
            setError('Please enter recipient name');
            return false;
        }

        return true;
    };

    const handleSendCash = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        if (!validateForm()) {
            return;
        }

        setLoading(true);

        try {
            const response = await CashSendService.sendCash({
                amount: parseFloat(formData.amount),
                recipientPhone: formData.recipientPhone,
                recipientName: formData.recipientName,
                message: formData.message || null
            });

            if (response.data.success) {
                setCashSendResult(response.data.data);
                setShowSuccess(true);
                setBalance(response.data.data.remainingBalance);

                // Clear form
                setFormData({
                    amount: '',
                    recipientPhone: '',
                    recipientName: '',
                    message: ''
                });
            }

        } catch (err) {
            console.error('Cash send error:', err);
            setError(err.response?.data?.message || 'Cash send failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const copyToClipboard = (text, label) => {
        navigator.clipboard.writeText(text);
        setSuccess(`${label} copied to clipboard!`);
        setTimeout(() => setSuccess(''), 2000);
    };

    const handleCloseSuccess = () => {
        setShowSuccess(false);
        setCashSendResult(null);
    };

    // Collection points in South Africa
    const collectionPoints = [
        { name: 'Pick n Pay', icon: <Store size={24} /> },
        { name: 'Shoprite', icon: <Store size={24} /> },
        { name: 'Checkers', icon: <Store size={24} /> },
        { name: 'Boxer', icon: <Store size={24} /> },
        { name: 'ABSA ATMs', icon: <CreditCard size={24} /> },
        { name: 'FNB ATMs', icon: <CreditCard size={24} /> },
        { name: 'Standard Bank ATMs', icon: <CreditCard size={24} /> }
    ];

    return (
        <Box sx={{ p: 3, mt: { xs: 8, md: 0 }, minHeight: '100vh', bgcolor: 'background.default' }}>
            <Typography variant="h4" fontWeight="bold" sx={{ color: '#facc15', mb: 1 }}>
                Cash Send
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
                Send cash to anyone with a phone number - no bank account needed
            </Typography>

            {/* Balance Card */}
            <Paper sx={{ p: 3, mb: 3, borderRadius: 2, bgcolor: '#1e3a8a', color: 'white' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Box>
                        <Typography variant="body2" sx={{ mb: 1, opacity: 0.8 }}>
                            Available Balance
                        </Typography>
                        <Typography variant="h3" fontWeight="bold">
                            R {balance.toFixed(2)}
                        </Typography>
                    </Box>
                </Box>
            </Paper>

            {/* Alerts */}
            {error && (
                <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError('')}>
                    {error}
                </Alert>
            )}
            {success && (
                <Alert severity="success" sx={{ mb: 3 }} onClose={() => setSuccess('')}>
                    {success}
                </Alert>
            )}

            {/* Cash Send Form */}
            <Paper sx={{ p: 4, borderRadius: 3, mb: 3 }}>
                <form onSubmit={handleSendCash}>
                    <Typography variant="h6" fontWeight="600" sx={{ mb: 3 }}>
                        Send Cash Details
                    </Typography>

                    {/* Amount */}
                    <TextField
                        fullWidth
                        label="Amount"
                        name="amount"
                        type="number"
                        value={formData.amount}
                        onChange={handleInputChange}
                        required
                        disabled={loading}
                        inputProps={{ min: 10, max: 3000, step: 1 }}
                        InputProps={{
                            startAdornment: <InputAdornment position="start">R</InputAdornment>,
                        }}
                        sx={{ mb: 2 }}
                        helperText="Minimum: R10 | Maximum: R3,000"
                    />

                    {/* Fee Display */}
                    {formData.amount && (
                        <Box sx={{ mb: 3, p: 2, bgcolor: '#f3f4f6', borderRadius: 1 }}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                <Typography variant="body2">Amount</Typography>
                                <Typography variant="body2" fontWeight="600">
                                    R {parseFloat(formData.amount).toFixed(2)}
                                </Typography>
                            </Box>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                <Typography variant="body2">Fee</Typography>
                                <Typography variant="body2" fontWeight="600">
                                    R {FEE.toFixed(2)}
                                </Typography>
                            </Box>
                            <Divider sx={{ my: 1 }} />
                            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                <Typography variant="body1" fontWeight="bold">Total Cost</Typography>
                                <Typography variant="body1" fontWeight="bold" color="primary">
                                    R {getTotalCost().toFixed(2)}
                                </Typography>
                            </Box>
                        </Box>
                    )}

                    {/* Recipient Phone */}
                    <TextField
                        fullWidth
                        label="Recipient Phone Number"
                        name="recipientPhone"
                        value={formData.recipientPhone}
                        onChange={handleInputChange}
                        required
                        disabled={loading}
                        placeholder="0821234567"
                        inputProps={{ maxLength: 10 }}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <Phone size={20} />
                                </InputAdornment>
                            ),
                        }}
                        sx={{ mb: 3 }}
                        helperText="Enter 10-digit South African number"
                    />

                    {/* Recipient Name */}
                    <TextField
                        fullWidth
                        label="Recipient Name"
                        name="recipientName"
                        value={formData.recipientName}
                        onChange={handleInputChange}
                        required
                        disabled={loading}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <User size={20} />
                                </InputAdornment>
                            ),
                        }}
                        sx={{ mb: 3 }}
                    />

                    {/* Optional Message */}
                    <TextField
                        fullWidth
                        label="Message (Optional)"
                        name="message"
                        value={formData.message}
                        onChange={handleInputChange}
                        disabled={loading}
                        multiline
                        rows={2}
                        helperText="Add a personal message"
                        sx={{ mb: 4 }}
                    />

                    {/* Submit Button */}
                    <Button
                        type="submit"
                        variant="contained"
                        fullWidth
                        size="large"
                        disabled={loading || balance === 0}
                        startIcon={loading ? <CircularProgress size={20} /> : <Send size={20} />}
                        sx={{
                            bgcolor: '#facc15',
                            color: '#1e3a8a',
                            fontWeight: 600,
                            py: 1.5,
                            '&:hover': {
                                bgcolor: '#eab308',
                            },
                            '&:disabled': {
                                bgcolor: '#e5e7eb',
                                color: '#9ca3af',
                            }
                        }}
                    >
                        {loading ? 'Sending Cash...' : 'Send Cash'}
                    </Button>
                </form>
            </Paper>

            {/* Collection Points Info */}
            <Paper sx={{ p: 4, borderRadius: 3 }}>
                <Typography variant="h6" fontWeight="600" sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                    <MapPin size={24} color="#1e3a8a" />
                    Where to Collect Cash
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                    Recipients can collect cash at any of these locations:
                </Typography>

                <List>
                    {collectionPoints.map((point, index) => (
                        <ListItem key={index} sx={{ py: 1 }}>
                            <ListItemIcon sx={{ color: '#1e3a8a', minWidth: 40 }}>
                                {point.icon}
                            </ListItemIcon>
                            <ListItemText primary={point.name} />
                        </ListItem>
                    ))}
                </List>

                <Box sx={{ mt: 3, p: 2, bgcolor: '#fef3c7', borderRadius: 1 }}>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                        <AlertCircle size={20} color="#d97706" />
                        <Typography variant="body2" sx={{ color: '#92400e' }}>
                            <strong>Note:</strong> Cash vouchers are valid for 30 days from the date of issue.
                            The recipient will need the voucher code and PIN to collect cash.
                        </Typography>
                    </Box>
                </Box>
            </Paper>

            {/* Success Dialog */}
            <Dialog
                open={showSuccess}
                onClose={handleCloseSuccess}
                maxWidth="sm"
                fullWidth
            >
                <DialogTitle sx={{ bgcolor: '#10b981', color: 'white', display: 'flex', alignItems: 'center', gap: 1 }}>
                    <CheckCircle size={24} />
                    Cash Send Successful!
                </DialogTitle>
                <DialogContent sx={{ mt: 2 }}>
                    {cashSendResult && (
                        <Box>
                            <Typography variant="body1" sx={{ mb: 3 }}>
                                Cash has been sent to <strong>{cashSendResult.recipientName}</strong> ({cashSendResult.recipientPhone})
                            </Typography>

                            <Paper sx={{ p: 2, bgcolor: '#f3f4f6', mb: 2 }}>
                                <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                                    Voucher Code
                                </Typography>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                    <Typography variant="h6" fontWeight="bold" sx={{ fontFamily: 'monospace' }}>
                                        {cashSendResult.voucherCode}
                                    </Typography>
                                    <Button
                                        size="small"
                                        startIcon={<Copy size={16} />}
                                        onClick={() => copyToClipboard(cashSendResult.voucherCode, 'Voucher code')}
                                    >
                                        Copy
                                    </Button>
                                </Box>
                            </Paper>

                            <Paper sx={{ p: 2, bgcolor: '#f3f4f6', mb: 2 }}>
                                <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                                    PIN
                                </Typography>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                    <Typography variant="h6" fontWeight="bold" sx={{ fontFamily: 'monospace' }}>
                                        {cashSendResult.pin}
                                    </Typography>
                                    <Button
                                        size="small"
                                        startIcon={<Copy size={16} />}
                                        onClick={() => copyToClipboard(cashSendResult.pin, 'PIN')}
                                    >
                                        Copy
                                    </Button>
                                </Box>
                            </Paper>

                            <Box sx={{ mb: 2 }}>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                    <Typography variant="body2">Amount Sent</Typography>
                                    <Typography variant="body2" fontWeight="600">
                                        R {cashSendResult.amount.toFixed(2)}
                                    </Typography>
                                </Box>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                    <Typography variant="body2">Fee</Typography>
                                    <Typography variant="body2" fontWeight="600">
                                        R {cashSendResult.fee.toFixed(2)}
                                    </Typography>
                                </Box>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                    <Typography variant="body2">Remaining Balance</Typography>
                                    <Typography variant="body2" fontWeight="600" color="primary">
                                        R {cashSendResult.remainingBalance.toFixed(2)}
                                    </Typography>
                                </Box>
                            </Box>

                            <Chip
                                label={`Valid until ${new Date(cashSendResult.expiryDate).toLocaleDateString()}`}
                                color="info"
                                size="small"
                            />

                            <Box sx={{ mt: 3, p: 2, bgcolor: '#dbeafe', borderRadius: 1 }}>
                                <Typography variant="body2" sx={{ color: '#1e40af' }}>
                                    <strong>Important:</strong> Share the voucher code and PIN with the recipient.
                                    They can collect cash at Pick n Pay, Shoprite, Checkers, or any major bank ATM.
                                </Typography>
                            </Box>
                        </Box>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseSuccess} variant="contained" sx={{ bgcolor: '#1e3a8a' }}>
                        Done
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default CashSend;