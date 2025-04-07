"use client";
import { useState, useEffect } from "react";
import SiteBreadcrumb from "@/components/site-breadcrumb";
import { Card, CardContent } from "@/components/ui/card";
import ExampleTwo from "./table";
import { columns } from "./table/columns";
import { fetchUsers } from "../../services/users/api";

const LeadPage = () => {
  const [selectedValues, setSelectedValues] = useState({
    firstName: null,
    lastName: null,
    email: null,
    dob: null,
    pan: null,
    pinCode: null,
    city: null,
    state: null,
    houseNo: null,
    streetAddress: null,
    landmark: null,
    gender: null,
    education: null,
    maritalStatus: null,
  });

  const [data, setData] = useState<DataProps[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [refresh, setRefresh] = useState<boolean>(false);
  const fetchData = async () => {
    try {
      const result = await fetchUsers();

      if (!result || result.status === 404) {
        setData([]);
        return;
      }

     
      setData(Array.isArray(result) ? result : [result]);

    } catch (error) {
      console.error("Error fetching data:", error);
      setData([]); // Ensure state is always an array
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [refresh]);

  return (
    <>
      <SiteBreadcrumb />
      <div className="">
        <ExampleTwo
          selectedValues={selectedValues}
          setSelectedValues={setSelectedValues}
          tableData={data}
          tableColumns={columns}
        />
      </div>
    </>
  );
};

export default LeadPage;
