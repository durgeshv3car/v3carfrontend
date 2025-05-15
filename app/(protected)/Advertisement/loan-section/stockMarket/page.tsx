import { notFound } from "next/navigation";
import { checkRoute } from "@/app/(protected)/helper";
import Users from "./components/StockMarket"; 

export default async function MainPage() {
  const allowed = await checkRoute("Stock Market");
  if (!allowed) notFound();

  return <Users />;
}
