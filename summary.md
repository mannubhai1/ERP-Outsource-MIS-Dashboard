# ERP / Outsourcing Dashboard - Non-Technical Summary

## What is this Application?

This application is a web-based dashboard designed to provide a clear overview and status updates for various ERP (Enterprise Resource Planning) systems and Outsourcing Contracts that the organization is involved with. Think of it as a central hub to track the progress and key details of these important projects or partnerships.

## How Does it Work?

1.  **Central Information Source:** The main list of all ERPs and Contracts, along with their detailed information (like associated companies, current status, next steps, contacts, important documents), is stored in a central Google Sheet. The dashboard automatically reads data from this sheet.
2.  **Tracking Progress:** To show how far along each project category is, the dashboard looks at separate, dedicated Google Sheets:
    *   One sheet tracks the progress of ERPs currently "In Pipeline".
    *   Another sheet tracks the progress of ERPs that have been "Onboarded".
    *   A third sheet tracks the progress of "Outsourcing Contracts".
    *   The dashboard reads specific information (like completion percentages or checklists) from these sheets to calculate an overall progress score for each category.
3.  **Displaying Information:** When you open the application in your web browser, it fetches all this information and presents it in a user-friendly way:
    *   **Main Dashboard View:** Shows a high-level overview with progress bars for the Pipeline, Onboarded, and Outsourcing categories. This gives a quick glance at the overall status.
    *   **Financial View:** Shows a specific dashboard focused on the financial aspects related to the Onboarded ERPs and Outsourcing Contracts.
    *   **Detailed Lists:** You can click into specific categories (Pipeline, Onboarded, Outsourcing) to see a list of individual ERPs or Contracts belonging to that category. Each item is shown as a card with key details. You can likely click on these cards for even more information (though this specific functionality needs confirmation).
4.  **Keeping Data Fresh:** The dashboard automatically checks the Google Sheets for updates at regular intervals (e.g., every few minutes), so the information displayed should always be relatively current without needing manual refreshes.
5.  **User Interface:** The application provides buttons and tabs to easily switch between the main dashboard, the financial view, and the detailed lists for each category. It remembers which view you were last looking at.

## In Simple Terms:

Imagine you have one big spreadsheet with all your projects (the main Google Sheet) and several smaller checklists tracking the progress of different project types (the progress Google Sheets). This dashboard automatically reads all that information, calculates the progress, and displays it neatly on a webpage with different views, so you can easily see what's going on with all your ERPs and contracts without having to dig through the spreadsheets yourself.
