import { Button } from "@/shadcn/components/ui/button";
import {
  DashboardIcon,
  HomeIcon,
  InfoCircledIcon,
  LinkBreak2Icon,
  MagicWandIcon,
  PersonIcon,
  RocketIcon,
  ExitIcon,
} from "@radix-ui/react-icons";
import { useNavigate } from "react-router-dom";
import { useLogout } from "@/hooks/useLogout";
import Logo from "./Logo";
import { Separator } from "@/shadcn/components/ui/separator";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/shadcn/components/ui/avatar";
import { useAuthContext } from "@/hooks/useAuthContext";
import getInitials from "@/utils/getInitials";
import Loading from "./Loading";
import { useState } from "react";
import { ProfilePicDialog } from "./ProfilePicDialog";

const options = [
  {
    route: "/opt1",
    name: "Opção 1",
    icon: <HomeIcon />,
  },
  {
    route: "/opt2",
    name: "Opção 2",
    icon: <DashboardIcon />,
  },
  {
    route: "/opt3",
    name: "Opção 3",
    icon: <MagicWandIcon />,
  },
  {
    route: "/opt4",
    name: "Opção 4",
    icon: <LinkBreak2Icon />,
  },
  {
    route: "/opt5",
    name: "Opção 5",
    icon: <RocketIcon />,
  },
];

export default function Sidebar({ rerender, setRerender }) {
  const navigate = useNavigate();
  const { logout, isPending } = useLogout();
  const { user } = useAuthContext();
  const [activeRoute, setActiveRoute] = useState(0);

  const handleLogout = () => {
    logout();
  };

  console.log(user);

  return (
    <nav className="relative overflow-y-auto min-h-[calc(100vh_-_64px)] hidden sm:flex sm:flex-col sm:justify-between h-full w-[250px] bg-background border border-border">
      {isPending && <Loading />}
      <div className="bg-background fixed h-[calc(100vh_-_96px)] w-[248px] sm:flex-grow sm:flex sm:flex-col sm:justify-between">
        <div>
          <div className="py-5 px-2.5">
            <Logo size="sm" />
          </div>
          <div className="flex items-center gap-3 p-5">
            <ProfilePicDialog setRerender={setRerender}>
              <Avatar className="h-12 w-12" role="button">
                <AvatarImage src={user.photoURL?.replace("=s96-c", "")} />
                <AvatarFallback className="bg-primary text-secondary">
                  {getInitials(user.displayName)}
                </AvatarFallback>
              </Avatar>
            </ProfilePicDialog>

            <div>
              <p className="font-medium">{user.displayName}</p>
              <p className="text-muted-foreground/75 text-sm">
                Premium account
              </p>
            </div>
          </div>
          <div
            role="button"
            className={`py-3 px-5 flex items-center gap-3 transition-all duration-300 hover:bg-primary/5 ${
              -1 === activeRoute ? "bg-primary/5 font-medium" : ""
            }`}
            onClick={() => {
              setActiveRoute(-1);
              navigate("/account");
            }}
          >
            <PersonIcon />
            <p className="text-md">Minha conta</p>
          </div>
          <Separator className="my-2.5" />
          <div className="box-border">
            {options.map((option, index) => (
              <div
                key={option.route}
                role="button"
                className={`py-3 px-5 flex items-center gap-3 transition-all duration-300 hover:bg-primary/5  ${
                  index === activeRoute ? "bg-primary/5 font-medium" : ""
                }`}
                onClick={() => {
                  setActiveRoute(index);
                  navigate(option.route);
                }}
              >
                {option.icon}
                <p className="text-md">{option.name}</p>
              </div>
            ))}
          </div>
        </div>
        <div>
          <Separator className="my-3" />
          <div className="flex flex-col py-2.5">
            <Button
              size="noPadding"
              variant="ghost"
              onClick={() => {
                setActiveRoute(3.14);
                navigate("/help");
              }}
              className={`justify-start px-5 py-4 w-full opacity-50 transition-all duration-300 hover:bg-primary/10 ${
                activeRoute === 3.14 ? "bg-primary/10 font-medium" : ""
              }`}
            >
              <InfoCircledIcon className="w-4 h-4 mr-2" />
              Central de Ajuda
            </Button>
            <Button
              size="noPadding"
              variant="ghost"
              onClick={handleLogout}
              className="justify-start px-5 py-4 w-full opacity-50 transition-all duration-300 hover:bg-primary/10"
            >
              <ExitIcon className="w-4 h-4 mr-2" />
              Sair da conta
            </Button>
          </div>
        </div>
      </div>
      {rerender && <span className="hidden"></span>}
    </nav>
  );
}
