import React, { useState } from "react";
import { Button } from "@/shadcn/components/ui/button";
import { Input } from "@/shadcn/components/ui/input";
import { Link } from "react-router-dom";
import { useLogin } from "@/hooks/useLogin";
import { ReloadIcon } from "@radix-ui/react-icons";
import Logo from "@/components/Logo";
import { useNavigate } from "react-router-dom";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "@/firebase/config";
import { useToast } from "@/shadcn/components/ui/use-toast";

export default function PasswordRecovery() {
  const [email, setEmail] = useState("");
  const [isPending, setIsPending] = useState(false);
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    setIsPending(true);
    e.preventDefault();
    try {
      await sendPasswordResetEmail(auth, email);
      setMessage({
        type: "success",
        message:
          "E-mail de recuperação de senha enviado com sucesso! Confira a caixa de entrada e o SPAM.",
      });
    } catch (err) {
      setMessage({
        type: "error",
        message:
          "Ocorreu um erro ao enviar o e-mail de recuperação. Contate o suporte.",
      });
    } finally {
      setIsPending(false);
    }
  };

  return (
    <div className="flex flex-col-reverse xl:flex-row 2xl:gap-20 xl:h-screen w-full xl:px-20 2xl:px-40 xl:py-20 2xl:py-0">
      <div className="hidden sm:flex xl:w-1/2 2xl:h-[75%] my-auto bg-muted rounded-xl px-5 sm:p-12 py-8 justify-center items-center">
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
      <div className="flex flex-col justify-center xl:w-1/2 px-5 md:px-20 h-screen sm:h-auto">
        <div>
          <div className="sm:hidden mx-auto w-fit">
            <Logo />
          </div>
          <h1 className="mt-12 text-3xl font-semibold text-center sm:text-left">
            Redefina a sua senha
          </h1>
          <p className="mt-4 text-muted-foreground font-normal text-lg text-center sm:text-left">
            Informe o seu e-mail abaixo
          </p>
          <form className="mt-8" onSubmit={handleSubmit}>
            <p className="text-muted-foreground mb-2.5">E-mail</p>
            <Input
              type="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Button
              size="xl"
              className="mt-6 text-lg w-full"
              disabled={isPending}
            >
              {isPending && (
                <ReloadIcon className="w-5 h-5 mr-2 animate-spin" />
              )}
              {isPending ? "Enviando..." : "Enviar e-mail de recuperação"}
            </Button>
          </form>
          {message && message.type === "success" && (
            <p className="text-center text-emerald-500 mt-4">
              {message.message}
            </p>
          )}
          {message && message.type === "error" && (
            <p className="text-center text-red-500 mt-4">{message.message}</p>
          )}
          <div className="mt-12 flex justify-center gap-2 text-lg">
            <p>Lembrou-se da senha?</p>
            <Link to="/login" className="text-primary">
              Entre na sua conta.
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
