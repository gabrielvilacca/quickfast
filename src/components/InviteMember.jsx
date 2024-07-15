import { Button } from "@/shadcn/components/ui/button";
import { Separator } from "@/shadcn/components/ui/separator";
import React, { useState, useEffect } from "react";

const InviteMember = ({ teamId, userId }) => {
  const [inviteEmail, setInviteEmail] = useState("");
  const [role, setRole] = useState("viewer");
  const [userRole, setUserRole] = useState("");

  useEffect(() => {
    // Função para buscar a função do usuário atual
    const fetchUserRole = async () => {
      try {
        const response = await fetch(
          `https://us-central1-your-project-id.cloudfunctions.net/getUserRole`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ userId, teamId }),
          }
        );

        if (response.ok) {
          const data = await response.json();
          setUserRole(data.role);
        } else {
          console.error("Erro ao buscar a função do usuário");
        }
      } catch (error) {
        console.error("Erro ao buscar a função do usuário", error);
      }
    };

    fetchUserRole();
  }, [userId, teamId]);

  const sendInvite = async () => {
    try {
      const response = await fetch(
        "https://us-central1-your-project-id.cloudfunctions.net/sendInvite",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email: inviteEmail, teamId, role }),
        }
      );

      if (response.ok) {
        alert("Convite enviado com sucesso");
      } else {
        alert("Erro ao enviar convite");
      }
    } catch (error) {
      alert("Erro ao enviar convite");
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden m-5 md:max-w-[1080px]">
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold">Equipe</h1>
        </div>
        <Separator />
        <h2 className="text-2xl font-bold mb-4">Convidar Membro</h2>
        {userRole && (
          <p className="mb-4">
            Sua função atual: <span className="font-bold">{userRole}</span>
          </p>
        )}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">
            Email do Membro
          </label>
          <input
            type="email"
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            placeholder="Email do Membro"
            value={inviteEmail}
            onChange={(e) => setInviteEmail(e.target.value)}
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">
            Função
          </label>
          <select
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            value={role}
            onChange={(e) => setRole(e.target.value)}
          >
            <option value="admin">Administrador</option>
            <option value="collaborator">Colaborador</option>
            <option value="viewer">Visualizador</option>
          </select>
        </div>
        <Button
          className=" text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          onClick={sendInvite}
        >
          Enviar Convite
        </Button>
      </div>
    </div>
  );
};

export default InviteMember;
