"use client";
import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { fetchDevices } from "@/app/(protected)/services/deviceInfo/api";
import { DataProps } from "../../loanapplications/table/columns";

const ExampleTwo = dynamic(() => import("../table"), {
  loading: () => <p>Loading table...</p>,
  ssr: false,
});

export type SelectedValues = {
  [key: string]: string[]; // ✅ This enables dynamic keys
};


const LeadPage = () => {
  const [selectedValues, setSelectedValues] = useState<SelectedValues>({
    phoneNumber: [],
    brand: [],
  });

  const fields: (keyof SelectedValues)[] = ["phoneNumber", "brand"];

  const [columns, setColumns] = useState<any[]>([]);
  const [data, setData] = useState<DataProps[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [refresh, setRefresh] = useState<boolean>(false);

  // New state for filter options
  const [allFilterOptions, setAllFilterOptions] = useState<{
    phoneNumber: string[];
    brand: string[];
  }>({
    phoneNumber: [],
    brand: [],
  });

  useEffect(() => {
    const loadColumns = async () => {
      const mod = await import("../table/columns");
      setColumns(mod.columns);
    };
    loadColumns();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const result = await fetchDevices();
      const fetchedData = Array.isArray(result) ? result : [result];
      setData(fetchedData);

      // Build filter options dynamically
      const phoneNumbersSet = new Set<string>();
      const brandsSet = new Set<string>();

      fetchedData.forEach((item) => {
        if (item.phoneNumber) phoneNumbersSet.add(item.phoneNumber.toString());
        if (item.brand) brandsSet.add(item.brand.toString());
      });

      setAllFilterOptions({
        phoneNumber: Array.from(phoneNumbersSet),
        brand: Array.from(brandsSet),
      });
    } catch (error) {
      console.error("Error fetching data:", error);
      setData([]);
      setAllFilterOptions({ phoneNumber: [], brand: [] });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [refresh]);

  // Filter data based on selectedValues
  const filteredData = data.filter((item) => {
    return fields.every((field) => {
      const value = selectedValues[field];
      if (!value || value.length === 0) return true;

      const fieldValue = item[field as keyof DataProps];

      return value.some((v) => {
        const compareValue =
          typeof v === "string" ? v : (v as { name: string })?.name?.toString() ?? "";

        return (
          typeof fieldValue === "string" &&
          fieldValue.toLowerCase().includes(compareValue.toLowerCase())
        );
      });
    });
  });

  return (
    <div>
  
      <ExampleTwo
        selectedValues={selectedValues}
        setSelectedValues={setSelectedValues}
        tableData={filteredData}
        tableColumns={columns}
        allFilterOptions={allFilterOptions} 
      />
    </div>
  );
};

export default LeadPage;
