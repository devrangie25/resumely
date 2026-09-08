import type { ResumeContent } from "@/lib/resume/schema";
import { emptyVisibility } from "@/lib/resume/defaults";

export const sampleResumeContent: ResumeContent = {
  personal: {
    fullName: "Jordan Hale",
    headline: "Product Designer",
    email: "jordan.hale@email.com",
    phone: "+1 (415) 555-0148",
    location: "San Francisco, CA",
    website: "jordanhale.design",
    linkedin: "linkedin.com/in/jordanhale",
    github: "github.com/jordanhale",
  },
  summary:
    "Product designer with 8 years of experience turning complex workflows into clear, accessible interfaces. Known for pairing research with systems thinking to ship work that is both beautiful and practical.",
  experience: [
    {
      id: "exp-1",
      company: "Northline",
      title: "Senior Product Designer",
      location: "San Francisco, CA",
      startDate: "2021",
      endDate: "",
      current: true,
      bullets: [
        "Led the redesign of the customer onboarding flow, lifting activation by 22%.",
        "Built a shared design system used across four product teams.",
        "Partnered with research to run quarterly usability studies with enterprise users.",
      ],
    },
    {
      id: "exp-2",
      company: "Bright Harbor",
      title: "Product Designer",
      location: "New York, NY",
      startDate: "2018",
      endDate: "2021",
      current: false,
      bullets: [
        "Designed mobile and web experiences for a fintech savings product.",
        "Reduced support tickets by 18% through clearer empty and error states.",
      ],
    },
  ],
  education: [
    {
      id: "edu-1",
      school: "Rhode Island School of Design",
      degree: "BFA",
      field: "Graphic Design",
      location: "Providence, RI",
      startDate: "2014",
      endDate: "2018",
      details: "Thesis on accessible information design.",
    },
  ],
  skills: [
    { id: "sk-1", name: "Product design" },
    { id: "sk-2", name: "Design systems" },
    { id: "sk-3", name: "User research" },
    { id: "sk-4", name: "Figma" },
    { id: "sk-5", name: "Prototyping" },
    { id: "sk-6", name: "Accessibility" },
  ],
  projects: [
    {
      id: "pr-1",
      name: "Harbor UI",
      description: "Open-source component library for financial products.",
      url: "github.com/jordanhale/harbor-ui",
      bullets: [
        "Documented 40+ components with usage guidelines and accessibility notes.",
      ],
    },
  ],
  certifications: [
    {
      id: "cert-1",
      name: "NN/g UX Certification",
      issuer: "Nielsen Norman Group",
      date: "2022",
      url: "",
    },
  ],
  languages: [
    { id: "lang-1", name: "English", proficiency: "Native" },
    { id: "lang-2", name: "Spanish", proficiency: "Professional" },
  ],
  awards: [
    {
      id: "aw-1",
      title: "Core77 Design Award",
      issuer: "Core77",
      date: "2023",
      description: "Honorable mention, Interaction.",
    },
  ],
  references: [],
  sectionOrder: [
    "summary",
    "experience",
    "education",
    "skills",
    "projects",
    "certifications",
    "languages",
    "awards",
    "references",
  ],
  sectionVisibility: {
    ...emptyVisibility(),
    references: false,
  },
};
