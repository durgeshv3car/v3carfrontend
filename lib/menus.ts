export type SubChildren = {
  href: string;
  label: string;
  active: boolean;
  children?: SubChildren[];
};
export type Submenu = {
  href: string;
  label: string;
  active: boolean;
  icon: any;
  submenus?: Submenu[];
  children?: SubChildren[];
};

export type Menu = {
  href: string;
  label: string;
  active: boolean;
  icon: any;
  submenus: Submenu[];
  id: string;
};

export type Group = {
  groupLabel: string;
  menus: Menu[];
  id: string;
};

export function getMenuList(pathname: string, role: string): Group[] {
  return [
    {
      groupLabel: "",
      id: "dashboard",
      menus: [
        {
          id: "dashboard",
          href: "/dashboard",
          label: "dashboard",
          active: pathname.includes("/dashboard"),
          icon: "heroicons-outline:home",
          submenus: [
          
           
          
            {
              href: "/dashboard/leads",
              label: "leads",
              active: pathname === "/dashboard/leads",
              icon: "heroicons:credit-card",
              children: [],
            },
            
            {
              href: "/dashboard/offerleads",
              label: "offerleads",
              active: pathname === "/dashboard/offerleads",
              icon: "heroicons:credit-card",
              children: [],
            },
          ],
        },
      ],
    },
    {
      groupLabel: "",
      id: "layout",
      menus: [
        {
          id: "layout",
          href: "",
          label: "layout",
          active: pathname.includes("/dashboard"),
          icon: "heroicons-outline:home",
          submenus: [
           
            {
              href: "/layout/home-section/slider",
              label: "Sliders",
              active: pathname === "/layout/home-section/slider",
              icon: "heroicons:arrow-trending-up",
              children: [],
            },
            {
              href: "/layout/home-section/logo",
              label: "Logos",
              active: pathname === "/layout/home-section/logo",
              icon: "heroicons:arrow-trending-up",
              children: [],
            },
            {
              href: "/layout/home-section/offer",
              label: "Offers",
              active: pathname === "/layout/home-section/offer",
              icon: "heroicons:arrow-trending-up",
              children: [],
            },
            {
              href: "/layout/home-section/refer-earn",
              label: "Refer&Earns",
              active: pathname === "/layout/home-section/refer-earn",
              icon: "heroicons:arrow-trending-up",
              children: [],
            },
            {
              href: "/layout/home-section/money-smart",
              label: "MoneySmarts",
              active: pathname === "/layout/home-section/money-smart",
              icon: "heroicons:arrow-trending-up",
              children: [],
            },
            {
              href: "/layout/home-section/category",
              label: "Category",
              active: pathname === "/layout/home-section/category",
              icon: "heroicons:arrow-trending-up",
              children: [],
            },
           
          ],
        },
      ],
    },
    {
      groupLabel: "",
      id: "messageCenter",
      menus: [
        {
          id: "messageCenter",
          href: "",
          label: "messageCenter",
          active: pathname.includes("/dashboard"),
          icon: "heroicons-outline:home",
          submenus: [
           
            {
              href: "/messageCenter/application",
              label: "Application",
              active: pathname === "/messageCenter/application",
              icon: "heroicons:arrow-trending-up",
              children: [],
            },
            {
              href: "/messageCenter/whatsapp",
              label: "Whatsapp",
              active: pathname === "/messageCenter/whatsapp",
              icon: "heroicons:arrow-trending-up",
              children: [],
            },
            {
              href: "/messageCenter/sms",
              label: "Sms",
              active: pathname === "/messageCenter/sms",
              icon: "heroicons:arrow-trending-up",
              children: [],
            },
            {
              href: "/messageCenter/email",
              label: "Email",
              active: pathname === "/messageCenter/email",
              icon: "heroicons:arrow-trending-up",
              children: [],
            },
           
          ],
        },
      ],
    },
    {
      groupLabel: "",
      id: "pages",
      menus: [
        {
          id: "pages",
          href: "",
          label: "pages",
          active: pathname.includes("/dashboard"),
          icon: "heroicons-outline:home",
          submenus: [
           
            {
              href: "/pages/faq",
              label: "Faq",
              active: pathname === "/pages/faq",
              icon: "heroicons:arrow-trending-up",
              children: [],
            },
            {
              href: "/pages/policy",
              label: "Policy",
              active: pathname === "/pages/policy",
              icon: "heroicons:arrow-trending-up",
              children: [],
            },
           
          ],
        },
      ],
    },
  ];
}

