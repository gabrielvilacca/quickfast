import {
  Folder,
  LayoutDashboard,
  Users,
} from "lucide-react";

export const routeOptions = [
  {
    route: "/Home",
    name: "Dashboard",
    icon: <LayoutDashboard />,
  },
  {
    route: "/opcao02",
    name: "opção 1",
    icon: <Folder />,
  },
  {
    route: "/opcao03",
    name: "opção 2",
    icon: <Users />,
  },
];
