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

    getBalanceBySassaId: (sassaAccountId) => {
        return httpCommon.get(`/sassa-accounts/${sassaAccountId}/balance`);
    },

    getSassaBalance: async () => {
        try {
            const accountResponse = await httpCommon.get('/sassa-accounts/active');

            if (accountResponse.data && accountResponse.data.sassaAccountId) {

                const balanceResponse = await httpCommon.get(
                    `/sassa-accounts/${accountResponse.data.sassaAccountId}/balance`
                );

                return {
                    success: true,
                    balance: balanceResponse.data.data,
                    sassaAccountId: accountResponse.data.sassaAccountId
                };
            }

            return {
                success: false,
                balance: 0,
                error: 'No active SASSA account found'
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