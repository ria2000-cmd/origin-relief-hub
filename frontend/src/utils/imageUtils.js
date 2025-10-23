export const getProfilePhotoUrl = (profilePhotoPath) => {
    if (!profilePhotoPath) {
        return null;
    }

    const baseUrl = process.env.REACT_APP_API_URL || 'http://localhost:8083';

    return `${baseUrl}/profile_pictures/${profilePhotoPath}`;
};