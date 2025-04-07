"use client";
import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import ExampleTwo from "../../example2";
import SiteBreadcrumb from "@/components/site-breadcrumb";
import { notFound } from "next/navigation";


import { columnsRecommend } from "./components/columnsRecommend";
import { fetchOffers } from "@/app/(protected)/services/offers/api";

function Users() {
  const allowed = ["superadmin", "admin"];
  const role = "admin";
  if (!allowed.includes(role)) {
    notFound();
  }

  const [data, setData] = useState<DataProps[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [refresh, setRefresh] = useState<boolean>(false);
  const type = "offer";

 const fetchData = async () => {
      try {
        const result = await fetchOffers(type);
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
              tableHeading="Offer List"
              tableData={data}
              tableColumns={columnsRecommend(fetchData)}
              setRefresh={setRefresh}
              type={type}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default Users;
