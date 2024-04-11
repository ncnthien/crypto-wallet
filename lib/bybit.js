const { RestClientV5 } = require("bybit-api");

const client = new RestClientV5({
  key: process.env.BYBIT_API_KEY,
  secret: process.env.BYBIT_SECRET_KEY,
  testnet: false,
});

module.exports = { 
  BybitWallet: {
    getListCurrency: async () => {
      const response = await client.getWalletBalance({
        accountType: "UNIFIED",
      });
      return response.result.list[0].coin.map((currency) => ({
        name: currency.coin,
        amount: Number(currency.walletBalance),
      }));
    }
  }
};
