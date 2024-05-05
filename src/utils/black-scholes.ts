import cdf from "@stdlib/stats-base-dists-normal-cdf"
import { BinanceSymbol } from "../types/binance"

export function calculateCallPriceFromBlackScholes(
  strikePrice: number,
  stockPrice: number,
  dailyVolatility: number,
  expirationDate: Date,
  riskFreeInterestRate: number = 0.05
) {
  //Calculate time difference in years
  const timeDifference =
    (expirationDate.valueOf() - Date.now()) * 3.1709 * Math.pow(10, -11)

  const volatility = Math.sqrt(timeDifference * 365.25) * dailyVolatility

  const d1 = calculateD1(
    strikePrice,
    stockPrice,
    volatility,
    timeDifference,
    riskFreeInterestRate
  )
  const d2 = calculateD2(
    strikePrice,
    stockPrice,
    volatility,
    timeDifference,
    riskFreeInterestRate
  )

  const callPrice =
    stockPrice * N(d1) -
    strikePrice * N(d2) * Math.exp(-riskFreeInterestRate * timeDifference)

  return callPrice
}

export function calculatePutPriceFromBlackScholes(
  strikePrice: number,
  stockPrice: number,
  dailyVolatility: number,
  expirationDate: Date,
  riskFreeInterestRate: number = 0.05
) {
  //Calculate time difference in years
  const timeDifference =
    (expirationDate.valueOf() - Date.now()) * 3.1709 * Math.pow(10, -11)

  const volatility = Math.sqrt(timeDifference * 365.25) * dailyVolatility

  const d1 = calculateD1(
    strikePrice,
    stockPrice,
    volatility,
    timeDifference,
    riskFreeInterestRate
  )
  const d2 = calculateD2(
    strikePrice,
    stockPrice,
    volatility,
    timeDifference,
    riskFreeInterestRate
  )

  const putPrice =
    -stockPrice * N(-d1) +
    strikePrice * N(-d2) * Math.exp(-riskFreeInterestRate * timeDifference)

  return putPrice
}

export function estimateDailyVolatility(symbol?: BinanceSymbol) {
  //   Maybe use vol2?
  //   const dailyVol =
  //     Math.log(symbol?.highPrice || 0) - Math.log(symbol?.lowPrice || 0)

  const dailyVol =
    ((symbol?.highPrice || 0) - (symbol?.lowPrice || 0)) / (symbol?.price || 1)

  return dailyVol
}

function calculateD1(
  strikePrice: number,
  stockPrice: number,
  volatility: number,
  timeDifference: number,
  riskFreeInterestRate: number
) {
  const a = Math.log(stockPrice / strikePrice)
  const b = riskFreeInterestRate + Math.pow(volatility, 2) / 2
  const c = volatility * Math.sqrt(timeDifference)
  return (a + b * timeDifference) / c
}

function calculateD2(
  strikePrice: number,
  stockPrice: number,
  volatility: number,
  timeDifference: number,
  riskFreeInterestRate: number
) {
  const a = Math.log(stockPrice / strikePrice)
  const b = riskFreeInterestRate - Math.pow(volatility, 2) / 2
  const c = volatility * Math.sqrt(timeDifference)
  return (a + b * timeDifference) / c
}

//Standard Normal CDF
function N(z: number) {
  return cdf(z, 0, 1)
}
