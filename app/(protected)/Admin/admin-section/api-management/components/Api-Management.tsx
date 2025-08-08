"use client";

import React, { useState, useEffect } from "react";
import { notFound } from "next/navigation";
import { useRouter } from "@/i18n/routing";
import dynamic from "next/dynamic";
import { fetchApis } from "@/app/(protected)/services/apiManagement/api";
import { Loader2 } from "lucide-react";
import { columnsCategory } from "./columnsCategory";
import type { Categorys } from "./columnsCategory";
import type { ColumnDef } from "@tanstack/react-table";

// Dynamic imports
const ExampleTwo = dynamic(() => import("../../../adminTable"), {
  ssr: false,
});

function Category({
  adminId,
  role,
  permissions,
}: {
  adminId: string;
  role: string;
  permissions: any;
}) {
 

  const router = useRouter();
  const [data, setData] = useState<Categorys[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [refresh, setRefresh] = useState<boolean>(false);

  const type = "api";

  const fetchData = async () => {
    try {
      const result = await fetchApis();
      setData(result);
      console.log(result, "result");
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  console.log(refresh, "refresh");
  useEffect(() => {
    fetchData();
  }, [refresh]);

  if (loading)
    return <Loader2 className="me-2 h-4 w-4 animate-spin" />;

  return (
    <>
      <div className="space-y-6">
        <ExampleTwo
          tableHeading="Api List"
          tableData={data}
          tableColumns={columnsCategory({
            fetchData,
            router,
          }) as ColumnDef<Categorys>[]} 
          setRefresh={setRefresh}
          type={type}
          role={role}
          permissions={permissions}
        />
      </div>
    </>
  );
}

export default Category;
