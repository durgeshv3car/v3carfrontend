import { Link } from "@/i18n/routing";
import Image from "next/image";
import dynamic from "next/dynamic";
import Copyright from "@/components/partials/auth/copyright";
import Logo from "@/components/partials/auth/logo";
import { auth } from "@/lib/auth";
import LoginForm from "@/components/partials/auth/login-form";


const Login = async () => {
  const session = await auth();
  let token = "";

  if ((session?.user as { token?: string })?.token) {
    token = (session?.user as { token?: string })?.token || "";
  }

  return (
    <>
      <div className="flex w-full items-center overflow-hidden min-h-dvh h-dvh basis-full">
        <div className="overflow-y-auto flex flex-wrap w-full h-dvh">
          <div
            className="lg:block hidden flex-1 overflow-hidden text-[40px] leading-[48px] text-default-600 
 relative z-[1] bg-default-50"
          >

            <div className="md:w-1/2 m-auto h-full w-full flex justify-center items-center"><div>
              <Image alt="" loading="lazy" width="500" height="500" decoding="async" data-nimg="1" className="object-contain" src="/images/logo/logo.svg" />
              </div></div>

          </div>
          <div className="flex-1 relative">
            <div className=" h-full flex flex-col  dark:bg-default-100 bg-white">
              <div className="max-w-[524px] md:px-[42px] md:py-[44px] p-7  mx-auto w-full text-2xl text-default-900  mb-3 h-full flex flex-col justify-center">
                <div className="flex justify-center items-center text-center mb-6 lg:hidden ">
                  <Link href="/">
                    <Logo />
                  </Link>
                </div>
                <div className="text-center 2xl:mb-10 mb-4">
                  <h4 className="font-medium">Sign in</h4>
                  <div className="text-default-500 text-base">
                    Sign in to your account to start using CreditCircle
                  </div>
                </div>
                <LoginForm token={token} />
              </div>
              <div className="text-xs font-normal text-default-500  z-[999] pb-10 text-center">
                <Copyright />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;
