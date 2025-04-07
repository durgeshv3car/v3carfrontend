"use client";

import * as React from "react";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

const fields = [
 "email", "dob", "pan", "pinCode",  "state", "gender", "education", "phoneNumber", "occupation", "company", "income", "employmentStatus",
  ,"vehicleType"
];

const options = {
  gender: ["Male", "Female", "Other"],
  education: ["High School", "Bachelor's", "Master's", "PhD"],
  maritalStatus: ["Single", "Married", "Divorced", "Widowed"],
  city: ["New York", "Los Angeles", "Chicago", "Houston", "San Francisco", "Dallas"],
  state: ["California", "Texas", "Florida", "New York", "Illinois", "Ohio"],
  country: ["USA", "Canada", "UK", "India", "Australia", "Germany"],
  occupation: ["Engineer", "Doctor", "Teacher", "Business", "Artist", "Student"],
  employmentStatus: ["Employed", "Unemployed", "Self-Employed", "Retired"],
  vehicleType: ["Car", "Motorcycle", "Bicycle", "Truck", "Bus", "Electric Scooter"]
};

export default function Filter({ selectedValues, setSelectedValues, }) {
  const [openFilter, setOpenFilter] = React.useState(null);

  const handleChange = (field, value) => {
    const updatedValues = { ...selectedValues, [field]: value };
    setSelectedValues(updatedValues);
    setOpenFilter(null);
  };

  return (
    <div className="flex flex-wrap gap-4">
      {fields.map((field) => (
        <Popover key={field} open={openFilter === field} onOpenChange={() => setOpenFilter(field)}>
          <PopoverTrigger asChild>
            <Button variant="outline" className="w-[200px] justify-between">
              {selectedValues[field] || `Select ${field}`}
              <ChevronsUpDown className="opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-[200px] p-0">
            <Command>
              {options[field] ? (
                <CommandList>
                  {options[field].map((option) => (
                    <CommandItem key={option} onSelect={() => handleChange(field, option)}>
                      {option}
                      <Check className={cn("ml-auto", selectedValues[field] === option ? "opacity-100" : "opacity-0")} />
                    </CommandItem>
                  ))}
                </CommandList>
              ) : (
                <CommandInput
                  placeholder={`Enter ${field}...`}
                  onChange={(e) => handleChange(field, e.target.value)}
                />
              )}
            </Command>
          </PopoverContent>
        </Popover>
      ))}
    </div>
  );
}

