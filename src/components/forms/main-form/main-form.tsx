import "../form.css"
import { Bird, InfoIcon, Rabbit, Turtle } from "lucide-react"
import { Input } from "../../../../components/ui/input"
import { Label } from "../../../../components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../../components/ui/select"
import { Tabs, TabsList, TabsTrigger } from "../../../../components/ui/tabs"
import { Button } from "../../../../components/ui/button"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "../../../../components/ui/tooltip"
import SpotForm from "../spot-form/spot-form"
import OptionForm from "../option-form/option-form"
import {
  defaultFormData,
  FormData,
  FormErrorList,
  SpotOrOption,
} from "../../../types/form"
import { ReactNode, useContext, useState } from "react"
import "./main-form.scss"

import { useToast } from "../../../../components/ui/use-toast"
import { TokenNameSelector } from "./token-name-selector"
import { BinanceDataContext } from "../../../context/binance-data-context"
import { AlertDialogueContext } from "../../../context/alert-dialogue-context"
import { onSubmit } from "./form-submit"

export default function MainForm() {
  const [formData, setFormData] = useState<FormData>(defaultFormData)
  const [formErrorList, setFormErrorList] = useState<FormErrorList>({})
  //@ts-ignore
  const [submitting, setSubmitting] = useState(false)

  const { toast } = useToast()
  const { symbols, loading } = useContext(BinanceDataContext)
  const { setOpen, setDescription, setTitle, setAction } =
    useContext(AlertDialogueContext)

  function onFormDataChange(e: React.ChangeEvent<HTMLInputElement>) {
    setFormData((d) => {
      const newFormData = { ...d, [e.target.name]: e.target.value }
      return newFormData
    })
  }

  function sendAlert(
    title: ReactNode,
    description: ReactNode,
    action?: () => void
  ) {
    if (action) {
      setAction(() => {
        return action
      })
    } else {
      setAction(() => {
        return () => {}
      })
    }
    setTitle(title)
    setDescription(description)
    setOpen(true)
  }

  function formSuccessAnimation() {
    const pendingClassName = "loading-btn--pending"
    const successClassName = "loading-btn--success"

    const stateDuration = 1500

    const elem = document.getElementById("loading-btn")
    //@ts-ignore
    elem.classList.add(pendingClassName)
    window.setTimeout(() => {
      //@ts-ignore
      elem.classList.remove(pendingClassName)
      //@ts-ignore
      elem.classList.add(successClassName)

      window.setTimeout(
        //@ts-ignore
        () => elem.classList.remove(successClassName),
        stateDuration
      )
    }, stateDuration)
  }

  return (
    <div
      className="relative hidden flex-col items-start gap-8 md:flex"
      x-chunk="dashboard-03-chunk-0"
    >
      <form
        className="grid w-full items-start gap-6"
        onSubmit={(e) => {
          onSubmit(
            e,
            toast,
            sendAlert,
            setSubmitting,
            setFormData,
            setFormErrorList,
            formData,
            symbols,
            formSuccessAnimation
          )
        }}
      >
        <fieldset className="grid gap-6 rounded-lg border p-4">
          <legend className="-ml-1 px-1 text-sm font-medium">Trade</legend>
          <div className="grid gap-3">
            <Label htmlFor="wallet">Wallet</Label>
            <Select defaultValue="coinbase">
              <SelectTrigger
                id="model"
                className="items-start [&_[data-description]]:hidden"
              >
                <SelectValue placeholder="Select a wallet" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="coinbase">
                  <div className="flex items-start gap-3 text-muted-foreground">
                    <Rabbit className="size-5" />
                    <div className="grid gap-0.5">
                      <p>
                        Wallet{" "}
                        <span className="font-medium text-foreground">
                          Coinbase
                        </span>
                      </p>
                      <p className="text-xs" data-description>
                        From Coinbase API
                      </p>
                    </div>
                  </div>
                </SelectItem>
                <SelectItem value="phantom">
                  <div className="flex items-start gap-3 text-muted-foreground">
                    <Bird className="size-5" />
                    <div className="grid gap-0.5">
                      <p>
                        Wallet{" "}
                        <span className="font-medium text-foreground">
                          Phantom
                        </span>
                      </p>
                      <p className="text-xs" data-description>
                        From browser extension
                      </p>
                    </div>
                  </div>
                </SelectItem>
                <SelectItem value="quantum">
                  <div className="flex items-start gap-3 text-muted-foreground">
                    <Turtle className="size-5" />
                    <div className="grid gap-0.5">
                      <p>
                        Wallet{" "}
                        <span className="font-medium text-foreground">
                          Quantum
                        </span>
                      </p>
                      <p className="text-xs" data-description>
                        From browser extension.
                      </p>
                    </div>
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-3">
              <div className="grid grid-cols-2">
                <Label htmlFor="min-notional">Min. Notional</Label>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <InfoIcon height={15} width={15} />
                  </TooltipTrigger>
                  <TooltipContent side="right" sideOffset={5}>
                    Defines the minimum stop price allowed
                  </TooltipContent>
                </Tooltip>
              </div>
              <Input
                id="min-notional"
                type="number"
                placeholder="0.00001"
                name="minNotional"
                value={formData.minNotional}
                onChange={onFormDataChange}
                className={formErrorList.minNotional ? "error" : ""}
              />
            </div>
            <div className="grid gap-3">
              <div className="grid grid-cols-2">
                <Label htmlFor="max-notional">Max Notional</Label>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <InfoIcon height={15} width={15} />
                  </TooltipTrigger>
                  <TooltipContent side="right" sideOffset={5}>
                    Defines the maximum stop price allowed
                  </TooltipContent>
                </Tooltip>
              </div>
              <Input
                id="max-notional"
                type="number"
                placeholder="10.000"
                name="maxNotional"
                value={formData.maxNotional}
                onChange={onFormDataChange}
                className={formErrorList.maxNotional ? "error" : ""}
              />
            </div>
          </div>
          <div className="grid w-full gap-4">
            <TokenNameSelector
              value={formData.tokenName}
              setValue={(v) => {
                setFormData((d) => {
                  return { ...d, tokenName: v }
                })
              }}
              options={symbols.map((s) => s.symbol)}
              className={formErrorList.tokenName ? "error" : ""}
            />
          </div>
          <div className="grid gap-4">
            <Tabs
              id="spot-or-option"
              value={formData.spotOrOption}
              onValueChange={(v) => {
                setFormData((d) => {
                  return { ...d, spotOrOption: v as SpotOrOption }
                })
              }}
            >
              <TabsList
                className={`grid w-full grid-cols-2 ${
                  formErrorList.spotOrOption ? "error" : ""
                }`}
              >
                <TabsTrigger value={SpotOrOption.SPOT}>Spot</TabsTrigger>
                <TabsTrigger value={SpotOrOption.OPTION}>Option</TabsTrigger>
              </TabsList>
              <SpotForm
                onFormDataChange={onFormDataChange}
                formData={formData}
                formErrorList={formErrorList}
              />
              <OptionForm
                onFormDataChange={onFormDataChange}
                formData={formData}
                setFormData={setFormData}
                formErrorList={formErrorList}
              />
            </Tabs>
          </div>
          <div className="grid gap-4 ">
            <Button
              type="submit"
              disabled={loading}
              className="loading-btn"
              id="loading-btn"
            >
              <span className="loading-btn__text">Submit</span>
            </Button>
          </div>
        </fieldset>
      </form>
    </div>
  )
}
