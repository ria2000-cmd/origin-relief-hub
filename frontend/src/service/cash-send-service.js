import httpCommon from "./http-common";

const CashSendService = {
    sendCash: (data) => {
        return httpCommon.post('/cash-send/send', data);
    },

    getBalance: () => {
        return httpCommon.get('cash-send/calculate-cost');
    }
};

export default {CashSendService}