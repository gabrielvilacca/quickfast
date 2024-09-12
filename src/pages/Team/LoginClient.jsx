import React, { useState } from "react";
import { Button } from "@/shadcn/components/ui/button";
import { Input } from "@/shadcn/components/ui/input";
import { useNavigate } from "react-router-dom";
import { useFirestore } from "@/hooks/useFirestore";
import bcrypt from "bcryptjs";
import { Eye, EyeOff } from "lucide-react";

const LoginClient = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const navigate = useNavigate();
  const { getDocuments } = useFirestore("clients");

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const clients = await getDocuments();
      console.log("Clientes:", clients);

      const client = clients.find((c) => c.email === email);
      console.log("Cliente encontrado:", client);

      if (client && bcrypt.compareSync(password, client.password)) {
        console.log("Senha corresponde.");
        if (client.role === "client") {
          navigate(`/project/${client.id}`);
        } else {
          setErrorMsg("Você não tem permissão para acessar este sistema.");
        }
      } else {
        console.log("As credenciais fornecidas estão incorretas.");
        setErrorMsg("As credenciais fornecidas estão incorretas.");
      }
    } catch (error) {
      console.error("Erro ao realizar login:", error);
      setErrorMsg("Ocorreu um erro ao tentar realizar o login.");
    }
  };

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
          <Button type="submit">Entrar</Button>
        </div>
        {errorMsg && <p className="text-red-500 mt-4">{errorMsg}</p>}
      </form>
    </div>
  );
};

export default LoginClient;
