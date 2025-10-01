import React from 'react';
import {Typography, Table, TableBody, TableCell, TableHead, TableRow, Paper } from '@mui/material';

const PaymentHistory = () => {
    const mockData = [
        { id: 1, date: '2025-09-01', type: 'Electricity', amount: 500 },
        { id: 2, date: '2025-09-05', type: 'Cash Send', amount: 200 },
    ];

    return (
        <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>Payment History</Typography>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>Date</TableCell>
                        <TableCell>Type</TableCell>
                        <TableCell>Amount (ZAR)</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {mockData.map(row => (
                        <TableRow key={row.id}>
                            <TableCell>{row.date}</TableCell>
                            <TableCell>{row.type}</TableCell>
                            <TableCell>{row.amount}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </Paper>
    );
};

export default PaymentHistory;
