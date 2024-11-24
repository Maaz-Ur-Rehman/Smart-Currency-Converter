const mongoose = require("mongoose");

const currencySchema = new mongoose.Schema({
  baseCurrency: String,
  targetCurrency: String,
  baseAmount: Number,
  convertedAmount: Number,
  timestamp: { type: Date, default: Date.now },
});

export const Currency = mongoose.model("Currency", currencySchema);