import httpCommon from "./http-common";

const getUserProfile = () => {
    return httpCommon.get('/getProfile');
};

const updateUserProfile = (personalDetails, profilePhoto = null) => {
    const formData = new FormData();

    if (profilePhoto) {
        formData.append('profilePhoto', profilePhoto);
    }

    const updateDto = {
        firstName: personalDetails.firstName,
        lastName: personalDetails.lastName,
        email: personalDetails.email,
        phoneNumber: personalDetails.phone,
        address: personalDetails.address,
        dateOfBirth: personalDetails.dateOfBirth,
        idNumber: personalDetails.idNumber,
        username: personalDetails.username
    };

    formData.append('updateDto', new Blob([JSON.stringify(updateDto)], {
        type: 'application/json'
    }));


    return httpCommon.put('/update/profile', formData, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    });
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