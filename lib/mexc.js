const Mexc = require("mexc-api-sdk");

const mexcClient = new Mexc.Spot(
  process.env.MEXC_API_KEY,
  process.env.MEXC_SECRET_KEY,
)

module.exports = {
  MexcClient: mexcClient,
  MexcWallet: {
    getListCurrency: async () => {
      const response = await mexcClient.accountInfo();

      return response.balances.map(
        (currency) => ({
          name: currency.asset,
          amount: Number(currency.free) + Number(currency.locked),
        }),
      );
    },
  }
};

