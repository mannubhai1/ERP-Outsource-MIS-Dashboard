import Papa from "papaparse";

export interface CsvSheet {
  name: string;
  csvUrl: string;
  url: string;
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

/**
 * Calculates progress percentages for an array of CSV sheets.
 *
 * In "normal" mode, it counts the number of rows with a truthy "Tick" value
 * ("true") and calculates: (trueCount / (trueCount + falseCount)) * 100.
 *
 * In "pipeline" mode, it assumes the CSV structure is as follows:
 * - The first column contains stage names.
 * - The remaining columns represent different ERPs.
 * For each ERP column, the progress is calculated as:
 * (number of rows with truthy value / total number of stages) * 100.
 *
 * @param sheets An array of objects with a sheet name and CSV URL.
 * @param mode "normal" (default) or "pipeline"
 * @returns A Promise that resolves to an array of objects containing a name (sheet name or ERP name) and progress percentage.
 */
export async function calculatePercentages(
  sheets: CsvSheet[],
  mode: "normal" | "pipeline" = "normal"
): Promise<(SheetPercentage | PipelineProgress)[]> {
  const results = await Promise.all(
    sheets.map(async (sheet) => {
      try {
        const response = await fetch(sheet.csvUrl);
        if (!response.ok) {
          throw new Error(
            `Failed to fetch CSV for ${sheet.name}: ${response.status}`
          );
        }
        const csvData = await response.text();
        // Use header: true to parse CSV
        const parsedResult = Papa.parse(csvData, {
          header: true,
          skipEmptyLines: true,
        });
        if (parsedResult.errors.length) {
          console.error(
            `Papaparse errors for ${sheet.name}:`,
            parsedResult.errors
          );
          throw new Error(`Error parsing CSV data for ${sheet.name}`);
        }

        // Normal Mode: use P2 cell to fetch progress
        if (mode === "normal") {
          const headers = parsedResult.meta.fields || [];
          if (headers.length < 16 || parsedResult.data.length === 0) {
            console.warn(`Sheet ${sheet.name} does not have a valid P2 cell.`);
            return { name: sheet.name, progress: 0, url: sheet.url };
          }
          const pHeader = headers[15];
          const firstRow = parsedResult.data[0] as Record<string, string>;
          const cellValue = firstRow[pHeader];

          let progress = 0;
          if (cellValue) {
            progress = parseFloat(cellValue.replace("%", "").trim());
          }
          // console.log(`Progress of ${sheet.name} is here : ${progress}`);
          return { name: sheet.name, progress, url: sheet.url };
        } else {
          // Pipeline Mode:
          const headers = parsedResult.meta.fields || [];
          if (headers.length < 2) {
            throw new Error(
              `Not enough columns in pipeline sheet ${sheet.name}`
            );
          }
          const erpNames = headers.slice(1); // Exclude the first column (stages)
          const totalStages = parsedResult.data.length;
          const pipelineResults: PipelineProgress[] = erpNames.map(
            (erpName) => {
              let trueCount = 0;
              (parsedResult.data as Record<string, string>[]).forEach((row) => {
                const cell = row[erpName];
                if (cell) {
                  const val = cell.toLowerCase().trim();
                  if (val === "true") {
                    trueCount++;
                  }
                }
              });
              const progress =
                totalStages === 0 ? 0 : (trueCount / totalStages) * 100;
              return { erpName, progress, url: sheet.url };
            }
          );
          return pipelineResults.map((item) => ({
            name: `${item.erpName}`,
            progress: item.progress,
            url: sheet.url,
          }));
        }
      } catch (error) {
        console.error(`Error processing sheet ${sheet.name}:`, error);
        return mode === "normal"
          ? { name: sheet.name, progress: 0, url: sheet.url }
          : { name: sheet.name, progress: 0, url: sheet.url };
      }
    })
  );

  const flattened = results.flat(); // we are flattening the array because we are returning an array of arrays
  return flattened;
}
