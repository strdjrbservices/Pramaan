import React, { useState, useRef, useEffect } from 'react';
import {
  Box,
  Button,
  Typography,
  Paper,
  Alert,
  Grid,
  CircularProgress,
  LinearProgress,
  Snackbar,
  ThemeProvider,
  CssBaseline,
  Stack,
  Autocomplete,
  IconButton,
  TextField,
  Tooltip,

} from '@mui/material';
import { GlobalStyles } from '@mui/system';
import { lightTheme, darkTheme } from '../../theme';
import Sidebar from '../Subject/Sidebar';
import PremiumLogo from '../Subject/logo';
// import { GridInfoCard } from '../Subject/FormComponents';
// import { SalesComparisonSection } from '../Subject/tables';
import uploadSoundFile from '../../Assets/upload.mp3';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import DescriptionIcon from '@mui/icons-material/Description';
import AssignmentIcon from '@mui/icons-material/Assignment';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import VisibilityTwoToneIcon from '@mui/icons-material/VisibilityTwoTone';
import GetAppIcon from '@mui/icons-material/GetApp';
import AssessmentIcon from '@mui/icons-material/Assessment';
import SaveIcon from '@mui/icons-material/Save';
import CloseIcon from '@mui/icons-material/Close';
import RemoveIcon from '@mui/icons-material/Remove';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import successSoundFile from '../../Assets/success.mp3';
import errorSoundFile from '../../Assets/error.mp3';
import {
  fieldMapping,
  sections,
  assignmentPrompt,
  summaryPrompt,
  sitePrompt,
  dwellingExteriorPrompt,
  unitInteriorPrompt,
  amenitiesStoragePrompt,
  overallQualityHbuMarketPrompt,
  projectInformationListingsPrompt,
  salesComparisonPrompt,
  salesComparisonAdjustmentsSummaryPrompt,
  reconciliationAppraisalSummaryPrompt,
  certificationPrompt,
  sectionPrompts
} from './Scenario2Data';
import Scenario2Form from './Scenario2Form';

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
    '.sidebar-link.active': {
      transform: 'scale(1.05)',
      boxShadow: '0 4px 8px rgba(255, 255, 255, 0.2)',
      backgroundColor: '#7587ebff !important',
      color: '#ffffff !important',
      transition: 'transform 0.2s ease-in-out, boxShadow 0.2s ease-in-out',
    },
    '.section-active': {
      backgroundColor: 'rgba(22, 20, 20, 0.2) !important',
      transition: 'background-color 0.3s ease-in-out',
      borderRadius: '8px',
    }
  }} />
);

const playSound = (soundType) => {
  let soundFile;
  if (soundType === 'success') {
    soundFile = successSoundFile;
  } else if (soundType === 'error') {
    soundFile = errorSoundFile;
  } else if (soundType === 'upload') {
    soundFile = uploadSoundFile;
  } else {
    return;
  }
  try {
    const audio = new Audio(soundFile);
    audio.play().catch(e => console.error("Error playing sound:", e));
  } catch (e) {
    console.error("Error playing sound:", e);
  }
};

const Scenario2 = () => {
  const [file, setFile] = useState(null);
  const [htmlFile, setHtmlFile] = useState(null);
  const [contractFile, setContractFile] = useState(null);
  const [engagementLetterFile, setEngagementLetterFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [extractedData, setExtractedData] = useState({});
  const [rawResponse, setRawResponse] = useState('');
  const [timer, setTimer] = useState(0);
  const timerRef = useRef(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isSidebarLocked, setIsSidebarLocked] = useState(false);
  const [themeMode, setThemeMode] = useState('light');
  const [notification, setNotification] = useState({ open: false, message: '', severity: 'info' });
  const [extractionProgress, setExtractionProgress] = useState(0);
  const [editingField, setEditingField] = useState(null);
  const [loadingSection, setLoadingSection] = useState(null);
  const [extractionTime, setExtractionTime] = useState(null);
  // const [fullExtractionTime, setFullExtractionTime] = useState(null);
  const [fileSessionTimer, setFileSessionTimer] = useState(0);
  const fileSessionTimerRef = useRef(null);
  const [activeSection, setActiveSection] = useState('value-condition');
  const fileInputRef = useRef(null);
  const htmlFileInputRef = useRef(null);
  const contractFileInputRef = useRef(null);
  const engagementLetterFileInputRef = useRef(null);
  const [showRawData, setShowRawData] = useState(false);

  const [selectedFormType, setSelectedFormType] = useState({ label: 'Scenario 2', id: 'Scenario2' });
  // const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  const [isTimerRunning, setIsTimerRunning] = useState(true);
  // const [htmlExtractionTimer, setHtmlExtractionTimer] = useState(0);
  // const [isHtmlReviewLoading, setIsHtmlReviewLoading] = useState(false);
  
  // const [isComparisonDialogOpen, setIsComparisonDialogOpen] = useState(false);
  // const [isContractCompareOpen, setIsContractCompareOpen] = useState(false);
  // const [isEngagementLetterDialogOpen, setIsEngagementLetterDialogOpen] = useState(false);
  const [pdfPreviewOpen, setPdfPreviewOpen] = useState(false);
  const [pdfPreviewUrl, setPdfPreviewUrl] = useState(null);
  const [isPdfMinimized, setIsPdfMinimized] = useState(false);
  const [pdfPosition, setPdfPosition] = useState({ x: 50, y: 50 });
  const isDraggingRef = useRef(false);
  const dragStartRef = useRef({ x: 0, y: 0 });

  const handleThemeChange = () => {
    setThemeMode(prevMode => (prevMode === 'light' ? 'dark' : 'light'));
  };

  useEffect(() => {
    document.body.setAttribute('data-theme', themeMode);
  }, [themeMode]);

  useEffect(() => {
    return () => {
      if (fileSessionTimerRef.current) {
        clearInterval(fileSessionTimerRef.current);
      }
    };
  }, []);

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

  const handleTimerToggle = () => setIsTimerRunning(!isTimerRunning);

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setExtractedData({});
      setRawResponse('');
      setNotification({ open: true, message: 'File uploaded successfully.', severity: 'success' });
      playSound('upload');

      if (fileSessionTimerRef.current) {
        clearInterval(fileSessionTimerRef.current);
      }
      setFileSessionTimer(0);
      fileSessionTimerRef.current = setInterval(() => {
        if (isTimerRunning) setFileSessionTimer((prev) => prev + 1);
      }, 1000);
    }
  };
  const onHtmlFileChange = (e) => setHtmlFile(e.target.files[0]);
  const onContractFileChange = (e) => setContractFile(e.target.files[0]);
  const onEngagementLetterFileChange = (e) => setEngagementLetterFile(e.target.files[0]);

  const handleDataChange = (fieldPath, value) => {
    const field = fieldPath[0];
    setExtractedData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSalesGridDataChange = (fieldPath, value) => {
    // fieldPath comes as [saleName, fieldKey] e.g., ['Comparable 1', 'Property Address']
    const saleName = fieldPath[0];
    const fieldKey = fieldPath[1];
    
    if (saleName === 'Subject') {
        setExtractedData(prev => ({
            ...prev,
            [fieldKey]: value
        }));
    } else {
        const compIndex = saleName.split(' ')[1];
        const flatKey = `Comp ${compIndex} ${fieldKey}`;
        setExtractedData(prev => ({
            ...prev,
            [flatKey]: value
        }));
    }
  };

  const handleExtract = async (sectionIdOrEvent) => {
    const isEvent = sectionIdOrEvent && typeof sectionIdOrEvent === 'object' && sectionIdOrEvent.preventDefault;
    if (isEvent) sectionIdOrEvent.preventDefault();
    const sectionId = typeof sectionIdOrEvent === 'string' ? sectionIdOrEvent : null;

    if (!file) {
      setNotification({ open: true, message: 'Please upload a PDF file.', severity: 'warning' });
      return;
    }

    const startTime = Date.now();
    setExtractionTime(null);

    setTimer(0);
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => setTimer((prev) => prev + 1), 1000);

    if (sectionId) {
      setLoadingSection(sectionId);
    } else {
      setLoading(true);
      setExtractedData({});
      setRawResponse('');
      setExtractionProgress(0);
    }

    const formData = new FormData();
    formData.append('file', file);
    formData.append('form_type', selectedFormType.id);

    let prompt;
    const instruction = "Extract the following data points from the uploaded appraisal report. Return ONLY a valid JSON object where keys are the specific keys provided in the prompt and values are the extracted text. Do not include any markdown formatting, no 'summary' fields, no 'comparison_summary', and no conversational text. If a value is not found, use null or an empty string.";

    if (sectionId && sectionPrompts[sectionId]) {
      prompt = `${instruction}
      ${sectionPrompts[sectionId]}`;
    } else {
      prompt = `${instruction}
      ${assignmentPrompt}
      ${summaryPrompt}
      ${sitePrompt}
      ${dwellingExteriorPrompt}
      ${unitInteriorPrompt}
      ${amenitiesStoragePrompt}
      ${overallQualityHbuMarketPrompt}
      ${projectInformationListingsPrompt}
      ${salesComparisonPrompt}
      ${salesComparisonAdjustmentsSummaryPrompt}
      ${reconciliationAppraisalSummaryPrompt}
      ${certificationPrompt}`;
    }

    formData.append('comment', prompt);

    let progressInterval;
    if (!sectionId) {
      progressInterval = setInterval(() => {
        setExtractionProgress(prev => (prev < 90 ? prev + 10 : prev));
      }, 500);
    }

    try {
      const response = await fetch('https://strdjrbservices1.pythonanywhere.com/api/extract/', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to extract data');
      }

      const text = await response.text();
      setRawResponse(text);
      let data = {};
      try {
        const jsonStartIndex = text.indexOf('{');
        const jsonEndIndex = text.lastIndexOf('}');
        let cleanedText = text;
        if (jsonStartIndex !== -1 && jsonEndIndex !== -1 && jsonEndIndex > jsonStartIndex) {
            cleanedText = text.substring(jsonStartIndex, jsonEndIndex + 1);
        }
        cleanedText = cleanedText.replace(/```json/g, '').replace(/```/g, '').trim();
        data = JSON.parse(cleanedText);
        let rawFields = data.fields || data.data || data;

        const originalRawFields = rawFields;

        // Normalize array to object if needed
        if (Array.isArray(rawFields)) {
          const flattened = {};
          rawFields.forEach(item => {
            if (typeof item === 'object' && item !== null) {
              if (item.key && item.value !== undefined) {
                flattened[item.key] = item.value;
              } else {
                Object.assign(flattened, item);
              }
            }
          });
          rawFields = flattened;
        }

        const mappedData = {};

        // Helper to find key case-insensitively
        const findKey = (obj, targetKey) => {
          if (!obj || typeof obj !== 'object') return undefined;
          const normalizedTarget = targetKey.toLowerCase().trim();
          return Object.keys(obj).find(k => k.toLowerCase().trim() === normalizedTarget);
        };

        // Check for comparison_summary array
        const comparisonSummary = (rawFields && rawFields.comparison_summary) || (Array.isArray(originalRawFields) ? originalRawFields : null);

        Object.keys(fieldMapping).forEach(key => {
          const label = fieldMapping[key];
          let value = rawFields ? rawFields[key] : undefined;

          // Strategy 1: Check comparison_summary if available
          if (value === undefined && Array.isArray(comparisonSummary)) {
            const summaryItem = comparisonSummary.find(item => {
              if (!item.section) return false;
              const sectionLower = item.section.toLowerCase();
              // Check if section contains the label or the key (more robust matching)
              return sectionLower.includes(label.toLowerCase()) || sectionLower.includes(key.toLowerCase());
            });
            if (summaryItem) {
              value = summaryItem.comment;
              // Attempt to extract value from comment if it follows pattern "Extracted 'Value' ..."
              const match = value && value.match(/Extracted '([^']*)'/);
              if (match && match[1]) {
                value = match[1];
              }
            }
          }

          // Fallback strategies if direct key match fails
          if (value === undefined) {
             // Try finding by key case-insensitive
             const foundKey = findKey(rawFields, key);
             if (foundKey) value = rawFields[foundKey];
          }
          if (value === undefined) {
             // Try finding by label
             const foundLabelKey = findKey(rawFields, label);
             if (foundLabelKey) value = rawFields[foundLabelKey];
          }

          if (value !== undefined && value !== null) {
            if (typeof value === 'boolean') {
                value = value ? 'Yes' : 'No';
            } else if (typeof value === 'string') {
                value = value.trim();
                if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
                    value = value.substring(1, value.length - 1);
                }
            }
            mappedData[label] = value;
          } else if (!sectionId) {
            mappedData[label] = '';
          }
        });
        if (sectionId) {
          setExtractedData(prev => ({ ...prev, ...mappedData }));
        } else {
          setExtractedData(mappedData);
        }

      } catch (parseError) {
        console.warn("Could not parse JSON", parseError);
        setExtractedData({ 'Assignment Information': text });
      }
      setNotification({ open: true, message: 'Extraction completed successfully.', severity: 'success' });
      playSound('success');

    } catch (err) {
      setNotification({ open: true, message: err.message, severity: 'error' });
      playSound('error');
    } finally {
      const endTime = Date.now();
      const duration = ((endTime - startTime) / 1000).toFixed(2);
      setExtractionTime(duration);
      if (!sectionId) {
        setFullExtractionTime(duration);
      }
      if (sectionId) {
        setLoadingSection(null);
      } else {
        setLoading(false);
        clearInterval(progressInterval);
        setExtractionProgress(100);
      }
      if (timerRef.current) clearInterval(timerRef.current);
    }
  };

  const handleClearAll = () => {
    setFile(null);
    setHtmlFile(null);
    setContractFile(null);
    setEngagementLetterFile(null);
    setExtractedData({});
    setRawResponse('');
    setFileSessionTimer(0);
    if (fileInputRef.current) fileInputRef.current.value = '';
    if (htmlFileInputRef.current) htmlFileInputRef.current.value = '';
    if (contractFileInputRef.current) contractFileInputRef.current.value = '';
    if (engagementLetterFileInputRef.current) engagementLetterFileInputRef.current.value = '';
  };

  const handleGeneratePdf = () => {
    setNotification({ open: true, message: 'PDF Generation not implemented yet.', severity: 'info' });
  };

  const handleExportJSON = () => {
    const jsonString = JSON.stringify(extractedData, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const href = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = href;
    link.download = `extraction_${file ? file.name : 'data'}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleGenerateValidationLog = () => {
    setNotification({ open: true, message: 'Validation Log not implemented yet.', severity: 'info' });
  };

  const handlePreviewPdf = (fileToPreview) => {
    if (fileToPreview) {
      const fileURL = URL.createObjectURL(fileToPreview);
      setPdfPreviewUrl(fileURL);
      setPdfPreviewOpen(true);
      setIsPdfMinimized(false);
    }
  };

  const handleCloseNotification = () => {
    setNotification({ ...notification, open: false });
  };

  const handleSaveToDB = async () => {
    if (!extractedData || Object.keys(extractedData).length === 0) {
      setNotification({ open: true, message: 'No data to save.', severity: 'warning' });
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('https://strdjrbservices1.pythonanywhere.com/api/save-report/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          form_type: selectedFormType.id,
          data: extractedData,
          file_name: file ? file.name : null
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to save data to database.');
      }

      setNotification({ open: true, message: 'Data saved to database successfully.', severity: 'success' });
      playSound('success');
    } catch (err) {
      console.error(err);
      setNotification({ open: true, message: err.message || 'Error saving data.', severity: 'error' });
      playSound('error');
    } finally {
      setLoading(false);
    }
  };

  const activeTheme = themeMode === 'light' ? lightTheme : darkTheme;
  const formTypes = [
    { label: 'Scenario 1', id: 'Scenario1' },
    { label: 'Scenario 2', id: 'Scenario2' },
    { label: 'Scenario 3', id: 'Scenario3' },
    { label: 'Scenario 4', id: 'Scenario4' },
    { label: 'Scenario 5', id: 'Scenario5' },
    { label: 'Scenario 6', id: 'Scenario6' },
  ];
  
  // Aliases for UI compatibility
  const data = extractedData;
  const selectedFile = file;
  const onFileChange = handleFileChange;
  const fileUploadTimer = fileSessionTimer;
  const lastExtractionTime = extractionTime;

  return (
    <ThemeProvider theme={activeTheme}>
      <CssBaseline />
      <TooltipStyles />
      <div className="page-container">
        <Sidebar
          sections={sections}
          isOpen={isSidebarOpen || isSidebarLocked}
          isLocked={isSidebarLocked}
          onLockToggle={() => setIsSidebarLocked(!isSidebarLocked)}
          onMouseEnter={() => { if (!isSidebarLocked) setIsSidebarOpen(true); }}
          onMouseLeave={() => { if (!isSidebarLocked) setIsSidebarOpen(false); }}
          onSectionClick={(section) => {
            handleExtract(section.id);
            setActiveSection(section.id);
            const el = document.getElementById(section.id);
            if (el) el.scrollIntoView({ behavior: 'smooth' });
          }}
          onThemeToggle={handleThemeChange}
          currentTheme={themeMode}
          activeSection={activeSection}
          loadingSection={loadingSection}
        />

        <div className={`main-content container-fluid ${isSidebarOpen || isSidebarLocked ? 'sidebar-open' : ''}`}>
          <Box className="header-container" sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 2, my: 2 }}>
            <PremiumLogo size={80} fullScreen={false} />
            <Typography variant="h3" component="h1" className="app-title" sx={{ fontFamily: 'BBH Sans Hegarty', fontWeight: 'bold', fontSize: { xs: '2rem', md: '3rem' } }}>
              SCENARIO 2 REVIEW
            </Typography>
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
            <Grid container>
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
                    <Button size="small" color="error" onClick={handleClearAll} startIcon={<DeleteForeverIcon />}>
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
            </Grid>

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
                      color="primary"
                      onClick={() => handleExtract()}
                      disabled={loading || !file}
                      startIcon={loading ? <CircularProgress size={14} color="inherit" /> : <DescriptionIcon fontSize="small" />}
                    >
                      <Box component="span" sx={{ display: { xs: 'none', sm: 'inline' } }}>
                        {loading ? 'Extracting' : 'Extract'}
                      </Box>
                    </Button>

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

          <Box sx={{ mt: 4 }}>
            {selectedFormType.id === 'Scenario2' && (
              <Scenario2Form
                extractedData={extractedData}
                handleDataChange={handleDataChange}
                handleSalesGridDataChange={handleSalesGridDataChange}
                editingField={editingField}
                setEditingField={setEditingField}
              />
            )}

          </Box>

          {(rawResponse || Object.keys(extractedData).length > 0) && (
            <Box sx={{ mt: 4, p: 3, bgcolor: 'background.paper', borderRadius: 2, boxShadow: 1 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6">Raw Extraction Data</Typography>
                <Button onClick={() => setShowRawData(!showRawData)} variant="outlined" size="small">
                  {showRawData ? 'Hide' : 'Show'} Raw Data
                </Button>
              </Box>
              {showRawData && <Paper variant="outlined" sx={{ p: 2, maxHeight: 400, overflow: 'auto', bgcolor: 'grey.50' }}>
                <pre style={{ margin: 0, whiteSpace: 'pre-wrap', wordBreak: 'break-word', fontSize: '0.8rem' }}>
                  {rawResponse || JSON.stringify(extractedData, null, 2)}
                </pre>
              </Paper>}
            </Box>
          )}

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

          <Snackbar open={notification.open} autoHideDuration={6000} onClose={handleCloseNotification} anchorOrigin={{ vertical: 'top', horizontal: 'center' }}>
            <Alert onClose={handleCloseNotification} severity={notification.severity} variant="filled" sx={{ width: '100%' }}>
              {notification.message}
            </Alert>
          </Snackbar>
        </div>
      </div>
    </ThemeProvider>
  );
};

export default Scenario2;