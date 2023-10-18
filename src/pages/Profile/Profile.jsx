import React, { useState } from "react";
import { ModeToggle } from "@/shadcn/components/mode-toggle";
import { useAuthContext } from "@/hooks/useAuthContext";
import { Input } from "@/shadcn/components/ui/input";
import { Card, CardContent } from "@/shadcn/components/ui/card";
import { Button } from "@/shadcn/components/ui/button";

// TODO: Trocar pela URL da sua Cloud Function
const url =
  "https://us-central1-projeto-teste-405b3.cloudfunctions.net/changePassword";

export default function Profile({ rerender, setRerender }) {
  const { user } = useAuthContext();
  const [message, setMessage] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const isEmailProvider =
    user.providerData &&
    user.providerData.length &&
    user.providerData[0].providerId === "google.com"
      ? false
      : true;

  const changePassword = async (e) => {
    e.preventDefault();

    if (password !== passwordConfirmation) {
      setMessage("As senhas não coincidem.");
      return;
    }

    const idToken = await user.getIdToken(true);

    const response = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${idToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        oldPassword: currentPassword,
        newPassword: password,
      }),
    });
  };

  return (
    <div className="p-8 xl:w-3/5 mx-auto 2xl:w-1/3">
      {rerender && <span className="hidden"></span>}
      <h1 className="font-medium text-xl">Sua conta</h1>
      <p className="text-muted-foreground font-light text-md text-center sm:text-left">
        Altere os dados da sua conta
      </p>

      <Card className="mt-8 w-full">
        <CardContent>
          <p className="mt-5 text-muted-foreground mb-1.5">Nome completo</p>
          <Input disabled value={user.displayName} readOnly type="text" />
          <p className="mt-5 text-muted-foreground mb-1.5">E-mail</p>
          <Input disabled value={user.email} readOnly type="email" />
          <p className="mt-5 text-muted-foreground mb-1.5">
            Tema (claro/escuro)
          </p>
          <ModeToggle />
          {isEmailProvider && (
            <form onSubmit={changePassword}>
              <p className="mt-5 text-muted-foreground mb-1.5">Senha atual</p>
              <Input
                autoComplete="current-password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                type="password"
              />
              <p className="mt-1.5 text-muted-foreground mb-1.5">Nova senha</p>
              <Input
                autoComplete="new-password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setMessage("");
                }}
                type="password"
              />
              <p className="mt-1.5 text-muted-foreground mb-1.5">
                Confirme a senha
              </p>
              <Input
                autoComplete="new-password"
                value={passwordConfirmation}
                onChange={(e) => {
                  setPasswordConfirmation(e.target.value);
                  setMessage("");
                }}
                type="password"
              />
              {message && (
                <p className="text-sm mt-1.5 text-red-500">{message}</p>
              )}
              <Button className="mt-2.5" type="submit">
                Alterar senha
              </Button>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
