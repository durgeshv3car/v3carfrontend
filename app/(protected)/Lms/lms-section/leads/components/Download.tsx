import * as React from "react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  FileUp,
  FileDown,
  FileSpreadsheet,
  ChevronDown,
  Loader2,
} from "lucide-react";
import { addcsv } from "@/app/(protected)/services/csv/api";
import { toast } from "@/components/ui/use-toast";
import { saveAs } from 'file-saver';
import * as XLSX from 'xlsx';
import { ColumnDef } from "@tanstack/react-table";

export interface ImportExportButtonsProps<TData> {
  setRefresh: React.Dispatch<React.SetStateAction<boolean>>;
  filteredData: TData[];
  columns: ColumnDef<TData>[];
}

const ImportExportButtons = <TData extends Record<string, any>>({
  setRefresh,
  filteredData,
  columns,
}: ImportExportButtonsProps<TData>) => {
  const [isLoading, setIsLoading] = useState(false);
  
  const refreshData = () => {
    setRefresh((prev) => !prev);
  };

  // Function to handle CSV import
  const handleImportCSV = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".csv";
    input.onchange = async (e) => {
      const target = e.target as HTMLInputElement;
      const file = target?.files?.[0];
      if (file) {
        try {
          setIsLoading(true);
          const result = await addcsv(file);

          if (result.success) {
            refreshData();
            toast({
              title: "Success",
              description: "CSV file imported successfully",
            });
          } else {
            throw new Error("Failed to import CSV");
          }
        } catch (error) {
          console.error("Error importing CSV:", error);
          toast({
            title: "Error",
            description: error instanceof Error ? error.message : "Failed to import CSV file",
            variant: "destructive",
          });
        } finally {
          setIsLoading(false);
        }
      }
    };
    input.click();
  };

  // Function to handle XLSX import
  const handleImportXLSX = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".xlsx";
    input.onchange = async (e) => {
      const target = e.target as HTMLInputElement | null;
      const file = target?.files?.[0];
      if (file) {
        try {
          setIsLoading(true);
          const result = await addcsv(file);

          if (result.success) {
            refreshData();
            toast({
              title: "Success",
              description: "XLSX file imported successfully",
            });
          } else {
            throw new Error("Failed to import XLSX");
          }
        } catch (error) {
          console.error("Error importing XLSX:", error);
          toast({
            title: "Error",
            description: error instanceof Error ? error.message : "Failed to import XLSX file",
            variant: "destructive",
          });
        } finally {
          setIsLoading(false);
        }
      }
    };
    input.click();
  };

  // Function to extract exportable columns data
  const getExportableColumns = () => {
    return columns.map(col => {
      const id = typeof col.id === 'string' ? col.id : '';
  
      // Get header
      let header = '';
      if (typeof col.header === 'string') {
        header = col.header;
      } else if (col.header === undefined && 'accessorKey' in col && typeof col.accessorKey === 'string') {
        header = col.accessorKey;
      } else if ('accessorFn' in col && typeof col.accessorFn === 'function' && id) {
        header = id;
      }
  
      // Get accessor key safely
      const accessorKey = 'accessorKey' in col && typeof col.accessorKey === 'string'
        ? col.accessorKey
        : id;
  
      return { accessorKey, header };
    }).filter(col => col.header && col.accessorKey);
  };
  
  // Function to safely extract data from a row
  const extractRowData = (row: TData, accessorKey: string) => {
    try {
      // Handle nested properties using dot notation (e.g., "user.name")
      if (accessorKey.includes('.')) {
        const parts = accessorKey.split('.');
        let value = row as any;
        for (const part of parts) {
          if (value === null || value === undefined) return '';
          value = value[part];
        }
        return value !== undefined && value !== null ? value : '';
      }
      
      // Simple property access
      const value = (row as any)[accessorKey];
      return value !== undefined && value !== null ? value : '';
    } catch (error) {
      console.error(`Error extracting data for ${accessorKey}:`, error);
      return '';
    }
  };

  // Function to handle CSV export
  const handleExportCSV = () => {
    if (!filteredData || !filteredData.length) {
      toast({
        title: "Error",
        description: "No data available for export",
        variant: "destructive",
      });
      return;
    }

    try {
      const exportableColumns = getExportableColumns();
      
      if (!exportableColumns.length) {
        toast({
          title: "Error",
          description: "No valid columns found for export",
          variant: "destructive",
        });
        return;
      }

      const headers = exportableColumns.map(col => col.header);
      let csvContent = headers.join(',') + '\n';

      // Add data rows
      filteredData.forEach(row => {
        const rowData = exportableColumns.map(col => {
          const value = extractRowData(row, col.accessorKey);
          // Escape quotes in CSV by doubling them and wrap in quotes
          const cellText = String(value).replace(/"/g, '""');
          return `"${cellText}"`;
        });
        csvContent += rowData.join(',') + '\n';
      });

      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      saveAs(blob, 'export.csv');
      
      toast({
        title: "Success",
        description: "CSV file exported successfully",
      });
    } catch (error) {
      console.error("Error exporting CSV:", error);
      toast({
        title: "Error",
        description: "Failed to export CSV file",
        variant: "destructive",
      });
    }
  };

  // Function to handle XLSX export
  const handleExportXLSX = () => {
    if (!filteredData || !filteredData.length) {
      toast({
        title: "Error",
        description: "No data available for export",
        variant: "destructive",
      });
      return;
    }

    try {
      const exportableColumns = getExportableColumns();
      
      if (!exportableColumns.length) {
        toast({
          title: "Error",
          description: "No valid columns found for export",
          variant: "destructive",
        });
        return;
      }

      const headers = exportableColumns.map(col => col.header);
      const excelData = [headers];

      filteredData.forEach(row => {
        const rowData = exportableColumns.map(col => 
          extractRowData(row, col.accessorKey)
        );
        excelData.push(rowData);
      });

      const wb = XLSX.utils.book_new();
      const ws = XLSX.utils.aoa_to_sheet(excelData);
      XLSX.utils.book_append_sheet(wb, ws, 'TableData');
      const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
      const blob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      saveAs(blob, 'export.xlsx');
      
      toast({
        title: "Success",
        description: "XLSX file exported successfully",
      });
    } catch (error) {
      console.error("Error exporting XLSX:", error);
      toast({
        title: "Error",
        description: "Failed to export XLSX file",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="flex space-x-4">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button className="flex items-center gap-2" disabled={isLoading}>
            {isLoading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <FileUp size={16} />
            )}
            Add
            <ChevronDown size={16} className="ml-1" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem onClick={handleImportCSV} disabled={isLoading}>
            <FileSpreadsheet className="mr-2 h-4 w-4" />
            <span>Import CSV</span>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={handleImportXLSX} disabled={isLoading}>
            <FileSpreadsheet className="mr-2 h-4 w-4" />
            <span>Import XLSX</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button className="flex items-center gap-2">
            <FileDown size={16} />
            Download
            <ChevronDown size={16} className="ml-1" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem onClick={handleExportCSV}>
            <FileSpreadsheet className="mr-2 h-4 w-4" />
            <span>Export CSV</span>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={handleExportXLSX}>
            <FileSpreadsheet className="mr-2 h-4 w-4" />
            <span>Export XLSX</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default ImportExportButtons;