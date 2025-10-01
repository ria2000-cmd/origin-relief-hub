import httpCommon from "./http-common";

const WithdrawService = {
    withdraw: (data) => {
        return httpCommon.post('/withdraw', data);
    },

    getHistory: () => {
        return httpCommon.get('/withdraw/history');
    }

};

export default WithdrawService