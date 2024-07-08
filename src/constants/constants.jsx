import { Folder, LayoutDashboard, Receipt, Settings } from "lucide-react";

export const routeOptions = [
  {
    route: "/Home",
    name: "Dashboard",
    icon: <LayoutDashboard />,
  },
  {
    route: "/reports",
    name: "Relatórios",
    icon: <Folder />,
  },
];
