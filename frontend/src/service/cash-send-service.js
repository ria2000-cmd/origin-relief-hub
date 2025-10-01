import httpCommon from "./http-common";

const CashSendService = {
    sendCash: (data) => {
        return httpCommon.post('/cash-send/send', data);
    },

    cashSendHistory: () => {
        return httpCommon.get('/cash-send/history')
    }

};

export default CashSendService