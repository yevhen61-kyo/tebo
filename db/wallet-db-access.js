const CopyTradingHistory = require("../models/copyTradingHistory");
const Wallet = require("../models/Wallet");
const TargetWallet = require('./../models/targetWallet');
const chalk = require('chalk');
const AdminWallet = require('./../models/adminWallet')
const Red = (str) => console.log(chalk.red.bold(str));


const WalletDBAccess = {
    referallUserConfirm: async (chatId) => {
        try {
            const myWallet = await Wallet.findOne({ chatId });
            console.log(`${myWallet.publicKey} === ${myWallet.referralWallet}`)
            if (myWallet.publicKey === myWallet.referralWallet) {
                return false;
            }
            else true;

        } catch (error) {
            Red(`referallUserConfirm ====🚀${error}`);
        }

    },

    saveAdminWallet: async (adminWallet) => {
        try {
            await AdminWallet.create({ adminWallet });
            return true;
        } catch (error) {
            Red(`saveAdminWallet ====🚀${error}`);
            return false;
        }
    },
    findAdminWallet: async (adminWallet) => {
        try {
            const result = await AdminWallet.find({ adminWallet });
            return result;
        } catch (error) {
            Red(`saveWallet ====🚀${error}`);
            return false;
        }
    },

    findWallet: async (chatId) => {
        try {
            let wallet = await Wallet.find({ chatId });
            if (wallet.length > 0) {
                return wallet[0];
            } else {
                return false;
            }
        } catch (error) {
            Red(`findWallet ====🚀${error}`);
        }
    },

    saveXWallet: async (chatId, xaccount) => {
        try {
            await Wallet.findOneAndUpdate({ chatId }, xaccount);
            return true;
        } catch (error) {
            Red(`saveXWallet ====🚀${error}`);
            return false;
        }
    },

    deleteWallet: async (chatId) => {
        try {
            await Wallet.deleteOne({ chatId });
            return true;
        } catch (error) {
            Red(`deleteWallet ====🚀${error}`);
            return false;
        }
    },

    deleteItemInArray: async (chatId, item) => {
        try {
            let result = await Wallet.find({ chatId });
            result = result[0].followXAccount.filter((x) => x.xaccount != item);

            await Wallet.updateOne({ chatId }, { followXAccount: result });
            return result;
        } catch (error) {
            Red(`deleteItemInArray ====🚀${error}`);
            return false;
        }
    },


    saveWallet: async (userId, chatId, publicKey, privateKey) => {
        try {

            const newWalletInfo = {
                userId: userId,
                chatId: chatId,
                publicKey: publicKey,
                privateKey: privateKey,
                referralWallet: publicKey,
            }
            await Wallet.create(newWalletInfo);
            return true;
        } catch (error) {
            Red(`saveWallet ====🚀${error}`);
            return false;
        }
    },

    findOneAndUpdateWallet: async (chatId, changeInfo) => {
        try {
            await Wallet.findOneAndUpdate({ chatId }, changeInfo);
            return true;
        } catch (error) {
            Red(`saveWallet ====🚀${error}`);
            return false;
        }
    },

    saveTargetWallet: async (chatId, address, name) => {
        try {
            const newWalletInfo = {
                chatId: chatId,
                address: address,
                name: name
            }
            await TargetWallet.create(newWalletInfo);
            return true;
        } catch (error) {
            Red(`saveTargetWallet ====🚀${error}`);
            return false;
        }
    },

    findTargetWallet: async (chatId, address) => {
        try {
            let wallet = await TargetWallet.find({ chatId, address });
            if (wallet.length > 0) {
                return wallet[0];
            } else {
                return false;
            }
        } catch (error) {
            Red(`findTargetWallet ====🚀${error}`);
        }
    },

    findAllSubscribersTargetWallet: async () => {
        try {
            let wallet = await TargetWallet.find({});
            if (wallet.length > 0) {
                return wallet;
            } else {
                return false;
            }
        } catch (error) {
            Red(`findAllSubscribersTargetWallet ====🚀${error}`);
        }
    },

    findAllTargetWallet: async (chatId) => {
        try {
            let wallet = await TargetWallet.find({ chatId });
            if (wallet.length > 0) {
                return wallet;
            } else {
                return false;
            }
        } catch (error) {
            Red(`findAllTargetWallet ====🚀${error}`);
        }
    },

    deleteTargetWallet: async (chatId, address) => {
        try {
            await TargetWallet.deleteOne({ chatId, address });
            return true;
        } catch (error) {
            Red(`deleteTargetWallet ====🚀${error}`);
            return false
        }
    },

    statusUpdateTargetWallet: async (chatId, address, status) => {
        try {
            if (status === `true`) {
                status = `false`;
            }
            else if (status === `false`) status = `true`;
            await TargetWallet.findOneAndUpdate({ address, chatId }, { status: status });
        } catch (error) {
            Red(`statusUpdateTargetWallet ====🚀${error}`);
        }
    },

    saveCopyTradingHistory: async (userId, chatId, sendToken, receiveToken, myWallet, whaleWallet) => {
        try {
            const newTradingInfo = {
                userId: userId,
                chatId: chatId,
                sendToken: sendToken,
                receiveToken: receiveToken,
                myWallet: myWallet,
                whaleWallet: whaleWallet,
            }
            await CopyTradingHistory.create(newTradingInfo);
            return true;
        } catch (error) {
            Red(`saveCopyTradingHistory ====🚀${error}`);
            return false;
        }
    },

    findCopyTradingHistory: async (chatId) => {
        try {
            let result = await CopyTradingHistory.find({ chatId });
            if (result.length > 0) {
                return result;
            } else {
                return false;
            }
        } catch (error) {
            Red(`findCopyTradingHistory ====🚀${error}`);
        }
    },

    addReferalUser: async (chatId, userInfo) => {
        try {
            await Wallet.updateOne(
                { chatId: chatId },
                { $addToSet: { referral: userInfo } }
            );
            return true;
        } catch (error) {
            Red(`addReferalUser ====🚀${error}`);
        }
    }

}

module.exports = WalletDBAccess;
