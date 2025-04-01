# ERP / Outsourcing Dashboard

## Overview

This project is a Next.js-based dashboard that visualizes ERP progress by fetching CSV data from Google Sheets and calculating progress percentages. The dashboard displays progress for different ERP statuses including Pipeline, Onboarded, and Outsourcing Contract, and provides clickable progress bars that link directly to the relevant live sheets.

## Features

- CSV Data Integration:
  Fetches CSV data from Google Sheets using Papaparse, enabling real-time updates on ERP progress.
- Multiple Modes:
  - Normal Mode: Retrieves a pre-calculated percentage from a specified cell (P2) in the CSV.
  - Pipeline Mode: Calculates progress based on the number of "true" values across multiple ERP stages.
- Dynamic Dashboard:
  Displays progress bars for each ERP category (Pipeline, Onboarded, Outsourcing) that are clickable and redirect to the corresponding live sheet.
- Auto Refresh:
  Periodically refreshes ERP data every 5 minutes using a configurable interval constant.
- Responsive UI:
  Built with React and Next.js, ensuring a responsive and user-friendly interface across devices.

## Project Structure

- src/lib/constants.ts:
  Centralized configuration file that stores constants such as the data refresh interval.

- src/lib/calculatePercentages.ts:
  Contains logic to fetch CSV data, parse it, and calculate progress percentages for both normal and pipeline modes.

- Dashboard Components:

  - ERPCard – Displays individual ERP details.
  - ProgressBar – Visualizes progress percentages for each ERP category.
  - Footer and Loading components – Enhance user experience with a clean layout and loading states.

- Data Files:
  JSON files that define sheet configurations for Pipeline, Onboarded, and Outsourcing statuses.

## Getting Started

Prerequisites:

- Node.js (v14 or higher)
- npm or yarn

Installation:

1. Clone the repository:
   git clone https://github.com/your-username/erp-outsourcing-dashboard.git
   cd erp-outsourcing-dashboard

2. Install dependencies:
   npm install
   or
   yarn install

3. Create a .env.local file in the root directory and add your environment variables:
   NEXT_PUBLIC_API_URL=your_api_url
   NEXT_PUBLIC_PIPELINE_CSV_ID=your_pipeline_csv_id
   NEXT_PUBLIC_PIPELINE_LIVE_ID=your_pipeline_live_id
   NEXT_PUBLIC_NORMAL_CSV_ID=your_normal_csv_id
   NEXT_PUBLIC_NORMAL_LIVE_ID=your_normal_live_id

Running the Application:
Start the development server:
npm run dev
or
yarn dev
Visit http://localhost:3000 to view the dashboard.

## Build & Deployment

For production builds, run:
npm run build
npm run start
The project is designed for easy deployment to platforms like Vercel or Netlify.

## Contributing

Contributions are welcome! Please open issues and submit pull requests for any features, bug fixes, or enhancements.

## License

This project is licensed under the MIT License.

---

A centralized, real-time dashboard for ERP and Outsourcing status – monitor your progress and stay on top of your operations with ease!
