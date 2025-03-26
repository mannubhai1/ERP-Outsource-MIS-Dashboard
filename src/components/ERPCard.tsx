import Link from "next/link";

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
}

export default function ERPCard({ erp }: { erp: ERP }) {
  return (
    <Link href={`/erp/${erp.id}`}>
      <div className="space-y-6 bg-white rounded-xl shadow-md p-4 hover:shadow-lg cursor-pointer">
        <h3 className="text-xl text-black font-semibold">
          {erp.name.toUpperCase()}
        </h3>
        {/* <div
          className={`text-md md:text-lg mt-2 ${
            deadlineMissed ? "text-red-500 line-through" : "text-green-500"
          }`}
        >
          Target: {erp.targetDate}
        </div> */}
        <div className="text-md md:text-lg mt-2 text-green-500">
          Target: {erp.targetDate}
        </div>
        {/* {erp.extendedDate && erp.extendedDate.length > 0 && (
          <div className="text-yellow-600">Extended: {erp.extendedDate}</div>
        )} */}
        <p className="text-sm md:text-md text-gray-500 mt-2">
          Contacts: {erp.primaryContacts.join(", ")}
        </p>
      </div>
    </Link>
  );
}
