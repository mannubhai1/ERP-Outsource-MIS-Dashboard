import Link from "next/link";
import { isPast } from "date-fns";

export interface ERP {
  id: number;
  name: string;
  companies: string[];
  status: string;
  currentStatus: string[];
  nextSteps: string[];
  targetDate: string;
  extendedDate?: string; // Optional extended date
  challenges: string[];
  primaryContacts: string[];
  businessUsers: string[];
  NDA: string[];
  Agreement: string[];
  Commercial: string[];
}

export default function ERPCard({ erp }: { erp: ERP }) {
  const deadlineMissed = isPast(new Date(erp.targetDate));

  return (
    <Link href={`/erp/${erp.id}`}>
      <div className="space-y-6 bg-white rounded-xl shadow-md p-4 hover:shadow-lg cursor-pointer">
        <h3 className="text-xl text-black font-semibold">
          {erp.name.toUpperCase()}
        </h3>

        {/* Target Date with Strikethrough if Extended Date exists */}
        <div className="mt-2">
          {erp.extendedDate ? (
            <div className="text-red-500 line-through">
              Target: {erp.targetDate}
            </div>
          ) : (
            <div
              className={`text-md md:text-lg mt-2 ${
                deadlineMissed ? "text-red-500 line-through" : "text-green-500"
              }`}
            >
              Target: {erp.targetDate}
            </div>
          )}
        </div>

        {/* Conditional rendering of Extended Date row */}
        {erp.extendedDate && (
          <div className="text-yellow-600">Extended: {erp.extendedDate}</div>
        )}

        {/* Contacts */}
        <p className="text-sm md:text-md text-gray-500 mt-2">
          Contacts: {erp.primaryContacts.join(", ")}
        </p>
      </div>
    </Link>
  );
}
