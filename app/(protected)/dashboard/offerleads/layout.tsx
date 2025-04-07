import { Metadata } from "next";

export const metadata:Metadata={
  title: 'OfferLeads',
  description: 'OfferLeads Description'
}
const Layout = ({children}: {children: React.ReactNode}) => {
  return (
    <>
      {children}
    </>
  );
};

export default Layout;