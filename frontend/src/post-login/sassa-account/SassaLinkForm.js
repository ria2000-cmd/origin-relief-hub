import React, { useState } from 'react';
import { Box, TextField, Button, CircularProgress } from '@mui/material';
import { Link as LinkIcon } from 'lucide-react';

const SassaLinkForm = ({ onLinkAccount, loading }) => {
    const [nationalId, setNationalId] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!/^\d{13}$/.test(nationalId)) {
            alert('Please enter a valid 13-digit national ID');
            return;
        }

        onLinkAccount({
            idNumber: nationalId
        });
    };

    return (
        <Box component="form" onSubmit={handleSubmit} sx={{ mb: 3, display: 'flex', gap: 2, alignItems: 'center' }}>
            <TextField
                label="National ID"
                value={nationalId}
                onChange={(e) => setNationalId(e.target.value)}
                disabled={loading}
                fullWidth
                placeholder="Enter 13-digit ID number"
                inputProps={{ maxLength: 13 }}
            />
            <Button
                type="submit"
                variant="contained"
                startIcon={loading ? <CircularProgress size={16} /> : <LinkIcon size={16} />}
                disabled={loading}
                sx={{ textTransform: 'none', whiteSpace: 'nowrap' }}
            >
                {loading ? 'Linking...' : 'Link Account'}
            </Button>
        </Box>
    );
};

export default SassaLinkForm;