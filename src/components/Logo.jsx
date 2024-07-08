import LogoPng from "@/assets/Logo.png";
import { useNavigate } from "react-router-dom";

export default function LogoComponent({ size, justify }) {
  const width = size === "sm" ? "w-40" : "w-56";
  const navigate = useNavigate();

  const navigateToHome = () => navigate("/");

  return (
    <div role="button" onClick={navigateToHome} className={justify}>
      <img className={width} src={LogoPng} alt="logo" />
    </div>
  );
}
