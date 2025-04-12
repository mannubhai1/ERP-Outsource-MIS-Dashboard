export interface ERP {
  id: number;
  name: string;
  companies: string[];
  lastUpdated: string;
  status: string;
  delayStatus: string;
  currentStatus: string[];
  nextSteps: string[];
  targetDate: string[];
  extendedDate?: string[];
  Support: string[];
  primaryContacts: string[];
  businessUsers: string[];
  NDA: string[];
  Agreement: string[];
  Commercial: string[];
  Brochures: string[];
  MOMs: string[];
  implementationPlan: string[];
  SOWTracker: string[];
  Correspondence: string;
  Comparative: string;
  Miscellaneous: string;
  Reports: string;
  Issues: string[];
}

export interface ERPInput {
  id: number;
  name: string;
  companies: string;
  lastUpdated: string;
  status: string;
  delayStatus: string;
  currentStatus: string;
  nextSteps: string;
  targetDate: string;
  extendedDate?: string;
  Support: string;
  primaryContacts: string;
  businessUsers: string;
  NDA: string;
  Agreement: string;
  Commercial: string;
  Brochures: string;
  MOMs: string;
  implementationPlan: string;
  SOWTracker: string;
  Correspondence: string;
  Comparative: string;
  Miscellaneous: string;
  Reports: string;
  Issues: string;
}

export interface SheetPercentage {
  name: string;
  progress: number;
  url: string;
}

export interface PipelineProgress {
  erpName: string;
  progress: number;
}

export interface CsvSheet {
  name: string;
  csvUrl: string;
  url: string;
}
