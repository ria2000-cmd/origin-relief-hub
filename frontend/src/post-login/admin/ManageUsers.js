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
    Alert
} from '@mui/material';
import {
    Search,
    Plus,
    Edit,
    Trash2,
    MoreVertical,
    Filter,
    Download
} from 'lucide-react';

const ManageUsers = () => {
    const [users, setUsers] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterRole, setFilterRole] = useState('All');
    const [anchorEl, setAnchorEl] = useState(null);
    const [selectedUser, setSelectedUser] = useState(null);

    useEffect(() => {
        // Load users from API or mock data
        const mockUsers = [
            {
                id: 1,
                name: 'John Doe',
                email: 'john.doe@example.com',
                role: 'User',
                status: 'Active',
                joinDate: '2024-01-15',
                lastLogin: '2024-03-10'
            },
            {
                id: 2,
                name: 'Jane Smith',
                email: 'jane.smith@example.com',
                role: 'Admin',
                status: 'Active',
                joinDate: '2023-12-01',
                lastLogin: '2024-03-12'
            },
            {
                id: 3,
                name: 'Bob Johnson',
                email: 'bob.johnson@example.com',
                role: 'User',
                status: 'Inactive',
                joinDate: '2024-02-20',
                lastLogin: '2024-02-25'
            },
            {
                id: 4,
                name: 'Alice Brown',
                email: 'alice.brown@example.com',
                role: 'User',
                status: 'Active',
                joinDate: '2024-03-01',
                lastLogin: '2024-03-11'
            },
        ];
        setUsers(mockUsers);
    }, []);

    const handleMenuOpen = (event, user) => {
        setAnchorEl(event.currentTarget);
        setSelectedUser(user);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
        setSelectedUser(null);
    };

    const handleEdit = (user) => {
        console.log('Edit user:', user);
        handleMenuClose();
    };

    const handleDelete = (user) => {
        console.log('Delete user:', user);
        setUsers(users.filter(u => u.id !== user.id));
        handleMenuClose();
    };

    const filteredUsers = users.filter(user => {
        const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.email.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesRole = filterRole === 'All' || user.role === filterRole;
        return matchesSearch && matchesRole;
    });

    const getStatusColor = (status) => {
        return status === 'Active' ? 'success' : 'default';
    };

    const getRoleColor = (role) => {
        return role === 'Admin' ? 'primary' : 'secondary';
    };

    return (
        <Box>
            {/* Header Section */}
            <Typography variant="h4" fontWeight="bold" sx={{ color: '#facc15', mb: 1 }}>
                Manage Users
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
                View, edit, and manage all system users
            </Typography>

            {/* Action Bar */}
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
                            <MenuItem value="Admin">Admin</MenuItem>
                            <MenuItem value="User">User</MenuItem>
                        </TextField>
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
                            <Button
                                variant="outlined"
                                startIcon={<Download size={16} />}
                                sx={{ textTransform: 'none' }}
                            >
                                Export
                            </Button>
                            <Button
                                variant="gold"
                                startIcon={<Plus size={16} />}
                                sx={{ textTransform: 'none' }}
                            >
                                Add New User
                            </Button>
                        </Box>
                    </Grid>
                </Grid>
            </Paper>

            {/* Users Count */}
            <Alert severity="info" sx={{ mb: 3 }}>
                Showing {filteredUsers.length} of {users.length} users
            </Alert>

            {/* Users Table */}
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
                                        key={user.id}
                                        sx={{
                                            '&:hover': { bgcolor: '#f8fafc' },
                                            transition: 'background-color 0.2s ease'
                                        }}
                                    >
                                        <TableCell>
                                            <Typography variant="body2" fontWeight={500}>
                                                {user.name}
                                            </Typography>
                                        </TableCell>
                                        <TableCell>
                                            <Typography variant="body2" color="text.secondary">
                                                {user.email}
                                            </Typography>
                                        </TableCell>
                                        <TableCell>
                                            <Chip
                                                label={user.role}
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
                                                {new Date(user.joinDate).toLocaleDateString()}
                                            </Typography>
                                        </TableCell>
                                        <TableCell>
                                            <Typography variant="body2" color="text.secondary">
                                                {new Date(user.lastLogin).toLocaleDateString()}
                                            </Typography>
                                        </TableCell>
                                        <TableCell sx={{ textAlign: 'center' }}>
                                            <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center' }}>
                                                <IconButton
                                                    size="small"
                                                    onClick={() => handleEdit(user)}
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
            </Paper>

            {/* Action Menu */}
            <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}
            >
                <MenuItem onClick={() => handleEdit(selectedUser)}>
                    <Edit size={16} style={{ marginRight: 8 }} />
                    Edit User
                </MenuItem>
                <MenuItem
                    onClick={() => handleDelete(selectedUser)}
                    sx={{ color: 'error.main' }}
                >
                    <Trash2 size={16} style={{ marginRight: 8 }} />
                    Delete User
                </MenuItem>
            </Menu>
        </Box>
    );
};

export default ManageUsers;