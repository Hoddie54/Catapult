import { PhoneCallIcon, PinIcon } from "lucide-react"
import { Input } from "../../../../components/ui/input"
import { Label } from "../../../../components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../../components/ui/select"
import { TabsContent } from "../../../../components/ui/tabs"
import { DatePickerWithPresets } from "../../../../components/ui/datepicker"
import {
  CallOrPut,
  FormData,
  FormErrorList,
  SpotOrOption,
} from "../../../types/form"

export type OptionFormProps = {
  formData: FormData
  onFormDataChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  setFormData: React.Dispatch<React.SetStateAction<FormData>>
  formErrorList: FormErrorList
}

export default function OptionForm({
  formData,
  onFormDataChange,
  setFormData,
  formErrorList,
}: OptionFormProps) {
  return (
    <TabsContent value={SpotOrOption.OPTION}>
      <div className="grid gap-3">
        <Label htmlFor="call-or-put">Call or Put</Label>
        <Select
          value={formData.callOrPut}
          onValueChange={(vCallOrPut) => {
            //@ts-ignore
            setFormData((v) => {
              return { ...v, callOrPut: vCallOrPut }
            })
          }}
        >
          <SelectTrigger
            id="call-or-put"
            className={`items-start [&_[data-description]]:hidden ${
              formErrorList.callOrPut ? "error" : ""
            }`}
          >
            <SelectValue placeholder="Select Call or Put" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={CallOrPut.CALL}>
              <div className="flex items-start gap-3 text-muted-foreground">
                <PhoneCallIcon className="size-5" />
                <div className="grid gap-0.5">
                  <p>Call</p>
                </div>
              </div>
            </SelectItem>
            <SelectItem value={CallOrPut.PUT}>
              <div className="flex items-start gap-3 text-muted-foreground">
                <PinIcon className="size-5" />
                <div className="grid gap-0.5">
                  <p>Put</p>
                </div>
              </div>
            </SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="grid grid-cols-2 gap-4 mt-3">
        <div
          className={`grid gap-3 ${
            formErrorList.expirationDate ? "error" : ""
          }`}
        >
          <Label htmlFor="date">Expiration Date</Label>
          <DatePickerWithPresets
            date={formData.expirationDate}
            setDate={(vDate) => {
              //@ts-ignore
              setFormData((v) => {
                return { ...v, expirationDate: vDate }
              })
            }}
          />
        </div>
        <div className="grid gap-3">
          <Label htmlFor="premium">Premium</Label>
          <Input
            id="premium"
            type="number"
            placeholder="10.000"
            name="premium"
            value={formData.premium}
            onChange={onFormDataChange}
            className={formErrorList.premium ? "error" : ""}
          />
        </div>
        <div className="grid gap-3">
          <Label htmlFor="strike-price">Strike price</Label>
          <Input
            id="strike-price"
            type="number"
            placeholder="10.000"
            name="strikePrice"
            value={formData.strikePrice}
            onChange={onFormDataChange}
            className={formErrorList.strikePrice ? "error" : ""}
          />
        </div>
        <div className="grid gap-3">
          <Label htmlFor="quantity">Quantity</Label>
          <Input
            id="quantity"
            type="number"
            placeholder="10.000"
            step={0.01}
            name="quantity"
            value={formData.quantity}
            onChange={onFormDataChange}
            className={formErrorList.quantity ? "error" : ""}
          />
        </div>
      </div>
    </TabsContent>
  )
}
