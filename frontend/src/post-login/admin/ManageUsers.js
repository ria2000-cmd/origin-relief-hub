import React, { useState, useEffect } from 'react';
import {
    Box,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Button,
    Typography,
    TextField,
    Grid,
    Chip,
    IconButton,
    Menu,
    MenuItem,
    Alert,
    CircularProgress,
    Pagination,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Snackbar
} from '@mui/material';
import {
    Search,
    Plus,
    Edit,
    Trash2,
    MoreVertical,
    Download,
    AlertTriangle
} from 'lucide-react';
import AdminService from '../../service/admin-service';

const ManageUsers = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterRole, setFilterRole] = useState('All');
    const [anchorEl, setAnchorEl] = useState(null);
    const [selectedUser, setSelectedUser] = useState(null);

    const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [totalElements, setTotalElements] = useState(0);

    // Add User Dialog
    const [addDialogOpen, setAddDialogOpen] = useState(false);
    const [formData, setFormData] = useState({
        fullName: '',
        idNumber: '',
        email: '',
        username: '',
        phone: '',
        password: '',
        address: '',
        dateOfBirth: ''
    });
    const [formLoading, setFormLoading] = useState(false);
    const [formError, setFormError] = useState(null);

    // Edit User Dialog
    const [editDialogOpen, setEditDialogOpen] = useState(false);
    const [userToEdit, setUserToEdit] = useState(null);
    const [editFormData, setEditFormData] = useState({
        fullName: '',
        email: '',
        username: '',
        phone: '',
        address: '',
        dateOfBirth: '',
        role: 'USER',
        status: 'ACTIVE'
    });
    const [editLoading, setEditLoading] = useState(false);
    const [editError, setEditError] = useState(null);

    // Delete Dialog
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [deleteLoading, setDeleteLoading] = useState(false);
    const [userToDelete, setUserToDelete] = useState(null);

    // Snackbar
    const [snackbar, setSnackbar] = useState({
        open: false,
        message: '',
        severity: 'success'
    });

    useEffect(() => {
        fetchUsers();
    }, [page]);

    const fetchUsers = async () => {
        setLoading(true);
        setError(null);

        try {
            const response = await AdminService.getAllUsers();
            console.log('Fetch users response:', response);

            let usersData = [];
            let pages = 0;
            let elements = 0;

            // Handle different response structures
            if (response.data && response.data.content && Array.isArray(response.data.content)) {
                // Paginated response: {content: [], totalPages: X, totalElements: Y}
                usersData = response.data.content;
                pages = response.data.totalPages || 0;
                elements = response.data.totalElements || 0;
            } else if (response.data && response.data.data && response.data.data.content) {
                // Nested response: {success: true, data: {content: [], totalPages: X}}
                usersData = response.data.data.content;
                pages = response.data.data.totalPages || 0;
                elements = response.data.data.totalElements || 0;
            } else if (Array.isArray(response.data)) {
                // Direct array response: [{}, {}, ...]
                usersData = response.data;
                pages = 1;
                elements = response.data.length;
            } else if (response.data && response.data.data && Array.isArray(response.data.data)) {
                // Nested array: {success: true, data: [{}, {}]}
                usersData = response.data.data;
                pages = 1;
                elements = response.data.data.length;
            }

            console.log('Parsed users data:', usersData);
            if (usersData.length > 0) {
                console.log('Sample user object (first user):', usersData[0]);
                console.log('User ID fields:', {
                    userId: usersData[0].userId,
                    id: usersData[0].id,
                    user_id: usersData[0].user_id
                });
            }
            setUsers(usersData);
            setTotalPages(pages);
            setTotalElements(elements);
        } catch (err) {
            console.error('Error fetching users:', err);
            setError(err.response?.data?.message || err.message || 'Failed to fetch users');
        } finally {
            setLoading(false);
        }
    };

    const handlePageChange = (event, newPage) => {
        setPage(newPage - 1);
    };

    const handleMenuOpen = (event, user) => {
        setAnchorEl(event.currentTarget);
        setSelectedUser(user);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
        setSelectedUser(null);
    };

    // Add User Functions
    const handleAddDialogOpen = () => {
        setAddDialogOpen(true);
        setFormError(null);
    };

    const handleAddDialogClose = () => {
        setAddDialogOpen(false);
        setFormData({
            fullName: '',
            idNumber: '',
            email: '',
            username: '',
            phone: '',
            password: '',
            address: '',
            dateOfBirth: ''
        });
        setFormError(null);
    };

    const handleFormChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleAddUser = async (e) => {
        e.preventDefault();
        setFormLoading(true);
        setFormError(null);

        // Client-side validation
        if (formData.idNumber && formData.idNumber.length !== 13) {
            setFormError('ID number must be exactly 13 digits');
            setFormLoading(false);
            return;
        }

        if (formData.phone && !/^[+]?[0-9]{10,15}$/.test(formData.phone.replace(/[\s-]/g, ''))) {
            setFormError('Phone number must be 10-15 digits');
            setFormLoading(false);
            return;
        }

        if (formData.password && formData.password.length < 8) {
            setFormError('Password must be at least 8 characters');
            setFormLoading(false);
            return;
        }

        try {
            // Format the payload to match backend expectations
            const payload = {
                fullName: formData.fullName,
                idNumber: formData.idNumber,
                email: formData.email,
                username: formData.username,
                phone: formData.phone.replace(/[\s-]/g, ''), // Remove spaces and dashes
                password: formData.password,
                address: formData.address || null,
                dateOfBirth: formData.dateOfBirth || null
            };

            console.log('Sending payload:', payload);
            const response = await AdminService.createUser(payload);
            console.log('Create user response:', response);

            // Check for success in different response formats
            const isSuccess = response.data?.success ||
                            response.status === 200 ||
                            response.status === 201 ||
                            (response.data && !response.data.error);

            if (isSuccess) {
                handleAddDialogClose();
                setSnackbar({
                    open: true,
                    message: response.data?.message || 'User successfully added!',
                    severity: 'success'
                });
                fetchUsers();
            } else {
                throw new Error(response.data?.message || 'Failed to create user');
            }
        } catch (err) {
            console.error('Error creating user:', err);
            const errorMessage = err.response?.data?.message ||
                               err.response?.data?.error ||
                               err.message ||
                               'Failed to create user';
            setFormError(errorMessage);
        } finally {
            setFormLoading(false);
        }
    };

    // Edit User Functions
    const formatDateForInput = (dateArray) => {
        if (!dateArray || !Array.isArray(dateArray)) return '';
        const [year, month, day] = dateArray;
        return `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    };

    const handleEditClick = (user) => {
        console.log('Edit clicked for user:', user);
        console.log('User ID to edit:', user?.userId || user?.id);

        // Store the user to edit in a separate state
        setUserToEdit(user);
        setEditFormData({
            fullName: user.fullName || '',
            email: user.email || '',
            username: user.username || '',
            phone: user.phone || '',
            address: user.address || '',
            dateOfBirth: user.dateOfBirth ? formatDateForInput(user.dateOfBirth) : '',
            role: user.role || 'USER',
            status: user.status || 'ACTIVE'
        });
        setEditDialogOpen(true);
        handleMenuClose();
    };

    const handleEditDialogClose = () => {
        setEditDialogOpen(false);
        setEditError(null);
        setUserToEdit(null);
    };

    const handleEditFormChange = (e) => {
        const { name, value } = e.target;
        setEditFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleUpdateUser = async (e) => {
        e.preventDefault();

        if (!userToEdit) {
            console.error('No user selected for editing');
            setEditError('Error: No user selected');
            return;
        }

        setEditLoading(true);
        setEditError(null);

        console.log('=== UPDATE USER DEBUG ===');
        console.log('User to edit object:', userToEdit);
        console.log('Form data:', editFormData);

        // Try multiple possible ID field names
        const userId = userToEdit?.userId || userToEdit?.id || userToEdit?.user_id;
        console.log('Extracted user ID:', userId);

        if (!userId) {
            console.error('No valid user ID found');
            setEditError('Cannot update user: No valid user ID found');
            setEditLoading(false);
            return;
        }

        try {
            // Convert date string to LocalDate format (YYYY-MM-DD)
            const payload = {
                ...editFormData,
                dateOfBirth: editFormData.dateOfBirth || null
            };

            console.log('Sending update payload:', payload);
            const response = await AdminService.updateUser(userId, payload);
            console.log('Update user response:', response);

            // Check for success in different response formats
            const isSuccess = response.data?.success ||
                            response.status === 200 ||
                            (response.data && !response.data.error);

            console.log('Is success?', isSuccess);

            if (isSuccess) {
                handleEditDialogClose();
                setSnackbar({
                    open: true,
                    message: response.data?.message || 'User updated successfully!',
                    severity: 'success'
                });
                await fetchUsers();
            } else {
                throw new Error(response.data?.message || 'Failed to update user');
            }
        } catch (err) {
            console.error('=== UPDATE USER ERROR ===');
            console.error('Error object:', err);
            console.error('Error response:', err.response);
            console.error('Error response data:', err.response?.data);
            setEditError(err.response?.data?.message || err.message || 'Failed to update user');
        } finally {
            setEditLoading(false);
        }
    };

    // Delete User Functions
    const handleDeleteClick = (user) => {
        console.log('Delete clicked for user:', user);
        console.log('User ID to delete:', user?.userId || user?.id);

        // Store the user to delete in a separate state
        setUserToDelete(user);
        setDeleteDialogOpen(true);
        handleMenuClose();
    };

    const handleDeleteDialogClose = () => {
        setDeleteDialogOpen(false);
        setUserToDelete(null);
    };

    const handleConfirmDelete = async () => {
        if (!userToDelete) {
            console.error('No user selected for deletion');
            setSnackbar({
                open: true,
                message: 'Error: No user selected',
                severity: 'error'
            });
            return;
        }

        setDeleteLoading(true);

        console.log('=== DELETE USER DEBUG ===');
        console.log('User to delete object:', userToDelete);

        // Try multiple possible ID field names
        const userId = userToDelete?.userId || userToDelete?.id || userToDelete?.user_id;

        console.log('Extracted user ID:', userId);
        console.log('User ID type:', typeof userId);

        if (!userId) {
            console.error('No valid user ID found in userToDelete:', userToDelete);
            console.error('Available fields:', Object.keys(userToDelete));
            setSnackbar({
                open: true,
                message: 'Cannot delete user: No valid user ID found',
                severity: 'error'
            });
            setDeleteLoading(false);
            return;
        }

        console.log('Calling AdminService.deleteUser with ID:', userId);

        try {
            const response = await AdminService.deleteUser(userId);
            console.log('Delete user SUCCESS response:', response);
            console.log('Response status:', response.status);
            console.log('Response data:', response.data);

            // Check for success in different response formats
            const isSuccess = response.data?.success ||
                            response.status === 200 ||
                            response.status === 204 ||
                            (response.data && !response.data.error);

            console.log('Is success?', isSuccess);

            if (isSuccess) {
                setSnackbar({
                    open: true,
                    message: response.data?.message || 'User deleted successfully',
                    severity: 'success'
                });
                handleDeleteDialogClose();

                // Refresh the user list
                console.log('Refreshing user list...');
                await fetchUsers();
            } else {
                throw new Error(response.data?.message || 'Failed to delete user');
            }
        } catch (err) {
            console.error('=== DELETE USER ERROR ===');
            console.error('Error object:', err);
            console.error('Error message:', err.message);
            console.error('Error response:', err.response);
            console.error('Error response data:', err.response?.data);
            console.error('Error response status:', err.response?.status);

            const errorMessage = err.response?.data?.message ||
                               err.response?.data?.error ||
                               err.message ||
                               'Failed to delete user';

            setSnackbar({
                open: true,
                message: errorMessage,
                severity: 'error'
            });
        } finally {
            setDeleteLoading(false);
        }
    };

    const handleCloseSnackbar = () => {
        setSnackbar({ ...snackbar, open: false });
    };

    // Export to CSV Function
    const handleExportCSV = () => {
        try {
            // Define CSV headers
            const headers = ['Name', 'Email', 'Username', 'Phone', 'ID Number', 'Role', 'Status', 'Join Date', 'Last Login', 'Address'];

            // Convert users data to CSV format
            const csvData = filteredUsers.map(user => {
                return [
                    user.fullName || user.displayName || '',
                    user.email || '',
                    user.username || '',
                    user.phone || '',
                    user.idNumber || '',
                    user.role || '',
                    user.status || '',
                    user.createdAt || '',
                    user.lastLogin || 'Never',
                    user.address || ''
                ].map(field => {
                    // Escape fields that contain commas, quotes, or newlines
                    const fieldStr = String(field);
                    if (fieldStr.includes(',') || fieldStr.includes('"') || fieldStr.includes('\n')) {
                        return `"${fieldStr.replace(/"/g, '""')}"`;
                    }
                    return fieldStr;
                }).join(',');
            });

            // Combine headers and data
            const csv = [
                headers.join(','),
                ...csvData
            ].join('\n');

            // Create blob and download
            const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
            const link = document.createElement('a');
            const url = URL.createObjectURL(blob);

            link.setAttribute('href', url);
            link.setAttribute('download', `users_export_${new Date().toISOString().split('T')[0]}.csv`);
            link.style.visibility = 'hidden';

            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);

            setSnackbar({
                open: true,
                message: `Successfully exported ${filteredUsers.length} users to CSV`,
                severity: 'success'
            });
        } catch (error) {
            console.error('Error exporting CSV:', error);
            setSnackbar({
                open: true,
                message: 'Failed to export CSV. Please try again.',
                severity: 'error'
            });
        }
    };

    const filteredUsers = users.filter(user => {
        // Exclude deleted users
        if (user.status === 'DELETED') {
            return false;
        }

        const matchesSearch =
            (user.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                user.displayName?.toLowerCase().includes(searchTerm.toLowerCase()));
        const matchesRole = filterRole === 'All' || user.role === filterRole;
        return matchesSearch && matchesRole;
    });

    const getStatusColor = (status) => {
        switch(status) {
            case 'ACTIVE':
                return 'success';
            case 'PENDING':
                return 'warning';
            case 'SUSPENDED':
                return 'error';
            case 'DELETED':
                return 'default';
            default:
                return 'default';
        }
    };

    const getRoleColor = (role) => {
        return role === 'ADMIN' ? 'primary' : 'secondary';
    };

    const formatDate = (dateArray) => {
        if (!dateArray || !Array.isArray(dateArray)) return 'N/A';
        const [year, month, day] = dateArray;
        return new Date(year, month - 1, day).toLocaleDateString();
    };

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
                <CircularProgress />
            </Box>
        );
    }

    if (error) {
        return (
            <Box>
                <Alert severity="error" sx={{ mb: 3 }}>
                    {error}
                </Alert>
                <Button onClick={fetchUsers} variant="contained">
                    Retry
                </Button>
            </Box>
        );
    }

    return (
        <Box>
            <Typography variant="h4" fontWeight="bold" sx={{ color: '#facc15', mb: 1 }}>
                Manage Users
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
                View, edit, and manage all system users
            </Typography>

            <Paper sx={{ p: 3, mb: 3, borderRadius: 3, boxShadow: 2 }}>
                <Grid container spacing={2} alignItems="center">
                    <Grid item xs={12} md={4}>
                        <TextField
                            fullWidth
                            size="small"
                            placeholder="Search users..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            InputProps={{
                                startAdornment: <Search size={20} style={{ marginRight: 8, color: '#6b7280' }} />
                            }}
                        />
                    </Grid>
                    <Grid item xs={12} md={2}>
                        <TextField
                            fullWidth
                            select
                            size="small"
                            label="Role"
                            value={filterRole}
                            onChange={(e) => setFilterRole(e.target.value)}
                        >
                            <MenuItem value="All">All Roles</MenuItem>
                            <MenuItem value="ADMIN">Admin</MenuItem>
                            <MenuItem value="USER">User</MenuItem>
                        </TextField>
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
                            <Button
                                variant="outlined"
                                startIcon={<Download size={16} />}
                                sx={{ textTransform: 'none' }}
                                onClick={handleExportCSV}
                                disabled={filteredUsers.length === 0}
                            >
                                Export CSV
                            </Button>
                            <Button
                                variant="contained"
                                startIcon={<Plus size={16} />}
                                sx={{
                                    textTransform: 'none',
                                    bgcolor: '#1e3a8a',
                                    color: '#ffffff',
                                    '&:hover': { bgcolor: '#1e40af' }
                                }}
                                onClick={handleAddDialogOpen}
                            >
                                Add New User
                            </Button>
                        </Box>
                    </Grid>
                </Grid>
            </Paper>

            <Alert severity="info" sx={{ mb: 3 }}>
                Showing {filteredUsers.length} of {totalElements} users
            </Alert>

            <Paper sx={{ borderRadius: 3, boxShadow: 2, overflow: 'hidden' }}>
                <TableContainer>
                    <Table>
                        <TableHead sx={{ bgcolor: '#f8fafc' }}>
                            <TableRow>
                                <TableCell sx={{ fontWeight: 600, color: '#374151' }}>Name</TableCell>
                                <TableCell sx={{ fontWeight: 600, color: '#374151' }}>Email</TableCell>
                                <TableCell sx={{ fontWeight: 600, color: '#374151' }}>Role</TableCell>
                                <TableCell sx={{ fontWeight: 600, color: '#374151' }}>Status</TableCell>
                                <TableCell sx={{ fontWeight: 600, color: '#374151' }}>Join Date</TableCell>
                                <TableCell sx={{ fontWeight: 600, color: '#374151' }}>Last Login</TableCell>
                                <TableCell sx={{ fontWeight: 600, color: '#374151', textAlign: 'center' }}>Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {filteredUsers.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={7} sx={{ textAlign: 'center', py: 4 }}>
                                        <Typography color="text.secondary">
                                            {searchTerm ? 'No users found matching your search.' : 'No users found.'}
                                        </Typography>
                                    </TableCell>
                                </TableRow>
                            ) : (
                                filteredUsers.map((user) => (
                                    <TableRow
                                        key={user.userId || user.id}
                                        sx={{
                                            '&:hover': { bgcolor: '#f8fafc' },
                                            transition: 'background-color 0.2s ease'
                                        }}
                                    >
                                        <TableCell>
                                            <Typography variant="body2" fontWeight={500}>
                                                {user.displayName || user.fullName || 'N/A'}
                                            </Typography>
                                        </TableCell>
                                        <TableCell>
                                            <Typography variant="body2" color="text.secondary">
                                                {user.email}
                                            </Typography>
                                        </TableCell>
                                        <TableCell>
                                            <Chip
                                                label={user.role || 'USER'}
                                                color={getRoleColor(user.role)}
                                                size="small"
                                                variant="outlined"
                                            />
                                        </TableCell>
                                        <TableCell>
                                            <Chip
                                                label={user.status}
                                                color={getStatusColor(user.status)}
                                                size="small"
                                            />
                                        </TableCell>
                                        <TableCell>
                                            <Typography variant="body2" color="text.secondary">
                                                {formatDate(user.createdAt)}
                                            </Typography>
                                        </TableCell>
                                        <TableCell>
                                            <Typography variant="body2" color="text.secondary">
                                                {user.lastLogin ? formatDate(user.lastLogin) : 'Never'}
                                            </Typography>
                                        </TableCell>
                                        <TableCell sx={{ textAlign: 'center' }}>
                                            <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center' }}>
                                                <IconButton
                                                    size="small"
                                                    onClick={() => handleEditClick(user)}
                                                    sx={{ color: '#3b82f6' }}
                                                >
                                                    <Edit size={16} />
                                                </IconButton>
                                                <IconButton
                                                    size="small"
                                                    onClick={(e) => handleMenuOpen(e, user)}
                                                >
                                                    <MoreVertical size={16} />
                                                </IconButton>
                                            </Box>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>

                {totalPages > 1 && (
                    <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
                        <Pagination
                            count={totalPages}
                            page={page + 1}
                            onChange={handlePageChange}
                            color="primary"
                        />
                    </Box>
                )}
            </Paper>

            {/* Action Menu */}
            <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}
            >
                <MenuItem onClick={() => handleEditClick(selectedUser)}>
                    <Edit size={16} style={{ marginRight: 8 }} />
                    Edit User
                </MenuItem>
                <MenuItem
                    onClick={() => handleDeleteClick(selectedUser)}
                    sx={{ color: 'error.main' }}
                >
                    <Trash2 size={16} style={{ marginRight: 8 }} />
                    Delete User
                </MenuItem>
            </Menu>

            <Dialog open={addDialogOpen} onClose={handleAddDialogClose} maxWidth="md" fullWidth>
                <form onSubmit={handleAddUser}>
                    <DialogTitle>Add New User</DialogTitle>
                    <DialogContent>
                        {formError && (
                            <Alert severity="error" sx={{ mb: 2 }}>
                                {formError}
                            </Alert>
                        )}

                        <Grid container spacing={2} sx={{ mt: 1 }}>
                            <Grid item xs={12} md={6}>
                                <TextField
                                    fullWidth
                                    required
                                    label="Full Name"
                                    name="fullName"
                                    value={formData.fullName}
                                    onChange={handleFormChange}
                                    helperText="Enter the user's full name"
                                />
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <TextField
                                    fullWidth
                                    required
                                    label="ID Number"
                                    name="idNumber"
                                    value={formData.idNumber}
                                    onChange={handleFormChange}
                                    inputProps={{ maxLength: 13, pattern: "[0-9]{13}" }}
                                    helperText="Must be exactly 13 digits"
                                    error={formData.idNumber.length > 0 && formData.idNumber.length !== 13}
                                />
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <TextField
                                    fullWidth
                                    required
                                    type="email"
                                    label="Email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleFormChange}
                                    helperText="Valid email address"
                                />
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <TextField
                                    fullWidth
                                    required
                                    label="Username"
                                    name="username"
                                    value={formData.username}
                                    onChange={handleFormChange}
                                    helperText="Unique username for login"
                                />
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <TextField
                                    fullWidth
                                    required
                                    label="Phone"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleFormChange}
                                    helperText="10-15 digits (e.g., 0123456789)"
                                    placeholder="0123456789"
                                />
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <TextField
                                    fullWidth
                                    required
                                    type="password"
                                    label="Password"
                                    name="password"
                                    value={formData.password}
                                    onChange={handleFormChange}
                                    inputProps={{ minLength: 8 }}
                                    helperText="Minimum 8 characters"
                                    error={formData.password.length > 0 && formData.password.length < 8}
                                />
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <TextField
                                    fullWidth
                                    type="date"
                                    label="Date of Birth"
                                    name="dateOfBirth"
                                    value={formData.dateOfBirth}
                                    onChange={handleFormChange}
                                    InputLabelProps={{ shrink: true }}
                                    helperText="Optional"
                                />
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <Alert severity="info" sx={{ height: '100%', display: 'flex', alignItems: 'center' }}>
                                    New users will be created with USER role by default
                                </Alert>
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    multiline
                                    rows={2}
                                    label="Address"
                                    name="address"
                                    value={formData.address}
                                    onChange={handleFormChange}
                                    helperText="Optional"
                                />
                            </Grid>
                        </Grid>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleAddDialogClose} disabled={formLoading}>
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            variant="contained"
                            disabled={formLoading}
                        >
                            {formLoading ? <CircularProgress size={24} /> : 'Add User'}
                        </Button>
                    </DialogActions>
                </form>
            </Dialog>

            {/* Edit User Dialog */}
            <Dialog open={editDialogOpen} onClose={handleEditDialogClose} maxWidth="md" fullWidth>
                <form onSubmit={handleUpdateUser}>
                    <DialogTitle>Edit User</DialogTitle>
                    <DialogContent>
                        {editError && (
                            <Alert severity="error" sx={{ mb: 2 }}>
                                {editError}
                            </Alert>
                        )}

                        <Grid container spacing={2} sx={{ mt: 1 }}>
                            <Grid item xs={12} md={6}>
                                <TextField
                                    fullWidth
                                    required
                                    label="Full Name"
                                    name="fullName"
                                    value={editFormData.fullName}
                                    onChange={handleEditFormChange}
                                />
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <TextField
                                    fullWidth
                                    required
                                    type="email"
                                    label="Email"
                                    name="email"
                                    value={editFormData.email}
                                    onChange={handleEditFormChange}
                                />
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <TextField
                                    fullWidth
                                    required
                                    label="Username"
                                    name="username"
                                    value={editFormData.username}
                                    onChange={handleEditFormChange}
                                />
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <TextField
                                    fullWidth
                                    required
                                    label="Phone"
                                    name="phone"
                                    value={editFormData.phone}
                                    onChange={handleEditFormChange}
                                />
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <TextField
                                    fullWidth
                                    type="date"
                                    label="Date of Birth"
                                    name="dateOfBirth"
                                    value={editFormData.dateOfBirth}
                                    onChange={handleEditFormChange}
                                    InputLabelProps={{ shrink: true }}
                                />
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <TextField
                                    fullWidth
                                    select
                                    label="Role"
                                    name="role"
                                    value={editFormData.role}
                                    onChange={handleEditFormChange}
                                >
                                    <MenuItem value="USER">User</MenuItem>
                                    <MenuItem value="ADMIN">Admin</MenuItem>
                                </TextField>
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <TextField
                                    fullWidth
                                    select
                                    label="Status"
                                    name="status"
                                    value={editFormData.status}
                                    onChange={handleEditFormChange}
                                >
                                    <MenuItem value="ACTIVE">Active</MenuItem>
                                    <MenuItem value="PENDING">Pending</MenuItem>
                                    <MenuItem value="SUSPENDED">Suspended</MenuItem>
                                </TextField>
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    multiline
                                    rows={2}
                                    label="Address"
                                    name="address"
                                    value={editFormData.address}
                                    onChange={handleEditFormChange}
                                />
                            </Grid>
                        </Grid>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleEditDialogClose} disabled={editLoading}>
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            variant="contained"
                            disabled={editLoading}
                        >
                            {editLoading ? <CircularProgress size={24} /> : 'Update User'}
                        </Button>
                    </DialogActions>
                </form>
            </Dialog>

            <Dialog open={deleteDialogOpen} onClose={handleDeleteDialogClose} maxWidth="sm" fullWidth>
                <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <AlertTriangle size={24} color="#ef4444" />
                    Confirm Delete
                </DialogTitle>
                <DialogContent>
                    <Alert severity="warning" sx={{ mb: 2 }}>
                        This action cannot be undone!
                    </Alert>
                    <Typography>
                        Are you sure you want to delete the user <strong>{userToDelete?.displayName || userToDelete?.fullName}</strong>?
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                        Email: {userToDelete?.email}
                    </Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleDeleteDialogClose} disabled={deleteLoading}>
                        Cancel
                    </Button>
                    <Button
                        onClick={handleConfirmDelete}
                        variant="contained"
                        color="error"
                        disabled={deleteLoading}
                    >
                        {deleteLoading ? <CircularProgress size={24} /> : 'Delete User'}
                    </Button>
                </DialogActions>
            </Dialog>

            <Snackbar
                open={snackbar.open}
                autoHideDuration={6000}
                onClose={handleCloseSnackbar}
                anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
            >
                <Alert
                    onClose={handleCloseSnackbar}
                    severity={snackbar.severity}
                    variant="filled"
                    sx={{ width: '100%' }}
                >
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </Box>
    );
};

export default ManageUsers;