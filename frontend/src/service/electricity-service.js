import httpCommon from "./http-common";

const ElectricityService = {
    purchaseElectricity: (data) => {
        return httpCommon.post('/electricity/purchase', data);
    },

    getBalance: () => {
        return httpCommon.get('/withdrawals/balance');
    },

    getPurchaseHistory: (limit = 10) => {
        return httpCommon.get(`/electricity/history?limit=${limit}`);
    },

    calculateUnits: (amount) => {
        return httpCommon.get(`/electricity/calculate-units?amount=${amount}`);
    }
};

export default ElectricityService;