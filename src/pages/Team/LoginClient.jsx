import React, { useState, useEffect } from "react";
import { Button } from "@/shadcn/components/ui/button";
import { Input } from "@/shadcn/components/ui/input";
import { useNavigate } from "react-router-dom";
import useClientLogin from "@/hooks/useClientLogin";
import { Eye, EyeOff } from "lucide-react";
import { useProjects } from "@/hooks/useProjects";

const LoginClient = () => {
  const { login, isPending, error, user } = useClientLogin();
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const navigate = useNavigate();
  const projects = useProjects(); // Obtendo a lista de projetos

  const handleLogin = async (e) => {
    e.preventDefault();
    await login(email, password);
  };

  useEffect(() => {
    if (error) {
      if (
        error.includes("auth/wrong-password") ||
        error.includes("auth/user-not-found")
      ) {
        setErrorMsg(
          "As credenciais fornecidas estão incorretas. Por favor, tente novamente."
        );
      } else {
        setErrorMsg("Ocorreu um erro ao tentar realizar o login.");
      }
    }

    if (user && projects.length > 0) {
      // Redirecionar para a página do primeiro projeto da lista
      navigate(`/project/${projects[0].id}`);
    } else if (user) {
      // Se não houver projetos, redirecionar para uma página padrão
      navigate("/projects");
    }
  }, [error, user, projects, navigate]);

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-3xl font-semibold mb-6">Login Cliente</h1>
      <form className="w-full max-w-sm" onSubmit={handleLogin}>
        <div className="mb-4">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="email"
          >
            Email
          </label>
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value.trim().toLowerCase())}
            required
          />
        </div>
        <div className="mb-6">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="password"
          >
            Senha
          </label>
          <div className="relative">
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <Button
              type="button"
              variant="outline"
              className="absolute inset-y-0 right-0 px-3 flex items-center"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <EyeOff /> : <Eye />}
            </Button>
          </div>
        </div>
        <div className="flex items-center justify-between">
          <Button type="submit" disabled={isPending}>
            {isPending ? "Entrando..." : "Entrar"}
          </Button>
        </div>
        {errorMsg && <p className="text-red-500 mt-4">{errorMsg}</p>}
      </form>
    </div>
  );
};

export default LoginClient;
