# Catapult take home project

## Contents

1. How to run
2. Scope
3. General thought process
4. Missing information
5. Error checks
6. Limitations are improvements

## How to run

In the project directory, you can run:

### `npm run dev`

Runs the app in the development mode.\

The page will reload if you make edits.\
You will also see any lint errors in the console.

### `npm run build`

Builds the app for production to the `dist` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

## General Thought process

My initial steps are:

1. Research competitors / look and feel of inputs
2. Research UI/UX best practise
3. Research Black-Scholes / Options / Option pricing
4. Select design toolkit for UI/UX
5. Create form with basic validation
6. Connect API to binance for price information and validation
7. Inferring missing token information
8. Black-Scholes checks

## General scope

On load, the page fetches data from Binance (exchange info, price data and volatility) for each token.

Then, the user can input their desired trade as per the task outline. If there are any errors, the user is informed with a notification.

If the token is missing, it is 'guessed' and the suggestion is proposed to the user.

If the trade seems unusual, the user is warned / prompted and given a choice to halt the trade.

If all checks pass, the trade goes ahead.

## Missing information

Due to time constaints of this project a simple yet effective solution to find infer missing token information is presented. You can read the algorithm in `src/utils/token-search.ts`

For Spot trades, the list of all possible tokens is filtered based on a variety of factors (including min/max notional, min/max prices etc.). Then, the token that is closest in price to the spot price is suggested to the user.

For Option trades, the list of all tokens is filtered based on those that are a certain tolerance from the strike price (tolerances can be found in `/src/utils/constants.ts`). Then, the token that is closest in premium price (based on Black-Scholes estimate) to the premium from the user is suggested.

## Error checks

There are several error checking mechanisms that happen at different stages of the user journey.
They can be broken down into two main categories:

1. Incorrect data by the user
2. Warnings to the user

3. The form will find and highlight errors by the user as well as give them a detailed written explanation as to why there is an error. These can be found in `src/components/forms/main-form/validation.ts.`. Here are all the checks currently performed:

- Check all values are not null / undefined
- Check expiration date is not in the past for options
- Check min notional value is less than max notional
- Check order value less than max notional and more than min notional

2. The user is presented warnings if their pricing is far off from the predicted price. For Spot prices, this is if their price is a certain percentage more than the actual price obtained from Binance. For options, this is if their premium is a certain percentage off from a predicted premium. Tolerances can be adjusted in `/src/utils/constants.ts`

## Limitations and improvements

Whilst this approach is effective in simple cases, it has a number of limitations and improvements for the future.

1. Estimating volatility is poor at the moment. Currently, the `estimateDailyVolatility` function in `black-scholes.ts` is very crudely estimated; it only has the data available from the past 24hrs from Binance, so cannot estimate very well. I would suggest a) using implied volatilities from other exchanges. BTC volatility can even be used to estimate that of other coins as they are strongly linked b) check option prices against those listed elsewhere (e.g., https://www.tradingview.com/symbols/CME-BTC1!/options/?contract=BTCK2024) c) store coin data ourselves on our backend servers and accurately calculate volatility daily.

2. Regularly refresh data. Currently data is only loaded at page load. Ideally this should refresh every X seconds to prevent slippage.

3. Allow users to adjust tolerances for warnings.

### Specific questions

Question: A brief explanation of how you would scale your solution if instead we were checking 1 million+ trades per second.

Answer: Currently, as trades all are being check on a front-end, each user does their own computation and this isn't an issue. However, It is likely (as suggested above) that we may need to do some server-side processing ourselves. If that is the case, several changes will need to occur to prevent issues:

1. Storing last X days of data on our servers from Binance and other sources. If we keep calling Binance's (or anyone's) API for every trade, we will hit the limit very quickly. Instead, we should regularly call it every X minutes and update our information.
2. Process information in advance to avoid duplicate computation. We can calculate best Option prices at regular intervals and store this as an estimate for user sense checks. We can also calculate historical volatilities of tokens more accurately.
3. Indexing tokens stored on our database. Currently, when we suggest a token, we sort a list of tokens by certain values. Creating an index on these values will rapidly speed up these searches.
