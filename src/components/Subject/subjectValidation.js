const checkNotBlank = (field, text, fieldName) => {
    if (field === fieldName) {
        if (!text || String(text).trim() === '') {
            return { isError: true, message: `'${fieldName}' should not be blank.` };
        }
        return { isMatch: true };
    }
    return null;
};

export const checkTaxYear = (field, text) => {
    if (field !== 'Tax Year') return null;
    const taxYearValue = String(text || '').trim();
    if (!taxYearValue) {
        return { isError: true, message: 'Tax Year should not be blank.' };
    }
    const taxYear = parseInt(taxYearValue, 10);
    if (isNaN(taxYear)) {
        return { isError: true, message: 'Tax Year must be a valid year.' };
    }
    const currentYear = new Date().getFullYear();
    if (taxYear > currentYear || taxYear < currentYear - 1) {
        return { isError: true, message: `Tax Year must be the current year (${currentYear}) or the previous year (${currentYear - 1}).` };
    }
    return { isMatch: true };
};

export const checkSubjectFieldsNotBlank = (field, text) => {
    const fieldsToCheck = [
        'Property Address',
        'County',
        'Borrower',
        'City',
        'Zip Code',
        'Owner of Public Record',
        'Legal Description',
        "Assessor's Parcel #",
        'Neighborhood Name',
        'Map Reference',
        'Census Tract',
        'Occupant',
        'Property Rights Appraised',
        'Lender/Client',
        'Address (Lender/Client)',
        'Report data source(s) used, offering price(s), and date(s)'
    ];
    return checkNotBlank(field, text, fieldsToCheck.find(f => f === field));
};

export const checkAssignmentTypeConsistency = (field, text, data) => {
    if (field !== 'Assignment Type') return null;
    const assignmentType = String(text || '').trim().toLowerCase();
    const contractData = data.CONTRACT;
    const isContractSectionEmpty = !contractData || Object.values(contractData).every(value => value == null || value === '');
    if (assignmentType === 'purchase transaction' && isContractSectionEmpty) {
        return { isError: true, message: `Assignment Type is 'Purchase Transaction' then the Contract Section should not be empty.` };
    }
    if (assignmentType === 'refinance transaction') {
        const analysisField = "I did did not analyze the contract for sale for the subject purchase transaction. Explain the results of the analysis of the contract for sale or why the analysis was not performed.";
        const analysisValue = String(contractData?.[analysisField] || '').trim().toLowerCase();
        if (analysisValue.includes('did not')) {
            return { isMatch: true };
        }
        if (!isContractSectionEmpty) {
            return { isError: true, message: `Assignment Type is 'Refinance Transaction' then the Contract Section should be empty.` };
        }
    }
    return { isMatch: true };
};
export const checkRETaxes = (field, text) => {
    if (field !== 'R.E. Taxes $') return null;
    const taxesValue = String(text || '').trim();
    const integerPart = taxesValue.split('.')[0].replace(/[^0-9]/g, '');
    if (!taxesValue) {
        return { isError: true, message: 'R.E. Taxes $ should not be blank.' };
    }
    if (integerPart.length > 4) {
        return { isError: true, message: 'R.E. Taxes $ integer part should not exceed 4 digits.' };
    }
    if (/[a-zA-Z]/.test(taxesValue)) {
        return { isError: true, message: 'R.E. Taxes $ must only contain numbers and currency symbols.' };
    }
    return { isMatch: true };
};

export const checkSpecialAssessments = (field, text) => {
    if (field !== 'Special Assessments $') return null;
    const value = parseFloat(String(text || '0').replace(/[^0-9.-]+/g, ""));
    if (isNaN(value) || value < 0) {
        return { isError: true, message: 'Special Assessments $ must be at least 0.' };
    }
    return { isMatch: true };
};

export const checkPUD = (field, text) => {
    if (field !== 'PUD') return null;
    const value = String(text || '').trim().toLowerCase();
    if (value !== 'yes' && value !== 'no') {
        return { isError: true, message: "PUD must be 'Yes' or 'No'." };
    }
    return { isMatch: true };
};

export const checkHOA = (field, text, data) => {
    if (field !== 'HOA $') return null;
    const pudValue = String(data['PUD'] || '').trim().toLowerCase();
    if (pudValue === 'yes') {
        const hoaValue = parseFloat(String(text || '').replace(/[^0-9.-]+/g, ""));
        if (isNaN(hoaValue) || hoaValue <= 0) {
            return { isError: true, message: 'HOA $ must be greater than 0 if PUD is Yes.' };
        }
        if (!data['HOA(per year)'] && !data['HOA(per month)']) {
            return { isError: true, message: "If PUD is 'Yes', at least one of 'HOA (per year)' or 'HOA (per month)' must be specified." };
        }
    }
    return { isMatch: true };
};
export const checkOfferedForSale = (field, text, data) => {
    if (field === 'Offered for Sale in Last 12 Months') {
        const value = String(text || '').trim().toLowerCase();
        if (value !== 'yes' && value !== 'no') {
            return { isError: true, message: "This field must be 'Yes' or 'No'." };
        }
        if (value === 'yes') {
            const detailsField = data['Report data source(s) used, offering price(s), and date(s)'];
            if (!detailsField) {
                return { isError: true, message: "If 'Yes', details must be provided in the data source field below." };
            }
            const detailsValue = String(detailsField || '').toLowerCase();
            const keywords = ['dom', 'listed', 'listing', 'mls', 'multiple listing service'];
            const hasKeyword = keywords.some(keyword => detailsValue.includes(keyword));

            if (!hasKeyword) {
                return { isError: true, message: `If 'Yes', details must include one of: ${keywords.join(', ')}.` };
            }
        }
    }
    return { isMatch: true };
};

export const checkPropertyRightsInconsistency = (field, text, data) => {
    if (field !== 'Property Rights Appraised' || !data.Subject) return null;
    const subjectPropertyRights = String(text || '').trim();
    const salesGridPropertyRights = String(data.Subject['Leasehold/Fee Simple'] || '').trim();
    if (subjectPropertyRights && salesGridPropertyRights && subjectPropertyRights !== salesGridPropertyRights) {
        return { isError: true, message: `Property Rights mismatch: Subject section has '${subjectPropertyRights}', but Sales Comparison has '${salesGridPropertyRights}'.` };
    }
    return { isMatch: true };
};

export const checkAnsi = (field, text, data) => {
    if (field !== 'ANSI') return null;
    const isFha = data && data['FHA Case No.'] && String(data['FHA Case No.']).trim() !== '';
    const ansiComment = String(text || '').trim();
    // Check for forbidden code GX001
    if (ansiComment.toUpperCase().includes('GX001')) {
        return { isError: true, message: "ANSI comment must not include code 'GX001'." };
    }

    if (!isFha && !ansiComment) {
        return { isError: true, message: "ANSI comment is mandatory for conventional loans." };
    }

    return { isMatch: true };
};

export const checkCensusTract = (field, text) => {
    if (field !== 'Census Tract') return null;
    const value = String(text || '').trim();
    if (!value) return null; 

    if (!/^\d+(\.\d+)?$/.test(value)) {
        return { isError: true, message: 'Census Tract must only contain numbers.' };
    }
    return { isMatch: true };
};

export const checkFullAddressConsistency = (field, text) => {
    if (field !== 'Full Address') return null;
    const value = String(text || '').trim();
    if (value.includes('Inconsistent')) {
        return { isError: true, message: "Full Address is inconsistent." };
    }
    return { isMatch: true };
};

export const checkPresence = (field, text) => {
    const value = String(text || '').trim();
    if (!value) return { isError: true, message: `${field} is empty.` };
    
    const lowerValue = value.toLowerCase();
    if (lowerValue.includes('not present')) {
        return { isError: true, message: `${field} is marked as not present.` };
    }
    return { isMatch: true };
};
