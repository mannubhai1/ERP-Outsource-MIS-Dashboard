// FinancialDashboardData.ts
import Papa from "papaparse";

export interface FinancialData {
  Software: string;
  ProjectCost: number;
  InvoiceValue: number;
  Type: string;
}

export async function fetchFinancialDashboardData(csvUrl: string): Promise<{
  onboarded: FinancialData[];
  outsourcing: FinancialData[];
}> {
  try {
    const response = await fetch(csvUrl);
    const csvText = await response.text();
    return new Promise((resolve, reject) => {
      Papa.parse<string[]>(csvText, {
        header: false,
        skipEmptyLines: true,
        complete: (results) => {
          // Assume first row is header so we skip it.
          const rows = results.data;
          const data: FinancialData[] = rows.slice(1).map((row) => ({
            Software: row[18] || "",
            Type:
              row[19] && row[19].toLowerCase().trim() === "onboarded"
                ? "onboarded"
                : row[19].toLowerCase().trim() === "outsourcing"
                ? "outsourcing"
                : "",
            ProjectCost: parseFloat(row[20]) || 0,
            InvoiceValue: parseFloat(row[21]) || 0,
          }));
          const onboarded = data.filter((item) => item.Type === "onboarded");
          const outsourcing = data.filter(
            (item) => item.Type === "outsourcing"
          );
          resolve({ onboarded, outsourcing });
        },
        error: reject,
      });
    });
  } catch (error) {
    console.error("Error fetching CSV:", error);
    throw error;
  }
}
