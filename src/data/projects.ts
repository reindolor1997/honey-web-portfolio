export interface Project {
  title: string;
  description: string;
  demoUrl: string;
  sourceUrl: string;
}

export const projects: Project[] = [
  {
    title: "Project One",
    description:
      "A responsive web application that helps users manage their daily tasks with a clean, intuitive interface built with vanilla JS.",
    demoUrl: "#",
    sourceUrl: "#",
  },
  {
    title: "Project Two",
    description:
      "An accessible e-commerce landing page featuring smooth animations, a sticky navigation bar, and a mobile-first layout.",
    demoUrl: "#",
    sourceUrl: "#",
  },
  {
    title: "Project Three",
    description:
      "A personal blog theme with dark-mode support, typography-focused design, and zero JavaScript dependencies for core reading.",
    demoUrl: "#",
    sourceUrl: "#",
  },
];
