import { ProjectWithChildren } from "@/modules/projects/server/procedures"
import ProjectMiniPreview from "../common/ProjectMiniPreview";

const ProjectList = ({projects} : {projects: ProjectWithChildren[]}) => {
  return (
    <>
    {projects.map((project, idx) => {
      if (!project.messages[0]?.fragment?.readme) return null;
      
      return <ProjectMiniPreview key={project.id || idx} project={project} />;
    })}
    </>
  )
}
export default ProjectList