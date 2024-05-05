import { FormEvent, ReactNode } from "react"
import { findPriceDifferenceAsPercentage, performChecks } from "./validation"
import { findTokenFromFormData } from "../../../utils/token-search"
import {
  calculateCallPriceFromBlackScholes,
  calculatePutPriceFromBlackScholes,
  estimateDailyVolatility,
} from "../../../utils/black-scholes"
import {
  CallOrPut,
  FormData,
  FormErrorList,
  SpotOrOption,
} from "../../../types/form"
import { BinanceSymbol } from "../../../types/binance"
import {
  OPTION_PRICE_CHECK_TOLERANCE,
  SPOT_PRICE_CHECK_TOLERANCE,
} from "../../../utils/constants"

export type FormSubmitProps = {}

export function onSubmit(
  e: FormEvent<HTMLFormElement>,
  toast: ({}) => void,
  sendAlert: (
    title: ReactNode,
    description: ReactNode,
    action?: (() => void) | undefined
  ) => void,
  setSubmitting: React.Dispatch<React.SetStateAction<boolean>>,
  setFormData: React.Dispatch<React.SetStateAction<FormData>>,
  setFormErrorList: React.Dispatch<React.SetStateAction<FormErrorList>>,
  formData: FormData,
  symbols: BinanceSymbol[],
  formSuccessAnimation: () => void
) {
  e.preventDefault()

  //Error checking
  setSubmitting(true)
  const { list, errors, error } = performChecks(formData)
  setFormErrorList(list)
  errors.map((e) => {
    toast({
      title: e.title,
      description: e.description,
      variant: "destructive",
    })
  })
  if (error) return

  //Guess Token if applicable
  if (!formData.tokenName) {
    const guessedSymbol = findTokenFromFormData(formData, symbols)
    if (guessedSymbol) {
      sendAlert(
        <div>WARNING: Token Left Blank</div>,
        <>
          <div>
            You left the Token blank, so we've guessed you wanted{" "}
            {guessedSymbol.symbol}. Is that correct?
          </div>
          <br />
          <div>If so, please click continue and click submit again</div>
        </>,
        () => {
          setFormData((d) => {
            return { ...d, tokenName: guessedSymbol.symbol }
          })
        }
      )
    } else {
      sendAlert(
        <div>WARNING: Token Left Blank</div>,
        <>
          <div>
            You left the Token blank and we could not make a guess as to your
            preferred order. Please add more information before continuing.
          </div>
        </>
      )
    }

    return
  }

  //See if price is reasonable
  if (formData.spotOrOption === SpotOrOption.SPOT) {
    //SPOT
    const { price, priceDifferenceAsPercentage } =
      findPriceDifferenceAsPercentage(formData, symbols)
    if (priceDifferenceAsPercentage > SPOT_PRICE_CHECK_TOLERANCE) {
      sendAlert(
        <div>WARNING: Price seems wrong</div>,
        <div>
          The price for {formData.tokenName} is around {price}. You are offering{" "}
          {formData.price} which is{" "}
          {Math.round(priceDifferenceAsPercentage * 10000) / 100}% different.
          Are you sure you want to continue?
        </div>,
        () => {
          formSuccess(formSuccessAnimation, setFormData)
        }
      )

      return
    }
  } else {
    //OPTION
    //Do Black-Scholes
    const symbol = symbols.find((s) => s.symbol === formData.tokenName)
    const price = symbol?.price || 0
    const dailyVol = estimateDailyVolatility(symbol)

    let premium = 0
    if (formData.callOrPut === CallOrPut.CALL) {
      premium = calculateCallPriceFromBlackScholes(
        Number(formData.strikePrice || 0),
        Number(price),
        dailyVol,
        formData.expirationDate || new Date()
      )
    } else {
      premium = calculatePutPriceFromBlackScholes(
        Number(formData.strikePrice || 0),
        Number(price),
        dailyVol,
        formData.expirationDate || new Date()
      )
    }

    if (
      Math.abs(premium - (formData.premium || 0)) >
      OPTION_PRICE_CHECK_TOLERANCE * premium
    ) {
      sendAlert(
        <div>WARNING: Your premium seems wrong</div>,
        <div>
          The market premium for {formData.tokenName} is estimated around{" "}
          {Math.round(premium)}. You are offering {formData.premium} which is
          different. Are you sure you want to continue?
        </div>,
        () => {
          formSuccess(formSuccessAnimation, setFormData)
        }
      )
      return
    }
  }

  formSuccess(formSuccessAnimation, setFormData)
}

function formSuccess(
  formSuccessAnimation: () => void,
  setFormData: React.Dispatch<React.SetStateAction<FormData>>
) {
  formSuccessAnimation()
  setFormData((f) => {
    return {
      maxNotional: f.maxNotional,
      minNotional: f.minNotional,
      quantity: 0,
      spotOrOption: f.spotOrOption,
    } as FormData
  })
}
