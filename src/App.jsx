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
import { useState } from "react";
import { Toaster } from "@/shadcn/components/ui/toaster";
import { UserDocProvider } from "./contexts/UserDocContext";
import { useDocument } from "./hooks/useDocument";
import useMediaQuery from "./hooks/useMediaQuery";
import Topbar from "./components/Topbar";
import PasswordRecovery from "./pages/Recover/Recover";
import Help from "./pages/Help/Help";

function App() {
  const { user, authIsReady } = useAuthContext();
  const [rerender, setRerender] = useState(false);

  const isMobile = useMediaQuery("(max-width: 640px)");

  if (!authIsReady) return <Loading />;

  return (
    <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
      <div className="App flex flex-col sm:flex-row">
        <Toaster />
        <BrowserRouter>
          {user ? (
            <UserDocProvider user={user}>
              <>
                {isMobile ? (
                  <Topbar />
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
                  </Routes>
                </div>
              </>
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

export default App;
