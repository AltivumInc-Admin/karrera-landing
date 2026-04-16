export interface ResumeData {
  basics: {
    name: string;
    email: string;
    phone: string;
    location: string;
    summary: string;
    linkedin: string | null;
    github: string | null;
    website: string | null;
  };
  experience: {
    company: string;
    title: string;
    location: string;
    startDate: string;
    endDate: string;
    bullets: string[];
  }[];
  education: {
    institution: string;
    degree: string;
    field: string;
    startDate: string;
    endDate: string;
    gpa: string | null;
  }[];
  skills: {
    technical: string[];
    soft: string[];
    languages: string[];
    tools: string[];
  };
  certifications: {
    name: string;
    issuer: string;
    date: string;
    credlyUrl: string | null;
  }[];
  projects: {
    name: string;
    description: string;
    technologies: string[];
    url: string | null;
  }[];
  military: {
    branch: string;
    rank: string;
    role: string;
    startDate: string;
    endDate: string;
    highlights: string[];
  }[] | null;
}

export interface ResumeRecord {
  pk: string;
  sk: string;
  s3Key: string;
  s3Bucket: string;
  status: "pending" | "parsed" | "error";
  parsedData?: ResumeData;
  parseError?: string;
  uploadedAt: string;
  updatedAt: string;
}

export interface UserProfile {
  pk: string;
  sk: string;
  email: string;
  name: string;
  phone?: string;
  stripeCustomerId?: string;
  stripeProduct?: string;
  planActive?: boolean;
  cognitoSub?: string;
  createdAt: string;
  updatedAt: string;
}
