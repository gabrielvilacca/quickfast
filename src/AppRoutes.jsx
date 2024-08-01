import "./App.css";
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
import PasswordRecovery from "./pages/Recover/Recover";
import Help from "./pages/Help/Help";
import { SubscriptionProvider } from "./contexts/SubscriptionContext";
import ReactPixel from "react-facebook-pixel";
import { hashString } from "./utils/hashString";
import Expense from "./pages/Expenses/Expense";
import ProjectList from "./pages/Home/ProjectList";
import ProjectDetails from "./pages/Home/ProjectDetails";
import Reports from "./pages/Reports/Reports";
import Team from "./pages/Team/Team";
import ClientDetails from "./pages/Team/ClientDetails";
import LoginClient from "./pages/Team/LoginClient";
import PrivateRoute from "./pages/Team/PrivateRoute";
import ConditionalLayout from "./components/ConditionalLayout";

function AppRoutes() {
  const { user, authIsReady } = useAuthContext();
  const [rerender, setRerender] = useState(false);

  const isMobile = useMediaQuery("(max-width: 640px)");

  useEffect(() => {
    if (process.env.NODE_ENV === "development") return;

    if (authIsReady && user && !sessionStorage.getItem("pixelInitialized")) {
      const advancedMatching = {
        em: hashString(user.email),
        external_id: hashString(user.uid, false),
      };
      const options = {
        autoConfig: true,
        debug: false,
      };
      ReactPixel.init("324265957420266", advancedMatching, options);
      ReactPixel.pageView();

      sessionStorage.setItem("pixelInitialized", "true");
    }
  }, [authIsReady, user]);

  if (!authIsReady) return <Loading />;

  return (
    <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
      <Toaster />
      <BrowserRouter>
        {user ? (
          <UserDocProvider user={user}>
            <SubscriptionProvider user={user}>
              <ConditionalLayout
                rerender={rerender}
                setRerender={setRerender}
                isMobile={isMobile}
              >
                <Routes>
                  <Route exact path="/" element={<Home />} />
                  <Route
                    path="/account"
                    element={
                      <Profile rerender={rerender} setRerender={setRerender} />
                    }
                  />
                  <Route path="/help" element={<Help />} />
                  <Route path="*" element={<Home />} />
                  <Route path="/expense" element={<Expense />} />
                  <Route path="/project" element={<ProjectList />} />
                  <Route
                    path="/project/:id"
                    element={
                      <PrivateRoute>
                        <ProjectDetails />
                      </PrivateRoute>
                    }
                  />
                  <Route path="/login-client" element={<LoginClient />} />
                  <Route
                    path="/client/:id"
                    element={
                      <PrivateRoute>
                        <ClientDetails />
                      </PrivateRoute>
                    }
                  />
                  <Route path="/team" element={<Team />} />
                  <Route path="/reports" element={<Reports />} />
                </Routes>
              </ConditionalLayout>
            </SubscriptionProvider>
          </UserDocProvider>
        ) : (
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/password/recovery" element={<PasswordRecovery />} />
            <Route path="/login-client" element={<LoginClient />} />
            <Route path="*" element={<Signup />} />
          </Routes>
        )}
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default AppRoutes;
