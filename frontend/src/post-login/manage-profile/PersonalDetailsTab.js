import React, {useEffect, useState} from 'react';
import {Box, Typography, TextField,
    Button, Grid, Avatar, CircularProgress
} from '@mui/material';
import CancelIcon from '@mui/icons-material/Cancel';
import {
    Camera,
    Save,
} from 'lucide-react';


const PersonalDetailsTab = ({ user,
                                personalDetails,
                                onPersonalDetailsChange,
                                onSave,
                                onReset,
                                loading
                            }) => {

    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');

    const splitDisplayName = (displayName) => {
        if (!displayName) return { firstName: '', lastName: '' };

        const parts = displayName.trim().split(' ');
        const first = parts[0] || '';
        const last = parts.slice(1).join(' ') || '';

        setFirstName(first);
        setLastName(last);

        return { firstName: first, lastName: last };
    };

    useEffect(() => {
        if (user?.displayName) {
            splitDisplayName(user.displayName);
        }
    }, [user]);

    const handleNameChange = (e) => {
        const { name, value } = e.target;
        if (name === 'firstName') {
            setFirstName(value);
        } else if (name === 'lastName') {
            setLastName(value);
        }
        // Also call the parent's onChange if needed
        onPersonalDetailsChange(e);
    };

    return (
        <Box>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
                <Avatar
                    sx={{
                        width: 100,
                        height: 100,
                        bgcolor: '#facc15',
                        color: '#1e293b',
                        fontSize: '2rem',
                        mr: 3
                    }}
                >
                    {firstName?.[0] || 'U'}{lastName?.[0] || ''}
                </Avatar>
                <Box>
                    <Typography variant="h6" gutterBottom>
                        Profile Picture
                    </Typography>
                    <Button
                        variant="outlined"
                        startIcon={<Camera size={16} />}
                        sx={{ textTransform: 'none' }}
                    >
                        Change Photo
                    </Button>
                </Box>
            </Box>

            <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                    <TextField
                        fullWidth
                        label="First Name"
                        name="firstName"
                        value={firstName}
                        onChange={handleNameChange}
                        disabled={loading}
                        required
                    />
                </Grid>
                <Grid item xs={12} md={6}>
                    <TextField
                        fullWidth
                        label="Last Name"
                        name="lastName"
                        value={lastName}
                        onChange={handleNameChange}
                        disabled={loading}
                        required
                    />
                </Grid>
                <Grid item xs={12} md={6}>
                    <TextField
                        fullWidth
                        label="Email"
                        name="email"
                        type="email"
                        value={user?.email || ''}
                        onChange={onPersonalDetailsChange}
                        disabled={loading}
                        required
                    />
                </Grid>
                <Grid item xs={12} md={6}>
                    <TextField
                        fullWidth
                        label="Username"
                        name="username"
                        value={user?.username || ''}
                        onChange={onPersonalDetailsChange}
                        disabled={loading}
                        required
                    />
                </Grid>
                <Grid item xs={12} md={6}>
                    <TextField
                        fullWidth
                        label="Phone Number"
                        name="phone"
                        value={user?.phone || ''}
                        onChange={onPersonalDetailsChange}
                        disabled={loading}
                        required
                        helperText="Format: +27123456789"
                    />
                </Grid>
                <Grid item xs={12} md={6}>
                    <TextField
                        fullWidth
                        label="ID Number"
                        name="idNumber"
                        value={user?.idNumber || ''}
                        onChange={onPersonalDetailsChange}
                        disabled={loading}
                        inputProps={{ maxLength: 13 }}
                        required
                        helperText="13 digits required"
                    />
                </Grid>
                <Grid item xs={12} md={6}>
                    <TextField
                        fullWidth
                        label="Date of Birth"
                        name="dateOfBirth"
                        type="date"
                        value={user?.dateOfBirth || ''}
                        onChange={onPersonalDetailsChange}
                        disabled={loading}
                        InputLabelProps={{
                            shrink: true,
                        }}
                    />
                </Grid>
                <Grid item xs={12}>
                    <TextField
                        fullWidth
                        label="Address"
                        name="address"
                        value={user?.address || ''}
                        onChange={onPersonalDetailsChange}
                        disabled={loading}
                        helperText="Enter your full residential address"
                        InputProps={{
                            style: { height: 56 }
                        }}
                    />
                </Grid>
            </Grid>

            {/* Action Buttons */}
            <Box sx={{ mt: 4, display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
                <Button
                    variant="outlined"
                    startIcon={<CancelIcon size={16} />}
                    onClick={onReset}
                    disabled={loading}
                    sx={{ textTransform: 'none' }}
                >
                    Reset
                </Button>
                <Button
                    variant="gold"
                    startIcon={loading ? <CircularProgress size={16} /> : <Save size={16} />}
                    onClick={onSave}
                    disabled={loading}
                    sx={{ textTransform: 'none' }}
                >
                    {loading ? 'Saving...' : 'Save Changes'}
                </Button>
            </Box>
        </Box>
    );
};

export default PersonalDetailsTab;