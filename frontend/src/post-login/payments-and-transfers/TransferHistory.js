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
        // Handle both array format [2025, 10, 1, 14, 7, 15] and ISO string
        let date;

        if (Array.isArray(dateString)) {
            // Array format from Java LocalDateTime
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
                            <TableCell><strong>Bank</strong></TableCell>
                            <TableCell><strong>Account Holder</strong></TableCell>
                            <TableCell><strong>Account Number</strong></TableCell>
                            <TableCell><strong>Amount</strong></TableCell>
                            <TableCell><strong>Status</strong></TableCell>
                            <TableCell><strong>Reference</strong></TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {transfers.map((transfer) => (
                            <TableRow key={transfer.id}>
                                <TableCell>{formatDate(transfer.createdAt)}</TableCell>
                                <TableCell>{transfer.bankName}</TableCell>
                                <TableCell>{transfer.accountHolderName}</TableCell>
                                <TableCell>****{transfer.accountNumber.slice(-4)}</TableCell>
                                <TableCell>R {transfer.amount.toFixed(2)}</TableCell>
                                <TableCell>
                                    <Chip
                                        label={transfer.status}
                                        color={getStatusColor(transfer.status)}
                                        size="small"
                                    />
                                </TableCell>
                                <TableCell sx={{ fontFamily: 'monospace', fontSize: '0.85rem' }}>
                                    {transfer.transactionReference}
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