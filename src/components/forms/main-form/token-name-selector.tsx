import { ScrollArea } from "@radix-ui/react-scroll-area"
import { Check, ChevronsUpDown } from "lucide-react"
import { useContext, useState } from "react"
import { Button } from "../../../../components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "../../../../components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "../../../../components/ui/popover"
import { cn } from "../../../../lib/utils"
import { BinanceDataContext } from "../../../context/binance-data-context"

export type TokenNameSelectorProps = {
  value: string | undefined
  setValue: (v: string) => void
  options: string[]
  className: string | undefined
}

export function TokenNameSelector({
  value,
  setValue,
  options,
  className,
}: TokenNameSelectorProps) {
  const [open, setOpen] = useState(false)

  const { symbols } = useContext(BinanceDataContext)
  const symbol = symbols.find((s) => s.symbol === value)

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={`justify-between ${className}`}
        >
          <div className="flex items-center">
            {value
              ? options.find((option) => option === value)
              : "Select token..."}
            {value && (
              <img
                src={`https://assets.coincap.io/assets/icons/${symbol?.baseAsset.toLowerCase()}@2x.png`}
                height={16}
                width={16}
                className="m-1"
                //@ts-ignore
                onError={(e) => (e.target.style.display = "none")}
                //@ts-ignore
                onLoad={(e) => (e.target.style.display = "block")}
              />
            )}
          </div>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      {/** FIX WIDTH HERE */}
      <PopoverContent className="w-full p-0" style={{ width: "400px" }}>
        <ScrollArea>
          <Command>
            <CommandInput placeholder="Search tokens..." />
            <CommandEmpty>... Tokens loading ...</CommandEmpty>
            <CommandList>
              <CommandGroup>
                {options.map((option) => {
                  return (
                    <CommandItem
                      key={option}
                      value={option}
                      onSelect={(currentValue) => {
                        setValue(currentValue === value ? "" : currentValue)
                        setOpen(false)
                      }}
                    >
                      <Check
                        className={cn(
                          "mr-2 h-4 w-4",
                          value === option ? "opacity-100" : "opacity-0"
                        )}
                      />
                      {option}
                    </CommandItem>
                  )
                })}
              </CommandGroup>
            </CommandList>
          </Command>
        </ScrollArea>
      </PopoverContent>
    </Popover>
  )
}
