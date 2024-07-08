// components/ProjectList.jsx

import React from "react";
import { useProjects } from "@/hooks/useProjects";
import ProjectCard from "./ProjectCard";
import { Link } from "react-router-dom";

const ProjectList = () => {
  const projects = useProjects();

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
      {projects &&
        projects.map((project) => (
          <Link to={`/project/${project.id}`} key={project.id}>
            <ProjectCard project={project} />
          </Link>
        ))}
    </div>
  );
};

export default ProjectList;
