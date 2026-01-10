# Appraisal Review Tool

This project is a comprehensive React-based application designed for reviewing real estate appraisal reports. It facilitates the extraction, validation, and analysis of appraisal data from PDF and HTML files, ensuring compliance with various standards (USPAP, Fannie Mae, FHA, etc.) and consistency across the report.

## Project Structure

The core logic resides within `src/components/Subject/`.

```text
src/
├── components/
│   └── Subject/
│       ├── Subject.js              # Main container, state management, API orchestration
│       ├── Sidebar.js              # Navigation sidebar for report sections
│       ├── dialogs.js              # Modal components (Contract Comparison, Revision Language, Notepad)
│       ├── revisionPrompts.js      # Pre-defined text templates for revision requests
│       ├── tables.js               # Components for rendering data tables (Sales Grid, etc.)
│       ├── utils.js                # Utility functions (formatting, styles)
│       ├── FormComponents.js       # Reusable UI inputs (EditableField, GridInfoCard)
│       ├── PromptAnalysis.js       # AI-driven analysis component
│       │
│       ├── forms/                  # Form-specific rendering logic
│       │   ├── 1004.js             # URAR Form
│       │   ├── 1073.js             # Condo Form
│       │   ├── 1007.js             # Rent Schedule
│       │   └── 1025.js             # Multi-family Form
│       │
│       ├── validation/             # Validation logic modules
│       │   ├── generalValidation.js
│       │   ├── contractValidation.js
│       │   ├── subjectValidation.js
│       │   ├── siteValidation.js
│       │   ├── neighborhoodValidation.js
│       │   ├── improvementsValidation.js
│       │   ├── salesComparisonValidation.js
│       │   ├── reconciliationValidation.js
│       │   ├── rentScheduleValidation.js
│       │   └── appraiserLenderValidation.js
│       │
│       └── checks/                 # Compliance check components
│           ├── StateRequirementCheck.js
│           ├── FhaCheck.js
│           ├── ADUCheck.js
│           ├── ClientRequirementCheck.js
│           ├── UnpaidOkCheck.js
│           └── EscalationCheck.js
│
└── theme.js                        # MUI Theme configuration (Light/Dark)
```

## Features

### 1. File Upload & Data Extraction
*   **PDF Upload**: Upload appraisal reports (PDF) for automated data extraction via a Python-based backend API.
*   **HTML Upload**: Upload HTML versions of reports for data comparison.
*   **Contract & Engagement Letter**: Upload contract copies and engagement letters for cross-referencing.
*   **Automated Extraction**: Utilizes `fetch` calls to `https://strdjrbservices1.pythonanywhere.com/api/extract/` to parse documents.

### 2. Form Support
Supports various appraisal form types, dynamically rendering fields based on selection:
*   **1004** (Uniform Residential Appraisal Report)
*   **1073** (Individual Condominium Unit Appraisal Report)
*   **1007** (Single Family Comparable Rent Schedule)
*   **1025** (Small Residential Income Property Appraisal Report)
*   And others (1004C, 1004D, 2055, etc.)

### 3. Comprehensive Validation
The application performs extensive validation checks across different sections of the appraisal report using specialized validation modules:
*   **Subject**: Address consistency, tax info, HOA details.
*   **Contract**: Price matching, date consistency, financial assistance checks.
*   **Neighborhood**: Boundaries, housing trends, land use.
*   **Site**: Zoning compliance, utilities, FEMA flood data.
*   **Improvements**: Property condition, room counts, amenities.
*   **Sales Comparison**: Adjustment consistency, proximity, data sources.
*   **Reconciliation**: Final value consistency, cost approach checks.

### 4. Review Tools
*   **Revision Language Generator**: Quickly generate standard revision requests for common errors (e.g., missing address suffix, incorrect zoning) using templates from `revisionPrompts.js`.
*   **Notepad**: Built-in notepad for taking notes during the review process, savable as a text file.
*   **Comparison Dialogs**: Visual tools to compare extracted data against PDF/HTML sources.
*   **Prompt Analysis**: AI-driven analysis of specific sections using custom prompts.
*   **Requirement Checks**: Specific modules for checking State, FHA, ADU, and Client-specific requirements.

### 5. Reporting
*   **PDF Summary**: Generate a summary PDF of the review using `jspdf` and `jspdf-autotable`, including validation errors and extracted data.
*   **Validation Log**: Create a detailed log of validation errors and successes.
*   **Save to Database**: Persist review data to a backend database for record-keeping.

## Technical Stack
*   **Frontend**: React.js
*   **UI Framework**: Material UI (MUI)
*   **PDF Generation**: jsPDF, jspdf-autotable
*   **Styling**: CSS, MUI Theming (Light/Dark mode)
*   **State Management**: React `useState`, `useEffect`, `useRef`.

## Component Description

### Core Components
*   **`Subject.js`**: The central hub of the application. It manages the global state (extracted data, user inputs, UI state), handles file uploads, coordinates API communication for extraction and saving, executes validation logic, and dynamically renders the selected form component.
*   **`Sidebar.js`**: A navigation component that allows users to jump between different sections of the report (e.g., Subject, Contract, Sales Comparison). It also visualizes the extraction status of each section.
*   **`FormComponents.js`**: Contains reusable UI building blocks like `EditableField` (for data entry with validation feedback) and `GridInfoCard` (for displaying grouped data).

### Dialogs & Modals
*   **`dialogs.js`**: Houses various modal components:
    *   `ContractComparisonDialog`: Compares extracted contract data with the uploaded contract file.
    *   `RevisionLanguageDialog`: Provides a searchable list of pre-defined revision requests to copy to the clipboard or notepad.
    *   `NotepadDialog`: A simple text editor for reviewer notes.
*   **`revisionPrompts.js`**: A configuration file containing categorized arrays of string templates used by the `RevisionLanguageDialog`.

### Form Renderers (`forms/`)
*   **`1004.js`, `1073.js`, `1007.js`, `1025.js`**: These components are responsible for rendering the specific layout and fields associated with each appraisal form type. They utilize `FormComponents` to display data passed down from `Subject.js`.

### Validation & Logic (`validation/`)
*   **`*Validation.js`**: A suite of modules (e.g., `contractValidation.js`, `salesComparisonValidation.js`) containing pure functions that take data inputs and return validation errors or warnings. This separates business logic from UI concerns.

### Compliance Checks (`checks/`)
*   **`StateRequirementCheck.js`, `FhaCheck.js`, etc.**: Specialized components that trigger specific API calls to validate compliance with external guidelines (State laws, FHA handbooks, Client requirements). They display results in a modal.

### Utilities
*   **`tables.js`**: Components designed to render complex grid structures, such as the Sales Comparison Approach grid or Rent Schedule.
*   **`utils.js`**: Helper functions for formatting currency, dates, and managing dynamic styles.
*   **`PromptAnalysis.js`**: An interface for sending custom prompts to the backend AI for ad-hoc analysis of the report content.

## Usage

1.  **Select Form Type**: Choose the appropriate appraisal form (e.g., 1004) from the dropdown.
2.  **Upload File**: Click "Select PDF File" to upload the appraisal report.
3.  **Review & Edit**: 
    *   Navigate through sections (Subject, Neighborhood, etc.) using the sidebar.
    *   Review extracted data in the form fields.
    *   Make corrections using the editable fields if extraction was inaccurate.
4.  **Validate**: 
    *   The system automatically runs validation rules.
    *   Use the "Check" buttons (e.g., State Requirements, FHA) for specific compliance checks.
5.  **Generate Report**: 
    *   Click "Generate PDF" for a summary.
    *   Click "Generate Validation Log" for a detailed error report.
    *   Click "Save to DB" to store the review.

## Configuration

The application connects to a backend API (configured in `Subject.js`) for data extraction and saving reports. Ensure the API endpoint `https://strdjrbservices1.pythonanywhere.com/api/` is accessible.