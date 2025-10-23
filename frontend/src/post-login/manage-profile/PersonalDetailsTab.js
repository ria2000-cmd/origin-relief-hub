import React from 'react';
import {
    Box,
    Typography,
    TextField,
    Button,
    Grid,
    Avatar,
    CircularProgress,
    IconButton
} from '@mui/material';
import CancelIcon from '@mui/icons-material/Cancel';
import CloseIcon from '@mui/icons-material/Close';
import {
    Camera,
    Save,
} from 'lucide-react';

const getProfilePhotoUrl = (profilePhotoPath) => {
    if (!profilePhotoPath) {
        return null;
    }

    const baseUrl = 'http://localhost:8083';
    return `${baseUrl}/profile_pictures/${profilePhotoPath}`;
};

const PersonalDetailsTab = ({
                                user,
                                personalDetails,
                                onPersonalDetailsChange,
                                onSave,
                                onReset,
                                loading,
                                selectedFile,
                                previewUrl,
                                onFileChange,
                                onClearFile
                            }) => {
    const handleFileInputChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            onFileChange(file);
        }
    };

    // Determine which image to show: preview, existing profile photo, or initials
    const getAvatarContent = () => {
        if (previewUrl) {
            // Show preview of newly selected image
            return (
                <Avatar
                    src={previewUrl}
                    sx={{
                        width: 100,
                        height: 100,
                        border: '3px solid #facc15'
                    }}
                />
            );
        } else if (user?.profilePhotoPath) {
            // Show existing profile photo from database
            const photoUrl = getProfilePhotoUrl(user.profilePhotoPath);
            return (
                <Avatar
                    src={photoUrl}
                    alt={`${personalDetails?.firstName || 'User'}'s profile`}
                    sx={{
                        width: 100,
                        height: 100,
                        border: '2px solid #e5e7eb'
                    }}
                    imgProps={{
                        onError: (e) => {
                            console.error('Failed to load profile photo:', photoUrl);
                            // Hide the broken image and show initials instead
                            e.target.style.display = 'none';
                        }
                    }}
                >
                    {/* Fallback to initials if image fails */}
                    {personalDetails?.firstName?.[0] || 'U'}{personalDetails?.lastName?.[0] || ''}
                </Avatar>
            );
        } else {
            // Show initials as fallback
            return (
                <Avatar
                    sx={{
                        width: 100,
                        height: 100,
                        bgcolor: '#facc15',
                        color: '#1e293b',
                        fontSize: '2rem',
                        fontWeight: 'bold'
                    }}
                >
                    {personalDetails?.firstName?.[0] || 'U'}{personalDetails?.lastName?.[0] || ''}
                </Avatar>
            );
        }
    };

    return (
        <Box>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 4, position: 'relative' }}>
                <Box sx={{ position: 'relative' }}>
                    {getAvatarContent()}

                    {selectedFile && (
                        <IconButton
                            onClick={onClearFile}
                            sx={{
                                position: 'absolute',
                                right: -10,
                                top: -10,
                                bgcolor: 'error.main',
                                color: 'white',
                                '&:hover': { bgcolor: 'error.dark' },
                                width: 32,
                                height: 32,
                                boxShadow: 2
                            }}
                            size="small"
                        >
                            <CloseIcon fontSize="small" />
                        </IconButton>
                    )}
                </Box>

                <Box sx={{ ml: 3 }}>
                    <Typography variant="h6" gutterBottom>
                        Profile Picture
                    </Typography>
                    <input
                        accept="image/*"
                        style={{ display: 'none' }}
                        id="profile-photo-upload"
                        type="file"
                        onChange={handleFileInputChange}
                        disabled={loading}
                    />
                    <label htmlFor="profile-photo-upload">
                        <Button
                            variant="outlined"
                            component="span"
                            startIcon={<Camera size={16} />}
                            sx={{ textTransform: 'none' }}
                            disabled={loading}
                        >
                            {selectedFile ? 'Change Photo' : user?.profilePhotoPath ? 'Update Photo' : 'Upload Photo'}
                        </Button>
                    </label>
                    {selectedFile && (
                        <Typography variant="caption" display="block" sx={{ mt: 1, color: 'success.main' }}>
                            ✓ {selectedFile.name} selected
                        </Typography>
                    )}
                    {user?.profilePhotoPath && !selectedFile && (
                        <Typography variant="caption" display="block" sx={{ mt: 1, color: 'text.secondary' }}>
                            Current: {user.profilePhotoPath}
                        </Typography>
                    )}
                    <Typography variant="caption" display="block" sx={{ mt: 0.5, color: 'text.secondary' }}>
                        Max size: 5MB (JPG, PNG, GIF)
                    </Typography>
                </Box>
            </Box>

            <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                    <TextField
                        fullWidth
                        label="First Name"
                        name="firstName"
                        value={personalDetails?.firstName || ''}
                        onChange={onPersonalDetailsChange}
                        disabled={loading}
                        required
                    />
                </Grid>
                <Grid item xs={12} md={6}>
                    <TextField
                        fullWidth
                        label="Last Name"
                        name="lastName"
                        value={personalDetails?.lastName || ''}
                        onChange={onPersonalDetailsChange}
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
                        value={personalDetails?.email || ''}
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
                        value={personalDetails?.username || ''}
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
                        value={personalDetails?.phone || ''}
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
                        value={personalDetails?.idNumber || ''}
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
                        value={personalDetails?.dateOfBirth || ''}
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
                        value={personalDetails?.address || ''}
                        onChange={onPersonalDetailsChange}
                        disabled={loading}
                        helperText="Enter your full residential address"
                        InputProps={{
                            style: { height: 56 }
                        }}
                    />
                </Grid>
            </Grid>

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