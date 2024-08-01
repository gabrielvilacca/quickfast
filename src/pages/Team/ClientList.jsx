import React from "react";
import { Link } from "react-router-dom";
import Client from "./Client";
import useClients from "@/hooks/useClients";

const ClientList = () => {
  const clients = useClients();

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
      {clients &&
        clients.map((client) => (
          <Link to={`/client/${client.id}`} key={client.id}>
            <Client client={client} />
          </Link>
        ))}
    </div>
  );
};

export default ClientList;
