import type {
  ResumeContent,
  TemplateId,
} from "@/lib/resume/schema";

const sectionOrder: ResumeContent["sectionOrder"] = [
  "summary",
  "experience",
  "education",
  "skills",
  "projects",
  "certifications",
  "languages",
  "awards",
  "references",
];

const shown: ResumeContent["sectionVisibility"] = {
  summary: true,
  experience: true,
  education: true,
  skills: true,
  projects: true,
  certifications: true,
  languages: true,
  awards: true,
  references: true,
};

type Role = [company: string, title: string, location: string, start: string, end: string, bullets: string[]];

type SampleInput = {
  slug: string;
  templateId: TemplateId;
  label: string;
  pages: number;
  photo?: boolean;
  personal: Omit<ResumeContent["personal"], "photoUrl">;
  summary: string;
  roles: Role[];
  schools: [school: string, degree: string, field: string, location: string, start: string, end: string, details: string][];
  skills: string[];
  projects: [name: string, description: string, url: string, bullets: string[]][];
  certifications: [name: string, issuer: string, date: string][];
  languages: [name: string, proficiency: string][];
  awards: [title: string, issuer: string, date: string, description: string][];
  references: [name: string, title: string, company: string, email: string, phone: string][];
};

const extraRoleCounts: Record<string, number> = {
  exec: 9,
  gold: 7,
  indigo: 7,
  accent: 6,
  "min-navy": 7,
  navy: 2,
  burg: 2,
  air: 2,
  serif: 2,
  split: 2,
  "mod-navy": 3,
  emerald: 3,
  sunset: 2,
  coral: 2,
  banner: 2,
  mist: 3,
};

const earlierFirms = [
  ["Northwind Partners", "Associate"],
  ["Harbor Desk", "Coordinator"],
  ["Lakeshore Group", "Analyst"],
  ["Civic Works", "Assistant"],
  ["Fieldnote Desk", "Specialist"],
  ["Paperkite Studio", "Associate"],
  ["Meridian Office", "Coordinator"],
  ["Bright Harbor", "Analyst"],
  ["Grant Street", "Assistant"],
] as const;

function earlierRoles(input: SampleInput, count: number): Role[] {
  const focus = input.personal.headline.toLowerCase();
  return earlierFirms.slice(0, count).map((firm, index) => {
    const endYear = 2009 - index * 2;
    return [
      firm[0],
      firm[1],
      input.personal.location,
      String(endYear - 2),
      String(endYear),
      [
        `Supported ${focus} work for a small team, including the weekly note that kept the work visible.`,
        "Kept the project file current so a colleague could cover a week away without a long handoff.",
        "Wrote the closeout: what shipped, what slipped, and what the team would not repeat.",
        "Sat with the people the work was for, and changed the writeup when it did not match their week.",
      ],
    ];
  });
}

function build(input: SampleInput): ResumeContent {
  const { slug } = input;
  const extraCount = extraRoleCounts[slug] ?? 0;
  const roles = [...input.roles, ...earlierRoles(input, extraCount)];
  return {
    personal: {
      ...input.personal,
      photoUrl: input.photo ? "/sample-resume-avatar.svg" : "",
    },
    summary: input.summary,
    experience: roles.map((role, index) => ({
      id: `${slug}-exp-${index + 1}`,
      company: role[0],
      title: role[1],
      location: role[2],
      startDate: role[3],
      endDate: role[4],
      current: role[4] === "",
      bullets: role[5],
    })),
    education: input.schools.map((school, index) => ({
      id: `${slug}-edu-${index + 1}`,
      school: school[0],
      degree: school[1],
      field: school[2],
      location: school[3],
      startDate: school[4],
      endDate: school[5],
      details: school[6],
    })),
    skills: input.skills.map((name, index) => ({
      id: `${slug}-sk-${index + 1}`,
      name,
    })),
    projects: input.projects.map((project, index) => ({
      id: `${slug}-pr-${index + 1}`,
      name: project[0],
      description: project[1],
      url: project[2],
      bullets: project[3],
    })),
    certifications: input.certifications.map((item, index) => ({
      id: `${slug}-cert-${index + 1}`,
      name: item[0],
      issuer: item[1],
      date: item[2],
      url: "",
    })),
    languages: input.languages.map((item, index) => ({
      id: `${slug}-lang-${index + 1}`,
      name: item[0],
      proficiency: item[1],
    })),
    awards: input.awards.map((item, index) => ({
      id: `${slug}-aw-${index + 1}`,
      title: item[0],
      issuer: item[1],
      date: item[2],
      description: item[3],
    })),
    references: input.references.map((item, index) => ({
      id: `${slug}-ref-${index + 1}`,
      name: item[0],
      title: item[1],
      company: item[2],
      email: item[3],
      phone: item[4],
    })),
    sectionOrder,
    sectionVisibility: shown,
    theme: { primary: "" },
  };
}

const samples: SampleInput[] = [
  {
    slug: "navy",
    templateId: "classic-navy",
    label: "Classic Navy",
    pages: 2,
    personal: {
      fullName: "Noah Patel",
      headline: "Associate General Counsel",
      email: "noah.patel@email.com",
      phone: "+1 (212) 555-0168",
      location: "New York, NY",
      website: "",
      linkedin: "linkedin.com/in/noahpatel",
      github: "",
    },
    summary:
      "Corporate counsel with 14 years advising boards and operators on commercial contracts, privacy, and disputes. I keep legal review close to the business so deals close without surprises in the indemnity or the data terms.",
    roles: [
      ["Meridian Holdings", "Associate General Counsel", "New York, NY", "2019", "", [
        "Counsel the executive team on customer contracts, vendor deals, and the issues that reach the board.",
        "Rebuilt the contract playbook so sales can close standard deals without a lawyer on every call.",
        "Led outside counsel on two commercial disputes and settled both before a hearing.",
        "Wrote the privacy addendum now attached to every enterprise order form.",
      ]],
      ["Hale & Mercer", "Senior Associate", "New York, NY", "2014", "2019", [
        "Negotiated technology and services agreements for public-company clients.",
        "Staffed internal investigations and prepared the reports that went to audit committees.",
        "Trained junior associates on issue lists that a business reader can actually use.",
      ]],
      ["City Law Department", "Assistant Corporation Counsel", "New York, NY", "2011", "2014", [
        "Defended the city in commercial and employment matters in state court.",
        "Drafted ordinances and the memos that explained them to agency commissioners.",
      ]],
    ],
    schools: [
      ["Columbia Law School", "J.D.", "Law", "New York, NY", "2008", "2011", "Notes editor, Columbia Business Law Review."],
      ["University of Michigan", "B.A.", "History", "Ann Arbor, MI", "2004", "2008", ""],
    ],
    skills: ["Commercial contracts", "Privacy", "Corporate governance", "Disputes", "Negotiation", "Regulatory advice"],
    projects: [
      ["Contract playbook", "Standard positions for liability, data, and termination.", "", ["Cut legal review time on standard deals from ten days to three."]],
    ],
    certifications: [["New York Bar", "State of New York", "2012"]],
    languages: [["English", "Native"], ["Gujarati", "Professional"]],
    awards: [["Pro Bono Counsel", "Legal Aid Society", "2022", "Ongoing clinic for small nonprofits."]],
    references: [["Rebecca Stein", "General Counsel", "Meridian Holdings", "rebecca.stein@meridian.example", "+1 (212) 555-0104"]],
  },
  {
    slug: "exec",
    templateId: "classic-executive",
    label: "Classic Executive",
    pages: 3,
    personal: {
      fullName: "Sofia Alvarez",
      headline: "Vice President of Product",
      email: "sofia.alvarez@email.com",
      phone: "+1 (415) 555-0175",
      location: "Oakland, CA",
      website: "sofiaalvarez.com",
      linkedin: "linkedin.com/in/sofiaalvarez",
      github: "",
    },
    summary:
      "Product leader with 16 years taking B2B software from a founder-led roadmap to a portfolio with clear bets, pricing, and a research practice. I have managed product, design, and research through two stage changes and one acquisition.",
    roles: [
      ["Northline", "Vice President of Product", "Oakland, CA", "2021", "", [
        "Own the roadmap for a platform used by operations teams in logistics and field service.",
        "Set the annual bet list with engineering and finance so staffing matches the three things we will not drop.",
        "Shipped usage-based pricing that lifted net revenue retention by 8 points.",
        "Built the research rotation so every squad talks to customers every month, not only before a launch.",
      ]],
      ["Bright Harbor", "Director of Product", "San Francisco, CA", "2017", "2021", [
        "Led the savings and payments products through a redesign and a new mobile app.",
        "Cut activation time by rewriting the first-week checklist with support and design.",
        "Hired the first product ops manager and the dashboard the leadership team still uses.",
      ]],
      ["Paperkite", "Senior Product Manager", "Remote", "2013", "2017", [
        "Took a campus writing tool from a pilot in four schools to a paid product in 60.",
        "Wrote the requirements for offline drafts after watching students lose work on weak Wi-Fi.",
      ]],
      ["Lumen Field Labs", "Product Manager", "Austin, TX", "2010", "2013", [
        "Managed the partner API and the console administrators used to debug a failed call.",
        "Turned the top support themes into product work instead of a longer help center.",
      ]],
      ["Civic Table", "Business Analyst", "Chicago, IL", "2008", "2010", [
        "Mapped how a hospitality group took orders, staffed events, and closed the books.",
        "Built the first weekly scorecard the operators were willing to look at on Monday.",
      ]],
    ],
    schools: [
      ["University of California, Berkeley", "M.B.A.", "Business", "Berkeley, CA", "2015", "2017", "Evening program."],
      ["University of Texas at Austin", "B.A.", "Plan II", "Austin, TX", "2004", "2008", ""],
    ],
    skills: ["Product strategy", "Pricing", "Roadmapping", "User research", "B2B SaaS", "Team leadership"],
    projects: [
      ["Bet list", "A one-page annual plan that names what the product org will not staff.", "sofiaalvarez.com/bets", ["Adopted by two peer companies after a talk at a local product meetup."]],
      ["Pricing pilot", "Usage-based packaging tested with 40 existing accounts.", "", ["Wrote the migration note so finance and success told the same story."]],
    ],
    certifications: [],
    languages: [["English", "Native"], ["Spanish", "Native"]],
    awards: [["Product Org of the Year", "Northline", "2024", "Internal award after the pricing launch."]],
    references: [
      ["Priya Nair", "VP of Engineering", "Northline", "priya.nair@northline.example", "+1 (415) 555-0102"],
      ["Helen Cho", "Chief Executive Officer", "Bright Harbor", "helen.cho@brightharbor.example", "+1 (415) 555-0199"],
    ],
  },
  {
    slug: "burg",
    templateId: "classic-burgundy",
    label: "Classic Burgundy",
    pages: 2,
    personal: {
      fullName: "Hannah Brooks",
      headline: "Executive Director",
      email: "hannah.brooks@email.com",
      phone: "+1 (503) 555-0126",
      location: "Portland, OR",
      website: "",
      linkedin: "linkedin.com/in/hannahbrooks",
      github: "",
    },
    summary:
      "Nonprofit director with 15 years building housing and workforce programs that funders can audit and participants can finish. I care as much about the case note as the grant report.",
    roles: [
      ["Cedar House", "Executive Director", "Portland, OR", "2018", "", [
        "Lead a 70-person organization providing transitional housing and job placement.",
        "Grew the annual budget from $4 million to $9 million without adding a program we could not staff.",
        "Replaced a spreadsheet waitlist with a system case managers update the same day.",
        "Report to a board that now sees occupancy, placements, and cash in one monthly note.",
      ]],
      ["River City Workforce", "Program Director", "Portland, OR", "2013", "2018", [
        "Ran training programs for adults returning to work after a long gap.",
        "Built employer partnerships that turned site visits into actual interviews.",
        "Wrote the logic model the county still asks for at renewal.",
      ]],
      ["Neighborhood Fund", "Grants Manager", "Seattle, WA", "2009", "2013", [
        "Managed a portfolio of community grants and the site visits that went with them.",
        "Simplified the application so smaller groups could apply without a grant writer.",
      ]],
    ],
    schools: [
      ["University of Washington", "M.P.A.", "Public Administration", "Seattle, WA", "2007", "2009", ""],
      ["Reed College", "B.A.", "Sociology", "Portland, OR", "2003", "2007", ""],
    ],
    skills: ["Fundraising", "Program design", "Board reporting", "Case management", "Grant writing", "Partnerships"],
    projects: [
      ["Housing waitlist", "Replaced a shared spreadsheet with a queue case managers trust.", "", ["Families can see their place in line without calling the front desk."]],
    ],
    certifications: [["Certified Fund Raising Executive", "CFRE International", "2016"]],
    languages: [["English", "Native"]],
    awards: [["Community Leadership", "Portland Business Journal", "2023", "For the housing placement program."]],
    references: [["Mark Ellison", "Board Chair", "Cedar House", "mark.ellison@cedarhouse.example", "+1 (503) 555-0144"]],
  },
  {
    slug: "gold",
    templateId: "classic-gold",
    label: "Classic Gold",
    pages: 3,
    personal: {
      fullName: "William Adeyemi",
      headline: "Chief Financial Officer",
      email: "william.adeyemi@email.com",
      phone: "+1 (312) 555-0181",
      location: "Chicago, IL",
      website: "",
      linkedin: "linkedin.com/in/williamadeyemi",
      github: "",
    },
    summary:
      "Finance executive with 18 years closing the books, raising capital, and explaining the numbers to operators who do not live in a spreadsheet. I have taken two companies through an audit cleanup and one through a sale.",
    roles: [
      ["Harbor & Co.", "Chief Financial Officer", "Chicago, IL", "2020", "", [
        "Own finance, accounting, and planning for a professional services firm with 11 offices.",
        "Shortened the monthly close from 15 business days to 7.",
        "Led the financial workstream on a 300-person acquisition, including the opening balance sheet.",
        "Rebuilt the forecast so office leaders can see staffing cost before they hire.",
      ]],
      ["Fieldnote Health", "Vice President, Finance", "Chicago, IL", "2015", "2020", [
        "Built the finance team as the clinic network grew from 6 sites to 28.",
        "Put each clinic on a simple P&L the regional director reviews every month.",
        "Managed the lender relationship through two covenant resets.",
      ]],
      ["Northwater Logistics", "Controller", "Milwaukee, WI", "2011", "2015", [
        "Closed the books for a freight business with a messy claims reserve.",
        "Installed a weekly cash report the CEO read before the operations meeting.",
      ]],
      ["Grant & Ellis", "Senior Accountant", "Chicago, IL", "2008", "2011", [
        "Prepared audits and management reports for mid-market clients.",
        "Taught new staff how to tie a schedule back to the trial balance.",
      ]],
      ["Lakeshore Retail Group", "Financial Analyst", "Chicago, IL", "2006", "2008", [
        "Modeled store labor and the seasonal cash swing for 46 locations.",
        "Flagged three stores whose shrink was hiding in the inventory count.",
      ]],
    ],
    schools: [
      ["University of Chicago Booth", "M.B.A.", "Finance", "Chicago, IL", "2013", "2015", "Weekend program."],
      ["University of Illinois Urbana-Champaign", "B.S.", "Accountancy", "Urbana, IL", "2002", "2006", ""],
    ],
    skills: ["FP&A", "Monthly close", "M&A", "Audit", "Cash management", "Board reporting", "NetSuite"],
    projects: [
      ["Close checklist", "A day-by-day close that names an owner for every schedule.", "", ["Used at Harbor & Co. and adapted for the acquired company."]],
      ["Clinic P&L", "One-page site economics for a growing clinic network.", "", ["Regional directors stopped asking finance to rebuild the same chart."]],
    ],
    certifications: [["CPA", "Illinois Board of Examiners", "2008"]],
    languages: [["English", "Native"], ["Yoruba", "Professional"]],
    awards: [["Finance Leader", "Harbor & Co.", "2023", "For the close redesign and the acquisition."]],
    references: [
      ["Helen Cho", "Chief Executive Officer", "Harbor & Co.", "helen.cho@harborandco.example", "+1 (312) 555-0110"],
      ["Ruth Keller", "Board Chair", "Harbor & Co.", "ruth.keller@harborandco.example", "+1 (312) 555-0164"],
    ],
  },
  {
    slug: "mod-navy",
    templateId: "modern-navy",
    label: "Modern Navy",
    pages: 2,
    photo: true,
    personal: {
      fullName: "Luis Romero",
      headline: "Product Designer",
      email: "luis.romero@email.com",
      phone: "+1 (323) 555-0192",
      location: "Los Angeles, CA",
      website: "luisromero.design",
      linkedin: "linkedin.com/in/luisromero",
      github: "",
    },
    summary:
      "Product designer with 10 years shaping complex tools into interfaces people can learn on the job. I work from research through the design system, and I stay for the launch.",
    roles: [
      ["Northline", "Senior Product Designer", "Los Angeles, CA", "2021", "", [
        "Lead design for the dispatcher console used by field-service teams.",
        "Rebuilt the job board so a dispatcher can see who is late without opening five tabs.",
        "Partnered with research on ride-alongs in three cities before the redesign.",
        "Extended the design system with the dense tables this product actually needs.",
      ]],
      ["Bright Harbor", "Product Designer", "Los Angeles, CA", "2017", "2021", [
        "Designed mobile flows for a savings product used on a commute, not at a desk.",
        "Reduced support contacts about transfers by clarifying the pending state.",
      ]],
      ["Studio Marin", "Designer", "Los Angeles, CA", "2014", "2017", [
        "Designed marketing sites and product UI for early-stage clients.",
        "Set up the critique habit the studio still uses on Fridays.",
      ]],
    ],
    schools: [
      ["ArtCenter College of Design", "B.F.A.", "Graphic Design", "Pasadena, CA", "2010", "2014", ""],
    ],
    skills: ["Product design", "Design systems", "Prototyping", "User research", "Figma", "Accessibility"],
    projects: [
      ["Dispatcher board", "A dense scheduling view for field teams.", "luisromero.design/dispatch", ["Documented the states: unassigned, late, blocked, and done."]],
    ],
    certifications: [["NN/g UX Certification", "Nielsen Norman Group", "2022"]],
    languages: [["English", "Native"], ["Spanish", "Native"]],
    awards: [["Core77 Honorable Mention", "Core77", "2023", "Interaction, dispatcher console."]],
    references: [["Maya Chen", "Engineering Manager", "Northline", "maya.chen@northline.example", "+1 (415) 555-0194"]],
  },
  {
    slug: "emerald",
    templateId: "modern-emerald",
    label: "Modern Emerald",
    pages: 2,
    photo: true,
    personal: {
      fullName: "Grace Kim",
      headline: "Group Product Manager",
      email: "grace.kim@email.com",
      phone: "+1 (206) 555-0139",
      location: "Seattle, WA",
      website: "gracekim.co",
      linkedin: "linkedin.com/in/gracekim",
      github: "",
    },
    summary:
      "Group product manager with 11 years on developer tools and internal platforms. I write the problem down before the roadmap, and I keep a short list of what we are explicitly not building.",
    roles: [
      ["Paperkite", "Group Product Manager", "Seattle, WA", "2022", "", [
        "Manage three product managers covering docs, billing, and the admin console.",
        "Shipped a usage dashboard that cut billing tickets by a third.",
        "Set the quarterly planning template the engineering managers asked to reuse.",
      ]],
      ["Lumen Field Labs", "Senior Product Manager", "Seattle, WA", "2018", "2022", [
        "Owned the API gateway roadmap, including keys, limits, and the audit log.",
        "Sat with support one afternoon a week until the top ticket had an owner.",
      ]],
      ["Northwater Logistics", "Product Manager", "Seattle, WA", "2015", "2018", [
        "Launched a tracking page that answered the calls the night desk used to take.",
        "Wrote the requirements with dispatchers, not only with the sales team.",
      ]],
    ],
    schools: [
      ["University of Washington", "B.S.", "Informatics", "Seattle, WA", "2011", "2015", ""],
    ],
    skills: ["Developer tools", "Roadmapping", "SQL", "Pricing", "Discovery", "Writing specs", "Experiment design", "Stakeholder management"],
    projects: [
      ["Billing explainer", "In-product page that shows how a charge was calculated.", "gracekim.co/billing", ["Support stopped pasting the same paragraph into tickets."]],
    ],
    certifications: [],
    languages: [["English", "Native"], ["Korean", "Professional"]],
    awards: [["Internal Tools Award", "Paperkite", "2024", "For the usage dashboard."]],
    references: [["Owen Blake", "Director of Product", "Paperkite", "owen.blake@paperkite.example", "+1 (206) 555-0118"]],
  },
  {
    slug: "sunset",
    templateId: "modern-sunset",
    label: "Modern Sunset",
    pages: 2,
    photo: true,
    personal: {
      fullName: "Theo Nguyen",
      headline: "Senior Data Scientist",
      email: "theo.nguyen@email.com",
      phone: "+1 (737) 555-0155",
      location: "Austin, TX",
      website: "theonguyen.io",
      linkedin: "linkedin.com/in/theonguyen",
      github: "github.com/theonguyen",
    },
    summary:
      "Data scientist with 9 years building models that operators will actually trust. I would rather ship a clear baseline and a monitoring chart than a model nobody can explain on a Tuesday.",
    roles: [
      ["Fieldnote Health", "Senior Data Scientist", "Austin, TX", "2021", "", [
        "Forecast clinic demand so staffing is set before the week starts, not after.",
        "Built a no-show model and the plain-language note nurses see in the schedule.",
        "Put model monitoring next to the metric, so a drift alert has a person on it.",
      ]],
      ["Northwater Logistics", "Data Scientist", "Austin, TX", "2017", "2021", [
        "Estimated arrival windows that dispatchers trusted more than the old average.",
        "Replaced a monthly slide with a warehouse query the ops team can rerun.",
      ]],
      ["Civic Table", "Analyst", "Chicago, IL", "2015", "2017", [
        "Counted covers, labor, and waste for a restaurant group learning to look at a week.",
        "Taught managers to read a chart without calling the analyst first.",
      ]],
    ],
    schools: [
      ["University of Texas at Austin", "M.S.", "Statistics", "Austin, TX", "2013", "2015", ""],
      ["Rice University", "B.A.", "Mathematics", "Houston, TX", "2009", "2013", ""],
    ],
    skills: ["Python", "SQL", "Forecasting", "Experimentation", "Model monitoring", "dbt"],
    projects: [
      ["Demand notes", "A short weekly forecast written for clinic managers.", "theonguyen.io/demand", ["Managers can see why Thursday looks different from last Thursday."]],
    ],
    certifications: [],
    languages: [["English", "Native"], ["Vietnamese", "Professional"]],
    awards: [["Analytics in Practice", "Fieldnote Health", "2023", "For the staffing forecast."]],
    references: [["Marcus Adeyemi", "Chief Medical Officer", "Fieldnote Health", "marcus.adeyemi@fieldnote.example", "+1 (312) 555-0188"]],
  },
  {
    slug: "coral",
    templateId: "modern-coral",
    label: "Modern Coral",
    pages: 2,
    photo: true,
    personal: {
      fullName: "Aisha Rahman",
      headline: "Brand Director",
      email: "aisha.rahman@email.com",
      phone: "+1 (646) 555-0170",
      location: "Brooklyn, NY",
      website: "aisharahman.com",
      linkedin: "linkedin.com/in/aisharahman",
      github: "",
    },
    summary:
      "Brand director with 12 years making companies sound like one organization, including the product UI, the sales deck, and the note that goes out when something breaks.",
    roles: [
      ["Harbor & Co.", "Brand Director", "New York, NY", "2020", "", [
        "Lead brand, content, and the guidelines every office is supposed to follow.",
        "Rewrote the company story after an acquisition so both names had a reason to exist.",
        "Built a small in-house studio and stopped the most expensive freelance retainers.",
      ]],
      ["Bright Harbor", "Brand Manager", "New York, NY", "2016", "2020", [
        "Named and launched a savings product, including the empty states and the emails.",
        "Set the voice rules support uses when a transfer fails.",
      ]],
      ["Studio Marin", "Designer", "New York, NY", "2012", "2016", [
        "Art-directed campaigns for consumer and nonprofit clients.",
        "Built the first brand kits the studio handed to a client at the end of a project.",
      ]],
    ],
    schools: [
      ["Parsons School of Design", "B.F.A.", "Communication Design", "New York, NY", "2008", "2012", ""],
    ],
    skills: ["Brand systems", "Art direction", "Writing", "Campaigns", "Design management"],
    projects: [
      ["Voice guide", "A short brand guide written for people who are not designers.", "aisharahman.com/voice", ["Includes the words we use when a customer is angry."]],
    ],
    certifications: [],
    languages: [["English", "Native"], ["Bengali", "Native"], ["French", "Intermediate"]],
    awards: [["Brand Refresh", "Harbor & Co.", "2022", "Internal award for the post-acquisition identity."]],
    references: [["Helen Cho", "Chief Executive Officer", "Harbor & Co.", "helen.cho@harborandco.example", "+1 (312) 555-0110"]],
  },
  {
    slug: "indigo",
    templateId: "modern-indigo",
    label: "Modern Indigo",
    pages: 3,
    personal: {
      fullName: "Samir Hussain",
      headline: "Staff Software Engineer",
      email: "samir.hussain@email.com",
      phone: "+1 (408) 555-0147",
      location: "San Jose, CA",
      website: "samirhussain.dev",
      linkedin: "linkedin.com/in/samirhussain",
      github: "github.com/samirhussain",
    },
    summary:
      "Staff engineer with 13 years on payments, ledgers, and the boring reliability work that keeps a checkout standing. I write the design note before the code, and I stay on call for what I ship.",
    roles: [
      ["Bright Harbor", "Staff Software Engineer", "San Jose, CA", "2019", "", [
        "Own the ledger that records every card, bank, and wallet movement.",
        "Split a charge service so a timeout in fraud checks no longer fails the whole payment.",
        "Wrote the runbook the new on-call class reads before their first week.",
        "Review the design notes for any change that touches money movement.",
      ]],
      ["Northline", "Senior Software Engineer", "San Jose, CA", "2015", "2019", [
        "Built the billing service that invoices platform customers each month.",
        "Added idempotent retries after a duplicate-charge incident.",
        "Mentored three engineers through their first production migration.",
      ]],
      ["Lumen Field Labs", "Software Engineer", "Austin, TX", "2012", "2015", [
        "Worked on the API gateway, including rate limits and request logs.",
        "Fixed the timeout budget so a slow dependency failed closed, not open.",
      ]],
      ["Paperkite", "Software Engineer", "Remote", "2010", "2012", [
        "Built document sync for a writing tool used in university courses.",
        "Added conflict handling when two people edited the same paragraph offline.",
      ]],
    ],
    schools: [
      ["University of Illinois Urbana-Champaign", "B.S.", "Computer Science", "Urbana, IL", "2006", "2010", ""],
    ],
    skills: ["Go", "PostgreSQL", "Payments", "Distributed systems", "On-call", "Technical writing"],
    projects: [
      ["Ledger notes", "Design notes for idempotent money movement.", "samirhussain.dev/ledger", ["Covers retries, partial failure, and how we reconcile the next morning."]],
      ["On-call class", "A three-session class for engineers joining the payments rotation.", "", ["Includes a practice incident, not only slides."]],
    ],
    certifications: [["AWS Solutions Architect", "Amazon Web Services", "2020"]],
    languages: [["English", "Native"], ["Urdu", "Native"]],
    awards: [["Reliability Award", "Bright Harbor", "2023", "For the charge-service split."]],
    references: [["Owen Blake", "Director of Payments", "Bright Harbor", "owen.blake@brightharbor.example", "+1 (212) 555-0177"]],
  },
  {
    slug: "banner",
    templateId: "modern-banner",
    label: "Modern Banner",
    pages: 2,
    photo: true,
    personal: {
      fullName: "Clara Berg",
      headline: "Principal, Operations",
      email: "clara.berg@email.com",
      phone: "+1 (617) 555-0161",
      location: "Boston, MA",
      website: "claraberg.com",
      linkedin: "linkedin.com/in/claraberg",
      github: "",
    },
    summary:
      "Consultant with 12 years helping operators fix the meeting, the metric, and the handoff that is actually slowing the company down. I leave behind a cadence, not a slide deck.",
    roles: [
      ["Grant & Ellis", "Principal", "Boston, MA", "2019", "", [
        "Lead operations projects for multi-site service businesses.",
        "Install a weekly review the client can run after we leave.",
        "Staffed the integration office for a services acquisition in the Midwest.",
      ]],
      ["Northwater Logistics", "Engagement Manager", "Boston, MA", "2015", "2019", [
        "Ran a customer-operations redesign for a freight company.",
        "Replaced a shared queue with named account teams for the largest shippers.",
      ]],
      ["Lakeshore Retail Group", "Senior Associate", "Chicago, IL", "2012", "2015", [
        "Worked on labor planning for a specialty retailer with 46 stores.",
        "Built the seasonal model managers used instead of last year's spreadsheet.",
      ]],
    ],
    schools: [
      ["Harvard Business School", "M.B.A.", "Business", "Boston, MA", "2010", "2012", ""],
      ["Boston College", "B.A.", "Economics", "Chestnut Hill, MA", "2006", "2010", ""],
    ],
    skills: ["Operating cadence", "Process design", "Facilitation", "Client leadership", "Excel"],
    projects: [
      ["Monday review", "A 45-minute operating meeting with twelve numbers and no appendix.", "claraberg.com/review", ["Clients keep the agenda after the project ends."]],
    ],
    certifications: [],
    languages: [["English", "Native"], ["German", "Professional"]],
    awards: [["Client Impact", "Grant & Ellis", "2022", "For the acquisition integration office."]],
    references: [["Ruth Keller", "Partner", "Grant & Ellis", "ruth.keller@grantellis.example", "+1 (617) 555-0109"]],
  },
  {
    slug: "mist",
    templateId: "modern-mist",
    label: "Modern Mist",
    pages: 2,
    photo: true,
    personal: {
      fullName: "Jonah Ellis",
      headline: "Project Architect",
      email: "jonah.ellis@email.com",
      phone: "+1 (206) 555-0184",
      location: "Seattle, WA",
      website: "jonahellis.studio",
      linkedin: "linkedin.com/in/jonahellis",
      github: "",
    },
    summary:
      "Architect with 11 years taking public and education buildings from schematic design through construction administration. I draw, I write the meeting notes, and I stay through the punch list.",
    roles: [
      ["Ellis Moore Architects", "Project Architect", "Seattle, WA", "2018", "", [
        "Lead project architect on schools and branch libraries.",
        "Coordinate consultants so the mechanical room is decided before the walls are closed.",
        "Run construction administration, including the site visit notes contractors can act on.",
      ]],
      ["Harbor Studio", "Architectural Designer", "Seattle, WA", "2014", "2018", [
        "Produced drawing sets for civic projects from design development through permit.",
        "Built the detail library the studio uses for exterior assemblies.",
      ]],
      ["City of Seattle", "Intern Architect", "Seattle, WA", "2012", "2014", [
        "Supported facility projects for parks and neighborhood centers.",
        "Reviewed submittals and kept the comment log the project manager trusted.",
      ]],
    ],
    schools: [
      ["University of Washington", "M.Arch.", "Architecture", "Seattle, WA", "2010", "2012", ""],
      ["Washington State University", "B.S.", "Architectural Studies", "Pullman, WA", "2006", "2010", ""],
    ],
    skills: ["Revit", "Construction documents", "Construction administration", "Public work", "Detailing"],
    projects: [
      ["Branch library", "A neighborhood library completed in 2023.", "jonahellis.studio/library", ["Community room, after-school space, and a quieter reading room."]],
    ],
    certifications: [["Registered Architect", "Washington State", "2018"]],
    languages: [["English", "Native"]],
    awards: [["Civic Design Award", "AIA Seattle", "2024", "Branch library."]],
    references: [["Anne Moore", "Principal", "Ellis Moore Architects", "anne.moore@ellismoore.example", "+1 (206) 555-0122"]],
  },
  {
    slug: "air",
    templateId: "minimal",
    label: "Minimal Air",
    pages: 2,
    personal: {
      fullName: "Nina Petrov",
      headline: "Editor",
      email: "nina.petrov@email.com",
      phone: "+1 (347) 555-0115",
      location: "New York, NY",
      website: "ninapetrov.com",
      linkedin: "linkedin.com/in/ninapetrov",
      github: "",
    },
    summary:
      "Editor with 10 years on reported features and the books that start as a magazine story. I edit for the sentence the reader can follow, and for the fact that has a source.",
    roles: [
      ["The Evening Review", "Senior Editor", "New York, NY", "2019", "", [
        "Edit features on cities, work, and public health.",
        "Manage a group of freelance writers from assignment through fact-check.",
        "Built the style notes the desk uses for numbers, titles, and quotations.",
      ]],
      ["Field Notes Magazine", "Editor", "New York, NY", "2015", "2019", [
        "Edited reported essays and the columns that ran every month.",
        "Started the fact-check checklist the magazine still prints in the closet.",
      ]],
      ["University Press", "Assistant Editor", "New York, NY", "2013", "2015", [
        "Line-edited manuscripts in history and public policy.",
        "Kept the production schedule when a book slipped a season.",
      ]],
    ],
    schools: [
      ["Columbia University", "M.F.A.", "Nonfiction", "New York, NY", "2011", "2013", ""],
      ["Oberlin College", "B.A.", "English", "Oberlin, OH", "2007", "2011", ""],
    ],
    skills: ["Line editing", "Fact-checking", "Assigning", "Nonfiction", "Style"],
    projects: [
      ["Desk notes", "A short style guide for numbers and quotations.", "ninapetrov.com/notes", ["Written so a new editor can use it on the first day."]],
    ],
    certifications: [],
    languages: [["English", "Fluent"], ["Russian", "Native"]],
    awards: [["Features editing", "The Evening Review", "2022", "Internal award for the public-health series."]],
    references: [["Laura Chen", "Editor in Chief", "The Evening Review", "laura.chen@eveningreview.example", "+1 (212) 555-0190"]],
  },
  {
    slug: "serif",
    templateId: "minimal-serif",
    label: "Minimal Serif",
    pages: 2,
    personal: {
      fullName: "Oliver Grant",
      headline: "Staff Writer",
      email: "oliver.grant@email.com",
      phone: "+1 (415) 555-0129",
      location: "San Francisco, CA",
      website: "olivergrant.com",
      linkedin: "linkedin.com/in/olivergrant",
      github: "",
    },
    summary:
      "Staff writer covering technology and the companies that sell it to other companies. I report the number, the contract, and the person who has to live with the product.",
    roles: [
      ["The Evening Review", "Staff Writer", "San Francisco, CA", "2020", "", [
        "Cover enterprise software, with a focus on what operators do after the sale.",
        "Published a series on outages and the on-call practices behind them.",
        "File public-records requests when a company will not explain a number.",
      ]],
      ["Bay Civic", "Reporter", "Oakland, CA", "2016", "2020", [
        "Covered city hall, housing, and the budgets that paid for both.",
        "Built a simple database of council votes the newsroom still updates.",
      ]],
      ["Campus Daily", "Reporter", "Berkeley, CA", "2014", "2016", [
        "Covered the university administration and student housing.",
        "Edited the night desk twice a week.",
      ]],
    ],
    schools: [
      ["University of California, Berkeley", "B.A.", "Rhetoric", "Berkeley, CA", "2010", "2014", ""],
    ],
    skills: ["Reporting", "Interviewing", "Public records", "Beat writing"],
    projects: [
      ["Outage series", "Four stories on how software companies handle incidents.", "olivergrant.com/outages", ["Included the on-call schedule, not only the postmortem."]],
    ],
    certifications: [],
    languages: [["English", "Native"]],
    awards: [["Business reporting", "Northern California Press Club", "2023", "For the outage series."]],
    references: [["Laura Chen", "Editor in Chief", "The Evening Review", "laura.chen@eveningreview.example", "+1 (212) 555-0190"]],
  },
  {
    slug: "split",
    templateId: "minimal-split",
    label: "Minimal Split",
    pages: 2,
    personal: {
      fullName: "Mei Lin",
      headline: "UX Researcher",
      email: "mei.lin@email.com",
      phone: "+1 (650) 555-0136",
      location: "Palo Alto, CA",
      website: "meilin.work",
      linkedin: "linkedin.com/in/meilin",
      github: "",
    },
    summary:
      "UX researcher with 8 years studying how people use tools at work, usually while they are also doing the job. I recruit the person who is busy, and I write the finding so a team can act on it.",
    roles: [
      ["Northline", "Senior UX Researcher", "Palo Alto, CA", "2021", "", [
        "Research partner for the dispatcher and customer-admin products.",
        "Run field studies with people who have ten minutes, not an hour in a lab.",
        "Write one-page readouts the squad reads before planning, not after.",
      ]],
      ["Bright Harbor", "UX Researcher", "San Francisco, CA", "2018", "2021", [
        "Studied how people move money when they do not trust the pending state.",
        "Set up a monthly research share so designers were not the only audience.",
      ]],
      ["Paperkite", "Research Associate", "Remote", "2016", "2018", [
        "Interviewed teachers and students about a writing tool.",
        "Turned session notes into the changes that shipped the next term.",
      ]],
    ],
    schools: [
      ["Stanford University", "M.A.", "Communication", "Stanford, CA", "2014", "2016", ""],
      ["University of California, Los Angeles", "B.A.", "Psychology", "Los Angeles, CA", "2010", "2014", ""],
    ],
    skills: ["Field studies", "Interviews", "Usability tests", "Research ops", "Writing"],
    projects: [
      ["Ten-minute study", "A field-study format for people who cannot leave the floor.", "meilin.work/ten", ["Used with dispatchers and clinic front desks."]],
    ],
    certifications: [],
    languages: [["English", "Native"], ["Mandarin", "Native"]],
    awards: [["Research Practice", "Northline", "2024", "For the field-study program."]],
    references: [["Luis Romero", "Senior Product Designer", "Northline", "luis.romero@northline.example", "+1 (323) 555-0192"]],
  },
  {
    slug: "accent",
    templateId: "minimal-accent",
    label: "Minimal Accent",
    pages: 3,
    personal: {
      fullName: "Diego Santos",
      headline: "Site Reliability Engineer",
      email: "diego.santos@email.com",
      phone: "+1 (303) 555-0173",
      location: "Denver, CO",
      website: "diegosantos.dev",
      linkedin: "linkedin.com/in/diegosantos",
      github: "github.com/diegosantos",
    },
    summary:
      "Site reliability engineer with 12 years keeping payment and platform systems up, and writing the pages that tell the next person what to do at 2 a.m. I measure the work in fewer pages, not more dashboards.",
    roles: [
      ["Bright Harbor", "Staff SRE", "Denver, CO", "2020", "", [
        "Own reliability for checkout, ledger, and the notification path that tells a customer a payment failed.",
        "Cut paging noise by deleting alerts that had not led to an action in six months.",
        "Wrote the incident roles so the person writing the customer note is not also the person in the database.",
        "Run the quarterly game day, including the one where the primary database is already down.",
      ]],
      ["Northline", "Senior SRE", "Denver, CO", "2016", "2020", [
        "Built the deploy pipeline the product teams use, with a rollback that is one command.",
        "Set error budgets with the product managers who had to explain a missed week.",
        "Moved logs out of the host and into a place you can search during an incident.",
      ]],
      ["Lumen Field Labs", "Systems Engineer", "Austin, TX", "2013", "2016", [
        "Kept the API gateway and its dependencies within a written timeout budget.",
        "Automated the host build so a new machine matched the last one.",
      ]],
      ["Paperkite", "Operations Engineer", "Remote", "2011", "2013", [
        "Ran the small production environment for a writing product used in classrooms.",
        "Added backups that we actually restored, once a month, on purpose.",
      ]],
    ],
    schools: [
      ["Colorado State University", "B.S.", "Computer Science", "Fort Collins, CO", "2007", "2011", ""],
    ],
    skills: ["Incident response", "Kubernetes", "Terraform", "PostgreSQL", "Observability", "On-call"],
    projects: [
      ["Alert diet", "A review that removed alerts with no runbook and no recent action.", "diegosantos.dev/alerts", ["Pages dropped without hiding the failures that still matter."]],
      ["Game day notes", "Scripts and a debrief template for practice incidents.", "", ["Includes who speaks to customers and who does not."]],
    ],
    certifications: [["Certified Kubernetes Administrator", "CNCF", "2019"]],
    languages: [["English", "Fluent"], ["Portuguese", "Native"]],
    awards: [["Reliability", "Bright Harbor", "2024", "For the alert review and the game-day program."]],
    references: [["Samir Hussain", "Staff Software Engineer", "Bright Harbor", "samir.hussain@brightharbor.example", "+1 (408) 555-0147"]],
  },
  {
    slug: "mint",
    templateId: "minimal-mint",
    label: "Minimal Mint",
    pages: 2,
    personal: {
      fullName: "Fatima Noor",
      headline: "Director of Nursing",
      email: "fatima.noor@email.com",
      phone: "+1 (312) 555-0152",
      location: "Chicago, IL",
      website: "",
      linkedin: "linkedin.com/in/fatimanoor",
      github: "",
    },
    summary:
      "Nursing director with 16 years in clinic operations, staffing, and the unglamorous work of making a Monday morning safe. I have opened sites, written the orientation, and stayed for the night shift when the schedule broke.",
    roles: [
      ["Fieldnote Health", "Director of Nursing", "Chicago, IL", "2018", "", [
        "Lead nursing practice across a Midwest clinic network.",
        "Wrote the orientation a new nurse finishes before a solo shift.",
        "Cut agency spend by fixing the schedule six weeks out, not the day before.",
        "Partnered with physicians on a triage note that front desk and nursing both use.",
      ]],
      ["Lakeside Hospital", "Nurse Manager", "Chicago, IL", "2012", "2018", [
        "Managed a medical-surgical unit and the staffing office that fed it.",
        "Started a bedside handoff that patients could hear and correct.",
      ]],
      ["Lakeside Hospital", "Registered Nurse", "Chicago, IL", "2008", "2012", [
        "Staff nurse on a medical unit, then charge nurse on nights.",
        "Precepted new graduates through their first three months.",
      ]],
    ],
    schools: [
      ["Rush University", "M.S.N.", "Nursing Leadership", "Chicago, IL", "2014", "2016", ""],
      ["University of Illinois Chicago", "B.S.N.", "Nursing", "Chicago, IL", "2004", "2008", ""],
    ],
    skills: ["Staffing", "Clinical operations", "Orientation", "Quality", "Patient safety"],
    projects: [
      ["Six-week schedule", "A staffing horizon that replaced day-of agency calls.", "", ["Charge nurses can see gaps while there is still time to fill them."]],
    ],
    certifications: [["Registered Nurse", "Illinois", "2008"]],
    languages: [["English", "Fluent"], ["Urdu", "Native"], ["Hindi", "Professional"]],
    awards: [["Nursing Leadership", "Fieldnote Health", "2022", "For the orientation and the schedule change."]],
    references: [["Marcus Adeyemi", "Chief Medical Officer", "Fieldnote Health", "marcus.adeyemi@fieldnote.example", "+1 (312) 555-0188"]],
  },
  {
    slug: "min-coral",
    templateId: "minimal-coral",
    label: "Minimal Coral",
    pages: 2,
    personal: {
      fullName: "Harper Quinn",
      headline: "Interior Designer",
      email: "harper.quinn@email.com",
      phone: "+1 (512) 555-0186",
      location: "Austin, TX",
      website: "harperquinn.studio",
      linkedin: "linkedin.com/in/harperquinn",
      github: "",
    },
    summary:
      "Interior designer with 9 years on workplaces and small civic interiors. I specify the finish, I keep the budget visible, and I walk the site when the furniture arrives.",
    roles: [
      ["Quinn Studio", "Principal", "Austin, TX", "2020", "", [
        "Lead a four-person studio designing offices, clinics, and one library reading room.",
        "Write the finish schedule so the contractor is not guessing from a rendering.",
        "Stay through installation, including the day the chairs are the wrong width.",
      ]],
      ["Harbor Studio", "Interior Designer", "Austin, TX", "2016", "2020", [
        "Designed workplace interiors from programming through punch list.",
        "Built the sample library and the rule for when a sample is no longer current.",
      ]],
      ["Ellis Moore Architects", "Junior Designer", "Seattle, WA", "2014", "2016", [
        "Supported interior packages for schools and branch libraries.",
        "Drew the furniture plans and checked them against the code notes.",
      ]],
    ],
    schools: [
      ["University of Texas at Austin", "B.S.", "Interior Design", "Austin, TX", "2010", "2014", ""],
    ],
    skills: ["Space planning", "FF&E", "Construction documents", "Client presentations"],
    projects: [
      ["Clinic interiors", "Exam rooms and a waiting room for a neighborhood clinic.", "harperquinn.studio/clinic", ["Specified durable finishes the staff can clean between patients."]],
    ],
    certifications: [["NCIDQ", "CIDQ", "2018"]],
    languages: [["English", "Native"]],
    awards: [["Small Project", "AIA Austin", "2023", "Clinic waiting room."]],
    references: [["Jonah Ellis", "Project Architect", "Ellis Moore Architects", "jonah.ellis@ellismoore.example", "+1 (206) 555-0184"]],
  },
  {
    slug: "min-navy",
    templateId: "minimal-navy",
    label: "Minimal Navy",
    pages: 3,
    personal: {
      fullName: "Victor Lang",
      headline: "Director of Sales",
      email: "victor.lang@email.com",
      phone: "+1 (214) 555-0196",
      location: "Dallas, TX",
      website: "",
      linkedin: "linkedin.com/in/victorlang",
      github: "",
    },
    summary:
      "Sales director with 15 years selling operations software to people who have been burned by a demo. I hire managers who can run a forecast, and I sit in on the calls where the deal is actually stuck.",
    roles: [
      ["Northline", "Director of Sales", "Dallas, TX", "2019", "", [
        "Lead a team of 18 account executives selling to field-service and logistics companies.",
        "Rebuilt the forecast so a commit is a conversation with the buyer, not a hope in the CRM.",
        "Raised win rate on competitive deals by joining the second call, not the ninth.",
        "Wrote the mutual close plan the team uses once a deal has a real date.",
      ]],
      ["Bright Harbor", "Regional Sales Manager", "Dallas, TX", "2015", "2019", [
        "Managed eight sellers covering the central United States.",
        "Turned implementation issues into a checklist sales shares before the contract.",
        "Promoted two account executives into their first manager roles.",
      ]],
      ["Northwater Logistics", "Account Executive", "Dallas, TX", "2011", "2015", [
        "Sold freight services to retailers and food shippers.",
        "Kept the renewal by showing up when a claim went badly, not only at quarter end.",
      ]],
      ["Lakeshore Retail Group", "Sales Associate", "Chicago, IL", "2009", "2011", [
        "Sold on the floor and then trained seasonal hires.",
        "Learned to hear the objection before explaining the product.",
      ]],
    ],
    schools: [
      ["Southern Methodist University", "B.B.A.", "Marketing", "Dallas, TX", "2005", "2009", ""],
    ],
    skills: ["Enterprise sales", "Forecasting", "Hiring", "Negotiation", "CRM"],
    projects: [
      ["Mutual close plan", "A one-page plan the buyer and the seller both sign up to.", "", ["Names the people, the date, and the open question."]],
      ["Second-call rule", "A manager joins the deal when a competitor is in the account.", "", ["Win rate on those deals rose over four quarters."]],
    ],
    certifications: [],
    languages: [["English", "Native"]],
    awards: [["Sales Leadership", "Northline", "2023", "For the forecast rebuild."]],
    references: [["Sofia Alvarez", "Vice President of Product", "Northline", "sofia.alvarez@northline.example", "+1 (415) 555-0175"]],
  },
  {
    slug: "sand",
    templateId: "minimal-sand",
    label: "Minimal Sand",
    pages: 2,
    personal: {
      fullName: "Yuki Tanaka",
      headline: "High School History Teacher",
      email: "yuki.tanaka@email.com",
      phone: "+1 (808) 555-0141",
      location: "Honolulu, HI",
      website: "",
      linkedin: "linkedin.com/in/yukitanaka",
      github: "",
    },
    summary:
      "History teacher with 12 years in public high schools. I plan units students can finish, I write comments a parent can understand, and I share the materials so the next teacher is not starting from a blank folder.",
    roles: [
      ["Roosevelt High School", "History Teacher", "Honolulu, HI", "2016", "", [
        "Teach U.S. history and a senior seminar on Honolulu in the twentieth century.",
        "Built a unit archive the department uses when someone is out for a week.",
        "Advise the history club and the students who research a neighborhood each spring.",
      ]],
      ["McKinley High School", "History Teacher", "Honolulu, HI", "2012", "2016", [
        "Taught world history and supported the new-teacher group.",
        "Wrote the comment bank the team adapted, then threw out the lines that sounded canned.",
      ]],
      ["Department of Education", "Student Teacher", "Honolulu, HI", "2011", "2012", [
        "Student-taught under a mentor who marked up the lesson, not only the quiz.",
        "Learned to end class on the question, not on the bell.",
      ]],
    ],
    schools: [
      ["University of Hawaii at Manoa", "M.Ed.", "Secondary Education", "Honolulu, HI", "2010", "2012", ""],
      ["University of Hawaii at Manoa", "B.A.", "History", "Honolulu, HI", "2006", "2010", ""],
    ],
    skills: ["Curriculum design", "Classroom teaching", "Mentoring", "Family communication"],
    projects: [
      ["Unit archive", "Shared lesson folders with the sources and the assignment, not only the slides.", "", ["A substitute can teach Tuesday without reinventing it."]],
    ],
    certifications: [["Hawaii Teaching License", "Hawaii Teacher Standards Board", "2012"]],
    languages: [["English", "Native"], ["Japanese", "Professional"]],
    awards: [["Teacher of the Year", "Roosevelt High School", "2021", "Department nomination."]],
    references: [["Alan Park", "Principal", "Roosevelt High School", "alan.park@roosevelt.example", "+1 (808) 555-0101"]],
  },
];

export const moreMultipageSampleResumes: {
  title: string;
  templateId: TemplateId;
  content: ResumeContent;
}[] = samples.map((sample) => ({
  title: `${sample.personal.fullName} — ${sample.label} (${sample.pages} pages)`,
  templateId: sample.templateId,
  content: build(sample),
}));
