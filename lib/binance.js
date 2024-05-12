const { MainClient } = require("binance");

const client = new MainClient({
  api_key: process.env.BINANCE_API_KEY,
  api_secret: process.env.BINANCE_SECRET_KEY,
});

module.exports = { 
  BinanceClient: client,
  BinanceWallet: {
    getListCurrency: async () => {
      const response = await client.getAccountInformation();
      return response.balances.map((currency) => ({
        name: currency.asset,
        amount: Number(currency.free) + Number(currency.locked),
      }));
    },
  }
};

