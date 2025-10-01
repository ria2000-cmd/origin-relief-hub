import React, { useState } from 'react';
import { Box, Button, Paper } from '@mui/material';
import TransferHistory from './TransferHistory';
import BankTransfer from './BankTransfer';

const Transfers = () => {
    const [activeTransfer, setActiveTransfer] = useState('history');

    return (
        <Box>
            <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
                <Button
                    variant={activeTransfer === 'history' ? 'contained' : 'outlined'}
                    onClick={() => setActiveTransfer('history')}
                    sx={{ textTransform: 'none', fontWeight: 600 }}
                >
                    Transfer History
                </Button>
                <Button
                    variant={activeTransfer === 'bank' ? 'contained' : 'outlined'}
                    onClick={() => setActiveTransfer('bank')}
                    sx={{ textTransform: 'none', fontWeight: 600 }}
                >
                    Bank / Account Transfer
                </Button>
            </Box>

            <Paper sx={{ p: 3, borderRadius: 2, boxShadow: 2 }}>
                {activeTransfer === 'history' && <TransferHistory />}
                {activeTransfer === 'bank' && <BankTransfer />}
            </Paper>
        </Box>
    );
};

export default Transfers;
