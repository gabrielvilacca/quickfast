import { HamburgerMenuIcon } from "@radix-ui/react-icons";
import React, { useState } from "react";
import Logo from "./Logo";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/shadcn/components/ui/dropdown-menu";
import { ProfilePicDialog } from "./ProfilePicDialog";
import getInitials from "@/utils/getInitials";
import { useAuthContext } from "@/hooks/useAuthContext";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/shadcn/components/ui/avatar";
import { routeOptions } from "@/constants/constants.jsx";
import { useLogout } from "@/hooks/useLogout";
import { useNavigate } from "react-router-dom";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/shadcn/components/ui/sheet";
import { Separator } from "@/shadcn/components/ui/separator";

export default function Topbar({ setRerender }) {
  const [open, setOpen] = useState(false);
  const { user } = useAuthContext();
  const { logout } = useLogout();
  const navigate = useNavigate();
  return (
    <div className="fixed w-full bg-muted border border-border h-12 flex justify-between items-center pl-2 pr-4">
      <Logo size="sm" justify="justify-center" />
      <div className="flex gap-2.5">
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger>
            <HamburgerMenuIcon className="h-6 w-6" />
          </SheetTrigger>
          <SheetContent>
            <div className="flex items-center gap-2.5">
              <ProfilePicDialog setRerender={setRerender}>
                <Avatar className="h-10 w-10" role="button">
                  <AvatarImage src={user.photoURL?.replace("=s96-c", "")} />
                  <AvatarFallback className="bg-primary text-secondary text-sm">
                    {getInitials(user.displayName)}
                  </AvatarFallback>
                </Avatar>
              </ProfilePicDialog>
              <div>
                <p className="text-sm font-medium">{user.displayName}</p>
                <p className="text-muted-foreground/75 text-xs">
                  Premium account
                </p>
              </div>
            </div>
            <Separator className="opacity-50 my-5" />
            <div className="flex flex-col gap-5">
              {routeOptions.map((option) => (
                <div
                  className="flex gap-3 items-center"
                  key={option.route}
                  onClick={() => {
                    navigate(option.route);
                    setOpen(false);
                  }}
                >
                  {option.icon}
                  <p>{option.name}</p>
                </div>
              ))}
            </div>
            <Separator className="opacity-50 my-5" />
            <p onClick={logout}>Sair</p>
          </SheetContent>
        </Sheet>
      </div>
    </div>
  );
}
