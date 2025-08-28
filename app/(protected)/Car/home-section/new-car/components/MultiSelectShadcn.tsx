import * as React from "react"
import { Check, ChevronsUpDown, X } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Badge } from "@/components/ui/badge"

const fuelOptions = [
  { label: "Petrol", value: "Petrol" },
  { label: "Diesel", value: "Diesel" },
  { label: "Electric", value: "Electric" },
  { label: "Hybrid", value: "Hybrid" },
  { label: "CNG", value: "CNG" },
  { label: "LPG", value: "LPG" },
]

const transmissionOptions = [
  { label: "Manual", value: "Manual" },
  { label: "Automatic", value: "Automatic" },
]

export function MultiSelectShadcn({ label, name, value, onChange, type }) {
  const [open, setOpen] = React.useState(false)

  const options = type === "fueltype" ? fuelOptions : transmissionOptions

  const toggleOption = (val: string) => {
    let newValue: string[]
    if (value.includes(val)) {
      newValue = value.filter((v) => v !== val)
    } else {
      newValue = [...value, val]
    }
    onChange(newValue)
  }

  const removeOption = (val: string) => {
    onChange(value.filter((v) => v !== val))
  }

  return (
    <div className="w-full">
      <label className="block text-sm font-medium mb-1">{label}</label>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-full justify-between"
          >
            {value.length > 0 ? (
              <div className="flex flex-wrap gap-1">
                {value.map((val) => (
                  <Badge
                    key={val}
                    variant="secondary"
                    className="flex items-center gap-1"
                  >
                    {val}
                    <X
                      className="h-3 w-3 cursor-pointer"
                      onClick={(e) => {
                        e.stopPropagation() // prevent popover open
                        removeOption(val)
                      }}
                    />
                  </Badge>
                ))}
              </div>
            ) : (
              "Select options"
            )}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-full p-0">
          <Command>
            <CommandInput placeholder="Search..." />
            <CommandList>
              <CommandEmpty>No option found.</CommandEmpty>
              <CommandGroup>
                {options.map((option) => (
                  <CommandItem
                    key={option.value}
                    onSelect={() => toggleOption(option.value)}
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        value.includes(option.value) ? "opacity-100" : "opacity-0"
                      )}
                    />
                    {option.label}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  )
}
