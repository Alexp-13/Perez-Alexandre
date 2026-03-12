export interface Project {
  id: string;
  title: string;
  description: string;
  studyLevel: string;
  techStack: string[];
  githubUrl?: string;
  otherUrl?: string[];
  videoUrl?: string[];
  imageUrl?: string[];
}

export interface TechCategory {
  category: string;
  techs: Tech[];
}

export interface Tech {
  name: string;
  logo: string;
}

import projectsData from "../assets/data/projects.json";
import technosData from "../assets/data/technos.json";

export const projects: Project[] = projectsData;
export const techCategories: TechCategory[] = technosData;

export const studyLevels = [
  ...new Set(projects.map((p) => p.studyLevel)),
];

export const allTechs = [
  ...new Set(projects.flatMap((p) => p.techStack)),
].sort();
