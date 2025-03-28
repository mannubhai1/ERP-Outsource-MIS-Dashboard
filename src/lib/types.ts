export interface ERP {
  id: number;
  name: string;
  companies: string[];
  status: string;
  currentStatus: string[];
  nextSteps: string[];
  targetDate: string;
  extendedDate?: string;
  challenges: string[];
  primaryContacts: string[];
  businessUsers: string[];
  NDA: string[];
  Agreement: string[];
  Commercial: string[];
  Brochures: string[];
  MOMs: string[];
  implementationPlan: string[];
  Correspondence?: string;
}

export interface ERPInput {
  id: number;
  name: string;
  companies: string;
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
  Correspondence?: string;
}
