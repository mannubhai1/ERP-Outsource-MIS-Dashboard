import Papa from "papaparse";
import { CsvSheet, SheetPercentage, ModuleData } from "./types";

/**
 * Determine the status based on progress percentage.
 */
function getStatus(progress: number): string {
  if (progress === 0) return "not started";
  if (progress <= 20) return "Low";
  if (progress <= 40) return "Medium";
  if (progress <= 60) return "Fair";
  if (progress <= 80) return "Good";
  if (progress <= 100) return "Excellent";
  return "unknown";
}

export async function calculatePercentages(
  sheets: CsvSheet[],
  mode: "normal" | "pipeline" = "normal"
): Promise<(ModuleData | SheetPercentage)[]> {
  const perSheetArrays = await Promise.all(
    sheets.map(async (sheet) => {
      try {
        const res = await fetch(sheet.csvUrl);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const text = await res.text();
        const parsed = Papa.parse<Record<string, string>>(text, {
          header: true,
          skipEmptyLines: true,
        });
        if (parsed.errors.length) {
          throw new Error(parsed.errors.map((e) => e.message).join("; "));
        }

        if (mode === "normal") {
          const headers = parsed.meta.fields ?? [];
          const rows = parsed.data;
          if (headers.length < 18 || rows.length === 0) {
            // Fallback for insufficient data
            const emptyModule: ModuleData = {
              id: sheet.name,
              name: sheet.name,
              progress: 0,
              status: getStatus(0),
              tasks: 0,
              tasksCompleted: 0,
              url: sheet.url,
            };
            return [emptyModule];
          }

          const first = rows[0];
          const done = parseInt(first[headers[16]] ?? "0", 10);
          const total = parseInt(first[headers[17]] ?? "0", 10);
          const rawProgress = total > 0 ? (done / total) * 100 : 0;
          const progress = parseInt(rawProgress.toFixed(0), 10);
          const status = getStatus(progress);

          const moduleData: ModuleData = {
            id: sheet.name,
            name: sheet.name,
            progress,
            status,
            tasks: total,
            tasksCompleted: done,
            url: sheet.url,
          };
          return [moduleData];
        } else {
          // Pipeline mode: calculate per-stage percentages
          const headers = parsed.meta.fields ?? [];
          if (headers.length < 2) {
            throw new Error("Not enough columns for pipeline mode");
          }
          const stages = parsed.data;
          const totalStages = stages.length;
          const erpCols = headers.slice(1);

          const pipelineResults: SheetPercentage[] = erpCols.map((erp) => {
            let doneCount = 0;
            for (const row of stages) {
              if (row[erp]?.trim().toLowerCase() === "true") {
                doneCount++;
              }
            }
            const progress = totalStages ? (doneCount / totalStages) * 100 : 0;
            return {
              name: erp,
              progress,
              url: sheet.url,
            };
          });
          return pipelineResults;
        }
      } catch (err) {
        console.error(err);
        if (mode === "normal") {
          const fallback: ModuleData = {
            id: sheet.name,
            name: sheet.name,
            progress: 0,
            status: getStatus(0),
            tasks: 0,
            tasksCompleted: 0,
            url: sheet.url,
          };
          return [fallback];
        } else {
          const fallback: SheetPercentage = {
            name: sheet.name,
            progress: 0,
            url: sheet.url,
          };
          return [fallback];
        }
      }
    })
  );

  return perSheetArrays.flat();
}
