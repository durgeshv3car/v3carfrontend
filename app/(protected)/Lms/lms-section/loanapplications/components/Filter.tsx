"use client";

import * as React from "react";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import {
  Command,
  CommandList,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import { Check, ChevronsUpDown } from "lucide-react";
import { SelectedValues } from "../page";

interface FilterProps {
  selectedValues: SelectedValues;
  setSelectedValues: React.Dispatch<React.SetStateAction<SelectedValues>>;
  data: Record<string, any>[];
}

export default function Filter({
  selectedValues,
  setSelectedValues,
  data,
}: FilterProps) {
  const [openFilter, setOpenFilter] = useState<keyof SelectedValues | null>(
    null
  );
  const [dropdownOptions, setDropdownOptions] = useState<
    Partial<Record<keyof SelectedValues, string[]>>
  >({});

  const fieldPaths = React.useMemo(() => {
    return {
      phoneNumber: (item: any) => item?.phoneNumber,
      desiredLoanAmount: (item: any) => item?.desiredLoanAmount,
      loanTenure: (item: any) => item?.loanTenure,
      loanType: (item: any) => item?.loanType,
      employmentStatus: (item: any) => item?.employmentStatus,
      netMonthlyIncome: (item: any) => item?.netMonthlyIncome,
      hasCreditCard: (item: any) => item?.hasCreditCard,
      companyName: (item: any) => item?.companyName,
      employmentLevel: (item: any) => item?.employmentLevel,
      loanPurpose: (item: any) => item?.loanPurpose,
      hasGST: (item: any) => item?.hasGST,
      businessName: (item: any) => item?.businessName,
      tradeName: (item: any) => item?.tradeName,
      PrincipalPlaceofBusiness: (item: any) => item?.PrincipalPlaceofBusiness,
      businessType: (item: any) => item?.businessType,
      natureOfBusiness: (item: any) => item?.natureOfBusiness,
      yearsInBusiness: (item: any) => item?.yearsInBusiness,
      businessTurnover: (item: any) => item?.businessTurnover,
      businessIncome: (item: any) => item?.businessIncome,
      businessBank: (item: any) => item?.businessBank,
      profession: (item: any) => item?.profession,
      yearRegistration: (item: any) => item?.yearRegistration,
      studentIncome: (item: any) => item?.studentIncome,
      livesWithParents: (item: any) => item?.livesWithParents,
    };
  }, []);

  useEffect(() => {
    if (!data || data.length === 0) return;

    const newDropdowns: Partial<Record<keyof SelectedValues, string[]>> = {};
    for (const field in selectedValues) {
      const key = field as keyof SelectedValues;
      const values = data.map(fieldPaths[key]).filter(Boolean);
      newDropdowns[key] = ["All", ...Array.from(new Set(values)).sort()];
    }
    setDropdownOptions(newDropdowns);
  }, [fieldPaths, selectedValues, data]);

  const handleChange = (field: keyof SelectedValues, value: string) => {
    setSelectedValues((prev) => ({
      ...prev,
      [field]: value === "All" ? "" : value,
    }));
    setOpenFilter(null);
  };

  const handleOpenChange = (field: keyof SelectedValues, isOpen: boolean) => {
    setOpenFilter(isOpen ? field : null);
  };

  return (
    <div className="flex flex-wrap gap-4">
      {(Object.keys(selectedValues) as (keyof SelectedValues)[]).map((field) => (
        <Popover
          key={field}
          open={openFilter === field}
          onOpenChange={(isOpen) => handleOpenChange(field, isOpen)}
        >
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className="w-[200px] justify-between capitalize"
            >
              {typeof selectedValues[field] === "string" || typeof selectedValues[field] === "boolean"
                ? (selectedValues[field] as string | boolean | undefined)?.toString()
                : `Select ${field}`}
              <ChevronsUpDown className="opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-[200px] p-0">
            <Command>
              <CommandInput placeholder={`Search ${field}`} />
              <CommandList>
                {dropdownOptions[field]?.map((option) => (
                  <CommandItem
                    key={option}
                    onSelect={() => handleChange(field, option)}
                  >
                    {option}
                    <Check
                      className={`ml-auto ${
                        selectedValues[field]?.toString() === option
                          ? "opacity-100"
                          : "opacity-0"
                      }`}
                    />
                  </CommandItem>
                ))}
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
      ))}
    </div>
  );
}
