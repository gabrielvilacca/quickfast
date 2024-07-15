import React, { useEffect, useState } from "react";
import CardChart from "./CardChart";
import { useFirestore } from "@/hooks/useFirestore";
import { useParams } from "react-router-dom";
import Analytics from "./Analytics";
import HorizonChart from "./HorizonChart";
import DoughnutChart from "./DoughnutChart";
import TagLine from "./TagLine";
import TagRanking from "./TagRanking";
import PolarAreaChart from "./PolarAreaChart";

export default function Chart({ projectId }) {
  const { id } = useParams(); // Obter o ID da URL
  const { getDocument, getDocuments } = useFirestore("projects");
  const [project, setProject] = useState(null);
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    const fetchProject = async () => {
      const fetchedProject = await getDocument(id);
      setProject(fetchedProject);
    };

    const fetchProjects = async () => {
      const fetchedProjects = await getDocuments();
      setProjects(fetchedProjects);
    };

    fetchProject();
    fetchProjects();
  }, [id, getDocument, getDocuments]);

  if (!project) {
    return <div>Loading...</div>;
  }

  return (
    <div className="m-5">
      <CardChart project={project} />
      <div className="mt-5 gap-4 md:flex">
        <div className="w-full md:w-[500px]">
          <Analytics projectId={id} />
        </div>
        <div className="w-full lg:w-1/2 flex flex-col">
          <HorizonChart project={project} />
          <TagLine projectId={id} />
        </div>
      </div>
      <div className="md:flex">
        <div className="w-full md:w-[500px]">
          <DoughnutChart projectId={id} />
        </div>
        <div className="w-full md:w-[500px] flex-col">
          <PolarAreaChart projectId={id} />
          <TagRanking projectId={id} />
        </div>
      </div>
    </div>
  );
}
