import httpCommon from "./http-common";

const ElectricityService = {
    purchaseElectricity: (data) => {
        return httpCommon.post('/electricity/purchase', data);
    },
    electricityHistory: () => {
        return httpCommon.get('/electricity/history')
    }
};

export default ElectricityService;