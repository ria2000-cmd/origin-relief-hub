import httpCommon from "./http-common";

const register = (data) => {
    return httpCommon.post('/auth/register', data);
};
const login = (data) => {
    return httpCommon.post('/auth/login', data);
};


export default {login, register}