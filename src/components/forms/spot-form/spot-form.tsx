import { Input } from "../../../../components/ui/input"
import { Label } from "../../../../components/ui/label"
import { TabsContent } from "../../../../components/ui/tabs"
import { FormData, FormErrorList, SpotOrOption } from "../../../types/form"

export type SpotFormProps = {
  formData: FormData
  onFormDataChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  formErrorList: FormErrorList
}

export default function SpotForm({
  formData,
  onFormDataChange,
  formErrorList,
}: SpotFormProps) {
  return (
    <TabsContent value={SpotOrOption.SPOT}>
      <div className="grid grid-cols-2 gap-4">
        <div className="grid gap-3">
          <Label htmlFor="price">Price</Label>
          <Input
            id="price"
            type="number"
            placeholder="0.1000"
            name="price"
            step={0.001}
            value={formData.price}
            onChange={onFormDataChange}
            className={formErrorList.price ? "error" : ""}
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
