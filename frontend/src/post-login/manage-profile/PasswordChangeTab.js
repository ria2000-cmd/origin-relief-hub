import React, { useState } from 'react';
import {
    Box,
    TextField,
    Button,
    Grid,
    IconButton,
    CircularProgress
} from '@mui/material';
import CancelIcon from '@mui/icons-material/Cancel';
import {
    Lock,
    Eye,
    EyeOff
} from 'lucide-react';

const PasswordChangeTab = ({
                               passwordData,
                               onPasswordChange,
                               onChangePassword,
                               onClear,
                               loading
                           }) => {
    const [showPassword, setShowPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);



    return (
        <Box>
            <Grid container spacing={3}>
                <Grid item xs={12}>
                    <TextField
                        fullWidth
                        label="Current Password"
                        name="currentPassword"
                        type={showPassword ? 'text' : 'password'}
                        value={passwordData.currentPassword}
                        onChange={onPasswordChange}
                        disabled={loading}
                        required
                        helperText="Enter your current password to verify identity"
                        InputProps={{
                            endAdornment: (
                                <IconButton
                                    onClick={() => setShowPassword(!showPassword)}
                                    edge="end"
                                    tabIndex={-1}
                                >
                                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                </IconButton>
                            ),
                        }}
                    />
                </Grid>

                <Grid item xs={12}>
                    <TextField
                        fullWidth
                        label="New Password"
                        name="newPassword"
                        type={showNewPassword ? 'text' : 'password'}
                        value={passwordData.newPassword}
                        onChange={onPasswordChange}
                        disabled={loading}
                        required
                        helperText="Password must be at least 8 characters long"
                        InputProps={{
                            endAdornment: (
                                <IconButton
                                    onClick={() => setShowNewPassword(!showNewPassword)}
                                    edge="end"
                                    tabIndex={-1}
                                >
                                    {showNewPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                </IconButton>
                            ),
                        }}
                    />
                </Grid>

                <Grid item xs={12}>
                    <TextField
                        fullWidth
                        label="Confirm New Password"
                        name="confirmNewPassword"
                        type={showConfirmPassword ? 'text' : 'password'}
                        value={passwordData.confirmNewPassword}
                        onChange={onPasswordChange}
                        disabled={loading}
                        required
                        helperText="Re-enter your new password to confirm"
                        error={
                            passwordData.confirmNewPassword &&
                            passwordData.newPassword !== passwordData.confirmNewPassword
                        }
                        InputProps={{
                            endAdornment: (
                                <IconButton
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    edge="end"
                                    tabIndex={-1}
                                >
                                    {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                </IconButton>
                            ),
                        }}
                    />
                </Grid>
            </Grid>

            {/* Password Requirements */}
            <Box sx={{ mt: 2, p: 2, bgcolor: '#f8fafc', borderRadius: 2 }}>
                <Box component="ul" sx={{ margin: 0, paddingLeft: 2 }}>
                    <li>At least 8 characters long</li>
                    <li>Contains both letters and numbers</li>
                    <li>Includes at least one special character</li>
                    <li>Different from your current password</li>
                </Box>
            </Box>

            {/* Action Buttons */}
            <Box sx={{ mt: 4, display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
                <Button
                    variant="outlined"
                    startIcon={<CancelIcon size={16} />}
                    onClick={onClear}
                    disabled={loading}
                    sx={{ textTransform: 'none' }}
                >
                    Clear
                </Button>
                <Button
                    variant="gold"
                    startIcon={loading ? <CircularProgress size={16} /> : <Lock size={16} />}
                    onClick={onChangePassword}
                    disabled={loading}
                    sx={{ textTransform: 'none' }}
                >
                    {loading ? 'Changing...' : 'Change Password'}
                </Button>
            </Box>
        </Box>
    );
};

export default PasswordChangeTab;