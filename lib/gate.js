const { ApiClient, SpotApi, WalletApi } = require("gate-api");

const GATE_API_KEY = process.env.GATE_API_KEY;
const GATE_API_SECRET = process.env.GATE_SECRET_KEY;

const client = new ApiClient();
client.setApiKeySecret(GATE_API_KEY, GATE_API_SECRET);

module.exports = { 
  GateWallet : {
    getListCurrency: async () => {
      const api = new SpotApi(client);
      const response = await api.listSpotAccounts({});
      const formatedResponse = response.body.map((currency) => ({
        name: currency.currency,
        amount: Number(currency.available) + Number(currency.locked),
      }));
      return formatedResponse;
    },
    getTotalBalance: async () => {
      const api = new WalletApi(client);
      const res = await api.getTotalBalance({});
      return res.body.total.amount;
    },
  }
};
