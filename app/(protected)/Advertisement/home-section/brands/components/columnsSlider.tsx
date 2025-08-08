"use client";
import React, { useEffect, useState } from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
// import ActiveToggleCell from "./ActiveToggleCell";
import { ColumnDef, Row, Table } from "@tanstack/react-table";

import { SquarePen, Trash2, CalendarClock } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "sonner";
import axios from "axios";
import { Switch } from "@/components/ui/switch";
import { Calendar } from "@/components/ui/calendar";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";

import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { deleteBrandsImage } from "@/app/(protected)/services/brands/api";

export interface SliderData {
  _id: string;
  name: string;
  image: string 
  description:string;
  companyUrl: string;
  active: boolean;
}

interface ColumnsSliderProps {
  fetchData: () => void;
  router: AppRouterInstance;
  setSelectedDate: React.Dispatch<React.SetStateAction<Date | undefined>>;
  selectedDate?: Date;
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export const columnsSlider = ({
  fetchData,
  router,
  setSelectedDate,
  selectedDate,
  open,
  setOpen,
}: ColumnsSliderProps): ColumnDef<SliderData>[] => [
  {
    id: "select",
    header: ({ table }) => (
      <div className="flex items-center gap-2">
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && "indeterminate")
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
    accessorKey: "name",
    header: "Name",
    cell: ({ row }) => (
      <div className="flex gap-3 items-center">
        <span className="text-sm">{row.original.name}</span>
      </div>
    ),
  },

  {
    accessorKey: "thumbnail.mobile",
    header: "Image",
    cell: ({ row }) => {
      const thumbnailData = row.original.image;

      return (
        <Avatar className="w-8 h-8 rounded-none bg-transparent shadow-none border-none">
          {thumbnailData ? (
            <AvatarImage src={thumbnailData} className="rounded-none" />
          ) : (
            <AvatarFallback className="rounded-none">NA</AvatarFallback>
          )}
        </Avatar>
      );
    },
  },

  {
    accessorKey: "description",
    header: "Description",
    cell: ({ row }) => (
      <div className="flex gap-3 items-center">
        <span className="text-sm">{row.original.description}</span>
      </div>
    ),
  },

  // {
  //   accessorKey: "active",
  //   header: "isActive",
  //   cell: ({ row }) => <ActiveToggleCell row={row} refreshData={fetchData} />,
  // },

  {
    id: "actions",
    header: "Action",
    enableHiding: false,
    cell: ({ row }) => {
      const handleDelete = async (id: string) => {
        const result = await deleteBrandsImage(id);
        

        if (result.data) {
          fetchData();
          toast.success("Brand data deleted");
        } else {
          toast.error("Brand data not deleted");
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
                      `/Advertisement/home-section/brands?id=${row.original._id}`
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
  // {
  //   id: "schedulExpire",
  //   header: "schedulExpire",
  //   enableHiding: false,
  //   cell: ({ row }) => {

  //     const type = "slider";

  //     const handleDateSelect = (date) => {
  //       setSelectedDate(date);
  //       console.log("Selected Deletion Date:", date);
  //     };

  //     const handleScheduleDelete = async () => {
  //       if (!selectedDate) {
  //         console.log("❌ No date selected");
  //         return;
  //       }

  //       const result = await scheduleDeleteSliderImage(row.original.id, type, selectedDate);

  //       if (result.success) {
  //         setOpen(false);
  //       }
  //     };

  //     return (
  //       <div className="flex items-center gap-2">
  //         <Dialog open={open} onOpenChange={setOpen}>
  //           <TooltipProvider>
  //             <Tooltip>
  //               <TooltipTrigger asChild>
  //                 <DialogTrigger asChild>
  //                   <Button
  //                     variant="outline"
  //                     size="icon"
  //                     className="w-7 h-7 border-default-200 dark:border-default-300 text-default-400"
  //                     onClick={() => setOpen(true)}
  //                   >
  //                     <CalendarClock className="w-3 h-3" />
  //                   </Button>
  //                 </DialogTrigger>
  //               </TooltipTrigger>
  //               <TooltipContent side="top">
  //                 <p>Auto Delete Calendar</p>
  //               </TooltipContent>
  //             </Tooltip>
  //           </TooltipProvider>

  //           {/* Calendar Dialog */}
  //           <DialogContent className="p-4">
  //             <h2 className="text-lg font-semibold">Select Deletion Date</h2>
  //             <Calendar
  //               mode="single"
  //               selected={selectedDate}
  //               onSelect={handleDateSelect} // Updates state and logs the value
  //               className="border rounded-md p-2"
  //             />
  //             <Button className="mt-4 w-full" onClick={handleScheduleDelete}>
  //               Schedule Delete
  //             </Button>
  //           </DialogContent>
  //         </Dialog>
  //       </div>
  //     );
  //   },
  // }
];
