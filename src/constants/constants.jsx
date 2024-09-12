import {
  Folder,
  LayoutDashboard,
  Receipt,
  Settings,
  Users,
} from "lucide-react";

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
  {
    route: "/team",
    name: "Clientes",
    icon: <Users />,
  },
];
