import Link from "next/link";
import { ERP } from "@/lib/types";

export default function ERPCard({ erp }: { erp: ERP }) {
  const hasExtendedDate: boolean = erp.extendedDate !== "";

  return (
    <Link href={`/erp/${erp.id}`}>
      <div className="space-y-6 bg-white rounded-xl shadow-md p-4 hover:shadow-lg cursor-pointer">
        <h3 className="text-xl text-black font-semibold">
          {erp.name.toUpperCase()}
        </h3>
        <div className="text-md md:text-lg mt-2">
          {hasExtendedDate ? (
            <div>
              <span
                className={`${
                  hasExtendedDate ? "text-red-500" : "text-green-500"
                }`}
              >
                Target Date :
              </span>
              <span className="mx-2 text-green-500 line-through decoration-red">
                {erp.targetDate}
              </span>
              <span className="text-red-500 mt-2">{erp.extendedDate}</span>
            </div>
          ) : (
            // If no extended date, just show target date in normal green
            <div className="text-green-500">Target Date : {erp.targetDate}</div>
          )}
        </div>
        <p className="text-sm md:text-md text-gray-500 mt-2">
          Contacts: {erp.primaryContacts.join(", ")}
        </p>
      </div>
    </Link>
  );
}
