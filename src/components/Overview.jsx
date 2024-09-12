import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useFirestore } from "@/hooks/useFirestore";
import GraphsResum from "./GraphsResum";
import OverviewChart from "./OverviewChart";
import OverviewList from "./OverviewList";

export default function Overview({ projectId }) {
  const { id } = useParams(); // Obter o ID da URL
  const { getDocument } = useFirestore("projects"); // Usando a nova função getDocument
  const [project, setProject] = useState(null);

  useEffect(() => {
    const fetchProject = async () => {
      const fetchedProject = await getDocument(id);
      setProject(fetchedProject);
    };

    fetchProject();
  }, [id, getDocument]);

  if (!project) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      {/* Resumo das informações */}
      <GraphsResum project={project} />
      <div className="mt-5 md:flex gap-32 ">
        <div className="md:w-[500px] ">
          <OverviewChart projectId={id} />
        </div>
        <div className="mt-2 md:w-[500px] md:mt-0">
          <OverviewList projectId={id} />
        </div>
      </div>
    </div>
  );
}
