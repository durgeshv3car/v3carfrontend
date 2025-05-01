"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { Command, CommandList, CommandInput, CommandItem } from "@/components/ui/command";
import { Check, ChevronsUpDown } from "lucide-react";
import { SelectedValues } from "../page";
import { DataProps } from "../table/columns";

interface FilterProps {
  selectedValues: SelectedValues
  setSelectedValues: React.Dispatch<React.SetStateAction<SelectedValues>>;
  data: DataProps[];
}

export default function Filter({ selectedValues, setSelectedValues, data }: FilterProps) {
  const [categories, setCategories] = React.useState<string[]>([]);
  const [titles, setTitles] = React.useState<string[]>([]);
  const [users, setUsers] = React.useState<string[]>([]);
  const [numbers, setNumbers] = React.useState<string[]>([]);
  const [openFilter, setOpenFilter] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (data.length > 0) {
      const uniqueCategories = Array.from(new Set(data.map(item => item.offer?.category || ""))).sort();
      const uniqueTitles = Array.from(new Set(data.map(item => item.title))).sort();
      const uniqueNumbers = Array.from(new Set(data.map(item => item.user?.phoneNumber || ""))).sort();
      const uniqueNames = Array.from(new Set(data.map(item => item.user?.firstName || ""))).sort();

      setCategories(["All", ...uniqueCategories]);
      setTitles(["All", ...uniqueTitles]);
      setUsers(["All", ...uniqueNames]);
      setNumbers(["All", ...uniqueNumbers]);
    }
  }, [data]);

  const handleChange = (field: string, value: string) => {
    setSelectedValues((prev) => ({ ...prev, [field]: value === "All" ? "" : value }));
    setOpenFilter(null); // Close popover after selecting a value
  };

  const handleOpenChange = (field: string, isOpen: boolean) => {
    setOpenFilter(isOpen ? field : null);
  };

  const fields: (keyof SelectedValues)[] = ["category", "title", "user", "phone"];
  const options: { [key: string]: string[] } = { categories, titles, users, numbers };

  return (
    <div className="flex flex-wrap gap-4">
      {fields.map((field) => (
        <Popover key={field} open={openFilter === field} onOpenChange={(isOpen) => handleOpenChange(field, isOpen)}>
          <PopoverTrigger asChild>
            <Button variant="outline" className="w-[200px] justify-between">
              {selectedValues[field as keyof SelectedValues] || `Select ${field}`}
              <ChevronsUpDown className="opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-[200px] p-0">
            <Command>
              {options[field]?.length ? (
                <CommandList>
                  {options[field].map((option) => (
                    <CommandItem key={option} onSelect={() => handleChange(field, option)}>
                      {option}
                      <Check className={`ml-auto ${selectedValues[field] === option ? "opacity-100" : "opacity-0"}`} />
                    </CommandItem>
                  ))}
                </CommandList>
              ) : (
                <CommandInput
                  placeholder={`Enter ${field}...`}
                  onValueChange={(value) => handleChange(field, value)}
                />
              )}
            </Command>
          </PopoverContent>
        </Popover>
      ))}
    </div>
  );
}
