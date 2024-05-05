import { BinanceSymbol } from "../../../types/binance"
import {
  FormData,
  FormErrorList,
  FormErrorText,
  SpotOrOption,
} from "../../../types/form"

/**
 * Each function beginning with check_ returns true if no errors are present and false otherwise
 * FormErrorList lets us know which of the form elements needs to be highlighted red in error
 * FormErrorText[] contains all the error toasts to show to the user
 */

export function performChecks(formData: FormData) {
  const errors: FormErrorText[] = []
  const list: FormErrorList = {}
  formatFormData(formData)
  const error =
    checkAllValuesExist(formData, errors, list) ||
    checkExpirationDateNotInPast(formData, errors, list) ||
    checkMinNotionalLessThanMaxNotional(formData, errors, list) ||
    checkOrderValueLessThanMaxNotional(formData, errors, list)
  return { errors, list, error }
}

function checkMinNotionalLessThanMaxNotional(
  formData: FormData,
  errors: FormErrorText[],
  list: FormErrorList
) {
  if (formData.maxNotional <= formData.minNotional) {
    list.maxNotional = true
    list.minNotional = true
    const error = {
      title: "Size error",
      description: "Minimum notional should be lower than maximum notional",
    }
    errors.push(error)
    return true
  }
  return false
}

function checkAllValuesExist(
  formData: FormData,
  errors: FormErrorText[],
  list: FormErrorList
) {
  let error = false

  function checkValue(name: keyof FormData) {
    if (!formData[name]) {
      list[name] = true
      error = true
    }
  }

  checkValue("maxNotional")
  checkValue("minNotional")

  if (formData.spotOrOption === SpotOrOption.SPOT) {
    checkValue("price")
    checkValue("quantity")
  } else {
    checkValue("callOrPut")
    checkValue("premium")
    checkValue("quantity")
    checkValue("expirationDate")
    checkValue("strikePrice")
  }

  if (error) {
    const error = {
      title: "Empty values",
      description: "Highlighted values cannot be empty or zero",
    }
    errors.push(error)
  }

  return error
}

function checkOrderValueLessThanMaxNotional(
  formData: FormData,
  errors: FormErrorText[],
  list: FormErrorList
) {
  const max = formData.maxNotional
  let orderValue = 0
  if (formData.spotOrOption === SpotOrOption.SPOT) {
    if (formData.price) orderValue = formData.price * formData.quantity
  } else {
    if (formData.strikePrice)
      orderValue = formData.strikePrice * formData.quantity
  }
  if (orderValue > max) {
    list.quantity = true
    const error = {
      title: "Max order value exceeded",
      description: `Order value is ${orderValue} whereas Max Notional specificed is ${max}`,
    }
    errors.push(error)
    return true
  }
  return false
}

function checkExpirationDateNotInPast(
  formData: FormData,
  errors: FormErrorText[],
  list: FormErrorList
) {
  if (formData.spotOrOption === SpotOrOption.OPTION) {
    const expirationDateMilliseconds = formData.expirationDate?.valueOf()
      ? formData.expirationDate?.valueOf()
      : 0
    if (expirationDateMilliseconds < Date.now()) {
      list.expirationDate = true
      const error = {
        title: "Expiration Date in the past",
        description: `Expiration date cannot be before the current date or today`,
      }
      errors.push(error)
      return true
    }
    return false
  }
  return false
}

function formatFormData(formData: FormData) {
  formData.minNotional = Number(formData.minNotional)
  formData.maxNotional = Number(formData.maxNotional)
  if (formData.spotOrOption === SpotOrOption.SPOT) {
    formData.price = Number(formData.price)
    formData.quantity = Number(formData.quantity)
  } else {
    formData.quantity = Number(formData.quantity)
    formData.strikePrice = Number(formData.strikePrice)
    formData.premium = Number(formData.premium)
  }
}

export function findPriceDifferenceAsPercentage(
  formData: FormData,
  symbols: BinanceSymbol[]
) {
  const symbol = symbols.find((s) => formData.tokenName === s.symbol)
  const priceDifference = Math.abs((symbol?.price || 0) - (formData.price || 0))
  const priceDifferenceAsPercentage = priceDifference / (formData.price || 1)
  return {
    priceDifferenceAsPercentage: priceDifferenceAsPercentage,
    priceDifference: priceDifference,
    price: symbol?.price,
  }
}
