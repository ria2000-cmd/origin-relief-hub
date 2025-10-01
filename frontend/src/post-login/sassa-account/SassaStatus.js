import React from 'react';
import { Box, Typography, Divider } from '@mui/material';

const SassaStatus = ({ linkedAccounts }) => {
    if (!linkedAccounts || linkedAccounts.length === 0) return null;

    return (
        <Box sx={{ mt: 3 }}>
            <Typography variant="h6" fontWeight="bold" sx={{ mb: 2 }}>
                Linked SASSA Accounts
            </Typography>
            {linkedAccounts.map((account, index) => (
                <Box key={account.nationalId} sx={{ mb: 2, p: 2, border: '1px solid #ddd', borderRadius: 2 }}>
                    <Typography>National ID: {account.nationalId}</Typography>
                    <Typography>Grant Type: {account.grantType}</Typography>
                    <Typography>Balance: R{account.balance}</Typography>
                    <Typography>Last Payment: {account.lastPayment}</Typography>
                </Box>
            ))}
        </Box>
    );
};
export default SassaStatus