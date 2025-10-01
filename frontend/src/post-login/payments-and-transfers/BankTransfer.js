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
    Divider
} from '@mui/material';
import {
    CreditCard,
    AlertCircle,
} from 'lucide-react';
import SassaService from '../../service/sassa-service';

const BankTransfer = () => {
    const [balance, setBalance] = useState(0);
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState('');
    const [error, setError] = useState('');
    const [sassaAccountId, setSassaAccountId] = useState(null);

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
            const accountResponse = await SassaService.getActiveSassaAccount();

            if (accountResponse.data && accountResponse.data?.sassaAccountId) {
                const sassaId = accountResponse.data?.sassaAccountId;
                setSassaAccountId(sassaId);

                const balanceResponse = await SassaService.getBalanceBySassaId(sassaId);

                if (balanceResponse.data.success) {
                    setBalance(balanceResponse.data.data);
                }
            } else {
                setBalance(0);
                setError('No active SASSA account found. Please link your SASSA account first.');
            }
        } catch (err) {
            console.error('Error fetching balance:', err);
            if (err.response?.status === 404) {
                setError('No active SASSA account found. Please link your SASSA account first.');
            } else {
                setError('Failed to load balance');
            }
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
            const token = localStorage.getItem('token');
            const response = await axios.post(
                'http://localhost:8080/api/withdrawals/withdraw',
                {
                    amount: parseFloat(formData.amount),
                    bankName: formData.bankName,
                    accountNumber: formData.accountNumber,
                    accountHolderName: formData.accountHolderName,
                    accountType: formData.accountType,
                    reference: formData.reference || null
                },
                {
                    headers: { Authorization: `Bearer ${token}` }
                }
            );

            if (response.data.success) {
                setSuccess(
                    `Withdrawal successful! Transaction Reference: ${response.data.data.transactionReference}. ` +
                    `Remaining balance: R${response.data.data.remainingBalance.toFixed(2)}`
                );

                // Update balance
                setBalance(response.data.data.remainingBalance);

                // Clear form
                setFormData({
                    amount: '',
                    bankName: '',
                    accountNumber: '',
                    accountHolderName: '',
                    accountType: 'SAVINGS',
                    reference: ''
                });
            }

        } catch (err) {
            console.error('Withdrawal error:', err);
            setError(err.response?.data?.message || 'Withdrawal failed. Please try again.');
        } finally {
            setLoading(false);
        }
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
                    {/*<DollarSign size={48} />*/}
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
        </Box>
    );
};

export default BankTransfer;