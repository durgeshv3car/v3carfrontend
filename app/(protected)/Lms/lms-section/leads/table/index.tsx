"use client";

import * as React from "react";
import {
  flexRender,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  getCoreRowModel,
  PaginationState,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";

import { Button } from "@/components/ui/button";
const EditModal = dynamic(() => import("../components/EditModal"), {
  ssr: false,
  loading: () => <p>Loading modal...</p>,
});

const ImportExportButtons = dynamic(() => import("../components/Download"), {
  ssr: false,
  loading: () => <p>Loading modal...</p>,
});

import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Icon } from "@/components/ui/icon";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import dynamic from "next/dynamic";

const OfferSelectionModal = dynamic(
  () => import("../components/OfferSelectionModal"),
  {
    ssr: false,
    loading: () => <p>Loading modal...</p>,
  }
);
const Filter = dynamic(() => import("../components/Filter"), {
  ssr: false,
});
const TablePagination = dynamic(() => import("./table-pagination"), {
  ssr: false,
});

import { useSearchParams } from "next/navigation";
import { ColumnDef } from "@tanstack/react-table";

// import { SelectedValues } from "../page";
import { DataProps } from "./columns";
import { SelectedValues } from "../components/Leads";

interface ExampleTwoProps {
  selectedValues: SelectedValues;
  setSelectedValues: React.Dispatch<React.SetStateAction<SelectedValues>>;
  tableData: DataProps[];
  tableColumns: ColumnDef<DataProps, any>[];
  setRefresh: React.Dispatch<React.SetStateAction<boolean>>;
  allFilterOptions: Record<string, any>;
}

const ExampleTwo = <TData extends Record<string, any>>({
  selectedValues,
  setSelectedValues,
  tableData,
  tableColumns,
  setRefresh,
  allFilterOptions,
}: ExampleTwoProps) => {
  const searchParams = useSearchParams();
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [selectedColumn, setSelectedColumn] = React.useState<
    string | undefined
  >();

  const [isModalOpenOffer, setIsModalOpenOffer] = React.useState(false);
  const [pageSize, setPageSize] = React.useState(20);

  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [rowSelection, setRowSelection] = React.useState<Record<string, boolean>>({});
  const [selectedRowsData, setSelectedRowsData] = React.useState<DataProps[]>([]);
  const [type, setType] = React.useState<string | null>(null);
  const [selectedOffer, setSelectedOffer] = React.useState<any>(null);
  const [pagination, setPagination] = React.useState<PaginationState>({
    pageIndex: 0,
    pageSize,
  });

  const leadId = searchParams?.get("id") || "";

  const [isCreatingNotification, setIsCreatingNotification] =
    React.useState(false);
  React.useEffect(() => {
    setIsModalOpen(!!leadId);
  }, [leadId]);

  const closeModal = () => setIsModalOpen(false);

   React.useEffect(() => {
     setPagination((prev) => ({
       ...prev,
       pageIndex: 0,
       pageSize: Number(pageSize),
     }));
   }, [pageSize]);
  

  const table = useReactTable({
    data: tableData,
    columns: tableColumns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onPaginationChange: setPagination,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
      pagination, 
    },
  });

  React.useEffect(() => {
    const selectedData = table
      .getSelectedRowModel()
      .rows.map((row) => row.original);
    setSelectedRowsData(selectedData);
  }, [table, rowSelection]);

  React.useEffect(() => {
    const creatingNotification = searchParams?.get("createnotification");
    setType(searchParams?.get("type") as string);

    if (creatingNotification === "true") {
      console.log("creatingNotification detected");
      setIsCreatingNotification(true);
    }
  }, [searchParams]);

  return (
    <div className="w-full">
      {/* Header & Filter Section */}
      <div className="py-4 px-5 mb-6 bg-card text-card-foreground rounded-md">
        <React.Suspense fallback={<div>Loading...</div>}>
          <Filter
            selectedValues={selectedValues}
            setSelectedValues={setSelectedValues}
            data={tableData}
            allFilterOptions={allFilterOptions}
          />
        </React.Suspense>
      </div>

      {/* Display Selected Values */}

      <div className="py-4 px-5 bg-whit rounded-md">
        <div className="flex items-center justify-between">
          <div className="text-xl font-medium text-default-900">Users Data</div>
          <div className="flex items-center gap-4">
            {/* Select for Rows per Page */}
            <React.Suspense fallback={<div>Loading...</div>}>
              <ImportExportButtons
                setRefresh={setRefresh}
                filteredData={tableData}
                columns={tableColumns}
              />
            </React.Suspense>
            <label className="text-sm text-gray-600">Rows per page:</label>
            <Select
              onValueChange={(value) => setPageSize(Number(value))}
              value={String(pageSize)}
            >
              <SelectTrigger className="w-20 border rounded px-2 py-1">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {[20, 50, 100].map((value) => (
                  <SelectItem key={value} value={String(value)}>
                    {value}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Select for Column Visibility */}
            <label className="text-sm text-gray-600">Hide Column:</label>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="ml-auto">
                  Columns
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {table
                  .getAllColumns()
                  .filter((column) => column.getCanHide())
                  .map((column) => {
                    return (
                      <DropdownMenuCheckboxItem
                        key={column.id}
                        className="capitalize"
                        checked={column.getIsVisible()}
                        onCheckedChange={(value) =>
                          column.toggleVisibility(!!value)
                        }
                      >
                        {column.id}
                      </DropdownMenuCheckboxItem>
                    );
                  })}
              </DropdownMenuContent>
            </DropdownMenu>

            <React.Suspense fallback={<div>Loading...</div>}>
              {isCreatingNotification && (
                <button
                  className="ml-auto bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed disabled:opacity-50"
                  disabled={Object.keys(rowSelection).length === 0}
                  onClick={() => setIsModalOpenOffer(true)}
                >
                  Send {type}
                </button>
              )}
            </React.Suspense>
          </div>
        </div>

        {/* Table Component */}
        <Table>
          <TableHeader className="bg-default-200">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead
                    key={header.id}
                    onClick={header.column.getToggleSortingHandler()}
                    className="cursor-pointer select-none"
                  >
                    {header.isPlaceholder ? null : (
                      <div className="flex items-center justify-between">
                        {flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                        {header.column.getIsSorted() && (
                          <span className="text-sm">
                            {header.column.getIsSorted() === "asc" ? (
                              <TooltipProvider>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <span className="cursor-pointer">
                                      <Icon icon="heroicons:arrow-up" />
                                    </span>
                                  </TooltipTrigger>
                                </Tooltip>
                              </TooltipProvider>
                            ) : (
                              <TooltipProvider>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <span className="cursor-pointer">
                                      <Icon icon="heroicons:arrow-down" />
                                    </span>
                                  </TooltipTrigger>
                                </Tooltip>
                              </TooltipProvider>
                            )}
                          </span>
                        )}
                      </div>
                    )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>

          <TableBody>
            {table.getRowModel().rows.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={tableColumns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination Component */}
      <React.Suspense fallback={<div>Loading...</div>}>
        <TablePagination table={table} />
      </React.Suspense>
      <React.Suspense fallback={<div>Loading...</div>}>
        {isModalOpenOffer && (
          <OfferSelectionModal
            selectedRowsData={selectedRowsData}
            isOpen={isModalOpenOffer}
            onClose={() => setIsModalOpenOffer(false)}
            onSelectOffer={(offer) => setSelectedOffer(offer)}
          />
        )}
      </React.Suspense>
      <React.Suspense fallback={<div>Loading...</div>}>
        {isModalOpen && (
          <EditModal
            id={leadId}
            onClose={closeModal}
            tableData={tableData}
            setRefresh={setRefresh}
          />
        )}
      </React.Suspense>
    </div>
  );
};

export default ExampleTwo;