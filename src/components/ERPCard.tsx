import Link from "next/link";
import { ERP } from "@/lib/types";

export default function ERPCard({ erp }: { erp: ERP }) {
  const targetDates = erp.targetDate || [];
  const extendedDates = erp.extendedDate || [];
  const hasExtendedDate = extendedDates.length > 0;
  // console.log("ERPCard", erp);

  interface DelayStatusClasses {
    [key: string]: string;
  }

  const delayStatusClasses: DelayStatusClasses = {
    "before-time": "bg-green-100 text-green-800 border-green-300",
    "on-time": "bg-yellow-100 text-yellow-800 border-yellow-300",
    delayed: "bg-red-100 text-red-800 border-red-300",
  };

  return (
    <Link href={`/erp/${erp.id}`}>
      <div className="flex flex-col h-full space-y-6 bg-gray-50 rounded-xl shadow-md p-4 hover:shadow-lg cursor-pointer hover:bg-green-100">
        <div className="flex flex-col lg:flex-row justify-between">
          <h3 className="text-xl text-black font-semibold w-full md:w-3/5 break-words">
            {erp.name.toUpperCase()}
          </h3>
          <div className="mt-2 md:mt-2">
            {erp.delayStatus === "" ? (
              <div className="w-full md:w-auto min-w-[120px] text-sm sm:text-base border border-gray-300 rounded-full px-3 py-1 text-center bg-gray-100 text-gray-800">
                No Status
              </div>
            ) : (
              <div
                className={`w-full md:w-auto min-w-[120px] text-sm sm:text-base border rounded-full px-3 py-1 text-center ${
                  delayStatusClasses[erp.delayStatus] ||
                  "bg-gray-100 text-gray-800 border-gray-300"
                }`}
              >
                {erp.delayStatus === "before-time"
                  ? "Before Time"
                  : erp.delayStatus === "on-time"
                  ? "On Time"
                  : erp.delayStatus === "delayed"
                  ? "Delayed"
                  : erp.delayStatus}
              </div>
            )}
          </div>
        </div>

        <div className="text-md md:text-lg mt-2 flex-grow">
          {/* Only render dates if we actually have them */}
          {targetDates.length > 0 && (
            <>
              {hasExtendedDate ? (
                // ---------------------------------------------
                // CASE: Extended date exists => strike out target date
                // ---------------------------------------------
                <div>
                  <span className="text-red-500">Target Date :</span>

                  {/* If there's exactly 1 target date */}
                  {targetDates.length === 1 ? (
                    <span className="mx-2 text-green-500 line-through decoration-red">
                      {targetDates[0]}
                    </span>
                  ) : (
                    // If multiple target dates, show bullet points
                    <ul className="mx-2 text-green-500 list-disc list-inside line-through decoration-red max-h-24 overflow-y-auto">
                      {targetDates.map((date, idx) => (
                        <li key={idx}>{date}</li>
                      ))}
                    </ul>
                  )}

                  {/* Show extended date(s) in red */}
                  {extendedDates.length === 1 ? (
                    <div className="text-red-500 mt-1">{extendedDates[0]}</div>
                  ) : (
                    <ul className="text-red-500 list-disc list-inside mt-1 max-h-24 overflow-y-auto">
                      {extendedDates.map((ed, idx) => (
                        <li key={idx}>{ed}</li>
                      ))}
                    </ul>
                  )}
                </div>
              ) : (
                // ---------------------------------------------
                // CASE: No extended date => just show target date(s)
                // ---------------------------------------------
                <div className="text-green-500">
                  {/* Single target date vs multiple bullet points */}
                  {targetDates.length === 1 ? (
                    <div>Target Date : {targetDates[0]}</div>
                  ) : (
                    <div>
                      Target Dates :
                      <ul className="list-disc list-inside max-h-24 overflow-y-auto">
                        {targetDates.map((date, idx) => (
                          <li key={idx}>{date}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}
            </>
          )}
        </div>

        {/* Footer content placed at the bottom */}
        <p className="text-sm md:text-md text-gray-500 mt-auto">
          Contacts: {erp.primaryContacts.join(", ")}
        </p>
      </div>
    </Link>
  );
}
