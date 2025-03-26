import BackToHomeButton from "../../../components/BackToHome";

interface ERP {
  _id: string;
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

async function getERP(id: string) {
  const baseUrl =
    process.env.NEXT_PUBLIC_API_URL ||
    (process.env.VERCEL_URL && `https://${process.env.VERCEL_URL}`);
  const res = await fetch(`${baseUrl}/api/erps/${id}`, { cache: "no-store" });
  if (!res.ok) return null;
  return res.json();
}

export default async function ERPDetail({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const erp: ERP | null = await getERP(id);

  if (!erp) {
    return <div className="p-6">ERP Not Found</div>;
  }

  return (
    <div className="p-6 text-black bg-gray-100 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">{erp.name.toUpperCase()}</h1>
        {/* Back to Home Button */}
        <BackToHomeButton />
      </div>

      {/* First Row: Target Date, Primary Contacts, Business Users */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
        <div className="p-4 border rounded-lg bg-white shadow-md">
          <strong>Target Date:</strong> {erp.targetDate}
        </div>
        <div className="p-4 border rounded-lg bg-white shadow-md">
          <strong>Primary Contacts:</strong> {erp.primaryContacts.join(", ")}
        </div>
        <div className="p-4 border rounded-lg bg-white shadow-md">
          <strong>Business Users:</strong> {erp.businessUsers.join(", ")}
        </div>
      </div>

      {/* Second Row: Current Status, Next Steps, Challenges */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
        <div className="p-4 border rounded-lg bg-blue-100 shadow-md">
          <strong className="text-md md:text-lg lg:text-xl">
            Current Status:
          </strong>
          <ul className="list-disc pl-5 mt-2">
            {erp.currentStatus.map((status, idx) => (
              <li key={idx} className="text-black">
                {status}
              </li>
            ))}
          </ul>
        </div>
        <div className="p-4 border rounded-lg bg-yellow-100 shadow-md">
          <strong className="text-md md:text-lg lg:text-xl">Next Steps:</strong>
          <ul className="list-disc pl-5 mt-2">
            {erp.nextSteps.map((step, idx) => (
              <li key={idx} className="text-black">
                {step}
              </li>
            ))}
          </ul>
        </div>
        <div className="p-4 border rounded-lg bg-red-100 shadow-md">
          <strong className="text-md md:text-lg lg:text-xl">Challenges:</strong>
          <ul className="list-disc pl-5 mt-2">
            {erp.challenges.map((challenge, idx) => (
              <li key={idx} className="text-black">
                {challenge}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Third Row: Companies with flip cards */}
      <h2 className="text-2xl font-semibold mb-4">
        VENDORS / PARTNERS / CONTRACTORS
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {erp.companies && erp.companies.length > 0 ? (
          erp.companies.map((company, idx) => (
            <div key={idx} className="relative group w-full h-40">
              {/* Flip card container */}
              <div className="w-full h-full perspective-1000">
                <div className="w-full h-full flip-card">
                  {/* Front Side */}
                  <div className="front w-full h-full bg-white border shadow-lg flex justify-center items-center rounded-lg">
                    <p className="text-md md:text-lg lg:text-xl text-center font-semibold">
                      {company.toUpperCase()}
                    </p>
                  </div>
                  {/* Back Side */}
                  <div className="back w-full h-full bg-gray-800 text-white flex flex-col justify-center items-center rounded-lg p-4 transform rotateY-180">
                    {erp.NDA[idx] && (
                      <a
                        href={erp.NDA[idx]}
                        target="_blank"
                        className="docs mb-2 text-yellow-300 hover:text-white"
                      >
                        NDA
                      </a>
                    )}
                    {erp.Agreement[idx] && (
                      <a
                        href={erp.Agreement[idx]}
                        target="_blank"
                        className="docs mb-2 text-yellow-300 hover:text-white"
                      >
                        Agreement
                      </a>
                    )}
                    {erp.Commercial[idx] && (
                      <a
                        href={erp.Commercial[idx]}
                        target="_blank"
                        className="docs text-yellow-300 hover:text-white"
                      >
                        Commercial
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div>No companies available for this ERP.</div>
        )}
      </div>
    </div>
  );
}
