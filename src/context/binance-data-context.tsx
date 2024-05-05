import { createContext, ReactNode, useEffect, useState } from "react"
import {
  BinancePrice,
  BinanceSymbol,
  BinanceVolatility,
} from "../types/binance"
import {
  getExchangeData,
  getPriceData,
  getVolatilityData,
} from "../utils/requests"

interface BinanceDataContextType {
  symbols: BinanceSymbol[]
  prices: BinancePrice[]
  volatilities: BinanceVolatility[]
  loading: boolean
}

export const BinanceDataContext = createContext<BinanceDataContextType>({
  symbols: [],
  prices: [],
  volatilities: [],
  loading: true,
})

type ContextProviderProps = {
  children?: ReactNode
}

export const BinanceDataContextProvider = ({
  children,
}: ContextProviderProps) => {
  const [data, setData] = useState<BinanceDataContextType>({
    symbols: [],
    prices: [],
    volatilities: [],
    loading: true,
  })

  useEffect(() => {
    async function getData() {
      if (!data.loading) return
      const loadedSymbolData = await getExchangeData()
      console.log("Loaded Binance Symbol Data Successfully ")
      console.log(loadedSymbolData)
      const loadedPriceData = await getPriceData()
      console.log("Loaded Binance Price Data Successfully ")
      const loadedVolatilityData = await getVolatilityData()
      console.log("Loaded Binance Volatility Data Successfully ")
      console.log(loadedVolatilityData)

      //Allocated prices to symbols
      //NOTE TODO: This should be changed in the future as price changes may result in slippage
      //In future, price changes should be refreshed before every order placed / every X seconds
      loadedSymbolData.map((s) => {
        const correspondingPrice = loadedPriceData.find(
          (p) => p.symbol === s.symbol
        )
        const correspondingVolatility = loadedVolatilityData.find(
          (v) => v.symbol === s.symbol
        )
        s.price = correspondingPrice?.price
        s.highPrice = correspondingVolatility?.highPrice
        s.lowPrice = correspondingVolatility?.lowPrice
      })
      setData({
        symbols: loadedSymbolData,
        prices: loadedPriceData,
        volatilities: loadedVolatilityData,
        loading: false,
      })
    }
    getData()
  }, [setData, data.loading])

  return (
    <BinanceDataContext.Provider value={{ ...data }}>
      {children}
    </BinanceDataContext.Provider>
  )
}
