import { ERP } from "@/lib/types";
import Footer from "@/components/Footer";
import BackToHomeButton from "@/components/BackToHome";

// Fetch ERP data
async function getERP(id: string) {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL;
  const res = await fetch(`${baseUrl}/api/erps/${id}`);
  if (!res.ok) return null;
  return res.json();
}

// ERPDetail Component
export default async function ERPDetail({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const erp: ERP | null = await getERP(id);

  const hasExtendedDate: boolean = (erp as ERP).extendedDate !== "";

  if (!erp) {
    return <div className="p-6">ERP Not Found</div>;
  }

  // Define the first row and second row content in arrays
  const firstRowData = [
    {
      label: "Target Date",
      value: hasExtendedDate ? erp.extendedDate : erp.targetDate,
    },
    {
      label: "Primary Contacts",
      value: erp.primaryContacts.join(", "),
    },
    {
      label: "Business Users",
      value: erp.businessUsers.join(", "),
    },
  ];

  const secondRowData = [
    {
      label: "Current Status",
      value: erp.currentStatus,
      style: "bg-blue-200",
    },
    { label: "Next Steps", value: erp.nextSteps, style: "bg-yellow-200" },
    { label: "Challenges", value: erp.challenges, style: "bg-red-300" },
  ];

  // Define the company documents (NDA, Agreement, Commercial) for each company
  const companyDocs = [
    { label: "NDA", value: erp.NDA },
    { label: "Agreement", value: erp.Agreement },
    { label: "Commercial", value: erp.Commercial },
    { label: "Brochures", value: erp.Brochures },
    { label: "RFQs", value: erp.RFQs },
  ];

  return (
    <div className="flex flex-col min-h-screen">
      <div className="flex-grow p-6 text-black bg-gray-100">
        <div className="mb-15">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold">{erp.name.toUpperCase()}</h1>
            <BackToHomeButton />
          </div>

          {/* First Row: Dynamic */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
            {firstRowData.map((item, idx) => (
              <div
                key={idx}
                className={`p-4 border rounded-lg bg-white shadow-md`}
              >
                <strong>{item.label}:</strong> {item.value}
              </div>
            ))}
          </div>

          {/* Second Row: Dynamic */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {secondRowData.map((item, idx) => (
              <div
                key={idx}
                className={`p-4 border rounded-lg bg-blue-100 shadow-md ${item.style}`}
              >
                <strong className="text-md md:text-lg lg:text-xl">
                  {item.label}:
                </strong>
                <ul className="list-disc pl-5 mt-2">
                  {item.value.map((val, index) => (
                    <li key={index} className="text-black">
                      {val}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Companies Row: Dynamic */}
          <h2 className="text-2xl font-semibold mb-4">
            VENDORS / PARTNERS / CONTRACTORS DATA
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 justify-items-center mb-4">
            {erp.companies && erp.companies.length > 0 ? (
              erp.companies.map((company, idx) => (
                <div key={idx} className="relative group w-full h-40">
                  <div className="w-full h-full perspective-1000">
                    <div className="w-full h-full flip-card">
                      <div className="front w-full h-full bg-white border shadow-lg flex justify-center items-center rounded-lg">
                        <p className="text-md md:text-lg lg:text-xl text-center font-semibold">
                          {company.toUpperCase()}
                        </p>
                      </div>
                      <div className="back w-full h-full bg-gray-800 text-white flex flex-col justify-center items-center rounded-lg p-4 transform rotateY-180">
                        {/* Render the company documents dynamically */}
                        <div
                          className={`${
                            companyDocs.length === 1
                              ? "grid grid-cols-1 gap-4 justify-items-center"
                              : "grid grid-cols-2 gap-4 justify-items-center"
                          } w-full`}
                        >
                          {companyDocs.map(
                            (doc, index) =>
                              doc.value[idx] &&
                              doc.value[idx] !== "" && (
                                <a
                                  key={index}
                                  href={doc.value[idx]}
                                  target="_blank"
                                  className="docs mb-2 text-yellow-300 hover:text-white"
                                >
                                  {doc.label}
                                </a>
                              )
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div>No companies available for this ERP.</div>
            )}
          </div>

          {/* Miscellaneous Link Section */}
          {erp.Miscellanous && erp.Miscellanous !== "" && (
            <h2 className="text-2xl font-semibold mb-4">RML DATA</h2>
          )}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 justify-items-center">
            {erp.Miscellanous && erp.Miscellanous !== "" && (
              <div className="relative group w-full h-40">
                <div className="w-full h-full perspective-1000">
                  <div className="w-full h-full flip-card">
                    <div className="front w-full h-full bg-white border shadow-lg flex justify-center items-center rounded-lg">
                      <p className="text-md md:text-lg lg:text-xl text-center font-semibold">
                        MISCELLANOUS
                      </p>
                    </div>
                    <div className="back w-full h-full bg-gray-800 text-white flex flex-col justify-center items-center rounded-lg p-4 transform rotateY-180">
                      <a
                        href={erp.Miscellanous}
                        target="_blank"
                        className="docs mb-2 text-yellow-300 hover:text-white"
                      >
                        View Miscellanous
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
