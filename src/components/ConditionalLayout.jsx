import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";
import { useAuthContext } from "@/hooks/useAuthContext";
import { useProjects } from "@/hooks/useProjects";

const ConditionalLayout = ({ children, rerender, setRerender, isMobile }) => {
  const location = useLocation();
  const { user } = useAuthContext();
  const projects = useProjects();

  const [noSidebarPaths, setNoSidebarPaths] = useState(["/login-client"]);

  useEffect(() => {
    if (projects && projects.length > 0) {
      const projectPaths = projects.map((project) => `/project/${project.id}`);
      setNoSidebarPaths((prevPaths) => [...prevPaths, ...projectPaths]);
    }
  }, [projects]);

  // Verificar se o usuário é um cliente (ajuste conforme necessário)
  const isClient = user && user.role === "client";

  const shouldHideSidebar =
    noSidebarPaths.some((path) => location.pathname.startsWith(path)) ||
    isClient; // Esconder a sidebar se o usuário for um cliente

  return (
    <div className="App flex flex-col sm:flex-row">
      {!shouldHideSidebar && (
        <>
          {isMobile ? (
            <Topbar setRerender={setRerender} />
          ) : (
            <div className="w-[250px] h-screen fixed top-0 left-0 overflow-y-auto">
              <Sidebar rerender={rerender} setRerender={setRerender} />
            </div>
          )}
        </>
      )}
      <div
        className={`mt-12 sm:mt-0 flex-grow ${
          !shouldHideSidebar ? "sm:ml-[250px]" : ""
        }`}
      >
        {children}
      </div>
    </div>
  );
};

export default ConditionalLayout;
