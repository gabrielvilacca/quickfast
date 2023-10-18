import React, { useEffect, useState } from "react";
import { Button } from "@/shadcn/components/ui/button";
import { Input } from "@/shadcn/components/ui/input";
import { Link } from "react-router-dom";
import { useSignup } from "@/hooks/useSignup";
import { ReloadIcon } from "@radix-ui/react-icons";
import Logo from "@/components/Logo";
import GoogleLogo from "@/components/GoogleLogo";
import { useLogin } from "@/hooks/useLogin";
import {
  validatePassword,
  validateEmail,
  validateFullName,
} from "@/utils/validate";

export default function Signup() {
  const { authenticateWithGoogle, isPending: googleIsPending } = useLogin();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailTypo, setEmailTypo] = useState("");
  const { signup, error, isPending } = useSignup();
  const [message, setMessage] = useState("");

  function checkEmailTypos(email) {
    const emailParts = email.split("@");
    if (emailParts.length !== 2) {
      return;
    }

    const domain = emailParts[1];
    const corrections = {
      "outlok.com": "outlook.com",
      "otlook.com": "outlook.com",
      "gamil.com": "gmail.com",
      "gmial.com": "gmail.com",
      "gmail.co": "gmail.com",
      "gmai.com": "gmail.com",
      "hotmal.com": "hotmail.com",
      "hotmai.com": "hotmail.com",
      "hotmial.com": "hotmail.com",
      "live.con": "live.com",
      "live.cmo": "live.com",
      "live.cm": "live.com",
    };

    if (corrections[domain]) {
      setEmailTypo(`Você quis dizer ${emailParts[0]}@${corrections[domain]}?`);
    } else {
      setEmailTypo("");
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault();

    const { isValidFullName, message: nameMsg } = validateFullName(fullName);
    const { isValidEmail, message: emailMsg } = validateEmail(email);
    const { isValidPassword, message: passMsg } = validatePassword(password);

    if (!isValidFullName || !isValidEmail || !isValidPassword) {
      setMessage({
        type: "error",
        message: nameMsg || emailMsg || passMsg,
      });
      return;
    }

    signup(email, password, fullName);
  };

  useEffect(() => {
    if (error) {
      if (error.includes("email-already-in-use")) {
        setMessage({
          type: "error",
          message: "O e-mail informado já está em uso.",
        });
      } else if (error.includes("weak-password")) {
        setMessage({
          type: "error",
          message: "A senha informada é muito fraca.",
        });
      } else if (error.includes("invalid-email")) {
        setMessage({
          type: "error",
          message: "O e-mail informado é inválido.",
        });
      } else {
        console.log(error);
        setMessage({
          type: "error",
          message: "Ocorreu um erro ao criar a conta. Tente novamente.",
        });
      }
    }
  }, [error]);

  return (
    <div className="flex flex-col-reverse xl:flex-row 2xl:gap-20 xl:h-screen w-full xl:px-20 2xl:px-40 xl:py-20 2xl:py-0">
      <div className="xl:w-1/2 xl:h-[90%] 2xl:h-[80%] my-auto bg-muted rounded-xl px-5 sm:p-12 py-8 flex justify-center items-center">
        <div>
          <Logo />
          <h2 className="mt-12 sm:mt-10 2xl:mt-16 text-4xl leading-[44px] sm:leading-[50px] font-medium">
            Lorem ipsum dolor sit amet consectetur, adipisicing elit.
          </h2>
          <p className="mt-4 sm:mt-6 2xl:mt-10 text-muted-foreground">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Labore
            debitis dolore, dicta fugiat iure quia! Hic facilis aut ducimus
            aliquam blanditiis ex ea. Ipsa omnis quas impedit maiores ad unde?
          </p>
          <div className="bg-foreground text-background p-5 sm:p-8 rounded-xl mt-[8%] leading-6 2xl:leading-8">
            Lorem ipsum dolor sit amet, consectetur adipisicing elit. Eveniet
            quasi molestias molestiae, pariatur, doloribus neque saepe sit hic
            quis sequi nulla non quidem accusantium harum ipsa minima adipisci
            iure obcaecati!
          </div>
        </div>
      </div>
      <div className="flex flex-col justify-center xl:w-1/2 px-5 md:px-20 py-[15%] sm:h-auto">
        <div>
          <div className="sm:hidden mx-auto w-fit">
            <Logo />
          </div>
          <h1 className="mt-12 sm:mt-0 text-3xl font-medium text-center sm:text-left">
            Cadastre-se agora
          </h1>
          <p className="mt-2 text-muted-foreground font-normal text-lg text-center sm:text-left">
            Crie sua conta agora mesmo
          </p>
          <Button
            size="xl"
            variant="outline"
            className="mt-6 text-lg w-full"
            disabled={googleIsPending || isPending}
            onClick={authenticateWithGoogle}
          >
            {googleIsPending && (
              <ReloadIcon className="w-5 h-5 mr-2 animate-spin" />
            )}
            <GoogleLogo />
            {googleIsPending ? "Aguardando..." : "Entrar com a conta Google"}
          </Button>
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t"></span>
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-primary-foreground px-2 text-muted-foreground">
                Ou continue com
              </span>
            </div>
          </div>
          <form onSubmit={handleSubmit}>
            <p className="text-muted-foreground mb-2.5">Nome completo</p>
            <Input
              type="text"
              autoComplete="name"
              value={fullName}
              onChange={(e) => {
                const value = e.target.value;
                const regex = /^[A-Za-z\s]+$/;

                if (value === "" || regex.test(value)) {
                  setFullName(value);
                }
              }}
            />
            <p className="mt-2.5 text-muted-foreground mb-2.5">E-mail</p>
            <Input
              type="email"
              autoComplete="email"
              value={email}
              onChange={(e) => {
                const value = e.target.value.trim().toLowerCase();
                const regex = /^[a-zA-Z0-9._%+-@]+$/;

                if (value === "" || regex.test(value)) {
                  setEmail(value);
                }

                checkEmailTypos(e.target.value);
              }}
            />
            {emailTypo && (
              <p
                className="text-muted-foreground text-sm mt-1.5"
                role="button"
                onClick={() => {
                  setEmail(
                    emailTypo.split("Você quis dizer ")[1].replace("?", "")
                  );
                  setEmailTypo("");
                }}
              >
                {emailTypo}
              </p>
            )}
            <p className="mt-2.5 text-muted-foreground mb-2.5">Senha</p>
            <Input
              type="password"
              autoComplete="new-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <Button
              disabled={isPending || googleIsPending}
              size="xl"
              className="mt-6 text-lg w-full"
            >
              {isPending && (
                <ReloadIcon className="w-5 h-5 mr-2 animate-spin" />
              )}
              {isPending ? "Criando a conta..." : "Criar minha conta"}
            </Button>
          </form>
          {message && message.type === "error" && (
            <p className="text-left text-red-500 mt-4">{message.message}</p>
          )}
          <div className="mt-12 sm:mt-6 flex justify-center gap-2 text-lg">
            <p>Já tem uma conta?</p>
            <Link to="/login" className="text-primary underline">
              Entre agora.
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
