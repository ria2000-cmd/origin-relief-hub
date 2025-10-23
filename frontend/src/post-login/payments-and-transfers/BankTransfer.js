import React, { useState, useEffect } from 'react';
import {
    Box,
    Typography,
    Paper,
    TextField,
    Button,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
    Alert,
    CircularProgress,
    InputAdornment,
    Divider,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions
} from '@mui/material';
import {
    CreditCard,
    AlertCircle,
    CheckCircle
} from 'lucide-react';
import SassaService from '../../service/sassa-service';
import WithdrawService from '../../service/withdraw-service';

const BankTransfer = () => {
    const [balance, setBalance] = useState(0);
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState('');
    const [error, setError] = useState('');
    const [showSuccess, setShowSuccess] = useState(false);
    const [withdrawalResult, setWithdrawalResult] = useState(null);

    const [formData, setFormData] = useState({
        amount: '',
        bankName: '',
        accountNumber: '',
        accountHolderName: '',
        accountType: 'SAVINGS',
        reference: ''
    });

    const banks = [
        'ABSA Bank',
        'Standard Bank',
        'FNB (First National Bank)',
        'Nedbank',
        'Capitec Bank',
        'Investec',
        'African Bank',
        'Bidvest Bank',
        'Discovery Bank',
        'TymeBank'
    ];

    useEffect(() => {
        fetchBalance();
    }, []);

    const fetchBalance = async () => {
        try {
            const result = await SassaService.getUserBalance();
            console.log('result', result)

            if (result && result.data.balance !== undefined) {
                setBalance(result.data.balance);
            } else if (result.data && result.data.balance !== undefined) {
                setBalance(result.data.balance);
            } else {
                setBalance(0);
                setError('Failed to load balance');
            }
        } catch (err) {
            console.error('Error fetching balance:', err);
            setError('Failed to load balance');
            setBalance(0);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));

        if (error) setError('');
    };

    const validateForm = () => {
        if (!formData.amount || parseFloat(formData.amount) <= 0) {
            setError('Please enter a valid amount');
            return false;
        }

        if (parseFloat(formData.amount) < 10) {
            setError('Minimum withdrawal amount is R10.00');
            return false;
        }

        if (parseFloat(formData.amount) > balance) {
            setError(`Insufficient balance. Available: R${balance.toFixed(2)}`);
            return false;
        }

        if (!formData.bankName) {
            setError('Please select a bank');
            return false;
        }

        if (!formData.accountNumber || !/^\d{8,12}$/.test(formData.accountNumber)) {
            setError('Account number must be 8-12 digits');
            return false;
        }

        if (!formData.accountHolderName || formData.accountHolderName.trim().length < 3) {
            setError('Please enter account holder name');
            return false;
        }

        return true;
    };

    const handleWithdraw = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        if (!validateForm()) {
            return;
        }

        setLoading(true);

        try {
            const response = await WithdrawService.withdraw({
                amount: parseFloat(formData.amount),
                bankName: formData.bankName,
                accountNumber: formData.accountNumber,
                accountHolderName: formData.accountHolderName,
                accountType: formData.accountType,
                reference: formData.reference || null
            });

            console.log('Withdrawal response:', response.data);

            if (response.data.success) {
                // Access the nested data object
                const withdrawalData = response.data.data;
                const amount = parseFloat(formData.amount);

                // Calculate remaining balance (fallback to current balance minus amount)
                const remainingBalance = withdrawalData?.remainingBalance ??
                    (balance - amount);

                // Get transaction reference
                const transactionRef = withdrawalData?.transactionReference ||
                    withdrawalData?.referenceNumber ||
                    `WTX${Date.now()}`;

                setWithdrawalResult({
                    transactionReference: transactionRef,
                    amount: amount,
                    remainingBalance: remainingBalance,
                    bankName: formData.bankName,
                    accountNumber: formData.accountNumber,
                    accountHolderName: formData.accountHolderName
                });

                setShowSuccess(true);
                setBalance(remainingBalance);

                // Clear form
                setFormData({
                    amount: '',
                    bankName: '',
                    accountNumber: '',
                    accountHolderName: '',
                    accountType: 'SAVINGS',
                    reference: ''
                });

                // Refresh balance from server after 2 seconds
                setTimeout(() => fetchBalance(), 2000);
            } else {
                setError(response.data.message || 'Withdrawal failed');
            }

        } catch (err) {
            console.error('Withdrawal error:', err);
            setError(err.response?.data?.message || 'Withdrawal failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleCloseSuccess = () => {
        setShowSuccess(false);
        setWithdrawalResult(null);
    };

    return (
        <Box sx={{ p: 3, mt: { xs: 8, md: 0 }, minHeight: '100vh', bgcolor: 'background.default' }}>
            <Typography variant="h4" fontWeight="bold" sx={{ color: '#facc15', mb: 1 }}>
                Withdraw Funds
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
                Transfer your available balance to your bank account
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

            {/* Withdrawal Form */}
            <Paper sx={{ p: 4, borderRadius: 3 }}>
                <form onSubmit={handleWithdraw}>
                    <Typography variant="h6" fontWeight="600" sx={{ mb: 3 }}>
                        Withdrawal Details
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
                        inputProps={{ min: 10, step: 0.01 }}
                        InputProps={{
                            startAdornment: <InputAdornment position="start">R</InputAdornment>,
                        }}
                        sx={{ mb: 3 }}
                        helperText={`Minimum: R10.00 | Available: R${balance.toFixed(2)}`}
                    />

                    <Divider sx={{ my: 3 }} />

                    <Typography variant="h6" fontWeight="600" sx={{ mb: 3 }}>
                        Bank Details
                    </Typography>

                    {/* Bank Selection */}
                    <FormControl fullWidth sx={{ mb: 3 }}>
                        <InputLabel>Select Bank</InputLabel>
                        <Select
                            name="bankName"
                            value={formData.bankName}
                            onChange={handleInputChange}
                            label="Select Bank"
                            required
                            disabled={loading}
                        >
                            {banks.map((bank) => (
                                <MenuItem key={bank} value={bank}>
                                    {bank}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>

                    {/* Account Holder Name */}
                    <TextField
                        fullWidth
                        label="Account Holder Name"
                        name="accountHolderName"
                        value={formData.accountHolderName}
                        onChange={handleInputChange}
                        required
                        disabled={loading}
                        sx={{ mb: 3 }}
                    />

                    {/* Account Number */}
                    <TextField
                        fullWidth
                        label="Account Number"
                        name="accountNumber"
                        value={formData.accountNumber}
                        onChange={handleInputChange}
                        required
                        disabled={loading}
                        inputProps={{ pattern: '\\d{8,12}' }}
                        helperText="Enter 8-12 digit account number"
                        sx={{ mb: 3 }}
                    />

                    {/* Account Type */}
                    <FormControl fullWidth sx={{ mb: 3 }}>
                        <InputLabel>Account Type</InputLabel>
                        <Select
                            name="accountType"
                            value={formData.accountType}
                            onChange={handleInputChange}
                            label="Account Type"
                            required
                            disabled={loading}
                        >
                            <MenuItem value="SAVINGS">Savings Account</MenuItem>
                            <MenuItem value="CURRENT">Current Account</MenuItem>
                            <MenuItem value="CHEQUE">Cheque Account</MenuItem>
                        </Select>
                    </FormControl>

                    {/* Optional Reference */}
                    <TextField
                        fullWidth
                        label="Reference (Optional)"
                        name="reference"
                        value={formData.reference}
                        onChange={handleInputChange}
                        disabled={loading}
                        helperText="Add a note for your records"
                        sx={{ mb: 4 }}
                    />

                    {/* Submit Button */}
                    <Button
                        type="submit"
                        variant="contained"
                        fullWidth
                        size="large"
                        disabled={loading || balance === 0}
                        startIcon={loading ? <CircularProgress size={20} /> : <CreditCard size={20} />}
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
                        {loading ? 'Processing Withdrawal...' : 'Withdraw Funds'}
                    </Button>
                </form>

                {/* Information Notice */}
                <Box sx={{ mt: 3, p: 2, bgcolor: '#fef3c7', borderRadius: 1 }}>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                        <AlertCircle size={20} color="#d97706" />
                        <Typography variant="body2" sx={{ color: '#92400e' }}>
                            <strong>Note:</strong> Withdrawals are processed within 1-3 business days.
                            Please ensure your bank details are correct before submitting.
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
                    Withdrawal Successful!
                </DialogTitle>
                <DialogContent sx={{ mt: 2 }}>
                    {withdrawalResult && (
                        <Box>
                            <Typography variant="body1" sx={{ mb: 3 }}>
                                Your withdrawal has been processed successfully
                            </Typography>

                            <Paper sx={{ p: 2, bgcolor: '#f3f4f6', mb: 2 }}>
                                <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                                    Transaction Reference
                                </Typography>
                                <Typography variant="h6" fontWeight="bold" sx={{ fontFamily: 'monospace' }}>
                                    {withdrawalResult.transactionReference}
                                </Typography>
                            </Paper>

                            <Box sx={{ mb: 2 }}>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                    <Typography variant="body2">Amount Withdrawn</Typography>
                                    <Typography variant="body2" fontWeight="600">
                                        R {withdrawalResult.amount.toFixed(2)}
                                    </Typography>
                                </Box>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                    <Typography variant="body2">Bank</Typography>
                                    <Typography variant="body2" fontWeight="600">
                                        {withdrawalResult.bankName}
                                    </Typography>
                                </Box>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                    <Typography variant="body2">Account Holder</Typography>
                                    <Typography variant="body2" fontWeight="600">
                                        {withdrawalResult.accountHolderName}
                                    </Typography>
                                </Box>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                    <Typography variant="body2">Account Number</Typography>
                                    <Typography variant="body2" fontWeight="600">
                                        ****{withdrawalResult.accountNumber.slice(-4)}
                                    </Typography>
                                </Box>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                    <Typography variant="body2">Remaining Balance</Typography>
                                    <Typography variant="body2" fontWeight="600" color="primary">
                                        R {withdrawalResult.remainingBalance.toFixed(2)}
                                    </Typography>
                                </Box>
                            </Box>

                            <Box sx={{ mt: 3, p: 2, bgcolor: '#dbeafe', borderRadius: 1 }}>
                                <Typography variant="body2" sx={{ color: '#1e40af' }}>
                                    <strong>Processing Time:</strong> Your withdrawal will be processed within 1-3 business days.
                                    Please keep your transaction reference for your records.
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

export default BankTransfer;