import httpCommon from "./http-common";

const AdminService = {
    getAllUsers() {
        return httpCommon.get('/admin/users');
    },
    createUser(userData) {
        return httpCommon.post('/add/users', userData);
    },
    deleteUser(userId) {
        return httpCommon.delete(`/admin/delete/${userId}`);
    },
    updateUser(userId, data) {
        return httpCommon.put(`/admin/users/${userId}`, data);
    }
};

export default AdminService;