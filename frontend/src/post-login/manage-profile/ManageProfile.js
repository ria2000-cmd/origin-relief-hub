import React, { useState, useEffect } from 'react';
import {
    Box,
    Typography,
    Paper,
    Alert,
    Tabs,
    Tab
} from '@mui/material';
import {
    User,
    Lock,
    Settings
} from 'lucide-react';
import PersonalDetailsTab from './PersonalDetailsTab';
import PasswordChangeTab from './PasswordChangeTab';
import PreferencesTab from './PreferencesTab';
import profileService from '../../service/profile-service';

const ManageProfile = ({ user,
                           preferences,
                           onPreferencesChange,
                           onSavePreferences,
                           preferencesLoading
                       }) => {
    const [activeTab, setActiveTab] = useState(0);
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState('');
    const [error, setError] = useState('');
    const [selectedFile, setSelectedFile] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(null);

    const [personalDetails, setPersonalDetails] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        address: '',
        dateOfBirth: '',
        idNumber: '',
        username: ''
    });

    const [passwordData, setPasswordData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmNewPassword: ''
    });

    useEffect(() => {
        console.log('user on manage profile', user)
    }, [user]);

    useEffect(() => {
        loadUserData();
    }, []);

    const loadUserData = async () => {
        setLoading(true);
        try {
            const userResponse = await profileService.getUserProfile();

            console.log('Full userResponse:', userResponse);
            console.log('userResponse.data:', userResponse.data);
            console.log('userResponse.data.data:', userResponse.data?.data);

            const userData = userResponse.data.data;

            console.log('Actual userData:', userData);
            console.log('dateOfBirth:', userData.dateOfBirth);
            console.log('dateOfBirth is array?', Array.isArray(userData.dateOfBirth));

            const formatDateFromArray = (dateValue) => {
                if (!dateValue) return '';

                if (typeof dateValue === 'string' && dateValue.match(/^\d{4}-\d{2}-\d{2}$/)) {
                    return dateValue;
                }

                if (typeof dateValue === 'string' && dateValue.includes(',')) {
                    const parts = dateValue.split(',').map(p => p.trim());
                    if (parts.length >= 3) {
                        const [year, month, day] = parts;
                        const paddedMonth = String(month).padStart(2, '0');
                        const paddedDay = String(day).padStart(2, '0');
                        return `${year}-${paddedMonth}-${paddedDay}`;
                    }
                }

                if (Array.isArray(dateValue) && dateValue.length >= 3) {
                    const [year, month, day] = dateValue;
                    const paddedMonth = String(month).padStart(2, '0');
                    const paddedDay = String(day).padStart(2, '0');
                    return `${year}-${paddedMonth}-${paddedDay}`;
                }

                return '';
            };

            const nameParts = (userData.displayName || '').trim().split(' ');
            const firstName = nameParts[0] || '';
            const lastName = nameParts.slice(1).join(' ') || '';

            const formattedDate = formatDateFromArray(userData.dateOfBirth);

            setPersonalDetails({
                firstName: firstName,
                lastName: lastName,
                email: userData.email || '',
                phone: userData.phone || '',
                address: userData.address || '',
                dateOfBirth: formattedDate,
                idNumber: userData.idNumber || '',
                username: userData.username || ''
            });

        } catch (err) {
            console.error('Failed to load user data:', err);
            setError('Failed to load user data: ' + (err.response?.data?.message || err.message));
        } finally {
            setLoading(false);
        }
    };

    const handleFileChange = (file) => {
        if (file) {
            // Validate file type
            const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];
            if (!validTypes.includes(file.type)) {
                setError('Please select a valid image file (JPG, PNG, or GIF)');
                return;
            }

            // Validate file size (max 5MB)
            const maxSize = 5 * 1024 * 1024;
            if (file.size > maxSize) {
                setError('Image size must be less than 5MB');
                return;
            }

            setSelectedFile(file);

            // Create preview URL
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreviewUrl(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleClearFile = () => {
        setSelectedFile(null);
        setPreviewUrl(null);
    };

    const handlePersonalDetailsChange = (e) => {
        const { name, value } = e.target;

        let sanitizedValue = value;
        if (name === 'idNumber') {
            sanitizedValue = value.replace(/\D/g, '');
        }
        if (name === 'phone') {
            sanitizedValue = value.replace(/[^\d+]/g, '');
        }

        setPersonalDetails(prev => ({
            ...prev,
            [name]: sanitizedValue
        }));
    };

    const handlePasswordChange = (e) => {
        const { name, value } = e.target;
        setPasswordData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const validatePersonalDetails = () => {
        const { firstName, lastName, email, phone, idNumber } = personalDetails;

        if (!firstName || !firstName.trim() || !lastName || !lastName.trim()) {
            return 'First name and last name are required';
        }
        if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            return 'Valid email is required';
        }
        if (!phone || !/^\+?[0-9]{10,15}$/.test(phone)) {
            return 'Valid phone number is required (10-15 digits)';
        }
        if (!idNumber || !/^\d{13}$/.test(idNumber)) {
            return 'Valid ID number (exactly 13 digits) is required';
        }
        return null;
    };

    const validatePasswordChange = () => {
        const { currentPassword, newPassword, confirmNewPassword } = passwordData;

        if (!currentPassword) {
            return 'Current password is required';
        }
        if (!newPassword || newPassword.length < 8) {
            return 'New password must be at least 8 characters';
        }
        if (!/(?=.*[a-zA-Z])(?=.*\d)(?=.*[!@#$%^&*])/.test(newPassword)) {
            return 'Password must contain letters, numbers, and special characters';
        }
        if (newPassword !== confirmNewPassword) {
            return 'New passwords do not match';
        }
        if (newPassword === currentPassword) {
            return 'New password must be different from current password';
        }
        return null;
    };

    const handleSavePersonalDetails = async () => {
        if (!personalDetails.email && !personalDetails.firstName) {
            setError('Please wait for profile data to load');
            return;
        }

        setLoading(true);
        setError('');
        setSuccess('');

        const validationError = validatePersonalDetails();
        if (validationError) {
            setError(validationError);
            setLoading(false);
            return;
        }

        try {
            await profileService.updateUserProfile(personalDetails, selectedFile);
            setSuccess('Personal details updated successfully!');

            // Reload user data to get updated profile photo
            await loadUserData();

            // Clear the selected file
            setSelectedFile(null);
            setPreviewUrl(null);

            setTimeout(() => setSuccess(''), 5000);

        } catch (err) {
            console.error('Failed to update personal details:', err);
            setError(err.response?.data?.message || err.message || 'Failed to update personal details');
        } finally {
            setLoading(false);
        }
    };

    const handleChangePassword = async () => {
        setLoading(true);
        setError('');
        setSuccess('');

        const validationError = validatePasswordChange();
        if (validationError) {
            setError(validationError);
            setLoading(false);
            return;
        }

        try {
            const passwordPayload = {
                currentPassword: passwordData.currentPassword,
                newPassword: passwordData.newPassword
            };

            await profileService.changePassword(passwordPayload);
            setSuccess('Password changed successfully!');

            setPasswordData({
                currentPassword: '',
                newPassword: '',
                confirmNewPassword: ''
            });

            setTimeout(() => setSuccess(''), 5000);

        } catch (err) {
            console.error('Failed to change password:', err);

            const errorMessage = err.response?.data?.message || err.message;

            if (errorMessage.includes('incorrect') || errorMessage.includes('wrong')) {
                setError('Current password is incorrect');
            } else if (errorMessage.includes('same') || errorMessage.includes('different')) {
                setError('New password must be different from current password');
            } else if (errorMessage.includes('weak') || errorMessage.includes('strong')) {
                setError('Password does not meet security requirements');
            } else {
                setError(errorMessage || 'Failed to change password');
            }
        } finally {
            setLoading(false);
        }
    };

    const handleClearPassword = () => {
        setPasswordData({
            currentPassword: '',
            newPassword: '',
            confirmNewPassword: ''
        });
        if (error && (error.includes('password') || error.includes('Password'))) {
            setError('');
        }
    };

    const handleTabChange = (event, newValue) => {
        setActiveTab(newValue);
        setError('');
        setSuccess('');
    };

    return (
        <Box sx={{ p: 3, mt: { xs: 8, md: 0 }, minHeight: '100vh', bgcolor: 'background.default' }}>
            <Typography variant="h4" fontWeight="bold" sx={{ color: '#facc15', mb: 1 }}>
                Manage Profile
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
                Update your personal information, change password, and manage your preferences
            </Typography>

            {error && (
                <Alert
                    severity="error"
                    sx={{ mb: 3 }}
                    onClose={() => setError('')}
                >
                    {error}
                </Alert>
            )}
            {success && (
                <Alert
                    severity="success"
                    sx={{ mb: 3 }}
                    onClose={() => setSuccess('')}
                >
                    {success}
                </Alert>
            )}

            <Paper sx={{ borderRadius: 3, overflow: 'hidden', boxShadow: 3 }}>
                <Tabs
                    value={activeTab}
                    onChange={handleTabChange}
                    sx={{
                        borderBottom: 1,
                        borderColor: 'divider',
                        bgcolor: 'background.paper',
                        '& .MuiTab-root': {
                            textTransform: 'none',
                            fontWeight: 600,
                            minHeight: 64,
                            fontSize: '1rem',
                            color: 'text.secondary'
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
                    <Tab
                        icon={<User size={18} />}
                        label="Personal Details"
                        iconPosition="start"
                    />
                    <Tab
                        icon={<Lock size={18} />}
                        label="Change Password"
                        iconPosition="start"
                    />
                    <Tab
                        icon={<Settings size={18} />}
                        label="Preferences"
                        iconPosition="start"
                    />
                </Tabs>

                <Box sx={{ p: 4 }}>
                    {activeTab === 0 && (
                        <PersonalDetailsTab
                            user={user}
                            personalDetails={personalDetails}
                            onPersonalDetailsChange={handlePersonalDetailsChange}
                            onSave={handleSavePersonalDetails}
                            onReset={loadUserData}
                            loading={loading}
                            selectedFile={selectedFile}
                            previewUrl={previewUrl}
                            onFileChange={handleFileChange}
                            onClearFile={handleClearFile}
                        />
                    )}
                    {activeTab === 1 && (
                        <PasswordChangeTab
                            passwordData={passwordData}
                            onPasswordChange={handlePasswordChange}
                            onChangePassword={handleChangePassword}
                            onClear={handleClearPassword}
                            loading={loading}
                        />
                    )}
                    {activeTab === 2 && (
                        <PreferencesTab
                            preferences={preferences}
                            onPreferencesChange={onPreferencesChange}
                            onSavePreferences={onSavePreferences}
                            loading={preferencesLoading}
                        />
                    )}
                </Box>
            </Paper>
        </Box>
    );
};

export default ManageProfile;