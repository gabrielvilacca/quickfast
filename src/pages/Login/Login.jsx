import React, { useEffect, useState } from "react";
import { Button } from "@/shadcn/components/ui/button";
import { Input } from "@/shadcn/components/ui/input";
import { Link } from "react-router-dom";
import { useLogin } from "@/hooks/useLogin";
import { ReloadIcon } from "@radix-ui/react-icons";
import Logo from "@/components/Logo";
import { useNavigate } from "react-router-dom";
import GoogleLogo from "@/components/GoogleLogo";
import Initial from "@/assets/Initial.gif";

export default function Login() {
  const { login, authenticateWithGoogle, isPending, error } = useLogin();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const [errorMsg, setErrorMsg] = useState("");
  const [isEmailLogin, setIsEmailLogin] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsEmailLogin(true);
    login(email, password);
  };

  useEffect(() => {
    if (!error) return;

    if (error.includes("auth/invalid-login-credentials")) {
      setErrorMsg(
        "As credenciais fornecidas estão incorretas ou o e-mail está vinculado ao login com Google. Clique no botão 'Entrar com a conta Google'."
      );
    }
  }, [error]);

  return (
    <div className="flex flex-col-reverse xl:flex-row 2xl:gap-20 xl:h-screen w-full xl:px-20 2xl:px-40 xl:py-20 2xl:py-0">
      <div className="xl:w-1/2 2xl:h-[75%] my-auto rounded-xl px-5 sm:p-12 py-8 flex justify-center items-center">
        <div>
          <div className="bg-green-800 p-2 rounded-lg">
            <Logo />
          </div>
          <img src={Initial} alt="Initial" />
        </div>
      </div>
      <div className="flex flex-col justify-center xl:w-1/2 px-5 md:px-20 py-[15%] sm:h-auto">
        <div>
          <div className="sm:hidden mx-auto w-fit">
            <Logo />
          </div>
          <h1 className="mt-12 sm:mt-0 text-3xl font-semibold text-center sm:text-left">
            Entre na sua conta
          </h1>
          <p className="mt-4 text-muted-foreground font-normal text-lg text-center sm:text-left">
            Informe os seus dados de acesso
          </p>
          <Button
            size="xl"
            variant="outline"
            className="mt-6 text-lg w-full"
            disabled={isPending}
            onClick={() => authenticateWithGoogle("login")}
          >
            {isPending && !isEmailLogin && (
              <ReloadIcon className="w-5 h-5 mr-2 animate-spin" />
            )}
            <GoogleLogo />
            {isPending && !isEmailLogin
              ? "Entrando..."
              : "Entrar com a conta Google"}
          </Button>
          <form className="mt-10" onSubmit={handleLogin}>
            <p className="mt-5 text-muted-foreground mb-2.5">E-mail</p>
            <Input
              type="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value.trim().toLowerCase())}
            />
            <p className="mt-5 text-muted-foreground mb-2.5">Senha</p>
            <Input
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <p
              className="mt-2.5 text-right text-muted-foreground underline"
              role="button"
              onClick={() => navigate("/password/recovery")}
            >
              Esqueceu sua senha?
            </p>
            <Button
              size="xl"
              className="mt-6 text-lg w-full"
              disabled={isPending}
            >
              {isPending && isEmailLogin && (
                <ReloadIcon className="w-5 h-5 mr-2 animate-spin" />
              )}
              {isPending && isEmailLogin
                ? "Entrando..."
                : "Entrar na minha conta"}
            </Button>
            {errorMsg && <p className="text-red-500 mt-2.5">{errorMsg}</p>}
          </form>
          <div className="mt-12 sm:mt-6 flex justify-center gap-2 text-lg">
            <p>Não tem uma conta?</p>
            <Link to="/signup" className="text-primary underline">
              Cadastre-se agora.
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
