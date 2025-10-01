import React, { useState, useEffect } from 'react';
import { Typography, Table, TableBody, TableCell, TableHead, TableRow, Paper, CircularProgress, Alert } from '@mui/material';
import CashSendService from '../../service/cash-send-service';
import ElectricityService from '../../service/electricity-service';

const PaymentHistory = () => {
    const [payments, setPayments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchPaymentHistory();
    }, []);

    // Helper function to convert timestamp array to Date
    const parseTimestamp = (timestamp) => {
        if (Array.isArray(timestamp)) {
            // timestamp format: [year, month, day, hour, minute, second]
            // Note: JavaScript months are 0-indexed, so subtract 1 from month
            return new Date(timestamp[0], timestamp[1] - 1, timestamp[2],
                timestamp[3], timestamp[4], timestamp[5]);
        }
        return new Date(timestamp);
    };

    const fetchPaymentHistory = async () => {
        try {
            setLoading(true);

            // Fetch both electricity and cash send histories
            const [electricityResponse, cashSendResponse] = await Promise.all([
                ElectricityService.electricityHistory(),
                CashSendService.cashSendHistory()
            ]);

            const electricityData = electricityResponse.data;
            const cashSendData = cashSendResponse.data;

            const combinedPayments = [
                ...electricityData.map(item => ({
                    id: item.transactionReference || item.referenceNumber,
                    date: parseTimestamp(item.timestamp).toLocaleDateString(),
                    type: 'Electricity',
                    amount: item.amount,
                    reference: item.transactionReference || item.referenceNumber,
                    timestamp: parseTimestamp(item.timestamp)
                })),
                ...cashSendData.map(item => ({
                    id: item.transactionReference || item.referenceNumber,
                    date: parseTimestamp(item.timestamp).toLocaleDateString(),
                    type: 'Cash Send',
                    amount: item.amount,
                    reference: item.transactionReference || item.referenceNumber,
                    timestamp: parseTimestamp(item.timestamp)
                }))
            ];

            combinedPayments.sort((a, b) => b.timestamp - a.timestamp);

            setPayments(combinedPayments);
            setError(null);
        } catch (err) {
            setError('Failed to load payment history. Please try again.');
            console.error('Error fetching payment history:', err);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <Paper sx={{ p: 2, display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 200 }}>
                <CircularProgress />
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
            <Typography variant="h6" gutterBottom>Payment History</Typography>
            {payments.length === 0 ? (
                <Typography variant="body2" color="text.secondary" sx={{ p: 2 }}>
                    No payment history available.
                </Typography>
            ) : (
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Date</TableCell>
                            <TableCell>Type</TableCell>
                            <TableCell>Amount (ZAR)</TableCell>
                            <TableCell>Reference</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {payments.map(row => (
                            <TableRow key={row.id}>
                                <TableCell>{row.date}</TableCell>
                                <TableCell>{row.type}</TableCell>
                                <TableCell>{row.amount}</TableCell>
                                <TableCell>{row.reference}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            )}
        </Paper>
    );
};

export default PaymentHistory;