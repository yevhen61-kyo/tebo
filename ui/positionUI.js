const PositionUI = {
    depositPage: () => {
        const title = `
        Check your tokens & trade positions 📈
        `;
        const button = [
            [
                { text: `My Tokens 💰`, callback_data: `my_tokens` },
                { text: `My Trades 📊`, callback_data: `my_trades` }
            ],
            // [
            //     { text: `Trade History📊`, callback_data: `trade_history` }
            // ],
            // [
            //     { text: `Trade Config⚙️`, callback_data: `trade_config` }
            // ],
            [
                { text: `Back 🔙`, callback_data: `back` }
            ]
        ];
        return { title, button };
    },

    myTokensPage: (token, currentPageNumber) => {

        const title = `Click token to start selling
${token.name}:
<code>${token.mint}</code>
Amount/Price/Value:     <code>${token.amount}</code> / $<code>${Number(token.price).toFixed(3)}</code> / $<code>${(Number(token.price) * token.amount).toFixed(2)}</code>

Current page ${currentPageNumber + 1} pages`

        const button = [
            [
                { text: `Buy 🎯`, callback_data: `token_buy` },
                { text: `Sell & Manage 🛠`, callback_data: `sell_manage_page` }
            ],
            [
                { text: `Prev`, callback_data: `my_token_prev-${currentPageNumber - 1}` },
                { text: `${currentPageNumber + 1}`, callback_data: `page_number` },
                { text: `Next`, callback_data: `my_token_next-${currentPageNumber + 1}` }
            ],
            [
                { text: `Refresh♻️`, callback_data: `refresh_${token.name}` }
            ],
            [
                { text: `Back 🔙`, callback_data: `position_back` }
            ]
        ];

        return { title, button };
    },

    myTokensEmptyPage: () => {
        const title = ` 🚫You have no tokens.`;
        const button = [
            [
                { text: `Buy 🎯`, callback_data: `token_buy` },
                { text: `Sell & Manage 🛠`, callback_data: `sell_manage_page` }
            ],
            [
                { text: `Prev`, callback_data: `my_token_prev_empty` },
                { text: `0`, callback_data: `page_number` },
                { text: `Next`, callback_data: `my_token_next_empty` }
            ],
            // [
            //     { text: `Refresh♻️`, callback_data: `refresh_` }
            // ],
            [
                { text: `Back 🔙`, callback_data: `position_back` }
            ]
        ];

        return { title, button };
    },

    myTokensBuyAndSellPage: (token, currentPageNumber) => {
        const title = `🪙Coin:              ${token.name}
📊Amount:       ${token.amount}
📈Price:            ${Number(token.price)}$
📊Value:            ${(token.amount * Number(token.price)).toFixed(2)}$
👇 Token Address 👇
<code>${token.mint}</code>
Check the token on  <a href="https://dexscreener.com/solana/${token.mint}" >DexScreener</a>

Current page ${currentPageNumber + 1} pages`;
        const button = [
            [
                { text: `Buy X SOL`, callback_data: `current_token_buy_${token.mint}` },
                { text: `Sell X %`, callback_data: `current_token_sell_${token.mint}` }
            ],
            [
                { text: `Prev`, callback_data: `my_token_sell_prev-${currentPageNumber - 1}` },
                { text: `${currentPageNumber + 1}`, callback_data: `page_number` },
                { text: `Next`, callback_data: `my_token_sell_next-${currentPageNumber + 1}` }
            ],
            // [
            //     { text: `Burn 🔥`, callback_data: `burn_${token.mint}` }
            // ],
            [
                { text: `Back 🔙`, callback_data: `position_back` }
            ]
        ];

        return { title, button };
    },
    myTokensBurnPage: (currentAmount, tokenAddress) => {
        const title = `If you confirm you will lose your tokens and claim ${currentAmount} SOL
Your burn transaction will be processed at the slowest speed, we don’t want to burn big transaction fee money.
Click “Yes” or “No” below to confirm your burn ⬇️`;
        const button = [
            [
                { text: `Yes✅`, callback_data: `token_burn_yes_${tokenAddress}` },
                { text: `No❌`, callback_data: `token_burn_no` }
            ],
        ];

        return { title, button };
    },
    myTradesPage: (trade, currentPageNumber) => {
        const title = `
🚨Price at 🔥2X 🔥

🪙Coin: ${trade.tokenName}
📈Current Price: ${trade.currentPrice}$
💳Wallet: ${trade.myWallet}
👑Copy Trader: ${trade.copyWallet}

Current page ${currentPageNumber + 1} pages
`;
        const button = [

            [
                { text: `Prev⬅️`, callback_data: `my_trade_result_prev-${currentPageNumber - 1}` },
                { text: `${currentPageNumber + 1}`, callback_data: `page_number` },
                { text: `Next➡️`, callback_data: `my_trade_result_next-${currentPageNumber + 1}` }
            ],

            [
                { text: `Back 🔙`, callback_data: `position_back` }
            ]
        ];

        return { title, button };
    },
    myTradesEmptyPage: () => {
        const title = ` 🚫You have no Trading History.`;

        const button = [

            [
                { text: `Prev⬅️`, callback_data: `my_trade_result_prev-empty` },
                { text: `0`, callback_data: `page_number` },
                { text: `Next➡️`, callback_data: `my_trade_result_next-empty` }
            ],

            [
                { text: `Back 🔙`, callback_data: `position_back` }
            ]
        ];
        return { title, button };
    },
}

module.exports = PositionUI;