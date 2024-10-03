import { Button } from "@/shadcn/components/ui/button";
import { InfoCircledIcon, PersonIcon, ExitIcon } from "@radix-ui/react-icons";
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
import { routeOptions } from "@/constants/constants.jsx";
import { UserCircleIcon } from "lucide-react";

export default function Sidebar({ rerender, setRerender }) {
  const navigate = useNavigate();
  const { logout, isPending } = useLogout();
  const { user } = useAuthContext();
  const [activeRoute, setActiveRoute] = useState(0);

  const handleLogout = () => {
    logout();
  };

  return (
    <nav className="relative overflow-y-auto min-h-[calc(100vh_-_64px)] hidden sm:flex sm:flex-col sm:justify-between h-full w-[250px] bg-white text-black">
      {isPending && <Loading />}
      <div className="fixed h-[calc(100vh_-_96px)] w-[248px] sm:flex-grow sm:flex sm:flex-col sm:justify-between">
        <div>
          <div className="flex items-center gap-3 p-5 ml-12 rounded-md">
            <ProfilePicDialog setRerender={setRerender}>
              <Avatar className="h-24 w-24 items-center justify-center flex cursor-pointer">
                <AvatarImage src={user.photoURL?.replace("=s96-c", "")} />
                <AvatarFallback className="bg-primary text-secondary">
                  {getInitials(user.displayName)}
                </AvatarFallback>
              </Avatar>
            </ProfilePicDialog>

            <div>
              <p className="font-medium text-lg">{user.displayName}</p>
            </div>
          </div>
          <div
            role="button"
            className={`py-6 px-5 flex items-center gap-3 transition-all duration-300 rounded-md  mt-3
              hover:text-white ${
                activeRoute === -1
                  ? "bg-[#1a3d32] font-medium text-xl"
                  : "text-xl font-medium text-neutral-400"
              }`}
            onClick={() => {
              setActiveRoute(-1);
              navigate("/account");
            }}
          >
            <UserCircleIcon className="w-6 h-6 hover:text-green-500" />
            <p className="text-md">Minha conta</p>
          </div>
          <div className="box-border">
            {routeOptions.map((option, index) => (
              <div
                key={option.route}
                role="button"
                className={`py-6 px-5 flex items-center gap-3 transition-all duration-300 rounded-md mt-1
                  hover:text-white ${
                    index === activeRoute
                      ? "bg-background font-medium text-xl"
                      : "text-xl font-medium text-neutral-400"
                  }`}
                onClick={() => {
                  setActiveRoute(index);
                  navigate(option.route);
                }}
              >
                <p className="hover:text-green-500">{option.icon}</p>
                <p className="text-md">{option.name}</p>
              </div>
            ))}
          </div>
        </div>
        <div>
          <div className="py-3 mt-10 px-2.5">
            <Logo size="md" />
          </div>
          <div className="flex flex-col py-2.5">
            <Button
              size="noPadding"
              variant="ghost"
              onClick={() => {
                setActiveRoute(3.14);
                navigate("/help");
              }}
              className={`justify-start px-5 py-1 w-full transition-all duration-300 rounded-md
                hover:bg-foreground ${
                  activeRoute === 3.14
                    ? "bg-black font-medium"
                    : "text-neutral-400"
                }`}
            >
              <InfoCircledIcon className="w-4 h-4 mr-2" />
              Central de Ajuda
            </Button>
            <Button
              size="noPadding"
              variant="ghost"
              onClick={handleLogout}
              className="justify-start px-5 py-1 w-full text-neutral-400 transition-all duration-300 rounded-md hover:bg-primary/10"
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
