"use client";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { ColumnDef, Row } from "@tanstack/react-table";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
// Make sure this import path is correct and that the function is properly exported
import { deleteDevice } from "@/app/(protected)/services/deviceInfo/api";

const fields = ["phoneNumber", "deviceId", "model", "brand", "idfa"] as const;

export type DataProps = {
  id?: string;
} & {
  [key in (typeof fields)[number]]?: string | number | boolean;
};

export const columns = (
  fetchData: () => Promise<void>, 
): ColumnDef<DataProps>[] => [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    id: "index",
    header: "ID",
    cell: ({ row }) => <span>{row.index + 1}</span>,
  },
  ...fields.map((key) => ({
    accessorKey: key,
    header:
      key.charAt(0).toUpperCase() +
      key
        .slice(1)
        .replace(/([A-Z])/g, " $1")
        .trim(),
    cell: ({ row }: { row: Row<DataProps> }) => (
      <span>{String(row.original[key] ?? "-")}</span>
    ),
  })),
  {
    id: "actions",
    header: "Action",
    enableHiding: false,
    cell: ({ row }) => {
      const handleDelete = async (id:string| undefined) => {
   
        if (!id) {
          toast.error("Invalid device ID");
          return;
        }

        try {
          // Make sure deleteDevice is properly defined and returns the expected format
          const result = await deleteDevice(id);

          // Safe check on result structure
          if (result && result.success) {
            toast.success("Device deleted successfully");
            // You'd typically want to refresh data here
            // This might need to be handled by a parent component
            fetchData()
          } else {
            toast.error("Failed to delete device");
          }
        } catch (error) {
          console.error("Error deleting device:", error);
          toast.error("Error occurred while deleting device");
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
                    handleDelete(row.original.id as string | undefined)
                  }
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
