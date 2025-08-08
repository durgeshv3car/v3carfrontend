import React from "react";
import FooterContent from "./footer-content";
import { Link } from "@/components/navigation";
import Image from "next/image";
import { Icon } from "@/components/ui/icon";
import { auth } from "@/lib/auth";

const DashCodeFooter = async () => {
  const session = await auth();
  return (
    <FooterContent>
      <div className="flex md:hidden justify-around items-center">
        <Link href="profile">
          <div className="h-[50px] w-[50px] rounded-full relative left-[0px] top-[0px] custom-dropshadow">
            <Image
              src={session?.user?.image as string}
              alt={session?.user?.name?.charAt(0) as string}
              width={50}
              height={50}
              className="w-full h-full rounded-full border-2"
            />
          </div>
        </Link>

        <Link href="notifications">
          <div>
            <span className="relative cursor-pointer rounded-full text-[20px] flex flex-col items-center justify-center mb-1">
              <Icon icon="heroicons-outline:bell" />
              <span className="absolute right-[17px] lg:top-0 -top-2 h-4 w-4 bg-red-500 text-[8px] font-semibold flex flex-col items-center justify-center rounded-full text-white z-[99]">
                2
              </span>
            </span>
            <span className="block text-xs text-default-600">
              Notifications
            </span>
          </div>
        </Link>
      </div>
    </FooterContent>
  );
};

export default DashCodeFooter;
