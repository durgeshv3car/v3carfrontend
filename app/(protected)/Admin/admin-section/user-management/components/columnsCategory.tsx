"use client";
import React from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Eye, SquarePen, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import { ColumnDef } from "@tanstack/react-table";
import ActiveToggleCell from "./ActiveToggleCell";
import { deleteAPi } from "@/app/(protected)/services/apiManagement/api";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { deleteUser } from "@/app/(protected)/services/adminUsers/api";

export interface Categorys {
  id: string; // Ensure this matches the key in your data
  username: string; // Ensure this matches the key in your data
  email: string;
  role: string;
  active: boolean; // Add this field if it exists in your data
}

interface ColumnsCategoryProps {
  fetchData: () => void;
  router: AppRouterInstance;
  adminId: string;
}

export const columnsCategory = ({
  fetchData,
  router,
  adminId,
}: ColumnsCategoryProps): ColumnDef<Categorys>[] => [
  {
    id: "select",
    header: ({ table }) => (
      <div className="flex items-center gap-2">
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() ? "indeterminate" : false)
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
        />
      </div>
    ),
    cell: ({ row }) => (
      <div className="flex items-center gap-2 xl:w-16">
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
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
    cell: ({ row }) => <span>{row.index + 1}</span>,
    enableSorting: false,
  },
  {
    accessorKey: "title", // Ensure this matches the key in your data
    header: "Title",
    cell: ({ row }) => (
      <div className="flex gap-3 items-center">
        <span className="text-sm">{row.original.username}</span>
      </div>
    ),
  },
  {
    accessorKey: "email", // Ensure this matches the key in your data
    header: "Email",
    cell: ({ row }) => (
      <div className="flex gap-3 items-center">
        <span className="text-sm">{row.original.email}</span>
      </div>
    ),
  },
  {
    accessorKey: "role", // Ensure this matches the key in your data
    header: "Role",
    cell: ({ row }) => (
      <div className="flex gap-3 items-center">
        <span className="text-sm">{row.original.role}</span>
      </div>
    ),
  },
  {
    accessorKey: "permissions", // Ensure this matches the key in your data
    header: "Permissions",
    cell: ({ row }) => (
      <div className="flex gap-3 items-center">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  className="w-7 h-7 ring-offset-transparent border-default-200 dark:border-default-300  text-default-400"
                  color="secondary"
                >
                  <Eye className="w-4 h-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="top">
                <p>View</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
   
      </div>
    ),
  },
  {
    id: "actions",
    header: "Action",
    enableHiding: false,
    cell: ({ row }) => {
      const handleDelete = async (id: string, adminId: string) => {
        try {
          const result = await deleteUser(id, adminId);
          if (result.success) {
            toast.success("User data deleted");
            fetchData();
          } else {
            toast.error("User data not deleted");
          }
        } catch (error) {
          console.error("Error deleting category:", error);
          toast.error("Failed to delete category");
        }
      };

      return (
        <>
          {row.original.role != "Super Admin" ? (
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
                          `/Admin/admin-section/user-management?id=${row.original.id}`
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
                      onClick={() => handleDelete(row.original.id, adminId)}
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
          ) : (
            <></>
          )}
        </>
      );
    },
  },
];
