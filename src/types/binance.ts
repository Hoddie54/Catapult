export type BinanceSymbol = {
  symbol: string
  pair: string
  contractType: string
  baseAsset: string
  quoteAsset: string
  marginAsset: string
  baseAssetPrecision: number
  quoteAssetPrecision: number
  underlyingType: string
  filters: any[] //Filters type is more complex and can vary. See Binance API website for more details
  price?: number
  highPrice?: number
  lowPrice?: number
  //Note: For a full list of all variables in a BinanceSymbol, see Binance API Documentation
}

export type BinancePrice = {
  symbol: string
  price: number
  time: number
}

export type BinanceVolatility = {
  symbol: string
  priceChange: number
  priceChangePercent: number
  weightedAveragePrice: number
  highPrice: number
  lowPrice: number
}
