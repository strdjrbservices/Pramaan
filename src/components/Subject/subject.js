import React, { useEffect, useMemo, useRef, useState } from 'react';
import './Subject.css';
import { GlobalStyles } from '@mui/system';
import {
  Info,
  Warning as WarningIcon,
  Close as CloseIcon,
  KeyboardArrowUp as KeyboardArrowUpIcon,
  KeyboardArrowDown as KeyboardArrowDownIcon,
  NoteAlt as NoteAltIcon,
  CloudUpload as CloudUploadIcon,
  Description as DescriptionIcon,
  Assignment as AssignmentIcon,
  PictureAsPdf as PictureAsPdfIcon,
  Save as SaveIcon,
  Assessment as AssessmentIcon,
  Remove as RemoveIcon,
  Home as HomeIcon,
  Gavel as GavelIcon,
  LocationCity as LocationCityIcon,
  Terrain as TerrainIcon,
  Analytics as AnalyticsIcon,
  MeetingRoom as MeetingRoomIcon,
  History as HistoryIcon,
  Build as BuildIcon,
  MonetizationOn as MonetizationOnIcon,
  CompareArrows as CompareArrowsIcon,
  RequestQuote as RequestQuoteIcon,
  TableChart as TableChartIcon,
  MergeType as MergeTypeIcon,
  Balance as BalanceIcon,
  Calculate as CalculateIcon,
  AttachMoney as AttachMoneyIcon,
  Domain as DomainIcon,
  TrendingUp as TrendingUpIcon,
  Business as BusinessIcon,
  VerifiedUser as VerifiedUserIcon,
  FactCheck as FactCheckIcon,
  Psychology as PsychologyIcon,
  Code as CodeIcon,
  Apartment as ApartmentIcon,
  FileDownload as FileDownloadIcon,
  DeleteForever as DeleteForeverIcon
} from '@mui/icons-material';
import VisibilityTwoToneIcon from '@mui/icons-material/VisibilityTwoTone';
import { Button, Stack, IconButton, Tooltip, Paper, Box, Typography, LinearProgress, Alert, Snackbar, Fade, CircularProgress, useTheme, CssBaseline, Dialog, DialogTitle, DialogContent, DialogActions, Grid, Fab, Autocomplete, TextField } from '@mui/material';
import jsPDF from 'jspdf';
import GetAppIcon from '@mui/icons-material/GetApp';
import autoTable from 'jspdf-autotable';
import Sidebar from './Sidebar.js';
import PromptAnalysis from './PromptAnalysis.js';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import {
  ContractComparisonDialog,
  RevisionLanguageDialog,
  NotepadDialog,
  EngagementLetterDialog,
} from './dialogs.js';
import { SalesComparisonSection, ComparisonResultTable } from './tables.js';
import { getComparisonStyle, playSound } from './utils.js';

import Form1004 from './1004';
import Form1007 from './1007';
import Form1073 from './1073';
import Form1025 from './1025';
import Form1004D from './1004D';
import { EditableField, GridInfoCard } from './FormComponents';
import StateRequirementCheck, { STATE_REQUIREMENTS_PROMPT } from './StateRequirementCheck';
import UnpaidOkCheck, { UNPAID_OK_PROMPT } from './UnpaidOkCheck';
import ClientRequirementCheck, { CLIENT_REQUIREMENT_PROMPT } from './ClientRequirementCheck';
import EscalationCheck, { ESCALATION_CHECK_PROMPT } from './EscalationCheck';
import FhaCheck, { FHA_REQUIREMENTS_PROMPT } from './FhaCheck';
import ADUCheck, { ADU_REQUIREMENTS_PROMPT } from './ADUCheck';

import * as contractValidation from './contractValidation';
import * as subjectValidation from './subjectValidation';
import * as siteValidation from './siteValidation';
import * as neighborhoodValidation from './neighborhoodValidation';
import * as improvementsValidation from './improvementsValidation';
import * as salesComparisonValidation from './salesComparisonValidation';
import * as reconciliationValidation from './reconciliationValidation';
import * as rentScheduleValidation from './rentScheduleValidation';
import * as appraiserLenderValidation from './appraiserLenderValidation';
import * as marketConditionsValidation from './marketConditionsValidation';
import * as form1073Validation from './form1073Validation';
import * as pudInformationValidation from './pudInformationValidation';
import * as unitDescriptionsValidation from './unitDescriptionsValidation';
import * as projectAnalysisValidation from './projectAnalysisValidation';
import * as projectSiteValidation from './projectSiteValidation';
import * as incomeApproachValidation from './incomeApproachValidation';
import * as priorSaleHistoryValidation from './priorSaleHistoryValidation';
import * as infoOfSalesValidation from './infoOfSalesValidation';

import PremiumLogo from './logo';
import { SUBJECT_REVISION_PROMPTS, CONTRACT_REVISION_PROMPTS, NEIGHBORHOOD_REVISION_PROMPTS, SITE_REVISION_PROMPTS, IMPROVEMENTS_REVISION_PROMPTS, SALES_GRID_REVISION_PROMPTS, RECONCILIATION_REVISION_PROMPTS, COST_APPROACH_REVISION_PROMPTS, CERTIFICATION_REVISION_PROMPTS, ADDENDUM_GENERAL_REVISION_PROMPTS, FORM_1007_REVISION_PROMPTS } from './revisionPrompts';
import { useThemeContext } from '../../context/ThemeContext';
import Footer from './Footer';

const TooltipStyles = () => (
  <GlobalStyles styles={{
    '.editable-field-container[style*="--tooltip-message"]': {
      position: 'relative',
      cursor: 'pointer',
    },
    '.editable-field-container[style*="--tooltip-message"]:hover::after': {
      content: 'var(--tooltip-message)',
      position: 'absolute',
      bottom: '100%',
      left: '50%',
      transform: 'translateX(-50%)',
      backgroundColor: '#864242ff',
      color: 'white',
      padding: '5px 10px',
      borderRadius: '4px',
      fontSize: '0.8rem',
      whiteSpace: 'nowrap',
      zIndex: 1000,
      marginBottom: '5px',
    },
    '@keyframes eyeBlink': {
      '5%, 100%': { transform: 'scaleY(1)' },
      '50%': { transform: 'scaleY(0.2)' },
    },
    '.animated-eye': {
      animation: 'eyeBlink 3s infinite',
    },
  }} />
);

const ComparisonDialog = ({ open, onClose, data, onDataChange, pdfFile, htmlFile, setComparisonData }) => {


  const [result, setResult] = useState(null);

  const handleCompare = React.useCallback(async () => {

    setResult(null);

    const formData = new FormData();
    if (pdfFile) formData.append('pdf_file', pdfFile);
    if (htmlFile) formData.append('html_file', htmlFile);

    try {
      const res = await fetch('https://strdjrbservices1.pythonanywhere.com/api/compare/', { method: 'POST', body: formData });
      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(errorText || 'PDF-HTML comparison failed.');
      }
      const apiResult = await res.json();
      setComparisonData(prev => ({ ...prev, ...apiResult }));
    } catch (err) {

    } finally {

    }
  }, [pdfFile, htmlFile, setComparisonData]);

  useEffect(() => {
    if (open && !result) {
      handleCompare();
    }
  }, [open, result, handleCompare]);


};

function Subject() {
  const { themeMode, toggleTheme: handleThemeChange } = useThemeContext();
  const activeTheme = useTheme();
  const [data, setData] = useState({});
  const [selectedFile, setSelectedFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState({ open: false, message: '', severity: 'info' });
  const [timer, setTimer] = useState(0);
  const [selectedFormType, setSelectedFormType] = useState('1004');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isSidebarLocked, setIsSidebarLocked] = useState(false);
  const [extractionAttempted, setExtractionAttempted] = useState(false);
  const [lastExtractionTime, setLastExtractionTime] = useState(null);
  const timerRef = useRef(null);
  const [isEditable, setIsEditable] = useState(true);
  const htmlFileInputRef = useRef(null);
  const contractFileInputRef = useRef(null);
  const engagementLetterFileInputRef = useRef(null);
  const fileInputRef = useRef(null);
  const sidebarLeaveTimerRef = useRef(null);
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  const [editingField, setEditingField] = useState(null);
  const [extractionProgress, setExtractionProgress] = useState(0);
  const [isComparisonDialogOpen, setIsComparisonDialogOpen] = useState(false);
  const [comparisonData, setComparisonData] = useState({});
  const [activeSection, setActiveSection] = useState(null);
  const [promptAnalysisLoading, setPromptAnalysisLoading] = useState(false);
  const [promptAnalysisResponse, setPromptAnalysisResponse] = useState(null);
  const [promptAnalysisError, setPromptAnalysisError] = useState('');
  const [submittedPrompt, setSubmittedPrompt] = useState('');
  const [fileUploadTimer, setFileUploadTimer] = useState(0);
  const [stateReqLoading, setStateReqLoading] = useState(false);
  const [stateReqResponse, setStateReqResponse] = useState(null);
  const [stateReqError, setStateReqError] = useState('');
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [unpaidOkLoading, setUnpaidOkLoading] = useState(false);
  const [unpaidOkResponse, setUnpaidOkResponse] = useState(null);
  const [unpaidOkError, setUnpaidOkError] = useState('');
  const [clientReqLoading, setClientReqLoading] = useState(false);
  const [clientReqResponse, setClientReqResponse] = useState(null);
  const [clientReqError, setClientReqError] = useState('');
  const [fhaLoading, setFhaLoading] = useState(false);
  const [fhaResponse, setFhaResponse] = useState(null);
  const [fhaError, setFhaError] = useState('');
  const [ADULoading, setADULoading] = useState(false);
  const [ADUResponse, setADUResponse] = useState(null);
  const [ADUError, setADUError] = useState('');
  const [escalationLoading, setEscalationLoading] = useState(false);
  const [escalationResponse, setEscalationResponse] = useState(null);
  const [escalationError, setEscalationError] = useState('');
  const [extractedSections, setExtractedSections] = useState(new Set());
  const [visibleSections, setVisibleSections] = useState(new Set());
  const [htmlFile, setHtmlFile] = useState(null);
  const [contractFile, setContractFile] = useState(null);
  const [engagementLetterFile, setEngagementLetterFile] = useState(null);
  const [username, setUsername] = useState('');
  const [loadingSection, setLoadingSection] = useState(null);

  const [manualValidations, setManualValidations] = useState({});

  const [isCheckModalOpen, setIsCheckModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState(null);

  const [isContractCompareOpen, setIsContractCompareOpen] = useState(false);
  const [contractCompareLoading, setContractCompareLoading] = useState(false);
  const [contractCompareResult, setContractCompareResult] = useState(null);
  const [contractCompareError, setContractCompareError] = useState('');

  const [isEngagementLetterDialogOpen, setIsEngagementLetterDialogOpen] = useState(false);
  const [engagementLetterCompareLoading, setEngagementLetterCompareLoading] = useState(false);
  const [engagementLetterCompareResult, setEngagementLetterCompareResult] = useState(null);
  const [engagementLetterCompareError, setEngagementLetterCompareError] = useState('');
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [isHtmlReviewLoading, setIsHtmlReviewLoading] = useState(false);
  const [htmlExtractionTimer, setHtmlExtractionTimer] = useState(0);
  const htmlExtractionTimerRef = useRef(null);
  const [isNotepadOpen, setIsNotepadOpen] = useState(false);
  const [notes, setNotes] = useState('');
  const [isRentFormTypeMismatchDialogOpen, setIsRentFormTypeMismatchDialogOpen] = useState(false);
  const [isContractPriceRevisionLangDialogOpen, setContractPriceRevisionLangDialogOpen] = useState(false);
  const [isFinancialAssistanceRevisionLangDialogOpen, setFinancialAssistanceRevisionLangDialogOpen] = useState(false);
  const [isDateOfContractRevisionLangDialogOpen, setDateOfContractRevisionLangDialogOpen] = useState(false);
  const [isNeighborhoodBoundariesRevisionLangDialogOpen, setNeighborhoodBoundariesRevisionLangDialogOpen] = useState(false);
  const [isOtherLandUseRevisionLangDialogOpen, setOtherLandUseRevisionLangDialogOpen] = useState(false);
  const [isZoningComplianceRevisionLangDialogOpen, setZoningComplianceRevisionLangDialogOpen] = useState(false);
  const [isAreaRevisionLangDialogOpen, setAreaRevisionLangDialogOpen] = useState(false);

  const [isFemaHazardRevisionLangDialogOpen, setFemaHazardRevisionLangDialogOpen] = useState(false);
  const [isRevisionLangDialogOpen, setRevisionLangDialogOpen] = useState(false);
  const [isContractRevisionLangDialogOpen, setContractRevisionLangDialogOpen] = useState(false);
  const [isNeighborhoodRevisionLangDialogOpen, setNeighborhoodRevisionLangDialogOpen] = useState(false);
  const [isSiteRevisionLangDialogOpen, setSiteRevisionLangDialogOpen] = useState(false);
  const [isImprovementsRevisionLangDialogOpen, setImprovementsRevisionLangDialogOpen] = useState(false);
  const [isSalesGridRevisionLangDialogOpen, setSalesGridRevisionLangDialogOpen] = useState(false);
  const [isReconciliationRevisionLangDialogOpen, setReconciliationRevisionLangDialogOpen] = useState(false);
  const [isCostApproachRevisionLangDialogOpen, setCostApproachRevisionLangDialogOpen] = useState(false);
  const [isCertificationRevisionLangDialogOpen, setCertificationRevisionLangDialogOpen] = useState(false);
  const [isAddendumRevisionLangDialogOpen, setAddendumRevisionLangDialogOpen] = useState(false);
  const [isPropertyAddressRevisionLangDialogOpen, setPropertyAddressRevisionLangDialogOpen] = useState(false);
  const [isLenderClientRevisionLangDialogOpen, setLenderClientRevisionLangDialogOpen] = useState(false);
  const [isHoaRevisionLangDialogOpen, setHoaRevisionLangDialogOpen] = useState(false);
  const [isonewithAccessoryUnitRevisionLangDialogOpen, setOneWithAccessoryUnitRevisionLangDialogOpen] = useState(false);
  const [isLenderClientAddressRevisionLangDialogOpen, setLenderClientAddressRevisionLangDialogOpen] = useState(false);
  const [is1007RevisionLangDialogOpen, set1007RevisionLangDialogOpen] = useState(false);

  const [isClearDialogOpen, setIsClearDialogOpen] = useState(false);
  const [isHtmlDataMinimized, setIsHtmlDataMinimized] = useState(false);
  const [isValidationSectionMinimized, setIsValidationSectionMinimized] = useState(false);
  const [pdfPreviewOpen, setPdfPreviewOpen] = useState(false);
  const [pdfPreviewUrl, setPdfPreviewUrl] = useState(null);
  const [isPdfMinimized, setIsPdfMinimized] = useState(false);
  const [pdfPosition, setPdfPosition] = useState({ x: 50, y: 50 });
  const isDraggingRef = useRef(false);
  const dragStartRef = useRef({ x: 0, y: 0 });

  const handleMouseDown = (e) => {
    isDraggingRef.current = true;
    dragStartRef.current = {
      x: e.clientX - pdfPosition.x,
      y: e.clientY - pdfPosition.y
    };
  };

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (isDraggingRef.current) {
        setPdfPosition({
          x: e.clientX - dragStartRef.current.x,
          y: e.clientY - dragStartRef.current.y
        });
      }
    };

    const handleMouseUp = () => {
      isDraggingRef.current = false;
    };

    if (pdfPreviewOpen) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [pdfPreviewOpen]);

  const handleOpenNotepad = () => {
    if (!notes) {
      const now = new Date();
      const dateTimeString = now.toLocaleString();
      setNotes(`Date and Time: ${dateTimeString}\n\n`);
    }
    setIsNotepadOpen(true);
  };

  const unpaidOkLenders = [
    'PRMG', 'Paramount Residential Mortgage Group',
    'CARDINAL FINANCIAL COMPANY',
    'Ice Lender Holdings LLC',
    'NP Inc', 'NQM Funding, LLC',
    'East Coast Capital',
    'Guaranteed Rate. Inc',
    'Commercial Lender, LLC',
    'LoanDepot.com',
    'Direct Lending Partners',
    'CIVIC',
    'CV3',
    'United Faith Mortgage',
    'Arixa Capital', 'Crosswind Financial', 'Western Alliance Bank',
    'RCN Capital, LLC',
    'Aura Mortgage Advisors, LLC', 'Blue Hub Capital',
    'Nations Direct Mortgage LLC',
    'Sierra Pacific Mortgage Company Inc',
    'Champions Funding LLC'
  ].map(l => l.toLowerCase());

  const isUnpaidOkLender = data['Lender/Client'] && unpaidOkLenders.some(lender => data['Lender/Client'].toLowerCase().includes(lender));

  const buildValidationRegistry = () => {
    const registry = {
      // Site Validations
      'Zoning Compliance': [siteValidation.checkZoning],
      'Zoning Description': [siteValidation.checkZoningDescription],
      'Specific Zoning Classification': [siteValidation.checkSpecificZoningClassification, neighborhoodValidation.checkSpecificZoningClassification],
      'Is the highest and best use of subject property as improved (or as proposed per plans and specifications) the present use?': [siteValidation.checkHighestAndBestUse],
      'FEMA Special Flood Hazard Area': [siteValidation.checkFemaInconsistency, siteValidation.checkFemaFieldsConsistency],
      'FEMA Flood Zone': [siteValidation.checkFemaInconsistency, siteValidation.checkFemaFieldsConsistency],
      'FEMA Map #': [siteValidation.checkFemaFieldsConsistency],
      'FEMA Map Date': [siteValidation.checkFemaFieldsConsistency],
      'Dimensions': [siteValidation.checkSiteSectionBlank],
      'Shape': [siteValidation.checkSiteSectionBlank],
      'View': [siteValidation.checkSiteSectionBlank],
      'Area': [siteValidation.checkArea],
      'Are the utilities and off-site improvements typical for the market area? If No, describe': [(field, text, data) => siteValidation.checkYesNoWithComment(field, text, data, { name: 'Are the utilities and off-site improvements typical for the market area? If No, describe', wantedValue: 'yes', unwantedValue: 'no' })],
      'Are there any adverse site conditions or external factors (easements, encroachments, environmental conditions, land uses, etc.)? If Yes, describe': [(field, text, data) => siteValidation.checkYesNoWithComment(field, text, data, { name: 'Are there any adverse site conditions or external factors (easements, encroachments, environmental conditions, land uses, etc.)? If Yes, describe', wantedValue: 'no', unwantedValue: 'yes' })],
      "Electricity": [siteValidation.checkUtilities], "Gas": [siteValidation.checkUtilities], "Water": [siteValidation.checkUtilities], "Sanitary Sewer": [siteValidation.checkUtilities], "Street": [siteValidation.checkUtilities], "Alley": [siteValidation.checkUtilities],

      // Subject Validations
      'Full Address': [subjectValidation.checkFullAddressConsistency, subjectValidation.checkSubjectFieldsNotBlank],
      'Exposure comment': [subjectValidation.checkPresence],
      'Prior service comment': [subjectValidation.checkPresence],
      'ADU File Check': [subjectValidation.checkPresence],
      'FHA Case No.': [subjectValidation.checkPresence],
      'Tax Year': [subjectValidation.checkTaxYear],
      'R.E. Taxes $': [subjectValidation.checkRETaxes],
      'Special Assessments $': [subjectValidation.checkSpecialAssessments],
      'PUD': [subjectValidation.checkPUD, subjectValidation.checkHOA],
      'HOA $': [subjectValidation.checkHOA],
      'Offered for Sale in Last 12 Months': [subjectValidation.checkOfferedForSale],
      'ANSI': [subjectValidation.checkAnsi],
      'Property Address': [subjectValidation.checkSubjectFieldsNotBlank, salesComparisonValidation.checkSubjectAddressInconsistency],
      'County': [subjectValidation.checkSubjectFieldsNotBlank],
      'Borrower': [subjectValidation.checkSubjectFieldsNotBlank],
      'Owner of Public Record': [subjectValidation.checkSubjectFieldsNotBlank],
      'Legal Description': [subjectValidation.checkSubjectFieldsNotBlank],
      "Assessor's Parcel #": [subjectValidation.checkSubjectFieldsNotBlank],
      'Neighborhood Name': [subjectValidation.checkSubjectFieldsNotBlank],
      'Map Reference': [subjectValidation.checkSubjectFieldsNotBlank],
      'Census Tract': [subjectValidation.checkSubjectFieldsNotBlank, subjectValidation.checkCensusTract],
      'Occupant': [subjectValidation.checkSubjectFieldsNotBlank],
      'Property Rights Appraised': [subjectValidation.checkSubjectFieldsNotBlank],
      'Lender/Client': [subjectValidation.checkSubjectFieldsNotBlank, appraiserLenderValidation.checkLenderNameInconsistency],
      'Address (Lender/Client)': [subjectValidation.checkSubjectFieldsNotBlank, appraiserLenderValidation.checkLenderAddressInconsistency],

      // Neighborhood Validations
      'one unit housing price(high,low,pred)': [neighborhoodValidation.checkHousingPriceAndAge, neighborhoodValidation.checkNeighborhoodFieldsNotBlank],
      'one unit housing age(high,low,pred)': [neighborhoodValidation.checkHousingPriceAndAge, neighborhoodValidation.checkNeighborhoodFieldsNotBlank],
      "One-Unit": [neighborhoodValidation.checkNeighborhoodUsageConsistency, neighborhoodValidation.checkNeighborhoodFieldsNotBlank],
      "2-4 Unit": [neighborhoodValidation.checkNeighborhoodUsageConsistency, neighborhoodValidation.checkNeighborhoodFieldsNotBlank],
      "Multi-Family": [neighborhoodValidation.checkNeighborhoodUsageConsistency, neighborhoodValidation.checkNeighborhoodFieldsNotBlank],

      "Commercial": [neighborhoodValidation.checkNeighborhoodUsageConsistency, neighborhoodValidation.checkNeighborhoodFieldsNotBlank],
      "Other": [neighborhoodValidation.checkNeighborhoodUsageConsistency, neighborhoodValidation.checkNeighborhoodFieldsNotBlank, neighborhoodValidation.checkOtherLandUseComment],
      "Neighborhood Boundaries": [neighborhoodValidation.checkNeighborhoodBoundaries, neighborhoodValidation.checkNeighborhoodFieldsNotBlank],
      "Built-Up": [neighborhoodValidation.checkSingleChoiceFields, neighborhoodValidation.checkNeighborhoodFieldsNotBlank], "Growth": [neighborhoodValidation.checkSingleChoiceFields, neighborhoodValidation.checkNeighborhoodFieldsNotBlank], "Property Values": [neighborhoodValidation.checkSingleChoiceFields, neighborhoodValidation.checkNeighborhoodFieldsNotBlank], "Demand/Supply": [neighborhoodValidation.checkSingleChoiceFields, neighborhoodValidation.checkNeighborhoodFieldsNotBlank], "Marketing Time": [neighborhoodValidation.checkSingleChoiceFields, neighborhoodValidation.checkNeighborhoodFieldsNotBlank],
      "Neighborhood Description": [neighborhoodValidation.checkNeighborhoodFieldsNotBlank],
      "Market Conditions:": [neighborhoodValidation.checkNeighborhoodFieldsNotBlank],

      // Improvements Validations
      'Units': [improvementsValidation.checkUnits, improvementsValidation.checkAccessoryUnit],
      '# of Stories': [improvementsValidation.checkNumberOfStories],
      'Type': [improvementsValidation.checkPropertyType],
      'Existing/Proposed/Under Const.': [improvementsValidation.checkConstructionStatusAndReconciliation],
      'Design (Style)': [improvementsValidation.checkDesignStyle, salesComparisonValidation.checkDesignStyleAdjustment],
      'Year Built': [improvementsValidation.checkYearBuilt],
      'Effective Age (Yrs)': [improvementsValidation.checkEffectiveAge],
      'Additional features': [improvementsValidation.checkAdditionalFeatures],
      'Describe the condition of the property': [improvementsValidation.checkPropertyConditionDescription],
      'Are there any physical deficiencies or adverse conditions that affect the livability, soundness, or structural integrity of the property? If Yes, describe': [improvementsValidation.checkPhysicalDeficienciesImprovements],
      'Does the property generally conform to the neighborhood (functional utility, style, condition, use, construction, etc.)? If No, describe': [improvementsValidation.checkNeighborhoodConformity],
      'Foundation Type': [improvementsValidation.checkFoundationType],
      'Basement Area sq.ft.': [improvementsValidation.checkBasementDetails],
      'Basement Finish %': [improvementsValidation.checkBasementDetails],
      'Infestation': [improvementsValidation.checkEvidenceOf], 'Dampness': [improvementsValidation.checkEvidenceOf], 'Settlement': [improvementsValidation.checkEvidenceOf],
      'Foundation Walls (Material/Condition)': [improvementsValidation.checkMaterialCondition], 'Exterior Walls (Material/Condition)': [improvementsValidation.checkMaterialCondition],
      'Roof Surface (Material/Condition)': [improvementsValidation.checkMaterialCondition], 'Gutters & Downspouts (Material/Condition)': [improvementsValidation.checkMaterialCondition],
      'Window Type (Material/Condition)': [improvementsValidation.checkMaterialCondition], 'Floors (Material/Condition)': [improvementsValidation.checkMaterialCondition],
      'Walls (Material/Condition)': [improvementsValidation.checkMaterialCondition],
      'Trim/Finish (Material/Condition)': [improvementsValidation.checkMaterialCondition],
      'Bath Floor (Material/Condition)': [improvementsValidation.checkMaterialCondition], 'Bath Wainscot (Material/Condition)': [improvementsValidation.checkMaterialCondition],
      'Fuel': [improvementsValidation.checkHeatingFuel, improvementsValidation.checkImprovementsFieldsNotBlank],
      'Car Storage': [improvementsValidation.checkCarStorage, improvementsValidation.checkImprovementsFieldsNotBlank],

      // Sales Comparison Validations
      'Address': [salesComparisonValidation.checkSubjectAddressInconsistency],
      'Condition': [salesComparisonValidation.checkConditionAdjustment], 'Condition Adjustment': [salesComparisonValidation.checkConditionAdjustment],
      'Bedrooms': [salesComparisonValidation.checkBedroomsAdjustment], 'Bedrooms Adjustment': [salesComparisonValidation.checkBedroomsAdjustment],
      'Baths': [salesComparisonValidation.checkBathsAdjustment], 'Baths Adjustment': [salesComparisonValidation.checkBathsAdjustment],
      'Quality of Construction': [salesComparisonValidation.checkQualityOfConstructionAdjustment], 'Quality of Construction Adjustment': [salesComparisonValidation.checkQualityOfConstructionAdjustment],
      'Proximity to Subject': [salesComparisonValidation.checkProximityToSubject],
      'Site': [salesComparisonValidation.checkSiteAdjustment], 'Site Adjustment': [salesComparisonValidation.checkSiteAdjustment],
      'Gross Living Area': [salesComparisonValidation.checkGrossLivingAreaAdjustment], 'Gross Living Area Adjustment': [salesComparisonValidation.checkGrossLivingAreaAdjustment],
      'Design (Style) Adjustment': [salesComparisonValidation.checkDesignStyleAdjustment],
      'Functional Utility': [salesComparisonValidation.checkFunctionalUtilityAdjustment], 'Functional Utility Adjustment': [salesComparisonValidation.checkFunctionalUtilityAdjustment],
      'Energy Efficient Items': [salesComparisonValidation.checkEnergyEfficientItemsAdjustment], 'Energy Efficient Items Adjustment': [salesComparisonValidation.checkEnergyEfficientItemsAdjustment],
      'Porch/Patio/Deck': [salesComparisonValidation.checkPorchPatioDeckAdjustment], 'Porch/Patio/Deck Adjustment': [salesComparisonValidation.checkPorchPatioDeckAdjustment],
      'Heating/Cooling': [salesComparisonValidation.checkHeatingCoolingAdjustment], 'Heating/Cooling Adjustment': [salesComparisonValidation.checkHeatingCoolingAdjustment],
      'Data Source(s)': [salesComparisonValidation.checkDataSourceDOM],
      // 'Actual Age': [salesComparisonValidation.checkActualAgeAdjustment], 'Actual Age Adjustment': [salesComparisonValidation.checkActualAgeAdjustment],
      'Actual Age': [salesComparisonValidation.checkActualAgeAdjustment, salesComparisonValidation.checkSubjectAgeConsistency], 'Actual Age Adjustment': [salesComparisonValidation.checkActualAgeAdjustment],
      'Sale Price': [salesComparisonValidation.checkSalePrice],
      'Leasehold/Fee Simple': [salesComparisonValidation.checkLeaseholdFeeSimpleConsistency],
      'Date of Sale/Time': [salesComparisonValidation.checkDateOfSale],
      'Location': [salesComparisonValidation.checkLocationConsistency, neighborhoodValidation.checkLocation, neighborhoodValidation.checkNeighborhoodFieldsNotBlank],

      // Reconciliation Validations
      'Indicated Value by Sales Comparison Approach $': [reconciliationValidation.checkFinalValueConsistency],
      'Indicated Value by: Sales Comparison Approach $': [reconciliationValidation.checkFinalValueConsistency, reconciliationValidation.checkCostApproachDeveloped],
      'opinion of the market value, as defined, of the real property that is the subject of this report is $': [reconciliationValidation.checkFinalValueConsistency],
      'APPRAISED VALUE OF SUBJECT PROPERTY $': [reconciliationValidation.checkFinalValueConsistency],
      'Cost Approach (if developed)': [reconciliationValidation.checkCostApproachDeveloped],
      'This appraisal is made "as is", subject to completion per plans and specifications on the basis of a hypothetical condition that the improvements have been completed, subject to the following repairs or alterations on the basis of a hypothetical condition that the repairs or alterations have been completed, or subject to the following required inspection based on the extraordinary assumption that the condition or deficiency does not require alteration or repair:': [reconciliationValidation.checkAppraisalCondition],
      'as of': [reconciliationValidation.checkAsOfDate],
      'final value': [reconciliationValidation.checkFinalValueBracketing, reconciliationValidation.checkReconciliationFieldsNotBlank, reconciliationValidation.checkFinalValueConsistency],
      'Assignment Type': [subjectValidation.checkAssignmentTypeConsistency],

      // Contract Validations
      "I did did not analyze the contract for sale for the subject purchase transaction. Explain the results of the analysis of the contract for sale or why the analysis was not performed.": [contractValidation.checkContractFieldsMandatory, contractValidation.checkContractAnalysisConsistency],
      "Contract Price $": [contractValidation.checkContractFieldsMandatory, contractValidation.checkContractAnalysisConsistency],
      "Date of Contract": [contractValidation.checkContractFieldsMandatory, contractValidation.checkContractAnalysisConsistency],
      "Is property seller owner of public record?": [contractValidation.checkContractAnalysisConsistency, (field, text, data) => contractValidation.checkYesNoOnly(field, text, data, { name: 'Is property seller owner of public record?' })],
      "Data Source(s) (Contract)": [contractValidation.checkContractFieldsMandatory, contractValidation.checkContractAnalysisConsistency],
      "Is there any financial assistance (loan charges, sale concessions, gift or downpayment assistance, etc.) to be paid by any party on behalf of the borrower?": [contractValidation.checkContractAnalysisConsistency, (field, text, data) => contractValidation.checkYesNoOnly(field, text, data, { name: 'Is there any financial assistance (loan charges, sale concessions, gift or downpayment assistance, etc.) to be paid by any party on behalf of the borrower?' }), contractValidation.checkFinancialAssistanceInconsistency],
      "If Yes, report the total dollar amount and describe the items to be paid": [contractValidation.checkFinancialAssistanceInconsistency, contractValidation.checkContractAnalysisConsistency],
    };

    marketConditionsFields.forEach(field => {
      registry[field] = [marketConditionsValidation.checkMarketConditionsFieldsNotBlank];
    });

    const timeframes = ["Prior 7-12 Months", "Prior 4-6 Months", "Current-3 Months", "Overall Trend"];
    marketConditionsRows.forEach(row => {
      timeframes.forEach(tf => {
        const fieldName = `${row.fullLabel} (${tf})`;
        registry[fieldName] = [marketConditionsValidation.checkMarketConditionsTableFields];
      });
    });

    condoForeclosureFields.forEach(field => {
      registry[field] = [form1073Validation.checkCondoForeclosureFieldsNotBlank];
    });

    const condoTimeframes = ["Prior 7–12 Months", "Prior 4–6 Months", "Current – 3 Months", "Overall Trend"];
    condoCoopProjectsRows.forEach(row => {
      condoTimeframes.forEach(tf => {
        const fieldName = `${row.fullLabel} (${tf})`;
        registry[fieldName] = [form1073Validation.checkCondoCoopProjectsTableFields];
      });
    });

    pudInformationFields.forEach(field => {
      registry[field] = [pudInformationValidation.checkPudInformationFieldsNotBlank];
    });

    unitDescriptionsFields.forEach(field => {
      registry[field] = [unitDescriptionsValidation.checkUnitDescriptionsFieldsNotBlank];
    });

    projectAnalysisFields.forEach(field => {
      registry[field] = [projectAnalysisValidation.checkProjectAnalysisFieldsNotBlank];
    });

    projectSiteFields.forEach(field => {
      registry[field] = [projectSiteValidation.checkProjectSiteFieldsNotBlank];
    });

    incomeApproachFields.forEach(field => {
      registry[field] = [incomeApproachValidation.checkIncomeApproachFieldsNotBlank];
    });

    priorSaleHistoryFields.forEach(field => {
      registry[field] = [priorSaleHistoryValidation.checkPriorSaleHistoryFieldsNotBlank];
    });

    infoOfSalesFields.forEach(field => {
      registry[field] = [infoOfSalesValidation.checkInfoOfSalesFieldsNotBlank];
    });

    projectInfoFields.forEach(field => {
      registry[field] = [form1073Validation.checkProjectInfoFieldsNotBlank];
    });

    return registry;
  };

  const rentScheduleValidationRegistry = {
    'Proximity to Subject': [rentScheduleValidation.checkRentProximityToSubject],
    // Add other rent schedule validations here
  };

  const getValidationErrors = () => {
    const errors = [];
    if (!data || Object.keys(data).length === 0) {
      return errors;
    }

    const validationRegistry = buildValidationRegistry();
    const allData = data;

    const runChecksForField = (sectionName, fieldName, value, path, saleName = null, customRegistry = validationRegistry) => {
      const validationFns = customRegistry[fieldName] || [];
      for (const fn of validationFns) {
        try {
          let result = fn(fieldName, value, allData, path, saleName);

          if (!result && saleName) {
            try {
              const res2 = fn(fieldName, allData, saleName);
              if (res2) result = res2;
            } catch (e) { }
          }

          if (result && result.isError) {
            errors.push([sectionName, `${fieldName}${saleName ? ` (${saleName})` : ''}`, result.message]);
            break;
          }
        } catch (e) {

        }
      }
    };

    Object.keys(allData).forEach(sectionKey => {
      const sectionData = allData[sectionKey];
      if (typeof sectionData === 'object' && sectionData !== null) {
        Object.keys(sectionData).forEach(fieldKey => {
          const value = sectionData[fieldKey];
          const path = [sectionKey, fieldKey];
          runChecksForField(sectionKey, fieldKey, value, path);
        });
      } else {
        // For root level fields
        const value = allData[sectionKey];
        const path = [sectionKey];
        runChecksForField('Subject', sectionKey, value, path);
      }
    });

    comparableSales.forEach(saleName => {
      if (allData[saleName]) {
        Object.keys(allData[saleName]).forEach(fieldKey => {
          const value = allData[saleName][fieldKey];
          const path = [saleName, fieldKey];
          runChecksForField('Sales Comparison', fieldKey, value, path, saleName);
        });
      }
    });

  
    comparableRents.forEach(rentName => {
      if (allData[rentName]) {
        Object.keys(allData[rentName]).forEach(fieldKey => {
          const value = allData[rentName][fieldKey];
          const path = [rentName, fieldKey];
          runChecksForField('Rent Schedule', fieldKey, value, path, rentName, rentScheduleValidationRegistry);
        });
      }
    });
    ComparableRentAdjustments.forEach(rentName => {
      if (allData[rentName]) {
        Object.keys(allData[rentName]).forEach(fieldKey => {
          const value = allData[rentName][fieldKey];
          const path = [rentName, fieldKey];
          runChecksForField('Rent Schedule', fieldKey, value, path, rentName, rentScheduleValidationRegistry);
        });
      }
    });

    const uniqueErrors = [];
    const seenErrors = new Set();

    for (const error of errors) {
      const fieldName = error[1];
      const message = error[2];
      const errorKey = `${fieldName}|${message}`;

      if (!seenErrors.has(errorKey)) {
        uniqueErrors.push(error);
        seenErrors.add(errorKey);
      }
    }
    return uniqueErrors;
  };

  const getValidationSuccesses = () => {
    const successes = [];
    if (!data || Object.keys(data).length === 0) {
      return successes;
    }

    const validationRegistry = buildValidationRegistry();
    const allData = data;

    const runChecksForField = (sectionName, fieldName, value, path, saleName = null, customRegistry = validationRegistry) => {
      const validationFns = customRegistry[fieldName] || [];
      if (validationFns.length === 0) {
        return;
      }

      let hasError = false;
      for (const fn of validationFns) {
        try {
          let result = fn(fieldName, value, allData, path, saleName);

          if (!result && saleName) {
            try {
              const res2 = fn(fieldName, allData, saleName);
              if (res2) result = res2;
            } catch (e) { }
          }

          if (result && result.isError) {
            hasError = true;
            break; 
          }
        } catch (e) {
          hasError = true;
          break;
        }
      }

      if (!hasError) {
        successes.push([sectionName, `${fieldName}${saleName ? ` (${saleName})` : ''}`, 'Passed']);
      }
    };

    Object.keys(allData).forEach(sectionKey => {
      if (comparableSales.includes(sectionKey) || comparableRents.includes(sectionKey) || ComparableRentAdjustments.includes(sectionKey)) {
        return;
      }
      const sectionData = allData[sectionKey];
      if (typeof sectionData === 'object' && sectionData !== null) {
        Object.keys(sectionData).forEach(fieldKey => {
          const value = sectionData[fieldKey];
          const path = [sectionKey, fieldKey];
          runChecksForField(sectionKey, fieldKey, value, path);
        });
      } else {
        const value = allData[sectionKey];
        const path = [sectionKey];
        runChecksForField('Subject', sectionKey, value, path);
      }
    });

    comparableSales.forEach(saleName => {
      if (allData[saleName]) {
        Object.keys(allData[saleName]).forEach(fieldKey => {
          const value = allData[saleName][fieldKey];
          const path = [saleName, fieldKey];
          runChecksForField('Sales Comparison', fieldKey, value, path, saleName);
        });
      }
    });

    const uniqueSuccesses = [];
    const seenSuccesses = new Set();

    for (const success of successes) {
      const fieldName = success[1];
      const status = success[2];
      const key = `${fieldName}|${status}`;

      if (!seenSuccesses.has(key)) {
        uniqueSuccesses.push(success);
        seenSuccesses.add(key);
      }
    }

    return uniqueSuccesses;
  };

  const handleGenerateErrorLog = () => {
    if (Object.keys(data).length === 0) {
      setNotification({ open: true, message: 'No data to generate a log.', severity: 'warning' });
      return;
    }

    const doc = new jsPDF();
    const pageHeight = doc.internal.pageSize.height;
    const margin = 15;
    let yPos = margin;

    const addHeaderFooter = () => {
      const pageCount = doc.internal.getNumberOfPages();
      for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.setFontSize(10);
        doc.setTextColor(100);
        doc.text('Appraisal Review Log', margin, 10);
        doc.text(new Date().toLocaleDateString(), doc.internal.pageSize.width - margin, 10, { align: 'right' });
        doc.text(`Page ${i} of ${pageCount}`, doc.internal.pageSize.width / 2, pageHeight - 10, { align: 'center' });
      }
    };

    doc.setFontSize(12);
    doc.setFont(undefined, 'bold');
    doc.text('Review Details', margin, yPos);
    yPos += 8;

    doc.setFontSize(10);
    doc.setFont(undefined, 'normal');
    const totalTime = `${Math.floor(fileUploadTimer / 3600).toString().padStart(2, '0')}:${Math.floor((fileUploadTimer % 3600) / 60).toString().padStart(2, '0')}:${(fileUploadTimer % 60).toString().padStart(2, '0')}`;
    const detailsBody = [
      ['File Name', selectedFile?.name || 'N/A'],
      ['User', username],
      ['Total Time Taken', totalTime]
    ];
    autoTable(doc, {
      startY: yPos,
      body: detailsBody,
      theme: 'plain',
      styles: { cellPadding: 1 },
      columnStyles: { 0: { fontStyle: 'bold' } }
    });
    yPos = doc.lastAutoTable.finalY + 10;

    const addSection = (title, head, body, headerColor = [200, 0, 0]) => {
      if (body.length === 0) return;
      if (yPos > pageHeight - 40) {
        doc.addPage();
        yPos = margin;
      }
      doc.setFontSize(14);
      doc.setFont(undefined, 'bold');
      doc.setTextColor(40);
      doc.text(title, margin, yPos);
      yPos += 8;
      autoTable(doc, {
        startY: yPos,
        head: [head],
        body: body,
        theme: 'grid',
        headStyles: { fillColor: headerColor, textColor: 255 },
        didDrawPage: (data) => { yPos = data.cursor.y + 10; },
      });
      yPos = doc.lastAutoTable.finalY + 10;
    };

    const validationErrors = getValidationErrors();
    const validationErrorRows = validationErrors.map(([section, field, message]) => [section, field, message]);
    if (validationErrorRows.length === 0) {
      validationErrorRows.push(['All', 'All', 'No validation errors found.']);
    }
    addSection('Validation Errors', ['Section', 'Field', 'Error Message'], validationErrorRows, [255, 165, 0]);

    const validationSuccesses = getValidationSuccesses();
    const validationSuccessRows = validationSuccesses.map(([section, field, message]) => [section, field, message]);
    if (validationSuccessRows.length === 0) {
      validationSuccessRows.push(['All', 'All', 'No successful validations found.']);
    }
    addSection('Successful Validations', ['Section', 'Field', 'Status'], validationSuccessRows, [34, 139, 34]);

    const consistencyErrors = getDataConsistencyErrors(data);
    if (consistencyErrors.length > 0) {
      const consistencyBody = consistencyErrors.map(([item, improvements, grid, photo, floorplan]) =>
        [item, improvements, grid, photo, floorplan]
      );
      addSection('Data Consistency Issues',
        ['Item', 'Improvements', 'Sales Grid', 'Photo', 'Floorplan'],
        consistencyBody
      );
    }

    const requirementErrors = [];
    const checks = [
      { name: 'Client Requirements', response: clientReqResponse },
      { name: 'State Requirements', response: stateReqResponse },
      { name: 'FHA Requirements', response: fhaResponse },
      { name: 'ADU Requirements', response: ADUResponse },
      { name: 'Escalation Points', response: escalationResponse },
    ];
    checks.forEach(check => {
      if (check.response && Array.isArray(check.response.details)) {
        check.response.details.forEach(item => {
          let isIssue = item.status === 'Not Fulfilled' || item.status === 'Needs Review' || item.status === 'Needs Escalation';
          if (check.name === 'State Requirements' && item.status === 'Not Applicable') {
            isIssue = true;
          }
          if (isIssue) {
            const comment = (typeof item.value_or_comment === 'object' && item.value_or_comment !== null)
              ? (item.value_or_comment.value || JSON.stringify(item.value_or_comment))
              : item.value_or_comment;
            requirementErrors.push([check.name, item.requirement, item.status, comment]);
          }
        });
      }
    });
    addSection('Requirement Check Issues', ['Check', 'Requirement', 'Status', 'Comment'], requirementErrors);


    const promptAnalysisIssues = [];
    if (promptAnalysisResponse && typeof promptAnalysisResponse === 'object' && !Array.isArray(promptAnalysisResponse)) {
      if (Array.isArray(promptAnalysisResponse.comparison_summary)) {
        promptAnalysisResponse.comparison_summary.forEach(item => {
          const status = String(item.status || '').toLowerCase();
          if (status.includes('not fulfilled') || status.includes('not present')) {
            promptAnalysisIssues.push(['Prompt Analysis', item.section, item.status, item.comment]);
          }
        });
      }
      Object.entries(promptAnalysisResponse).forEach(([key, value]) => {
        if (key === 'summary' || key === 'comparison_summary') return;
        const valueStr = (typeof value === 'object' && value !== null && 'value' in value) ? String(value.value) : String(value);
        const comment = (typeof value === 'object' && value !== null && (value.comment || value.tooltip)) ? String(value.comment || value.tooltip) : '';
        if (valueStr.toLowerCase().includes('not fulfilled') || valueStr.toLowerCase().includes('not present')) {
          promptAnalysisIssues.push(['Prompt Analysis', key, valueStr, comment]);
        }
      });
    }
    addSection('Prompt Analysis Issues', ['Check', 'Requirement', 'Value', 'Comment'], promptAnalysisIssues);


    const addressInconsistencies = [];
    const getFirstThreeWords = (str) => str ? str.split(/\s+/).slice(0, 3).join(' ').toLowerCase() : '';

    comparableSales.forEach((sale, index) => {
      const compNum = index + 1;
      const salesGridAddress = data[sale]?.Address || '';
      const locationMapAddress = data[`Location Map Address ${compNum}`] || '';
      const photoAddress = data[`Comparable Photo Address ${compNum}`] || '';
      const allAddresses = [salesGridAddress, locationMapAddress, photoAddress];
      const validAddresses = allAddresses.filter(Boolean);

      let isConsistent = false;
      if (validAddresses.length < 2) {
        isConsistent = true;
      } else {
        const shortAddresses = validAddresses.map(getFirstThreeWords);
        const uniqueShortAddresses = new Set(shortAddresses);
        if (uniqueShortAddresses.size < shortAddresses.length) {
          isConsistent = true;
        }
      }

      if (!isConsistent) {
        addressInconsistencies.push([`Comp #${compNum}`, salesGridAddress, locationMapAddress, photoAddress]);
      }
    });
    addSection('Comparable Address Inconsistencies', ['Comparable', 'Sales Grid Address', 'Location Map Address', 'Photo Address'], addressInconsistencies);


    addHeaderFooter();
    const baseFileName = selectedFile?.name.replace(/\.[^/.]+$/, "") || 'Appraisal';
    doc.save(`${baseFileName}_Validation_Log.pdf`);
    setNotification({ open: true, message: 'Combined review log generated successfully.', severity: 'success' });
  };

  const handleGenerateValidationLog = handleGenerateErrorLog;

  const getDataConsistencyErrors = (allData) => {
    const errors = [];
    if (!allData || Object.keys(allData).length === 0) return errors;

    Object.keys(dataConsistencyFields).forEach(item => {
      const fields = dataConsistencyFields[item];
      const values = Object.values(fields).map(fieldKey => allData[fieldKey] || 'N/A');
      if (new Set(values.filter(v => v !== 'N/A')).size > 1) {
        errors.push([item, ...values]);
      }
    });
    return errors;
  };

  const fileUploadTimerRef = useRef(null);

  const handlePreviewPdf = (file) => {
    if (file) {
      const fileURL = URL.createObjectURL(file);
      setPdfPreviewUrl(fileURL);
      setPdfPreviewOpen(true);
      setIsPdfMinimized(false);
    }
  };

  const handleDataChange = (path, value) => {
    setData(prevData => {
      const newData = { ...prevData };
      let current = newData;
      for (let i = 0; i < path.length - 1; i++) {
        current[path[i]] = { ...current[path[i]] };
        current = current[path[i]];
      }
      current[path[path.length - 1]] = value;
      return newData;
    });
  };
  const onHtmlFileChange = (e) => {
    const file = e.target.files && e.target.files[0];
    if (file) {
      setHtmlFile(file);
      setIsHtmlReviewLoading(true);
      setHtmlExtractionTimer(0);
      if (htmlExtractionTimerRef.current) {
        clearInterval(htmlExtractionTimerRef.current);
      }
      htmlExtractionTimerRef.current = setInterval(() => {
        setHtmlExtractionTimer(prev => prev + 1);
      }, 1000);
      setNotification({ open: true, message: 'HTML file uploaded. Extracting data...', severity: 'info' });

      const reader = new FileReader();
      reader.onload = (event) => {
        const content = event.target.result;
        const parser = new DOMParser();
        const doc = parser.parseFromString(content, 'text/html');

        const fieldsToExtract = [
          'Client Name', 'Client Address', 'Transaction Type', 'FHA Case Number', 'Borrower (and Co-Borrower)',
          'Property Address', 'Property County', 'Property Type', 'Assigned to Vendor(s)', 'AMC Reg. Number',
          'Appraisal Type', 'Unit Number', 'UAD XML Report'
        ];

        const extractedData = {};
        const allElements = doc.body.querySelectorAll('*');

        fieldsToExtract.forEach(field => {
          extractedData[field] = 'N/A';
          for (let i = 0; i < allElements.length; i++) {
            const element = allElements[i];
            if (element.textContent.trim().toLowerCase().replace(/:$/, '') === field.toLowerCase()) {
              const nextElement = element.nextElementSibling;
              if (nextElement) {
                if (field === 'Appraisal Type' || field === 'Transaction Type') {
                  const selectElement = nextElement.querySelector('select');
                  if (selectElement) {
                    const selectedOption = selectElement.querySelector('option[selected]');
                    if (selectedOption) {
                      const selectedText = selectedOption.innerText.trim();
                      if (selectedText !== '-- Select One --') {
                        extractedData[field] = selectedText;
                      }
                      break;
                    }
                  }
                } else {
                  extractedData[field] = nextElement.innerText.trim();
                  break;
                }
              }
            }
          }
        });

        setComparisonData(extractedData);

        setNotification({ open: true, message: 'HTML data extracted. Please review.', severity: 'success' });
        setIsHtmlReviewLoading(false);
        if (htmlExtractionTimerRef.current) {
          clearInterval(htmlExtractionTimerRef.current);
        }
      };
      reader.readAsText(file);
    }
  };

  const onContractFileChange = (e) => {
    const file = e.target.files && e.target.files[0];
    if (file) {
      setContractFile(file);
      setNotification({ open: true, message: 'Contract file uploaded. Click "Review Contract" to compare.', severity: 'success' });

    }
  };

  const handleContractCompare = async () => {
    if (!selectedFile || !contractFile) {
      setNotification({ open: true, message: 'Please upload both the main report and the contract copy.', severity: 'warning' });
      return;
    }
    setContractCompareLoading(true);
    setContractCompareError('');
    setContractCompareResult(null);

    const formData = new FormData();
    formData.append('main_report_file', selectedFile);
    formData.append('contract_copy_file', contractFile);

    try {
      const response = await fetch('https://strdjrbservices1.pythonanywhere.com/api/compare-contract/', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Failed to compare documents.');
      }

      const result = await response.json();
      setContractCompareResult(result);

    } catch (error) {
      setContractCompareError(error.message);
      setNotification({ open: true, message: error.message, severity: 'error' });
    } finally {
      setContractCompareLoading(false);
    }
  };

  const handleEngagementLetterCompare = async () => {
    if (!selectedFile || !engagementLetterFile) {
      setNotification({ open: true, message: 'Please upload both the main report and the engagement letter.', severity: 'warning' });
      return;
    }
    setEngagementLetterCompareLoading(true);
    setEngagementLetterCompareError('');
    setEngagementLetterCompareResult(null);

    const formData = new FormData();
    formData.append('main_report_file', selectedFile);
    formData.append('engagement_letter_file', engagementLetterFile);

    try {
      const response = await fetch('https://strdjrbservices1.pythonanywhere.com/api/compare-engagement-letter/', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Failed to compare documents.');
      }

      const result = await response.json();
      setEngagementLetterCompareResult(result.comparison_results);

    } catch (error) {
      setEngagementLetterCompareError(error.message);
      setNotification({ open: true, message: error.message, severity: 'error' });
    } finally {
      setEngagementLetterCompareLoading(false);
    }
  };


  const onEngagementLetterFileChange = (e) => {
    const file = e.target.files && e.target.files[0];
    if (file) {
      setEngagementLetterFile(file);
      setNotification({ open: true, message: 'Engagement letter uploaded. Click "Review Letter" to compare.', severity: 'success' });

    }
  };

  const handleManualValidation = (fieldPath) => {
    setManualValidations(prev => {
      const pathKey = JSON.stringify(fieldPath);
      const newValidations = { ...prev };
      if (newValidations[pathKey]) {
        delete newValidations[pathKey];
      } else {
        newValidations[pathKey] = true;
      }
      return newValidations;
    });
  };
  const handleComparisonDataChange = (field, value) => {
    setComparisonData(prev => ({
      ...prev,
      [field]: value
    }));
  };


  useEffect(() => {
    const checkScrollTop = () => {
      if (!showScrollTop && window.pageYOffset > 400) {
        setShowScrollTop(true);
      } else if (showScrollTop && window.pageYOffset <= 400) {
        setShowScrollTop(false);
      }
    };

    window.addEventListener('scroll', checkScrollTop);
    return () => window.removeEventListener('scroll', checkScrollTop);
  }, [showScrollTop]);

  useEffect(() => {
    setUsername(localStorage.getItem('username') || 'Unknown User');
  }, []);

  const scrollTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  useEffect(() => {
    return () => {
      localStorage.removeItem('fileUploadStartTime');
      clearInterval(fileUploadTimerRef.current);
    };
  }, []);

  useEffect(() => {
    const startTime = localStorage.getItem('fileUploadStartTime');
    if (startTime) {
      const elapsedSeconds = Math.floor((Date.now() - parseInt(startTime, 10)) / 1000);
      setFileUploadTimer(elapsedSeconds);
      setIsTimerRunning(true);
    }
  }, []);

  useEffect(() => {
    if (isTimerRunning) {
      fileUploadTimerRef.current = setInterval(() => {
        setFileUploadTimer(prev => prev + 1);
      }, 1000);
    } else {
      clearInterval(fileUploadTimerRef.current);
    }

    return () => clearInterval(fileUploadTimerRef.current);
  }, [isTimerRunning]);

  const handleTimerToggle = () => {
    setIsTimerRunning(prev => !prev);
  };


  const subjectFields = [
    'Full Address',
    'Property Address',
    'City',
    'County',
    'State',
    'Zip Code',
    'Borrower',
    'Owner of Public Record',
    'Legal Description',
    "Assessor's Parcel #",
    'Tax Year',
    'R.E. Taxes $',
    'Neighborhood Name',
    'Map Reference',
    'Census Tract',
    'Occupant',
    'Special Assessments $',
    'PUD',
    'HOA $',
    'HOA(per year)', 'HOA(per month)',
    'Property Rights Appraised',
    'Assignment Type',
    'Lender/Client',
    'Address (Lender/Client)',
    'Offered for Sale in Last 12 Months',
    'Report data source(s) used, offering price(s), and date(s)',
  ];

  const statesRequiringAppraiserFee = ['AZ', 'CO', 'CT', 'GA', 'IL', 'LA', 'NJ', 'NV', 'NM', 'ND', 'OH', 'UT', 'VA', 'VT', 'WV'];
  const statesRequiringAmcLicense = ['GA', 'IL', 'MT', 'NJ', 'OH', 'VT'];

  const currentState = data?.State?.toUpperCase();

  if (currentState) {
    if (statesRequiringAppraiserFee.includes(currentState)) {
      const feeIndex = subjectFields.indexOf('State') + 1;
      if (!subjectFields.includes("Appraiser's Fee")) {
        subjectFields.splice(feeIndex, 0, "Appraiser's Fee");
      }
    }
    if (statesRequiringAmcLicense.includes(currentState)) {
      let amcIndex = subjectFields.indexOf('State') + 1;
      if (subjectFields.includes("Appraiser's Fee")) {
        amcIndex++;
      }
      if (!subjectFields.includes('AMC License #')) {
        subjectFields.splice(amcIndex, 0, 'AMC License #');
      }
    }
    if (currentState === 'CA') {
      const caFields = ["Smoke detector comment", "CO detector comment", "Water heater double-strapped comment"];
      const stateIndex = subjectFields.indexOf('State') + 1;
      let offset = 0;
      caFields.forEach(field => {
        if (!subjectFields.includes(field)) {
          subjectFields.splice(stateIndex + offset, 0, field);
          offset++;
        }
      });
    }
  }


  const highlightedSubjectFields = [
    'Property Address',
    'City',
    'County',
    'State',
    'Zip Code',
    'Borrower',
    'Occupant',
    'Assignment Type',
    'Lender/Client',
    'Address (Lender/Client)',
  ];
  const stateRequirementFields = ["STATE REQUIREMENT FIELDS"];

  const highlightedContractFields = [
    'Contract Price $',
    'Date of Contract',
  ];

  const highlightedSiteFields = [
    "Area",
    "Shape",
    "View",
    "Is the highest and best use of subject property as improved (or as proposed per plans and specifications) the present use?",
    "FEMA Special Flood Hazard Area",
    "FEMA Flood Zone",
    "FEMA Map #",
    "FEMA Map Date",
  ];


  const contractFields = [
    "I did did not analyze the contract for sale for the subject purchase transaction. Explain the results of the analysis of the contract for sale or why the analysis was not performed.",
    "Contract Price $",
    "Date of Contract",
    "Is property seller owner of public record?",
    "Data Source(s)",
    "Is there any financial assistance (loan charges, sale concessions, gift or downpayment assistance, etc.) to be paid by any party on behalf of the borrower?",
    "If Yes, report the total dollar amount and describe the items to be paid"
  ];

  const neighborhoodFields = [
    "Location", "Built-Up", "Growth", "Property Values", "Demand/Supply",
    "Marketing Time", "One-Unit", "2-4 Unit", "Multi-Family", "Commercial", "Other", "Present Land Use for other",
    "one unit housing price(high,low,pred)", "one unit housing age(high,low,pred)",
    "Neighborhood Boundaries", "Neighborhood Description", "Market Conditions:",
  ];

  const siteFields = [
    "Dimensions",
    "Area",
    "Shape",
    "View",
    "Specific Zoning Classification",
    "Zoning Description",
    "Zoning Compliance",
    "Is the highest and best use of subject property as improved (or as proposed per plans and specifications) the present use?",
    "Electricity",
    "Gas",
    "Water",
    "Sanitary Sewer",
    "Street",
    "Alley",
    "FEMA Special Flood Hazard Area",
    "FEMA Flood Zone",
    "FEMA Map #",
    "FEMA Map Date", "Are the utilities and off-site improvements typical for the market area?",
    "Are the utilities and off-site improvements typical for the market area? If No, describe",
    "Are there any adverse site conditions or external factors (easements, encroachments, environmental conditions, land uses, etc.)? If Yes, describe"
  ];

  const zoningComplianceValue = data?.SITE?.['Zoning Compliance'];
  if (zoningComplianceValue === 'Legal Nonconforming (Grandfathered Use)') {
    if (!siteFields.includes('Legal Nonconforming (Grandfathered Use) comment')) {
      siteFields.splice(siteFields.indexOf('Zoning Compliance') + 1, 0, 'Legal Nonconforming (Grandfathered Use) comment');
    }
  }
  if (zoningComplianceValue === 'No Zoning') {
    if (!siteFields.includes('No Zoning comment')) {
      siteFields.splice(siteFields.indexOf('Zoning Compliance') + 1, 0, 'No Zoning comment');
    }
  }

  const utilityComments = [
    { field: "Electricity", commentField: "Electricity comment" },
    { field: "Gas", commentField: "Gas comment" },
    { field: "Water", commentField: "Water comment" },
    { field: "Sanitary Sewer", commentField: "Sanitary Sewer comment" },
    { field: "Street", commentField: "Street comment" },
    { field: "Alley", commentField: "Alley comment" },
  ];

  utilityComments.forEach(({ field, commentField }) => {
    if (data?.SITE?.[commentField]) {
      if (!siteFields.includes(commentField)) {
        const index = siteFields.indexOf(field);
        if (index !== -1) {
          siteFields.splice(index + 1, 0, commentField);
        }
      }
    }
  });


  const improvementsFields = [
    "Units", "One with Accessory Unit", "# of Stories", "Type", "Existing/Proposed/Under Const.",
    "Design (Style)", "Year Built", "Effective Age (Yrs)", "Foundation Type",
    "Basement Area sq.ft.", "Basement Finish %",
    "Evidence of (Foundation)", "Foundation Walls (Material/Condition)",
    "Exterior Walls (Material/Condition)", "Roof Surface (Material/Condition)",
    "Gutters & Downspouts (Material/Condition)", "Window Type (Material/Condition)",
    "Storm Sash/Insulated", "Screens", "Floors (Material/Condition)", "Walls (Material/Condition)",
    "Trim/Finish (Material/Condition)", "Bath Floor (Material/Condition)", "Bath Wainscot (Material/Condition)",
    "Attic", "Heating Type", "Fuel", "Cooling Type",
    "Fireplace(s) #", "Patio/Deck", "Pool", "Woodstove(s) #", "Fence", "Porch", "Other in Amenities",
    "Car Storage", "Driveway # of Cars", "Driveway Surface", "Garage # of Cars", "Carport # of Cars", "Att./Det./Built-in",
    "Appliances",
    "Finished area above grade Rooms", "Finished area above grade Bedrooms",
    "Finished area above grade Bath(s)", "Square Feet of Gross Living Area Above Grade",
    "Additional features", "Describe the condition of the property",
    "Are there any physical deficiencies or adverse conditions that affect the livability, soundness, or structural integrity of the property? If Yes, describe",
    "Does the property generally conform to the neighborhood (functional utility, style, condition, use, construction, etc.)?",
    "Does the property generally conform to the neighborhood (functional utility, style, condition, use, construction, etc.)?If Yes, describe"
  ];

  const reconciliationFields = [
    'Indicated Value by: Sales Comparison Approach $',
    'Cost Approach (if developed)',
    'Income Approach (if developed) $',
    'Income Approach (if developed) $ Comment',
    'This appraisal is made "as is", subject to completion per plans and specifications on the basis of a hypothetical condition that the improvements have been completed, subject to the following repairs or alterations on the basis of a hypothetical condition that the repairs or alterations have been completed, or subject to the following required inspection based on the extraordinary assumption that the condition or deficiency does not require alteration or repair:',
    "opinion of the market value, as defined, of the real property that is the subject of this report is $",
    "as of", "final value"
  ];

  const incomeApproachFields = [
    "Estimated Monthly Market Rent $",
    "X Gross Rent Multiplier  = $",
    "Indicated Value by Income Approach",
    "Summary of Income Approach (including support for market rent and GRM) "
  ];

  const costApproachFields = [
    "Estimated",
    "Source of cost data",
    "Quality rating from cost service ",
    "Effective date of cost data ",
    "Comments on Cost Approach (gross living area calculations, depreciation, etc.)",
    "OPINION OF SITE VALUE = $ ................................................",
    "Dwelling",
    "Garage/Carport ",
    "Estimated Remaining Economic Life (HUD and VA only)",
    "Total Estimate of Cost-New = $ ...................",
    "Depreciation ",
    "Depreciated Cost of Improvements......................................................=$ ",
    "“As-is” Value of Site Improvements......................................................=$",
    "Indicated Value By Cost Approach......................................................=$",
  ];

  const pudInformationFields = [
    "PUD Fees $",
    "PUD Fees (per month)",
    "PUD Fees (per year)",
    "Is the developer/builder in control of the Homeowners' Association (HOA)?",
    "Unit type(s)",
    "Provide the following information for PUDs ONLY if the developer/builder is in control of the HOA and the subject property is an attached dwelling unit.",
    "Legal Name of Project",
    "Total number of phases",
    "Total number of units",
    "Total number of units sold",
    "Total number of units rented",
    "Total number of units for sale",
    "Data source(s)",
    "Was the project created by the conversion of existing building(s) into a PUD?",
    " If Yes, date of conversion",
    "Does the project contain any multi-dwelling units? Yes No Data",
    "Are the units, common elements, and recreation facilities complete?",
    "If No, describe the status of completion.",
    "Are the common elements leased to or by the Homeowners' Association?",
    "If Yes, describe the rental terms and options.",
    "Describe common elements and recreational facilities."
  ];

  const appraiserFields = [
    "Signature",
    "Name",
    "Company Name",
    "Company Address",
    "Telephone Number",
    "Email Address",
    "Date of Signature and Report",
    "Effective Date of Appraisal",
    "State Certification #",
    "or State License #",
    "or Other (describe)",
    "State #",
    "State",
    "Expiration Date of Certification or License",
    "ADDRESS OF PROPERTY APPRAISED",
    "APPRAISED VALUE OF SUBJECT PROPERTY $",
    "LENDER/CLIENT Name",
    "Lender/Client Company Name",
    "Lender/Client Company Address",
    "Lender/Client Email Address", "E&O Insurance",
    "Policy Period From",
    "Policy Period To", "License Vaild To", "LICENSE/REGISTRATION/CERTIFICATION #"
  ];

  const supplementalAddendumFields = [
    "SUPPLEMENTAL ADDENDUM",
    "ADDITIONAL COMMENTS",
    "APPRAISER'S CERTIFICATION:",
    "SUPERVISORY APPRAISER'S CERTIFICATION:",
    "Analysis/Comments",
    "GENERAL INFORMATION ON ANY REQUIRED REPAIRS",
    "UNIFORM APPRAISAL DATASET (UAD) DEFINITIONS ADDENDUM",
  ];

  const uniformResidentialAppraisalReportFields = [
    "SCOPE OF WORK:",
    "INTENDED USE:",
    "INTENDED USER:",
    "DEFINITION OF MARKET VALUE:",
    "STATEMENT OF ASSUMPTIONS AND LIMITING CONDITIONS:",
  ];

  const appraisalAndReportIdentificationFields = [
    "This Report is one of the following types:",
    "Comments on Standards Rule 2-3",
    "Reasonable Exposure Time",
    "Comments on Appraisal and Report Identification"
  ];

  const marketConditionsFields = [
    "Instructions:", "Seller-(developer, builder, etc.)paid financial assistance prevalent?",
    "Explain in detail the seller concessions trends for the past 12 months (e.g., seller contributions increased from 3% to 5%, increasing use of buydowns, closing costs, condo fees, options, etc.).",
    "Are foreclosure sales (REO sales) a factor in the market?", "If yes, explain (including the trends in listings and sales of foreclosed properties).",
    "Cite data sources for above information.", "Summarize the above information as support for your conclusions in the Neighborhood section of the appraisal report form. If you used any additional information, such as an analysis of pending sales and/or expired and withdrawn listings, to formulate your conclusions, provide both an explanation and support for your conclusions."
  ];

  const marketConditionsRows = [
    { label: "Total # of Comparable Sales (Settled)", fullLabel: "Inventory Analysis Total # of Comparable Sales (Settled)" },
    { label: "Absorption Rate (Total Sales/Months)", fullLabel: "Inventory Analysis Absorption Rate (Total Sales/Months)" },
    { label: "Total # of Comparable Active Listings", fullLabel: "Inventory Analysis Total # of Comparable Active Listings" },
    { label: "Median Comparable Sale Price", fullLabel: "Median Sale & List Price, DOM, Sale/List % Median Comparable Sale Price" },
    { label: "Median Comparable Sales Days on Market", fullLabel: "Median Sale & List Price, DOM, Sale/List % Median Comparable Sales Days on Market" },
    { label: "Median Comparable List Price", fullLabel: "Median Sale & List Price, DOM, Sale/List % Median Comparable List Price" },
    { label: "Median Comparable Listings Days on Market", fullLabel: "Median Sale & List Price, DOM, Sale/List % Median Comparable Listings Days on Market" },
    { label: "Median Sale Price as % of List Price", fullLabel: "Median Sale & List Price, DOM, Sale/List % Median Sale Price as % of List Price" }
  ];

  const salesHistoryFields = [
    "Date of Prior Sale/Transfer",
    "Price of Prior Sale/Transfer",
    "Data Source(s) for prior sale",
    "Effective Date of Data Source(s) for prior sale"
  ];
  const COMPARABLE_RENTAL_DATA = ["Address", "Proximity to Subject", "Current Monthly Rent", "Rent/Gross Bldg. Area", "Rent Control", "Data Source(s)", "Date of Lease(s)", "Location", "Actual Age", "Condition", "Gross Building Area", "Unit Breakdown Rm Count Tot Unit # 1", "Unit Breakdown Rm Count Br Unit # 1", "Unit Breakdown Rm Count Ba Unit # 1", "Unit Breakdown Rm Count Tot Unit # 2", "Unit Breakdown Rm Count Br Unit # 2", "Unit Breakdown Rm Count Ba Unit # 2", "Unit Breakdown Rm Count Tot Unit # 3", "Unit Breakdown Rm Count Br Unit # 3", "Unit Breakdown Rm Count Ba Unit # 3", "Unit Breakdown Rm Count Tot Unit # 4", "Unit Breakdown Rm Count Br Unit # 4", "Unit Breakdown Rm Count Ba Unit # 4", "Utilities Included"];
  const SUBJECT_RENT_SCHEDULE = ["Unit # Lease Date Begin Date 1", "Unit # Lease Date Begin Date 2", "Unit # Lease Date Begin Date 3", "Unit # Lease Date  Begin Date 4",
    "Unit # Lease Date End Date 1", "Unit # Lease Date End Date 2", "Unit # Lease Date End Date 3", "Unit # Lease Date End Date 4",
    "Actual Rents Unit # 1  Per Unit Unfurnished", "Actual Rents Unit # 2  Per Unit Unfurnished", "Actual Rents Unit # 3  Per Unit Unfurnished", "Actual Rents Unit # 4  Per Unit Unfurnished",
    "Actual Rents Unit # 1  Per Unit Furnished", "Actual Rents Unit # 2  Per Unit Furnished", "Actual Rents Unit # 3  Per Unit Furnished", "Actual Rents Unit # 4  Per Unit Furnished",
    "Actual Rents Unit # 1 Total Rents", "Actual Rents Unit # 2 Total Rents", "Actual Rents Unit # 3 Total Rents", "Actual Rents Unit # 4 Total Rents",
    "Opinion Of Market Rent Unit # 1 Per Unit Unfurnished", "Opinion Of Market Rent Unit # 2 Per Unit Unfurnished", "Opinion Of Market Rent Unit # 3 Per Unit Unfurnished", "Opinion Of Market Rent Unit # 4 Per Unit Unfurnished",
    "Opinion Of Market Rent Unit # 1 Per Unit Furnished", "Opinion Of Market Rent Unit # 2 Per Unit Furnished", "Opinion Of Market Rent Unit # 3 Per Unit Furnished", "Opinion Of Market Rent Unit # 4 Per Unit Furnished",
    "Opinion Of Market Rent Unit # 1 Total Rents", "Opinion Of Market Rent Unit # 2 Total Rents", "Opinion Of Market Rent Unit # 3 Total Rents", "Opinion Of Market Rent Unit # 4 Total Rents",
    "Comment on lease data", "Total Actual Monthly Rent", "Other Monthly Income (itemize)", "Total Actual Monthly Income", " Total Gross Monthly Rent", "Other Monthly Income (itemize)",
    "Total Estimated Monthly Income", " Utilities included in estimated rents", "Comments on actual or estimated rents and other monthly income (including personal property)",
  ];
  const salesComparisonAdditionalInfoFields = [

    "I did did not research the sale or transfer history of the subject property and comparable sales. If not, explain",
    "My research did did not reveal any prior sales or transfers of the subject property for the three years prior to the effective date of this appraisal.",
    "Data Source(s) for subject property research",
    "My research did did not reveal any prior sales or transfers of the comparable sales for the year prior to the date of sale of the comparable sale.",
    "Data Source(s) for comparable sales research",
    "Analysis of prior sale or transfer history of the subject property and comparable sales",
    "Summary of Sales Comparison Approach",
    "Indicated Value by Sales Comparison Approach $",

  ];

  const infoOfSalesFields = [
    "There are ____ comparable properties currently offered for sale in the subject neighborhood ranging in price from$ ___to $___",
    "There are ___comparable sales in the subject neighborhoodwithin the past twelvemonths ranging in sale price from$___ to $____"
  ];
  const condoForeclosureFields = [
    "Are foreclosure sales (REO sales) a factor in the project?", "If yes, indicate the number of REO listings and explain the trends in listings and sales of foreclosed properties.", "Summarize the above trends and address the impact on the subject unit and project.",
  ];
  const condoCoopProjectsRows = [
    { label: "Total # of Comparable Sales (Settled)", fullLabel: "Subject Project Data Total # of Comparable Sales (Settled)" },
    { label: "Absorption Rate (Total Sales/Months)", fullLabel: "Subject Project Data Absorption Rate (Total Sales/Months)" },
    { label: "Total # of Comparable Active Listings", fullLabel: "Subject Project Data Total # of Comparable Active Listings" },
    { label: "Months of Unit Supply (Total Listings/Ab.Rate)", fullLabel: "Subject Project Data Months of Unit Supply (Total Listings/Ab.Rate)" },
  ];
  const imageAnalysisFields = [
    "include bedroom, bed, bathroom, bath, half bath, kitchen, lobby, foyer, living room count with label and photo,please explan and match the floor plan with photo and improvement section, GLA",
    "please match comparable address in sales comparison approach and comparable photos, please make sure comp phto are not same, also find front, rear, street photo and make sure it is not same, capture any additionbal photo for adu according to check mark",
    "please match comparable address in sales comparison approach and comparable photos, please make sure comp phto are not same, also find front, rear, street photo and make sure it is not same, capture any additionbal photo for adu according to check mark, please match the same in location map, areial map should have subject address, please check signature section details of appraiser in appraiser license copy for accuracy"
  ];
  const projectSiteFields = [
    "Topography", "Size", "Density", "View", "Specific Zoning Classification", "Zoning Description",
    "Zoning Compliance", "Is the highest and best use of subject property as improved (or as proposed per plans and specifications) the present use?",
    "Electricity", "Gas", "Water", "Sanitary Sewer", "Street", "Alley", "FEMA Special Flood Hazard Area",
    "FEMA Flood Zone", "FEMA Map #", "FEMA Map Date", "Are the utilities and off-site improvements typical for the market area?", "Are the utilities and off-site improvements typical for the market area? If No, describe",
    "Are there any adverse site conditions or external factors (easements, encroachments, environmental conditions, land uses, etc.)?",
    "Are there any adverse site conditions or external factors (easements, encroachments, environmental conditions, land uses, etc.)? If Yes, describe",
  ];
  const projectInfoFields = [
    "Data source(s) for project information", "Project Description", "# of Stories",
    "# of Elevators", "Existing/Proposed/Under Const.", "Year Built",
    "Effective Age", "Exterior Walls",
    "Roof Surface", "Total # Parking", "Ratio (spaces/units)", "Type", "Guest Parking", "# of Units", "# of Units Completed",
    "# of Units For Sale", "# of Units Sold", "# of Units Rented", "# of Owner Occupied Units",
    "# of Phases", "# of Units", "# of Units for Sale", "# of Units Sold", "# of Units Rented", "# of Owner Occupied Units", "# of Planned Phases",
    "# of Planned Units", "# of Planned Units for Sale", "# of Planned Units Sold", "# of Planned Units Rented", "# of Planned Owner Occupied Units",
    "Project Primary Occupancy", "Is the developer/builder in control of the Homeowners' Association (HOA)?",
    "Management Group", "Does any single entity (the same individual, investor group, corporation, etc.) own more than 10% of the total units in the project?"
    , "Was the project created by the conversion of existing building(s) into a condominium?",
    "Was the project created by the conversion of existing building(s) into a condominium? If Yes,describe the original use and date of conversion",
    "Are the units, common elements, and recreation facilities complete (including any planned rehabilitation for a condominium conversion)?", "If No, describe",
    "Is there any commercial space in the project?",
    "If Yes, describe and indicate the overall percentage of the commercial space.", "Describe the condition of the project and quality of construction.",
    "Describe the common elements and recreational facilities.", "Are any common elements leased to or by the Homeowners' Association?",
    "If Yes, describe the rental terms and options.", "Is the project subject to a ground rent?",
    "If Yes, $ per year (describe terms and conditions)",
    "Are the parking facilities adequate for the project size and type?", "If No, describe and comment on the effect on value and marketability."
  ];
  const projectAnalysisFields = [
    "I did did not analyze the condominium project budget for the current year. Explain the results of the analysis of the budget (adequacy of fees, reserves, etc.), or why the analysis was not performed.",
    "Are there any other fees (other than regular HOA charges) for the use of the project facilities?",
    "If Yes, report the charges and describe.",
    "Compared to other competitive projects of similar quality and design, the subject unit charge appears",
    "If High or Low, describe",
    "Are there any special or unusual characteristics of the project (based on the condominium documents, HOA meetings, or other information) known to the appraiser?",
    "If Yes, describe and explain the effect on value and marketability.",
  ];
  const unitDescriptionsFields = [
    "Unit Charge$", " per month X 12 = $", "per year",
    "Annual assessment charge per year per square feet of gross living area = $",
    "Utilities included in the unit monthly assessment [None/Heat/Air/Conditioning/Electricity/Gas/Water/Sewer/Cable/Other (describe)]",
    "Floor #",
    "# of Levels",
    "Heating Type/Fuel",
    "Central AC/Individual AC/Other (describe)",
    "Fireplace(s) #/Woodstove(s) #/Deck/Patio/Porch/Balcony/Other",
    "Refrigerator/Range/Oven/Disp Microwave/Dishwasher/Washer/Dryer",
    "Floors", "Walls", "Trim/Finish", "Bath Wainscot", "Doors",
    "None/Garage/Covered/Open", "Assigned/Owned", "# of Cars", "Parking Space #",
    "Finished area above grade contains:", "Rooms", "Bedrooms", "Bath(s)", "Square Feet of Gross Living Area Above Grade",
    "Are the heating and cooling for the individual units separately metered?", "If No, describe and comment on compatibility to other projects in the market area.",
    "Additional features (special energy efficient items, etc.)",
    "Describe the condition of the property (including needed repairs, deterioration, renovations, remodeling, etc.)",
    "Are there any physical deficiencies or adverse conditions that affect the livability, soundness, or structural integrity of the property? ", "If Yes, describe",
    "Does the property generally conform to the neighborhood (functional utility, style, condition, use, construction, etc.)?", "If No, describe"
  ];

  const priorSaleHistoryFields = [
    "Prior Sale History: I did did not research the sale or transfer history of the subject property and comparable sales",
    "Prior Sale History: My research did did not reveal any prior sales or transfers of the subject property for the three years prior to the effective date of this appraisal",
    "Prior Sale History: Data source(s) for subject",
    "Prior Sale History: My research did did not reveal any prior sales or transfers of the comparable sales for the year prior to the date of sale of the comparable sale",
    "Prior Sale History: Data source(s) for comparables",
    "Prior Sale History: Report the results of the research and analysis of the prior sale or transfer history of the subject property and comparable sales",
    "Prior Sale History: Date of Prior Sale/Transfer",
    "Prior Sale History: Price of Prior Sale/Transfer",
    "Prior Sale History: Data Source(s) for prior sale/transfer",
    "Prior Sale History: Effective Date of Data Source(s)",
    "Prior Sale History: Analysis of prior sale or transfer history of the subject property and comparable sales"
  ];
  const dataConsistencyFields = {
    'Bedroom': {
      'Improvements': 'Bedroom Improvements Count',
      'Grid': 'Bedroom Sales Comparison Approach Count',
      'Photo': 'Bedroom Photo Count',
      'Floorplan': 'TOTAL Bedroom Floorplan Count',
    },
    'Bathroom': {
      'Improvements': 'Bathroom Improvements Count',
      'Grid': 'Bathroom Sales Comparison Approach Count',
      'Photo': 'Bathroom Photo Count',
      'Floorplan': 'TOTAL Bathroom Floorplan Count',
    },
    'GLA': { 'Improvements': 'GLA Improvements Count', 'Grid': 'GLA Sales Comparison Approach Count', 'Photo': 'GLA Photo Count', 'Floorplan': 'GLA Floorplan Count' }
  };
  const formTypes = ['1004', '1004C', '1004D', '1025', '1073', '2090', '203k-FHA', '2055', '1075', '2095', '1007', '216', '1025 + 1007', '1073 + 1007'];

  const sections = useMemo(() => [
    { id: 'subject-info', title: 'Subject', category: 'SUBJECT', icon: <HomeIcon /> },
    { id: 'contract-section', title: 'Contract', category: 'CONTRACT', icon: <GavelIcon /> },
    { id: 'neighborhood-section', title: 'Neighborhood', category: 'NEIGHBORHOOD', icon: <LocationCityIcon /> },

    { id: 'project-site-section', title: 'Project Site', category: 'PROJECT_SITE', icon: <TerrainIcon /> },
    { id: 'project-info-section', title: 'Project Information', category: 'PROJECT_INFO', icon: <Info /> },
    { id: 'project-analysis-section', title: 'Project Analysis', category: 'PROJECT_ANALYSIS', icon: <AnalyticsIcon /> },
    { id: 'unit-descriptions-section', title: 'Unit Descriptions', category: 'UNIT_DESCRIPTIONS', icon: <MeetingRoomIcon /> },
    { id: 'prior-sale-history-section', title: 'Prior Sale History', category: 'PRIOR_SALE_HISTORY', icon: <HistoryIcon /> },
    { id: 'site-section', title: 'Site', category: 'SITE', icon: <TerrainIcon /> },
    { id: 'improvements-section', title: 'Improvements', category: 'IMPROVEMENTS', icon: <BuildIcon /> },
    { id: 'info-of-sales-section', title: 'Sales Comparison Approach', category: 'INFO_OF_SALES', icon: <MonetizationOnIcon /> },
    { id: 'sales-comparison', title: 'Sales GRID Section', category: ['SALES_GRID'], icon: <CompareArrowsIcon /> },
    { id: 'sales-history-section', title: 'Sales History', category: 'SALES_TRANSFER', icon: <HistoryIcon /> },
    { id: 'comparable-rental-data', title: 'COMPARABLE RENTAL DATA', category: 'COMPARABLE_RENTAL_DATA', icon: <ApartmentIcon /> },
    { id: 'subject-rent-schedule', title: 'SUBJECT RENT SCHEDULE', category: 'SUBJECT_RENT_SCHEDULE', icon: <RequestQuoteIcon /> },
    { id: 'rent-schedule-section', title: 'Comparable Rent Schedule', category: 'RENT_SCHEDULE_GRID', icon: <TableChartIcon /> },
    { id: 'rent-schedule-reconciliation-section', title: 'Rent Schedule Reconciliation', category: 'RENT_SCHEDULE_RECONCILIATION', icon: <MergeTypeIcon /> },
    { id: 'reconciliation-section', title: 'Reconciliation', category: 'RECONCILIATION', icon: <BalanceIcon /> },
    { id: 'cost-approach-section', title: 'Cost Approach', category: 'COST_APPROACH', icon: <CalculateIcon /> },
    { id: 'income-approach-section', title: 'Income Approach', category: 'INCOME_APPROACH', icon: <AttachMoneyIcon /> },
    { id: 'pud-info-section', title: 'PUD Information', category: 'PUD_INFO', icon: <DomainIcon /> },
    { id: 'market-conditions-section', title: 'Market Conditions', category: 'MARKET_CONDITIONS', icon: <TrendingUpIcon /> },
    { id: 'condo-coop-section', title: 'Condo/Co-op', category: ['CONDO', 'CONDO_FORECLOSURE'], icon: <BusinessIcon /> },
    { id: 'appraiser-section', title: 'CERTIFICATION', category: 'CERTIFICATION', icon: <VerifiedUserIcon /> }, // This should be condo coop projects
    { id: 'prompt-analysis', title: 'Prompt Analysis', category: 'PROMPT_ANALYSIS', icon: <PsychologyIcon /> },
    { id: 'raw-output', title: 'Raw Output', icon: <CodeIcon /> },
  ], []);

  const salesGridRows = [
    { label: "Address", valueKey: "Address", subjectValueKey: "Property Address" },
    { label: "Proximity to Subject", valueKey: "Proximity to Subject", subjectValueKey: "" },
    { label: "Sale Price", valueKey: "Sale Price" },
    { label: "Sale Price/GLA", valueKey: "Sale Price/Gross Liv. Area" },
    { label: "Data Source(s)", valueKey: "Data Source(s)" },
    { label: "Verification Source(s)", valueKey: "Verification Source(s)" },
    { label: "Sale or Financing Concessions", valueKey: "Sale or Financing Concessions", adjustmentKey: "Sale or Financing Concessions Adjustment" },
    { label: "Date of Sale/Time", valueKey: "Date of Sale/Time", adjustmentKey: "Date of Sale/Time Adjustment" },
    { label: "Location", valueKey: "Location", adjustmentKey: "Location Adjustment" },
    { label: "Leasehold/Fee Simple", valueKey: "Leasehold/Fee Simple", adjustmentKey: "Leasehold/Fee Simple Adjustment" },
    { label: "Site", valueKey: "Site", adjustmentKey: "Site Adjustment" },
    { label: "View", valueKey: "View", adjustmentKey: "View Adjustment" },
    { label: "Design (Style)", valueKey: "Design (Style)", adjustmentKey: "Design (Style) Adjustment" },
    { label: "Quality of Construction", valueKey: "Quality of Construction", adjustmentKey: "Quality of Construction Adjustment" },
    { label: "Actual Age", valueKey: "Actual Age", adjustmentKey: "Actual Age Adjustment" },
    { label: "Condition", valueKey: "Condition", adjustmentKey: "Condition Adjustment" },
    { label: "Total Rooms", valueKey: "Total Rooms" },
    { label: "Bedrooms", valueKey: "Bedrooms", adjustmentKey: "Bedrooms Adjustment" },
    { label: "Baths", valueKey: "Baths", adjustmentKey: "Baths Adjustment" },
    // { label: "Above Grade Room Count Adjustment", valueKey: "Above Grade Room Count Adjustment", isAdjustmentOnly: true },
    { label: "Gross Living Area", valueKey: "Gross Living Area", adjustmentKey: "Gross Living Area Adjustment" },
    { label: "Basement & Finished", valueKey: "Basement & Finished Rooms Below Grade", adjustmentKey: "Basement & Finished Rooms Below Grade Adjustment" },
    { label: "Functional Utility", valueKey: "Functional Utility", adjustmentKey: "Functional Utility Adjustment" },
    { label: "Heating/Cooling", valueKey: "Heating/Cooling", adjustmentKey: "Heating/Cooling Adjustment" },
    { label: "Energy Efficient Items", valueKey: "Energy Efficient Items", adjustmentKey: "Energy Efficient Items Adjustment" },
    { label: "Garage/Carport", valueKey: "Garage/Carport", adjustmentKey: "Garage/Carport Adjustment" },
    { label: "Porch/Patio/Deck", valueKey: "Porch/Patio/Deck", adjustmentKey: "Porch/Patio/Deck Adjustment" },
    { label: "Net Adjustment (Total)", valueKey: "Net Adjustment (Total)" },
    { label: "Adjusted Sale Price", valueKey: "Adjusted Sale Price of Comparable" },
  ];

  const rentScheduleReconciliationFields = [
    "Comments on market data, including the range of rents for single family properties, an estimate of vacancy for single family rental properties, the general trend of rents and vacancy, and support for the above adjustments. (Rent concessions should be adjusted to the market, not to the subject property.)",
    "Final Reconciliation of Market Rent:",
    "I (WE) ESTIMATE THE MONTHLY MARKET RENT OF THE SUBJECT AS OF",
    "TO BE $",
  ];

  const RentSchedulesFIELDS2 = [
    "Address",
    "Proximity to Subject",
    "Date Lease Begins",
    "Date Lease Expires",
    "Monthly Rental",
    "Less: Utilities",
    "Furniture",
    "Adjusted Monthly Rent",
    "Data Source",
    "Rent",
    "Concessions",
    "Location/View",
    "Design and Appeal",
    "Age/Condition",
    "Room Count Total",
    "Room Count Bdrms",
    "Room Count Baths",
    "Gross Living Area",
    "Other (e.g., basement, etc.)",
    "Other:",
    "Net Adj. (total)",
    "Indicated Monthly Market Rent",
  ];

  const comparableSales = [
    "COMPARABLE SALE #1",
    "COMPARABLE SALE #2",
    "COMPARABLE SALE #3",
    "COMPARABLE SALE #4",
    "COMPARABLE SALE #5",
    "COMPARABLE SALE #6",
    "COMPARABLE SALE #7",
    "COMPARABLE SALE #8",
    "COMPARABLE SALE #9",
  ];

  const comparableRents = [
    "COMPARABLE No. 1",
    "COMPARABLE No. 2",
    "COMPARABLE No. 3",
    "COMPARABLE No. 4",
    "COMPARABLE No. 5",
    "COMPARABLE No. 6",
    "COMPARABLE No. 7",
    "COMPARABLE No. 8",
    "COMPARABLE No. 9",
  ];

  const ComparableRentAdjustments = [
    "COMPARABLE RENTAL NO. 1",
    "COMPARABLE RENTAL NO. 2",
    "COMPARABLE RENTAL NO. 3",
    "COMPARABLE RENTAL NO. 4",
    "COMPARABLE RENTAL NO. 5",
    "COMPARABLE RENTAL NO. 6",
    "COMPARABLE RENTAL NO. 7",
    "COMPARABLE RENTAL NO. 8",
    "COMPARABLE RENTAL NO. 9",
  ]

  const handleExportJSON = () => {
    if (Object.keys(data).length === 0) {
      setNotification({ open: true, message: 'No data to export.', severity: 'warning' });
      return;
    }
    const jsonString = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${selectedFile?.name.replace('.pdf', '') || 'appraisal_data'}_export.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setNotification({ open: true, message: 'Data exported to JSON.', severity: 'success' });
  };

  const handleClearFiles = () => {
    setSelectedFile(null);
    setHtmlFile(null);
    setContractFile(null);
    setEngagementLetterFile(null);
    setData({});
    setExtractionAttempted(false);
    setLastExtractionTime(null);
    setRawGemini('');
    setPromptAnalysisResponse(null);
    setSubmittedPrompt('');
    setStateReqResponse(null);
    setUnpaidOkResponse(null);
    setClientReqResponse(null);
    setFhaResponse(null);
    setADUResponse(null);
    setActiveSection(null);
    setModalContent(null);
    setComparisonData({});
    setContractCompareResult(null);
    setEngagementLetterCompareResult(null);

    if (fileInputRef.current) fileInputRef.current.value = '';
    if (htmlFileInputRef.current) htmlFileInputRef.current.value = '';
    if (contractFileInputRef.current) contractFileInputRef.current.value = '';
    if (engagementLetterFileInputRef.current) engagementLetterFileInputRef.current.value = '';

    setNotification({ open: true, message: 'All files cleared.', severity: 'info' });
  };

  const confirmClearFiles = () => {
    handleClearFiles();
    setIsClearDialogOpen(false);
  };

  const onFileChange = (e) => {
    const file = e.target.files && e.target.files[0];

    setData({});
    setExtractionAttempted(false);
    setLastExtractionTime(null);
    setRawGemini('');
    setPromptAnalysisResponse(null);
    setSubmittedPrompt('');
    setStateReqResponse(null);
    setUnpaidOkResponse(null);
    setClientReqResponse(null);
    setFhaResponse(null);
    setADUResponse(null);
    setActiveSection(null);
    setModalContent(null);

    if (file) {
      setSelectedFile(file);
      localStorage.setItem('fileUploadStartTime', Date.now().toString());
      setNotification({
        open: true, message: 'File uploaded successfully.', severity: 'success'
      });
      setFileUploadTimer(0);
      setIsTimerRunning(true);
      extractInitialSections(); 

    }
  };

  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);

  const [rawGemini, setRawGemini] = useState('');

  const validateInputs = () => {
    if (!selectedFile) {
      setNotification({ open: true, message: 'Please select a file first.', severity: 'warning' });
      return false;
    }
    if (!selectedFile.name.toLowerCase().endsWith('.pdf')) {
      setNotification({ open: true, message: 'Only PDF files are supported.', severity: 'error' });
      return false;
    }
    return true;
  };

  const startExtractionProcess = () => {
    setLoading(true);
    setExtractionAttempted(true);
    setExtractionProgress(0);
    setTimer(0);
    timerRef.current = setInterval(() => {
      setTimer(prev => prev + 1);
    }, 1000);
  };

  const callExtractionAPI = async (formType, category, onRetry) => {
    setExtractionProgress(10);
    const retries = 3;
    let progressInterval;
    const delay = 1000;

    for (let i = 0; i < retries; i++) {
      try {
        const formData = new FormData();
        formData.append('file', selectedFile);
        formData.append('form_type', formType);
        if (category) {
          formData.append('category', category);
        }

        progressInterval = setInterval(() => {
          setExtractionProgress(prev => (prev < 40 ? prev + 5 : prev));
        }, 500);

        const response = await fetch('https://strdjrbservices1.pythonanywhere.com/api/extract/', {
          method: 'POST', body: formData
        });

        if (!response.ok) {
          let error;
          try {
            const err = await response.json();
            error = new Error(err.error || 'Extraction failed with a non-JSON response.');
          } catch (jsonError) {
            const errorText = await response.text();
            error = new Error(errorText || 'An unknown extraction error occurred.');
          }
          throw error;
        }
        clearInterval(progressInterval);
        setExtractionProgress(90);
        return await response.json();
      } catch (error) {
        if (progressInterval) clearInterval(progressInterval);
        if (i < retries - 1) {
          const currentDelay = delay * Math.pow(2, i);
          onRetry(i + 1, retries);
          await new Promise(res => setTimeout(res, currentDelay));
        } else {
          throw error;
        }
      }
    }
  };

  const processExtractionResult = (result, startTime, category) => {
    const normalizedFields = {};
    const longUtilField = "Utilities included in the unit monthly assessment [None/Heat/Air/Conditioning/Electricity/Gas/Water/Sewer/Cable/Other (describe)]";
    if (result.fields && result.fields[longUtilField]) {
      result.fields["Utilities included in the unit monthly assessment"] = result.fields[longUtilField];
    }

    if (result.fields && result.fields['From Type']) {
      const rawExtractedType = String(result.fields['From Type'] || '').trim();
      let finalFormType = '';

      if (rawExtractedType.includes('1004') && rawExtractedType.includes('1007')) {
        finalFormType = '1007';
      } else if (rawExtractedType.includes('1025') && rawExtractedType.includes('1007')) {
        finalFormType = '1025 + 1007';
      } else if (rawExtractedType.includes('1073') && rawExtractedType.includes('1007')) {
        finalFormType = '1073 + 1007';
      } else {
        finalFormType = rawExtractedType.replace(/[^0-9a-zA-Z-]/g, '');
      }

      if (formTypes.includes(finalFormType)) {
        setSelectedFormType(finalFormType);
        setNotification({
          open: true,
          message: `Form type automatically set to '${finalFormType}'.`,
          severity: 'success'
        });
      } else if (finalFormType) {
        setNotification({ open: true, message: `Extracted form type '${finalFormType}' is not supported. Please select manually.`, severity: 'warning' });
      }
    }

    Object.keys(result.fields || {}).forEach(key => {
      if (key.toUpperCase() === "SUBJECT") {
        normalizedFields["Subject"] = result.fields[key];
      } else {
        normalizedFields[key] = result.fields[key];
      }
    });
    Object.assign(normalizedFields, result.fields);

    setData(prevData => {
      const updatedData = { ...prevData, ...normalizedFields };
      Object.keys(normalizedFields).forEach(key => {
        if (typeof normalizedFields[key] === 'object' && normalizedFields[key] !== null && !Array.isArray(normalizedFields[key])) {
          updatedData[key] = { ...(prevData[key] || {}), ...normalizedFields[key] };
        }
      });
      return updatedData;
    });
    setRawGemini(result.raw || '');
    const durationInMs = Date.now() - startTime;
    const totalSeconds = Math.floor(durationInMs / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;

    if (result.fields?.INCOME_APPROACH?.['Estimated Monthly Market Rent $'] && selectedFormType !== '1007') {
      setIsRentFormTypeMismatchDialogOpen(true);
    } else {
      const sectionName = category ? `${category.replace(/_/g, ' ').toLowerCase()} section` : 'extraction';
      let durationMessage = '';
      if (minutes > 0) {
        durationMessage += `${minutes}m `;
      }
      durationMessage += `${seconds}s`;
      setNotification({
        open: true,
        message: <>Extraction of <strong style={{ color: '#000000' }}>{sectionName}</strong> completed in {durationMessage}.</>,
        severity: 'success'
      });
    }
    setLastExtractionTime(totalSeconds.toFixed(1));
    setExtractionProgress(100);
  };

  const handleExtract = async (category, sectionId) => {
    setNotification({ open: false, message: '', severity: 'info' });
    if (!validateInputs()) return;

    if (!category && !selectedFile) {
      setNotification({ open: true, message: 'Please select a section from the sidebar to extract.', severity: 'info' }); 
      return;
    }

    startExtractionProcess();
    const startTime = Date.now();
    const categories = Array.isArray(category) ? category : [category];

    setLoadingSection(sectionId);
    setExtractedSections(prev => new Set(prev).add(sectionId));
    const extractionPromises = categories.map(cat =>
      callExtractionAPI(selectedFormType, cat, (attempt, maxAttempts) => {
        setNotification({ open: true, message: `Extraction for ${cat} failed. Retrying... (Attempt ${attempt}/${maxAttempts})`, severity: 'warning' });
      }).then(result => ({ category: cat, result }))
    );

    try {
      const results = await Promise.allSettled(extractionPromises);
      results.forEach(p => {
        if (p.status === 'fulfilled') {
          processExtractionResult(p.value.result, startTime, p.value.category);
          if (p.value.category === 'CONTRACT') {
          }
        } else {
          setNotification({ open: true, message: p.reason.message || `An unknown error occurred during extraction.`, severity: 'error' });
        }
      });
    } catch (e) {
      setNotification({ open: true, message: e.message || 'An unexpected error occurred during extraction.', severity: 'error' });
    } finally {
      if (timerRef.current) clearInterval(timerRef.current);
      setLoading(false);

      setLoadingSection(null);
      if (extractionProgress !== 100) setExtractionProgress(0);
    }
  };

  const extractInitialSections = async () => {
    if (!selectedFile || !selectedFormType) return;

    const initialCategories = ['SUBJECT'];
    setLoading(true);
    setExtractionAttempted(true);
    setTimer(0);
    timerRef.current = setInterval(() => setTimer(prev => prev + 1), 1000);

    for (const category of initialCategories) {
      try {
        const formData = new FormData();
        formData.append('file', selectedFile);
        formData.append('form_type', selectedFormType);
        formData.append('category', category);

        const res = await fetch('https://strdjrbservices1.pythonanywhere.com/api/extract/', { method: 'POST', body: formData });

        if (!res.ok) {
          throw new Error(`Failed to extract ${category}`);
        }

        const result = await res.json();
        processExtractionResult(result, Date.now(), category);
      } catch (error) {
        console.error(error);
      }
    }

    setLoading(false);
    if (timerRef.current) clearInterval(timerRef.current);
  };

  const handlePromptAnalysis = async (prompt) => {
    if (!selectedFile) {
      setPromptAnalysisError('Please select a PDF file first.');
      return;
    }

    setPromptAnalysisLoading(true);
    setPromptAnalysisError('');
    setPromptAnalysisResponse(null);
    setModalContent(null);
    setStateReqResponse(null);
    setUnpaidOkResponse(null);
    setClientReqResponse(null);
    setFhaResponse(null);
    setADUResponse(null);

    const formData = new FormData();
    formData.append('file', selectedFile);
    formData.append('form_type', selectedFormType);
    formData.append('comment', prompt);

    try {
      const res = await fetch('https://strdjrbservices1.pythonanywhere.com/api/extract/', {
        method: 'POST',
        body: formData,
      });

      const result = await res.json();

      if (!res.ok) {
        throw new Error(result.detail || `HTTP error! status: ${res.status}`);
      }

      setPromptAnalysisResponse(result.fields);
      setSubmittedPrompt(prompt);
    } catch (e) {
      setPromptAnalysisError(e.message || 'An unexpected error occurred.');
    } finally {
      setPromptAnalysisLoading(false);
    }
  };

  const fetchWithRetry = async (url, options, retries = 3, delay = 1000) => {
    const timeout = 60000; 
    for (let i = 0; i < retries; i++) {
      try {
        const controller = new AbortController();
        const id = setTimeout(() => controller.abort(), timeout);
        const res = await fetch(url, { ...options, signal: controller.signal });
        clearTimeout(id);
        if (res.status < 500) {
          return res;
        }
        
        console.warn(`Attempt ${i + 1}: Server error ${res.status}. Retrying in ${delay / 1000}s...`);
      } catch (error) {
        console.warn(`Attempt ${i + 1}: Network error. Retrying in ${delay / 1000}s...`, error);
      }
      if (i < retries - 1) {
        await new Promise(resolve => setTimeout(resolve));
        delay *= 2; 
      }
    }
    throw new Error(`Failed to fetch from ${url} after ${retries} attempts.`);
  };

  const handleStateRequirementCheck = async (forceReload = false) => {
    if (!selectedFile) {
      setStateReqError('Please select a PDF file first.');
      return;
    }

    setStateReqLoading(true);
    setStateReqError('');
    setStateReqResponse(null);

    const formData = new FormData();
    formData.append('file', selectedFile);
    formData.append('form_type', selectedFormType);
    formData.append('comment', STATE_REQUIREMENTS_PROMPT);

    try {
      const res = await fetchWithRetry('https://strdjrbservices1.pythonanywhere.com/api/extract/', {
        method: 'POST',
        body: formData,
      }, 3, 1000);

      const result = await res.json();
      if (!res.ok) {
        throw new Error(result.detail || `HTTP error! status: ${res.status}`);
      }
      const responseData = result.fields || result;
      setStateReqResponse(responseData);
    } catch (e) {
      const errorMsg = e.message || 'An unexpected error occurred.';
      setStateReqError(errorMsg);
    } finally {
      setStateReqLoading(false);
      if (timerRef.current) clearInterval(timerRef.current);
      setLoading(false);
    }
  };

  const handleUnpaidOkCheck = async (forceReload = false) => {
    if (!selectedFile) {
      setUnpaidOkError('Please select a PDF file first.');
      return;
    }
    if (unpaidOkResponse && !forceReload) {
      setModalContent({
        title: 'Unpaid OK Lender Check',
        Component: UnpaidOkCheck,
        props: { loading: false, response: unpaidOkResponse, error: unpaidOkError }
      });
      setIsCheckModalOpen(true);
      return;
    }

    setUnpaidOkLoading(true);
    setUnpaidOkError('');
    setUnpaidOkResponse(null);

    setModalContent({
      title: 'Unpaid OK Lender Check',
      Component: UnpaidOkCheck,
      props: { loading: true }
    });
    setIsCheckModalOpen(true);

    const formData = new FormData();
    formData.append('file', selectedFile);
    formData.append('form_type', selectedFormType);
    formData.append('comment', UNPAID_OK_PROMPT);
    try {
      const res = await fetch('https://strdjrbservices1.pythonanywhere.com/api/extract/', {
        method: 'POST',
        body: formData,
      });

      const result = await res.json();
      if (!res.ok) {
        throw new Error(result.detail || `HTTP error! status: ${res.status}`);
      }
      const responseData = result.fields || result;
      setUnpaidOkResponse(responseData);
      setModalContent({
        title: 'Unpaid OK Lender Check',
        Component: UnpaidOkCheck,
        props: { loading: false, response: responseData, error: '' }
      });
    } catch (e) {
      const errorMsg = e.message || 'An unexpected error occurred.';
      setUnpaidOkError(errorMsg);
      setModalContent({
        title: 'Unpaid OK Lender Check',
        Component: UnpaidOkCheck,
        props: { loading: false, response: null, error: errorMsg }
      });
    } finally {
      setUnpaidOkLoading(false);
      if (timerRef.current) clearInterval(timerRef.current);
      setLoading(false);
    }
  };

  const handleClientRequirementCheck = async (forceReload = false) => {
    if (!selectedFile) {
      setClientReqError('Please select a PDF file first.');
      return;
    }

    setClientReqLoading(true);
    setClientReqError('');
    setClientReqResponse(null);

    const formData = new FormData();
    formData.append('file', selectedFile);
    formData.append('form_type', selectedFormType);
    formData.append('comment', CLIENT_REQUIREMENT_PROMPT);

    try {
      const res = await fetch('https://strdjrbservices1.pythonanywhere.com/api/extract/', {
        method: 'POST',
        body: formData,
      });

      const result = await res.json();
      if (!res.ok) {
        throw new Error(result.detail || `HTTP error! status: ${res.status}`);
      }
      const responseData = result.fields || result;
      setClientReqResponse(responseData);
    } catch (e) {
      const errorMsg = e.message || 'An unexpected error occurred.';
      setClientReqError(errorMsg);
    } finally {
      setClientReqLoading(false);
      if (timerRef.current) clearInterval(timerRef.current);
      setLoading(false);
    }
  };

  const handleFhaCheck = async (forceReload = false) => {
    if (!selectedFile) {
      setFhaError('Please select a PDF file first.');
      return;
    }

    if (fhaResponse && !forceReload) {
      setModalContent({
        title: 'FHA Requirement Check',
        Component: FhaCheck,
        props: { loading: false, response: fhaResponse, error: fhaError }
      });
      setIsCheckModalOpen(true);
      return;
    }

    setFhaLoading(true);
    setFhaError('');
    setFhaResponse(null);

    setModalContent({
      title: 'FHA Requirement Check',
      Component: FhaCheck,
      props: { loading: true }
    });
    setIsCheckModalOpen(true);

    const formData = new FormData();
    formData.append('file', selectedFile);
    formData.append('form_type', selectedFormType);
    formData.append('comment', ADU_REQUIREMENTS_PROMPT);
    formData.append('comment', FHA_REQUIREMENTS_PROMPT);

    try {
      const res = await fetch('https://strdjrbservices1.pythonanywhere.com/api/extract/', {
        method: 'POST',
        body: formData,
      });

      const result = await res.json();
      if (!res.ok) {
        throw new Error(result.detail || `HTTP error! status: ${res.status}`);
      }
      const responseData = result.fields || result;
      setFhaResponse(responseData);
      setModalContent({
        title: 'FHA Requirement Check',
        Component: FhaCheck,
        props: { loading: false, response: responseData, error: '' }
      });
    } catch (e) {
      const errorMsg = e.message || 'An unexpected error occurred.';
      setFhaError(errorMsg);
      setModalContent({
        title: 'FHA Requirement Check',
        Component: FhaCheck,
        props: { loading: false, response: null, error: errorMsg }
      });
    } finally {
      setFhaLoading(false);
      if (timerRef.current) clearInterval(timerRef.current);
      setLoading(false);
    }
  };

  const handleADUCheck = async (forceReload = false) => {
    if (!selectedFile) {
      setADUError('Please select a PDF file first.');
      return;
    }

    if (ADUResponse && !forceReload) {
      setModalContent({
        title: 'ADU File Check',
        Component: ADUCheck,
        props: { loading: false, response: ADUResponse, error: ADUError }
      });
      setIsCheckModalOpen(true);
      return;
    }

    setADULoading(true);
    setADUError('');
    setADUResponse(null);

    setModalContent({
      title: 'ADU File Check',
      Component: ADUCheck,
      props: { loading: true }
    });
    setIsCheckModalOpen(true);

    const formData = new FormData();
    formData.append('file', selectedFile);
    formData.append('form_type', selectedFormType);
    formData.append('comment', ADU_REQUIREMENTS_PROMPT);

    try {
      const res = await fetch('https://strdjrbservices1.pythonanywhere.com/api/extract/', {
        method: 'POST',
        body: formData,
      });

      const result = await res.json();
      if (!res.ok) {
        throw new Error(result.detail || `HTTP error! status: ${res.status}`);
      }
      const responseData = result.fields || result;
      setADUResponse(responseData);
      setModalContent({
        title: 'ADU File Check',
        Component: ADUCheck,
        props: { loading: false, response: responseData, error: '' }
      });
    } catch (e) {
      const errorMsg = e.message || 'An unexpected error occurred.';
      setADUError(errorMsg);
      setModalContent({
        title: 'ADU File Check',
        Component: ADUCheck,
        props: { loading: false, response: null, error: errorMsg }
      });
    } finally {
      setADULoading(false);
      if (timerRef.current) clearInterval(timerRef.current);
      setLoading(false);
    }
  };
  const handleEscalationCheck = async (forceReload = false) => {
    if (!selectedFile) {
      setEscalationError('Please select a PDF file first.');
      return;
    }

    setEscalationLoading(true);
    setEscalationError('');
    setEscalationResponse(null);

    const formData = new FormData();
    formData.append('file', selectedFile);
    formData.append('form_type', selectedFormType);
    formData.append('comment', ESCALATION_CHECK_PROMPT);

    try {
      const res = await fetch('https://strdjrbservices1.pythonanywhere.com/api/extract/', {
        method: 'POST',
        body: formData,
      });

      const result = await res.json();
      if (!res.ok) {
        throw new Error(result.detail || `HTTP error! status: ${res.status}`);
      }
      const responseData = result.fields || result;
      setEscalationResponse(responseData);
    } catch (e) {
      const errorMsg = e.message || 'An unexpected error occurred.';
      setEscalationError(errorMsg);
    } finally {
      setEscalationLoading(false);
    }
  };

  const handleSectionClick = (section) => {
    setActiveSection(section.id);
    const element = document.getElementById(section.id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
    if (!section.category) {
      return;
    }

    setNotification({ open: true, message: `Extracting ${section.title}...`, severity: 'info' });
    handleExtract(section.category, section.id);
  };

  const handleArrowClick = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        setVisibleSections(prev => {
          const newVisible = new Set(prev);
          entries.forEach(entry => {
            if (entry.isIntersecting) newVisible.add(entry.target.id);
            else newVisible.delete(entry.target.id);
          });
          return newVisible;
        });
      },
      { root: null, rootMargin: '0px', threshold: 0.1 }
    );
    sections.forEach(section => { const el = document.getElementById(section.id); if (el) observer.observe(el); });
    return () => observer.disconnect();
  }, [data, sections]);
  useEffect(() => {
    document.querySelectorAll('.section-active').forEach(el => {
      el.classList.remove('section-active');
    });

    if (activeSection) {
      const element = document.getElementById(activeSection);
      if (element) {
        element.classList.add('section-active');
      }
    }
  }, [activeSection]);

  const handleCloseNotification = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setNotification({ ...notification, open: false });
  };

  useEffect(() => {
    if (notification.open) {
      if (notification.severity === 'success' || notification.severity === 'upload') {
        playSound(notification.severity);
      } else if (notification.severity === 'error' || notification.severity === 'warning') {
        playSound('error');
      }
    }
  }, [notification]);

  useEffect(() => {
    const handleBeforeUnload = (event) => {
      if (Object.keys(data).length > 0 || selectedFile) {
        event.preventDefault();
        event.returnValue = '';
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [data, selectedFile]);

  const handleGeneratePdf = () => {
    if (Object.keys(data).length === 0) {
      setNotification({ open: true, message: 'No data to generate PDF.', severity: 'warning' });
      return;
    }

    setIsGeneratingPdf(true);
    setTimeout(() => {
      try {
        const doc = new jsPDF();
        const pageHeight = doc.internal.pageSize.height;
        const pageWidth = doc.internal.pageSize.width;
        const margin = 15;
        let yPos = margin;

        const addHeaderFooter = () => {
          const pageCount = doc.internal.getNumberOfPages();
          for (let i = 1; i <= pageCount; i++) {
            doc.setPage(i);
            doc.setFontSize(10);
            doc.setTextColor(100);
            doc.text('Appraisal Report Summary', margin, 10);
            doc.text(new Date().toLocaleDateString(), pageWidth - margin, 10, { align: 'right' });
            doc.text(`Page ${i} of ${pageCount}`, pageWidth / 2, pageHeight - 10, { align: 'center' });
          }
        };

        doc.setFontSize(12);
        doc.setFont(undefined, 'bold');
        doc.text('Review Details', margin, yPos);
        yPos += 8;
        doc.setFontSize(10);
        doc.setFont(undefined, 'normal');
        const totalTime = `${Math.floor(fileUploadTimer / 3600).toString().padStart(2, '0')}:${Math.floor((fileUploadTimer % 3600) / 60).toString().padStart(2, '0')}:${(fileUploadTimer % 60).toString().padStart(2, '0')}`;
        const detailsBody = [
          ['File Name', selectedFile?.name || 'N/A'],
          ['User', username],
          ['Total Time Taken', totalTime]
        ];
        autoTable(doc, {
          startY: yPos,
          body: detailsBody,
          theme: 'plain',
          styles: { cellPadding: 1 },
          columnStyles: { 0: { fontStyle: 'bold' } }
        });
        yPos = doc.lastAutoTable.finalY + 10;

        const addSection = (title, sectionFields, sectionData, usePre = false) => {
          const dataForSection = sectionData || {};

          if (yPos > pageHeight - 40) {
            doc.addPage();
            yPos = margin;
          }
          doc.setFontSize(14);
          doc.setFont(undefined, 'bold');
          doc.setTextColor(40);
          doc.text(title, margin, yPos);
          yPos += 8;

          const body = sectionFields.map(field => {
            let value = dataForSection[field];
            if (typeof value === 'object' && value !== null) {
              value = Object.entries(value).map(([k, v]) => `${k}: ${v}`).join('\n');
            }
            return [field, value || ''];
          });

          if (body.length > 0) {
            autoTable(doc, {
              startY: yPos,
              head: [['Field', 'Value']],
              body: body,
              theme: 'grid',
              headStyles: { fillColor: [22, 160, 133], textColor: 255 },
              columnStyles: { 0: { cellWidth: 60 } },
              didDrawPage: (data) => { yPos = data.cursor.y + 10; },
              willDrawCell: (data) => {
                if (data.section === 'body' && usePre) {
                  doc.setFont('Courier');
                }
              }
            });
            yPos = doc.lastAutoTable.finalY + 10;
          } else {
            yPos -= 8;
          }
        };

        const sectionDefinitions = [
          { id: 'subject-info', title: 'Subject Information', fields: subjectFields, data: data.Subject || data },
          { id: 'contract-section', title: 'Contract', fields: contractFields, data: data.CONTRACT },
          { id: 'neighborhood-section', title: 'Neighborhood', fields: neighborhoodFields, data: data.NEIGHBORHOOD },
          { id: 'site-section', title: 'Site', fields: siteFields, data: data.SITE },
          { id: 'improvements-section', title: 'Improvements', fields: improvementsFields, data: data.IMPROVEMENTS },
          { id: 'sales-history-section', title: 'Sales History', fields: salesHistoryFields, data: data.SALES_TRANSFER },
          { id: 'prior-sale-history-section', title: 'Prior Sale History', fields: priorSaleHistoryFields, data: data.PRIOR_SALE_HISTORY, usePre: true },
          { id: 'reconciliation-section', title: 'Reconciliation', fields: reconciliationFields, data: data.RECONCILIATION },
          { id: 'cost-approach-section', title: 'Cost Approach', fields: costApproachFields, data: data.COST_APPROACH },
          { id: 'income-approach-section', title: 'Income Approach', fields: incomeApproachFields, data: data.INCOME_APPROACH },
          { id: 'pud-info-section', title: 'PUD Information', fields: pudInformationFields, data: data.PUD_INFO },
          { id: 'market-conditions-section', title: 'Market Conditions Addendum', fields: marketConditionsFields, data: data.MARKET_CONDITIONS, usePre: true },
          { id: 'appraiser-section', title: 'Certification/Signature Section', fields: appraiserFields, data: data.CERTIFICATION },
        ];

        sectionDefinitions.forEach(section => {
          addSection(section.title, section.fields, section.data, section.usePre)
        });

        if (yPos > pageHeight - 60) { doc.addPage(); yPos = margin; }
        doc.setFontSize(14);
        doc.setFont(undefined, 'bold');
        doc.setTextColor(40);
        doc.text('Sales Comparison Approach', margin, yPos);
        yPos += 8;

        const activeComps = comparableSales;
        const head = [['Feature', 'Subject', ...activeComps]];
        const body = salesGridRows.map(row => {
          const rowData = [row.label];

          let subjectValue = (data.Subject || {})[row.valueKey] || (data.Subject || {})[row.subjectValueKey] || '';
          if (row.adjustmentKey && data.Subject?.[row.adjustmentKey]) {
            subjectValue += `\n(${data.Subject[row.adjustmentKey]})`;
          }
          rowData.push(subjectValue);

          activeComps.forEach(sale => {
            let compValue = (data[sale] || {})[row.valueKey] || '';
            if (row.adjustmentKey && data[sale]?.[row.adjustmentKey]) {
              compValue += `\n(${data[sale][row.adjustmentKey]})`;
            }
            rowData.push(compValue);
          });
          return rowData;
        });

        autoTable(doc, {
          startY: yPos,
          head,
          body,
          theme: 'grid',
          styles: { fontSize: 7, cellPadding: 1 },
          headStyles: { fillColor: [22, 160, 133], textColor: 255, fontSize: 8 },
          didDrawPage: (data) => { yPos = data.cursor.y + 10; }
        });


        addHeaderFooter();
        doc.save('Appraisal_Report_Summary.pdf');
        setNotification({ open: true, message: 'PDF generated successfully.', severity: 'success' });
      } catch (error) {
        console.error("Failed to generate PDF:", error);
        setNotification({ open: true, message: 'An error occurred while generating the PDF.', severity: 'error' });
      } finally {
        setIsGeneratingPdf(false);
      }
    }, 100);
  };

  const handleSaveToDB = async () => {
    if (Object.keys(data).length === 0) {
      setNotification({ open: true, message: 'No data to save.', severity: 'warning' });
      return;
    }
    setLoading(true);
    setNotification({ open: true, message: 'Saving data to database...', severity: 'info' });

    try {
      const totalTime = `${Math.floor(fileUploadTimer / 3600).toString().padStart(2, '0')}:${Math.floor((fileUploadTimer % 3600) / 60).toString().padStart(2, '0')}:${(fileUploadTimer % 60).toString().padStart(2, '0')}`;

      const cleanedData = JSON.parse(JSON.stringify(data));

      const sectionsToCheck = [
        'Subject', 'CONTRACT', 'NEIGHBORHOOD', 'SITE', 'IMPROVEMENTS',
        'SALES_TRANSFER', 'PRIOR_SALE_HISTORY', 'RECONCILIATION',
        'COST_APPROACH', 'INCOME_APPROACH', 'PUD_INFO', 'MARKET_CONDITIONS',
        'CONDO_FORECLOSURE', 'CERTIFICATION', 'INFO_OF_SALES',
        'PROJECT_SITE', 'PROJECT_INFO', 'PROJECT_ANALYSIS', 'UNIT_DESCRIPTIONS',
        'SUBJECT_RENT_SCHEDULE', 'RENT_SCHEDULE_GRID', 'RENT_SCHEDULE_RECONCILIATION',
        'COMPARABLE_RENTAL_DATA'
      ];

      sectionsToCheck.forEach(section => {
        if (cleanedData[section] && typeof cleanedData[section] === 'object') {
          Object.keys(cleanedData[section]).forEach(key => {
            // Check if the key exists at the root level
            if (cleanedData.hasOwnProperty(key)) {
              delete cleanedData[key];
            }
          });
        }
      });

      const validationErrors = getValidationErrors();
      const validationSuccesses = getValidationSuccesses();
      const consistencyErrors = getDataConsistencyErrors(data);

      const validationLog = {
        promptAnalysis: promptAnalysisResponse,
        stateRequirementCheck: stateReqResponse,
        clientRequirementCheck: clientReqResponse,
        escalationCheck: escalationResponse,
        fhaCheck: fhaResponse,
        aduCheck: ADUResponse,
        validationErrors,
        validationSuccesses,
        consistencyErrors
      };

      const dataToSave = {
        file_name: selectedFile?.name || 'N/A',
        user_name: username,
        validation_log: validationLog,
        report_data: {
          totalTimeTaken: totalTime,
          ...cleanedData,
          save_option: 'update'
        }
      };
      const response = await fetch('https://strdjrbservices1.pythonanywhere.com/api/save-report/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(dataToSave),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ detail: 'An unknown error occurred while saving.' }));
        throw new Error(errorData.detail || 'Failed to save data.');
      }

      const result = await response.json();
      setNotification({ open: true, message: result.message || 'Data saved successfully!', severity: 'success' });
    } catch (error) {
      setNotification({ open: true, message: error.message, severity: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const visibleSectionsList = useMemo(() => {
    const baseSections = sections.map(s => s.id);
    let visibleSectionIds = [];

    switch (selectedFormType) {
      case '1004':
        visibleSectionIds = baseSections.filter(id => !['comparable-rental-data', 'subject-rent-schedule', 'rent-schedule-section', 'prior-sale-history-section', 'rent-schedule-reconciliation-section', 'project-site-section', 'project-info-section', 'project-analysis-section', 'unit-descriptions-section'].includes(id));
        break;
      case '1025':
        visibleSectionIds = baseSections.filter(id => !['rent-schedule-section', 'project-site-section', 'project-info-section', 'rent-schedule-reconciliation-section', 'project-analysis-section', 'unit-descriptions-section', 'market-conditions-section'].includes(id));
        break;
      case '1073':
        visibleSectionIds = baseSections.filter(id => !['comparable-rental-data', 'subject-rent-schedule', 'rent-schedule-section', 'improvements-section', 'site-section', 'rent-schedule-reconciliation-section', 'pud-info-section'].includes(id));
        break;
      case '1007':
        visibleSectionIds = baseSections.filter(id => !['comparable-rental-data', 'subject-rent-schedule', 'project-site-section', 'prior-sale-history-section', 'project-info-section', 'project-analysis-section', 'unit-descriptions-section'].includes(id));
        break;
      default:

        visibleSectionIds = baseSections.filter(id => !['rent-schedule-section', 'rent-schedule-reconciliation-section', 'project-site-section', 'project-info-section', 'project-analysis-section', 'unit-descriptions-section']);
        break;
    }

    return sections.filter(section => visibleSectionIds.includes(section.id));
  }, [selectedFormType, sections]);

  const handleSidebarEnter = () => {
    if (sidebarLeaveTimerRef.current) {
      clearTimeout(sidebarLeaveTimerRef.current);
      sidebarLeaveTimerRef.current = null;
    }
    if (!isSidebarLocked) {
      setIsSidebarOpen(true);
    }
  };

  const handleSidebarLeave = () => {
    if (!isSidebarLocked) {
      sidebarLeaveTimerRef.current = setTimeout(() => {
        setIsSidebarOpen(false);
      }, 300);
    }
  };

  const renderForm = () => {
    const revisionHandlers = {
      // SUBJECT SECTION
      onPropertyAddressRevisionButtonClick: () => setPropertyAddressRevisionLangDialogOpen(true),
      onAssessorsParcelNumberRevisionButtonClick: () => {
        const revisionText = `Please revise the 'Assessor's Parcel Number'"${data["Assessor's Parcel Number"] || '...'}" field in the Subject section.`;
        navigator.clipboard.writeText(revisionText);
        setNotification({ open: true, message: "Assessor's Parcel Number revision text copied to clipboard!", severity: "success" });
        setNotes(prev => `${prev}\n- ${revisionText}`);
      },
      ONStreetRevisionButtonClick: () => {
        const revisionText = `Please revise the 'On Street' "${data["On Street"] || '...'}" field in the Subject section.`;
        navigator.clipboard.writeText(revisionText);
        setNotification({ open: true, message: "On Street revision text copied to clipboard!", severity: "success" });
        setNotes(prev => `${prev}\n- ${revisionText}`);
      },
      onNeighborhoodNameRevisionButtonClick: () => {
        const revisionText = `Please revise the 'Neighborhood Name' "${data["Neighborhood Name"] || '...'}" field in the Subject section.`;
        navigator.clipboard.writeText(revisionText);
        setNotification({ open: true, message: "Neighborhood Name revision text copied to clipboard!", severity: "success" });
        setNotes(prev => `${prev}\n- ${revisionText}`);
      },
      onCensusTractRevisionButtonClick: () => {
        const revisionText = `Please revise the 'Census Tract' "${data["Census Tract"] || '...'}" field in the Subject section.`;
        navigator.clipboard.writeText(revisionText);
        setNotification({ open: true, message: "Census Tract revision text copied to clipboard!", severity: "success" });
        setNotes(prev => `${prev}\n- ${revisionText}`);
      },
      ONSpecialAssessmentsRevisionButtonClick: () => {
        const revisionText = `Please revise the 'Special Assessments' "${data["Special Assessments"] || '...'}" field in the Subject section.`;
        navigator.clipboard.writeText(revisionText);
        setNotification({ open: true, message: "Special Assessments revision text copied to clipboard!", severity: "success" });
        setNotes(prev => `${prev}\n- ${revisionText}`);
      },
      onContractPriceRevisionButtonClick: () => setContractPriceRevisionLangDialogOpen(true),
      onFinancialAssistanceRevisionButtonClick: () => setFinancialAssistanceRevisionLangDialogOpen(true),
      onDateOfContractRevisionButtonClick: () => setDateOfContractRevisionLangDialogOpen(true),
      onNeighborhoodBoundariesRevisionButtonClick: () => setNeighborhoodBoundariesRevisionLangDialogOpen(true),
      onViewRevisionButtonClick: () => {
        const revisionText = `Please revise the 'View' "${data["View"] || '...'}" field in the Site section.`;
        navigator.clipboard.writeText(revisionText);
        setNotification({ open: true, message: "View revision text copied to clipboard!", severity: "success" });
        setNotes(prev => `${prev}\n- ${revisionText}`);
      },
      onDimensionsRevisionButtonClick: () => {
        const revisionText = `Please revise the 'Dimensions' "${data["Dimensions"] || '...'}" field in the Site section.`;
        navigator.clipboard.writeText(revisionText);
        setNotification({ open: true, message: "Dimensions revision text copied to clipboard!", severity: "success" });
        setNotes(prev => `${prev}\n- ${revisionText}`);
      },
      onZoningRevisionButtonClick: () => {
        const revisionText = `Please revise the 'Zoning' "${data["Zoning"] || '...'}" field in the Site section.`;
        navigator.clipboard.writeText(revisionText);
        setNotification({ open: true, message: "Zoning revision text copied to clipboard!", severity: "success" });
        setNotes(prev => `${prev}\n- ${revisionText}`);
      },
      onSpecificZoningClassificationRevisionButtonClick: () => {
        const revisionText = `Please revise the 'Specific Zoning Classification' "${data["Specific Zoning Classification"] || '...'}" field in the Site section.`;
        navigator.clipboard.writeText(revisionText);
        setNotification({ open: true, message: "Specific Zoning Classification revision text copied to clipboard!", severity: "success" });
        setNotes(prev => `${prev}\n- ${revisionText}`);
      },
      onShapeRevisionButtonClick: () => {
        const revisionText = `Please revise the 'Shape' "${data["Shape"] || '...'}" field in the Site section.`;
        navigator.clipboard.writeText(revisionText);
        setNotification({ open: true, message: "Shape revision text copied to clipboard!", severity: "success" });
        setNotes(prev => `${prev}\n- ${revisionText}`);
      },
      onElectricityRevisionButtonClick: () => {
        const revisionText = `Please revise the 'Electricity' "${data["Electricity"] || '...'}" field in the Site section.`;
        navigator.clipboard.writeText(revisionText);
        setNotification({ open: true, message: "Electricity revision text copied to clipboard!", severity: "success" });
        setNotes(prev => `${prev}\n- ${revisionText}`);
      },
      onWaterRevisionButtonClick: () => {
        const revisionText = `Please revise the 'Water' "${data["Water"] || '...'}" field in the Site section.`;
        navigator.clipboard.writeText(revisionText);
        setNotification({ open: true, message: "Water revision text copied to clipboard!", severity: "success" });
        setNotes(prev => `${prev}\n- ${revisionText}`);
      },
      onGasRevisionButtonClick: () => {
        const revisionText = `Please revise the 'Gas' "${data["Gas"] || '...'}" field in the Site section.`;
        navigator.clipboard.writeText(revisionText);
        setNotification({ open: true, message: "Gas revision text copied to clipboard!", severity: "success" });
        setNotes(prev => `${prev}\n- ${revisionText}`);
      },
      onFEMAMapDateRevisionButtonClick: () => {
        const revisionText = `Please revise the 'FEMA Map Date' "${data["FEMA Map Date"] || '...'}" field in the Site section.`;
        navigator.clipboard.writeText(revisionText);
        setNotification({ open: true, message: "FEMA Map Date revision text copied to clipboard!", severity: "success" });
        setNotes(prev => `${prev}\n- ${revisionText}`);
      },
      onFEMAFloodZoneRevisionButtonClick: () => {
        const revisionText = `Please revise the 'FEMA Flood Zone' "${data["FEMA Flood Zone"] || '...'}" field in the Site section.`;
        navigator.clipboard.writeText(revisionText);
        setNotification({ open: true, message: "FEMA Flood Zone revision text copied to clipboard!", severity: "success" });
        setNotes(prev => `${prev}\n- ${revisionText}`);
      },
      onZoningComplianceRevisionButtonClick: () => setZoningComplianceRevisionLangDialogOpen(true),
      onOtherLandUseRevisionButtonClick: () => setOtherLandUseRevisionLangDialogOpen(true),
      onAreaRevisionButtonClick: () => setAreaRevisionLangDialogOpen(true),
      onAdverseSiteConditionsRevisionButtonClick: () => {
        const revisionText = "Please revise the checkbox marked for ‘Are there any adverse site conditions…?’ as it does not support the comment.";
        navigator.clipboard.writeText(revisionText);
        setNotification({ open: true, message: "Adverse Site Conditions revision text copied!", severity: "success" });
        setNotes(prev => `${prev}\n- ${revisionText}`);
      },
      // =========================
      // PROJECT SITE
      // =========================
      onTopographyRevisionButtonClick: () => {
        const revisionText = `Please revise the 'Topography' "${data["Topography"] || '...'}" field in the Project Site.`;
        navigator.clipboard.writeText(revisionText);
        setNotification({ open: true, message: "Topography revision text copied!", severity: "success" });
        setNotes(prev => `${prev}\n- ${revisionText}`);
      },
      onSizeRevisionButtonClick: () => {
        const revisionText = `Please revise the 'Size' "${data["Size"] || '...'}" field in the Project Site.`;
        navigator.clipboard.writeText(revisionText);
        setNotification({ open: true, message: "Size revision text copied!", severity: "success" });
        setNotes(prev => `${prev}\n- ${revisionText}`);
      },
      onDensityRevisionButtonClick: () => {
        const revisionText = `Please revise the 'Density' "${data["Density"] || '...'}" field in the Project Site.`;
        navigator.clipboard.writeText(revisionText);
        setNotification({ open: true, message: "Density revision text copied!", severity: "success" });
        setNotes(prev => `${prev}\n- ${revisionText}`);
      },
      ONFEMAMaprevisionButtonClick: () => {
        const revisionText = `Please revise the 'FEMA Map' "${data["FEMA Map"] || '...'}" field in the Project Site.`;
        navigator.clipboard.writeText(revisionText);
        setNotification({ open: true, message: "FEMA Map revision text copied!", severity: "success" });
        setNotes(prev => `${prev}\n- ${revisionText}`);
      },

      // =========================
      // IMPROVEMENTS SECTION
      // =========================
      onImprovementsRevisionButtonClick: () => setImprovementsRevisionLangDialogOpen(true),
      onDesignStyleRevisionButtonClick: () => {
        const revisionText = `Design (Style) "${data["Design (Style)"] || '...'}" in Sales Grid does not match Improvements section; please revise.`;
        navigator.clipboard.writeText(revisionText);
        setNotification({ open: true, message: "Design/Style revision copied!", severity: "success" });
        setNotes(prev => `${prev}\n- ${revisionText}`);
      },
      onExteriorWallsRevisionButtonClick: () => {
        const revisionText = `Please have the condition noted for ‘Exterior Walls’ "${data["Exterior Walls"] || '...'}" under Improvements.`;
        navigator.clipboard.writeText(revisionText);
        setNotification({ open: true, message: "Exterior Walls revision copied!", severity: "success" });
        setNotes(prev => `${prev}\n- ${revisionText}`);
      },
      onSanitarySewerButtonClick: () => {
        const revisionText = `‘Sanitary Sewer’ "${data["Sanitary Sewer"] || '...'}" marked public but noted septic; please revise.`;
        navigator.clipboard.writeText(revisionText);
        setNotification({ open: true, message: "Sanitary Sewer revision copied!", severity: "success" });
        setNotes(prev => `${prev}\n- ${revisionText}`);
      },
      onAlleyClick: () => {
        const revisionText = "Photos show an Alley, but box not checked in Site section; please revise.";
        navigator.clipboard.writeText(revisionText);
        setNotification({ open: true, message: "Alley revision copied!", severity: "success" });
        setNotes(prev => `${prev}\n- ${revisionText}`);
      },
      onHighestAndBestUseClick: () => {
        const revisionText = "Highest and Best Use marked No but description missing; please revise.";
        navigator.clipboard.writeText(revisionText);
        setNotification({ open: true, message: "Highest and Best Use revision copied!", severity: "success" });
        setNotes(prev => `${prev}\n- ${revisionText}`);
      },

      // =========================
      // SALES GRID
      // =========================
      onSalesGridRevisionButtonClick: () => setSalesGridRevisionLangDialogOpen(true),
      onOneWithAccessoryUnitRevisionButtonClick: () => setOneWithAccessoryUnitRevisionLangDialogOpen(true),

      // =========================
      // RECONCILIATION / COST APPROACH / CERTIFICATION
      // =========================
      onReconciliationRevisionButtonClick: () => setReconciliationRevisionLangDialogOpen(true),
      onCostApproachRevisionButtonClick: () => setCostApproachRevisionLangDialogOpen(true),
      onCertificationRevisionButtonClick: () => setCertificationRevisionLangDialogOpen(true),

      // =========================
      // PROPERTY RIGHTS / BORROWER / MISC
      // =========================
      onAddRevision: () => {
        const revisionText = "Please mark that the subject is offered for sale in the section.";
        navigator.clipboard.writeText(revisionText);
        setNotification({ open: true, message: "Revision text copied!", severity: "success" });
        setNotes(prev => `${prev}\n- ${revisionText}`);
      },
      onAddBorrowerRevision: () => {
        const revisionText = "Please add the borrower's middle initial (M) to the report.";
        navigator.clipboard.writeText(revisionText);
        setNotification({ open: true, message: "Borrower revision copied!", severity: "success" });
        setNotes(prev => `${prev}\n- ${revisionText}`);
      },
      onYearBuiltRevisionButtonClick: () => {
        const revisionText = `Please revise the 'Year Built' "${data["Year Built"] || '...'}" field in the section.`;
        navigator.clipboard.writeText(revisionText);
        setNotification({ open: true, message: "Year Built revision text copied!", severity: "success" });
        setNotes(prev => `${prev}\n- ${revisionText}`);
      },
      onBasementAreaRevisionButtonClick: () => {
        const revisionText = `Please revise the 'Basement Area sq.ft.' "${data["Basement Area sq.ft."] || '...'}" field in, in the section.`;
        navigator.clipboard.writeText(revisionText);
        setNotification({ open: true, message: "Basement Area revision text copied!", severity: "success" });
        setNotes(prev => `${prev}\n- ${revisionText}`);
      },
      onGarageAreaRevisionButtonClick: () => {
        const revisionText = `Please revise the 'Garage # of Cars' "${data["Garage # of Cars"] || '...'}" field in, in the section.`;
        navigator.clipboard.writeText(revisionText);
        setNotification({ open: true, message: "Garage # of Cars revision text copied!", severity: "success" });
        setNotes(prev => `${prev}\n- ${revisionText}`);
      },
      onEvidenceofRevisionButtonClick: () => {
        const revisionText = `Please revise the 'Evidence of' "${data["Evidence of"] || '...'}" field in the section.`;
        navigator.clipboard.writeText(revisionText);
        setNotification({ open: true, message: "Evidence of revision text copied!", severity: "success" });
        setNotes(prev => `${prev}\n- ${revisionText}`);
      },
      onFoundationTypeRevisionButtonClick: () => {
        const revisionText = `Please revise the 'Foundation Type' "${data["Foundation Type"] || '...'}" field in the section.`;
        navigator.clipboard.writeText(revisionText);
        setNotification({ open: true, message: "Foundation Type revision text copied!", severity: "success" });
        setNotes(prev => `${prev}\n- ${revisionText}`);
      },

      onBasementFinishRevisionButtonClick: () => {
        const revisionText = `Please revise the 'Basement Finish sq.ft.' "${data["Basement Finish sq.ft."] || '...'}" field in, in the section.`;
        navigator.clipboard.writeText(revisionText);
        setNotification({ open: true, message: "Basement Finish revision text copied!", severity: "success" });
        setNotes(prev => `${prev}\n- ${revisionText}`);

      },
      onEffectiveAgeRevisionButtonClick: () => {
        const revisionText = `Please revise the 'Effective Age' "${data["Effective Age"] || '...'}" field in the section.`;
        navigator.clipboard.writeText(revisionText);
        setNotification({ open: true, message: "Effective Age revision text copied!", severity: "success" });
        setNotes(prev => `${prev}\n- ${revisionText}`);
      },
      onRoofRevisionButtonClick: () => {
        const revisionText = `Please revise the 'Roof' "${data["Roof"] || '...'}" field in the section.`;
        navigator.clipboard.writeText(revisionText);
        setNotification({ open: true, message: "Roof revision text copied!", severity: "success" });
        setNotes(prev => `${prev}\n- ${revisionText}`);
      },
      onHeatingSystemRevisionButtonClick: () => {
        const revisionText = `Please revise the 'Heating System' "${data["Heating System"] || '...'}" field in the section.`;
        navigator.clipboard.writeText(revisionText);
        setNotification({ open: true, message: "Heating System revision text copied!", severity: "success" });
        setNotes(prev => `${prev}\n- ${revisionText}`);
      },
      onFoundationWallsRevisionButtonClick: () => {
        const revisionText = `Please revise the 'Foundation Walls' "${data["Foundation Walls"] || '...'}" field in the section.`;
        navigator.clipboard.writeText(revisionText);
        setNotification({ open: true, message: "Foundation Walls revision text copied!", severity: "success" });
        setNotes(prev => `${prev}\n- ${revisionText}`);
      },
      onGuttersDownspoutsRevisionButtonClick: () => {
        const revisionText = `Please revise the 'Gutters/Downspouts' "${data["Gutters/Downspouts"] || '...'}" field in the section.`;
        navigator.clipboard.writeText(revisionText);
        setNotification({ open: true, message: "Gutters/Downspouts revision text copied!", severity: "success" });
        setNotes(prev => `${prev}\n- ${revisionText}`);
      },
      onWindowTypeRevisionButtonClick: () => {
        const revisionText = `Please revise the 'Window Type' "${data["Window Type"] || '...'}" field in the section.`;
        navigator.clipboard.writeText(revisionText);
        setNotification({ open: true, message: "Window Type revision text copied!", severity: "success" });
        setNotes(prev => `${prev}\n- ${revisionText}`);
      },
      onWallsRevisionButtonClick: () => {
        const revisionText = `Please revise the 'Walls' "${data["Walls"] || '...'}" field in the section.`;
        navigator.clipboard.writeText(revisionText);
        setNotification({ open: true, message: "Walls revision text copied!", severity: "success" });
        setNotes(prev => `${prev}\n- ${revisionText}`);
      },
      ontrimRevisionButtonClick: () => {
        const revisionText = `Please revise the 'Trim' "${data["Trim"] || '...'}" field in the section.`;
        navigator.clipboard.writeText(revisionText);
        setNotification({ open: true, message: "Trim revision text copied!", severity: "success" });
        setNotes(prev => `${prev}\n- ${revisionText}`);
      },
      onbsthwainscotRevisionButtonClick: () => {
        const revisionText = `Please revise the 'Bsthwainscot' "${data["Bsthwainscot"] || '...'}" field in the section.`;
        navigator.clipboard.writeText(revisionText);
        setNotification({ open: true, message: "Bsthwainscot revision text copied!", severity: "success" });
        setNotes(prev => `${prev}\n- ${revisionText}`);
      },
      onCoolingTypeRevisionButtonClick: () => {
        const revisionText = `Please revise the 'Cooling Type' "${data["Cooling Type"] || '...'}" field in the section.`;
        navigator.clipboard.writeText(revisionText);
        setNotification({ open: true, message: "Cooling Type revision text copied!", severity: "success" });
        setNotes(prev => `${prev}\n- ${revisionText}`);
      },
      onFireplaceRevisionButtonClick: () => {
        const revisionText = `Please revise the 'Fireplace' "${data["Fireplace"] || '...'}" field in the section.`;
        navigator.clipboard.writeText(revisionText);
        setNotification({ open: true, message: "Fireplace revision text copied!", severity: "success" });
        setNotes(prev => `${prev}\n- ${revisionText}`);
      },
      onPoolRevisionButtonClick: () => {
        const revisionText = `Please revise the 'Pool' "${data["Pool"] || '...'}" field in the section.`;
        navigator.clipboard.writeText(revisionText);
        setNotification({ open: true, message: "Pool revision text copied!", severity: "success" });
        setNotes(prev => `${prev}\n- ${revisionText}`);
      },
      onCarportRevisionButtonClick: () => {
        const revisionText = `Please revise the 'Carport' "${data["Carport"] || '...'}" field in the section.`;
        navigator.clipboard.writeText(revisionText);
        setNotification({ open: true, message: "Carport revision text copied!", severity: "success" });
        setNotes(prev => `${prev}\n- ${revisionText}`);
      },
      onDrivewaySurfaceRevisionButtonClick: () => {
        const revisionText = `Please revise the 'Driveway Surface' "${data["Driveway Surface"] || '...'}" field in the section.`;
        navigator.clipboard.writeText(revisionText);
        setNotification({ open: true, message: "Driveway Surface revision text copied!", severity: "success" });
        setNotes(prev => `${prev}\n- ${revisionText}`);
      },
      onAtticRevisionButtonClick: () => {
        const revisionText = `Please revise the 'Attic' "${data["Attic"] || '...'}" field in the section.`;
        navigator.clipboard.writeText(revisionText);
        setNotification({ open: true, message: "Attic revision text copied!", severity: "success" });
        setNotes(prev => `${prev}\n- ${revisionText}`);
      },
      onGarageRevisionButtonClick: () => {
        const revisionText = `Please revise the 'Garage' "${data["Garage"] || '...'}" field in the section.`;
        navigator.clipboard.writeText(revisionText);
        setNotification({ open: true, message: "Garage revision text copied!", severity: "success" });
        setNotes(prev => `${prev}\n- ${revisionText}`);
      },
      ONAppliancesRevisionButtonClick: () => {
        const revisionText = `Please revise the 'Appliances' "${data["Appliances"] || '...'}" field in the section.`;
        navigator.clipboard.writeText(revisionText);
        setNotification({ open: true, message: "Appliances revision text copied!", severity: "success" });
        setNotes(prev => `${prev}\n- ${revisionText}`);
      },
      onFinishedareaRevisionButtonClick: () => {
        const revisionText = `Please revise the 'Finished Area sq.ft.' "${data["Finished Area sq.ft."] || '...'}" field in the section.`;
        navigator.clipboard.writeText(revisionText);
        setNotification({ open: true, message: "Finished Area revision text copied!", severity: "success" });
        setNotes(prev => `${prev}\n- ${revisionText}`);
      },

      ONFenceRevisionButtonClick: () => {
        const revisionText = `Please revise the 'Fence' "${data["Fence"] || '...'}" field in the section.`;
        navigator.clipboard.writeText(revisionText);
        setNotification({ open: true, message: "Fence revision text copied!", severity: "success" });
        setNotes(prev => `${prev}\n- ${revisionText}`);
      },
      onSquareFeetOfGrossLivingAreaAboveGradeRevisionButtonClick: () => {
        const revisionText = `Please revise the 'Square Feet of Gross Living Area Above Grade' "${data["Square Feet of Gross Living Area Above Grade"] || '...'}" field in the section.`;
        navigator.clipboard.writeText(revisionText);
        setNotification({ open: true, message: "Square Feet of Gross Living Area Above Grade revision text copied!", severity: "success" });
        setNotes(prev => `${prev}\n- ${revisionText}`);
      },
      onAdditionalfeaturesRevisionButtonClick: () => {
        const revisionText = `Please revise the 'Additional Features' "${data["Additional Features"] || '...'}" field in the section.`;
        navigator.clipboard.writeText(revisionText);
        setNotification({ open: true, message: "Additional Features revision text copied!", severity: "success" });
        setNotes(prev => `${prev}\n- ${revisionText}`);
      },
      onconditionRevisionButtonClick: () => {
        const revisionText = `Please revise the 'Condition' "${data["Condition"] || '...'}" field in the section.`;
        navigator.clipboard.writeText(revisionText);
        setNotification({ open: true, message: "Condition revision text copied!", severity: "success" });
        setNotes(prev => `${prev}\n- ${revisionText}`);
      },
      ontotaldollaramountRevisionButtonClick: () => {
        const revisionText = `Please revise the 'Total Dollar Amount' "${data["Total Dollar Amount"] || '...'}" field in the section.`;
        navigator.clipboard.writeText(revisionText);
        setNotification({ open: true, message: "Total Dollar Amount revision text copied!", severity: "success" });
        setNotes(prev => `${prev}\n- ${revisionText}`);
      },
      onBuiltUpRevisionButtonClick: () => {
        const revisionText = `Please revise the 'Built Up' "${data["Built Up"] || '...'}" field in the section.`;
        navigator.clipboard.writeText(revisionText);
        setNotification({ open: true, message: "Built Up revision text copied!", severity: "success" });
        setNotes(prev => `${prev}\n- ${revisionText}`);
      },
      onPropertyValuesRevisionButtonClick: () => {
        const revisionText = `Please revise the 'Property Values' "${data["Property Values"] || '...'}" field in the section.`;
        navigator.clipboard.writeText(revisionText);
        setNotification({ open: true, message: "Property Values revision text copied!", severity: "success" });
        setNotes(prev => `${prev}\n- ${revisionText}`);
      },
      onMarketingTimeRevisionButtonClick: () => {
        const revisionText = `Please revise the 'Marketing Time' "${data["Marketing Time"] || '...'}" field in the section.`;
        navigator.clipboard.writeText(revisionText);
        setNotification({ open: true, message: "Marketing Time revision text copied!", severity: "success" });
        setNotes(prev => `${prev}\n- ${revisionText}`);
      }, ONTwoUnitrevisionButtonClick: () => {
        const revisionText = `Please revise the 'Two Unit' "${data["Two Unit"] || '...'}" field in the section.`;
        navigator.clipboard.writeText(revisionText);
        setNotification({ open: true, message: "Two Unit revision text copied!", severity: "success" });
        setNotes(prev => `${prev}\n- ${revisionText}`);
      }, ONMultiFamilyrevisionButtonClick: () => {
        const revisionText = `Please revise the 'Multi Family' "${data["Multi Family"] || '...'}" field in the section.`;
        navigator.clipboard.writeText(revisionText);
        setNotification({ open: true, message: "Multi Family revision text copied!", severity: "success" });
        setNotes(prev => `${prev}\n- ${revisionText}`);
      },
      ONTWOUNITAGErevisionButtonClick: () => {
        const revisionText = `Please revise the 'one unit housing age(high,low,pred)' "${data["one unit housing age(high,low,pred)"] || '...'}" field in the section.`;
        navigator.clipboard.writeText(revisionText);
        setNotification({ open: true, message: "Multi Family revision text copied!", severity: "success" });
        setNotes(prev => `${prev}\n- ${revisionText}`);
      },
      ONMarketConditionsrevisionButtonClick: () => {
        const revisionText = `Please revise the 'Market Conditions:' "${data["Market Conditions:"] || '...'}" field in the section.`;
        navigator.clipboard.writeText(revisionText);
        setNotification({ open: true, message: "Market Conditions: revision text copied!", severity: "success" });
        setNotes(prev => `${prev}\n- ${revisionText}`);
      },

      ONNeighborhoodDescriptionrevisionButtonClick: () => {
        const revisionText = `Please revise the 'Neighborhood Description' "${data["Neighborhood Description"] || '...'}" field in the section.`;
        navigator.clipboard.writeText(revisionText);
        setNotification({ open: true, message: "Neighborhood Description revision text copied!", severity: "success" });
        setNotes(prev => `${prev}\n- ${revisionText}`);
      },
      ONONEUNITHOUSINGrevisionButtonClick: () => {
        const revisionText = `Please revise the 'One Unit Housing' "${data["One Unit Housing"] || '...'}" field in the section.`;
        navigator.clipboard.writeText(revisionText);
        setNotification({ open: true, message: "One Unit Housing revision text copied!", severity: "success" });
        setNotes(prev => `${prev}\n- ${revisionText}`);
      },
      ONCommercialrevisionButtonClick: () => {
        const revisionText = `Please revise the 'Commercial' "${data["Commercial"] || '...'}" field in the section.`;
        navigator.clipboard.writeText(revisionText);
        setNotification({ open: true, message: "Commercial revision text copied!", severity: "success" });
        setNotes(prev => `${prev}\n- ${revisionText}`);
      },

      ONOneUnitrevisionButtonClick: () => {
        const revisionText = `Please revise the 'One Unit' "${data["One Unit"] || '...'}" field in the section.`;
        navigator.clipboard.writeText(revisionText);
        setNotification({ open: true, message: "One Unit revision text copied!", severity: "success" });
        setNotes(prev => `${prev}\n- ${revisionText}`);
      },
      ONDemandSupplyRevisionButtonClick: () => {
        const revisionText = `Please revise the 'Demand/Supply' "${data["Demand/Supply"] || '...'}" field in the section.`;
        navigator.clipboard.writeText(revisionText);
        setNotification({ open: true, message: "Demand/Supply revision text copied!", severity: "success" });
        setNotes(prev => `${prev}\n- ${revisionText}`);
      },
      ONGrowthRevisionButtonClick: () => {
        const revisionText = `Please revise the 'Growth' "${data["Growth"] || '...'}" field in the section.`;
        navigator.clipboard.writeText(revisionText);
        setNotification({ open: true, message: "Growth revision text copied!", severity: "success" });
        setNotes(prev => `${prev}\n- ${revisionText}`);
      },
      onLocationRevisionButtonClick: () => {
        const revisionText = `Please revise the 'Location' "${data["Location"] || '...'}" field in the section.`;
        navigator.clipboard.writeText(revisionText);
        setNotification({ open: true, message: "Location revision text copied!", severity: "success" });
        setNotes(prev => `${prev}\n- ${revisionText}`);
      },
      oncontractDataSourceRevisionButtonClick: () => {
        const revisionText = `Please revise the 'Contract Data Source' "${data["Contract Data Source"] || '...'}" field in the section.`;
        navigator.clipboard.writeText(revisionText);
        setNotification({ open: true, message: "Contract Data Source revision text copied!", severity: "success" });
        setNotes(prev => `${prev}\n- ${revisionText}`);
      },

      oncontractdiddidnotRevisionButtonClick: () => {
        const revisionText = `Please revise the 'Contract Did/Did Not' "${data["Contract Did/Did Not"] || '...'}" field in the section.`;
        navigator.clipboard.writeText(revisionText);
        setNotification({ open: true, message: "Contract Did/Did Not revision text copied!", severity: "success" });
        setNotes(prev => `${prev}\n- ${revisionText}`);
      },
      onpropertygenerallyconformRevisionButtonClick: () => {
        const revisionText = `Please revise the 'Property Generally Conform' "${data["Property Generally Conform"] || '...'}" field in the section.`;
        navigator.clipboard.writeText(revisionText);
        setNotification({ open: true, message: "Property Generally Conform revision text copied!", severity: "success" });
        setNotes(prev => `${prev}\n- ${revisionText}`);
      },
      onpropertygenerallyRevisionButtonClick: () => {
        const revisionText = `Please revise the 'Property Generally' "${data["Property Generally"] || '...'}" field in the section.`;
        navigator.clipboard.writeText(revisionText);
        setNotification({ open: true, message: "Property Generally revision text copied!", severity: "success" });
        setNotes(prev => `${prev}\n- ${revisionText}`);
      },
      onphysicaldeficienciesRevisionButtonClick: () => {
        const revisionText = `Please revise the 'Physical Deficiencies' "${data["Physical Deficiencies"] || '...'}" field in the section.`;
        navigator.clipboard.writeText(revisionText);
        setNotification({ open: true, message: "Physical Deficiencies revision text copied!", severity: "success" });
        setNotes(prev => `${prev}\n- ${revisionText}`);
      },
      onFinishedAreaAboveGradeBathroomsRevisionButtonClick: () => {
        const revisionText = `Please revise the 'Finished Area Above Grade Bathroom(s)' "${data["Finished Area Above Grade Bathroom(s)"] || '...'}" field in the section.`;
        navigator.clipboard.writeText(revisionText);
        setNotification({ open: true, message: "Finished Area Above Grade Bathroom(s) revision text copied!", severity: "success" });
        setNotes(prev => `${prev}\n- ${revisionText}`);
      },
      onFinishedAreaAboveGradeBathsRevisionButtonClick: () => {
        const revisionText = `Please revise the 'Finished Area Above Grade Bath(s)' "${data["Finished Area Above Grade Bath(s)"] || '...'}" field in the section.`;
        navigator.clipboard.writeText(revisionText);
        setNotification({ open: true, message: "Finished Area Above Grade Bath(s) revision text copied!", severity: "success" });
        setNotes(prev => `${prev}\n- ${revisionText}`);
      },
      onFinishedAreaAboveGradeBedroomsRevisionButtonClick: () => {
        const revisionText = `Please revise the 'Finished Area Above Grade Bedrooms' "${data["Finished Area Above Grade Bedrooms"] || '...'}" field in the section.`;
        navigator.clipboard.writeText(revisionText);
        setNotification({ open: true, message: "Finished Area Above Grade Bedrooms revision text copied!", severity: "success" });
        setNotes(prev => `${prev}\n- ${revisionText}`);
      },


      onDrivewayRevisionButtonClick: () => {
        const revisionText = `Please revise the 'Driveway' "${data["Driveway"] || '...'}" field in the section.`;
        navigator.clipboard.writeText(revisionText);
        setNotification({ open: true, message: "Driveway revision text copied!", severity: "success" });
        setNotes(prev => `${prev}\n- ${revisionText}`);
      },
      onCarStorageRevisionButtonClick: () => {
        const revisionText = `Please revise the 'Car Storage' "${data["Car Storage"] || '...'}" field in the section.`;
        navigator.clipboard.writeText(revisionText);
        setNotification({ open: true, message: "Car Storage revision text copied!", severity: "success" });
        setNotes(prev => `${prev}\n- ${revisionText}`);
      },
      onPatioDeckrevisionButtonClick: () => {
        const revisionText = `Please revise the 'Patio/Deck' "${data["Patio/Deck"] || '...'}" field in the section.`;
        navigator.clipboard.writeText(revisionText);
        setNotification({ open: true, message: "Patio/Deck revision text copied!", severity: "success" });
        setNotes(prev => `${prev}\n- ${revisionText}`);
      },
      onWoodstoveRevisionButtonClick: () => {
        const revisionText = `Please revise the 'Woodstove' "${data["Woodstove"] || '...'}" field in the section.`;
        navigator.clipboard.writeText(revisionText);
        setNotification({ open: true, message: "Woodstove revision text copied!", severity: "success" });
        setNotes(prev => `${prev}\n- ${revisionText}`);
      },
      onbathfloorRevisionButtonClick: () => {
        const revisionText = `Please revise the 'Bath Floor (Material/Condition)' "${data["Bath Floor (Material/Condition)"] || '...'}" field in the section.`;
        navigator.clipboard.writeText(revisionText);
        setNotification({ open: true, message: "Bath Floor revision text copied!", severity: "success" });
        setNotes(prev => `${prev}\n- ${revisionText}`);
      },

      onFloorsRevisionButtonClick: () => {
        const revisionText = `Please revise the 'Floors' "${data["Floors"] || '...'}" field in the section.`;
        navigator.clipboard.writeText(revisionText);
        setNotification({ open: true, message: "Floors revision text copied!", severity: "success" });
        setNotes(prev => `${prev}\n- ${revisionText}`);
      },
      onScreensRevisionButtonClick: () => {
        const revisionText = `Please revise the 'Screens' "${data["Screens"] || '...'}" field in the section.`;
        navigator.clipboard.writeText(revisionText);
        setNotification({ open: true, message: "Screens revision text copied!", severity: "success" });
        setNotes(prev => `${prev}\n- ${revisionText}`);
      },
      onStormSashInsulatedRevisionButtonClick: () => {
        const revisionText = `Please revise the 'Storm Sash/Insulated' "${data["Storm Sash/Insulated"] || '...'}" field in the section.`;
        navigator.clipboard.writeText(revisionText);
        setNotification({ open: true, message: "Storm Sash/Insulated revision text copied!", severity: "success" });
        setNotes(prev => `${prev}\n- ${revisionText}`);
      },
      onWindowRevisionButtonClick: () => {
        const revisionText = `Please revise the 'Window' "${data["Window"] || '...'}" field in the section.`;
        navigator.clipboard.writeText(revisionText);
        setNotification({ open: true, message: "Window revision text copied!", severity: "success" });
        setNotes(prev => `${prev}\n- ${revisionText}`);
      },
      onFuelRevisionButtonClick: () => {
        const revisionText = `Please revise the 'Fuel' "${data["Fuel"] || '...'}" field in the Subject section.`;
        navigator.clipboard.writeText(revisionText);
        setNotification({ open: true, message: "Fuel revision text copied!", severity: "success" });
        setNotes(prev => `${prev}\n- ${revisionText}`);
      },

      onproposedUseRevisionButtonClick: () => {
        const revisionText = "Improvements section: Under general description, the checkbox is marked on ‘Proposed’; however, photos indicate the under-construction property; please revise.";
        navigator.clipboard.writeText(revisionText);
        setNotification({ open: true, message: "Proposed Use revision text copied!", severity: "success" });
        setNotes(prev => `${prev}\n- ${revisionText}`);
      },
      onTypeRevisionButtonClick: () => {
        const revisionText = `Please revise the 'Type' "${data["Type"] || '...'}" field in the Subject section.`;
        navigator.clipboard.writeText(revisionText);
        setNotification({ open: true, message: "Revision text copied!", severity: "success" });
        setNotes(prev => `${prev}\n- ${revisionText}`);
      },

      onofStoriesRevisionButtonClick: () => {
        const revisionText = `Please revise the '# of Stories' "${data["# of Stories"] || '...'}" field in the Subject section.`;
        navigator.clipboard.writeText(revisionText);
        setNotification({ open: true, message: "Revision text copied!", severity: "success" });
        setNotes(prev => `${prev}\n- ${revisionText}`);
      },
      onAddEmptyBorrowerRevision: () => {
        const revisionText = `Please add the borrower's "${data["borrower's "] || '...'}" to the report.`;
        navigator.clipboard.writeText(revisionText);
        setNotification({ open: true, message: "Borrower revision copied!", severity: "success" });
        setNotes(prev => `${prev}\n- ${revisionText}`);
      },
      onAddLegalDescRevision: () => {
        const revisionText = "Legal Description noted as 'see attached addendum'  but missing; please revise.";
        navigator.clipboard.writeText(revisionText);
        setNotification({ open: true, message: "Legal Description revision copied!", severity: "success" });
        setNotes(prev => `${prev}\n- ${revisionText}`);
      },
      onLegalDescriptionUseClick: () => {
        const revisionText = "Please have the ‘Legal Description’ noted in the report.";
        navigator.clipboard.writeText(revisionText);
        setNotification({ open: true, message: "Legal Description revision copied!", severity: "success" });
        setNotes(prev => `${prev}\n- ${revisionText}`);
      },
      onAddPropertyRightsRevision: () => {
        const revisionText = "Please revise Property Rights Appraised to fee simple.";
        navigator.clipboard.writeText(revisionText);
        setNotification({ open: true, message: "Property Rights revision copied!", severity: "success" });
        setNotes(prev => `${prev}\n- ${revisionText}`);
      },
      onAddParcelNumberRevision: () => {
        const revisionText = `Please have the ‘Assessor's Parcel #’  "${data["Assessor's Parcel #"] || '...'}" noted in the subject section.`;
        navigator.clipboard.writeText(revisionText);
        setNotification({ open: true, message: "Parcel Number revision copied!", severity: "success" });
        setNotes(prev => `${prev}\n- ${revisionText}`);
      },
      onAddOwnerOfRecordRevision: () => {
        const revisionText = "Please include an owner of public record on page 1.";
        navigator.clipboard.writeText(revisionText);
        setNotification({ open: true, message: "Owner of Record revision copied!", severity: "success" });
        setNotes(prev => `${prev}\n- ${revisionText}`);
      },
      onLenderClientAddressRevisionButtonClick: () => setLenderClientAddressRevisionLangDialogOpen(true),
      onLenderClientRevisionButtonClick: () => setLenderClientRevisionLangDialogOpen(true),
      onAddAssignmentTypeRevision: () => {
        const revisionText = "Please revise the checkbox for assignment type to refinance transaction.";
        navigator.clipboard.writeText(revisionText);
        setNotification({ open: true, message: "Assignment revision copied!", severity: "success" });
        setNotes(prev => `${prev}\n- ${revisionText}`);
      },
      ONCountyRevisionButtonClick: () => {
        const revisionText = `Please revise the 'County' "${data["County"] || '...'}" field in the Subject section.`;
        navigator.clipboard.writeText(revisionText);
        setNotification({ open: true, message: "County revision text copied to clipboard!", severity: "success" });
        setNotes(prev => `${prev}\n- ${revisionText}`);
      },
      ONTaxYearRevisionButtonClick: () => {
        const revisionText = `Please revise the 'Tax Year' "${data["Tax Year"] || '...'}" field in the Subject section.`;
        navigator.clipboard.writeText(revisionText);
        setNotification({ open: true, message: "Tax Year revision text copied to clipboard!", severity: "success" });
        setNotes(prev => `${prev}\n- ${revisionText}`);
      },
      ONZipCodeRevisionButtonClick: () => {
        const revisionText = `Please revise the 'Zip Code' "${data["Zip Code"] || '...'}" field in the Subject section.`;
        navigator.clipboard.writeText(revisionText);
        setNotification({ open: true, message: "Zip Code revision text copied to clipboard!", severity: "success" });
        setNotes(prev => `${prev}\n- ${revisionText}`);
      },
      ONReportdataRevisionButtonClick: () => {
        const revisionText = `Please revise the 'Report Data' "${data["Report Data"] || '...'}" field in the Subject section.`;
        navigator.clipboard.writeText(revisionText);
        setNotification({ open: true, message: "Report Data revision text copied to clipboard!", severity: "success" });
        setNotes(prev => `${prev}\n- ${revisionText}`);
      },
      ONPUDRevisionButtonClick: () => {
        const revisionText = `Please revise the 'PUD' "${data["PUD"] || '...'}" field in the Subject section.`;
        navigator.clipboard.writeText(revisionText);
        setNotification({ open: true, message: "PUD revision text copied to clipboard!", severity: "success" });
        setNotes(prev => `${prev}\n- ${revisionText}`);
      },
      ONOccupantRevisionButtonClick: () => {
        const revisionText = `Please revise the 'Occupant' "${data["Occupant"] || '...'}" field in the Subject section.`;
        navigator.clipboard.writeText(revisionText);
        setNotification({ open: true, message: "Occupant revision text copied to clipboard!", severity: "success" });
        setNotes(prev => `${prev}\n- ${revisionText}`);
      },
      ONComparablePropertiesRevisionButtonClick: () => {
        const revisionText = `Please revise the 'Sales Comparison Approach' "${data["Sales Comparison Approach"] || '...'}" field in the Subject section.`;
        navigator.clipboard.writeText(revisionText);
        setNotification({ open: true, message: "Sales Comparison Approach revision text copied to clipboard!", severity: "success" });
        setNotes(prev => `${prev}\n- ${revisionText}`);
      },
      ONUnitsRevisionButtonClick: () => {
        const revisionText = `Please revise the 'Units' "${data["Units"] || '...'}" field in the Subject section.`;
        navigator.clipboard.writeText(revisionText);
        setNotification({ open: true, message: "Units revision text copied to clipboard!", severity: "success" });
        setNotes(prev => `${prev}\n- ${revisionText}`);
      },
      ONcomparablepropertyrevisionButtonClick: () => {
        const revisionText = "Please revise the 'Sales Comparison Approach' field in the Subject section.";
        navigator.clipboard.writeText(revisionText);
        setNotification({ open: true, message: "Sales Comparison Approach revision text copied to clipboard!", severity: "success" });
        setNotes(prev => `${prev}\n- ${revisionText}`);
      },
      ONMapReferencerevisionButtonClick: () => {
        const revisionText = `Please revise the 'Map Reference' "${data["Map Reference"] || '...'}" field in the Subject section.`;
        navigator.clipboard.writeText(revisionText);
        setNotification({ open: true, message: "Map Reference revision text copied to clipboard!", severity: "success" });
        setNotes(prev => `${prev}\n- ${revisionText}`);
      },

      ONCityRevisionButtonClick: () => {
        const revisionText = `Please revise the 'City' "${data["City"] || '...'}" field in the Subject section.`;
        navigator.clipboard.writeText(revisionText);
        setNotification({ open: true, message: "City revision text copied to clipboard!", severity: "success" });
        setNotes(prev => `${prev}\n- ${revisionText}`);
      },
      onHoaRevisionButtonClick: () => {
        const revisionText = `Please revise the 'HOA Dues' "${data["HOA Dues"] || '...'}" field in the Subject section.`;
        navigator.clipboard.writeText(revisionText);
        setNotification({ open: true, message: "HOA Dues revision text copied to clipboard!", severity: "success" });
        setNotes(prev => `${prev}\n- ${revisionText}`);
      },

      onStateRevisionButtonClick: () => {
        const revisionText = `Please revise the 'State' "${data["State"] || '...'}" field in the Subject section.`;
        navigator.clipboard.writeText(revisionText);
        setNotification({ open: true, message: "State revision text copied to clipboard!", severity: "success" });
        setNotes(prev => `${prev}\n- ${revisionText}`);
      },
      onRETaxesRevisionButtonClick: () => {
        const revisionText = `Please revise the R.E. Taxes $ "${data["R.E. Taxes $"] || '...'}" must only contain numbers and currency symbols.`;
        navigator.clipboard.writeText(revisionText);
        setNotification({ open: true, message: "Real Estate Taxes revision text copied to clipboard!", severity: "success" });
        setNotes(prev => `${prev}\n- ${revisionText}`);
      },
      onFemaHazardRevisionButtonClick: () => {
        const revisionText = `‘FEMA Special Flood Hazard Area' "${data["FEMA Special Flood Hazard Area"] || '...'}"  marked NO but Zone is AE; please revise.`;
        navigator.clipboard.writeText(revisionText);
        setNotification({ open: true, message: "FEMA Hazard revision copied!", severity: "success" });
        setNotes(prev => `${prev}\n- ${revisionText}`);
      },
      onOffSiteImprovementsButtonClick: () => {
        const revisionText = `Please check a box for 'Are the utilities/off-site improvements typical?' "${data["Are the utilities/off-site improvements typical?"] || '...'}" `;
        navigator.clipboard.writeText(revisionText);
        setNotification({ open: true, message: "Off-Site Improvements revision copied!", severity: "success" });
        setNotes(prev => `${prev}\n- ${revisionText}`);
      },

      // SALES GRID 
      onGRID1ButtonClick: () => {
        const revisionText = "Critical Error: Research on sale/transfer history must be performed. 'did not' is not acceptable";
        navigator.clipboard.writeText(revisionText);
        setNotification({ open: true, message: "sale/transfer history revision copied!", severity: "success" });
        setNotes(prev => `${prev}\n- ${revisionText}`);
      },
      onGRID2ButtonClick: () => {
        const revisionText = `If prior sales were revealed, 'Date of Prior Sale/Transfer' "${data["Date of Prior Sale/Transfer"] || '...'}" and 'Price of Prior Sale/Transfer' "${data["Price of Prior Sale/Transfer"] || '...'}" for the Subject must be filled.`;
        navigator.clipboard.writeText(revisionText);
        setNotification({ open: true, message: "sale/transfer history revision copied!", severity: "success" });
        setNotes(prev => `${prev}\n- ${revisionText}`);
      },
      onGRID3ButtonClick: () => {
        const revisionText = "Data Source(s) for subject property research";
        navigator.clipboard.writeText(revisionText);
        setNotification({ open: true, message: "sale/transfer history revision copied!", severity: "success" });
        setNotes(prev => `${prev}\n- ${revisionText}`);
      },
      onGRID4ButtonClick: () => {
        const revisionText = "My research did did not reveal any prior sales or transfers of the comparable sales for the year prior to the date of sale of the comparable sale.";
        navigator.clipboard.writeText(revisionText);
        setNotification({ open: true, message: "sale/transfer history revision copied!", severity: "success" });
        setNotes(prev => `${prev}\n- ${revisionText}`);
      },
      onGRID5ButtonClick: () => {
        const revisionText = "Data Source(s) for comparable sales research.";
        navigator.clipboard.writeText(revisionText);
        setNotification({ open: true, message: "sale/transfer history revision copied!", severity: "success" });
        setNotes(prev => `${prev}\n- ${revisionText}`);
      },
      onGRID6ButtonClick: () => {
        const revisionText = "Analysis of prior sale or transfer history of the subject property and comparable sales";
        navigator.clipboard.writeText(revisionText);
        setNotification({ open: true, message: "Analysis of prior sale or transfer history of the subject property and comparable sales", severity: "success" });
        setNotes(prev => `${prev}\n- ${revisionText}`);
      },
      onGRID7ButtonClick: () => {
        const revisionText = "Summary of Sales Comparison Approach";
        navigator.clipboard.writeText(revisionText);
        setNotification({ open: true, message: "Summary of Sales Comparison Approach", severity: "success" });
        setNotes(prev => `${prev}\n- ${revisionText}`);
      },
      onGRID8ButtonClick: () => {
        const revisionText = "Indicated Value by Sales Comparison Approach $";
        navigator.clipboard.writeText(revisionText);
        setNotification({ open: true, message: "Indicated Value by Sales Comparison Approach $", severity: "success" });
        setNotes(prev => `${prev}\n- ${revisionText}`);
      },

      // CERTIFICATION

      onSignatureButtonClick: () => {
        const revisionText = "Signature";
        navigator.clipboard.writeText(revisionText);
        setNotification({ open: true, message: "Signature", severity: "success" });
        setNotes(prev => `${prev}\n- ${revisionText}`);
      },
      onNameButtonClick: () => {
        const revisionText = `Please revise the 'Name' "${data["Name"] || '...'}" field in the section.`;
        navigator.clipboard.writeText(revisionText);
        setNotification({ open: true, message: "Name", severity: "success" });
        setNotes(prev => `${prev}\n- ${revisionText}`);
      }, onCompanyNameButtonClick: () => {
        const revisionText = `Please revise the 'Company Name' "${data["Company Name"] || '...'}" field in the section.`;
        navigator.clipboard.writeText(revisionText);
        setNotification({ open: true, message: "Company Name", severity: "success" });
        setNotes(prev => `${prev}\n- ${revisionText}`);
      }, onCompanyAddressButtonClick: () => {
        const revisionText = `Please revise the 'Company Address' "${data["Company Address"] || '...'}" field in the section.`;
        navigator.clipboard.writeText(revisionText);
        setNotification({ open: true, message: "Company Address", severity: "success" });
        setNotes(prev => `${prev}\n- ${revisionText}`);
      }, onTelephoneNumberButtonClick: () => {
        const revisionText = `Please revise the 'Telephone Number' "${data["Telephone Number"] || '...'}" field in the section.`;
        navigator.clipboard.writeText(revisionText);
        setNotification({ open: true, message: "Telephone Number", severity: "success" });
        setNotes(prev => `${prev}\n- ${revisionText}`);
      },
      onEmailButtonClick: () => {
        const revisionText = `Please revise the "Email" "${data["Email"] || '...'}" field in the section.`;
        navigator.clipboard.writeText(revisionText);
        setNotification({ open: true, message: "Email", severity: "success" });
        setNotes(prev => `${prev}\n- ${revisionText}`);
      },
      onDATESignatureButtonClick: () => {
        const revisionText = `Please revise the "Date" "${data["Date of Signature and Report"] || '...'}" field in the section.`;
        navigator.clipboard.writeText(revisionText);
        setNotification({ open: true, message: "Date", severity: "success" });
        setNotes(prev => `${prev}\n- ${revisionText}`);
      },
      ONEffectiveDateofAppraisal: () => {
        const revisionText = `Please revise the Effective Date of Appraisal "${data["Effective Date of Appraisal"] || '...'}" field in the section.`;
        navigator.clipboard.writeText(revisionText);
        setNotification({ open: true, message: "Effective Date of Appraisal", severity: "success" });
        setNotes(prev => `${prev}\n- ${revisionText}`);
      },
      ONSTATE1ofAppraisal: () => {
        const revisionText = `Please revise the "State Certification #/or State License #/or Other (describe)/State #" "${data["State Certification #"] || '...'}" field in the section.`;
        navigator.clipboard.writeText(revisionText);
        setNotification({ open: true, message: "State Certification #/or State License #/or Other (describe)/State #", severity: "success" });
        setNotes(prev => `${prev}\n- ${revisionText}`);
      },
      ONADDRESSOFPROPERTYAppraisal: () => {
        const revisionText = `Please revise the "ADDRESS OF PROPERTY APPRAISED" "${data["Address of Property Appraised"] || '...'}" field in the section.`;
        navigator.clipboard.writeText(revisionText);
        setNotification({ open: true, message: "ADDRESS OF PROPERTY APPRAISED ", severity: "success" });
        setNotes(prev => `${prev}\n- ${revisionText}`);
      },
      ONAPPRAISEDVALUEofAppraisal: () => {
        const revisionText = `Please revise the "APPRAISED VALUE OF SUBJECT PROPERTY $" "${data["Appraised Value of Subject Property"] || '...'}" field in the section.`;
        navigator.clipboard.writeText(revisionText);
        setNotification({ open: true, message: "APPRAISED VALUE OF SUBJECT PROPERTY $", severity: "success" });
        setNotes(prev => `${prev}\n- ${revisionText}`);
      },
      ONCLIENTNameAppraisal: () => {
        const revisionText = `Please revise the "LENDER/CLIENT Name" "${data["Lender/Client Name"] || '...'}" field in the section.`;
        navigator.clipboard.writeText(revisionText);
        setNotification({ open: true, message: "LENDER/CLIENT Name", severity: "success" });
        setNotes(prev => `${prev}\n- ${revisionText}`);
      },
      ONCompanyName: () => {
        const revisionText = `Please revise the "Lender/Client Company NAME" "${data["Lender/Client Company Name"] || '...'}" field in the section.`;
        navigator.clipboard.writeText(revisionText);
        setNotification({ open: true, message: "Lender/Client Company NAME", severity: "success" });
        setNotes(prev => `${prev}\n- ${revisionText}`);
      },

      ONCompanyAddress: () => {
        const revisionText = `Please revise the "Lender/Client COMPANY Address" "${data["Lender/Client Company Address"] || '...'}" field in the section.`;
        navigator.clipboard.writeText(revisionText);
        setNotification({ open: true, message: "Lender/Client COMPANY Address", severity: "success" });
        setNotes(prev => `${prev}\n- ${revisionText}`);
      },
      ONEmailAddress: () => {
        const revisionText = `Please revise the "Lender/Client Email Address" "${data["Lender/Client Email Address"] || '...'}" field in the section.`;
        navigator.clipboard.writeText(revisionText);
        setNotification({ open: true, message: "Lender/Client Email Address", severity: "success" });
        setNotes(prev => `${prev}\n- ${revisionText}`);
      },

      ONInsurance: () => {
        const revisionText = `Please revise the "Insurance COPY" "${data["Insurance Copy"] || '...'}" in the report.`;
        navigator.clipboard.writeText(revisionText);
        setNotification({ open: true, message: "Insurance COPY", severity: "success" });
        setNotes(prev => `${prev}\n- ${revisionText}`);
      },
      ONEXP: () => {
        const revisionText = `Please revise the "Expiration Date of Certification or License" "${data["Expiration Date of Certification or License"] || '...'}" in the report.`;
        navigator.clipboard.writeText(revisionText);
        setNotification({ open: true, message: "Expiration Date of Certification or License", severity: "success" });
        setNotes(prev => `${prev}\n- ${revisionText}`);
      },
      ONPPT: () => {
        const revisionText = `Please revise the "Policy Period To" "${data["Policy Period To"] || '...'}" in the report.`;
        navigator.clipboard.writeText(revisionText);
        setNotification({ open: true, message: "Policy Period To", severity: "success" });
        setNotes(prev => `${prev}\n- ${revisionText}`);
      },
      ONLVT: () => {
        const revisionText = `Please revise the "License Valid To" "${data["License Valid To"] || '...'}" in the report.`;
        navigator.clipboard.writeText(revisionText);
        setNotification({ open: true, message: "License Valid To", severity: "success" });
        setNotes(prev => `${prev}\n- ${revisionText}`);
      },
      ONLVT1: () => {
        const revisionText = `Please revise the "LICENSE/REGISTRATION/CERTIFICATION #" "${data["LICENSE/REGISTRATION/CERTIFICATION #"] || '...'}" in the report.`;
        navigator.clipboard.writeText(revisionText);
        setNotification({ open: true, message: "LICENSE/REGISTRATION/CERTIFICATION #", severity: "success" });
        setNotes(prev => `${prev}\n- ${revisionText}`);
      },
      // reconciliationFields
      ONIndicated1: () => {
        const revisionText = `Please revise the "Indicated Value by Cost Approach $" "${data["Indicated Value by Cost Approach $"] || '...'}" in the report.`;
        navigator.clipboard.writeText(revisionText);
        setNotification({ open: true, message: "Indicated Value by Cost Approach $", severity: "success" });
        setNotes(prev => `${prev}\n- ${revisionText}`);
      },
      ONcostApproach: () => {
        const revisionText = `Please revise the "COST APPROACH" "${data["COST APPROACH"] || '...'}" in the report.`;
        navigator.clipboard.writeText(revisionText);
        setNotification({ open: true, message: "COST APPROACH", severity: "success" });
        setNotes(prev => `${prev}\n- ${revisionText}`);
      },
      ONincomeApproach: () => {
        const revisionText = `Please revise the "INCOME APPROACH" "${data["INCOME APPROACH"] || '...'}" in the report.`;
        navigator.clipboard.writeText(revisionText);
        setNotification({ open: true, message: "INCOME APPROACH", severity: "success" });
        setNotes(prev => `${prev}\n- ${revisionText}`);
      },
      ONincomeApproach2: () => {
        const revisionText = `Please revise the "Indicated Value by Income Approach $" "${data["Indicated Value by Income Approach $"] || '...'}" in the report.`;
        navigator.clipboard.writeText(revisionText);
        setNotification({ open: true, message: "Indicated Value by Income Approach $", severity: "success" });
        setNotes(prev => `${prev}\n- ${revisionText}`);
      },
      ONReconciledValue: () => {
        const revisionText = `Please revise the "RECONCILED VALUE $" "${data["RECONCILED VALUE $"] || '...'}" in the report.`;
        navigator.clipboard.writeText(revisionText);
        setNotification({ open: true, message: "RECONCILED VALUE $", severity: "success" });
        setNotes(prev => `${prev}\n- ${revisionText}`);
      },
      ONReconciledValue1: () => {
        const revisionText = `Please revise the "Reconciled Value $" "${data["Reconciled Value $"] || '...'}" in the report.`;
        navigator.clipboard.writeText(revisionText);
        setNotification({ open: true, message: "Reconciled Value $", severity: "success" });
        setNotes(prev => `${prev}\n- ${revisionText}`);
      },
      // Cost Approach

      ONEstimated: () => {
        const revisionText = `Please revise the "Estimated" "${data["Estimated"] || '...'}" in the report.`;
        navigator.clipboard.writeText(revisionText);
        setNotification({ open: true, message: "Estimated", severity: "success" });
        setNotes(prev => `${prev}\n- ${revisionText}`);
      },
      onSourceofcostdata: () => {
        const revisionText = `Please revise the "Source of cost data:" "${data["Source of cost data:"] || '...'}" in the report.`;
        navigator.clipboard.writeText(revisionText);
        setNotification({ open: true, message: "Source of cost data:", severity: "success" });
        setNotes(prev => `${prev}\n- ${revisionText}`);
      },
      onQuality: () => {
        const revisionText = `Please revise the "Quality rating from cost service" "${data["Quality rating from cost service"] || '...'}" in the report.`;
        navigator.clipboard.writeText(revisionText);
        setNotification({ open: true, message: "Quality", severity: "success" });
        setNotes(prev => `${prev}\n- ${revisionText}`);
      },
      onEffectiveDateofcostdata: () => {
        const revisionText = `Please revise the "Effective date of cost data" "${data["Effective date of cost data"] || '...'}" in the report.`;
        navigator.clipboard.writeText(revisionText);
        setNotification({ open: true, message: "Effective date of cost data", severity: "success" });
        setNotes(prev => `${prev}\n- ${revisionText}`);
      },
      onCommentsOnCost: () => {
        const revisionText = `Please revise the "Comments on Cost Approach" "${data["Comments on Cost Approach (gross living area calculations, depreciation, etc.)"] || '...'}" in the report.`;
        navigator.clipboard.writeText(revisionText);
        setNotification({ open: true, message: "Comments on Cost Approach", severity: "success" });
        setNotes(prev => `${prev}\n- ${revisionText}`);
      },
      onOPINIONOFSITE: () => {
        const revisionText = `Please revise the "OPINION OF SITE VALUE $" "${data["OPINION OF SITE VALUE = $ ................................................"] || '...'}" in the report.`;
        navigator.clipboard.writeText(revisionText);
        setNotification({ open: true, message: "OPINION OF SITE VALUE $", severity: "success" });
        setNotes(prev => `${prev}\n- ${revisionText}`);
      },
      onDwelling: () => {
        const revisionText = `Please revise the "Dwelling" "${data["Dwelling"] || '...'}" in the report.`;
        navigator.clipboard.writeText(revisionText);
        setNotification({ open: true, message: "Dwelling", severity: "success" });
        setNotes(prev => `${prev}\n- ${revisionText}`);
      },
      onGarageCarport: () => {
        const revisionText = `Please revise the "Garage/Carport" "${data["Garage/Carport "] || '...'}" in the report.`;
        navigator.clipboard.writeText(revisionText);
        setNotification({ open: true, message: "Garage/Carport", severity: "success" });
        setNotes(prev => `${prev}\n- ${revisionText}`);
      },
      onEstimatedRemainingEconomicLife: () => {
        const revisionText = `Please revise the "Estimated Remaining Economic Life" "${data["Estimated Remaining Economic Life (HUD and VA only)"] || '...'}" in the report.`;
        navigator.clipboard.writeText(revisionText);
        setNotification({ open: true, message: "Estimated Remaining Economic Life", severity: "success" });
        setNotes(prev => `${prev}\n- ${revisionText}`);
      },
      ONTOTALESTIMATE: () => {
        const revisionText = `Please revise the "TOTAL ESTIMATE OF VALUE $ " "${data[" Total Estimate of Cost-New  = $ ..................."] || '...'}" in the report.`;
        navigator.clipboard.writeText(revisionText);
        setNotification({ open: true, message: "TOTAL ESTIMATE OF VALUE $ ", severity: "success" });
        setNotes(prev => `${prev}\n- ${revisionText}`);
      },
      ONDepreciation: () => {
        const revisionText = `Please revise the "Depreciation" "${data["Depreciation"] || '...'}" in the report.`;
        navigator.clipboard.writeText(revisionText);
        setNotification({ open: true, message: "Depreciation", severity: "success" });
        setNotes(prev => `${prev}\n- ${revisionText}`);
      },
      ONTOTALDEDUCT: () => {
        const revisionText = `Please revise the "TOTAL DEDUCTIONS $ " "${data["Depreciated Cost of Improvements......................................................=$ "] || '...'}" in the report.`;
        navigator.clipboard.writeText(revisionText);
        setNotification({ open: true, message: "TOTAL DEDUCTIONS $ ", severity: "success" });
        setNotes(prev => `${prev}\n- ${revisionText}`);
      },
      onasisvalueofsiteimprovements: () => {
        const revisionText = `Please revise the "As-is value of site improvements" "${data["As-is” Value of Site Improvements......................................................=$"] || '...'}" in the report.`;
        navigator.clipboard.writeText(revisionText);
        setNotification({ open: true, message: "As-is value of site improvements", severity: "success" });
        setNotes(prev => `${prev}\n- ${revisionText}`);
      },
      onTotalValuebyCostApproach: () => {
        const revisionText = `Please revise the "Indicated Value By Cost Approach" "${data["Indicated Value By Cost Approach......................................................=$"] || '...'}" in the report.`;
        navigator.clipboard.writeText(revisionText);
        setNotification({ open: true, message: "Indicated Value by Cost Approach $", severity: "success" });
        setNotes(prev => `${prev}\n- ${revisionText}`);
      },

      // Income Approach
      onEffectiveGrossIncome: () => {
        const revisionText = `Please revise the "Estimated Monthly Market Rent $" "${data["Estimated Monthly Market Rent $"] || '...'}" in the report.`;
        navigator.clipboard.writeText(revisionText);
        setNotification({ open: true, message: "Estimated Monthly Market Rent $", severity: "success" });
        setNotes(prev => `${prev}\n- ${revisionText}`);
      },
      onxgross: () => {
        const revisionText = `Please revise the "X Gross Rent Multiplier" "${data["X Gross Rent Multiplier  = $"] || '...'}" in the report.`;
        navigator.clipboard.writeText(revisionText);
        setNotification({ open: true, message: "X Gross Rent Multiplier", severity: "success" });
        setNotes(prev => `${prev}\n- ${revisionText}`);
      },
      onIndicatedValuebyIncomeApproach: () => {
        const revisionText = `Please revise the "Indicated Value by Income Approach $" "${data["Indicated Value by Income Approach"] || '...'}" in the report.`;
        navigator.clipboard.writeText(revisionText);
        setNotification({ open: true, message: "Indicated Value by Income Approach $", severity: "success" });
        setNotes(prev => `${prev}\n- ${revisionText}`);
      },
      onIIA: () => {
        const revisionText = `Please revise the "Indicated Value by Income Approach" "${data["Indicated Value by Income Approach"] || '...'}" in the report.`;
        navigator.clipboard.writeText(revisionText);
        setNotification({ open: true, message: "INCOME APPROACH", severity: "success" });
        setNotes(prev => `${prev}\n- ${revisionText}`);
      },
      ONSUMMARYOFINCOMEAPPROACH: () => {
        const revisionText = `Please revise the "SUMMARY OF INCOME APPROACH" "${data["Summary of Income Approach (including support for market rent and GRM) "] || '...'}" in the report.`;
        navigator.clipboard.writeText(revisionText);
        setNotification({ open: true, message: "SUMMARY OF INCOME APPROACH", severity: "success" });
        setNotes(prev => `${prev}\n- ${revisionText}`);
      },
      onPUDFees$: () => {
        const revisionText = `Please revise the "PUD Fees $" "${data["PUD Fees $"] || '...'}" in the report.`;
        navigator.clipboard.writeText(revisionText);
        setNotification({ open: true, message: "PUD Fees $", severity: "success" });
        setNotes(prev => `${prev}\n- ${revisionText}`);
      },
      ONPUDFeesM: () => {
        const revisionText = `Please revise the "PUD Fees (per month)" "${data["PUD Fees (per month)"] || '...'}" in the report.`;
        navigator.clipboard.writeText(revisionText);
        setNotification({ open: true, message: "PUD Fees", severity: "success" });
        setNotes(prev => `${prev}\n- ${revisionText}`);
      },
      ONPUDFeesy: () => {
        const revisionText = `Please revise the "PUD Fees (per year)" "${data["PUD Fees (per year)"] || '...'}" in the report.`;
        navigator.clipboard.writeText(revisionText);
        setNotification({ open: true, message: "PUD Fees", severity: "success" });
        setNotes(prev => `${prev}\n- ${revisionText}`);
      },
      ONdbha: () => {
        const revisionText = `Please revise the "Is the developer/builder in control of the Homeowners' Association (HOA)?" "${data["Is the developer/builder in control of the Homeowners' Association (HOA)?"] || '...'}" in the report.`;
        navigator.clipboard.writeText(revisionText);
        setNotification({ open: true, message: "Is the developer/builder in control of the Homeowners' Association (HOA)?", severity: "success" });
        setNotes(prev => `${prev}\n- ${revisionText}`);
      },
      ONunittypes: () => {
        const revisionText = `Please revise the "Unit Types" "${data["Unit type(s)"] || '...'}" in the report.`;
        navigator.clipboard.writeText(revisionText);
        setNotification({ open: true, message: "Unit Types", severity: "success" });
        setNotes(prev => `${prev}\n- ${revisionText}`);
      },
      onProvideThe: () => {
        const revisionText = `Please revise the "Provide the following information for PUDs ONLY if the developer/builder is in control of the HOA and the subject property is an attached dwelling unit." "${data["Provide the following information for PUDs ONLY if the developer/builder is in control of the HOA and the subject property is an attached dwelling unit."] || '...'}" in the report.`;
        navigator.clipboard.writeText(revisionText);
        setNotification({ open: true, message: "Provide the following information for PUDs ONLY if the developer/builder is in control of the HOA and the subject property is an attached dwelling unit.", severity: "success" });
        setNotes(prev => `${prev}\n- ${revisionText}`);
      },
      onLegalNameOfProject: () => {
        const revisionText = `Please revise the "Legal Name of Project" "${data["Legal Name of Project"] || '...'}" in the report.`;
        navigator.clipboard.writeText(revisionText);
        setNotification({ open: true, message: "Legal Name of Project", severity: "success" });
        setNotes(prev => `${prev}\n- ${revisionText}`);
      },
      onTotalNumberOfPhases: () => {
        const revisionText = `Please revise the "Total Number of Phases" "${data["Total Number of Phases"] || '...'}" in the report.`;
        navigator.clipboard.writeText(revisionText);
        setNotification({ open: true, message: "Total Number of Phases", severity: "success" });
        setNotes(prev => `${prev}\n- ${revisionText}`);
      },
      onTotalNumberOfUnits: () => {
        const revisionText = `Please revise the "Total Number of Units" "${data["Total number of units"] || '...'}" in the report.`;
        navigator.clipboard.writeText(revisionText);
        setNotification({ open: true, message: "Total Number of Units", severity: "success" });
        setNotes(prev => `${prev}\n- ${revisionText}`);
      },
      onTotalNumberOfUnitsSold: () => {
        const revisionText = `Please revise the "Total Number of Units Sold" "${data["Total number of units sold"] || '...'}" in the report.`;
        navigator.clipboard.writeText(revisionText);
        setNotification({ open: true, message: "Total Number of Units Sold", severity: "success" });
        setNotes(prev => `${prev}\n- ${revisionText}`);
      }, onTotalNumberOfUnitsRented: () => {
        const revisionText = `Please revise the "Total number of units rented" "${data["Total number of units rented"] || '...'}" in the report.`;
        navigator.clipboard.writeText(revisionText);
        setNotification({ open: true, message: "Total Number of Units Rented", severity: "success" });
        setNotes(prev => `${prev}\n- ${revisionText}`);
      }, onTotalNumberOfUnitsForSale: () => {
        const revisionText = `Please revise the "Total number of units for sale" "${data["Total number of units for sale"] || '...'}" in the report.`;
        navigator.clipboard.writeText(revisionText);
        setNotification({ open: true, message: "Total Number of Units for Sale", severity: "success" });
        setNotes(prev => `${prev}\n- ${revisionText}`);
      }, onDatasourcepi: () => {
        const revisionText = `Please revise the "Data Source(s) for project information" "${data["Data source(s)"] || '...'}" in the report.`;
        navigator.clipboard.writeText(revisionText);
        setNotification({ open: true, message: "Data Source(s) for project information", severity: "success" });
        setNotes(prev => `${prev}\n- ${revisionText}`);
      },
      onprojectcreated: () => {
        const revisionText = `Please revise the "Date Project Created" "${data["Was the project created by the conversion of existing building(s) into a PUD?"] || '...'}" in the report.`;
        navigator.clipboard.writeText(revisionText);
        setNotification({ open: true, message: "Date Project Created", severity: "success" });
        setNotes(prev => `${prev}\n- ${revisionText}`);
      }

    };


    const props = {
      data, allData: data, extractionAttempted, handleDataChange, editingField, setEditingField, isEditable, highlightedSubjectFields, highlightedContractFields, highlightedSiteFields, subjectFields, contractFields, neighborhoodFields, siteFields, improvementsFields, salesGridRows, comparableSales, salesComparisonAdditionalInfoFields, salesHistoryFields, priorSaleHistoryFields, reconciliationFields, costApproachFields, incomeApproachFields, pudInformationFields, marketConditionsFields, marketConditionsRows, condoCoopProjectsRows, condoForeclosureFields, appraiserFields, supplementalAddendumFields, uniformResidentialAppraisalReportFields, appraisalAndReportIdentificationFields, projectSiteFields, projectInfoFields, projectAnalysisFields, unitDescriptionsFields, imageAnalysisFields, dataConsistencyFields, ComparableRentAdjustments, comparableRents, RentSchedulesFIELDS2, rentScheduleReconciliationFields, formType: selectedFormType, comparisonData, getComparisonStyle, SalesComparisonSection, EditableField, infoOfSalesFields, loading, stateRequirementFields, handleStateRequirementCheck, stateReqLoading, stateReqResponse, stateReqError, handleUnpaidOkCheck, unpaidOkLoading, unpaidOkResponse, unpaidOkError, handleClientRequirementCheck, clientReqLoading, clientReqResponse, clientReqError, handleFhaCheck, handleADUCheck, fhaLoading, fhaResponse, fhaError, ADULoading, handleEscalationCheck, escalationLoading, escalationResponse, escalationError, onDataChange: handleDataChange, handleExtract, manualValidations, handleManualValidation, SUBJECT_RENT_SCHEDULE, COMPARABLE_RENTAL_DATA,
      onSubjectRevisionButtonClick: () => setRevisionLangDialogOpen(true),
      onContractRevisionButtonClick: () => setContractRevisionLangDialogOpen(true),
      onNeighborhoodRevisionButtonClick: () => setNeighborhoodRevisionLangDialogOpen(true),
      onSiteRevisionButtonClick: () => setSiteRevisionLangDialogOpen(true),
      onImprovementsRevisionButtonClick: () => setImprovementsRevisionLangDialogOpen(true),
      onSalesGridRevisionButtonClick: () => setSalesGridRevisionLangDialogOpen(true),
      onReconciliationRevisionButtonClick: () => setReconciliationRevisionLangDialogOpen(true),
      onCostApproachRevisionButtonClick: () => setCostApproachRevisionLangDialogOpen(true),
      onCertificationRevisionButtonClick: () => setCertificationRevisionLangDialogOpen(true),
      on1007RevisionButtonClick: () => set1007RevisionLangDialogOpen(true),
      revisionHandlers,
    };

    // const dialogSetters = {
    //   setPropertyAddressRevisionLangDialogOpen,
    //   setContractPriceRevisionLangDialogOpen,
    //   setFinancialAssistanceRevisionLangDialogOpen,
    //   setDateOfContractRevisionLangDialogOpen,
    //   setNeighborhoodBoundariesRevisionLangDialogOpen,
    //   setOtherLandUseRevisionLangDialogOpen,
    //   setZoningComplianceRevisionLangDialogOpen,
    //   setAreaRevisionLangDialogOpen,
    //   setImprovementsRevisionLangDialogOpen,
    //   setSalesGridRevisionLangDialogOpen,
    //   setReconciliationRevisionLangDialogOpen,
    //   setCostApproachRevisionLangDialogOpen,
    //   setCertificationRevisionLangDialogOpen,
    //   setOneWithAccessoryUnitRevisionLangDialogOpen,
    //   setLenderClientAddressRevisionLangDialogOpen,
    //   setLenderClientRevisionLangDialogOpen,
    //   setHoaRevisionLangDialogOpen,
    //   set1007RevisionLangDialogOpen,
    //   setAddendumRevisionLangDialogOpen,
    // };
    // const revisionHandlers = createRevisionHandlers(data, setNotification, setNotes, dialogSetters);

    let formComponent;
    switch (selectedFormType) {
      case '1004':
        formComponent = <Form1004 {...props} allData={data} />;
        break;
      case '1073':
        formComponent = <Form1073 {...props} allData={data} />;
        break;
      case '1007':
        formComponent = <Form1007 {...props} allData={data} />;
        break;
      case '1025':
        formComponent = <Form1025 {...props} allData={data} />;
        break;
      case '1004D':
        formComponent = <Form1004D />;
        break;
      default:
        return (
          <Typography sx={{ mt: 2, textAlign: 'center' }}>Please select a form type to see the report details.</Typography>
        );
    }
    return (
      <Fade in={!!selectedFormType} timeout={1000}>
        <div>{formComponent}</div>
      </Fade>
    );
  };

  return (
    <>
      <CssBaseline />
      <TooltipStyles />


      <div className="page-container">
        <Sidebar
          sections={visibleSectionsList}
          isOpen={isSidebarOpen || isSidebarLocked}
          isLocked={isSidebarLocked}
          onLockToggle={() => { setIsSidebarLocked(!isSidebarLocked); setIsEditable(!isEditable); }}
          onMouseEnter={handleSidebarEnter}
          onMouseLeave={handleSidebarLeave}
          onSectionClick={handleSectionClick}
          onThemeToggle={handleThemeChange}
          currentTheme={themeMode}
          activeSection={activeSection}
          loadingSection={loadingSection}
          extractedSections={extractedSections}
          visibleSections={visibleSections}
          onArrowClick={handleArrowClick}
          loading={loading}
        />
        <div className={`main-content container-fluid ${isSidebarOpen || isSidebarLocked ? 'sidebar-open' : ''}`}>
          {selectedFormType !== '1004D' && (
            <>
          <Box
            className="header-container"
            elevation={0}
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: { xs: 2, md: 3 },
              my: 3,
              py: 2,
              px: 4,
              borderRadius: 3,
              background: `linear-gradient(135deg, ${activeTheme.palette.background.paper} 0%, ${activeTheme.palette.action.hover} 100%)`,
              border: '1px solid',
              borderColor: 'divider',
              boxShadow: '0 8px 32px rgba(0,0,0,0.05)'
            }}>
            <PremiumLogo size={70} fullScreen={false} />
            <Box>
              <Typography
                variant="h3"
                component="h1"
                className="app-title"
                sx={{
                  fontFamily: 'BBH Sans Hegarty, sans-serif',
                  fontWeight: 800,
                  fontSize: { xs: '1.6rem', md: '2.4rem' },
                  background: `linear-gradient(45deg, ${activeTheme.palette.primary.main}, ${activeTheme.palette.secondary?.main || activeTheme.palette.primary.dark})`,
                  backgroundClip: 'text',
                  textFillColor: 'transparent',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  mb: -0.5
                }}
              >
                FULL FILE REVIEW
              </Typography>
              <Typography
                variant="subtitle2"
                sx={{
                  color: 'text.secondary',
                  letterSpacing: 3,
                  fontSize: { xs: '0.6rem', md: '0.75rem' },
                  fontWeight: 600,
                  textTransform: 'uppercase',
                  textAlign: 'right',
                  opacity: 0.8
                }}
              >
                Intelligent Analysis
              </Typography>
            </Box>
          </Box>
          <Paper
            elevation={0}
            sx={{
              p: 1.5,
              // mb: 1,
              borderRadius: 3,
              bgcolor: 'background.paper',
              border: '1px solid',
              borderColor: 'divider'
            }}
          >
            <Grid item xs={12} md={8}>
              <Stack spacing={2}>
                <Stack direction="row" justifyContent="space-between" alignItems="center">
                  <Typography
                    variant="subtitle1"
                    fontWeight={700}
                    display="flex"
                    alignItems="center"
                    gap={1}
                  >
                    <CloudUploadIcon fontSize="small" color="primary" />
                    Upload Documents
                  </Typography>
                  {(selectedFile || htmlFile || contractFile || engagementLetterFile) && (
                    <Button size="small" color="error" onClick={() => setIsClearDialogOpen(true)} startIcon={<DeleteForeverIcon />}>
                      Clear All
                    </Button>
                  )}
                </Stack>

                {/* Responsive Upload Grid */}
                <Box
                  sx={{
                    display: 'grid',
                    gap: 1.5,
                    gridTemplateColumns: {
                      xs: 'repeat(3, 1fr)',  // mobile
                      sm: 'repeat(6, 1fr)'   // tablet & desktop
                    }
                  }}
                >
                  {[
                    {
                      label: 'PDF',
                      icon: <PictureAsPdfIcon fontSize="medium" />,
                      file: selectedFile,
                      onClick: () => fileInputRef.current.click(),
                      inputRef: fileInputRef,
                      accept: '.pdf',
                      onChange: onFileChange
                    },
                    {
                      label: 'HTML',
                      icon: <DescriptionIcon fontSize="medium" />,
                      file: htmlFile,
                      onClick: () => htmlFileInputRef.current.click(),
                      inputRef: htmlFileInputRef,
                      accept: '.html',
                      onChange: onHtmlFileChange
                    },
                    {
                      label: 'Contract',
                      icon: <AssignmentIcon fontSize="medium" />,
                      file: contractFile,
                      onClick: () => contractFileInputRef.current.click(),
                      inputRef: contractFileInputRef,
                      accept: '.pdf,.doc,.docx',
                      onChange: onContractFileChange
                    },
                    {
                      label: 'Letter',
                      icon: <AssignmentIcon fontSize="medium" />,
                      file: engagementLetterFile,
                      onClick: () => engagementLetterFileInputRef.current.click(),
                      inputRef: engagementLetterFileInputRef,
                      accept: '.pdf,.doc,.docx',
                      onChange: onEngagementLetterFileChange
                    }
                  ].map((item, index) => (
                    <Paper
                      key={index}
                      variant="outlined"
                      onClick={item.onClick}
                      sx={{
                        p: 1.25,
                        height: { xs: 40, sm: 60 },
                        cursor: 'pointer',
                        borderRadius: 2,
                        textAlign: 'center',
                        borderStyle: item.file ? 'solid' : 'dashed',
                        borderColor: item.file ? 'success.main' : 'divider',
                        bgcolor: item.file ? 'success.lighter' : 'background.default',
                        transition: 'all .2s',
                        '&:hover': { boxShadow: 2 }
                      }}
                    >
                      <Stack
                        spacing={0.5}
                        alignItems="center"
                        justifyContent="center"
                        height="100%"
                      >


                        {/* Label hidden on mobile */}
                        <Typography
                          fontSize={12}
                          fontWeight={600}
                          gap={1}
                          display={{ xs: 'none', sm: 'block' }}
                        >{item.icon}
                          {item.label}
                        </Typography>

                        {item.file && (
                          <Typography fontSize={10} color="success.main">
                            ✓
                          </Typography>
                        )}
                      </Stack>

                      <input type="file" hidden ref={item.inputRef} accept={item.accept} onChange={item.onChange} />
                    </Paper>
                  ))}
                </Box>

                {/* FORM TYPE (already responsive) */}
                <Autocomplete
                  size="small"
                  options={formTypes}
                  marginBottom={20}
                  value={selectedFormType}
                  onChange={(e, v) => v && setSelectedFormType(v)}
                  disableClearable
                  renderInput={(params) => (
                    <TextField {...params} label="Form Type" />
                  )}
                />
              </Stack>

              {/* RIGHT: ACTIONS */}
              <Grid
                item
                xs={12}
                md={4}
                sx={{
                  pl: { md: 3 },
                  borderLeft: { md: '1px solid' },
                  borderColor: 'divider',
                  position: { xs: 'sticky', md: 'static' },
                  bottom: { xs: 0, md: 'auto' },
                  bgcolor: { xs: 'background.paper', md: 'transparent' },
                  zIndex: 10,
                  py: { xs: 1, md: 0 }
                }}
              >
                <Stack spacing={1.5} width="100%">
                  {/* Title hidden on mobile */}
                  <Typography
                    variant="subtitle1"
                    fontWeight={700}
                    display={{ xs: 'none', md: 'flex' }}
                    alignItems="center"
                    gap={1}
                    mt={10}
                  >
                    <AssessmentIcon fontSize="small" color="primary" />
                    Actions
                  </Typography>

                  {/* Responsive Action Buttons */}
                  <Box
                    sx={{
                      display: 'grid',
                      gap: 1,
                      gridTemplateColumns: {
                        xs: 'repeat(4, 1fr)',   // mobile: icon-only bar
                        sm: 'repeat(4, 1fr)',   // tablet: one line
                        md: 'repeat(4, 1fr)'    // desktop: one line
                      }
                    }}
                  >
                    <Button
                      size="small"
                      variant="contained"
                      onClick={handleGeneratePdf}
                      disabled={!Object.keys(data).length}
                      startIcon={
                        isGeneratingPdf
                          ? <CircularProgress size={14} color="inherit" />
                          : <PictureAsPdfIcon fontSize="small" />
                      }
                    >
                      <Box component="span" sx={{ display: { xs: 'none', sm: 'inline' } }}>
                        {isGeneratingPdf ? 'Generating' : 'PDF'}
                      </Box>
                    </Button>

                    <Button
                      size="small"
                      variant="outlined"
                      color="info"
                      onClick={handleExportJSON}
                      disabled={!Object.keys(data).length}
                      startIcon={<FileDownloadIcon fontSize="small" />}
                    >
                      <Box component="span" sx={{ display: { xs: 'none', sm: 'inline' } }}>
                        JSON
                      </Box>
                    </Button>

                    <Button
                      size="small"
                      variant="outlined"
                      color="warning"
                      onClick={handleGenerateValidationLog}
                      disabled={!Object.keys(data).length}
                      startIcon={<AssessmentIcon fontSize="small" />}
                    >
                      <Box component="span" sx={{ display: { xs: 'none', sm: 'inline' } }}>
                        Log
                      </Box>
                    </Button>

                    <Button
                      size="small"
                      variant="contained"
                      color="success"
                      onClick={handleSaveToDB}
                      disabled={!Object.keys(data).length || loading}
                      startIcon={<SaveIcon fontSize="small" />}
                    >
                      <Box component="span" sx={{ display: { xs: 'none', sm: 'inline' } }}>
                        Save
                      </Box>
                    </Button>
                  </Box>
                </Stack>
              </Grid>
            </Grid>
          </Paper>
          <Paper elevation={3} sx={{ p: 2, position: 'sticky', top: 0, zIndex: 1100, mb: 3, borderRadius: 0, borderBottomLeftRadius: 2, borderBottomRightRadius: 2, backgroundColor: activeTheme.palette.background.paper, transition: 'width 0.4s cubic-bezier(0.4, 0, 0.2, 1)' }}>
            {selectedFile ? (
              <Stack direction="row" spacing={3} alignItems="center" flexWrap="wrap" justifyContent="space-between">
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Typography variant="subtitle1" noWrap>
                    File: <strong>{selectedFile.name}</strong>
                  </Typography>
                  <Tooltip title="Preview">
                    <IconButton size="small" onClick={() => handlePreviewPdf(selectedFile)}><VisibilityTwoToneIcon className="animated-eye" color="primary" /></IconButton>
                  </Tooltip>
                </Box>

                <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                  {loading && (
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <CircularProgress size={20} />
                      <Typography variant="body2">
                        {Math.floor(timer / 60)}m {timer % 60}s
                      </Typography>
                      <LinearProgress
                        variant="determinate"
                        value={extractionProgress}
                        sx={{ width: '80px' }}
                      />
                    </Box>
                  )}

                  <Tooltip sx={{ ml: 8, m: 'auto' }} title={isTimerRunning ? "Timer Running" : "Timer Paused"}>
                    <Typography
                      variant="body2"
                      sx={{ fontWeight: 'bold', cursor: 'pointer', marginRight: 40, color: isTimerRunning ? 'text.primary' : 'text.secondary' }}
                      onClick={handleTimerToggle}>
                      Total: {Math.floor(fileUploadTimer / 3600).toString().padStart(2, '0')}:
                      {Math.floor((fileUploadTimer % 3600) / 60).toString().padStart(2, '0')}:
                      {(fileUploadTimer % 60).toString().padStart(2, '0')}
                    </Typography>
                  </Tooltip>

                  {!loading && lastExtractionTime && (
                    <Typography variant="body2" color="success.main"
                      sx={{ marginRight: 40 }}>
                      Last: {lastExtractionTime >= 60 ? `${Math.floor(lastExtractionTime / 60)}m ` : ''}
                      {`${(lastExtractionTime % 60).toFixed(1)}s`}
                    </Typography>
                  )}
                </Box>
              </Stack>
            ) : (
              <Typography variant="body2" color="text.secondary" align="center">No file selected</Typography>
            )}

            {(htmlFile || contractFile || engagementLetterFile) && (
              <Box sx={{ mt: 2, pt: 2, borderTop: 1, borderColor: 'divider' }}>
                <Stack direction="row" spacing={3} alignItems="center" flexWrap="wrap">
                  {htmlFile && (
                    <Stack direction="row" alignItems="center" spacing={1}>
                      <Typography variant="caption" sx={{ fontWeight: 'bold' }}>HTML:</Typography>
                      <Typography variant="caption">{htmlFile.name}</Typography>
                      <Button size="small" variant="outlined" sx={{ py: 0, minWidth: 0 }} onClick={() => setIsComparisonDialogOpen(true)} disabled={isHtmlReviewLoading || loading}>
                        {isHtmlReviewLoading ? (
                          <>
                            <CircularProgress size={14} sx={{ mr: 0.5 }} />
                            {Math.floor(htmlExtractionTimer / 60)}m {htmlExtractionTimer % 60}s
                          </>
                        ) : <GetAppIcon fontSize="small" />}
                      </Button>
                    </Stack>
                  )}
                  {contractFile && (
                    <Stack direction="row" alignItems="center" spacing={1}>
                      <Typography variant="caption" sx={{ fontWeight: 'bold' }}>Contract:</Typography>
                      <Typography variant="caption">{contractFile.name}</Typography>
                      <Button size="small" variant="outlined" sx={{ py: 0, minWidth: 0 }} onClick={() => setIsContractCompareOpen(true)}><GetAppIcon fontSize="small" /></Button>
                      <IconButton size="small" onClick={() => handlePreviewPdf(contractFile)} sx={{ p: 0.5 }}><VisibilityTwoToneIcon fontSize="small" color="primary" /></IconButton>
                    </Stack>
                  )}
                  {engagementLetterFile && (
                    <Stack direction="row" alignItems="center" spacing={1}>
                      <Typography variant="caption" sx={{ fontWeight: 'bold' }}>Engagement:</Typography>
                      <Typography variant="caption">{engagementLetterFile.name}</Typography>
                      <Button size="small" variant="outlined" sx={{ py: 0, minWidth: 0 }} onClick={() => setIsEngagementLetterDialogOpen(true)}><GetAppIcon fontSize="small" /></Button>
                      <IconButton size="small" onClick={() => handlePreviewPdf(engagementLetterFile)} sx={{ p: 0.5 }}><VisibilityTwoToneIcon fontSize="small" color="primary" /></IconButton>
                    </Stack>
                  )}
                </Stack>
              </Box>
            )}
          </Paper>
          <Paper elevation={2} sx={{ p: 2, mb: 2, backgroundColor: activeTheme.palette.background.paper, borderRadius: 2 }}>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                mb: (!isValidationSectionMinimized && selectedFile) ? 2 : 0,
                pb: (!isValidationSectionMinimized && selectedFile) ? 1 : 0,
                borderBottom: (!isValidationSectionMinimized && selectedFile) ? '1px solid' : 'none',
                borderColor: 'divider',
                cursor: 'pointer'
              }}
              onClick={() => setIsValidationSectionMinimized(!isValidationSectionMinimized)}
            >
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <FactCheckIcon color="primary" sx={{ mr: 1 }} />
                <Typography variant="h6" fontWeight="bold" color="text.primary">
                  Validation Checks
                </Typography>
              </Box>
              <IconButton size="small">
                {isValidationSectionMinimized ? <KeyboardArrowDownIcon /> : <KeyboardArrowUpIcon />}
              </IconButton>
            </Box>
            {!isValidationSectionMinimized && selectedFile && (
              <Stack spacing={2}>
                {data['From Type'] && (
                  <Alert
                    severity="warning"
                    icon={<WarningIcon fontSize="inherit" />}
                    sx={{ alignItems: 'center', '& .MuiAlert-message': { width: '100%' } }}
                  >
                    <Stack direction="row" alignItems="center" spacing={2} width="100%">
                      <Typography variant="body2" sx={{ fontWeight: 'bold', whiteSpace: 'nowrap' }}>
                        Form Type Mismatch:
                      </Typography>
                      <Box sx={{ flexGrow: 1 }}>
                        <EditableField
                          fieldPath={['From Type']}
                          value={data['From Type']}
                          onDataChange={handleDataChange}
                          editingField={editingField}
                          setEditingField={setEditingField}
                          isEditable={isEditable}
                          allData={data}
                        />
                      </Box>
                    </Stack>
                  </Alert>
                )}

                <Grid container spacing={2}>
                  {data['FHA Case No.'] && (
                    <Grid item xs={12} sm={6} md={4}>
                      <Paper variant="outlined" sx={{ p: 1.5, display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '100%' }}>
                        <Box sx={{ overflow: 'hidden' }}>
                          <Typography variant="caption" color="secondary.main" fontWeight="bold" display="block" noWrap>FHA Case #</Typography>
                          <EditableField fieldPath={['FHA Case No.']} value={data['FHA Case No.'] || ''} onDataChange={handleDataChange} editingField={editingField} setEditingField={setEditingField} isEditable={isEditable} allData={data} />
                        </Box>
                        <Tooltip title="Check FHA Requirements">
                          <IconButton onClick={handleFhaCheck} size="small" color="info">
                            <Info fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </Paper>
                    </Grid>
                  )}

                  {data['ADU File Check'] && (
                    <Grid item xs={12} sm={6} md={4}>
                      <Paper variant="outlined" sx={{ p: 1.5, display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '100%' }}>
                        <Box sx={{ overflow: 'hidden' }}>
                          <Typography variant="caption" color="secondary.main" fontWeight="bold" display="block" noWrap>ADU File Check</Typography>
                          <EditableField fieldPath={['ADU File Check']} value={data['ADU File Check']} onDataChange={handleDataChange} editingField={editingField} setEditingField={setEditingField} isEditable={isEditable} allData={data} />
                        </Box>
                        <Tooltip title="Check ADU Requirements">
                          <IconButton onClick={handleADUCheck} size="small" color="info">
                            <Info fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </Paper>
                    </Grid>
                  )}

                  {data['ANSI'] && (
                    <Grid item xs={12} sm={6} md={4}>
                      <Paper variant="outlined" sx={{ p: 1.5, height: '100%' }}>
                        <Typography variant="caption" color="text.secondary" fontWeight="bold" display="block" noWrap>ANSI</Typography>
                        <EditableField fieldPath={['ANSI']} value={data['ANSI']} onDataChange={handleDataChange} editingField={editingField} setEditingField={setEditingField} isEditable={isEditable} allData={data} />
                      </Paper>
                    </Grid>
                  )}

                  {data['Exposure comment'] && (
                    <Grid item xs={12} sm={6} md={6}>
                      <Paper variant="outlined" sx={{ p: 1.5, height: '100%' }}>
                        <Typography variant="caption" color="text.secondary" fontWeight="bold" display="block" noWrap>Exposure Comment</Typography>
                        <EditableField fieldPath={['Exposure comment']} value={data['Exposure comment']} onDataChange={handleDataChange} editingField={editingField} setEditingField={setEditingField} isEditable={isEditable} allData={data} />
                      </Paper>
                    </Grid>
                  )}

                  {data['Prior service comment'] && (
                    <Grid item xs={12} sm={6} md={6}>
                      <Paper variant="outlined" sx={{ p: 1.5, height: '100%' }}>
                        <Typography variant="caption" color="text.secondary" fontWeight="bold" display="block" noWrap>Prior Service Comment</Typography>
                        <EditableField fieldPath={['Prior service comment']} value={data['Prior service comment']} onDataChange={handleDataChange} editingField={editingField} setEditingField={setEditingField} isEditable={isEditable} allData={data} />
                      </Paper>
                    </Grid>
                  )}
                </Grid>

                {isUnpaidOkLender && (
                  <Alert severity="success" variant="standard" sx={{ fontWeight: 'bold' }}>
                    Unpaid OK can proceed with review
                  </Alert>
                )}
                {!isUnpaidOkLender && (
                  <Alert severity="warning" variant="standard" sx={{ fontWeight: 'bold' }}>
                    Unpaid OK cannot proceed with review, please check with lender
                  </Alert>
                )}

                {(!data['FHA Case No.'] || !data['ANSI'] || !data['Exposure comment'] || !data['Prior service comment'] || !isUnpaidOkLender) && (
                  <Alert severity="error" variant="filled" icon={<ErrorOutlineIcon fontSize="inherit" />} sx={{ fontWeight: 'bold' }}>
                    Plz check the report
                  </Alert>
                )}
              </Stack>
            )}
          </Paper>
          {htmlFile && (
            <Paper
              elevation={3}
              sx={{
                p: 2,
                mb: 3,
                borderRadius: 2,
                backgroundColor: activeTheme.palette.background.paper,
                border: '1px solid',
                borderColor: 'divider',
                overflow: 'hidden'
              }}
              id="html-data-section"
            >
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2, pb: 1, borderBottom: '1px solid', borderColor: 'divider', cursor: 'pointer' }} onClick={() => setIsHtmlDataMinimized(!isHtmlDataMinimized)}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <DescriptionIcon color="primary" sx={{ mr: 1 }} />
                  <Typography variant="h6" fontWeight="bold" color="text.primary">
                    HTML Data Analysis
                  </Typography>
                </Box>
                <IconButton size="small" onClick={() => setIsHtmlDataMinimized(!isHtmlDataMinimized)}>
                  {isHtmlDataMinimized ? <KeyboardArrowDownIcon /> : <KeyboardArrowUpIcon />}
                </IconButton>
              </Box>

              {!isHtmlDataMinimized && (
                <Box>
                  {comparisonData?.comparison_results ? (
                    <Box>
                      <Alert severity="info" sx={{ mb: 2 }} icon={<CompareArrowsIcon fontSize="inherit" />}>
                        Comparison Results
                      </Alert>
                      <ComparisonResultTable result={comparisonData.comparison_results} />
                    </Box>
                  ) : (
                    <Box>
                      {Object.keys(comparisonData).length > 0 && (
                        <GridInfoCard
                          id="html-data-info"
                          title="Extracted HTML Data"
                          fields={Object.keys(comparisonData)}
                          data={comparisonData}
                          cardClass="bg-primary text-white"
                          onDataChange={(field, value) => handleComparisonDataChange(field[0], value)}
                          editingField={editingField}
                          setEditingField={setEditingField}
                          isEditable={true}
                          allData={data}
                          manualValidations={manualValidations}
                          handleManualValidation={handleManualValidation}
                        />
                      )}
                    </Box>
                  )}
                </Box>
              )}
            </Paper>
          )}
            </>
          )}


          <ComparisonDialog
            open={isComparisonDialogOpen}
            onClose={() => setIsComparisonDialogOpen(false)}
            data={{
              comparisonData: comparisonData,
              pdfFile: selectedFile,
              htmlFile: htmlFile,
            }}
            onDataChange={handleComparisonDataChange}
            pdfFile={selectedFile}
            setComparisonData={setComparisonData}
            htmlFile={htmlFile}
          />
          <ContractComparisonDialog
            open={isContractCompareOpen}
            onClose={() => setIsContractCompareOpen(false)}
            onCompare={handleContractCompare}
            loading={contractCompareLoading}
            result={contractCompareResult}
            error={contractCompareError}
            selectedFile={selectedFile}
            contractFile={contractFile}
            mainData={data}
          />
          <EngagementLetterDialog
            open={isEngagementLetterDialogOpen}
            onClose={() => setIsEngagementLetterDialogOpen(false)}
            onCompare={handleEngagementLetterCompare}
            loading={engagementLetterCompareLoading}
            result={engagementLetterCompareResult}
            error={engagementLetterCompareError}
            selectedFile={selectedFile}
            engagementLetterFile={engagementLetterFile}
            mainData={data}
          />


          <Snackbar open={notification.open} autoHideDuration={3000} onClose={handleCloseNotification} anchorOrigin={{ vertical: 'top', horizontal: 'center' }}>
            <Alert onClose={handleCloseNotification} severity={notification.severity} variant="filled" sx={{ width: '100%' }}>
              {notification.message}
            </Alert>
          </Snackbar>

          {renderForm()}

          {selectedFormType !== '1004D' && (
            <>
          <div id="state-requirement-check" className="mb-4">
            <StateRequirementCheck
              onPromptSubmit={handleStateRequirementCheck}
              loading={stateReqLoading}
              response={stateReqResponse}
              error={stateReqError}
            />
          </div>

          <div id="client-requirement-check" className="mb-4">
            <ClientRequirementCheck
              onPromptSubmit={handleClientRequirementCheck}
              loading={clientReqLoading}
              response={clientReqResponse}
              error={clientReqError}
            />
          </div>

          <div id="escalation-check" className="mb-4">
            <EscalationCheck
              onPromptSubmit={handleEscalationCheck}
              loading={escalationLoading}
              response={escalationResponse}
              error={escalationError}
            />
          </div>

          <PromptAnalysis
            onPromptSubmit={handlePromptAnalysis}
            loading={promptAnalysisLoading}
            response={promptAnalysisResponse}
            error={promptAnalysisError}
            submittedPrompt={submittedPrompt}
            onAddendumRevisionButtonClick={() => setAddendumRevisionLangDialogOpen(true)}
          />

          {(rawGemini || Object.keys(data).length > 0) && (
            <div id="raw-output" className="mt-4">
              <h5>Raw Gemini Output (Debug):</h5>
              <pre style={{ background: '#f8f9fa', padding: '1em', borderRadius: '6px', maxHeight: '300px', overflow: 'auto' }}>
                {rawGemini}
                {/* {'\n'}
                {JSON.stringify(data, null, 2)} */}
              </pre>
            </div>
          )}
            </>
          )}

          <Footer />

        </div>
        {modalContent && (
          <Dialog open={isCheckModalOpen} onClose={() => setIsCheckModalOpen(false)} fullWidth maxWidth="md">
            <DialogTitle>
              {modalContent.title}
              <IconButton
                aria-label="close"
                onClick={() => setIsCheckModalOpen(false)}
                sx={{
                  position: 'absolute',
                  right: 8,
                  top: 8,
                  color: (theme) => theme.palette.grey[500],
                }}
              >
                <CloseIcon />
              </IconButton>
            </DialogTitle>
            <DialogContent dividers>
              <modalContent.Component {...modalContent.props} />
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setIsCheckModalOpen(false)}>Close</Button>
            </DialogActions>
          </Dialog>
        )}
      </div>
      {
        showScrollTop && (
          <Fab color="primary" size="small" onClick={scrollTop} sx={{ position: 'fixed', bottom: 16, right: 16, zIndex: 1200 }}>
            <KeyboardArrowUpIcon />
          </Fab>
        )
      }
      <NotepadDialog
        open={isNotepadOpen}
        onClose={() => setIsNotepadOpen(false)}
        notes={notes}
        onNotesChange={setNotes}
      />
      <Tooltip title="Open Notepad" placement="top">
        <Fab color="secondary" size="small" onClick={handleOpenNotepad} sx={{ position: 'fixed', bottom: 16, right: 80, zIndex: 1200 }}>
          <NoteAltIcon />
        </Fab>
      </Tooltip>

      <Dialog open={isRentFormTypeMismatchDialogOpen} onClose={() => setIsRentFormTypeMismatchDialogOpen(false)}>
        <DialogTitle sx={{ display: 'flex', alignItems: 'center' }}>
          <WarningIcon color="warning" sx={{ mr: 1 }} />
          Form Type Mismatch
        </DialogTitle>
        <DialogContent>
          <Typography>
            "Estimated Monthly Market Rent $" is present, but the Form Type is not 1007.
          </Typography>
          <Typography sx={{ mt: 1 }}>
            Please verify the selected form type.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsRentFormTypeMismatchDialogOpen(false)} variant="contained">Close</Button>
        </DialogActions>
      </Dialog>
      <RevisionLanguageDialog
        open={isContractRevisionLangDialogOpen}
        onClose={() => setContractRevisionLangDialogOpen(false)}
        title="Contract Section Revision Language"
        prompts={CONTRACT_REVISION_PROMPTS}
        onCopy={(text) => {
          navigator.clipboard.writeText(text);
          setNotification({ open: true, message: 'Copied to clipboard!', severity: 'success' });
        }}
        onAddToNotepad={(text) => {
          setNotes(prev => `${prev}\n- ${text}`);
          setNotification({ open: true, message: 'Added to notepad!', severity: 'success' });
        }}
      />
      <RevisionLanguageDialog
        open={isNeighborhoodRevisionLangDialogOpen}
        onClose={() => setNeighborhoodRevisionLangDialogOpen(false)}
        title="Neighborhood Section Revision Language"
        prompts={NEIGHBORHOOD_REVISION_PROMPTS}
        onCopy={(text) => {
          navigator.clipboard.writeText(text);
          setNotification({ open: true, message: 'Copied to clipboard!', severity: 'success' });
        }}
        onAddToNotepad={(text) => {
          setNotes(prev => `${prev}\n- ${text}`);
          setNotification({ open: true, message: 'Added to notepad!', severity: 'success' });
          // onClose();
        }}
      />
      <RevisionLanguageDialog
        open={isSiteRevisionLangDialogOpen}
        onClose={() => setSiteRevisionLangDialogOpen(false)}
        title="Site Section Revision Language"
        prompts={SITE_REVISION_PROMPTS}
        onCopy={(text) => {
          navigator.clipboard.writeText(text);
          setNotification({ open: true, message: 'Copied to clipboard!', severity: 'success' });
        }}
        onAddToNotepad={(text) => {
          setNotes(prev => `${prev}\n- ${text}`);
          setNotification({ open: true, message: 'Added to notepad!', severity: 'success' });
          // onClose();
        }}
      />
      <RevisionLanguageDialog
        open={isImprovementsRevisionLangDialogOpen}
        onClose={() => setImprovementsRevisionLangDialogOpen(false)}
        title="Improvements Section Revision Language"
        prompts={IMPROVEMENTS_REVISION_PROMPTS}
        onCopy={(text) => {
          navigator.clipboard.writeText(text);
          setNotification({ open: true, message: 'Copied to clipboard!', severity: 'success' });
        }}
        onAddToNotepad={(text) => {
          setNotes(prev => `${prev}\n- ${text}`);
          setNotification({ open: true, message: 'Added to notepad!', severity: 'success' });
        }}
      />
      <RevisionLanguageDialog
        open={isSalesGridRevisionLangDialogOpen}
        onClose={() => setSalesGridRevisionLangDialogOpen(false)}
        title="Sales Comparison Grid Revision Language"
        prompts={SALES_GRID_REVISION_PROMPTS}
        onCopy={(text) => {
          navigator.clipboard.writeText(text);
          setNotification({ open: true, message: 'Copied to clipboard!', severity: 'success' });
        }}
        onAddToNotepad={(text) => {
          setNotes(prev => `${prev}\n- ${text}`);
          setNotification({ open: true, message: 'Added to notepad!', severity: 'success' });
        }}
      />
      <RevisionLanguageDialog
        open={isReconciliationRevisionLangDialogOpen}
        onClose={() => setReconciliationRevisionLangDialogOpen(false)}
        title="Reconciliation Section Revision Language"
        prompts={RECONCILIATION_REVISION_PROMPTS}
        onCopy={(text) => {
          navigator.clipboard.writeText(text);
          setNotification({ open: true, message: 'Copied to clipboard!', severity: 'success' });
        }}
        onAddToNotepad={(text) => {
          setNotes(prev => `${prev}\n- ${text}`);
          setNotification({ open: true, message: 'Added to notepad!', severity: 'success' });
        }}
      />
      <RevisionLanguageDialog
        open={isCostApproachRevisionLangDialogOpen}
        onClose={() => setCostApproachRevisionLangDialogOpen(false)}
        title="Cost Approach Section Revision Language"
        prompts={COST_APPROACH_REVISION_PROMPTS}
        onCopy={(text) => {
          navigator.clipboard.writeText(text);
          setNotification({ open: true, message: 'Copied to clipboard!', severity: 'success' });
        }}
        onAddToNotepad={(text) => {
          setNotes(prev => `${prev}\n- ${text}`);
          setNotification({ open: true, message: 'Added to notepad!', severity: 'success' });
        }}
      />
      <RevisionLanguageDialog
        open={isCertificationRevisionLangDialogOpen}
        onClose={() => setCertificationRevisionLangDialogOpen(false)}
        title="Certification Section Revision Language"
        prompts={CERTIFICATION_REVISION_PROMPTS}
        onCopy={(text) => {
          navigator.clipboard.writeText(text);
          setNotification({ open: true, message: 'Copied to clipboard!', severity: 'success' });
        }}
        onAddToNotepad={(text) => {
          setNotes(prev => `${prev}\n- ${text}`);
          setNotification({ open: true, message: 'Added to notepad!', severity: 'success' });
        }}
      />
      <RevisionLanguageDialog
        open={isAddendumRevisionLangDialogOpen}
        onClose={() => setAddendumRevisionLangDialogOpen(false)}
        title="General / Addendum Revision Language"
        prompts={ADDENDUM_GENERAL_REVISION_PROMPTS}
        onCopy={(text) => {
          navigator.clipboard.writeText(text);
          setNotification({ open: true, message: 'Copied to clipboard!', severity: 'success' });
        }}
        onAddToNotepad={(text) => {
          setNotes(prev => `${prev}\n- ${text}`);
          setNotification({ open: true, message: 'Added to notepad!', severity: 'success' });
          setAddendumRevisionLangDialogOpen(false);
        }}
      />
      <RevisionLanguageDialog
        open={is1007RevisionLangDialogOpen}
        onClose={() => set1007RevisionLangDialogOpen(false)}
        title="1007 / Rent Schedule Revision Language"
        prompts={FORM_1007_REVISION_PROMPTS}
        onCopy={(text) => {
          navigator.clipboard.writeText(text);
          setNotification({ open: true, message: 'Copied to clipboard!', severity: 'success' });
        }}
        onAddToNotepad={(text) => {
          setNotes(prev => `${prev}\n- ${text}`);
          setNotification({ open: true, message: 'Added to notepad!', severity: 'success' });
        }}
      />
      <RevisionLanguageDialog
        open={isRevisionLangDialogOpen}
        onClose={() => setRevisionLangDialogOpen(false)}
        title="Subject Section Revision Language"
        prompts={SUBJECT_REVISION_PROMPTS}
        onCopy={(text) => {
          navigator.clipboard.writeText(text);
          setNotification({ open: true, message: 'Copied to clipboard!', severity: 'success' });
        }}
        onAddToNotepad={(text) => {
          setNotes(prev => `${prev}\n- ${text}`);
          setNotification({ open: true, message: 'Added to notepad!', severity: 'success' });
        }}
      />
      <RevisionLanguageDialog
        open={isPropertyAddressRevisionLangDialogOpen}
        onClose={() => setPropertyAddressRevisionLangDialogOpen(false)}
        title="Property Address Revision Language"
        prompts={[
          `The subject's street name should reflect as "${data['Property Address'] || '...'}", please revise.`,
          "Please revise the subject's street suffix from Cir to Dr.",
          "Please add the street suffix ‘Dr’ in the lender address."
        ]}
        onCopy={(text) => {
          navigator.clipboard.writeText(text);
          setNotification({ open: true, message: 'Copied to clipboard!', severity: 'success' });
        }}
        onAddToNotepad={(text) => {
          setNotes(prev => `${prev}\n- ${text}`);
          setNotification({ open: true, message: 'Added to notepad!', severity: 'success' });
        }}
      />
      <RevisionLanguageDialog
        open={isLenderClientRevisionLangDialogOpen}
        onClose={() => setLenderClientRevisionLangDialogOpen(false)}
        title="Lender/Client Revision Language"
        prompts={[
          `Please add ‘Inc’ at the end of the lender/client name:"${data['Lender/Client'] || '...'}"`,
          `Please revise the spelling of the lender name:"${data['Lender/Client'] || '...'}"`,
          `Please remove ‘Inc’ from the lender/client name so it reflects as "${data['Lender/Client'] || '...'}".`,
          `Please remove ‘Trust’ from the lender/client name so it reflects as "${data['Lender/Client'] || '...'}".`,
          `Please revise the lender/client name to match the order form: "${data['Lender/Client'] || '...'}"`
        ]}
        onCopy={(text) => {
          navigator.clipboard.writeText(text);
          setNotification({ open: true, message: 'Copied to clipboard!', severity: 'success' });
        }}
        onAddToNotepad={(text) => {
          setNotes(prev => `${prev}\n- ${text}`);
          setNotification({ open: true, message: 'Added to notepad!', severity: 'success' });
        }}
      />
      <RevisionLanguageDialog
        open={isFinancialAssistanceRevisionLangDialogOpen}
        onClose={() => setFinancialAssistanceRevisionLangDialogOpen(false)}
        title="Financial Assistance Revision Language"
        prompts={[
          "The question is, ‘Is there any financial assistance (loan charges, sale concessions, gift or down payment assistance, etc.) to be paid by any party on behalf of the borrower?’ is marked on YES; however, the concession amount is noted as 0, please revise."
        ]}
        onCopy={(text) => {
          navigator.clipboard.writeText(text);
          setNotification({ open: true, message: 'Copied to clipboard!', severity: 'success' });
        }}
        onAddToNotepad={(text) => {
          setNotes(prev => `${prev}\n- ${text}`);
          setNotification({ open: true, message: 'Added to notepad!', severity: 'success' });
        }}
      />
      <RevisionLanguageDialog
        open={isDateOfContractRevisionLangDialogOpen}
        onClose={() => setDateOfContractRevisionLangDialogOpen(false)}
        title="Date of Contract Revision Language"
        prompts={[
          `The ‘Date of Contract’ "${data['Date of Contract'] || '...'}" noted in the contract section does not match with the purchase agreement; please revise.`
        ]}
        onCopy={(text) => {
          navigator.clipboard.writeText(text);
          setNotification({ open: true, message: 'Copied to clipboard!', severity: 'success' });
        }}
        onAddToNotepad={(text) => {
          setNotes(prev => `${prev}\n- ${text}`);
          setNotification({ open: true, message: 'Added to notepad!', severity: 'success' });
        }}
      />
      <RevisionLanguageDialog
        open={isHoaRevisionLangDialogOpen}
        onClose={() => setHoaRevisionLangDialogOpen(false)}
        title="HOA Revision Language"
        prompts={[
          "In the subject section, the HOA amount is noted; however, the ‘per year’ or ‘per month’ is not marked. Please revise.",
          "The PUD box is marked in the subject section; however, the HOA amount is noted as 0. Please verify."
        ]}
        onCopy={(text) => {
          navigator.clipboard.writeText(text);
          setNotification({ open: true, message: 'Copied to clipboard!', severity: 'success' });
        }}
        onAddToNotepad={(text) => {
          setNotes(prev => `${prev}\n- ${text}`);
          setNotification({ open: true, message: 'Added to notepad!', severity: 'success' });
          setHoaRevisionLangDialogOpen(false);
        }}
      />
      <RevisionLanguageDialog
        open={isonewithAccessoryUnitRevisionLangDialogOpen}
        onClose={() => setOneWithAccessoryUnitRevisionLangDialogOpen(false)}
        title="One with Accessory Unit Revision Language"
        prompts={[
          "Photos and sketches indicate the subject has an ADU; however, the ‘One with Accessory Unit’ box is not marked in the Improvements section; please revise.",
          "The guest house does not have a kitchen; however, it is marked as an accessory unit in the General Description. Please revise, as the guest house does not appear to meet the qualifications of an ADU.",
          "Photos and sketches do not indicate the ADU; however, the ‘One with Accessory Unit’ box is marked in the Improvements section; please revise."
        ]}
        onCopy={(text) => {
          navigator.clipboard.writeText(text);
          setNotification({ open: true, message: 'Copied to clipboard!', severity: 'success' });
        }}
        onAddToNotepad={(text) => {
          setNotes(prev => `${prev}\n- ${text}`);
          setNotification({ open: true, message: 'Added to notepad!', severity: 'success' });
          setOneWithAccessoryUnitRevisionLangDialogOpen(false);
        }}
      />
      <RevisionLanguageDialog
        open={isLenderClientAddressRevisionLangDialogOpen}
        onClose={() => setLenderClientAddressRevisionLangDialogOpen(false)}
        title="Lender/Client Address Revision Language"
        prompts={[
          `Please revise the lender/client address "${data['Address (Lender/Client)'] || '...'}" on the signature card:`,
          `Please revise the lender/client address city name "${data['Address (Lender/Client)'] || '...'}" to match the order form:`]}
        onCopy={(text) => {
          navigator.clipboard.writeText(text);
          setNotification({ open: true, message: 'Copied to clipboard!', severity: 'success' });
        }}
        onAddToNotepad={(text) => {
          setNotes(prev => `${prev}\n- ${text}`);
          setNotification({ open: true, message: 'Added to notepad!', severity: 'success' });
        }}
      />
      <RevisionLanguageDialog
        open={isContractPriceRevisionLangDialogOpen}
        onClose={() => setContractPriceRevisionLangDialogOpen(false)}
        title="Contract Price Revision Language"
        prompts={[
          "The ‘Contract Price’ noted in the report does not match with the purchase agreement; please revise.",
          `The report shows the ‘Contract Price’ as "${data['Contract Price $'] || '...'}"; however, the purchase agreement shows the contract price as "${data['Contract Price $'] || '...'}". Please verify.`
        ]}
        onCopy={(text) => {
          navigator.clipboard.writeText(text);
          setNotification({ open: true, message: 'Copied to clipboard!', severity: 'success' });
        }}
        onAddToNotepad={(text) => {
          setNotes(prev => `${prev}\n- ${text}`);
          setNotification({ open: true, message: 'Added to notepad!', severity: 'success' });
        }}
      />
      <RevisionLanguageDialog
        open={isNeighborhoodBoundariesRevisionLangDialogOpen}
        onClose={() => setNeighborhoodBoundariesRevisionLangDialogOpen(false)}
        title="Neighborhood Boundaries Revision Language"
        prompts={[
          "Please provide appropriate neighborhood boundaries of all directions in the Neighborhood section.",
          `The North boundary is missing from the ‘Neighborhood Boundaries’ "${data['Neighborhood Boundaries'] || '...'}", please provide`,
          `Please provide the south side boundary of the neighborhood "${data['Neighborhood Boundaries'] || '...'}" and revise the north boundary which is described twice.`
        ]}
        onCopy={(text) => {
          navigator.clipboard.writeText(text);
          setNotification({ open: true, message: 'Copied to clipboard!', severity: 'success' });
        }}
        onAddToNotepad={(text) => {
          setNotes(prev => `${prev}\n- ${text}`);
          setNotification({ open: true, message: 'Added to notepad!', severity: 'success' });
        }}
      />
      <RevisionLanguageDialog
        open={isOtherLandUseRevisionLangDialogOpen}
        onClose={() => setOtherLandUseRevisionLangDialogOpen(false)}
        title="Other Land Use Revision Language"
        prompts={[
          `Please revise the "${data['Present Land Use'] || '...'}" ‘Present Land Use’ percentage as it should be 100%.`,
          "Please comment on 10% other land usage."
        ]}
        onCopy={(text) => {
          navigator.clipboard.writeText(text);
          setNotification({ open: true, message: 'Copied to clipboard!', severity: 'success' });
        }}
        onAddToNotepad={(text) => {
          setNotes(prev => `${prev}\n- ${text}`);
          setNotification({ open: true, message: 'Added to notepad!', severity: 'success' });
        }}
      />
      <RevisionLanguageDialog
        open={isZoningComplianceRevisionLangDialogOpen}
        onClose={() => setZoningComplianceRevisionLangDialogOpen(false)}
        title="Zoning Compliance Revision Language"
        prompts={[
          "The ‘Zoning Compliance’ is marked on ‘Legal Nonconforming (Grandfathered Use)’; please comment if the subject can be rebuilt if destroyed.",
          "The ‘Zoning Compliance’ is marked as ‘No Zoning’; please comment if the subject can be rebuilt if destroyed."
        ]}
        onCopy={(text) => {
          navigator.clipboard.writeText(text);
          setNotification({ open: true, message: 'Copied to clipboard!', severity: 'success' });
        }}
        onAddToNotepad={(text) => {
          setNotes(prev => `${prev}\n- ${text}`);
          setNotification({ open: true, message: 'Added to notepad!', severity: 'success' });
        }}
      />
      <RevisionLanguageDialog
        open={isAreaRevisionLangDialogOpen}
        onClose={() => setAreaRevisionLangDialogOpen(false)}
        title="Area Revision Language"
        prompts={[
          `Please mention ac. or sf for site area "${data['Area'] || '...'}" in the site section.`
        ]}
        onCopy={(text) => {
          navigator.clipboard.writeText(text);
          setNotification({ open: true, message: 'Copied to clipboard!', severity: 'success' });
        }}
        onAddToNotepad={(text) => {
          setNotes(prev => `${prev}\n- ${text}`);
          setNotification({ open: true, message: 'Added to notepad!', severity: 'success' });
        }}
      />
      <RevisionLanguageDialog
        open={isFemaHazardRevisionLangDialogOpen}
        onClose={() => setFemaHazardRevisionLangDialogOpen(false)}
        title="FEMA Hazard Revision Language"
        prompts={[
          `‘FEMA Special Flood Hazard Area' marked as ‘NO’ ; however, FEMA Flood Zone is "${data['FEMA Flood Zone'] || '...'}"; please revise.`
        ]}
        onCopy={(text) => {
          navigator.clipboard.writeText(text);
          setNotification({ open: true, message: 'Copied to clipboard!', severity: 'success' });
        }}
        onAddToNotepad={(text) => {
          setNotes(prev => `${prev}\n- ${text}`);
          setNotification({ open: true, message: 'Added to notepad!', severity: 'success' });
        }}
      />
      {pdfPreviewOpen && (
        <Paper
          elevation={10}
          sx={{
            position: 'fixed',
            left: pdfPosition.x,
            top: pdfPosition.y,
            width: isPdfMinimized ? 300 : 600,
            height: isPdfMinimized ? 48 : 800,
            zIndex: 1300,
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
            resize: isPdfMinimized ? 'none' : 'both',
          }}
        >
          <Box
            onMouseDown={handleMouseDown}
            sx={{
              p: 1,
              bgcolor: 'primary.main',
              color: 'primary.contrastText',
              cursor: 'move',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              userSelect: 'none'
            }}
          >
            <Typography variant="subtitle2" noWrap sx={{ maxWidth: '200px' }}>PDF Preview</Typography>
            <Box>
              <IconButton size="small" onClick={() => setIsPdfMinimized(!isPdfMinimized)} sx={{ color: 'inherit' }}>
                {isPdfMinimized ? <KeyboardArrowUpIcon /> : <RemoveIcon />}
              </IconButton>
              <IconButton size="small" onClick={() => { setPdfPreviewOpen(false); URL.revokeObjectURL(pdfPreviewUrl); }} sx={{ color: 'inherit' }}>
                <CloseIcon />
              </IconButton>
            </Box>
          </Box>
          {!isPdfMinimized && (
            <Box sx={{ flexGrow: 1, bgcolor: 'grey.100', overflow: 'hidden' }}>
              <iframe src={pdfPreviewUrl} width="100%" height="100%" style={{ border: 'none' }} title="PDF Preview" />
            </Box>
          )}
        </Paper>
      )}
      <Dialog open={isClearDialogOpen} onClose={() => setIsClearDialogOpen(false)}>
        <DialogTitle>Clear All Data?</DialogTitle>
        <DialogContent>
          <Typography>This will remove all uploaded files and extracted data. This action cannot be undone.</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsClearDialogOpen(false)}>Cancel</Button>
          <Button onClick={confirmClearFiles} color="error" variant="contained" autoFocus>Clear All</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
export default Subject;
