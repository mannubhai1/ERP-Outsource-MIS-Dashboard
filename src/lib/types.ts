export interface ERP {
  id: number;
  name: string;
  companies: string[];
  lastUpdated: string;
  status: string;
  currentStatus: string[];
  nextSteps: string[];
  targetDate: string[];
  extendedDate?: string[];
  challenges: string[];
  primaryContacts: string[];
  businessUsers: string[];
  NDA: string[];
  Agreement: string[];
  Commercial: string[];
  Brochures: string[];
  MOMs: string[];
  implementationPlan: string[];
  Correspondence: string;
  Milestones: string;
  Comparative: string;
  Miscellaneous: string;
}

export interface ERPInput {
  id: number;
  name: string;
  companies: string;
  lastUpdated: string;
  status: string;
  currentStatus: string;
  nextSteps: string;
  targetDate: string;
  extendedDate?: string;
  challenges: string;
  primaryContacts: string;
  businessUsers: string;
  NDA: string;
  Agreement: string;
  Commercial: string;
  Brochures: string;
  MOMs: string;
  implementationPlan: string;
  Correspondence: string;
  Milestones: string;
  Comparative: string;
  Miscellaneous: string;
}
