import "./App.css";
import Sidebar from "./components/Sidebar";
import Home from "./pages/Home/Home";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login/Login";
import Signup from "./pages/Signup/Signup";
import { ThemeProvider } from "./providers/ThemeProvider";
import { useAuthContext } from "./hooks/useAuthContext";
import Loading from "./components/Loading";
import Profile from "./pages/Profile/Profile";
import { useEffect, useState } from "react";
import { Toaster } from "@/shadcn/components/ui/toaster";
import { UserDocProvider } from "./contexts/UserDocContext";
import useMediaQuery from "./hooks/useMediaQuery";
import Topbar from "./components/Topbar";
import PasswordRecovery from "./pages/Recover/Recover";
import Help from "./pages/Help/Help";
import { SubscriptionProvider } from "./contexts/SubscriptionContext";
import ReactPixel from "react-facebook-pixel";
import { hashString } from "./utils/hashString";
import Expense from "./pages/Expenses/Expense";
import ProjectList from "./pages/Home/ProjectList";
import ProjectDetails from "./pages/Home/ProjectDetails";
import Settings from "./pages/Settings/Settings";
import Reports from "./pages/Reports/Reports";

function AppRoutes() {
  const { user, authIsReady } = useAuthContext();
  const [rerender, setRerender] = useState(false);

  const isMobile = useMediaQuery("(max-width: 640px)");

  useEffect(() => {
    if (process.env.NODE_ENV === "development") return;

    if (authIsReady && user && !sessionStorage.getItem("pixelInitialized")) {
      // Dados para AdvancedMatching
      const advancedMatching = {
        em: hashString(user.email),
        external_id: hashString(user.uid, false),
      };
      const options = {
        autoConfig: true,
        debug: false,
      };
      ReactPixel.init("SEU_PIXEL_ID", advancedMatching, options); // TODO: Substituir "SEU_PIXEL_ID" pelo ID do seu pixel
      ReactPixel.pageView();

      // Marcar como inicializado para esta sessão
      sessionStorage.setItem("pixelInitialized", "true");
    }
  }, [authIsReady, user]);

  if (!authIsReady) return <Loading />;

  return (
    <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
      <div className="App flex flex-col sm:flex-row">
        <Toaster />
        <BrowserRouter>
          {user ? (
            <UserDocProvider user={user}>
              <SubscriptionProvider user={user}>
                {isMobile ? (
                  <Topbar setRerender={setRerender} />
                ) : (
                  <div className="w-[250px] h-screen fixed top-0 left-0 overflow-y-auto">
                    <Sidebar rerender={rerender} setRerender={setRerender} />
                  </div>
                )}
                <div className="mt-12 sm:mt-0 flex-grow sm:ml-[250px]">
                  <Routes>
                    <Route exact path="/" element={<Home />} />
                    <Route
                      path="/account"
                      element={
                        <Profile
                          rerender={rerender}
                          setRerender={setRerender}
                        />
                      }
                    />
                    <Route path="/help" element={<Help />} />
                    <Route path="*" element={<Home />} />
                    <Route path="/expense" element={<Expense />} />
                    <Route path="/project" element={<ProjectList />} />
                    <Route path="/project/:id" element={<ProjectDetails />} />
                    <Route path="/settings" element={<Settings />} />
                    <Route path="/reports" element={<Reports />} />
                  </Routes>
                </div>
              </SubscriptionProvider>
            </UserDocProvider>
          ) : (
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/password/recovery" element={<PasswordRecovery />} />
              <Route path="*" element={<Signup />} />
            </Routes>
          )}
        </BrowserRouter>
      </div>
    </ThemeProvider>
  );
}

export default AppRoutes;
