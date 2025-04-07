"use client";
import { useState, useEffect,useRef } from "react";
import SiteBreadcrumb from "@/components/site-breadcrumb";
import { Card, CardContent } from "@/components/ui/card";
import ExampleTwo from "./table";
import { columns } from "./table/columns";
import { fetchOfferLeads } from "../../services/offerleads/api";


const OfferLeadsPage = () => {
  const [selectedValues, setSelectedValues] = useState({
    source:"",
    title: null,
    category: null,
    user: "",
    phone: null,
  });

  const [data, setData] = useState<DataProps[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [refresh, setRefresh] = useState<boolean>(false);



  
  const hasFetched = useRef(false);

  useEffect(() => {
    if (hasFetched.current) return; 
  
    const fetchOfferLeadsData = async () => {
      try {
        hasFetched.current = true; 
        const result = await fetchOfferLeads();
        if (result.status === 404) {
          setData([]);
          return;
        }
        console.log("result", result);
        setData(result);
      } catch (error) {
        console.error("Error fetching offer leads:", error);
      }
    };
  
    fetchOfferLeadsData();
  }, [refresh]);
  
  

  const filteredData = data.filter((item) => {
    return (
      (!selectedValues.title?.trim() ||
        (item.offer?.title &&
          item.offer.title.toLowerCase().includes(selectedValues.title.toLowerCase()))) &&
      (!selectedValues.category?.trim() ||
        (item.offer?.category &&
          item.offer.category.toLowerCase().includes(selectedValues.category.toLowerCase()))) &&
      (!selectedValues.user?.trim() ||
        (item.user?.firstName &&
          item.user.firstName.toLowerCase() === selectedValues.user.toLowerCase())) &&
      (!selectedValues.phone?.trim() ||
        (item.user?.phoneNumber &&
          item.user.phoneNumber.includes(selectedValues.phone)))
    );
  });
  
  return (
    <div className="bg-white p-5 shadow rounded-md">
      <SiteBreadcrumb />

      <div className="mt-6  space-y-6">
        <Card>
          <CardContent>
            <ExampleTwo
              selectedValues={selectedValues}
              setSelectedValues={setSelectedValues}
              tableData={filteredData}
              tableColumns={columns}
              setRefresh={setRefresh}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default OfferLeadsPage;
