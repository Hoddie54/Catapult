export type FormData = {
  minNotional: number
  maxNotional: number
  spotOrOption: SpotOrOption
  quantity: number
  tokenName?: string
  price?: number
  callOrPut?: CallOrPut
  expirationDate?: Date | undefined
  premium?: number
  strikePrice?: number
}

export enum SpotOrOption {
  SPOT = "SPOT",
  OPTION = "OPTION",
}

export enum CallOrPut {
  CALL = "CALL",
  PUT = "PUT",
}

export const defaultFormData: FormData = {
  minNotional: 10,
  maxNotional: 10000,
  spotOrOption: SpotOrOption.SPOT,
  quantity: 0,
}

export type FormErrorList = {
  minNotional?: boolean
  maxNotional?: boolean
  spotOrOption?: boolean
  quantity?: boolean
  tokenName?: boolean
  price?: boolean
  callOrPut?: boolean
  expirationDate?: boolean
  premium?: boolean
  strikePrice?: boolean
}

export type FormErrorText = {
  title: string
  description: string
}
