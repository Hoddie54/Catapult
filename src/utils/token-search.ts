import { BinanceSymbol } from "../types/binance"
import { CallOrPut, FormData, SpotOrOption } from "../types/form"
import {
  calculateCallPriceFromBlackScholes,
  calculatePutPriceFromBlackScholes,
  estimateDailyVolatility,
} from "./black-scholes"
import { TOKEN_SEARCH_OPTION_STRIKE_PRICE_TOLERANCE } from "./constants"

/**
 *
 * Function first filters all possible tokens to remain within filters from Binance
 * Then, the token with the closest price / premium to the user selected price / premium is chosen
 * Options are further filtered to make sure strike price is within TOLERANCE of price
 *
 * @param formData
 * @param symbols
 * @returns BinanceSymbol
 */

export function findTokenFromFormData(
  formData: FormData,
  symbols: BinanceSymbol[]
) {
  const filteredSymbols = symbols.filter((s) => {
    const priceFilterMin =
      s.filters[0].minPrice <= (formData.price ? formData.price : Infinity)
    const priceFilterMax =
      s.filters[0].maxPrice >= (formData.price ? formData.price : 0)
    const quantityFilter = s.filters[1].minQty <= formData.quantity
    const notionalFilter = s.filters[5].notional <= formData.minNotional
    return priceFilterMax && priceFilterMin && quantityFilter && notionalFilter
  })

  if (formData.spotOrOption === SpotOrOption.SPOT) {
    //SPOT
    const sortedSymbolsByPrice = filteredSymbols.sort((a, b) => {
      const price = formData.price || 0
      const aPrice = a.price || 0
      const bPrice = b.price || 0
      const aPriceDifference = Math.abs(aPrice - price)
      const bPriceDifference = Math.abs(bPrice - price)
      return aPriceDifference - bPriceDifference
    })

    return sortedSymbolsByPrice[0]
  } else {
    //OPTION
    const furtherFilteredSymbols = symbols.filter((s) => {
      const spotPrice = s.price || 0
      const strikePrice = formData.strikePrice || 0
      return (
        Math.abs(spotPrice - strikePrice) <
        TOKEN_SEARCH_OPTION_STRIKE_PRICE_TOLERANCE * spotPrice
      )
    })

    const sortedSymbolsByPremium = furtherFilteredSymbols.sort((a, b) => {
      const premium = formData.premium || 0
      const strikePrice = formData.strikePrice || 0
      const aDailyVol = estimateDailyVolatility(a)
      const aPrice = a.price || 0
      const bDailyVol = estimateDailyVolatility(b)
      const bPrice = b.price || 0
      const date = formData.expirationDate || new Date()

      if (!a.price || aDailyVol === 0) return 1
      if (!b.price || bDailyVol === 0) return -1

      let aPremium = 0
      let bPremium = 0
      switch (formData.callOrPut) {
        case CallOrPut.CALL:
          aPremium = calculateCallPriceFromBlackScholes(
            strikePrice,
            aPrice,
            aDailyVol,
            date
          )
          bPremium = calculateCallPriceFromBlackScholes(
            strikePrice,
            bPrice,
            bDailyVol,
            date
          )
          break
        case CallOrPut.PUT:
          aPremium = calculatePutPriceFromBlackScholes(
            strikePrice,
            aPrice,
            aDailyVol,
            date
          )
          bPremium = calculatePutPriceFromBlackScholes(
            strikePrice,
            bPrice,
            bDailyVol,
            date
          )
          break
      }
      // const bPrice = b.price || 0
      const aPremiumDifferene = Math.abs(premium - aPremium)
      const bPremiumDifference = Math.abs(premium - bPremium)
      return aPremiumDifferene - bPremiumDifference
    })

    return sortedSymbolsByPremium[0]
  }
}
