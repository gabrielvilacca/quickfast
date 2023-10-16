import LogoDarkPng from "@/assets/logo_dark_theme.png";
import LogoLightPng from "@/assets/logo_light_theme.png";
import { useTheme } from "@/providers/ThemeProvider";
import { useNavigate } from "react-router-dom";

export default function Logo({ size, justify }) {
  const width = size === "sm" ? "w-48" : "w-56";
  const { theme } = useTheme();

  const navigate = useNavigate();

  const navigateToHome = () => navigate("/");

  return (
    <div role="button" onClick={navigateToHome}>
      <img
        className={width}
        src={theme === "light" ? LogoDarkPng : LogoLightPng}
        alt="logo"
      />
    </div>
  );
}
