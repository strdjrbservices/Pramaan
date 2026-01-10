# Appraisal Review Tool: An Automated System for Real Estate Appraisal Report Analysis

**Development Team**

*Software Engineering Department*

## Abstract
This document presents the technical architecture and functional capabilities of the Appraisal Review Tool, a sophisticated web-based application developed to automate the quality control and review of real estate appraisal reports. In an industry characterized by stringent regulatory standards and varying lender-specific requirements, manual review processes are often inefficient and susceptible to oversight. This project leverages a React.js frontend and a Python-based backend to facilitate the ingestion, parsing, and validation of appraisal data from PDF and HTML formats. A distinguishing feature of the system is its granular compliance engine, which supports not only standard industry forms (e.g., 1004, 1073) but also intricate client-specific overlays for lenders such as Visio Lending and Ice Lender Holdings. By integrating automated data extraction with rule-based validation and AI-driven narrative analysis, the tool significantly enhances the accuracy, consistency, and speed of the appraisal review workflow.
 

**Keywords:** Real Estate Appraisal, Automated Review, Data Extraction, React.js, PDF Parsing, Validation Logic.

## 1. Introduction
The real estate appraisal industry relies heavily on accurate and compliant reporting. Manual review of appraisal reports (forms 1004, 1073, etc.) is time-consuming and prone to human error. The Appraisal Review Tool addresses these challenges by providing an automated solution for ingesting appraisal documents, extracting relevant data fields, and performing rigorous validation checks.

The application supports various form types and includes tools for contract analysis, revision language generation, and compliance verification against state and client-specific requirements. The document file structure is organized to support scalability and maintainability.

## 2. System Architecture
The application is built using a modern web technology stack, ensuring responsiveness and scalability.

*   **Frontend:** React.js is used for the user interface, providing a dynamic and interactive experience.
*   **UI Framework:** Material UI (MUI) ensures a consistent and accessible design system, supporting both light and dark modes.
*   **Data Processing:** The system utilizes `fetch` APIs to communicate with a Python-based backend (hosted at `https://strdjrbservices1.pythonanywhere.com/`) for heavy-lifting tasks such as PDF parsing and data extraction. The backend processes the raw documents and returns structured JSON data.
*   **PDF Generation:** `jsPDF` and `jspdf-autotable` are employed to generate summary reports and validation logs directly from the browser.

## 3. Literature Survey

### 3.1 Overview of Existing Appraisal Review Systems
The landscape of appraisal review technology is currently dominated by two categories of solutions: general-purpose document processing tools and specialized Loan Origination Systems (LOS). General-purpose tools often utilize standard Optical Character Recognition (OCR) to convert PDF documents into text, but they lack the domain-specific ontology required to understand the complex relationships between appraisal data points (e.g., the correlation between "Condition" ratings in the sales grid and the improvements section). Specialized LOS platforms offer more structure but are often rigid, requiring appraisers to submit data in specific XML formats (like MISMO XML) rather than processing the final PDF report that the underwriter reviews.

### 3.2 Manual Appraisal Review Process
Despite technological advancements, a significant portion of appraisal review remains manual. Reviewers, often working for Appraisal Management Companies (AMCs) or lenders, must visually inspect 30+ page PDF reports. This process involves:
*   Verifying adherence to the Uniform Standards of Professional Appraisal Practice (USPAP).
*   Checking compliance with GSE guidelines (Fannie Mae/Freddie Mac).
*   Cross-referencing data across different sections (e.g., ensuring the sketch GLA matches the sales grid).
*   Validating mathematical calculations for adjustments.
*   Enforcing client-specific "overlays" or requirements (e.g., specific photo labeling or comment requirements).
This manual workflow is labor-intensive, difficult to scale, and susceptible to human error, particularly due to fatigue from reviewing repetitive forms.

### 3.3 Limitations of Existing Systems
Current automated solutions face several limitations:
*   **Contextual Blindness:** Most systems cannot interpret narrative addenda or explain *why* a value is incorrect, only that it doesn't match a rule.
*   **Rigidity:** Hard-coded validation rules make it difficult to adapt to changing lender requirements without significant code refactoring.
*   **Format Dependency:** Many tools fail when processing non-standard PDFs or scanned images, requiring the original XML data file which may not always match the visual PDF.
*   **Lack of Client Specificity:** Few systems can dynamically apply different validation rulesets based on the specific lender client identified in the report.

### 3.4 Automation and AI in Real Estate Applications
Recent advancements in Artificial Intelligence (AI) and Large Language Models (LLMs) present new opportunities for real estate technology (PropTech). While AI has been extensively applied to Automated Valuation Models (AVMs) to estimate property prices, its application in *quality control* and *compliance review* is less mature. By leveraging LLMs, systems can now "read" and "understand" the unstructured narrative portions of an appraisal report (e.g., neighborhood market conditions, condition descriptions). This project integrates these capabilities, using AI not just for extraction, but for semantic analysis—verifying that the appraiser's commentary logically supports their value conclusion.

## 4. System Analysis

### 4.1 Existing System
The existing system for appraisal review typically involves a manual, linear process. Reviewers receive a PDF report and a set of guidelines (USPAP, GSE, Lender Overlays). They visually scan the document, checking for completeness, consistency, and compliance. Some organizations may use basic OCR tools to convert PDFs to text, but these often lack the contextual awareness to validate complex appraisal logic (e.g., ensuring adjustments in the Sales Grid match the condition ratings in the Improvements section).

### 4.2 Drawbacks of the Existing System
*   **Inefficiency:** Manual review is slow, limiting the number of reports a reviewer can process daily.
*   **Error-Prone:** Human reviewers can suffer from fatigue, leading to missed errors or inconsistencies, especially in large reports (30+ pages).
*   **Inconsistency:** Different reviewers may interpret guidelines differently, leading to inconsistent review quality.
*   **Scalability Issues:** Scaling operations requires hiring more qualified reviewers, which is costly and time-consuming.
*   **Complexity Management:** Keeping track of constantly changing lender-specific "overlays" (e.g., Visio Lending vs. BPL Mortgage requirements) is difficult manually.

### 4.3 Proposed System
The proposed "Appraisal Review Tool" is an automated, web-based solution designed to augment the reviewer's capabilities. It ingests the appraisal report (PDF/HTML), automatically extracts data into a structured format, and runs it against a comprehensive rules engine. The system includes specific modules for different form types (1004, 1073, etc.) and integrates client-specific compliance checks. It also features AI-driven analysis for narrative sections and tools for generating revision requests.

### 4.4 Advantages of the Proposed System
*   **Speed:** Automated extraction and validation significantly reduce the time per review.
*   **Accuracy:** Rule-based validation ensures mathematical accuracy and data consistency across the report.
*   **Standardization:** The system applies the same rigorous checks to every report, ensuring consistent quality.
*   **Client Compliance:** Dedicated modules for lender overlays ensure that specific client requirements are met automatically.
*   **User Experience:** The React-based UI provides a structured, interactive view of the data, with visual cues (colors, tooltips) highlighting potential issues.

### 4.5 Feasibility Study

#### 4.5.1 Technical Feasibility
The project is technically feasible, utilizing a robust stack: React.js for a responsive frontend, Python for powerful backend processing (PDF parsing), and established libraries like `jspdf` for report generation. The modular component structure (e.g., `Subject.js`, `FormComponents.js`) supports maintainability and future expansion.

#### 4.5.2 Economic Feasibility
The system offers high economic feasibility by reducing the operational costs associated with manual review. By increasing the throughput of reviewers and reducing the rate of error-related revisions or repurchases, the return on investment (ROI) is significant. The use of open-source technologies also minimizes licensing costs.

#### 4.5.3 Operational Feasibility
The tool is designed to fit seamlessly into existing workflows. It does not replace the appraiser but acts as a powerful assistant. The intuitive interface (Sidebar, Editable Fields) ensures a low learning curve for users familiar with appraisal forms. The system's ability to generate revision language (`revisionPrompts.js`) directly aids the operational workflow of communicating with appraisers.

## 5. System Requirements Specification (SRS)

### 5.1 Hardware Requirements
The Appraisal Review Tool is a web-based application, meaning the client-side hardware requirements are minimal, primarily dictated by the web browser's needs. However, for optimal performance when reviewing large PDF documents:
*   **Processor:** Modern multi-core processor (Intel Core i5 or equivalent).
*   **RAM:** 8GB or higher is recommended to handle memory-intensive PDF rendering and data grids.
*   **Display:** A minimum resolution of 1920x1080 is recommended to view the sidebar, data grid, and PDF comparison tools simultaneously.
*   **Network:** A stable broadband internet connection is required for uploading documents and communicating with the backend API.

### 5.2 Software Requirements
*   **Client Side:**
    *   **Operating System:** Windows 10/11, macOS, or Linux.
    *   **Web Browser:** Latest versions of Google Chrome, Mozilla Firefox, Microsoft Edge, or Safari.
    *   **PDF Viewer:** While the tool renders data, a standard PDF viewer (Adobe Acrobat Reader) is useful for verifying original documents.
*   **Server Side (Backend):**
    *   **Runtime Environment:** Python 3.8+.
    *   **Hosting:** PythonAnywhere (or compatible cloud provider).
    *   **Dependencies:** `flask`, `pdfplumber` (or equivalent PDF parsing libraries), `google-generativeai` (for LLM integration).
*   **Development Environment:**
    *   **Node.js:** Version 14.x or higher for React frontend development.
    *   **Package Manager:** npm or yarn.

### 5.3 Functional Requirements
1.  **File Ingestion:** The system must allow users to upload appraisal reports in PDF format and data files in HTML format.
2.  **Data Extraction:** The system must automatically parse the uploaded documents and map the data to the corresponding fields in the application state.
3.  **Form Support:** The system must support standard appraisal forms including 1004, 1073, 1007, and 1025.
4.  **Validation:** The system must perform real-time validation of data fields based on logical rules (e.g., math checks) and compliance standards (USPAP, FHA).
5.  **Client Compliance:** The system must allow users to run specific compliance checks for different lenders (e.g., Visio, Ice Lender Holdings).
6.  **Reporting:** The system must generate downloadable PDF reports summarizing the review findings and validation errors.
7.  **Revision Management:** The system must provide a library of pre-written revision comments that users can copy or add to a notepad.

### 5.4 Non-Functional Requirements
1.  **Performance:** The document extraction process should complete within 60 seconds for a standard 30-page appraisal report.
2.  **Scalability:** The architecture must allow for the addition of new form types and validation rules without modifying the core application logic.
3.  **Usability:** The user interface must support efficient navigation through large datasets, utilizing a sidebar and collapsible sections.
4.  **Reliability:** The system must handle parsing errors gracefully, alerting the user to specific fields that could not be extracted rather than crashing.
5.  **Maintainability:** The code must be modular, separating UI components from validation logic and API interaction.

## 6. System Design

### 6.1 Architectural Design
The Appraisal Review Tool utilizes a decoupled client-server architecture, facilitating independent scaling and maintenance of the frontend and backend components.
*   **Client-Side (Frontend):** A React.js Single Page Application (SPA) responsible for the user interface, state management, and interactive validation. It communicates with the backend via RESTful HTTP requests.
*   **Server-Side (Backend):** A Python-based application hosted on PythonAnywhere. It exposes API endpoints for document processing, utilizing libraries for PDF parsing and AI integration.
*   **Database:** A relational database stores user profiles, review logs, and saved report data.

### 6.2 Data Flow Diagram (DFD)
The data flow within the system can be summarized as follows:
1.  **Input:** The Reviewer uploads a PDF appraisal report and optional HTML data files.
2.  **Processing:** The Frontend sends the file to the Backend API. The Backend parses the file, extracting text and form data.
3.  **State Update:** The extracted data is returned as JSON and populates the Frontend's application state.
4.  **Validation:** The Frontend runs validation logic against the state, flagging errors.
5.  **Output:** The Reviewer generates a PDF summary or saves the review session to the database.

### 6.3 Use Case Diagram
**Actors:** Appraisal Reviewer, System Admin.
**Key Use Cases:**
*   **Upload Report:** Reviewer uploads PDF/HTML files.
*   **Extract Data:** System parses documents.
*   **Validate Compliance:** System checks against USPAP/Lender rules.
*   **Generate Revisions:** Reviewer selects pre-defined revision language.
*   **Export Summary:** System generates a PDF log of errors.

### 6.4 Sequence Diagram
**Scenario: Report Extraction**
1.  **Reviewer** selects a PDF file and clicks "Upload".
2.  **Frontend** sends a `POST /api/extract/` request with the file payload.
3.  **Backend** receives the request and initiates the PDF Parser.
4.  **Parser** extracts text and identifies form fields.
5.  **Backend** formats the extracted data into a JSON object.
6.  **Backend** sends the JSON response to the **Frontend**.
7.  **Frontend** updates the application state and renders the data grid.

### 6.5 Database Design
The system utilizes a schema designed to store report metadata and the structured review content.
*   **Users Table:** Stores authentication details (ID, Username, Role).
*   **Reports Table:** Stores metadata for uploaded reports (ID, Filename, Upload Date, Status).
*   **ReviewData Table:** Stores the JSON blob of the extracted and edited appraisal data, linked to the Reports table.

### 6.6 ER Diagram
*   **User** (1) ---- (N) **Reports**
*   **Report** (1) ---- (1) **ReviewData**

## 7. System Architecture

### 7.1 Frontend Architecture (React.js)
The frontend is constructed as a Single Page Application (SPA) using **React.js**, facilitating a reactive user interface.
*   **Component Hierarchy:** The application is structured around a main controller (`Subject.js`) which orchestrates child components like `Sidebar.js` for navigation and form-specific renderers (e.g., `1004.js`).
*   **UI Framework:** **Material UI (MUI)** is utilized for its robust component library, providing theming support (light/dark modes) and responsive layout grids.
*   **State Management:** React Hooks (`useState`, `useEffect`) manage the application state, handling file uploads, data extraction status, and validation errors.
*   **PDF Generation:** Client-side libraries `jsPDF` and `jspdf-autotable` allow for the instant generation of summary PDFs without server round-trips.

### 7.2 Backend Architecture (Python API)
The backend is a Python-based service hosted on PythonAnywhere, acting as the data processing engine.
*   **API Layer:** Exposes RESTful endpoints (e.g., `/api/extract/`, `/api/save-report/`) to handle client requests.
*   **Data Processing:** Utilizes libraries such as `pdfplumber` for extracting text and form fields from PDF documents.
*   **AI Service:** Integrates with LLMs (e.g., via `google-generativeai`) to process natural language prompts for narrative analysis.
*   **Comparison Engine:** Implements logic to compare extracted PDF data against HTML data streams or contract documents.

### 7.3 Integration Architecture
The system employs a decoupled architecture where the frontend and backend communicate via HTTP/HTTPS.
*   **Data Exchange:** **JSON** is used as the standard data interchange format.
*   **Asynchronous Operations:** The frontend uses `async/await` patterns with the `fetch` API to handle long-running extraction processes without blocking the UI.
*   **File Transfer:** `FormData` is used to upload multipart/form-data (PDFs) to the backend for processing.

### 7.4 Security Architecture
*   **Transport Security:** All data transmission between the client and server is secured using **HTTPS**.
*   **Input Validation:** The frontend performs extensive validation (e.g., `EditableField` components) to ensure data integrity before submission.
*   **Audit Trails:** User actions and review sessions are logged with usernames (retrieved from local storage) to maintain an audit trail of appraisal reviews.

## 8. Module Description

### 8.1 User Interface Module
This module serves as the primary interaction point for the reviewer. Built with React.js and Material UI, it provides a responsive and accessible layout. Key responsibilities include rendering the sidebar for navigation, displaying extracted data in editable grids, and managing the application's visual state (light/dark mode). It ensures a seamless user experience by providing real-time feedback through notifications and visual validation cues.

### 8.2 File Upload and Document Ingestion Module
This module handles the secure transfer of appraisal documents from the client to the server. It supports multiple file formats (PDF, HTML, XML) and performs initial validation to ensure file integrity. It manages the state of file inputs for the main report, contract, and engagement letters, triggering the extraction pipeline upon successful upload.

### 8.3 Data Extraction and Parsing Module
Operating on the backend, this module is the system's ingestion engine. It utilizes advanced parsing libraries to deconstruct PDF documents, identifying form fields, checkboxes, and narrative text. It normalizes this unstructured data into a standardized JSON schema, handling the specific layout idiosyncrasies of different appraisal forms (1004, 1073, 1025, etc.).

### 8.4 Validation and Compliance Engine
This is the core intelligence of the system. It consists of a registry of validation rules that check for:
*   **Mathematical Accuracy:** Verifying adjustments and totals in the Sales Comparison Approach.
*   **Internal Consistency:** Ensuring data points like room counts and GLA match across different sections (e.g., Sketch vs. Grid).
*   **Regulatory Compliance:** Checking against USPAP, FHA, and State-specific guidelines.
*   **Client Overlays:** Applying specific rule sets for lenders like Visio and Ice Lender Holdings.

### 8.5 AI-Based Narrative Analysis Module
This module integrates Large Language Models (LLMs) to analyze the qualitative aspects of the report. It processes natural language queries to verify that the appraiser's commentary adequately explains complex issues, such as condition ratings, market trends, or zoning compliance, which rule-based logic cannot easily validate.

### 8.6 Revision Language Generator
To streamline the correction process, this module provides a repository of pre-approved revision requests. It allows reviewers to quickly generate professional and specific comments for common errors (e.g., "Please bracket the final value," "Clarify zoning description"), reducing the time spent drafting emails.

### 8.7 Reporting and PDF Generation Module
This module compiles the review findings into a formal document. Using client-side PDF generation libraries, it creates a "Validation Log" or "Review Summary" that lists all identified errors, warnings, and successful validations. This report serves as a tangible record of the quality control process.

## 9. Implementation

### 9.1 Frontend Implementation
The frontend is implemented using **React.js**, leveraging functional components and hooks for state management. The core logic is encapsulated within the `Subject.js` component, which serves as the primary controller. It manages the application state, including the extracted appraisal data, user inputs, and UI states (loading, notifications).
*   **Component Structure:** The UI is decomposed into smaller, reusable components such as `Sidebar`, `EditableField`, and `GridInfoCard` to maintain code readability and reusability.
*   **State Management:** `useState` is used for local state (e.g., form data, active section), while `useEffect` handles side effects like data fetching and DOM manipulation.
*   **Styling:** **Material UI (MUI)** provides the theming and layout components, ensuring a responsive design that adapts to different screen sizes.

### 9.2 Backend Implementation
The backend is developed in **Python**, hosted on the PythonAnywhere platform. It exposes RESTful API endpoints to handle document processing tasks that are computationally intensive for the client-side.
*   **PDF Processing:** The backend utilizes libraries like `pdfplumber` to parse PDF documents, extracting text and identifying form fields based on spatial coordinates.
*   **AI Integration:** It integrates with Google's Generative AI to process natural language prompts, enabling the "Prompt Analysis" feature which interprets narrative sections of the appraisal report.
*   **Data Normalization:** The backend processes raw extracted data into a structured JSON format that matches the frontend's state schema.

### 9.3 API Integration
Communication between the frontend and backend is established via HTTP requests using the browser's `fetch` API.
*   **Data Transmission:** File uploads are handled using `FormData` objects to send multipart/form-data requests to the `/api/extract/` endpoint.
*   **Asynchronous Handling:** The frontend employs `async/await` syntax to handle asynchronous API calls, ensuring the UI remains responsive during long-running extraction processes. Loading indicators (`CircularProgress`, `LinearProgress`) provide real-time feedback to the user.
*   **Error Handling:** Robust error handling is implemented to catch network errors or server-side exceptions, displaying user-friendly notifications via the `Snackbar` component.

### 9.4 Database Implementation
The system includes a persistence layer to save review sessions.
*   **Data Storage:** The `/api/save-report/` endpoint receives the complete state object, including extracted data, user edits, and analysis results.
*   **Schema:** The database schema is designed to store report metadata (filename, upload time, user) alongside the structured JSON blob of the appraisal data. This allows for the retrieval and resumption of review sessions.

## 10. Testing

### 10.1 Testing Strategy
The testing strategy adopts a multi-layered approach, ensuring quality at the component, integration, and system levels. Given the critical nature of appraisal data accuracy, automated validation rules are rigorously tested against known edge cases. The strategy emphasizes regression testing to ensure new validation rules do not break existing functionality.

### 10.2 Unit Testing
*   **Frontend Components:** React components are tested for rendering correctness and state updates.
*   **Validation Logic:** The core validation functions (e.g., `checkZoning`, `checkMath`) located in `src/components/Subject/validation/` are unit tested with various input scenarios (valid, invalid, boundary values) to ensure they return the correct error or success messages.

### 10.3 Integration Testing
*   **API Integration:** Tests verify the communication between the React frontend and the Python backend. This includes checking that file uploads trigger the correct extraction endpoints and that the returned JSON data is correctly mapped to the frontend state.
*   **Cross-Component Data Flow:** Verifying that updates in the `Subject` component correctly propagate to child components like `SalesComparisonSection` and `Form1004`.

### 10.4 System Testing
*   **End-to-End Workflows:** Simulating a complete user session: uploading a PDF, reviewing extracted data, triggering validation errors, correcting them, and generating the final PDF report.
*   **Browser Compatibility:** Testing the application across Chrome, Firefox, and Edge to ensure consistent UI rendering and functionality.

### 10.5 Test Cases and Results
*   **Case 1: Invalid Zoning:** Inputting "Illegal" in the Zoning field triggers a critical error. **Result: Pass.**
*   **Case 2: Math Discrepancy:** Modifying a comparable's sale price without updating the adjustment triggers a calculation warning. **Result: Pass.**
*   **Case 3: Client Overlay:** Selecting "Visio Lending" and leaving the report as "Subject To" triggers a specific client requirement error. **Result: Pass.**

## 11. Project Structure
The codebase is organized to separate concerns between UI components, logic, and data management. The core logic resides within the `src/components/Subject/` directory.

### 11.1 Core Components
*   **`Subject.js`**: Serves as the main container, managing state, file uploads, and API orchestration.
*   **`Sidebar.js`**: Provides navigation for jumping between report sections.
*   **`FormComponents.js`**: Contains reusable UI inputs like `EditableField` and `GridInfoCard`.
*   **`utils.js`**: Utility functions for formatting and UI helpers.
*   **`tables.js`**: Components for rendering complex data grids like the Sales Comparison Approach.

### 11.2 Form Renderers
Specific components handle the rendering of different appraisal form types:
*   `1004.js` (URAR Form)
*   `1073.js` (Condo Form)
*   `1007.js` (Rent Schedule)
*   `1025.js` (Multi-family Form)

### 11.3 Validation Logic
Validation logic is modularized in the `validation/` directory:
*   `contractValidation.js`
*   `salesComparisonValidation.js`
*   `subjectValidation.js`
*   `siteValidation.js`

## 12. Key Features

### 12.1 File Upload and Data Extraction
The system supports the upload of PDF appraisal reports, HTML data files, and contract documents. Upon upload, the system initiates an automated extraction process via the backend API, parsing the documents to populate the application's state.

### 12.2 Comprehensive Validation
Extensive validation logic is applied across all sections of the report. For example, the **Sales Comparison** module checks for adjustment consistency, proximity, and data source verification. The **Contract** module verifies price matching and date consistency.

### 12.3 Review Tools
To assist reviewers, the tool includes:
*   **Revision Language Generator:** Pre-defined templates for common revision requests (stored in `revisionPrompts.js`).
*   **Comparison Dialogs:** Visual diff tools for comparing extracted data against source documents (`dialogs.js`).
*   **Compliance Checks:** Modules for State, FHA, and ADU specific requirements (`StateRequirementCheck.js`, `FhaCheck.js`).

### 12.4 AI-Driven Analysis
The system incorporates an AI analysis feature (`PromptAnalysis.js`) that allows users to send custom prompts to the backend. This enables ad-hoc queries about the appraisal report's content, leveraging Large Language Models (LLMs) to interpret and validate narrative sections.

## 13. Implementation Details

### 13.1 State Management
The application utilizes React's `useState` and `useEffect` hooks for managing the application lifecycle. The central `data` state object in `Subject.js` holds the extracted appraisal information, which is propagated down to child components.

### 13.2 Validation Engine
The validation logic is decoupled from the UI. A `buildValidationRegistry` function maps specific form fields to arrays of validation functions (e.g., `checkZoning`, `checkConsistency`). When validation is triggered, the engine iterates through this registry, executing the relevant checks and aggregating errors or warnings.

## 14. Figures and Tables

### Table 1: File Structure Overview
| Directory/File | Description |
| :--- | :--- |
| `src/components/Subject/Subject.js` | Main controller component |
| `src/components/Subject/forms/` | Form-specific rendering logic |
| `src/components/Subject/validation/` | Validation logic modules |
| `src/components/Subject/checks/` | Compliance check components |
| `src/components/Subject/dialogs.js` | Modal components |
| `src/components/Subject/utils.js` | Utility functions |

### Table 2: Supported Form Types
| Form Number | Description |
| :--- | :--- |
| 1004 | Uniform Residential Appraisal Report |
| 1073 | Individual Condominium Unit Appraisal Report |
| 1007 | Single Family Comparable Rent Schedule |
| 1025 | Small Residential Income Property Appraisal Report |

## 15. Usage and Workflow
The typical workflow involves selecting the appropriate form type (e.g., 1004), uploading the PDF report, and navigating through the sections via the sidebar. The user reviews the extracted data, aided by visual validation cues. Specific compliance checks (FHA, State) can be triggered on demand. Finally, the user can generate a PDF summary or validation log and save the review session to the database.

## 16. Conclusion
The Appraisal Review Tool represents a significant advancement in the efficiency of appraisal review processes. By automating data extraction and validation, it reduces the risk of errors and ensures compliance with industry standards. The modular architecture allows for easy extension to support new form types and validation rules in the future.

## 17. References
[1] React Documentation. https://reactjs.org/
[2] Material UI Documentation. https://mui.com/
[3] jsPDF Documentation. https://github.com/parallax/jsPDF
[4] Uniform Standards of Professional Appraisal Practice (USPAP).

---
Licensed under Creative Commons Attribution-ShareAlike 4.0 International License