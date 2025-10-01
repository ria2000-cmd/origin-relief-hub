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
    DialogActions,
    List,
    Chip,
    Card,
    CardContent
} from '@mui/material';
import {
    Zap,
    AlertCircle,
    CheckCircle,
    Copy,
    Activity,
    Calendar
} from 'lucide-react';
import ElectricityService from '../../service/electricity-service';
import SassaService from "../../service/sassa-service";

const BuyElectricity = () => {
    const [balance, setBalance] = useState(0);
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState('');
    const [error, setError] = useState('');
    const [showSuccess, setShowSuccess] = useState(false);
    const [purchaseResult, setPurchaseResult] = useState(null);
    const [calculatedUnits, setCalculatedUnits] = useState(0);
    const [purchaseHistory, setPurchaseHistory] = useState([]);
    const [sassaAccountId, setSassaAccountId] = useState(null);

    const [formData, setFormData] = useState({
        amount: '',
        meterNumber: '',
        municipality: ''
    });

    const municipalities = [
        'City of Johannesburg',
        'City of Cape Town',
        'City of Tshwane (Pretoria)',
        'eThekwini (Durban)',
        'Ekurhuleni',
        'Nelson Mandela Bay',
        'Buffalo City',
        'Mangaung',
        'Eskom',
        'City Power',
        'Other'
    ];

    const RATE_PER_KWH = 2.50;

    useEffect(() => {
        fetchBalance();
        fetchPurchaseHistory();
    }, []);

    useEffect(() => {
        if (formData.amount && parseFloat(formData.amount) > 0) {
            const units = parseFloat(formData.amount) / RATE_PER_KWH;
            setCalculatedUnits(units.toFixed(2));
        } else {
            setCalculatedUnits(0);
        }
    }, [formData.amount]);

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

    const fetchPurchaseHistory = async () => {
        try {
            const response = await ElectricityService.getPurchaseHistory(5);

            if (response.data.success) {
                setPurchaseHistory(response.data.data);
            }
        } catch (err) {
            console.error('Error fetching history:', err);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;

        if (name === 'meterNumber') {
            const cleaned = value.replace(/\D/g, '');
            setFormData(prev => ({ ...prev, [name]: cleaned }));
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }

        if (error) setError('');
    };

    const validateForm = () => {
        if (!formData.amount || parseFloat(formData.amount) <= 0) {
            setError('Please enter a valid amount');
            return false;
        }

        if (parseFloat(formData.amount) < 5) {
            setError('Minimum electricity purchase is R5.00');
            return false;
        }

        if (parseFloat(formData.amount) > 5000) {
            setError('Maximum electricity purchase is R5,000.00');
            return false;
        }

        if (parseFloat(formData.amount) > balance) {
            setError(`Insufficient balance. Available: R${balance.toFixed(2)}`);
            return false;
        }

        if (!formData.meterNumber || formData.meterNumber.length < 11) {
            setError('Please enter a valid meter number (minimum 11 digits)');
            return false;
        }

        if (!formData.municipality) {
            setError('Please select your municipality');
            return false;
        }

        return true;
    };

    const handlePurchase = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        if (!validateForm()) {
            return;
        }

        setLoading(true);

        try {
            const response = await ElectricityService.purchaseElectricity({
                amount: parseFloat(formData.amount),
                meterNumber: formData.meterNumber,
                municipality: formData.municipality
            });

            if (response.data.success) {
                setPurchaseResult(response.data.data);
                setShowSuccess(true);
                setBalance(response.data.data.remainingBalance);

                // Clear form
                setFormData({
                    amount: '',
                    meterNumber: '',
                    municipality: ''
                });

                // Refresh history
                fetchPurchaseHistory();
            }

        } catch (err) {
            console.error('Electricity purchase error:', err);
            setError(err.response?.data?.message || 'Purchase failed. Please try again.');
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
        setPurchaseResult(null);
    };

    return (
        <Box sx={{ p: 3, mt: { xs: 8, md: 0 }, minHeight: '100vh', bgcolor: 'background.default' }}>
            <Typography variant="h4" fontWeight="bold" sx={{ color: '#facc15', mb: 1 }}>
                Buy Electricity
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
                Purchase prepaid electricity instantly
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

            {/* Purchase Form */}
            <Paper sx={{ p: 4, borderRadius: 3, mb: 3 }}>
                <form onSubmit={handlePurchase}>
                    <Typography variant="h6" fontWeight="600" sx={{ mb: 3 }}>
                        Purchase Details
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
                        inputProps={{ min: 5, max: 5000, step: 1 }}
                        InputProps={{
                            startAdornment: <InputAdornment position="start">R</InputAdornment>,
                        }}
                        sx={{ mb: 2 }}
                        helperText="Minimum: R5 | Maximum: R5,000"
                    />

                    {/* Units Display */}
                    {formData.amount && (
                        <Box sx={{ mb: 3, p: 2, bgcolor: '#ecfdf5', borderRadius: 1, border: '1px solid #10b981' }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                    <Zap size={20} color="#10b981" />
                                    <Typography variant="body2" color="text.secondary">
                                        You will receive
                                    </Typography>
                                </Box>
                                <Typography variant="h6" fontWeight="bold" color="#10b981">
                                    {calculatedUnits} kWh
                                </Typography>
                            </Box>
                            <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                                Current rate: R{RATE_PER_KWH.toFixed(2)} per kWh
                            </Typography>
                        </Box>
                    )}

                    <Divider sx={{ my: 3 }} />

                    {/* Meter Number */}
                    <TextField
                        fullWidth
                        label="Meter Number"
                        name="meterNumber"
                        value={formData.meterNumber}
                        onChange={handleInputChange}
                        required
                        disabled={loading}
                        inputProps={{ maxLength: 20 }}
                        helperText="Enter your 11-20 digit prepaid meter number"
                        sx={{ mb: 3 }}
                    />

                    {/* Municipality */}
                    <FormControl fullWidth sx={{ mb: 4 }}>
                        <InputLabel>Municipality / Supplier</InputLabel>
                        <Select
                            name="municipality"
                            value={formData.municipality}
                            onChange={handleInputChange}
                            label="Municipality / Supplier"
                            required
                            disabled={loading}
                        >
                            {municipalities.map((muni) => (
                                <MenuItem key={muni} value={muni}>
                                    {muni}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>

                    {/* Submit Button */}
                    <Button
                        type="submit"
                        variant="contained"
                        fullWidth
                        size="large"
                        disabled={loading || balance === 0}
                        startIcon={loading ? <CircularProgress size={20} /> : <Zap size={20} />}
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
                        {loading ? 'Processing Purchase...' : 'Buy Electricity'}
                    </Button>
                </form>

                {/* Information Notice */}
                <Box sx={{ mt: 3, p: 2, bgcolor: '#fef3c7', borderRadius: 1 }}>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                        <AlertCircle size={20} color="#d97706" />
                        <Typography variant="body2" sx={{ color: '#92400e' }}>
                            <strong>Note:</strong> Your electricity token will be generated instantly.
                            Tokens are valid for 7 days. Please enter the token on your prepaid meter as soon as possible.
                        </Typography>
                    </Box>
                </Box>
            </Paper>

            {/* Recent Purchases */}
            {purchaseHistory.length > 0 && (
                <Paper sx={{ p: 4, borderRadius: 3 }}>
                    <Typography variant="h6" fontWeight="600" sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Activity size={24} color="#1e3a8a" />
                        Recent Purchases
                    </Typography>

                    <List>
                        {purchaseHistory.map((purchase, index) => (
                            <Card key={index} sx={{ mb: 2 }}>
                                <CardContent>
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                        <Typography variant="body2" color="text.secondary">
                                            {new Date(purchase.createdAt).toLocaleDateString()} at {new Date(purchase.createdAt).toLocaleTimeString()}
                                        </Typography>
                                        <Chip
                                            label={purchase.status}
                                            color="success"
                                            size="small"
                                        />
                                    </Box>
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <Box>
                                            <Typography variant="body1" fontWeight="600">
                                                R {purchase.amount.toFixed(2)}
                                            </Typography>
                                            <Typography variant="body2" color="text.secondary">
                                                {purchase.units.toFixed(2)} kWh | Meter: {purchase.meterNumber}
                                            </Typography>
                                        </Box>
                                        <Typography variant="caption" color="text.secondary">
                                            {purchase.municipality}
                                        </Typography>
                                    </Box>
                                </CardContent>
                            </Card>
                        ))}
                    </List>
                </Paper>
            )}

            {/* Success Dialog */}
            <Dialog
                open={showSuccess}
                onClose={handleCloseSuccess}
                maxWidth="sm"
                fullWidth
            >
                <DialogTitle sx={{ bgcolor: '#10b981', color: 'white', display: 'flex', alignItems: 'center', gap: 1 }}>
                    <CheckCircle size={24} />
                    Electricity Purchase Successful!
                </DialogTitle>
                <DialogContent sx={{ mt: 2 }}>
                    {purchaseResult && (
                        <Box>
                            <Typography variant="body1" sx={{ mb: 3 }}>
                                Your electricity has been purchased successfully!
                            </Typography>

                            {/* Token Display */}
                            <Paper sx={{ p: 3, mb: 3, bgcolor: '#f0fdf4', border: '2px solid #10b981' }}>
                                <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                                    Electricity Token
                                </Typography>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                                    <Typography
                                        variant="h5"
                                        fontWeight="bold"
                                        sx={{ fontFamily: 'monospace', letterSpacing: 2 }}
                                    >
                                        {purchaseResult.token}
                                    </Typography>
                                    <Button
                                        size="small"
                                        startIcon={<Copy size={16} />}
                                        onClick={() => copyToClipboard(purchaseResult.token.replace(/-/g, ''), 'Token')}
                                    >
                                        Copy
                                    </Button>
                                </Box>
                                <Typography variant="caption" color="text.secondary">
                                    Enter this 20-digit token on your prepaid meter
                                </Typography>
                            </Paper>

                            {/* Purchase Details */}
                            <Box sx={{ mb: 2 }}>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                    <Typography variant="body2">Amount Paid</Typography>
                                    <Typography variant="body2" fontWeight="600">
                                        R {purchaseResult.amount.toFixed(2)}
                                    </Typography>
                                </Box>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                    <Typography variant="body2">Units Purchased</Typography>
                                    <Typography variant="body2" fontWeight="600" color="#10b981">
                                        {purchaseResult.units.toFixed(2)} kWh
                                    </Typography>
                                </Box>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                    <Typography variant="body2">Meter Number</Typography>
                                    <Typography variant="body2" fontWeight="600">
                                        {purchaseResult.meterNumber}
                                    </Typography>
                                </Box>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                    <Typography variant="body2">Remaining Balance</Typography>
                                    <Typography variant="body2" fontWeight="600" color="primary">
                                        R {purchaseResult.remainingBalance.toFixed(2)}
                                    </Typography>
                                </Box>
                            </Box>

                            <Chip
                                icon={<Calendar size={16} />}
                                label={`Valid until ${new Date(purchaseResult.tokenExpiryDate).toLocaleDateString()}`}
                                color="info"
                                size="small"
                                sx={{ mb: 2 }}
                            />

                            <Box sx={{ mt: 3, p: 2, bgcolor: '#dbeafe', borderRadius: 1 }}>
                                <Typography variant="body2" sx={{ color: '#1e40af' }}>
                                    <strong>How to use your token:</strong>
                                    <br />
                                    1. Enter the 20-digit token on your prepaid meter keypad
                                    <br />
                                    2. Press "Enter" or the accept button
                                    <br />
                                    3. Your units will be loaded instantly
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

export default BuyElectricity;