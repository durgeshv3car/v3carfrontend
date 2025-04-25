"use client";

import React, { useState, useEffect } from "react";
import { notFound } from "next/navigation";
import { useRouter } from "@/i18n/routing";
import dynamic from "next/dynamic";
import { fetchApis } from "@/app/(protected)/services/apiManagement/api";

// Dynamic imports
const ExampleTwo = dynamic(() => import("../../adminTable"), {
  ssr: false,
});



interface DataProps {
  id: string;
  title: string;
}

function Category() {
  const allowed = ["Super Admin", "Admin"];
  const role = "Admin";
  if (!allowed.includes(role)) {
    notFound();
  }
  
  const router = useRouter();
  const [data, setData] = useState<DataProps[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [refresh, setRefresh] = useState<boolean>(false);
  const [columns, setColumns] = useState<any>(null);
  const type = "api";
  
  // Fetch columns dynamically
  useEffect(() => {
    const loadColumns = async () => {
      const columnsModule = await import("./components/columnsCategory");
      setColumns(() => columnsModule.columnsCategory(fetchData, router));
    };
    
    loadColumns();
  }, [router]);

  const fetchData = async () => {
    try {
      const result = await fetchApis();
      console.log("result", result.status);
      setData(result);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [refresh]);

  if (loading || !columns) return <div>Loading...</div>;
  
  return (
    <>
      <div className="space-y-6">
        <ExampleTwo
          tableHeading="Api List"
          tableData={data}
          tableColumns={columns}
          setRefresh={setRefresh}
          type={type}
        />
      </div>
    </>
  );
}

export default Category

