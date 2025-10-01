import httpCommon from "./http-common";

const getUserProfile = () => {
    return httpCommon.get('/getProfile');
};

const updateUserProfile = (data) => {
    return httpCommon.put('/update/profile', data);
};

const changePassword = (data) => {
    return httpCommon.post('/update/password', data);
};

const updateUserPreferences = (data) => {
    return httpCommon.put('/user/preferences', data);
};

const getUserPreferences = () => {
    return httpCommon.get('/user/preferences');
};

const uploadProfilePicture = (formData) => {
    return httpCommon.post('/user/profile-picture', formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
};

export default {
    getUserProfile,
    updateUserProfile,
    changePassword,
    updateUserPreferences,
    getUserPreferences,
    uploadProfilePicture
};