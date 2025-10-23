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
                timestamp[3] || 0, timestamp[4] || 0, timestamp[5] || 0);
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

            console.log('Electricity response:', electricityResponse);
            console.log('Cash send response:', cashSendResponse);
            console.log('Electricity response.data:', electricityResponse.data);
            console.log('Cash send response.data:', cashSendResponse.data);

            // Parse electricity data - handle multiple response structures
            let electricityData = [];

            // Check if response.data is directly an array
            if (Array.isArray(electricityResponse.data)) {
                electricityData = electricityResponse.data;
            }
            // Check if it's a string that needs parsing
            else if (typeof electricityResponse.data === 'string') {
                try {
                    const parsed = JSON.parse(electricityResponse.data);
                    electricityData = Array.isArray(parsed) ? parsed : (parsed.data || []);
                } catch (e) {
                    console.error('Failed to parse electricity response:', e);
                }
            }
            // Check if it's an object with success flag and nested data
            else if (electricityResponse.data?.success && electricityResponse.data?.data) {
                electricityData = Array.isArray(electricityResponse.data.data)
                    ? electricityResponse.data.data
                    : [];
            }
            // Check if the response itself has data property
            else if (electricityResponse.data?.data) {
                electricityData = Array.isArray(electricityResponse.data.data)
                    ? electricityResponse.data.data
                    : [];
            }

            // Parse cash send data - handle multiple response structures
            let cashSendData = [];

            // Check if response.data is directly an array
            if (Array.isArray(cashSendResponse.data)) {
                cashSendData = cashSendResponse.data;
            }
            // Check if it's a string that needs parsing
            else if (typeof cashSendResponse.data === 'string') {
                try {
                    const parsed = JSON.parse(cashSendResponse.data);
                    cashSendData = Array.isArray(parsed) ? parsed : (parsed.data || []);
                } catch (e) {
                    console.error('Failed to parse cash send response:', e);
                }
            }
            // Check if it's an object with success flag and nested data
            else if (cashSendResponse.data?.success && cashSendResponse.data?.data) {
                cashSendData = Array.isArray(cashSendResponse.data.data)
                    ? cashSendResponse.data.data
                    : [];
            }
            // Check if the response itself has data property
            else if (cashSendResponse.data?.data) {
                cashSendData = Array.isArray(cashSendResponse.data.data)
                    ? cashSendResponse.data.data
                    : [];
            }

            console.log('Parsed electricity data:', electricityData);
            console.log('Parsed cash send data:', cashSendData);

            const combinedPayments = [
                ...electricityData.map(item => {
                    console.log('Mapping electricity item:', item);
                    return {
                        id: item.electricityId || item.electricityPurchaseId || item.transactionId || `elec-${Math.random()}`,
                        date: parseTimestamp(item.timestamp || item.createdAt || item.purchaseDate || new Date()).toLocaleDateString(),
                        type: 'Electricity',
                        amount: item.amount || item.totalCost || 0,
                        reference: item.transactionReference || item.referenceNumber || item.voucherCode || 'N/A',
                        timestamp: parseTimestamp(item.timestamp || item.createdAt || item.purchaseDate || new Date()),
                        details: item // Store full item for debugging
                    };
                }),
                ...cashSendData.map(item => {
                    console.log('Mapping cash send item:', item);
                    return {
                        id: item.cashSendId || item.transactionId || `cash-${Math.random()}`,
                        date: parseTimestamp(item.timestamp || item.createdAt || new Date()).toLocaleDateString(),
                        type: 'Cash Send',
                        amount: item.amount || 0,
                        reference: item.transactionReference || item.voucherCode || 'N/A',
                        timestamp: parseTimestamp(item.timestamp || item.createdAt || new Date()),
                        details: item // Store full item for debugging
                    };
                })
            ];

            // Sort by timestamp (newest first)
            combinedPayments.sort((a, b) => b.timestamp - a.timestamp);

            setPayments(combinedPayments);
            setError(null);
        } catch (err) {
            setError('Failed to load payment history. Please try again.');
            console.error('Error fetching payment history:', err);
            setPayments([]); // Set empty array on error
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
                            <TableCell><strong>Date</strong></TableCell>
                            <TableCell><strong>Type</strong></TableCell>
                            <TableCell><strong>Amount</strong></TableCell>
                            <TableCell><strong>Reference</strong></TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {payments.map(row => (
                            <TableRow key={row.id}>
                                <TableCell>{row.date}</TableCell>
                                <TableCell>{row.type}</TableCell>
                                <TableCell>R {parseFloat(row.amount).toFixed(2)}</TableCell>
                                <TableCell sx={{ fontFamily: 'monospace', fontSize: '0.9rem' }}>
                                    {row.reference}
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            )}
        </Paper>
    );
};

export default PaymentHistory;