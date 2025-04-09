const mongoose = require('mongoose');
const { Schema } = require('mongoose');

const WalletSchema = new Schema({
  userId: { type: String, required: true },
  chatId: { type: Number, required: true },
  publicKey: { type: String, required: true },
  privateKey: { type: String, required: true },
  referral: [
    {
      chatId: Number,
      username: String,
      payAmount: Number
    }

  ],
  followXAccount: [
    {
      xaccount: String,
      status: String
    }
  ],
  referralWallet: { type: String },
  buyAmount: { type: Number, default: 0.005, },
  slippage: { type: Number, default: 25, },
  selltype: { type: String, default: `all` },
  stopLoss: { type: Number, default: 2, },
  takeProfit: { type: Number, default: 5, },
  jitoTip: { type: Number, default: 500000, },
});

const Wallet = mongoose.model("Wallet", WalletSchema);

module.exports = Wallet;