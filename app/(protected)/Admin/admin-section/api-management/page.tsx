import { notFound } from "next/navigation";
import { checkRoute } from "@/app/(protected)/helper";
import Users from "./components/Api-Management"; 

export default async function MainPage() {
  const allowed = await checkRoute("Api Management");
  if (!allowed) notFound();

  return <Users />;
}
