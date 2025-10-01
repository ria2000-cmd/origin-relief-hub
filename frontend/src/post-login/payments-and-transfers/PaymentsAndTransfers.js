import React, { useState } from 'react';
import { Box, Paper, Tabs, Tab, Typography } from '@mui/material';
import Payments from './Payments';
import Transfers from './Transfers';

const PaymentsAndTransfers = () => {
    const [activeTab, setActiveTab] = useState(0);

    const handleTabChange = (event, newValue) => {
        setActiveTab(newValue);
    };

    return (
        <Box sx={{ p: 3, mt: { xs: 8, md: 0 }, minHeight: '100vh', bgcolor: '#f8fafc' }}>
            <Typography variant="h4" fontWeight="bold" sx={{ color: '#facc15', mb: 1 }}>
                Payments & Transfers
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
                Make secure payments, schedule transfers, and manage your financial transactions
            </Typography>

            <Paper sx={{ borderRadius: 3, overflow: 'hidden', boxShadow: 3 }}>
                <Tabs
                    value={activeTab}
                    onChange={handleTabChange}
                    sx={{
                        borderBottom: 1,
                        borderColor: 'divider',
                        bgcolor: '#fafafa',
                        '& .MuiTab-root': {
                            textTransform: 'none',
                            fontWeight: 600,
                            minHeight: 64,
                            fontSize: '1rem'
                        },
                        '& .Mui-selected': {
                            color: '#1e3a8a !important'
                        },
                        '& .MuiTabs-indicator': {
                            backgroundColor: '#facc15',
                            height: 3
                        }
                    }}
                >
                    <Tab label="Payments" />
                    <Tab label="Transfers" />
                </Tabs>

                <Box sx={{ p: 4 }}>
                    {activeTab === 0 && <Payments />}
                    {activeTab === 1 && <Transfers />}
                </Box>
            </Paper>
        </Box>
    );
};

export default PaymentsAndTransfers;
