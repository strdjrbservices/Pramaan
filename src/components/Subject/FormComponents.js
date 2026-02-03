import React from 'react';
import { checkContractFieldsMandatory, checkFinancialAssistanceInconsistency, checkContractAnalysisConsistency, checkYesNoOnly } from './contractValidation';
import { checkTaxYear, checkRETaxes, checkSpecialAssessments, checkPUD, checkHOA, checkOfferedForSale, checkAnsi, checkFullAddressConsistency, checkPresence, checkAssignmentTypeConsistency, checkSubjectFieldsNotBlank } from './subjectValidation';
import { checkZoning, checkZoningDescription, checkSpecificZoningClassification, checkHighestAndBestUse, checkFemaInconsistency, checkFemaFieldsConsistency, checkSiteSectionBlank, checkArea, checkYesNoWithComment, checkUtilities } from './siteValidation';
import { checkHousingPriceAndAge, checkNeighborhoodUsageConsistency, checkSingleChoiceFields, checkNeighborhoodBoundaries, checkNeighborhoodFieldsNotBlank, checkOtherLandUseComment } from './neighborhoodValidation';
import { checkUnits, checkAccessoryUnit, checkNumberOfStories, checkPropertyType, checkConstructionStatusAndReconciliation, checkDesignStyle, checkYearBuilt, checkEffectiveAge, checkAdditionalFeatures, checkPropertyConditionDescription, checkPhysicalDeficienciesImprovements, checkNeighborhoodConformity, checkFoundationType, checkBasementDetails, checkEvidenceOf, checkMaterialCondition, checkHeatingFuel, checkCarStorage, checkImprovementsFieldsNotBlank } from './improvementsValidation';
import { checkConditionAdjustment, checkBedroomsAdjustment, checkBathsAdjustment, checkQualityOfConstructionAdjustment, checkProximityToSubject, checkSiteAdjustment, checkGrossLivingAreaAdjustment, checkSubjectAddressInconsistency, checkDesignStyleAdjustment, checkFunctionalUtilityAdjustment, checkEnergyEfficientItemsAdjustment, checkPorchPatioDeckAdjustment, checkHeatingCoolingAdjustment, checkDataSourceDOM, checkActualAgeAdjustment, checkLeaseholdFeeSimpleConsistency, checkDateOfSale, checkLocationConsistency, checkSalePrice, checkSubjectAgeConsistency } from './salesComparisonValidation';
import { checkFinalValueConsistency, checkCostApproachDeveloped, checkAppraisalCondition, checkAsOfDate, checkFinalValueBracketing, checkReconciliationFieldsNotBlank } from './reconciliationValidation';
import { checkLenderAddressInconsistency, checkLenderNameInconsistency, checkAppraiserFieldsNotBlank, checkLicenseNumberConsistency as checkAppraiserLicenseConsistency, checkDateGreaterThanToday, checkClientNameHtmlConsistency } from './appraiserLenderValidation';
import { checkCostNew, checkSourceOfCostData, checkIndicatedValueByCostApproach, checkCostApproachFieldsNotBlank } from './costApproachValidation';
import { checkResearchHistory, checkSubjectPriorSales, checkComparablePriorSales, checkDataSourceNotBlank, checkEffectiveDateIsCurrentYear, checkSubjectPriorSaleDate, checkCompPriorSaleDate } from './salesHistoryValidation';
import { checkStateRequirements } from './stateValidation';
import { checkLeaseDates, checkOtherBasement } from './rentScheduleValidation';
import { checkIncomeApproachFieldsNotBlank } from './incomeApproachValidation';
import { checkPudInformationFieldsNotBlank } from './pudInformationValidation';
import { checkMarketConditionsFieldsNotBlank, checkMarketConditionsTableFields } from './marketConditionsValidation';
import { checkProjectInfoFieldsNotBlank, checkCondoForeclosureFieldsNotBlank } from './form1073Validation';
import { checkProjectAnalysisFieldsNotBlank } from './projectAnalysisValidation';
import { checkUnitDescriptionsFieldsNotBlank } from './unitDescriptionsValidation';
import { checkProjectSiteFieldsNotBlank } from './projectSiteValidation';
import { checkPriorSaleHistoryFieldsNotBlank } from './priorSaleHistoryValidation';
import { checkInfoOfSalesFieldsNotBlank } from './infoOfSalesValidation';
import { Tooltip, Box, LinearProgress, Paper, Typography, IconButton, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import LibraryBooksIcon from '@mui/icons-material/LibraryBooks';
import { ThumbUp as ThumbUpIcon, PlaylistAdd as PlaylistAddIcon } from '@mui/icons-material';


const HighlightKeywords = ({ text, keywords }) => {
  if (!keywords || !text) {
    return text;
  }
  const regex = new RegExp(`(${keywords.join('|')})`, 'gi');
  const parts = text.split(regex);

  return (
    <span>
      {parts.map((part, i) =>
        i % 2 === 1 ? (
          <span key={i} style={{ backgroundColor: '#91ff00ff', color: '#000000', padding: '1px 3px', borderRadius: '3px' }}>{part}</span>
        ) : (
          part
        )
      )}
    </span>
  );
};

export const EditableField = ({ fieldPath, value, onDataChange, editingField, setEditingField, usePre, isMissing, inputClassName, inputStyle, isEditable, isAdjustment, allData, saleName, manualValidations, handleManualValidation, revisionHandlers = {}, customValidation }) => {
  const isEditing = isEditable && editingField && JSON.stringify(editingField) === JSON.stringify(fieldPath);

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !usePre) {
      setEditingField(null);
      onDataChange(fieldPath, e.target.value);

    } else if (e.key === 'Escape') {
      setEditingField(null);
    }
  };

  const handleContainerClick = () => {
    if (!isEditing && isEditable) {
      setEditingField(fieldPath);
    }
  };

  const validationRegistry = {
    // Site Validations
    'Zoning Compliance': [checkZoning],
    'Zoning Description': [checkZoningDescription],
    'Specific Zoning Classification': [checkSpecificZoningClassification],
    'Is the highest and best use of subject property as improved (or as proposed per plans and specifications) the present use?': [checkHighestAndBestUse],
    'FEMA Special Flood Hazard Area': [checkFemaInconsistency, checkFemaFieldsConsistency],
    'FEMA Flood Zone': [checkFemaInconsistency, checkFemaFieldsConsistency],
    'FEMA Map #': [checkFemaFieldsConsistency],
    'FEMA Map Date': [checkFemaFieldsConsistency],
    'Dimensions': [checkSiteSectionBlank],
    'Shape': [checkSiteSectionBlank],
    'View': [checkSiteSectionBlank],
    'Area': [checkArea],
    
    'Are the utilities and off-site improvements typical for the market area? If No, describe': [(field, text, data) => checkYesNoWithComment(field, text, data, { name: 'Are the utilities and off-site improvements typical for the market area? If No, describe', wantedValue: 'yes', unwantedValue: 'no' })],
    'Are there any adverse site conditions or external factors (easements, encroachments, environmental conditions, land uses, etc.)? If Yes, describe': [(field, text, data) => checkYesNoWithComment(field, text, data, { name: 'Are there any adverse site conditions or external factors (easements, encroachments, environmental conditions, land uses, etc.)? If Yes, describe', wantedValue: 'no', unwantedValue: 'yes' })],
    "Electricity": [checkUtilities], "Gas": [checkUtilities], "Water": [checkUtilities], "Sanitary Sewer": [checkUtilities], "Street": [checkUtilities], "Alley": [checkUtilities],

    // Subject Validations
    'Full Address': [checkFullAddressConsistency],
    'Exposure comment': [checkPresence],
    'Prior service comment': [checkPresence],
    'ADU File Check': [checkPresence],
    'FHA Case No.': [checkPresence],
    'Tax Year': [checkTaxYear],
    'R.E. Taxes $': [checkRETaxes],
    'Special Assessments $': [checkSpecialAssessments],
    'PUD': [checkPUD, checkHOA],
    'HOA $': [checkHOA],
    'Offered for Sale in Last 12 Months': [checkOfferedForSale],
    'ANSI': [checkAnsi],
    'State': [checkStateRequirements],
    'Property Address': [checkSubjectFieldsNotBlank, checkSubjectAddressInconsistency],
    'County': [checkSubjectFieldsNotBlank],
    'Borrower': [checkSubjectFieldsNotBlank],
    'Owner of Public Record': [checkSubjectFieldsNotBlank],
    'Legal Description': [checkSubjectFieldsNotBlank],
    "Assessor's Parcel #": [checkSubjectFieldsNotBlank],
    'Neighborhood Name': [checkSubjectFieldsNotBlank],
    'Map Reference': [checkSubjectFieldsNotBlank],
    'Census Tract': [checkSubjectFieldsNotBlank],
    'Occupant': [checkSubjectFieldsNotBlank],
    'Property Rights Appraised': [checkSubjectFieldsNotBlank],
    'Lender/Client': [checkSubjectFieldsNotBlank, checkLenderNameInconsistency],
    'Address (Lender/Client)': [checkSubjectFieldsNotBlank, checkLenderAddressInconsistency],

    // Neighborhood Validations
    'one unit housing price(high,low,pred)': [checkHousingPriceAndAge, checkNeighborhoodFieldsNotBlank],
    'one unit housing age(high,low,pred)': [checkHousingPriceAndAge, checkNeighborhoodFieldsNotBlank],
    "One-Unit": [checkNeighborhoodUsageConsistency, checkNeighborhoodFieldsNotBlank],
    "2-4 Unit": [checkNeighborhoodUsageConsistency, checkNeighborhoodFieldsNotBlank],
    "Multi-Family": [checkNeighborhoodUsageConsistency, checkNeighborhoodFieldsNotBlank],
    "Commercial": [checkNeighborhoodUsageConsistency, checkNeighborhoodFieldsNotBlank],
    "Other": [checkNeighborhoodUsageConsistency, checkNeighborhoodFieldsNotBlank, checkOtherLandUseComment],
    "Neighborhood Boundaries": [checkNeighborhoodBoundaries, checkNeighborhoodFieldsNotBlank],
    "Built-Up": [checkSingleChoiceFields, checkNeighborhoodFieldsNotBlank], "Growth": [checkSingleChoiceFields, checkNeighborhoodFieldsNotBlank], "Property Values": [checkSingleChoiceFields, checkNeighborhoodFieldsNotBlank], "Demand/Supply": [checkSingleChoiceFields, checkNeighborhoodFieldsNotBlank], "Marketing Time": [checkSingleChoiceFields, checkNeighborhoodFieldsNotBlank],
    "Neighborhood Description": [checkNeighborhoodFieldsNotBlank],
    "Market Conditions:": [checkNeighborhoodFieldsNotBlank],

    // Improvements Validations
    'Units': [checkUnits, checkAccessoryUnit],
    '# of Stories': [checkNumberOfStories],
    'Type': [checkPropertyType],
    'Existing/Proposed/Under Const.': [checkConstructionStatusAndReconciliation],
    'Design (Style)': [checkDesignStyle, checkDesignStyleAdjustment],
    'Year Built': [checkYearBuilt],
    'Effective Age (Yrs)': [checkEffectiveAge],
    'Additional features': [checkAdditionalFeatures],
    'Describe the condition of the property': [checkPropertyConditionDescription],
    'Are there any physical deficiencies or adverse conditions that affect the livability, soundness, or structural integrity of the property? If Yes, describe': [checkPhysicalDeficienciesImprovements],
    'Does the property generally conform to the neighborhood (functional utility, style, condition, use, construction, etc.)? If No, describe': [checkNeighborhoodConformity],
    'Foundation Type': [checkFoundationType],
    'Basement Area sq.ft.': [checkBasementDetails],
    'Basement Finish %': [checkBasementDetails],
    'Infestation': [checkEvidenceOf], 'Dampness': [checkEvidenceOf], 'Settlement': [checkEvidenceOf],
    'Foundation Walls (Material/Condition)': [checkMaterialCondition], 'Exterior Walls (Material/Condition)': [checkMaterialCondition],
    'Roof Surface (Material/Condition)': [checkMaterialCondition], 'Gutters & Downspouts (Material/Condition)': [checkMaterialCondition],
    'Window Type (Material/Condition)': [checkMaterialCondition], 'Floors (Material/Condition)': [checkMaterialCondition],
    'Walls (Material/Condition)': [checkMaterialCondition],
    'Trim/Finish (Material/Condition)': [checkMaterialCondition],
    'Bath Floor (Material/Condition)': [checkMaterialCondition], 'Bath Wainscot (Material/Condition)': [checkMaterialCondition],
    'Fuel': [checkHeatingFuel, checkImprovementsFieldsNotBlank],
    'Car Storage': [checkCarStorage, checkImprovementsFieldsNotBlank],
    'Attic': [checkImprovementsFieldsNotBlank],
    'Heating Type': [checkImprovementsFieldsNotBlank],
    'Cooling Type': [checkImprovementsFieldsNotBlank],
    'Fireplace(s) #': [checkImprovementsFieldsNotBlank],
    'Patio/Deck': [checkImprovementsFieldsNotBlank],
    'Pool': [checkImprovementsFieldsNotBlank],
    'Woodstove(s) #': [checkImprovementsFieldsNotBlank],
    'Fence': [checkImprovementsFieldsNotBlank],
    'Porch': [checkImprovementsFieldsNotBlank],
    'Other Amenities': [checkImprovementsFieldsNotBlank],
    'Appliances': [checkImprovementsFieldsNotBlank],

    // Sales Comparison Validations
    'Address': [checkSubjectAddressInconsistency],
    'Condition': [checkConditionAdjustment], 'Condition Adjustment': [checkConditionAdjustment],
    'Bedrooms': [checkBedroomsAdjustment], 'Bedrooms Adjustment': [checkBedroomsAdjustment],
    'Baths': [checkBathsAdjustment], 'Baths Adjustment': [checkBathsAdjustment],
    'Quality of Construction': [checkQualityOfConstructionAdjustment], 'Quality of Construction Adjustment': [checkQualityOfConstructionAdjustment],
    'Proximity to Subject': [checkProximityToSubject],
    'Site': [checkSiteAdjustment], 'Site Adjustment': [checkSiteAdjustment],
    'Gross Living Area': [checkGrossLivingAreaAdjustment], 'Gross Living Area Adjustment': [checkGrossLivingAreaAdjustment],
    'Design (Style) Adjustment': [checkDesignStyleAdjustment],
    'Functional Utility': [checkFunctionalUtilityAdjustment], 'Functional Utility Adjustment': [checkFunctionalUtilityAdjustment],
    'Energy Efficient Items': [checkEnergyEfficientItemsAdjustment], 'Energy Efficient Items Adjustment': [checkEnergyEfficientItemsAdjustment],
    'Porch/Patio/Deck': [checkPorchPatioDeckAdjustment], 'Porch/Patio/Deck Adjustment': [checkPorchPatioDeckAdjustment],
    'Heating/Cooling': [checkHeatingCoolingAdjustment], 'Heating/Cooling Adjustment': [checkHeatingCoolingAdjustment],
    'Data Source(s)': [checkDataSourceDOM],
    // 'Actual Age': [checkActualAgeAdjustment], 'Actual Age Adjustment': [checkActualAgeAdjustment],
    'Actual Age': [checkActualAgeAdjustment, checkSubjectAgeConsistency], 'Actual Age Adjustment': [checkActualAgeAdjustment],
    'Sale Price': [checkSalePrice],
    'Leasehold/Fee Simple': [checkLeaseholdFeeSimpleConsistency],
    'Date of Sale/Time': [checkDateOfSale],
    'Location': [checkLocationConsistency],

    // Rent Schedule Validations
    'Date Lease Begins': [checkLeaseDates],
    'Date Lease Expires': [checkLeaseDates],
    'Other (e.g., basement, etc.)': [checkOtherBasement],

    // Reconciliation Validations
    'Indicated Value by Sales Comparison Approach $': [checkFinalValueConsistency],
    'Indicated Value by: Sales Comparison Approach $': [checkFinalValueConsistency, checkCostApproachDeveloped],
    'opinion of the market value, as defined, of the real property that is the subject of this report is $': [checkFinalValueConsistency],
    'APPRAISED VALUE OF SUBJECT PROPERTY $': [checkFinalValueConsistency],
    'Cost Approach (if developed)': [checkCostApproachDeveloped],
    'This appraisal is made "as is", subject to completion per plans and specifications on the basis of a hypothetical condition that the improvements have been completed, subject to the following repairs or alterations on the basis of a hypothetical condition that the repairs or alterations have been completed, or subject to the following required inspection based on the extraordinary assumption that the condition or deficiency does not require alteration or repair:': [checkAppraisalCondition],
    'as of': [checkAsOfDate],

    'final value': [checkFinalValueBracketing, checkReconciliationFieldsNotBlank],
    // Appraiser/Lender Validations
    'Lender/Client Company Address': [checkLenderAddressInconsistency],

    // General Validations
    'Assignment Type': [checkAssignmentTypeConsistency],

    // Contract Validations
    "I did did not analyze the contract for sale for the subject purchase transaction. Explain the results of the analysis of the contract for sale or why the analysis was not performed.": [checkContractFieldsMandatory, checkContractAnalysisConsistency],
    "Contract Price $": [checkContractFieldsMandatory, checkContractAnalysisConsistency],
    "Date of Contract": [checkContractFieldsMandatory, checkContractAnalysisConsistency],
    "Is property seller owner of public record?": [
      checkContractAnalysisConsistency,
      (field, text, data) => checkYesNoOnly(field, text, data, {
        name: 'Is property seller owner of public record?'
      })],
    // "Data Source(s)": [checkContractAnalysisConsistency],
    "Data Source(s) (Contract)": [checkContractFieldsMandatory, checkContractAnalysisConsistency],
    "Is there any financial assistance (loan charges, sale concessions, gift or downpayment assistance, etc.) to be paid by any party on behalf of the borrower?": [
      checkContractAnalysisConsistency,
      (field, text, data) => checkYesNoOnly(field, text, data, {
        name: 'Is there any financial assistance (loan charges, sale concessions, gift or downpayment assistance, etc.) to be paid by any party on behalf of the borrower?'
      }),
      checkFinancialAssistanceInconsistency],
    "If Yes, report the total dollar amount and describe the items to be paid": [checkFinancialAssistanceInconsistency, checkContractAnalysisConsistency],
  };

  validationRegistry['final value'] = [checkFinalValueConsistency, checkFinalValueBracketing];
  // Appraiser Validations
  const appraiserFieldsToValidate = [
    "Signature", "Name", "Company Name", "Company Address", "Telephone Number",
    "Email Address", "Date of Signature and Report", "Effective Date of Appraisal",
    "State Certification #", "or State License #", "or Other (describe)", "State #",
    "State", "Expiration Date of Certification or License", "ADDRESS OF PROPERTY APPRAISED",
    "APPRAISED VALUE OF SUBJECT PROPERTY $", "LENDER/CLIENT Name", "Lender/Client Company Name",
    "Lender/Client Company Address", "Lender/Client Email Address"
  ];

  appraiserFieldsToValidate.forEach(field => {
    if (!validationRegistry[field]) {
      validationRegistry[field] = [];
    }
    validationRegistry[field].push(checkAppraiserFieldsNotBlank);
  });

  validationRegistry['Lender/Client Company Address'].push(checkLenderAddressInconsistency);
  validationRegistry['LENDER/CLIENT Name'].push(checkLenderNameInconsistency, checkClientNameHtmlConsistency);
  validationRegistry['LICENSE/REGISTRATION/CERTIFICATION #'] = [checkAppraiserLicenseConsistency]; 
  validationRegistry['Policy Period To'] = [checkDateGreaterThanToday];
  validationRegistry['License Vaild To'] = [checkDateGreaterThanToday];

  // Cost Approach Validations
  validationRegistry["ESTIMATED/REPRODUCTION / REPLACEMENT COST NEW"] = [checkCostNew];
  validationRegistry["Source of cost data"] = [checkSourceOfCostData];
  validationRegistry["Indicated Value By Cost Approach......................................................=$"] = [checkIndicatedValueByCostApproach];

  const costApproachFieldsToValidate = [
    "Estimated", "Source of cost data", "Quality rating from cost service ",
    "Effective date of cost data ", "Comments on Cost Approach (gross living area calculations, depreciation, etc.)",
    "OPINION OF SITE VALUE = $ ................................................", "Dwelling", "Garage/Carport ",
    " Total Estimate of Cost-New  = $ ...................", "Depreciation ",
    "Depreciated Cost of Improvements......................................................=$ ",
    "“As-is” Value of Site Improvements......................................................=$",
    "Indicated Value By Cost Approach......................................................=$"
  ];
  costApproachFieldsToValidate.forEach(field => {
    if (!validationRegistry[field]) {
      validationRegistry[field] = [];
    }
    validationRegistry[field].push(checkCostApproachFieldsNotBlank);
  });


  validationRegistry["I did did not research the sale or transfer history of the subject property and comparable sales. If not, explain"] = [checkResearchHistory];
  validationRegistry["My research did did not reveal any prior sales or transfers of the subject property for the three years prior to the effective date of this appraisal."] = [checkSubjectPriorSales];
  validationRegistry["My research did did not reveal any prior sales or transfers of the comparable sales for the year prior to the date of sale of the comparable sale."] = [checkComparablePriorSales];
  validationRegistry["Data Source(s) for subject property research"] = [checkDataSourceNotBlank];
  validationRegistry["Data Source(s) for comparable sales research"] = [checkDataSourceNotBlank];
  validationRegistry["Summary of Sales Comparison Approach"] = [checkDataSourceNotBlank];
  validationRegistry["Effective Date of Data Source(s) for prior sale"] = [checkEffectiveDateIsCurrentYear];
  validationRegistry["Date of Prior Sale/Transfer"] = [checkSubjectPriorSaleDate, checkCompPriorSaleDate];

  const incomeApproachFieldsToValidate = [
    "Estimated Monthly Market Rent $", "X Gross Rent Multiplier  = $",
    "Indicated Value by Income Approach", "Summary of Income Approach (including support for market rent and GRM) "
  ];
  incomeApproachFieldsToValidate.forEach(field => {
    if (!validationRegistry[field]) validationRegistry[field] = [];
    validationRegistry[field].push(checkIncomeApproachFieldsNotBlank);
  });

  const pudInformationFieldsToValidate = [
    "PUD Fees $", "PUD Fees (per month)", "PUD Fees (per year)",
    "Is the developer/builder in control of the Homeowners' Association (HOA)?", "Unit type(s)",
    "Provide the following information for PUDs ONLY if the developer/builder is in control of the HOA and the subject property is an attached dwelling unit.",
    "Legal Name of Project", "Total number of phases", "Total number of units",
    "Total number of units sold", "Total number of units rented", "Total number of units for sale",
    "Data source(s)", "Was the project created by the conversion of existing building(s) into a PUD?",
    " If Yes, date of conversion", "Does the project contain any multi-dwelling units? Yes No Data",
    "Are the units, common elements, and recreation facilities complete?", "If No, describe the status of completion.",
    "Are the common elements leased to or by the Homeowners' Association?",
    "If Yes, describe the rental terms and options.", "Describe common elements and recreational facilities."
  ];
  pudInformationFieldsToValidate.forEach(field => {
    if (!validationRegistry[field]) validationRegistry[field] = [];
    validationRegistry[field].push(checkPudInformationFieldsNotBlank);
  });

  const marketConditionsFieldsToValidate = [
    "Instructions:", "Seller-(developer, builder, etc.)paid financial assistance prevalent?",
    "Explain in detail the seller concessions trends for the past 12 months (e.g., seller contributions increased from 3% to 5%, increasing use of buydowns, closing costs, condo fees, options, etc.).",
    "Are foreclosure sales (REO sales) a factor in the market?", "If yes, explain (including the trends in listings and sales of foreclosed properties).",
    "Cite data sources for above information.", "Summarize the above information as support for your conclusions in the Neighborhood section of the appraisal report form. If you used any additional information, such as an analysis of pending sales and/or expired and withdrawn listings, to formulate your conclusions, provide both an explanation and support for your conclusions."
  ];
  marketConditionsFieldsToValidate.forEach(field => {
    if (!validationRegistry[field]) validationRegistry[field] = [];
    validationRegistry[field].push(checkMarketConditionsFieldsNotBlank);
  });

  const projectInfoFieldsToValidate = [
    "Data source(s) for project information", "Project Description", "# of Stories",
    "# of Elevators", "Existing/Proposed/Under Construction", "Year Built",
    "Effective Age", "Exterior Walls",
    "Roof Surface", "Total # Parking", "Ratio (spaces/units)", "Type", "Guest Parking", "# of Units", "# of Units Completed",
    "# of Units For Sale", "# of Units Sold", "# of Units Rented", "# of Owner Occupied Units",
    "# of Phases", "# of Planned Phases",
    "Project Primary Occupancy", "Is the developer/builder in control of the Homeowners' Association (HOA)?",
    "Management Group", "Does any single entity (the same individual, investor group, corporation, etc.) own more than 10% of the total units in the project?"
    , "Was the project created by the conversion of existing building(s) into a condominium?",
    "If Yes,describe the original use and date of conversion",
    "Are the units, common elements, and recreation facilities complete (including any planned rehabilitation for a condominium conversion)?", "If No, describe",
    "Is there any commercial space in the project?",
    "If Yes, describe and indicate the overall percentage of the commercial space.", "Describe the condition of the project and quality of construction.",
    "Describe the common elements and recreational facilities.", "Are any common elements leased to or by the Homeowners' Association?",
    "If Yes, describe the rental terms and options.", "Is the project subject to a ground rent?",
    "If Yes, $ per year (describe terms and conditions)",
    "Are the parking facilities adequate for the project size and type?", "If No, describe and comment on the effect on value and marketability."
  ];
  projectInfoFieldsToValidate.forEach(field => {
    if (!validationRegistry[field]) validationRegistry[field] = [];
    validationRegistry[field].push(checkProjectInfoFieldsNotBlank);
  });

  const projectAnalysisFieldsToValidate = [
    "I did did not analyze the condominium project budget for the current year. Explain the results of the analysis of the budget (adequacy of fees, reserves, etc.), or why the analysis was not performed.",
    "Are there any other fees (other than regular HOA charges) for the use of the project facilities?",
    "If Yes, report the charges and describe.",
    "Compared to other competitive projects of similar quality and design, the subject unit charge appears",
    "If High or Low, describe",
    "Are there any special or unusual characteristics of the project (based on the condominium documents, HOA meetings, or other information) known to the appraiser?",
    "If Yes, describe and explain the effect on value and marketability."
  ];
  projectAnalysisFieldsToValidate.forEach(field => {
    if (!validationRegistry[field]) validationRegistry[field] = [];
    validationRegistry[field].push(checkProjectAnalysisFieldsNotBlank);
  });

  const unitDescriptionsFieldsToValidate = [
    "Unit Charge$",
    "per month X 12 = $",
    "per year",
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
    "Finished area above grade contains:",
    "Are the heating and cooling for the individual units separately metered?",
    "Additional features (special energy efficient items, etc.)",
    "Describe the condition of the property (including needed repairs, deterioration, renovations, remodeling, etc.)",
  ];

  unitDescriptionsFieldsToValidate.forEach(field => {
    if (!validationRegistry[field]) {
      validationRegistry[field] = [];
    }
    validationRegistry[field].push(checkUnitDescriptionsFieldsNotBlank);
  });

  const projectSiteFieldsToValidate = [
    "Topography", "Size", "Density", "View", "Specific Zoning Classification", "Zoning Description",
    "Zoning Compliance", "Is the highest and best use of subject property as improved (or as proposed per plans and specifications) the present use?",
    "Electricity", "Gas", "Water", "Sanitary Sewer", "Street", "Alley", "FEMA Special Flood Hazard Area",
    "FEMA Flood Zone", "FEMA Map #", "FEMA Map Date", "Are the utilities and off-site improvements typical for the market area? If No, describe",
    "Are there any adverse site conditions or external factors (easements, encroachments, environmental conditions, land uses, etc.)? If Yes, describe",
  ];
  projectSiteFieldsToValidate.forEach(field => {
    if (!validationRegistry[field]) {
      validationRegistry[field] = [];
    }
    validationRegistry[field].push(checkProjectSiteFieldsNotBlank);
  });

  const priorSaleHistoryFieldsToValidate = [
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
  priorSaleHistoryFieldsToValidate.forEach(field => {
    if (!validationRegistry[field]) validationRegistry[field] = [];
    validationRegistry[field].push(checkPriorSaleHistoryFieldsNotBlank);
  });

  const infoOfSalesFieldsToValidate = [
    "There are ____ comparable properties currently offered for sale in the subject neighborhood ranging in price from$ ___to $___",
    "There are ___comparable sales in the subject neighborhoodwithin the past twelvemonths ranging in sale price from$___ to $____"
  ];
  infoOfSalesFieldsToValidate.forEach(field => {
    if (!validationRegistry[field]) {
      validationRegistry[field] = [];
    }
    validationRegistry[field].push(checkInfoOfSalesFieldsNotBlank);
  });

  const condoForeclosureFieldsToValidate = [
    "Are foreclosure sales (REO sales) a factor in the project?",
    "If yes, indicate the number of REO listings and explain the trends in listings and sales of foreclosed properties.",
    "Summarize the above trends and address the impact on the subject unit and project."
  ];
  condoForeclosureFieldsToValidate.forEach(field => {
    if (!validationRegistry[field]) validationRegistry[field] = [];
    validationRegistry[field].push(checkCondoForeclosureFieldsNotBlank);
  });
  const getValidationInfo = (field, text, data, fieldPath, saleName, manualValidations) => {
    let validationResult = null;

    if (customValidation) {
      validationResult = customValidation(field, text, data);
    }

    if (!validationResult) {
      const validationFns = validationRegistry[field] || [];
      for (const fn of validationFns) {
        const result = fn(field, text, data, fieldPath, saleName);
        if (result) {
          validationResult = result;
          if (result.isError) break;
        }
      }
    }
    if (!validationResult && saleName) {
      const salesFns = validationRegistry[field] || [];
      const result = salesFns.map(fn => fn(field, data, saleName)).find(r => r);
      if (result) validationResult = result;
    }

    let style = {};
    let message = validationResult?.message || null;

    const isManuallyValidated = manualValidations && manualValidations[JSON.stringify(fieldPath)];

    if (isManuallyValidated) {
      style = { backgroundColor: '#87ceeb', color: '#000000', padding: '2px 5px', borderRadius: '4px' };
      message = "Manually validated.";
    } else if (validationResult?.isError) {
      style = { backgroundColor: '#ff0015ff', color: '#000000ff', padding: '2px 5px', borderRadius: '4px', border: '1px solid #721c24', display: 'flex', alignItems: 'center', justifyContent: 'space-between' };
    } else if (validationResult?.isMatch) {
      style = { backgroundColor: '#91ff00ff', color: '#000000', padding: '2px 5px', borderRadius: '4px' };
      message = validationResult.message || "Validation successful!";
    } else if (field === 'Zoning Compliance' && text?.trim() === 'Legal Nonconforming (Grandfathered Use)') {
      style = { backgroundColor: '#ff9d0bff', color: '#ffffff', padding: '2px 5px', borderRadius: '4px' };
    }

    return { style, message };
  };

  const validation = getValidationInfo(fieldPath.slice(-1)[0], value, allData, fieldPath, saleName, manualValidations); // Pass allData here
  const isManuallyValidated = manualValidations && manualValidations[JSON.stringify(fieldPath)];
  const fieldContent = (
    <div className={`editable-field-container ${isAdjustment ? 'adjustment-value' : ''}`} onClick={handleContainerClick} style={{ ...(isMissing ? { border: '2px solid #ff50315b' } : {}), ...validation.style, position: 'relative' }}>
      {isEditing ? (
        React.createElement(usePre ? 'textarea' : 'input', {
          type: "text",
          value: value,
          onChange: (e) => onDataChange(fieldPath, e.target.value),
          onBlur: () => setEditingField(null),
          onKeyDown: handleKeyDown,
          autoFocus: true,
          spellCheck: true,
          className: inputClassName || `form-control form-control-sm ${isAdjustment ? 'adjustment-value' : ''}`,
          style: inputStyle || { width: '100%', border: '1px solid #ccc', background: '#fff', padding: 0, height: 'auto', resize: usePre ? 'vertical' : 'none' },
          rows: usePre ? 3 : undefined
        })
      ) : (
        <>
          {(() => {
            if (typeof value === 'object' && value !== null && !React.isValidElement(value)) {
              return JSON.stringify(value);
            }

            const neighborhoodUsageFields = ["One-Unit", "2-4 Unit", "Multi-Family", "Commercial", "Other"];
            if (fieldPath[0] === 'NEIGHBORHOOD' && neighborhoodUsageFields.includes(fieldPath.slice(-1)[0])) {
              const numericValue = String(value || '').replace('%', '').trim();
              return `${numericValue}%`;
            }

            let displayValue = value;
            const finalField = fieldPath.slice(-1)[0];
            if (finalField === 'Report data source(s) used, offering price(s), and date(s)') {
              displayValue = <HighlightKeywords text={value} keywords={['DOM', 'MLS', ' listed for', 'for ', 'Listed on', 'from', 'until', 'RMLS', 'sale on']} />;
            } else if (finalField === 'Neighborhood Boundaries') {
              displayValue = <HighlightKeywords text={value} keywords={['North', 'East', 'West', 'South']} />;
            }

            if (usePre) {
              return <pre className={`editable-field-pre ${isAdjustment ? 'adjustment-value' : ''}`}>{displayValue}</pre>;
            } else {
              return <span className={`editable-field-span ${isAdjustment ? 'adjustment-value' : ''}`}>{displayValue}</span>;
            }
          })()}
        </>
      )}
      {validation.style.backgroundColor === '#ff0015ff' && !isManuallyValidated && handleManualValidation && (
        <IconButton onClick={(e) => { e.stopPropagation(); handleManualValidation(fieldPath); }} size="small" sx={{ padding: '2px', marginLeft: '5px' }}>
          <ThumbUpIcon fontSize="small" />
        </IconButton>

      )}
      {fieldPath.includes('Offered for Sale in Last 12 Months') && (String(value).toLowerCase() === 'no' || String(value).toLowerCase() === 'yes' || String(value).toLowerCase() === '') && revisionHandlers.onAddRevision && (
        <Tooltip title="Add revision for 'Offered for Sale'">
          <IconButton onClick={(e) => { e.stopPropagation(); revisionHandlers.onAddRevision(); }} size="small" sx={{ padding: '2px', marginLeft: '5px' }}>
            <PlaylistAddIcon fontSize="small" />
          </IconButton>
        </Tooltip>
      )}
      {fieldPath.includes('Borrower') && !value && revisionHandlers.onAddEmptyBorrowerRevision && (
        <Tooltip title="Please add the borrower's to the report.">
          <IconButton onClick={(e) => { e.stopPropagation(); revisionHandlers.onAddEmptyBorrowerRevision(); }} size="small" sx={{ padding: '2px', marginLeft: '5px' }}>
            <PlaylistAddIcon fontSize="small" />
          </IconButton>
        </Tooltip>
      )}
      {fieldPath.includes('Borrower') && value && revisionHandlers.onAddBorrowerRevision && (

        <Tooltip title="Add revision for Borrower's middle initial">
          <IconButton onClick={(e) => { e.stopPropagation(); revisionHandlers.onAddBorrowerRevision(); }} size="small" sx={{ padding: '2px', marginLeft: '5px' }}>
            <PlaylistAddIcon fontSize="small" />
          </IconButton>
        </Tooltip>
      )}
      {fieldPath.includes('Legal Description') && String(value).toLowerCase().includes('see attached addendum') && revisionHandlers.onAddLegalDescRevision && (
        <Tooltip title="Legal Description">
          <IconButton onClick={(e) => { e.stopPropagation(); revisionHandlers.onAddLegalDescRevision(); }} size="small" sx={{ padding: '2px', marginLeft: '5px' }}>
            <PlaylistAddIcon fontSize="small" />
          </IconButton>
        </Tooltip>
      )}
      {fieldPath.includes('Property Address') && revisionHandlers.onPropertyAddressRevisionButtonClick && (
        <Tooltip title="Address Revisions">
          <IconButton onClick={(e) => { e.stopPropagation(); revisionHandlers.onPropertyAddressRevisionButtonClick(); }} size="small" sx={{ padding: '2px', marginLeft: '5px' }}>

            <PlaylistAddIcon fontSize="small" />
          </IconButton>
        </Tooltip>
      )}

      {fieldPath.includes('Lender/Client') && revisionHandlers.onLenderClientRevisionButtonClick && (
        <Tooltip title="Lender/Client Revisions">
          <IconButton onClick={(e) => { e.stopPropagation(); revisionHandlers.onLenderClientRevisionButtonClick(); }} size="small" sx={{ padding: '2px', marginLeft: '5px' }}>
            <PlaylistAddIcon fontSize="small" />
          </IconButton>
        </Tooltip>
      )}
      {fieldPath.includes('Assignment Type') && revisionHandlers.onAddAssignmentTypeRevision && (
        <Tooltip title="Revise assignment type to refinance transaction.">
          <IconButton onClick={(e) => { e.stopPropagation(); revisionHandlers.onAddAssignmentTypeRevision(); }} size="small" sx={{ padding: '2px', marginLeft: '5px' }}>
            <PlaylistAddIcon fontSize="small" />
          </IconButton>
        </Tooltip>
      )}
      {fieldPath.includes('Property Rights Appraised') && revisionHandlers.onAddPropertyRightsRevision && (
        <Tooltip title="Revise Property Rights Appraised to fee simple.">
          <IconButton onClick={(e) => { e.stopPropagation(); revisionHandlers.onAddPropertyRightsRevision(); }} size="small" sx={{ padding: '2px', marginLeft: '5px' }}>
            <PlaylistAddIcon fontSize="small" />
          </IconButton>
        </Tooltip>
      )}
      {fieldPath.includes('HOA $') && revisionHandlers.onHoaRevisionButtonClick && (
        <Tooltip title="HOA Revisions">
          <IconButton onClick={(e) => { e.stopPropagation(); revisionHandlers.onHoaRevisionButtonClick(); }} size="small" sx={{ padding: '2px', marginLeft: '5px' }}>
            <PlaylistAddIcon fontSize="small" />
          </IconButton>
        </Tooltip>
      )}
      {
        fieldPath.includes('Units') && revisionHandlers.ONUnitsRevisionButtonClick && (
          <Tooltip title="Units Revisions">
            <IconButton onClick={(e) => { e.stopPropagation(); revisionHandlers.ONUnitsRevisionButtonClick(); }} size="small" sx={{ padding: '2px', marginLeft: '5px' }}>
              <PlaylistAddIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        )
      }
      {
        fieldPath.includes('Zip Code') && revisionHandlers.ONZipCodeRevisionButtonClick && (
          <Tooltip title="Zip Code Revisions">
            <IconButton onClick={(e) => { e.stopPropagation(); revisionHandlers.ONZipCodeRevisionButtonClick(); }} size="small" sx={{ padding: '2px', marginLeft: '5px' }}>
              <PlaylistAddIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        )
      }
      {
        fieldPath.includes('Report data source(s) used, offering price(s), and date(s)') && revisionHandlers.ONReportdataRevisionButtonClick && (
          <Tooltip title="Report data source(s) used, offering price(s), and date(s) Revisions">
            <IconButton onClick={(e) => { e.stopPropagation(); revisionHandlers.ONReportdataRevisionButtonClick(); }} size="small" sx={{ padding: '2px', marginLeft: '5px' }}>
              <PlaylistAddIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        )
      }{
        fieldPath.includes('Map Reference') && revisionHandlers.ONMapReferencerevisionButtonClick && (
          <Tooltip title="Map Reference Revisions">
            <IconButton onClick={(e) => { e.stopPropagation(); revisionHandlers.ONMapReferencerevisionButtonClick(); }} size="small" sx={{ padding: '2px', marginLeft: '5px' }}>
              <PlaylistAddIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        )
      }
      {
        fieldPath.includes('There are ____ comparable properties currently offered for sale in the subject neighborhood ranging in price from$ ___to $___') && revisionHandlers.ONComparablePropertiesRevisionButtonClick && (
          <Tooltip title="Comparable Properties Revisions">
            <IconButton onClick={(e) => { e.stopPropagation(); revisionHandlers.ONComparablePropertiesRevisionButtonClick(); }} size="small" sx={{ padding: '2px', marginLeft: '5px' }}>
              <PlaylistAddIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        )
      }
      {
        fieldPath.includes('There are ___comparable sales in the subject neighborhoodwithin the past twelvemonths ranging in sale price from$___ to $____') && revisionHandlers.ONcomparablepropertyrevisionButtonClick && (
          <Tooltip title="Comparable Sales Revisions">
            <IconButton onClick={(e) => { e.stopPropagation(); revisionHandlers.ONcomparablepropertyrevisionButtonClick(); }} size="small" sx={{ padding: '2px', marginLeft: '5px' }}>
              <PlaylistAddIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        )
      }
      {
        fieldPath.includes('Occupant') && revisionHandlers.ONOccupantRevisionButtonClick && (
          <Tooltip title="Occupant Revisions">
            <IconButton onClick={(e) => { e.stopPropagation(); revisionHandlers.ONOccupantRevisionButtonClick(); }} size="small" sx={{ padding: '2px', marginLeft: '5px' }}>
              <PlaylistAddIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        )
      }
      {
        fieldPath.includes('PUD') && revisionHandlers.ONPUDRevisionButtonClick && (
          <Tooltip title="PUD Revisions">
            <IconButton onClick={(e) => { e.stopPropagation(); revisionHandlers.ONPUDRevisionButtonClick(); }} size="small" sx={{ padding: '2px', marginLeft: '5px' }}>
              <PlaylistAddIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        )
      }

      {
        fieldPath.includes('City') && revisionHandlers.ONCityRevisionButtonClick && (
          <Tooltip title="City Revisions">
            <IconButton onClick={(e) => { e.stopPropagation(); revisionHandlers.ONCityRevisionButtonClick(); }} size="small" sx={{ padding: '2px', marginLeft: '5px' }}>
              <PlaylistAddIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        )
      }
      {fieldPath.includes('Owner of Public Record') && revisionHandlers.onAddOwnerOfRecordRevision && (
        <Tooltip title="Add revision for Owner of Public Record">
          <IconButton onClick={(e) => { e.stopPropagation(); revisionHandlers.onAddOwnerOfRecordRevision(); }} size="small" sx={{ padding: '2px', marginLeft: '5px' }}>
            <PlaylistAddIcon fontSize="small" />
          </IconButton>
        </Tooltip>
      )}
      {fieldPath.includes('Address (Lender/Client)') && revisionHandlers.onLenderClientAddressRevisionButtonClick && (
        <Tooltip title="Lender/Client Address Revisions">
          <IconButton onClick={(e) => { e.stopPropagation(); revisionHandlers.onLenderClientAddressRevisionButtonClick(); }} size="small" sx={{ padding: '2px', marginLeft: '5px' }}>
            <PlaylistAddIcon fontSize="small" />
          </IconButton>
        </Tooltip>
      )}
      {fieldPath.includes('Contract Price $') && revisionHandlers.onContractPriceRevisionButtonClick && (
        <Tooltip title="Contract Price Revisions">
          <IconButton onClick={(e) => { e.stopPropagation(); revisionHandlers.onContractPriceRevisionButtonClick(); }} size="small" sx={{ padding: '2px', marginLeft: '5px' }}>
            <PlaylistAddIcon fontSize="small" />
          </IconButton>
        </Tooltip>
      )}
      {fieldPath.includes('Date of Contract') && revisionHandlers.onDateOfContractRevisionButtonClick && (
        <Tooltip title="Date of Contract Revisions">
          <IconButton onClick={(e) => { e.stopPropagation(); revisionHandlers.onDateOfContractRevisionButtonClick(); }} size="small" sx={{ padding: '2px', marginLeft: '5px' }}>
            <PlaylistAddIcon fontSize="small" />
          </IconButton>
        </Tooltip>
      )}
      {fieldPath.includes('Is there any financial assistance (loan charges, sale concessions, gift or downpayment assistance, etc.) to be paid by any party on behalf of the borrower?') && revisionHandlers.onFinancialAssistanceRevisionButtonClick && (
        <Tooltip title="Financial Assistance Revisions">
          <IconButton onClick={(e) => { e.stopPropagation(); revisionHandlers.onFinancialAssistanceRevisionButtonClick(); }} size="small" sx={{ padding: '2px', marginLeft: '5px' }}>
            <PlaylistAddIcon fontSize="small" />
          </IconButton>
        </Tooltip>
      )}
      {fieldPath.includes('Neighborhood Boundaries') && revisionHandlers.onNeighborhoodBoundariesRevisionButtonClick && (
        <Tooltip title="Neighborhood Boundaries Revisions">
          <IconButton onClick={(e) => { e.stopPropagation(); revisionHandlers.onNeighborhoodBoundariesRevisionButtonClick(); }} size="small" sx={{ padding: '2px', marginLeft: '5px' }}>
            <PlaylistAddIcon fontSize="small" />
          </IconButton>
        </Tooltip>
      )}
      {fieldPath.includes('Other') && revisionHandlers.onOtherLandUseRevisionButtonClick && (
        <Tooltip title="Other Land Use Revisions">
          <IconButton onClick={(e) => { e.stopPropagation(); revisionHandlers.onOtherLandUseRevisionButtonClick(); }} size="small" sx={{ padding: '2px', marginLeft: '5px' }}>
            <PlaylistAddIcon fontSize="small" />
          </IconButton>
        </Tooltip>
      )}
      {fieldPath.includes('Zoning Compliance') && revisionHandlers.onZoningComplianceRevisionButtonClick && (
        <Tooltip title="Zoning Compliance Revisions">
          <IconButton onClick={(e) => { e.stopPropagation(); revisionHandlers.onZoningComplianceRevisionButtonClick(); }} size="small" sx={{ padding: '2px', marginLeft: '5px' }}>
            <PlaylistAddIcon fontSize="small" />
          </IconButton>
        </Tooltip>
      )}
      {fieldPath.includes('Area') && revisionHandlers.onAreaRevisionButtonClick && (
        <Tooltip title="Area Revisions">
          <IconButton onClick={(e) => { e.stopPropagation(); revisionHandlers.onAreaRevisionButtonClick(); }} size="small" sx={{ padding: '2px', marginLeft: '5px' }}>
            <PlaylistAddIcon fontSize="small" />
          </IconButton>
        </Tooltip>
      )}
      {
        fieldPath.includes('Size') && revisionHandlers.onSizeRevisionButtonClick && (
          <Tooltip title="Size Revisions">
            <IconButton onClick={(e) => { e.stopPropagation(); revisionHandlers.onSizeRevisionButtonClick(); }} size="small" sx={{ padding: '2px', marginLeft: '5px' }}>
              <PlaylistAddIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        )
      }
      {fieldPath.includes('Density') && revisionHandlers.onDensityRevisionButtonClick && (
        <Tooltip title="Density Revisions">
          <IconButton onClick={(e) => { e.stopPropagation(); revisionHandlers.onDensityRevisionButtonClick(); }} size="small" sx={{ padding: '2px', marginLeft: '5px' }}>
            <PlaylistAddIcon fontSize="small" />
          </IconButton>
        </Tooltip>
      )}
      {fieldPath.includes('Street') && revisionHandlers.ONStreetRevisionButtonClick && (
        <Tooltip title="Street Revisions">
          <IconButton onClick={(e) => { e.stopPropagation(); revisionHandlers.ONStreetRevisionButtonClick(); }} size="small" sx={{ padding: '2px', marginLeft: '5px' }}>
            <PlaylistAddIcon fontSize="small" />
          </IconButton>
        </Tooltip>
      )}
      {
        fieldPath.includes('FEMA Map #') && revisionHandlers.ONFEMAMaprevisionButtonClick && (
          <Tooltip title="FEMA Map # Revisions">
            <IconButton onClick={(e) => { e.stopPropagation(); revisionHandlers.ONFEMAMaprevisionButtonClick(); }} size="small" sx={{ padding: '2px', marginLeft: '5px' }}>
              <PlaylistAddIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        )
      }
      {
        fieldPath.includes('Special Assessments $') && revisionHandlers.ONSpecialAssessmentsRevisionButtonClick && (
          <Tooltip title="Special Assessments $ Revisions">
            <IconButton onClick={(e) => { e.stopPropagation(); revisionHandlers.ONSpecialAssessmentsRevisionButtonClick(); }} size="small" sx={{ padding: '2px', marginLeft: '5px' }}>
              <PlaylistAddIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        )
      }
      {
        fieldPath.includes('Water') && revisionHandlers.onWaterRevisionButtonClick && (
          <Tooltip title="Water Revisions">
            <IconButton onClick={(e) => { e.stopPropagation(); revisionHandlers.onWaterRevisionButtonClick(); }} size="small" sx={{ padding: '2px', marginLeft: '5px' }}>
              <PlaylistAddIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        )
      }
      {fieldPath.includes('Are there any adverse site conditions or external factors (easements, encroachments, environmental conditions, land uses, etc.)? If Yes, describe') && revisionHandlers.onAdverseSiteConditionsRevisionButtonClick && (
        <Tooltip title="Adverse Site Conditions Revisions">
          <IconButton onClick={(e) => { e.stopPropagation(); revisionHandlers.onAdverseSiteConditionsRevisionButtonClick(); }} size="small" sx={{ padding: '2px', marginLeft: '5px' }}>
            <PlaylistAddIcon fontSize="small" />
          </IconButton>
        </Tooltip>
      )}
      {fieldPath.includes('Sanitary Sewer') && revisionHandlers.onSanitarySewerButtonClick && (
        <Tooltip title="Sanitary Sewer Revisions">
          <IconButton onClick={(e) => { e.stopPropagation(); revisionHandlers.onSanitarySewerButtonClick(); }} size="small" sx={{ padding: '2px', marginLeft: '5px' }}>
            <PlaylistAddIcon fontSize="small" />
          </IconButton>
        </Tooltip>
      )}
      {fieldPath.includes('State') && revisionHandlers.onStateRevisionButtonClick && (
        <Tooltip title="State">
          <IconButton onClick={(e) => { e.stopPropagation(); revisionHandlers.onStateRevisionButtonClick(); }} size="small" sx={{ padding: '2px', marginLeft: '5px' }}>
            <PlaylistAddIcon fontSize="small" />
          </IconButton>
        </Tooltip>
      )}
      {fieldPath.includes('R.E. Taxes $') && revisionHandlers.onRETaxesRevisionButtonClick && (
        <Tooltip title="R.E. Taxes $">
          <IconButton onClick={(e) => { e.stopPropagation(); revisionHandlers.onRETaxesRevisionButtonClick(); }} size="small" sx={{ padding: '2px', marginLeft: '5px' }}>
            <PlaylistAddIcon fontSize="small" />
          </IconButton>
        </Tooltip>
      )}
      {
        fieldPath.includes('County') && revisionHandlers.ONCountyRevisionButtonClick && (
          <Tooltip title="County">
            <IconButton onClick={(e) => { e.stopPropagation(); revisionHandlers.ONCountyRevisionButtonClick(); }} size="small" sx={{ padding: '2px', marginLeft: '5px' }}>
              <PlaylistAddIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        )
      }
      {
        fieldPath.includes('Tax Year') && revisionHandlers.ONTaxYearRevisionButtonClick && (
          <Tooltip title="Tax Year">
            <IconButton onClick={(e) => { e.stopPropagation(); revisionHandlers.ONTaxYearRevisionButtonClick(); }} size="small" sx={{ padding: '2px', marginLeft: '5px' }}>
              <PlaylistAddIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        )
      }

      {
        fieldPath.includes('Design (Style)') && revisionHandlers.onDesignStyleRevisionButtonClick && (
          <Tooltip title="Design (Style)">
            <IconButton onClick={(e) => { e.stopPropagation(); revisionHandlers.onDesignStyleRevisionButtonClick(); }} size="small" sx={{ padding: '2px', marginLeft: '5px' }}>
              <PlaylistAddIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        )
      }
      {
        fieldPath.includes('Roof Surface (Material/Condition)') && revisionHandlers.onRoofRevisionButtonClick && (
          <Tooltip title="Roof Surface (Material/Condition)">
            <IconButton onClick={(e) => { e.stopPropagation(); revisionHandlers.onRoofRevisionButtonClick(); }} size="small" sx={{ padding: '2px', marginLeft: '5px' }}>
              <PlaylistAddIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        )
      }
      {
        fieldPath.includes('Heating Type') && revisionHandlers.onHeatingSystemRevisionButtonClick && (
          <Tooltip title="Heating Type">
            <IconButton onClick={(e) => { e.stopPropagation(); revisionHandlers.onHeatingSystemRevisionButtonClick(); }} size="small" sx={{ padding: '2px', marginLeft: '5px' }}>
              <PlaylistAddIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        )
      }
      {
        fieldPath.includes('Window Type (Material/Condition)') && revisionHandlers.onwindowRevisionButtonClick && (
          <Tooltip title="Window Type (Material/Condition)">
            <IconButton onClick={(e) => { e.stopPropagation(); revisionHandlers.onwindowRevisionButtonClick(); }} size="small" sx={{ padding: '2px', marginLeft: '5px' }}>
              <PlaylistAddIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        )
      }
      {
        fieldPath.includes('Fuel') && revisionHandlers.onFuelRevisionButtonClick && (
          <Tooltip title="Fuel">
            <IconButton onClick={(e) => { e.stopPropagation(); revisionHandlers.onFuelRevisionButtonClick(); }} size="small" sx={{ padding: '2px', marginLeft: '5px' }}>
              <PlaylistAddIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        )
      }
      {
        fieldPath.includes('Exterior Walls (Material/Condition)') && revisionHandlers.onExteriorWallsRevisionButtonClick && (
          <Tooltip title="Exterior Walls (Material/Condition)">
            <IconButton onClick={(e) => { e.stopPropagation(); revisionHandlers.onExteriorWallsRevisionButtonClick(); }} size="small" sx={{ padding: '2px', marginLeft: '5px' }}>
              <PlaylistAddIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        )
      }
      {
        fieldPath.includes('Storm Sash/Insulated') && revisionHandlers.onStormSashInsulatedRevisionButtonClick && (
          <Tooltip title="Storm Sash/Insulated">
            <IconButton onClick={(e) => { e.stopPropagation(); revisionHandlers.onStormSashInsulatedRevisionButtonClick(); }} size="small" sx={{ padding: '2px', marginLeft: '5px' }}>
              <PlaylistAddIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        )
      }{
        fieldPath.includes('Floors (Material/Condition)') && revisionHandlers.onFloorsRevisionButtonClick && (
          <Tooltip title="Floors (Material/Condition)">
            <IconButton onClick={(e) => { e.stopPropagation(); revisionHandlers.onFloorsRevisionButtonClick(); }} size="small" sx={{ padding: '2px', marginLeft: '5px' }}>
              <PlaylistAddIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        )
      }
      {
        fieldPath.includes('Window Type (Material/Condition)') && revisionHandlers.onWindowTypeRevisionButtonClick && (
          <Tooltip title="Window Type (Material/Condition)">
            <IconButton onClick={(e) => { e.stopPropagation(); revisionHandlers.onWindowTypeRevisionButtonClick(); }} size="small" sx={{ padding: '2px', marginLeft: '5px' }}>
              <PlaylistAddIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        )
      }
      {
        fieldPath.includes('Walls (Material/Condition)') && revisionHandlers.onWallsRevisionButtonClick && (
          <Tooltip title="Walls (Material/Condition)">
            <IconButton onClick={(e) => { e.stopPropagation(); revisionHandlers.onWallsRevisionButtonClick(); }} size="small" sx={{ padding: '2px', marginLeft: '5px' }}>
              <PlaylistAddIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        )
      }
      {
        fieldPath.includes('Bath Floor (Material/Condition)') && revisionHandlers.onbathfloorRevisionButtonClick && (
          <Tooltip title="Bath Floor (Material/Condition)">
            <IconButton onClick={(e) => { e.stopPropagation(); revisionHandlers.onbathfloorRevisionButtonClick(); }} size="small" sx={{ padding: '2px', marginLeft: '5px' }}>

              <PlaylistAddIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        )
      }
      {
        fieldPath.includes('Bath Wainscot (Material/Condition)') && revisionHandlers.onbsthwainscotRevisionButtonClick && (
          <Tooltip title="Bath Wainscot (Material/Condition)">
            <IconButton onClick={(e) => { e.stopPropagation(); revisionHandlers.onbsthwainscotRevisionButtonClick(); }} size="small" sx={{ padding: '2px', marginLeft: '5px' }}>
              <PlaylistAddIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        )
      }
      {
        fieldPath.includes('Cooling Type') && revisionHandlers.onCoolingTypeRevisionButtonClick && (
          <Tooltip title="Cooling Type">
            <IconButton onClick={(e) => { e.stopPropagation(); revisionHandlers.onCoolingTypeRevisionButtonClick(); }} size="small" sx={{ padding: '2px', marginLeft: '5px' }}>
              <PlaylistAddIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        )
      }
      {
        fieldPath.includes('Fireplace(s) #') && revisionHandlers.onFireplaceRevisionButtonClick && (
          <Tooltip title="Fireplace(s) #">
            <IconButton onClick={(e) => { e.stopPropagation(); revisionHandlers.onFireplaceRevisionButtonClick(); }} size="small" sx={{ padding: '2px', marginLeft: '5px' }}>
              <PlaylistAddIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        )
      }
      {
        fieldPath.includes('Patio/Deck') && revisionHandlers.onPatioDeckrevisionButtonClick && (
          <Tooltip title="Patio/Deck">
            <IconButton onClick={(e) => { e.stopPropagation(); revisionHandlers.onPatioDeckrevisionButtonClick(); }} size="small" sx={{ padding: '2px', marginLeft: '5px' }}>
              <PlaylistAddIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        )
      }
      {
        fieldPath.includes('Car Storage') && revisionHandlers.onCarStorageRevisionButtonClick && (
          <Tooltip title="Car Storage">
            <IconButton onClick={(e) => { e.stopPropagation(); revisionHandlers.onCarStorageRevisionButtonClick(); }} size="small" sx={{ padding: '2px', marginLeft: '5px' }}>
              <PlaylistAddIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        )
      }
      {
        fieldPath.includes('Carport # of Cars') && revisionHandlers.onCarportRevisionButtonClick && (
          <Tooltip title="Carport # of Cars">
            <IconButton onClick={(e) => { e.stopPropagation(); revisionHandlers.onCarportRevisionButtonClick(); }} size="small" sx={{ padding: '2px', marginLeft: '5px' }}>
              <PlaylistAddIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        )
      }
      {
        fieldPath.includes('Driveway Surface') && revisionHandlers.onDrivewaySurfaceRevisionButtonClick && (
          <Tooltip title="Driveway Surface">
            <IconButton onClick={(e) => { e.stopPropagation(); revisionHandlers.onDrivewaySurfaceRevisionButtonClick(); }} size="small" sx={{ padding: '2px', marginLeft: '5px' }}>
              <PlaylistAddIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        )
      }
      {
        fieldPath.includes('Attic') && revisionHandlers.onAtticRevisionButtonClick && (
          <Tooltip title="Attic">
            <IconButton onClick={(e) => { e.stopPropagation(); revisionHandlers.onAtticRevisionButtonClick(); }} size="small" sx={{ padding: '2px', marginLeft: '5px' }}>
              <PlaylistAddIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        )
      }
      {
        fieldPath.includes('Fence') && revisionHandlers.ONFenceRevisionButtonClick && (
          <Tooltip title="Fence">
            <IconButton onClick={(e) => { e.stopPropagation(); revisionHandlers.ONFenceRevisionButtonClick(); }} size="small" sx={{ padding: '2px', marginLeft: '5px' }}>
              <PlaylistAddIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        )
      }
      {
        fieldPath.includes('Data Source(s)') && revisionHandlers.oncontractDataSourceRevisionButtonClick && (
          <Tooltip title="Data Source(s)">
            <IconButton onClick={(e) => { e.stopPropagation(); revisionHandlers.oncontractDataSourceRevisionButtonClick(); }} size="small" sx={{ padding: '2px', marginLeft: '5px' }}>
              <PlaylistAddIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        )

      }
      {
        fieldPath.includes('Location') && revisionHandlers.onLocationRevisionButtonClick && (
          <Tooltip title="Location">
            <IconButton onClick={(e) => { e.stopPropagation(); revisionHandlers.onLocationRevisionButtonClick(); }} size="small" sx={{ padding: '2px', marginLeft: '5px' }}>
              <PlaylistAddIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        )
      }
      {
        fieldPath.includes('Growth') && revisionHandlers.ONGrowthRevisionButtonClick && (
          <Tooltip title="Growth">
            <IconButton onClick={(e) => { e.stopPropagation(); revisionHandlers.ONGrowthRevisionButtonClick(); }} size="small" sx={{ padding: '2px', marginLeft: '5px' }}>
              <PlaylistAddIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        )
      }
      {
        fieldPath.includes('Demand/Supply') && revisionHandlers.ONDemandSupplyRevisionButtonClick && (
          <Tooltip title="Demand/Supply">
            <IconButton onClick={(e) => { e.stopPropagation(); revisionHandlers.ONDemandSupplyRevisionButtonClick(); }} size="small" sx={{ padding: '2px', marginLeft: '5px' }}>
              <PlaylistAddIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        )
      }
      {
        fieldPath.includes('One-Unit') && revisionHandlers.ONOneUnitrevisionButtonClick && (
          <Tooltip title="One-Unit">
            <IconButton onClick={(e) => { e.stopPropagation(); revisionHandlers.ONOneUnitrevisionButtonClick(); }} size="small" sx={{ padding: '2px', marginLeft: '5px' }}>
              <PlaylistAddIcon fontSize="small" />

            </IconButton>
          </Tooltip>
        )
      }
      {
        fieldPath.includes('2-4 Unit') && revisionHandlers.ONTwoUnitrevisionButtonClick && (
          <Tooltip title="2-4 Unit">
            <IconButton onClick={(e) => { e.stopPropagation(); revisionHandlers.ONTwoUnitrevisionButtonClick(); }} size="small" sx={{ padding: '2px', marginLeft: '5px' }}>
              <PlaylistAddIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        )
      }
      {
        fieldPath.includes('Commercial') && revisionHandlers.ONCommercialrevisionButtonClick && (
          <Tooltip title="Commercial">
            <IconButton onClick={(e) => { e.stopPropagation(); revisionHandlers.ONCommercialrevisionButtonClick(); }} size="small" sx={{ padding: '2px', marginLeft: '5px' }}>
              <PlaylistAddIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        )
      }
      {
        fieldPath.includes('one unit housing price(high,low,pred)') && revisionHandlers.ONONEUNITHOUSINGrevisionButtonClick && (
          <Tooltip title="one unit housing price(high,low,pred)">
            <IconButton onClick={(e) => { e.stopPropagation(); revisionHandlers.ONONEUNITHOUSINGrevisionButtonClick(); }} size="small" sx={{ padding: '2px', marginLeft: '5px' }}>
              <PlaylistAddIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        )
      }
      {
        fieldPath.includes('Neighborhood Description') && revisionHandlers.ONNeighborhoodDescriptionrevisionButtonClick && (
          <Tooltip title="Neighborhood Description">
            <IconButton onClick={(e) => { e.stopPropagation(); revisionHandlers.ONNeighborhoodDescriptionrevisionButtonClick(); }} size="small" sx={{ padding: '2px', marginLeft: '5px' }}>
              <PlaylistAddIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        )
      }
      {

      }
      {
        fieldPath.includes('Market Conditions:') && revisionHandlers.ONMarketConditionsrevisionButtonClick && (
          <Tooltip title="Market Conditions:">
            <IconButton onClick={(e) => { e.stopPropagation(); revisionHandlers.ONMarketConditionsrevisionButtonClick(); }} size="small" sx={{ padding: '2px', marginLeft: '5px' }}>
              <PlaylistAddIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        )
      }
      {
        fieldPath.includes('one unit housing age(high,low,pred)') && revisionHandlers.ONTWOUNITAGErevisionButtonClick && (
          <Tooltip title="one unit housing age(high,low,pred)">
            <IconButton onClick={(e) => { e.stopPropagation(); revisionHandlers.ONTWOUNITAGErevisionButtonClick(); }} size="small" sx={{ padding: '2px', marginLeft: '5px' }}>
              <PlaylistAddIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        )
      }
      {
        fieldPath.includes('Multi-Family') && revisionHandlers.ONMultiFamilyrevisionButtonClick && (
          <Tooltip title="Multi-Family">
            <IconButton onClick={(e) => { e.stopPropagation(); revisionHandlers.ONMultiFamilyrevisionButtonClick(); }} size="small" sx={{ padding: '2px', marginLeft: '5px' }}>
              <PlaylistAddIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        )
      }
      {
        fieldPath.includes('Marketing Time') && revisionHandlers.onMarketingTimeRevisionButtonClick && (
          <Tooltip title="Marketing Time">
            <IconButton onClick={(e) => { e.stopPropagation(); revisionHandlers.onMarketingTimeRevisionButtonClick(); }} size="small" sx={{ padding: '2px', marginLeft: '5px' }}>
              <PlaylistAddIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        )
      }
      {
        fieldPath.includes('Property Values') && revisionHandlers.onPropertyValuesRevisionButtonClick && (
          <Tooltip title="Property Values">
            <IconButton onClick={(e) => { e.stopPropagation(); revisionHandlers.onPropertyValuesRevisionButtonClick(); }} size="small" sx={{ padding: '2px', marginLeft: '5px' }}>
              <PlaylistAddIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        )
      }
      {
        fieldPath.includes('Built-Up') && revisionHandlers.onBuiltUpRevisionButtonClick && (
          <Tooltip title="Built-Up">
            <IconButton onClick={(e) => { e.stopPropagation(); revisionHandlers.onBuiltUpRevisionButtonClick(); }} size="small" sx={{ padding: '2px', marginLeft: '5px' }}>
              <PlaylistAddIcon fontSize="small" />

            </IconButton>
          </Tooltip>
        )
      }
      {
        fieldPath.includes('If Yes, report the total dollar amount and describe the items to be paid') && revisionHandlers.ontotaldollaramountRevisionButtonClick && (
          <Tooltip title="If Yes, report the total dollar amount and describe the items to be paid">
            <IconButton onClick={(e) => { e.stopPropagation(); revisionHandlers.ontotaldollaramountRevisionButtonClick(); }} size="small" sx={{ padding: '2px', marginLeft: '5px' }}>
              <PlaylistAddIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        )
      }
      {
        fieldPath.includes('I did did not analyze the contract for sale for the subject purchase transaction. Explain the results of the analysis of the contract for sale or why the analysis was not performed.') && revisionHandlers.oncontractdiddidnotRevisionButtonClick && (
          <Tooltip title="Contract Analysis">
            <IconButton onClick={(e) => { e.stopPropagation(); revisionHandlers.oncontractdiddidnotRevisionButtonClick(); }} size="small" sx={{ padding: '2px', marginLeft: '5px' }}>
              <PlaylistAddIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        )

      }
      {
        fieldPath.includes('Garage Att./Det./Built-in') && revisionHandlers.onGarageRevisionButtonClick && (
          <Tooltip title="Garage Att./Det./Built-in">
            <IconButton onClick={(e) => { e.stopPropagation(); revisionHandlers.onGarageRevisionButtonClick(); }} size="small" sx={{ padding: '2px', marginLeft: '5px' }}>
              <PlaylistAddIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        )
      }
      {
        fieldPath.includes('Appliances') && revisionHandlers.ONAppliancesRevisionButtonClick && (
          <Tooltip title="Appliances ">
            <IconButton onClick={(e) => { e.stopPropagation(); revisionHandlers.ONAppliancesRevisionButtonClick(); }} size="small" sx={{ padding: '2px', marginLeft: '5px' }}>
              <PlaylistAddIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        )
      }
      {
        fieldPath.includes('Finished area above grade Rooms') && revisionHandlers.onFinishedareaRevisionButtonClick && (
          <Tooltip title="Finished area above grade Rooms">
            <IconButton onClick={(e) => { e.stopPropagation(); revisionHandlers.onFinishedareaRevisionButtonClick(); }} size="small" sx={{ padding: '2px', marginLeft: '5px' }}>
              <PlaylistAddIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        )
      }{
        fieldPath.includes('Square Feet of Gross Living Area Above Grade') && revisionHandlers.onFinishedAreaAboveGradeBathroomsRevisionButtonClick && (
          <Tooltip title="Square Feet of Gross Living Area Above Grade">
            <IconButton onClick={(e) => { e.stopPropagation(); revisionHandlers.onFinishedAreaAboveGradeBathroomsRevisionButtonClick(); }} size="small" sx={{ padding: '2px', marginLeft: '5px' }}>
              <PlaylistAddIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        )
      }
      {
        fieldPath.includes('Additional features') && revisionHandlers.onAdditionalfeaturesRevisionButtonClick && (
          <Tooltip title="Additional features">
            <IconButton onClick={(e) => { e.stopPropagation(); revisionHandlers.onAdditionalfeaturesRevisionButtonClick(); }} size="small" sx={{ padding: '2px', marginLeft: '5px' }}>
              <PlaylistAddIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        )
      }{
        fieldPath.includes('Describe the condition of the property') && revisionHandlers.onconditionRevisionButtonClick && (
          <Tooltip title="Describe the condition of the property">
            <IconButton onClick={(e) => { e.stopPropagation(); revisionHandlers.onconditionRevisionButtonClick(); }} size="small" sx={{ padding: '2px', marginLeft: '5px' }}>
              <PlaylistAddIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        )
      }
      {
        fieldPath.includes('Are there any physical deficiencies or adverse conditions that affect the livability, soundness, or structural integrity of the property? If Yes, describe') && revisionHandlers.onphysicaldeficienciesRevisionButtonClick && (
          <Tooltip title="Are there any physical deficiencies or adverse conditions that affect the livability, soundness, or structural integrity of the property? If Yes, describe">
            <IconButton onClick={(e) => { e.stopPropagation(); revisionHandlers.onphysicaldeficienciesRevisionButtonClick(); }} size="small" sx={{ padding: '2px', marginLeft: '5px' }}>
              <PlaylistAddIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        )
      }
      {
        fieldPath.includes('Does the property generally conform to the neighborhood (functional utility, style, condition, use, construction, etc.)?If Yes, describe') && revisionHandlers.onpropertygenerallyconformRevisionButtonClick && (
          <Tooltip title="Does the property generally conform to the neighborhood (functional utility, style, condition, use, construction, etc.)?If Yes, describe">
            <IconButton onClick={(e) => { e.stopPropagation(); revisionHandlers.onpropertygenerallyconformRevisionButtonClick(); }} size="small" sx={{ padding: '2px', marginLeft: '5px' }}>
              <PlaylistAddIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        )
      }
      {
        fieldPath.includes('Does the property generally conform to the neighborhood (functional utility, style, condition, use, construction, etc.)?') && revisionHandlers.onpropertygenerallyRevisionButtonClick && (
          <Tooltip title="Does the property generally conform to the neighborhood (functional utility, style, condition, use, construction, etc.)?">
            <IconButton onClick={(e) => { e.stopPropagation(); revisionHandlers.onpropertygenerallyRevisionButtonClick(); }} size="small" sx={{ padding: '2px', marginLeft: '5px' }}>
              <PlaylistAddIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        )
      }

      {
        fieldPath.includes('Finished area above grade Bath(s)') && revisionHandlers.onFinishedAreaAboveGradeBathroomsRevisionButtonClick && (
          <Tooltip title="Finished area above grade Bath(s)">
            <IconButton onClick={(e) => { e.stopPropagation(); revisionHandlers.onFinishedAreaAboveGradeBathroomsRevisionButtonClick(); }} size="small" sx={{ padding: '2px', marginLeft: '5px' }}>
              <PlaylistAddIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        )
      }
      {
        fieldPath.includes('Finished area above grade Bedrooms') && revisionHandlers.onFinishedAreaAboveGradeBedroomsRevisionButtonClick && (
          <Tooltip title="Finished area above grade Bedrooms">
            <IconButton onClick={(e) => { e.stopPropagation(); revisionHandlers.onFinishedAreaAboveGradeBedroomsRevisionButtonClick(); }} size="small" sx={{ padding: '2px', marginLeft: '5px' }}>
              <PlaylistAddIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        )
      }
      {
        fieldPath.includes('Driveway # of Cars') && revisionHandlers.onDrivewayRevisionButtonClick && (
          <Tooltip title="Driveway # of Cars">
            <IconButton onClick={(e) => { e.stopPropagation(); revisionHandlers.onDrivewayRevisionButtonClick(); }} size="small" sx={{ padding: '2px', marginLeft: '5px' }}>
              <PlaylistAddIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        )
      }
      {
        fieldPath.includes('Pool') && revisionHandlers.onPoolRevisionButtonClick && (
          <Tooltip title="Pool">
            <IconButton onClick={(e) => { e.stopPropagation(); revisionHandlers.onPoolRevisionButtonClick(); }} size="small" sx={{ padding: '2px', marginLeft: '5px' }}>
              <PlaylistAddIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        )
      }
      {
        fieldPath.includes('Woodstove(s) #') && revisionHandlers.onWoodstoveRevisionButtonClick && (
          <Tooltip title="Woodstove(s) #">
            <IconButton onClick={(e) => { e.stopPropagation(); revisionHandlers.onWoodstoveRevisionButtonClick(); }} size="small" sx={{ padding: '2px', marginLeft: '5px' }}>
              <PlaylistAddIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        )
      }
      {
        fieldPath.includes('Trim/Finish (Material/Condition)') && revisionHandlers.ontrimRevisionButtonClick && (
          <Tooltip title="Trim/Finish (Material/Condition)">
            <IconButton onClick={(e) => { e.stopPropagation(); revisionHandlers.ontrimRevisionButtonClick(); }} size="small" sx={{ padding: '2px', marginLeft: '5px' }}>
              <PlaylistAddIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        )
      }
      {
        fieldPath.includes('Gutters & Downspouts (Material/Condition)') && revisionHandlers.onGuttersDownspoutsRevisionButtonClick && (
          <Tooltip title="Gutters & Downspouts (Material/Condition)">
            <IconButton onClick={(e) => { e.stopPropagation(); revisionHandlers.onGuttersDownspoutsRevisionButtonClick(); }} size="small" sx={{ padding: '2px', marginLeft: '5px' }}>
              <PlaylistAddIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        )
      }
      {
        fieldPath.includes('Screens') && revisionHandlers.onScreensRevisionButtonClick && (
          <Tooltip title="Screens">
            <IconButton onClick={(e) => { e.stopPropagation(); revisionHandlers.onScreensRevisionButtonClick(); }} size="small" sx={{ padding: '2px', marginLeft: '5px' }}>
              <PlaylistAddIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        )
      }
      {
        fieldPath.includes('Foundation Walls (Material/Condition)') && revisionHandlers.onFoundationWallsRevisionButtonClick && (
          <Tooltip title="Foundation Walls (Material/Condition)">
            <IconButton onClick={(e) => { e.stopPropagation(); revisionHandlers.onFoundationWallsRevisionButtonClick(); }} size="small" sx={{ padding: '2px', marginLeft: '5px' }}>
              <PlaylistAddIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        )
      }
      {
        fieldPath.includes('Existing/Proposed/Under Const.') && revisionHandlers.onproposedUseRevisionButtonClick && (
          <Tooltip title="Existing/Proposed/Under Const.">
            <IconButton onClick={(e) => { e.stopPropagation(); revisionHandlers.onproposedUseRevisionButtonClick(); }} size="small" sx={{ padding: '2px', marginLeft: '5px' }}>
              <PlaylistAddIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        )
      }
      {
        fieldPath.includes('Effective Age (Yrs)') && revisionHandlers.onEffectiveAgeRevisionButtonClick && (
          <Tooltip title="Effective Age (Yrs)">
            <IconButton onClick={(e) => { e.stopPropagation(); revisionHandlers.onEffectiveAgeRevisionButtonClick(); }} size="small" sx={{ padding: '2px', marginLeft: '5px' }}>
              <PlaylistAddIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        )
      }
      {
        fieldPath.includes('Basement Finish %') && revisionHandlers.onBasementFinishRevisionButtonClick && (
          <Tooltip title="Basement Finish %">
            <IconButton onClick={(e) => { e.stopPropagation(); revisionHandlers.onBasementFinishRevisionButtonClick(); }} size="small" sx={{ padding: '2px', marginLeft: '5px' }}>
              <PlaylistAddIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        )
      }
      {
        fieldPath.includes('Foundation Type') && revisionHandlers.onFoundationTypeRevisionButtonClick && (
          <Tooltip title="Foundation Type">
            <IconButton onClick={(e) => { e.stopPropagation(); revisionHandlers.onFoundationTypeRevisionButtonClick(); }} size="small" sx={{ padding: '2px', marginLeft: '5px' }}>
              <PlaylistAddIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        )
      }
      {
        fieldPath.includes('Evidence of') && revisionHandlers.onEvidenceofRevisionButtonClick && (
          <Tooltip title="Evidence of">
            <IconButton onClick={(e) => { e.stopPropagation(); revisionHandlers.onEvidenceofRevisionButtonClick(); }} size="small" sx={{ padding: '2px', marginLeft: '5px' }}>
              <PlaylistAddIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        )
      }
      {
        fieldPath.includes('Garage # of Cars') && revisionHandlers.onGarageAreaRevisionButtonClick && (
          <Tooltip title="Garage # of Cars">
            <IconButton onClick={(e) => { e.stopPropagation(); revisionHandlers.onGarageAreaRevisionButtonClick(); }} size="small" sx={{ padding: '2px', marginLeft: '5px' }}>

              <PlaylistAddIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        )
      }
      {
        fieldPath.includes('Basement Area sq.ft.') && revisionHandlers.onBasementAreaRevisionButtonClick && (
          <Tooltip title="Basement Area sq.ft.">
            <IconButton onClick={(e) => { e.stopPropagation(); revisionHandlers.onBasementAreaRevisionButtonClick(); }} size="small" sx={{ padding: '2px', marginLeft: '5px' }}>
              <PlaylistAddIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        )
      }
      {
        fieldPath.includes('Year Built') && revisionHandlers.onYearBuiltRevisionButtonClick && (
          <Tooltip title="Year Built">
            <IconButton onClick={(e) => { e.stopPropagation(); revisionHandlers.onYearBuiltRevisionButtonClick(); }} size="small" sx={{ padding: '2px', marginLeft: '5px' }}>
              <PlaylistAddIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        )
      }
      {
        fieldPath.includes('# of Stories') && revisionHandlers.onofStoriesRevisionButtonClick && (
          <Tooltip title="Basement">
            <IconButton onClick={(e) => { e.stopPropagation(); revisionHandlers.onofStoriesRevisionButtonClick(); }} size="small" sx={{ padding: '2px', marginLeft: '5px' }}>
              <PlaylistAddIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        )
      }
      {
        fieldPath.includes('Type') && revisionHandlers.onTypeRevisionButtonClick && (
          <Tooltip title="Type">
            <IconButton onClick={(e) => { e.stopPropagation(); revisionHandlers.onTypeRevisionButtonClick(); }} size="small" sx={{ padding: '2px', marginLeft: '5px' }}>
              <PlaylistAddIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        )
      }
      {
        fieldPath.includes('One with Accessory Unit') && revisionHandlers.onOneWithAccessoryUnitRevisionButtonClick && (
          <Tooltip title="One with Accessory Unit">
            <IconButton onClick={(e) => { e.stopPropagation(); revisionHandlers.onOneWithAccessoryUnitRevisionButtonClick(); }} size="small" sx={{ padding: '2px', marginLeft: '5px' }}>
              <PlaylistAddIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        )
      }
      {fieldPath.includes('Census Tract') && revisionHandlers.onCensusTractRevisionButtonClick && (
        <Tooltip title="Census Tract">
          <IconButton onClick={(e) => { e.stopPropagation(); revisionHandlers.onCensusTractRevisionButtonClick(); }} size="small" sx={{ padding: '2px', marginLeft: '5px' }}>
            <PlaylistAddIcon fontSize="small" />
          </IconButton>
        </Tooltip>
      )}
      {
        fieldPath.includes("Assessor's Parcel #") && revisionHandlers.onAssessorsParcelNumberRevisionButtonClick && (
          <Tooltip title="Assessor's Parcel Number">
            <IconButton onClick={(e) => { e.stopPropagation(); revisionHandlers.onAssessorsParcelNumberRevisionButtonClick(); }} size="small" sx={{ padding: '2px', marginLeft: '5px' }}>
              <PlaylistAddIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        )
      }
      {
        fieldPath.includes('Neighborhood Name') && revisionHandlers.onNeighborhoodNameRevisionButtonClick && (
          <Tooltip title="Neighborhood Name">
            <IconButton onClick={(e) => { e.stopPropagation(); revisionHandlers.onNeighborhoodNameRevisionButtonClick(); }} size="small" sx={{ padding: '2px', marginLeft: '5px' }}>
              <PlaylistAddIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        )
      }
      {fieldPath.includes('Is the highest and best use of subject property as improved (or as proposed per plans and specifications) the present use?') && revisionHandlers.onHighestAndBestUseClick && (
        <Tooltip title="Highest and Best Use">
          <IconButton onClick={(e) => { e.stopPropagation(); revisionHandlers.onHighestAndBestUseClick(); }} size="small" sx={{ padding: '2px', marginLeft: '5px' }}>
            <PlaylistAddIcon fontSize="small" />
          </IconButton>
        </Tooltip>
      )}
      {fieldPath.includes('Legal Description') && revisionHandlers.onLegalDescriptionUseClick && (
        <Tooltip title="Add revision for Legal Description">
          <IconButton onClick={e => { e.stopPropagation(); revisionHandlers.onLegalDescriptionUseClick(); }} size="small" sx={{ padding: '2px', marginLeft: '5px' }}>
            <PlaylistAddIcon fontSize="small" />
          </IconButton>
        </Tooltip>
      )}
      {fieldPath.includes('Are the utilities and off-site improvements typical for the market area?') && revisionHandlers.onOffSiteImprovementsClick && (
        <Tooltip title="Are the utilities and off-site improvements typical for the market area?">
          <IconButton onClick={e => { e.stopPropagation(); revisionHandlers.onOffSiteImprovementsClick(); }} size="small" sx={{ padding: '2px', marginLeft: '5px' }}>
            <PlaylistAddIcon fontSize="small" />
          </IconButton>
        </Tooltip>
      )}
      {
        fieldPath.includes('Dimensions') && revisionHandlers.onDimensionsRevisionButtonClick && (
          <Tooltip title="Dimensions">
            <IconButton onClick={(e) => { e.stopPropagation(); revisionHandlers.onDimensionsRevisionButtonClick(); }} size="small" sx={{ padding: '2px', marginLeft: '5px' }}>
              <PlaylistAddIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        )
      }
      {
        fieldPath.includes('Electricity') && revisionHandlers.onElectricityRevisionButtonClick && (
          <Tooltip title="Electricity">
            <IconButton onClick={(e) => { e.stopPropagation(); revisionHandlers.onElectricityRevisionButtonClick(); }} size="small" sx={{ padding: '2px', marginLeft: '5px' }}>
              <PlaylistAddIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        )
      }
      {
        fieldPath.includes('FEMA Map Date') && revisionHandlers.onFEMAMapDateRevisionButtonClick && (
          <Tooltip title="FEMA Map Date">
            <IconButton onClick={(e) => { e.stopPropagation(); revisionHandlers.onFEMAMapDateRevisionButtonClick(); }} size="small" sx={{ padding: '2px', marginLeft: '5px' }}>
              <PlaylistAddIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        )
      }
      {
        fieldPath.includes('Shape') && revisionHandlers.onShapeRevisionButtonClick && (
          <Tooltip title="Shape">
            <IconButton onClick={(e) => { e.stopPropagation(); revisionHandlers.onShapeRevisionButtonClick(); }} size="small" sx={{ padding: '2px', marginLeft: '5px' }}>
              <PlaylistAddIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        )
      }{
        fieldPath.includes('Zoning Description') && revisionHandlers.onZoningRevisionButtonClick && (
          <Tooltip title="Zoning Description">
            <IconButton onClick={(e) => { e.stopPropagation(); revisionHandlers.onZoningRevisionButtonClick(); }} size="small" sx={{ padding: '2px', marginLeft: '5px' }}>
              <PlaylistAddIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        )}
      {
        fieldPath.includes('Specific Zoning Classification') && revisionHandlers.onSpecificZoningClassificationRevisionButtonClick && (
          <Tooltip title="Specific Zoning Classification">
            <IconButton onClick={(e) => { e.stopPropagation(); revisionHandlers.onSpecificZoningClassificationRevisionButtonClick(); }} size="small" sx={{ padding: '2px', marginLeft: '5px' }}>
              <PlaylistAddIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        )
      }
      {
        fieldPath.includes('Gas') && revisionHandlers.onGasRevisionButtonClick && (
          <Tooltip title="Gas">
            <IconButton onClick={(e) => { e.stopPropagation(); revisionHandlers.onGasRevisionButtonClick(); }} size="small" sx={{ padding: '2px', marginLeft: '5px' }}>
              <PlaylistAddIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        )
      }
      {
        fieldPath.includes('Topography') && revisionHandlers.onTopographyRevisionButtonClick && (
          <Tooltip title="Topography">
            <IconButton onClick={(e) => { e.stopPropagation(); revisionHandlers.onTopographyRevisionButtonClick(); }} size="small" sx={{ padding: '2px', marginLeft: '5px' }}>
              <PlaylistAddIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        )
      }
      {fieldPath.includes('Alley') && revisionHandlers.onAlleyClick && (
        <Tooltip title="Alley">
          <IconButton onClick={(e) => { e.stopPropagation(); revisionHandlers.onAlleyClick(); }} size="small" sx={{ padding: '2px', marginLeft: '5px' }}>
            <PlaylistAddIcon fontSize="small" />
          </IconButton>
        </Tooltip>
      )}
      {
        fieldPath.includes('FEMA Flood Zone') && revisionHandlers.onFEMAFloodZoneRevisionButtonClick && (
          <Tooltip title="FEMA Flood Zone">
            <IconButton onClick={(e) => { e.stopPropagation(); revisionHandlers.onFEMAFloodZoneRevisionButtonClick(); }} size="small" sx={{ padding: '2px', marginLeft: '5px' }}>
              <PlaylistAddIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        )
      }

      {fieldPath.includes('FEMA Special Flood Hazard Area') && revisionHandlers.onFemaHazardRevisionButtonClick && (
        <Tooltip title="FEMA Hazard Revisions">
          <IconButton onClick={(e) => { e.stopPropagation(); revisionHandlers.onFemaHazardRevisionButtonClick(); }} size="small" sx={{ padding: '2px', marginLeft: '5px' }}>
            <PlaylistAddIcon fontSize="small" />
          </IconButton>
        </Tooltip>
      )}
      {fieldPath.includes('View') && revisionHandlers.onViewRevisionButtonClick && (
        <Tooltip title="View Revisions">
          <IconButton onClick={(e) => { e.stopPropagation(); revisionHandlers.onViewRevisionButtonClick(); }} size="small" sx={{ padding: '2px', marginLeft: '5px' }}>
            <PlaylistAddIcon fontSize="small" />
          </IconButton>
        </Tooltip>
      )}

      {
        fieldPath.includes('I did did not research the sale or transfer history of the subject property and comparable sales. If not, explain') && revisionHandlers.onGRID1ButtonClick && (
          <Tooltip title="I did did not research the sale or transfer history of the subject property and comparable sales. If not, explain">
            <IconButton onClick={(e) => { e.stopPropagation(); revisionHandlers.onGRID1ButtonClick(); }} size="small" sx={{ padding: '2px', marginLeft: '5px' }}>
              <PlaylistAddIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        )
      }
      {
        fieldPath.includes('My research did did not reveal any prior sales or transfers of the subject property for the three years prior to the effective date of this appraisal.') && revisionHandlers.onGRID2ButtonClick && (
          <Tooltip title="My research did did not reveal any prior sales or transfers of the subject property for the three years prior to the effective date of this appraisal.">
            <IconButton onClick={(e) => { e.stopPropagation(); revisionHandlers.onGRID2ButtonClick(); }} size="small" sx={{ padding: '2px', marginLeft: '5px' }}>
              <PlaylistAddIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        )
      }
      {
        fieldPath.includes('Data Source(s) for subject property research') && revisionHandlers.onGRID3ButtonClick && (
          <Tooltip title="Data Source(s) for subject property research">
            <IconButton onClick={(e) => { e.stopPropagation(); revisionHandlers.onGRID3ButtonClick(); }} size="small" sx={{ padding: '2px', marginLeft: '5px' }}>
              <PlaylistAddIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        )
      }
      {
        fieldPath.includes('My research did did not reveal any prior sales or transfers of the comparable sales for the year prior to the date of sale of the comparable sale.') && revisionHandlers.onGRID4ButtonClick && (
          <Tooltip title="My research did did not reveal any prior sales or transfers of the comparable sales for the year prior to the date of sale of the comparable sale.">
            <IconButton onClick={(e) => { e.stopPropagation(); revisionHandlers.onGRID4ButtonClick(); }} size="small" sx={{ padding: '2px', marginLeft: '5px' }}>
              <PlaylistAddIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        )
      }
      {
        fieldPath.includes('Data Source(s) for comparable sales research') && revisionHandlers.onGRID5ButtonClick && (
          <Tooltip title="Data Source(s) for comparable sales research">
            <IconButton onClick={(e) => { e.stopPropagation(); revisionHandlers.onGRID5ButtonClick(); }} size="small" sx={{ padding: '2px', marginLeft: '5px' }}>
              <PlaylistAddIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        )
      }
      {
        fieldPath.includes('Analysis of prior sale or transfer history of the subject property and comparable sales') && revisionHandlers.onGRID6ButtonClick && (
          <Tooltip title="Analysis of prior sale or transfer history of the subject property and comparable sales">
            <IconButton onClick={(e) => { e.stopPropagation(); revisionHandlers.onGRID6ButtonClick(); }} size="small" sx={{ padding: '2px', marginLeft: '5px' }}>
              <PlaylistAddIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        )
      }
      {
        fieldPath.includes('Summary of Sales Comparison Approach') && revisionHandlers.onGRID6ButtonClick && (
          <Tooltip title="Summary of Sales Comparison Approach">
            <IconButton onClick={(e) => { e.stopPropagation(); revisionHandlers.onGRID6ButtonClick(); }} size="small" sx={{ padding: '2px', marginLeft: '5px' }}>
              <PlaylistAddIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        )
      }

      {
        fieldPath.includes('Indicated Value by Sales Comparison Approach $') && revisionHandlers.onGRID6ButtonClick && (
          <Tooltip title="Indicated Value by Sales Comparison Approach $">
            <IconButton onClick={(e) => { e.stopPropagation(); revisionHandlers.onGRID6ButtonClick(); }} size="small" sx={{ padding: '2px', marginLeft: '5px' }}>
              <PlaylistAddIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        )
      }


      {/* CERTIFICATION */}
      {
        fieldPath.includes('Signature') && revisionHandlers.onSignatureButtonClick && (
          <Tooltip title="Signature">
            <IconButton onClick={(e) => { e.stopPropagation(); revisionHandlers.onSignatureButtonClick(); }} size="small" sx={{ padding: '2px', marginLeft: '5px' }}>
              <PlaylistAddIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        )
      }
      {
        fieldPath.includes('Name') && revisionHandlers.onNameButtonClick && (
          <Tooltip title="Name">
            <IconButton onClick={(e) => { e.stopPropagation(); revisionHandlers.onNameButtonClick(); }} size="small" sx={{ padding: '2px', marginLeft: '5px' }}>
              <PlaylistAddIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        )
      }     {
        fieldPath.includes('Company Name') && revisionHandlers.onCompanyNameButtonClick && (
          <Tooltip title="Company Name">
            <IconButton onClick={(e) => { e.stopPropagation(); revisionHandlers.onCompanyNameButtonClick(); }} size="small" sx={{ padding: '2px', marginLeft: '5px' }}>
              <PlaylistAddIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        )
      }     {
        fieldPath.includes('Company Address') && revisionHandlers.onCompanyAddressButtonClick && (
          <Tooltip title="Company Address">
            <IconButton onClick={(e) => { e.stopPropagation(); revisionHandlers.onCompanyAddressButtonClick(); }} size="small" sx={{ padding: '2px', marginLeft: '5px' }}>
              <PlaylistAddIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        )
      }     {
        fieldPath.includes('Telephone Number') && revisionHandlers.onTelephoneNumberButtonClick && (
          <Tooltip title="Telephone Number">
            <IconButton onClick={(e) => { e.stopPropagation(); revisionHandlers.onTelephoneNumberButtonClick(); }} size="small" sx={{ padding: '2px', marginLeft: '5px' }}>
              <PlaylistAddIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        )
      }     {
        fieldPath.includes('Email Address') && revisionHandlers.onEmailButtonClick && (
          <Tooltip title="Email Address">
            <IconButton onClick={(e) => { e.stopPropagation(); revisionHandlers.onEmailButtonClick(); }} size="small" sx={{ padding: '2px', marginLeft: '5px' }}>
              <PlaylistAddIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        )
      }     {
        fieldPath.includes('Date of Signature and Report') && revisionHandlers.onDATESignatureButtonClick && (
          <Tooltip title="Date of Signature and Report">
            <IconButton onClick={(e) => { e.stopPropagation(); revisionHandlers.onDATESignatureButtonClick(); }} size="small" sx={{ padding: '2px', marginLeft: '5px' }}>
              <PlaylistAddIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        )
      }{
        fieldPath.includes('Effective Date of Appraisal') && revisionHandlers.ONEffectiveDateofAppraisal && (
          <Tooltip title="Effective Date of Appraisal">
            <IconButton onClick={(e) => { e.stopPropagation(); revisionHandlers.ONEffectiveDateofAppraisal(); }} size="small" sx={{ padding: '2px', marginLeft: '5px' }}>
              <PlaylistAddIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        )
      }
      {
        fieldPath.includes('State Certification #') && revisionHandlers.ONSTATE1ofAppraisal && (
          <Tooltip title="State Certification #">
            <IconButton onClick={(e) => { e.stopPropagation(); revisionHandlers.ONSTATE1ofAppraisal(); }} size="small" sx={{ padding: '2px', marginLeft: '5px' }}>
              <PlaylistAddIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        )
      }
      {
        fieldPath.includes('or State License #') && revisionHandlers.ONSTATE1ofAppraisal && (
          <Tooltip title="or State License #">
            <IconButton onClick={(e) => { e.stopPropagation(); revisionHandlers.ONSTATE1ofAppraisal(); }} size="small" sx={{ padding: '2px', marginLeft: '5px' }}>
              <PlaylistAddIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        )
      }
      {
        fieldPath.includes('or Other (describe)') && revisionHandlers.ONSTATE1ofAppraisal && (
          <Tooltip title="or Other (describe)">
            <IconButton onClick={(e) => { e.stopPropagation(); revisionHandlers.ONSTATE1ofAppraisal(); }} size="small" sx={{ padding: '2px', marginLeft: '5px' }}>
              <PlaylistAddIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        )
      }
      {
        fieldPath.includes('State #') && revisionHandlers.ONSTATE1ofAppraisal && (
          <Tooltip title="State #">
            <IconButton onClick={(e) => { e.stopPropagation(); revisionHandlers.ONSTATE1ofAppraisal(); }} size="small" sx={{ padding: '2px', marginLeft: '5px' }}>
              <PlaylistAddIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        )
      }
      {
        fieldPath.includes('ADDRESS OF PROPERTY APPRAISED') && revisionHandlers.ONADDRESSOFPROPERTYAppraisal && (
          <Tooltip title="ADDRESS OF PROPERTY APPRAISED">
            <IconButton onClick={(e) => { e.stopPropagation(); revisionHandlers.ONADDRESSOFPROPERTYAppraisal(); }} size="small" sx={{ padding: '2px', marginLeft: '5px' }}>
              <PlaylistAddIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        )
      }
      {
        fieldPath.includes('APPRAISED VALUE OF SUBJECT PROPERTY $') && revisionHandlers.ONAPPRAISEDVALUEofAppraisal && (
          <Tooltip title="APPRAISED VALUE OF SUBJECT PROPERTY $">
            <IconButton onClick={(e) => { e.stopPropagation(); revisionHandlers.ONAPPRAISEDVALUEofAppraisal(); }} size="small" sx={{ padding: '2px', marginLeft: '5px' }}>
              <PlaylistAddIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        )
      }
      {
        fieldPath.includes('LENDER/CLIENT Name') && revisionHandlers.ONCLIENTNameAppraisal && (
          <Tooltip title="LENDER/CLIENT Name">
            <IconButton onClick={(e) => { e.stopPropagation(); revisionHandlers.ONCLIENTNameAppraisal(); }} size="small" sx={{ padding: '2px', marginLeft: '5px' }}>
              <PlaylistAddIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        )
      }
      {
        fieldPath.includes('Lender/Client Company Name') && revisionHandlers.ONCompanyName && (
          <Tooltip title="Lender/Client Company Name">
            <IconButton onClick={(e) => { e.stopPropagation(); revisionHandlers.ONCompanyName(); }} size="small" sx={{ padding: '2px', marginLeft: '5px' }}>
              <PlaylistAddIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        )
      }
      {
        fieldPath.includes('Lender/Client Company Address') && revisionHandlers.ONCompanyAddress && (
          <Tooltip title="Lender/Client Company Address">
            <IconButton onClick={(e) => { e.stopPropagation(); revisionHandlers.ONCompanyAddress(); }} size="small" sx={{ padding: '2px', marginLeft: '5px' }}>
              <PlaylistAddIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        )
      }
      {
        fieldPath.includes('Lender/Client Email Address') && revisionHandlers.ONEmailAddress && (
          <Tooltip title="Lender/Client Email Address">
            <IconButton onClick={(e) => { e.stopPropagation(); revisionHandlers.ONEmailAddress(); }} size="small" sx={{ padding: '2px', marginLeft: '5px' }}>
              <PlaylistAddIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        )
      }
      {
        fieldPath.includes('E&O Insurance') && revisionHandlers.ONInsurance && (
          <Tooltip title="E&O Insurance">
            <IconButton onClick={(e) => { e.stopPropagation(); revisionHandlers.ONInsurance(); }} size="small" sx={{ padding: '2px', marginLeft: '5px' }}>
              <PlaylistAddIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        )
      }
      {
        fieldPath.includes('Policy Period From') && revisionHandlers.ONEffectiveDateofAppraisal && (
          <Tooltip title="Policy Period From">
            <IconButton onClick={(e) => { e.stopPropagation(); revisionHandlers.ONEffectiveDateofAppraisal(); }} size="small" sx={{ padding: '2px', marginLeft: '5px' }}>
              <PlaylistAddIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        )
      }
      {
        fieldPath.includes('Expiration Date of Certification or License') && revisionHandlers.ONEXP && (
          <Tooltip title="Expiration Date of Certification or License">
            <IconButton onClick={(e) => { e.stopPropagation(); revisionHandlers.ONEXP(); }} size="small" sx={{ padding: '2px', marginLeft: '5px' }}>
              <PlaylistAddIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        )
      }
      {
        fieldPath.includes('Policy Period To') && revisionHandlers.ONPPT && (
          <Tooltip title="Policy Period To">
            <IconButton onClick={(e) => { e.stopPropagation(); revisionHandlers.ONPPT(); }} size="small" sx={{ padding: '2px', marginLeft: '5px' }}>
              <PlaylistAddIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        )}
      {
        fieldPath.includes('License Vaild To') && revisionHandlers.ONLVT && (
          <Tooltip title="License Vaild To">
            <IconButton onClick={(e) => { e.stopPropagation(); revisionHandlers.ONLVT(); }} size="small" sx={{ padding: '2px', marginLeft: '5px' }}>
              <PlaylistAddIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        )}
      {
        fieldPath.includes('LICENSE/REGISTRATION/CERTIFICATION #') && revisionHandlers.ONLVT1 && (
          <Tooltip title="LICENSE/REGISTRATION/CERTIFICATION #">
            <IconButton onClick={(e) => { e.stopPropagation(); revisionHandlers.ONLVT1(); }} size="small" sx={{ padding: '2px', marginLeft: '5px' }}>
              <PlaylistAddIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        )}

      {/* End of Certification */}
      {/* RECONCILIATION */}
      {
        fieldPath.includes('Indicated Value by: Sales Comparison Approach $') && revisionHandlers.ONIndicated1 && (
          <Tooltip title="Indicated Value by: Sales Comparison Approach $">
            <IconButton onClick={(e) => { e.stopPropagation(); revisionHandlers.ONIndicated1(); }} size="small" sx={{ padding: '2px', marginLeft: '5px' }}>
              <PlaylistAddIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        )}
      {
        fieldPath.includes('Cost Approach (if developed)') && revisionHandlers.ONcostApproach && (
          <Tooltip title="Cost Approach (if developed)">
            <IconButton onClick={(e) => { e.stopPropagation(); revisionHandlers.ONcostApproach(); }} size="small" sx={{ padding: '2px', marginLeft: '5px' }}>
              <PlaylistAddIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        )}
      {
        fieldPath.includes('Income Approach (if developed) $') && revisionHandlers.ONincomeApproach && (
          <Tooltip title="Income Approach (if developed) $">
            <IconButton onClick={(e) => { e.stopPropagation(); revisionHandlers.ONincomeApproach(); }} size="small" sx={{ padding: '2px', marginLeft: '5px' }}>
              <PlaylistAddIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        )}
      {
        fieldPath.includes('Income Approach (if developed) $ Comment') && revisionHandlers.ONincomeApproach2 && (
          <Tooltip title="Income Approach (if developed) $ Comment">
            <IconButton onClick={(e) => { e.stopPropagation(); revisionHandlers.ONincomeApproach2(); }} size="small" sx={{ padding: '2px', marginLeft: '5px' }}>
              <PlaylistAddIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        )}
      {
        fieldPath.includes('This appraisal is made "as is", subject to completion per plans and specifications on the basis of a hypothetical condition that the improvements have been completed, subject to the following repairs or alterations on the basis of a hypothetical condition that the repairs or alterations have been completed, or subject to the following required inspection based on the extraordinary assumption that the condition or deficiency does not require alteration or repair:') && revisionHandlers.ONReconciledValue && (
          <Tooltip title="as is">
            <IconButton onClick={(e) => { e.stopPropagation(); revisionHandlers.ONReconciledValue(); }} size="small" sx={{ padding: '2px', marginLeft: '5px' }}>
              <PlaylistAddIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        )
      }
      {
        fieldPath.includes('opinion of the market value, as defined, of the real property that is the subject of this report is $') && revisionHandlers.ONReconciledValue1 && (
          <Tooltip title="opinion of the market value, as defined, of the real property that is the subject of this report is $">
            <IconButton onClick={(e) => { e.stopPropagation(); revisionHandlers.ONReconciledValue1(); }} size="small" sx={{ padding: '2px', marginLeft: '5px' }}>
              <PlaylistAddIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        )
      }
      {/* Cost Approach */}
      {
        fieldPath.includes('Estimated') && revisionHandlers.ONEstimated && (
          <Tooltip title="Estimated">
            <IconButton onClick={(e) => { e.stopPropagation(); revisionHandlers.ONEstimated(); }} size="small" sx={{ padding: '2px', marginLeft: '5px' }}>
              <PlaylistAddIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        )
      }
      {
        fieldPath.includes('Source of cost data') && revisionHandlers.onSourceofcostdata && (
          <Tooltip title="Source of cost data">
            <IconButton onClick={(e) => { e.stopPropagation(); revisionHandlers.onSourceofcostdata(); }} size="small" sx={{ padding: '2px', marginLeft: '5px' }}>
              <PlaylistAddIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        )
      }
      {
        fieldPath.includes('Quality rating from cost service ') && revisionHandlers.onQuality && (
          <Tooltip title="Quality rating from cost service ">
            <IconButton onClick={(e) => { e.stopPropagation(); revisionHandlers.onQuality(); }} size="small" sx={{ padding: '2px', marginLeft: '5px' }}>
              <PlaylistAddIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        )
      }
      {
        fieldPath.includes('Effective date of cost data ') && revisionHandlers.onEffectiveDateofcostdata && (
          <Tooltip title="Effective date of cost data ">
            <IconButton onClick={(e) => { e.stopPropagation(); revisionHandlers.onEffectiveDateofcostdata(); }} size="small" sx={{ padding: '2px', marginLeft: '5px' }}>
              <PlaylistAddIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        )
      }
      {
        fieldPath.includes('Comments on Cost Approach (gross living area calculations, depreciation, etc.)') && revisionHandlers.onCommentsOnCost && (
          <Tooltip title="Comments on Cost Approach (gross living area calculations, depreciation, etc.)">
            <IconButton onClick={(e) => { e.stopPropagation(); revisionHandlers.onCommentsOnCost(); }} size="small" sx={{ padding: '2px', marginLeft: '5px' }}>
              <PlaylistAddIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        )
      }
      {
        fieldPath.includes('OPINION OF SITE VALUE = $ ................................................') && revisionHandlers.onOPINIONOFSITE && (
          <Tooltip title="OPINION OF SITE VALUE = $ ................................................">
            <IconButton onClick={(e) => { e.stopPropagation(); revisionHandlers.onOPINIONOFSITE(); }} size="small" sx={{ padding: '2px', marginLeft: '5px' }}>
              <PlaylistAddIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        )
      }
      {
        fieldPath.includes('Dwelling') && revisionHandlers.onDwelling && (
          <Tooltip title="Dwelling">
            <IconButton onClick={(e) => { e.stopPropagation(); revisionHandlers.onDwelling(); }} size="small" sx={{ padding: '2px', marginLeft: '5px' }}>
              <PlaylistAddIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        )
      }
      {
        fieldPath.includes('Garage/Carport ') && revisionHandlers.onGarageCarport && (
          <Tooltip title="Garage/Carport ">
            <IconButton onClick={(e) => { e.stopPropagation(); revisionHandlers.onGarageCarport(); }} size="small" sx={{ padding: '2px', marginLeft: '5px' }}>
              <PlaylistAddIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        )
      }
      {
        fieldPath.includes('Estimated Remaining Economic Life (HUD and VA only)') && revisionHandlers.onEstimatedRemainingEconomicLife && (
          <Tooltip title="Estimated Remaining Economic Life (HUD and VA only)">
            <IconButton onClick={(e) => { e.stopPropagation(); revisionHandlers.onEstimatedRemainingEconomicLife(); }} size="small" sx={{ padding: '2px', marginLeft: '5px' }}>
              <PlaylistAddIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        )
      }
      {
        fieldPath.includes(' Total Estimate of Cost-New  = $ ...................') && revisionHandlers.ONTOTALESTIMATE && (
          <Tooltip title=" Total Estimate of Cost-New  = $ ...................">
            <IconButton onClick={(e) => { e.stopPropagation(); revisionHandlers.ONTOTALESTIMATE(); }} size="small" sx={{ padding: '2px', marginLeft: '5px' }}>
              <PlaylistAddIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        )
      }
      {
        fieldPath.includes('Depreciation ') && revisionHandlers.ONDepreciation && (
          <Tooltip title="Depreciation ">
            <IconButton onClick={(e) => { e.stopPropagation(); revisionHandlers.ONDepreciation(); }} size="small" sx={{ padding: '2px', marginLeft: '5px' }}>
              <PlaylistAddIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        )
      }
      {
        fieldPath.includes('Depreciated Cost of Improvements......................................................=$ ') && revisionHandlers.ONTOTALDEDUCT && (
          <Tooltip title="Depreciated Cost of Improvements......................................................=$ ">
            <IconButton onClick={(e) => { e.stopPropagation(); revisionHandlers.ONTOTALDEDUCT(); }} size="small" sx={{ padding: '2px', marginLeft: '5px' }}>
              <PlaylistAddIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        )
      }
      {
        fieldPath.includes('“As-is” Value of Site Improvements......................................................=$') && revisionHandlers.onasisvalueofsiteimprovements && (
          <Tooltip title="“As-is” Value of Site Improvements......................................................=$">
            <IconButton onClick={(e) => { e.stopPropagation(); revisionHandlers.onasisvalueofsiteimprovements(); }} size="small" sx={{ padding: '2px', marginLeft: '5px' }}>
              <PlaylistAddIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        )
      }
      {
        fieldPath.includes('Indicated Value By Cost Approach......................................................=$') && revisionHandlers.onTotalValuebyCostApproach && (
          <Tooltip title="Indicated Value By Cost Approach......................................................=$">
            <IconButton onClick={(e) => { e.stopPropagation(); revisionHandlers.onTotalValuebyCostApproach(); }} size="small" sx={{ padding: '2px', marginLeft: '5px' }}>
              <PlaylistAddIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        )
      }
      {/* Income Approach */}
      {
        fieldPath.includes('Estimated Monthly Market Rent $') && revisionHandlers.onEffectiveGrossIncome && (
          <Tooltip title="Estimated Monthly Market Rent $">
            <IconButton onClick={(e) => { e.stopPropagation(); revisionHandlers.onEffectiveGrossIncome(); }} size="small" sx={{ padding: '2px', marginLeft: '5px' }}>

              <PlaylistAddIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        )
      }
      {
        fieldPath.includes('X Gross Rent Multiplier  = $') && revisionHandlers.onxgross && (
          <Tooltip title="X Gross Rent Multiplier  = $">
            <IconButton onClick={(e) => { e.stopPropagation(); revisionHandlers.onxgross(); }} size="small" sx={{ padding: '2px', marginLeft: '5px' }}>
              <PlaylistAddIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        )
      }
      {
        fieldPath.includes('Indicated Value by Income Approach') && revisionHandlers.onIndicatedValuebyIncomeApproach && (
          <Tooltip title="Indicated Value by Income Approach">
            <IconButton onClick={(e) => { e.stopPropagation(); revisionHandlers.onIndicatedValuebyIncomeApproach(); }} size="small" sx={{ padding: '2px', marginLeft: '5px' }}>
              <PlaylistAddIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        )
      }
      {
        fieldPath.includes('PUD Fees $') && revisionHandlers.onPUDFees$ && (
          <Tooltip title="PUD Fees $">
            <IconButton onClick={(e) => { e.stopPropagation(); revisionHandlers.onPUDFees$(); }} size="small" sx={{ padding: '2px', marginLeft: '5px' }}>
              <PlaylistAddIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        )
      }
      {/* PUD Information */}

      {
        fieldPath.includes('Summary of Income Approach (including support for market rent and GRM) ') && revisionHandlers.ONSUMMARYOFINCOMEAPPROACH && (
          <Tooltip title="Summary of Income Approach (including support for market rent and GRM) ">
            <IconButton onClick={(e) => { e.stopPropagation(); revisionHandlers.ONSUMMARYOFINCOMEAPPROACH(); }} size="small" sx={{ padding: '2px', marginLeft: '5px' }}>
              <PlaylistAddIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        )
      }
      {
        fieldPath.includes('PUD Fees (per month)') && revisionHandlers.ONPUDFeesM && (
          <Tooltip title="PUD Fees (per month)">
            <IconButton onClick={(e) => { e.stopPropagation(); revisionHandlers.ONPUDFeesM(); }} size="small" sx={{ padding: '2px', marginLeft: '5px' }}>
              <PlaylistAddIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        )
      }
      {
        fieldPath.includes('PUD Fees (per year)') && revisionHandlers.ONPUDFeesy && (
          <Tooltip title="PUD Fees (per year)">
            <IconButton onClick={(e) => { e.stopPropagation(); revisionHandlers.ONPUDFeesy(); }} size="small" sx={{ padding: '2px', marginLeft: '5px' }}>
              <PlaylistAddIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        )
      }
      {
        fieldPath.includes("Is the developer/builder in control of the Homeowners' Association (HOA)?") && revisionHandlers.ONdbha && (
          <Tooltip title="Is the developer/builder in control of the Homeowners' Association (HOA)?">
            <IconButton onClick={(e) => { e.stopPropagation(); revisionHandlers.ONdbha(); }} size="small" sx={{ padding: '2px', marginLeft: '5px' }}>
              <PlaylistAddIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        )

      }
      {
        fieldPath.includes('Unit type(s)') && revisionHandlers.ONunittypes && (
          <Tooltip title="Unit type(s)">
            <IconButton onClick={(e) => { e.stopPropagation(); revisionHandlers.ONunittypes(); }} size="small" sx={{ padding: '2px', marginLeft: '5px' }}>
              <PlaylistAddIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        )
      }
      {
        fieldPath.includes('Provide the following information for PUDs ONLY if the developer/builder is in control of the HOA and the subject property is an attached dwelling unit.') && revisionHandlers.onProvideThe && (
          <Tooltip title="Provide the following information for PUDs ONLY if the developer/builder is in control of the HOA and the subject property is an attached dwelling unit.">
            <IconButton onClick={(e) => { e.stopPropagation(); revisionHandlers.onProvideThe(); }} size="small" sx={{ padding: '2px', marginLeft: '5px' }}>
              <PlaylistAddIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        )
      }
      {
        fieldPath.includes('Legal Name of Project') && revisionHandlers.onLegalNameOfProject && (
          <Tooltip title="Legal Name of Project">
            <IconButton onClick={(e) => { e.stopPropagation(); revisionHandlers.onLegalNameOfProject(); }} size="small" sx={{ padding: '2px', marginLeft: '5px' }}>
              <PlaylistAddIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        )
      }
      {
        fieldPath.includes('Total number of phases') && revisionHandlers.onTotalNumberOfPhases && (
          <Tooltip title="Total number of phases">
            <IconButton onClick={(e) => { e.stopPropagation(); revisionHandlers.onTotalNumberOfPhases(); }} size="small" sx={{ padding: '2px', marginLeft: '5px' }}>
              <PlaylistAddIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        )
      }
      {
        fieldPath.includes('Total number of units') && revisionHandlers.onTotalNumberOfUnits && (
          <Tooltip title="Total number of units">
            <IconButton onClick={(e) => { e.stopPropagation(); revisionHandlers.onTotalNumberOfUnits(); }} size="small" sx={{ padding: '2px', marginLeft: '5px' }}>
              <PlaylistAddIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        )
      }
      {
        fieldPath.includes('Total number of units sold') && revisionHandlers.onTotalNumberOfUnitsSold && (
          <Tooltip title="Total number of units sold">
            <IconButton onClick={(e) => { e.stopPropagation(); revisionHandlers.onTotalNumberOfUnitsSold(); }} size="small" sx={{ padding: '2px', marginLeft: '5px' }}>
              <PlaylistAddIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        )}{
        fieldPath.includes('Total number of units rented') && revisionHandlers.onTotalNumberOfUnitsRented && (
          <Tooltip title="Total number of units rented">
            <IconButton onClick={(e) => { e.stopPropagation(); revisionHandlers.onTotalNumberOfUnitsRented(); }} size="small" sx={{ padding: '2px', marginLeft: '5px' }}>
              <PlaylistAddIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        )
      }{
        fieldPath.includes('Total number of units for sale') && revisionHandlers.onTotalNumberOfUnitsForSale && (
          <Tooltip title="Total number of units for sale">
            <IconButton onClick={(e) => { e.stopPropagation(); revisionHandlers.onTotalNumberOfUnitsForSale(); }} size="small" sx={{ padding: '2px', marginLeft: '5px' }}>
              <PlaylistAddIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        )
      }
      {
        fieldPath.includes('Data source(s)') && revisionHandlers.onDatasourcepi && (
          <Tooltip title="Data source(s)">
            <IconButton onClick={(e) => { e.stopPropagation(); revisionHandlers.onDatasourcepi(); }} size="small" sx={{ padding: '2px', marginLeft: '5px' }}>
              <PlaylistAddIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        )
      }
      {
        fieldPath.includes('Was the project created by the conversion of existing building(s) into a PUD?') && revisionHandlers.onprojectcreated && (
          <Tooltip title="Was the project created by the conversion of existing building(s) into a PUD?">
            <IconButton onClick={(e) => { e.stopPropagation(); revisionHandlers.onprojectcreated(); }} size="small" sx={{ padding: '2px', marginLeft: '5px' }}>
              <PlaylistAddIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        )
      }


    </div>
  );

  if (validation.message) {
    return <Tooltip title={validation.message} placement="top" arrow>{fieldContent}</Tooltip>;
  }

  return (
    <div>
      {fieldContent}
    </div>
  );
};

export const FieldTable = ({ id, title, fields, data, cardClass = 'bg-primary', usePre = false, extractionAttempted, onDataChange, editingField, setEditingField, allData }) => {
  const cardHeaderColors = {
    'bg-primary': 'primary.main',
    'bg-secondary': 'secondary.main',
    'bg-info': 'info.main',
    'bg-warning': 'warning.main',
    'bg-success': 'success.main',
    'bg-danger': 'error.main',
    'bg-dark': 'grey.900',
  };
  const headerBgColor = cardHeaderColors[cardClass] || 'primary.main';
  const headerColor = cardClass === 'bg-warning' ? 'text.primary' : 'common.white';

  return (
    <Paper id={id} elevation={3} sx={{ mb: 4, mt: 4, borderRadius: 2, overflow: 'hidden' }}>
      {title && (
        <Box sx={{ bgcolor: headerBgColor, color: headerColor, px: 2, py: 1.5, position: 'sticky', top: 0, zIndex: 10 }}>
          <Typography variant="subtitle1" fontWeight="bold" align="center">{title}</Typography>
        </Box>
      )}
      <TableContainer>
        <Table size="small" aria-label={title || "data table"}>
          <TableBody>
            {fields.map((field, index) => {
              const fieldLabel = typeof field === 'object' && field !== null ? `${field.choice} ${field.comment || ''}`.trim() : field;
              const value = data[fieldLabel];
              const isMissing = extractionAttempted && (value === undefined || value === null || value === '');
              return (
                <TableRow key={index} hover>
                  <TableCell sx={{ width: usePre ? '35%' : '50%', fontWeight: 'medium' }}>
                    {typeof field === 'object' && field !== null ? `${field.choice} ${field.comment || ''}`.trim() : field}
                  </TableCell>
                  <TableCell sx={isMissing ? { border: '2px solid red' } : {}}>
                    <EditableField
                      fieldPath={[fieldLabel]}
                      value={value || ''}
                      onDataChange={(path, val) => onDataChange(path[0], val)}
                      editingField={editingField}
                      setEditingField={setEditingField}
                      usePre={usePre} isMissing={isMissing}
                      allData={allData}
                    />
                    {/* Passing manual validation props */}
                    <EditableField manualValidations={allData.manualValidations} handleManualValidation={allData.handleManualValidation} />
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
};

export const MarketConditionsTable = ({ id, title, data, onDataChange, editingField, setEditingField, marketConditionsRows = [], manualValidations, handleManualValidation, isEditable }) => {
  const timeframes = ["Prior 7-12 Months", "Prior 4-6 Months", "Current-3 Months", "Overall Trend"];

  return (
    <Paper id={id} elevation={3} sx={{ mb: 4, mt: 4, borderRadius: 2, overflow: 'hidden' }}>
      <Box sx={{ bgcolor: 'warning.main', color: 'black', px: 2, py: 1.5, position: 'sticky', top: 0, zIndex: 10 }}>
        <Typography variant="subtitle1" fontWeight="bold">{title}</Typography>
      </Box>
      <TableContainer>
        <Table size="small" aria-label="market conditions table">
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontWeight: 'bold', width: '30%', backgroundColor: 'action.hover' }}>Inventory Analysis</TableCell>
              {timeframes.map(tf => <TableCell key={tf} align="center" sx={{ fontWeight: 'bold', backgroundColor: 'action.hover' }}>{tf}</TableCell>)}
            </TableRow>
          </TableHead>
          <TableBody>
            {marketConditionsRows.map(row => (
              <TableRow key={row.label} hover>
                <TableCell component="th" scope="row" sx={{ fontWeight: 'medium' }}>{row.label}</TableCell>
                {timeframes.map(tf => {
                  const fieldName = `${row.fullLabel} (${tf})`;
                  const marketData = data?.MARKET_CONDITIONS ?? {};
                  const value = marketData[fieldName] || '';

                  return (
                    <TableCell key={tf} align="center" sx={{ border: '1px solid rgba(224, 224, 224, 1)' }}>
                      <EditableField
                        fieldPath={['MARKET_CONDITIONS', fieldName]}
                        value={value}
                        onDataChange={(path, val) => onDataChange(path, val)}
                        editingField={editingField}
                        setEditingField={setEditingField}
                        isMissing={!value}
                        manualValidations={manualValidations}
                        handleManualValidation={handleManualValidation}
                        customValidation={checkMarketConditionsTableFields}
                        isEditable={isEditable}
                      />
                    </TableCell>
                  );
                })}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
};

export const SubjectInfoCard = ({ id, title, fields, data, extractionAttempted, onDataChange, isEditable, editingField, setEditingField, highlightedFields, allData, comparisonData, getComparisonStyle, loading, loadingSection, contractExtracted, setContractExtracted, handleExtract, manualValidations, handleManualValidation, onRevisionButtonClick, revisionHandlers }) => {

  const renderGridItem = (field) => {
    const isHighlighted = highlightedFields.includes(field);
    const itemStyle = {};
    if (extractionAttempted && (data[field] === undefined || data[field] === null || data[field] === '')) {
      itemStyle.padding = '4px';
      itemStyle.borderRadius = '4px';
    }

    let displayValue = data[field] || '';
    let fieldPath = [field];

    const comparisonStyle = getComparisonStyle ? getComparisonStyle(field, displayValue, comparisonData?.[field]) : {};



    if (field === 'PUD') {
      const perMonth = data['PUD Fees (per month)'];
      const perYear = data['PUD Fees (per year)'];
      if (perMonth) {
        displayValue = `${displayValue} per month`;
      } else if (perYear) {
        displayValue = `${displayValue} per year`;
      }
    }

    return (
      <div key={field} className={`subject-grid-item ${isHighlighted ? 'highlighted-field' : ''}`} style={{ ...itemStyle, ...comparisonStyle, color: 'inherit' }}>
        <span className="field-label">{field}</span>

        <EditableField
          fieldPath={fieldPath}
          value={displayValue}
          onDataChange={onDataChange}
          editingField={editingField}
          setEditingField={setEditingField}
          isMissing={extractionAttempted && (data[field] === undefined || data[field] === null || data[field] === '')}
          allData={allData}
          isEditable={isEditable || field === 'Property Address'}
          manualValidations={manualValidations}
          handleManualValidation={handleManualValidation} revisionHandlers={revisionHandlers}
        />
      </div>
    );
  };

  return (
    <Paper id={id} elevation={3} sx={{ mb: 4, borderRadius: 2, overflow: 'hidden' }} className="subject-info-card">
      <Box sx={{ bgcolor: 'secondary.main', color: 'white', px: 2, py: 1.5, display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'sticky', top: 0, zIndex: 10 }}>
        <Typography variant="h6" component="div" sx={{ fontSize: '1.1rem', fontWeight: 'bold' }}>{title}</Typography>
        {onRevisionButtonClick && (
          <Tooltip title="Revision Language">
            <IconButton onClick={onRevisionButtonClick} size="small" sx={{ color: 'white', float: 'right' }}><LibraryBooksIcon /></IconButton>
          </Tooltip>
        )}
      </Box>
      {loading && loadingSection === id && (
        <Box sx={{ width: '100%' }}><LinearProgress /></Box>
      )}
      <Box className="card-body subject-grid-container" sx={{ p: 2 }}>
        {fields
          .filter(field =>
            field !== 'HOA(per month)' &&
            field !== 'HOA(per year)' &&
            field !== 'PUD Fees (per month)' &&
            field !== 'PUD Fees (per year)'
          )
          .map(field => renderGridItem(field))
        }
      </Box>
    </Paper>
  );
};

export const GridInfoCard = ({ id, title, fields, data, cardClass = 'bg-secondary', usePre = false, extractionAttempted, onDataChange, editingField, setEditingField, highlightedFields = [], allData, loading, loadingSection, manualValidations, handleManualValidation, onRevisionButtonClick, revisionHandlers }) => {

  const renderNeighborhoodTotal = () => {
    if (id !== 'neighborhood-section' || !data) return null;

    const usageFields = ["One-Unit", "2-4 Unit", "Multi-Family", "Commercial", "Other"];
    const values = usageFields.map(f => {
      const val = String(data[f] || '0').replace('%', '').trim();
      return parseFloat(val) || 0;
    });
    const total = values.reduce((sum, v) => sum + v, 0);

    const totalStyle = {
      fontWeight: 'bold',
      padding: '2px 8px',
      borderRadius: '4px',
      color: total === 100 ? '#000000' : '#721c24',
      backgroundColor: total === 100 ? '#91ff00ff' : '#f8d7da',
    };

    return <span style={totalStyle}>Total: {total}%</span>;
  };

  const getDynamicFields = () => {
    if (id !== 'site-section' || !data) return fields;

    let dynamicFields = [...fields];
    const zoningComplianceValue = data?.['Zoning Compliance'];
    const complianceIndex = dynamicFields.indexOf('Zoning Compliance');

    if (complianceIndex !== -1) {
      if (zoningComplianceValue === 'Legal Nonconforming (Grandfathered Use)' && !dynamicFields.includes('Legal Nonconforming (Grandfathered Use) comment')) {
        dynamicFields.splice(complianceIndex + 1, 0, 'Legal Nonconforming (Grandfathered Use) comment');
      } else if (zoningComplianceValue === 'No Zoning' && !dynamicFields.includes('No Zoning comment')) {
        dynamicFields.splice(complianceIndex + 1, 0, 'No Zoning comment');
      }
    }
    return dynamicFields;
  };
  const cardHeaderColors = {
    'bg-primary': 'primary.main',
    'bg-secondary': 'secondary.main',
    'bg-info': 'info.main',
    'bg-warning': 'warning.main',
    'bg-success': 'success.main',
    'bg-danger': 'error.main',
    'bg-dark': 'grey.900',
  };

  const headerBgColor = cardHeaderColors[cardClass] || 'grey.700';
  const headerColor = cardClass === 'bg-warning' ? 'text.primary' : 'common.white';

  const renderValue = (value) => {
    if (typeof value === 'object' && value !== null) {
      if (value.hasOwnProperty('choice')) {
        return value.choice || '';
      }
      return Object.entries(value).map(([key, val]) => `${key}: ${val}`).join(', ');
    }
    return value || '';
  };

  const renderGridItemValue = (field) => {
    if (field === 'Garage Att./Det./Built-in') {
      const att = data['Garage Att.'] || '';
      const det = data['Garage Detached'] || '';
      const builtin = data['Garage Built-in'] || '';
      return [att, det, builtin].filter(Boolean).join(' / ');
    }
    return renderValue(data[field]);
  };

  const renderGridItem = (field) => {
    if (id === 'neighborhood-section' && field === 'Present Land Use for other') {
      if (!data) return null;
      const otherValue = String(data['Other'] || '0').replace('%', '').trim();
      const otherNumericValue = parseFloat(otherValue);

      if (isNaN(otherNumericValue) || otherNumericValue <= 0) {
        return null; // Don't render if "Other" is 0 or not a positive number
      }
    }

    const isHighlighted = highlightedFields.includes(field);
    let isItemMissing = extractionAttempted && (!data || renderGridItemValue(field) === '');

    if (field === 'Garage Att./Det./Built-in') {
      const att = data['Garage Att.'] || '';
      const det = data['Garage Detached'] || '';
      const builtin = data['Garage Built-in'] || '';
      isItemMissing = extractionAttempted && !att && !det && !builtin;
    }
    return (
      <div key={field} className={`subject-grid-item ${isHighlighted ? 'highlighted-field' : ''}`}>
        <span className="field-label">{field}</span>
        <EditableField
          fieldPath={(() => {
            const baseFieldPath = Array.isArray(field) ? field : [field];

            return onDataChange.length === 2 ? baseFieldPath : [id.replace('-section', '').toUpperCase(), ...baseFieldPath];
          })()}
          value={data ? renderGridItemValue(field) : ''}
          onDataChange={onDataChange}
          editingField={editingField}
          setEditingField={setEditingField}
          usePre={usePre}
          isMissing={isItemMissing}
          inputClassName={`form-control form-control-sm ${usePre ? "field-value-pre" : "field-value"}`}
          isEditable={true}
          allData={allData}
          manualValidations={manualValidations}
          handleManualValidation={handleManualValidation} revisionHandlers={revisionHandlers}
          inputStyle={{ width: '100%', border: 'none', background: 'transparent', padding: 0, height: 'auto', resize: usePre ? 'vertical' : 'none' }}
        />
      </div>
    );
  };

  return (
    <Paper id={id} elevation={2} sx={{ mb: 2 }}>
      <Box
        sx={{
          p: 1.5,
          bgcolor: headerBgColor,
          color: headerColor,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}>
        <Typography variant="h6" component="h5">{title}</Typography>
        {onRevisionButtonClick && (
          <Tooltip title="Revision Language">
            <IconButton onClick={onRevisionButtonClick} size="small" sx={{ color: headerColor === 'text.primary' ? 'black' : 'white' }}><LibraryBooksIcon /></IconButton>
          </Tooltip>
        )}
        {renderNeighborhoodTotal()}
      </Box>
      {loading && loadingSection === id && (
        <Box sx={{ width: '100%' }}><LinearProgress /></Box>
      )}
      <div className="card-body subject-grid-container">
        {getDynamicFields().map(field => renderGridItem(field))}
      </div>
    </Paper>
  );
};  