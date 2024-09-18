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
                </Routes>
              </ConditionalLayout>
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
    </ThemeProvider>
  );
}

export default AppRoutes;
