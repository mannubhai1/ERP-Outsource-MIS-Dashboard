"use client";
import React from "react";

const FinancialDashboard: React.FC = () => {
  return (
    <div className="p-4 bg-white border rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">Financial Dashboard</h2>
      {/* Render financial charts and data here */}
      <p>
        This section will show each ERP&apos;s total amount to be paid and the
        amount paid till now.
      </p>
    </div>
  );
};

export default FinancialDashboard;
