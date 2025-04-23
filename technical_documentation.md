# ERP / Outsourcing Dashboard - Technical Documentation

This document provides a technical overview of the ERP/Outsourcing Dashboard application, built with Next.js and React.

## 1. Project Structure

The project follows a standard Next.js structure:

```
erp-mis-dashboard/
├── public/             # Static assets
├── src/
│   ├── app/            # Next.js App Router
│   │   ├── api/        # API routes
│   │   │   ├── erps/
│   │   │   │   ├── route.ts          # Fetches all ERP data
│   │   │   │   └── [id]/
│   │   │   │       └── route.ts      # (Likely intended for single ERP fetch - check implementation)
│   │   ├── erp/
│   │   │   └── [id]/
│   │   │       └── page.tsx        # Detail page for a single ERP
│   │   ├── globals.css   # Global styles
│   │   ├── layout.tsx    # Root layout
│   │   └── page.tsx      # Main dashboard page component
│   ├── components/     # React components
│   │   ├── ui/         # Shadcn UI components (e.g., card, chart)
│   │   ├── BackToHome.tsx
│   │   ├── CriticalIssuesMeetings.tsx
│   │   ├── DashboardSection.tsx # Displays progress sections
│   │   ├── ERPCard.tsx      # Card for individual ERPs
│   │   ├── FinancialDashboard.tsx # Financial view component
│   │   ├── Footer.tsx
│   │   ├── Loading.tsx      # Loading indicators
│   │   ├── LoadingExp.tsx
│   │   ├── PipelineComponent.tsx # Component for pipeline progress
│   │   └── ProgressBar.tsx    # Progress bar UI
│   ├── data/             # Static JSON data configuration
│   │   ├── onboarded.json
│   │   ├── outsourcing.json
│   │   └── pipeline.json
│   ├── hooks/            # Custom React hooks (if any)
│   ├── lib/              # Utility functions, types, constants
│   │   ├── calculatePercentages.ts # Logic for progress calculation
│   │   ├── constants.ts    # Application constants (e.g., refresh interval)
│   │   ├── financialDashboardData.ts # Data/logic for financial dashboard
│   │   ├── googleSheets.ts # Fetches and parses main ERP data from Google Sheet
│   │   ├── numberWIthCommas.ts # Formatting utility
│   │   ├── types.ts        # TypeScript type definitions
│   │   └── utils.ts        # General utility functions (e.g., Shadcn UI utils)
│   └── ...
├── .env.local          # Environment variables (IMPORTANT: Not committed)
├── next.config.ts      # Next.js configuration
├── package.json        # Project dependencies and scripts
├── tsconfig.json       # TypeScript configuration
└── ...                 # Other config files (.gitignore, postcss, eslint)
```

## 2. Core Functionality

### 2.1. Main Dashboard Page (`src/app/page.tsx`)

*   **Framework:** React (Client Component - `"use client"`)
*   **State Management:** `useState` for selected tab, ERP data, loading status, and progress percentages. `localStorage` is used to persist the selected tab.
*   **Data Fetching:**
    *   **ERP Data:** Fetches from `/api/erps` using `fetch` on component mount and periodically refreshes based on `DATA_REFRESH_INTERVAL` from `src/lib/constants.ts`.
    *   **Progress Data:** Uses `calculatePercentages` function (`src/lib/calculatePercentages.ts`) to fetch and process data for "pipeline", "onboarded", and "outsourcing" categories. The specific Google Sheet CSV URLs are constructed using base IDs from environment variables and sheet configurations from `src/data/*.json`.
*   **UI Logic:**
    *   Displays a loading indicator (`Loader`) while data is fetching.
    *   Renders different views based on the `selectedTab` state:
        *   `dashboard`: Shows `DashboardSection` component with progress bars for all categories.
        *   `financial`: Shows `FinancialDashboard` component.
        *   `pipeline`, `onboarded`, `outsourcing`: Shows a grid of `ERPCard` components, filtered based on the selected tab.
    *   Provides buttons to switch between views (`View ERPs/Contracts`, `View Financial Status`, `View Live Dashboard status`).
    *   Uses tabs (`renderHeadingTabs`) to filter ERP cards when in the card view.

### 2.2. ERP Data API (`src/app/api/erps/route.ts`)

*   **Framework:** Next.js API Route
*   **Functionality:** Handles GET requests to `/api/erps`.
*   **Data Source:** Calls `fetchGoogleSheetData` from `src/lib/googleSheets.ts` to retrieve data.
*   **Response:** Returns the fetched ERP data as a JSON array.
*   **Caching:** Explicitly set to `force-dynamic` to ensure fresh data on every request.

### 2.3. Google Sheet Data Fetching (`src/lib/googleSheets.ts`)

*   **Function:** `fetchGoogleSheetData`
*   **Purpose:** Fetches and parses the main ERP data from a Google Sheet.
*   **Mechanism:**
    1.  Constructs a Google Sheet CSV export URL using `process.env.MAIN_SHEET_ID`.
    2.  Uses `fetch` with `next: { revalidate: 0 }` to ensure fresh data.
    3.  Uses `papaparse` library to parse the fetched CSV text data into JavaScript objects, assuming the first row contains headers.
    4.  Filters out rows where the `name` column is empty.
    5.  Maps the raw row data to the `ERP` type defined in `src/lib/types.ts`. This involves:
        *   Assigning a sequential `id`.
        *   Trimming string values (`safeString`).
        *   Splitting delimited strings (e.g., using `/` or newlines) into arrays for fields like `companies`, `currentStatus`, `nextSteps`, etc. (`safeSplit`).

### 2.4. Progress Calculation (`src/lib/calculatePercentages.ts`)

*   **Function:** `calculatePercentages`
*   **Purpose:** Calculates progress percentages for different categories based on data from separate Google Sheet CSVs.
*   **Parameters:**
    *   `sheets`: An array of `CsvSheet` objects (containing `name`, `csvUrl`, `url`).
    *   `mode`: Either `"normal"` or `"pipeline"`.
*   **Mechanism:**
    1.  Iterates through the `sheets` array.
    2.  For each sheet, fetches the CSV data from `sheet.csvUrl`.
    3.  Parses the CSV using `papaparse`.
    4.  **Normal Mode:**
        *   Assumes the progress percentage is located in a specific cell (column P, index 15) of the *first data row* (row index 1, considering header is row 0).
        *   Extracts the value, removes the `%` sign, and parses it as a float.
        *   Returns `{ name: sheet.name, progress: calculatedProgress, url: sheet.url }`.
    5.  **Pipeline Mode:**
        *   Assumes the first column contains stage names and subsequent columns represent individual ERPs.
        *   Calculates progress for *each ERP column* based on the number of cells in that column containing the value `"true"` (case-insensitive).
        *   Progress = (`trueCount` / `totalStages`) * 100.
        *   Returns an array of `{ name: erpName, progress: calculatedProgress, url: sheet.url }` for each ERP column.
    6.  Uses `Promise.all` to fetch and process sheets concurrently.
    7.  Flattens the results array (as pipeline mode returns an array per sheet).

## 3. Data Structures (`src/lib/types.ts`)

Key TypeScript types used in the application:

*   **`ERPInput`**: Represents the raw data structure parsed from the main Google Sheet CSV.
*   **`ERP`**: Represents the structured and cleaned ERP data used within the application. Contains fields like `id`, `name`, `companies` (array), `status`, `currentStatus` (array), `nextSteps` (array), etc.
*   **`CsvSheet`**: Defines the structure for objects in `src/data/*.json` files (`{ name: string, csvUrl: string, url: string }`).
*   **`SheetPercentage`**: Structure for progress results in "normal" mode (`{ name: string, progress: number, url: string }`).
*   **`PipelineProgress`**: Structure for progress results in "pipeline" mode (`{ erpName: string, progress: number, url: string }`).

*(Refer to `src/lib/types.ts` for the full definitions)*

## 4. Components

*   **`DashboardSection`**: Renders the main dashboard view with progress bars for Pipeline, Onboarded, and Outsourcing sections using data passed as props. Likely uses `PipelineComponent` and `ProgressBar`.
*   **`FinancialDashboard`**: Renders the financial status view. Logic and data source might be within this component or fetched/passed similarly to the main dashboard. Uses `src/lib/financialDashboardData.ts`.
*   **`ERPCard`**: Displays information for a single ERP entity. Receives an `ERP` object as a prop. Likely links to the detail page (`/erp/[id]`).
*   **`PipelineComponent`**: Specifically renders the progress display for the "pipeline" category.
*   **`ProgressBar`**: A reusable component to display a percentage progress bar.
*   **`Loader` / `LoadingExp`**: Loading indicators shown during data fetching.
*   **`Footer`**: Application footer.
*   **`BackToHome`**: A component likely used on detail pages to navigate back.
*   **UI Components (`src/components/ui/`)**: Components like `Card`, `Chart` potentially from a library like Shadcn/ui, used for styling and layout.

## 5. Environment Variables (`.env.local`)

The application relies on several environment variables defined in `.env.local`:

*   `NEXT_PUBLIC_API_URL`: The base URL for the application (used for API calls from the client).
*   `MAIN_SHEET_ID`: The Google Sheet ID for the main ERP data source used by `fetchGoogleSheetData`.
*   `NEXT_PUBLIC_PIPELINE_CSV_ID`: The Google Sheet ID used for constructing pipeline progress CSV URLs.
*   `NEXT_PUBLIC_PIPELINE_LIVE_ID`: The Google Sheet ID used for constructing pipeline live view URLs.
*   `NEXT_PUBLIC_NORMAL_CSV_ID`: The Google Sheet ID used for constructing onboarded and outsourcing progress CSV URLs.
*   `NEXT_PUBLIC_NORMAL_LIVE_ID`: The Google Sheet ID used for constructing onboarded and outsourcing live view URLs.

**Note:** `.env.local` should not be committed to version control. Ensure these variables are set correctly in the deployment environment.

## 6. Potential Areas for Improvement/Review

*   **Error Handling:** Review error handling in `fetch` calls and data parsing (`papaparse`) to ensure robustness and provide user feedback.
*   **API Security:** If the Google Sheets contain sensitive data, consider securing the API endpoint and the sheet access. Using CSV export URLs makes the data publicly accessible if the URL is known. Service accounts or OAuth could be more secure alternatives if feasible.
*   **`[id]` Routes:** Verify the implementation and usage of `/api/erps/[id]/route.ts` and `/app/erp/[id]/page.tsx` if they are intended to be used.
*   **State Management:** For larger applications, consider a more robust state management library (like Zustand, Redux Toolkit, or Jotai) instead of relying solely on `useState` and prop drilling, although the current approach might be sufficient.
*   **Code Duplication:** Check for potential duplication in data fetching or processing logic, especially within the `useEffect` hooks in `page.tsx`.
*   **"Normal" Mode Calculation:** The reliance on a specific cell (P2) for progress in "normal" mode is brittle. If the sheet structure changes, this will break. A more robust method (like a dedicated summary row/column or a different calculation logic) might be better.
