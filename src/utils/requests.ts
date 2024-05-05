import {
  BinancePrice,
  BinanceSymbol,
  BinanceVolatility,
} from "../types/binance"

export async function getExchangeData() {
  const response = await fetch("https://fapi.binance.com/fapi/v1/exchangeInfo")
  const json = await response.json()
  return json.symbols as BinanceSymbol[]
}

export async function getPriceData() {
  const response = await fetch("https://fapi.binance.com/fapi/v2/ticker/price")
  const json = await response.json()
  return json as BinancePrice[]
}

export async function getVolatilityData() {
  const response = await fetch("https://api.binance.com/api/v3/ticker/24hr")
  const json = await response.json()
  return json as BinanceVolatility[]
}
