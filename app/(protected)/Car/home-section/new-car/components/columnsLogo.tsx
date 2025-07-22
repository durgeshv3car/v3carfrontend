"use client";
import React from "react";
import { ColumnDef, Row, Table } from "@tanstack/react-table";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import ActiveToggleCell from "./ActiveToggleCell";
import { SquarePen, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "sonner";
import { deleteLogoImage } from "@/app/(protected)/services/logos/api";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import VariantsModalTrigger from "./VarianstModalTrigger";
import { deleteCar } from "@/app/(protected)/services/createCar/api";

interface LogoData {
  id: string;
  title: string;
  thumbnail: string | { web?: string; mobile?: string };
  companyUrl: string;
  active: boolean;
  brand: string;
  model: string;
  pageType: string;
  bodyType: "Sedan" | "SUV" | "Hatchback" | "Coupe" | "Convertible";
  fuelType: ("Petrol" | "Diesel" | "CNG" | "EV")[];
  mileage: number;
  engine: string;
  transmission: "Manual" | "Automatic";
  seatCapacity: number;
  priceRange: string;
  description: string;
  dimensions: {
    length: number;
    width: number;
    height: number;
    wheelbase: number;
  };
}

interface ColumnsLogoProps {
  fetchData: () => void;
  router: AppRouterInstance;
  setSelectedDate: React.Dispatch<React.SetStateAction<Date | undefined>>;
  selectedDate?: Date;
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export const columnsLogo = ({
  fetchData,
  router,
  setSelectedDate,
  selectedDate,
  open,
  setOpen,
}: ColumnsLogoProps): ColumnDef<LogoData>[] => [
  {
    id: "select",
    header: ({ table }: { table: Table<LogoData> }) => (
      <div className="flex items-center gap-2">
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() ? "indeterminate" : false)
          }
          onCheckedChange={(value: boolean) =>
            table.toggleAllPageRowsSelected(!!value)
          }
          aria-label="Select all"
        />
      </div>
    ),
    cell: ({ row }: { row: Row<LogoData> }) => (
      <div className="flex items-center gap-2 xl:w-16">
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value: boolean) => row.toggleSelected(!!value)}
          aria-label="Select row"
        />
      </div>
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    id: "serialNumber",
    header: "ID",
    cell: ({ row }: { row: Row<LogoData> }) => <span>{row.index + 1}</span>,
    enableSorting: false,
  },
  {
    accessorKey: "brand",
    header: "Brand",
    cell: ({ row }) => <span>{row.original.brand}</span>,
  },
  {
    accessorKey: "model",
    header: "Model",
    cell: ({ row }) => <span>{row.original.model}</span>,
  },

  {
    accessorKey: "bodyType",
    header: "Body Type",
    cell: ({ row }) => <span>{row.original.bodyType}</span>,
  },
  {
    accessorKey: "fuelType",
    header: "Fuel Type",
    cell: ({ row }) => <span>{row.original.fuelType.join(", ")}</span>,
  },
  {
    accessorKey: "mileage",
    header: "Mileage",
    cell: ({ row }) => <span>{row.original.mileage} km/l</span>,
  },
  {
    accessorKey: "engine",
    header: "Engine",
    cell: ({ row }) => <span>{row.original.engine}</span>,
  },
  {
    accessorKey: "transmission",
    header: "Transmission",
    cell: ({ row }) => <span>{row.original.transmissions.join(", ")}</span>,
  },
  {
    accessorKey: "seatCapacity",
    header: "Seat Capacity",
    cell: ({ row }) => <span>{row.original.seatCapacity}</span>,
  },
  {
    accessorKey: "priceRange",
    header: "Price Range",
    cell: ({ row }) => <span>{row.original.priceRange}</span>,
  },
  {
    accessorKey: "description",
    header: "Description",
    cell: ({ row }) => <span>{row.original.description}</span>,
  },
  {
    accessorKey: "dimensions",
    header: "Dimensions",
    cell: ({ row }) => {
      const d = row.original.dimensions;
      return (
        <span>{`L:${d.length}, W:${d.width}, H:${d.height}, WB:${d.wheelbase}`}</span>
      );
    },
  },
  {
    accessorKey: "thumbnail.mobile",
    header: "Image",
    cell: ({ row }) => {
      const thumbnailData = row.original.image;
      
      return (
        <Avatar className="w-8 h-8 rounded-none bg-transparent shadow-none border-none">
          {thumbnailData? (
            <AvatarImage src={thumbnailData} className="rounded-none" />
          ) : (
            <AvatarFallback className="rounded-none">NA</AvatarFallback>
          )}
        </Avatar>
      );
    },
  },


  {
    accessorKey: "active",
    header: "isActive",
    cell: ({ row }) => <ActiveToggleCell row={row} refreshData={fetchData} />,
  },

   {
    accessorKey: "variants",
    header: "Variants",
    cell: ({ row }) => <VariantsModalTrigger row={row.original} refreshData={fetchData}/>,
  },
  

  {
    id: "actions",
    header: "Action",
    enableHiding: false,
    cell: ({ row }) => {
      const handleDelete = async (id: string) => {
        const result = await deleteCar(id);
        if (result.data.message) {
          fetchData();
          toast.success("Logo data deleted");
        } else {
          toast.error("Logo data not deleted");
        }
      };

      return (
        <div className="flex items-center gap-2">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  className="w-7 h-7 border-default-200 dark:border-default-300 text-default-400"
                  onClick={() =>
                    router.push(
                      `/Car/home-section/new-car?id=${row.original._id}`
                    )
                  }
                >
                  <SquarePen className="w-3 h-3" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="top">
                <p>Edit</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  className="w-7 h-7 border-default-200 dark:border-default-300 text-default-400"
                  onClick={() => handleDelete(row.original._id)}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent
                side="top"
                className="bg-destructive text-destructive-foreground"
              >
                <p>Delete</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      );
    },
  },
];
