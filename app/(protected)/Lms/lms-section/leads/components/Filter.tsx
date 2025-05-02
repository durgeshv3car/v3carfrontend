import React, { useState, useEffect } from "react";
import { MultiSelect } from "primereact/multiselect";
import { InputNumber } from "primereact/inputnumber";
import { SelectedValues } from "../page";
import { DataProps } from "../table/columns";

interface FilterProps {
  selectedValues: SelectedValues;
  setSelectedValues: React.Dispatch<React.SetStateAction<SelectedValues>>;
  data: DataProps[];
  allFilterOptions: Record<string, Set<string>>;
}

export default function Filter({
  selectedValues,
  setSelectedValues,
  data,
  allFilterOptions,
}: FilterProps) {
  const [dropdownOptions, setDropdownOptions] = useState<
    Record<string, { name: string }[]>
  >({});
  const [multiSelectValues, setMultiSelectValues] = useState<
    Record<string, { name: string }[]>
  >({});

  useEffect(() => {
    const newDropdowns: Record<string, { name: string }[]> = {};
    for (const field in allFilterOptions) {
      newDropdowns[field] = Array.from(allFilterOptions[field])
        .sort()
        .map((value) => ({ name: value }));
    }
    setDropdownOptions(newDropdowns);

    // Initialize multiSelectValues with selectedValues
    const initialMultiSelectValues: Record<string, { name: string }[]> = {};
    Object.keys(selectedValues).forEach((field) => {
      initialMultiSelectValues[field] =
        (selectedValues[field as keyof SelectedValues] ?? []).map((val) => ({
          name: val,
        }));
    });
    setMultiSelectValues(initialMultiSelectValues);
  }, [allFilterOptions, selectedValues]);

  const handleSelectChange = (field: string, selectedOptions: { name: string }[]) => {
    setMultiSelectValues((prev) => ({
      ...prev,
      [field]: selectedOptions,
    }));
    setSelectedValues((prev) => ({
      ...prev,
      [field]: selectedOptions.map((opt) => opt.name),
    }));
  };

  return (
    <div className="card flex flex-wrap gap-4">
      {Object.keys(selectedValues).map((field) => (
        <div key={field} className="w-[250px] dark:bg-slate-800 bg-white">
          <MultiSelect
            value={multiSelectValues[field] || []} // Ensure value is always an array
            onChange={(e) => handleSelectChange(field, e.value || [])} // Default to empty array
            options={dropdownOptions[field] || []}
            optionLabel="name"
            filter
            placeholder={`Select ${field}`}
            className="w-full"
          />
        </div>
      ))}
    </div>
  );
}