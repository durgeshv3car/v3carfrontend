import { notFound } from "next/navigation";
import { checkRoute } from "@/app/(protected)/helper";
import Users from "./components/Slider"; 

export default async function MainPage() {
  const allowed = await checkRoute("Top Banner");
  if (!allowed) notFound();

  return <Users />;
}
