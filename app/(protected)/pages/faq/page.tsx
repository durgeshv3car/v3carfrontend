"use client";
import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import ExampleTwo from "../example2";
import SiteBreadcrumb from "@/components/site-breadcrumb";
import { notFound } from "next/navigation";
import { useRouter } from "next/navigation";

import { columnsCategory } from "./components/columnsCategory";
import { fetchCategories } from "@/app/(protected)/services/categorys/api";

function Category() {
  const allowed = ["superadmin", "admin"];
  const role = "admin";
  if (!allowed.includes(role)) {
    notFound();
  }
  const router = useRouter();
  const [data, setData] = useState<DataProps[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [refresh, setRefresh] = useState<boolean>(false);
  const type = "faq";

  const fetchData = async () => {
    try {
      const result = await fetchCategories();
      if (result.status == 404) {
        setData([]);
        return;
      }

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

  if (loading) return <p>Loading...</p>;
  return (
    <div>
      <SiteBreadcrumb />
      <div className="space-y-6">
        <Card>
          <CardContent className="p-0">
            <ExampleTwo
              tableHeading="Faq List"
              tableData={data}
              tableColumns={columnsCategory(fetchData,router)}
              setRefresh={setRefresh}
              type={type}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default Category;
