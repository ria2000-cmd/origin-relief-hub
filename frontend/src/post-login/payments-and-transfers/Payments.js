import React, { useState } from 'react';
import { Box, Button, Paper } from '@mui/material';
import PaymentHistory from './PaymentHistory';
import CashSend from './CashSend';
import BuyElectricity from './BuyElectricity';

const Payments = () => {
    const [activePayment, setActivePayment] = useState('history');

    return (
        <Box>
            <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
                <Button
                    variant={activePayment === 'history' ? 'contained' : 'outlined'}
                    onClick={() => setActivePayment('history')}
                    sx={{ textTransform: 'none', fontWeight: 600 }}
                >
                    Payment History
                </Button>
                <Button
                    variant={activePayment === 'cashsend' ? 'contained' : 'outlined'}
                    onClick={() => setActivePayment('cashsend')}
                    sx={{ textTransform: 'none', fontWeight: 600 }}
                >
                    Cash Send
                </Button>
                <Button
                    variant={activePayment === 'electricity' ? 'contained' : 'outlined'}
                    onClick={() => setActivePayment('electricity')}
                    sx={{ textTransform: 'none', fontWeight: 600 }}
                >
                    Buy Electricity
                </Button>
            </Box>

            <Paper sx={{ p: 3, borderRadius: 2, boxShadow: 2 }}>
                {activePayment === 'history' && <PaymentHistory />}
                {activePayment === 'cashsend' && <CashSend />}
                {activePayment === 'electricity' && <BuyElectricity />}
            </Paper>
        </Box>
    );
};

export default Payments;
