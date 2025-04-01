import Link from "next/link";
import { ERP } from "@/lib/types";

export default function ERPCard({ erp }: { erp: ERP }) {
  // Assume targetDate and extendedDate are arrays:
  const targetDates = erp.targetDate || [];
  const extendedDates = erp.extendedDate || [];

  // Extended date is "present" if there's at least one entry
  const hasExtendedDate = extendedDates.length > 0;

  return (
    <Link href={`/erp/${erp.id}`}>
      {/* 
        Use flex-col and h-full to allow the card to expand
        and rely on a parent container (grid or flex with items-stretch) 
        to enforce consistent heights across cards.
      */}
      <div className="flex flex-col h-full space-y-6 bg-white rounded-xl shadow-md p-4 hover:shadow-lg cursor-pointer hover:bg-green-200">
        <h3 className="text-xl text-black font-semibold">
          {erp.name.toUpperCase()}
        </h3>

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
