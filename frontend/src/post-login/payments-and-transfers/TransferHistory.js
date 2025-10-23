import React, { useState, useEffect } from 'react';
import {
    Typography,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    Paper,
    CircularProgress,
    Alert,
    Box,
    Chip
} from '@mui/material';
import WithdrawService from '../../service/withdraw-service';

const TransferHistory = () => {
    const [transfers, setTransfers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchTransferHistory();
    }, []);

    const fetchTransferHistory = async () => {
        try {
            setLoading(true);
            const response = await WithdrawService.getHistory();

            if (response.data.success) {
                setTransfers(response.data.data || []);
            } else {
                setError('Failed to load transfer history');
            }
        } catch (err) {
            console.error('Error fetching transfer history:', err);
            setError('Failed to load transfer history');
        } finally {
            setLoading(false);
        }
    };

    const formatDate = (dateString) => {
        let date;

        if (Array.isArray(dateString)) {
            date = new Date(dateString[0], dateString[1] - 1, dateString[2],
                dateString[3] || 0, dateString[4] || 0, dateString[5] || 0);
        } else {
            date = new Date(dateString);
        }

        return date.toLocaleDateString('en-ZA', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'PROCESSED':
            case 'COMPLETED':
                return 'success';
            case 'PENDING':
            case 'APPROVED':
                return 'warning';
            case 'FAILED':
            case 'REJECTED':
            case 'CANCELLED':
                return 'error';
            default:
                return 'default';
        }
    };

    if (loading) {
        return (
            <Paper sx={{ p: 4, textAlign: 'center' }}>
                <CircularProgress />
                <Typography sx={{ mt: 2 }}>Loading transfer history...</Typography>
            </Paper>
        );
    }

    if (error) {
        return (
            <Paper sx={{ p: 2 }}>
                <Alert severity="error">{error}</Alert>
            </Paper>
        );
    }

    return (
        <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom sx={{ mb: 3, fontWeight: 600 }}>
                Transfer History
            </Typography>

            {transfers.length === 0 ? (
                <Box sx={{ p: 4, textAlign: 'center' }}>
                    <Typography color="text.secondary">No transfer history found</Typography>
                </Box>
            ) : (
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell><strong>Date</strong></TableCell>
                            <TableCell><strong>Account Type</strong></TableCell>
                            <TableCell><strong>Account Number</strong></TableCell>
                            <TableCell><strong>Amount</strong></TableCell>
                            <TableCell><strong>Fee</strong></TableCell>
                            <TableCell><strong>Total</strong></TableCell>
                            <TableCell><strong>Status</strong></TableCell>
                            <TableCell><strong>Reference</strong></TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {transfers.map((transfer) => (
                            <TableRow key={transfer.withdrawalId}>
                                <TableCell>{formatDate(transfer.createdAt)}</TableCell>
                                <TableCell>{transfer.accountType
                                    ?.replace(/_/g, ' ')}</TableCell>
                                <TableCell>
                                    {transfer.accountNumber || transfer.eNumber || 'N/A'}
                                </TableCell>
                                <TableCell>R {transfer.amount?.toFixed(2)}</TableCell>
                                <TableCell>R {transfer.fees?.toFixed(2)}</TableCell>
                                <TableCell><strong>R {transfer.totalAmount?.toFixed(2)}</strong></TableCell>
                                <TableCell>
                                    <Chip
                                        label={transfer.status}
                                        color={getStatusColor(transfer.status)}
                                        size="small"
                                    />
                                    {transfer.failureReason && (
                                        <Typography variant="caption" color="error" display="block">
                                            {transfer.failureReason}
                                        </Typography>
                                    )}
                                </TableCell>
                                <TableCell sx={{ fontFamily: 'monospace', fontSize: '0.85rem' }}>
                                    {transfer.transactionReference || 'N/A'}
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            )}
        </Paper>
    );
};

export default TransferHistory;