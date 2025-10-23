import httpCommon from "./http-common";

const SassaService = {
    linkSassaAccount: (data) => {
        return httpCommon.post('/sassa-accounts/link', data);
    },

    getActiveSassaAccount: () => {
        return httpCommon.get('/sassa-accounts/active');
    },

    unlinkSassaAccount: (accountId) => {
        return httpCommon.delete(`/sassa-accounts/${accountId}/unlink`);
    },

    getUserBalance: () => {
        return httpCommon.get('/user/balance');
    },

    getSassaBalance: async () => {
        try {
            const balanceResponse = await httpCommon.get(`sassa-accounts/${accountId}/balance`);

            if (balanceResponse.data && balanceResponse.data.success) {
                return {
                    success: true,
                    balance: balanceResponse.data.balance,
                    pendingBalance: balanceResponse.data.pendingBalance,
                    totalReceived: balanceResponse.data.totalReceived,
                    totalWithdrawn: balanceResponse.data.totalWithdrawn
                };
            }

            return {
                success: false,
                balance: 0,
                error: 'Failed to fetch balance'
            };

        } catch (error) {
            return {
                success: false,
                balance: 0,
                error: error.response?.data?.message || 'Failed to fetch balance'
            };
        }
    }
};

export default SassaService;