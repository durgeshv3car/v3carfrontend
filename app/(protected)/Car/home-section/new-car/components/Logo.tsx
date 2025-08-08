"use client";
import React, { useState, useEffect } from "react";
import { ColumnDef } from "@tanstack/react-table";
import ExampleTwo from "../../../HomeTable";
import { useRouter } from "@/i18n/routing";
import { columnsLogo } from "./columnsLogo";
import { fetchCar } from "@/app/(protected)/services/createCar/api";

export type { LogoData };  // Export the type for use in other files

type TableProps<T> = {
  tableHeading: string;
  tableData: T[];
  tableColumns: ColumnDef<T, any>[];  // Added any for column value type
  setRefresh: React.Dispatch<React.SetStateAction<boolean>>;
  type: string;
};
interface LogoData {
  _id: string;
  brand: string;
  model: string;
  pageType: string;
  bodyType: string;
  fuelType: string[];
  transmissions: string[];
  mileage: number;
  engine: string;
  seatCapacity: number;
  priceRange: string;
  description: string;
  dimensions: {
    length: number;
    width: number;
    height: number;
    wheelbase: number;
  };
  image?: string;
  active: boolean;
}

const CarList: React.FC = () => {
  const router = useRouter();

  const [data, setData] = useState<LogoData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [refresh, setRefresh] = useState<boolean>(false);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [open, setOpen] = useState<boolean>(false);
  const type = "newCar";

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await fetchCar(type);
      
      if (!result || !Array.isArray(result)) {
        throw new Error("Invalid data received from server");
      }

      setData(result);
    } catch (error) {
      console.error("Error fetching data:", error);
      setError(error instanceof Error ? error.message : "Failed to fetch data");
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [refresh]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-lg">Loading...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <ExampleTwo<LogoData>
        tableHeading="New Car List"
        tableData={data}
        tableColumns={columnsLogo({
          fetchData,
          router,
          setSelectedDate,
          selectedDate,
          open,
          setOpen,
        }) as ColumnDef<LogoData, any>[]}
        setRefresh={setRefresh}
        type={type}
      />
    </div>
  );
};

export default CarList;
