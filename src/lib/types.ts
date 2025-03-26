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
  RFQs: string[];
  Miscellanous?: string;
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
  RFQs: string;
  Miscellanous?: string;
}

export interface CompanyData {
  name: string;
  NDA?: string;
  Agreement?: string;
  Commercial?: string;
  Brochures?: string;
  RFQs?: string;
}
