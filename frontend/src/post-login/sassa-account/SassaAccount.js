import React, { useState, useEffect } from 'react';
import { Box, Typography, Paper, Alert, Grid, Chip, Button } from '@mui/material';
import { Calendar, CreditCard, CheckCircle, Plus, Unlink } from 'lucide-react';
import SassaLinkForm from './SassaLinkForm';
import SassaService from '../../service/sassa-service';

const SassaAccount = ({ user }) => {
    const [linkedAccount, setLinkedAccount] = useState(null);
    const [statusMessage, setStatusMessage] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [showLinkForm, setShowLinkForm] = useState(false);

    useEffect(() => {
        fetchActiveSassaAccount();
    }, []);

    const fetchActiveSassaAccount = async () => {
        try {
            const response = await SassaService.getActiveSassaAccount();
            setLinkedAccount(response.data);
        } catch (err) {
            if (err.response?.status === 404) {
                setLinkedAccount(null);
                setShowLinkForm(true); // Auto-show form if no account
            } else {
                console.error('Error fetching active SASSA account:', err);
            }
        }
    };

    const handleLinkAccount = async (accountData) => {
        setError('');
        setStatusMessage('');
        setLoading(true);

        try {
            const response = await SassaService.linkSassaAccount(accountData);

            if (response.data.success) {
                setStatusMessage(response.data.message || 'SASSA account linked successfully!');
                setShowLinkForm(false);
                await fetchActiveSassaAccount();
            } else {
                setError(response.data.message || 'Failed to link SASSA account.');
            }
        } catch (err) {
            console.error('Error linking SASSA account:', err);
            setError(err.response?.data?.message || 'An unexpected error occurred. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleUnlinkAccount = async () => {
        if (!window.confirm('Are you sure you want to unlink this SASSA account?')) {
            return;
        }

        setError('');
        setStatusMessage('');
        setLoading(true);

        try {
            await SassaService.unlinkSassaAccount(linkedAccount.sassaAccountId);
            setStatusMessage('SASSA account successfully unlinked');
            setLinkedAccount(null);
            setShowLinkForm(true);
        } catch (err) {
            console.error('Error unlinking SASSA account:', err);
            setError(err.response?.data?.message || 'Failed to unlink SASSA account');
        } finally {
            setLoading(false);
        }
    };

    const formatDate = (dateArray) => {
        if (!dateArray || dateArray.length < 3) return 'N/A';
        const [year, month, day] = dateArray;
        return new Date(year, month - 1, day).toLocaleDateString('en-ZA', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const getGrantTypeDisplay = (grantType) => {
        const grantTypes = {
            'CHILD_SUPPORT': 'Child Support Grant',
            'OLD_AGE': 'Old Age Grant',
            'DISABILITY': 'Disability Grant',
            'SRD': 'Social Relief of Distress',
            'FOSTER_CARE': 'Foster Care Grant',
            'CARE_DEPENDENCY': 'Care Dependency Grant',
            'WAR_VETERANS': 'War Veterans Grant'
        };
        return grantTypes[grantType] || grantType;
    };

    return (
        <Box sx={{ p: 3, mt: { xs: 8, md: 0 }, minHeight: '100vh', bgcolor: '#f8fafc' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                <Typography variant="h4" fontWeight="bold" sx={{ color: '#facc15' }}>
                    SASSA Account
                </Typography>
                {linkedAccount && !showLinkForm && (
                    <Button
                        variant="outlined"
                        startIcon={<Plus size={20} />}
                        onClick={() => setShowLinkForm(true)}
                        sx={{
                            textTransform: 'none',
                            borderColor: '#facc15',
                            color: '#facc15',
                            '&:hover': {
                                borderColor: '#eab308',
                                bgcolor: '#fef3c7'
                            }
                        }}
                    >
                        Link Another Account
                    </Button>
                )}
            </Box>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
                Link your national ID to your SASSA grant account for eligibility and payment syncing.
            </Typography>

            {error && <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError('')}>{error}</Alert>}
            {statusMessage && <Alert severity="success" sx={{ mb: 3 }} onClose={() => setStatusMessage('')}>{statusMessage}</Alert>}

            {/* Link Form */}
            {showLinkForm && (
                <Paper sx={{ p: 3, borderRadius: 3, boxShadow: 3, mb: 3 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                        <Typography variant="h6" fontWeight="600">
                            Link SASSA Account
                        </Typography>
                        {linkedAccount && (
                            <Button
                                size="small"
                                onClick={() => setShowLinkForm(false)}
                                sx={{ textTransform: 'none' }}
                            >
                                Cancel
                            </Button>
                        )}
                    </Box>
                    <SassaLinkForm
                        user={user}
                        onLinkAccount={handleLinkAccount}
                        loading={loading}
                    />
                </Paper>
            )}

            {/* Display Linked Account */}
            {linkedAccount && (
                <Paper sx={{ p: 4, borderRadius: 3, boxShadow: 3 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                        <Typography variant="h5" fontWeight="bold">
                            Your Linked SASSA Account
                        </Typography>
                        <Chip
                            label={linkedAccount.status}
                            color={linkedAccount.status === 'ACTIVE' ? 'success' : 'default'}
                            icon={<CheckCircle size={16} />}
                        />
                    </Box>

                    <Grid container spacing={3}>
                        {/* Account Number */}
                        <Grid item xs={12} md={6}>
                            <Box sx={{ p: 2, bgcolor: '#f3f4f6', borderRadius: 2 }}>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                                    <CreditCard size={20} color="#1e3a8a" />
                                    <Typography variant="body2" color="text.secondary">
                                        Account Number
                                    </Typography>
                                </Box>
                                <Typography variant="h6" fontWeight="600">
                                    {linkedAccount.accountNumber}
                                </Typography>
                            </Box>
                        </Grid>

                        {/* Grant Type */}
                        <Grid item xs={12} md={6}>
                            <Box sx={{ p: 2, bgcolor: '#f3f4f6', borderRadius: 2 }}>
                                <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                                    Grant Type
                                </Typography>
                                <Typography variant="h6" fontWeight="600">
                                    {getGrantTypeDisplay(linkedAccount.grantType)}
                                </Typography>
                            </Box>
                        </Grid>

                        {/* Monthly Amount */}
                        <Grid item xs={12} md={6}>
                            <Box sx={{ p: 2, bgcolor: '#ecfdf5', borderRadius: 2, border: '1px solid #10b981' }}>
                                <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                                    Monthly Amount
                                </Typography>
                                <Typography variant="h5" fontWeight="bold" color="#10b981">
                                    R {linkedAccount.monthlyAmount.toFixed(2)}
                                </Typography>
                            </Box>
                        </Grid>

                        {/* Next Payment Date */}
                        <Grid item xs={12} md={6}>
                            <Box sx={{ p: 2, bgcolor: '#dbeafe', borderRadius: 2, border: '1px solid #3b82f6' }}>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                                    <Calendar size={20} color="#3b82f6" />
                                    <Typography variant="body2" color="text.secondary">
                                        Next Payment Date
                                    </Typography>
                                </Box>
                                <Typography variant="h6" fontWeight="600" color="#3b82f6">
                                    {formatDate(linkedAccount.nextPaymentDate)}
                                </Typography>
                            </Box>
                        </Grid>

                        {/* ID Number */}
                        <Grid item xs={12} md={6}>
                            <Box sx={{ p: 2, bgcolor: '#f3f4f6', borderRadius: 2 }}>
                                <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                                    ID Number
                                </Typography>
                                <Typography variant="body1" fontWeight="600">
                                    {linkedAccount.idNumber}
                                </Typography>
                            </Box>
                        </Grid>

                        {/* Verification Date */}
                        <Grid item xs={12} md={6}>
                            <Box sx={{ p: 2, bgcolor: '#f3f4f6', borderRadius: 2 }}>
                                <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                                    Verification Date
                                </Typography>
                                <Typography variant="body1" fontWeight="600">
                                    {formatDate(linkedAccount.verificationDate)}
                                </Typography>
                            </Box>
                        </Grid>
                    </Grid>

                    {linkedAccount.accountNotes && (
                        <Box sx={{ mt: 3, p: 2, bgcolor: '#fef3c7', borderRadius: 2 }}>
                            <Typography variant="body2" color="#92400e">
                                <strong>Notes:</strong> {linkedAccount.accountNotes}
                            </Typography>
                        </Box>
                    )}

                    <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
                        <Button
                            variant="outlined"
                            color="error"
                            startIcon={<Unlink size={20} />}
                            onClick={handleUnlinkAccount}
                            disabled={loading}
                            sx={{ textTransform: 'none' }}
                        >
                            Unlink Account
                        </Button>
                    </Box>
                </Paper>
            )}
        </Box>
    );
};

export default SassaAccount;