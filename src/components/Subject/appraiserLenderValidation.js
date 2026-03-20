const checkNotBlank = (field, text, fieldName) => {
    if (field === fieldName) {
        if (!text || String(text).trim() === '') {
            return { isError: true, message: `'${fieldName}' should not be blank.` };
        }
        return { isMatch: true };
    }
    return null;
};

export const checkLenderAddressInconsistency = (field, text, data) => {
    const relevantFields = ['Address (Lender/Client)', 'Lender/Client Company Address'];
    if (!relevantFields.includes(field) || !data) return null;

    const normalize = (str) => {
        let s = String(str || '').toLowerCase();
        s = s.replace(/\bstreet\b/g, 'st')
            .replace(/\bavenue\b/g, 'ave')
            .replace(/\broad\b/g, 'rd')
            .replace(/\bdrive\b/g, 'dr')
            .replace(/\bboulevard\b/g, 'blvd')
            .replace(/\blane\b/g, 'ln')
            .replace(/\bplace\b/g, 'pl')
            .replace(/\bcircle\b/g, 'cir')
            .replace(/\bcourt\b/g, 'ct')
            .replace(/\bsuite\b/g, 'ste');
        return s.replace(/[\s.,#\-']/g, '');
    };

    const subjectLenderAddress = String(data.Subject?.['Address (Lender/Client)'] || '').trim();
    const appraiserLenderAddress = String(data.CERTIFICATION?.['Lender/Client Company Address'] || '').trim();

    if (subjectLenderAddress && appraiserLenderAddress) {
        const normSubject = normalize(subjectLenderAddress);
        const normAppraiser = normalize(appraiserLenderAddress);

        if (normSubject !== normAppraiser && !normSubject.includes(normAppraiser) && !normAppraiser.includes(normSubject)) {
            return { isError: true, message: `Lender Address mismatch: Subject section has '${subjectLenderAddress}', but Appraiser section has '${appraiserLenderAddress}'.` };
        }
    }
    return { isMatch: true };
};

export const checkClientNameHtmlConsistency = (field, text, allData) => {
    if (field === 'LENDER/CLIENT Name') {
        const certificationClientName = String(text || '').trim();
        const htmlClientName = String(allData?.comparisonData?.['Client Name'] || '').trim();

        if (htmlClientName && certificationClientName && htmlClientName.toLowerCase() !== certificationClientName.toLowerCase()) {
            return {
                isError: true,
                message: `Client Name mismatch. HTML: '${htmlClientName}', Report: '${certificationClientName}'.`
            };
        }
        return { isMatch: true };
    } else if (field === 'Client Name') {
        const htmlClientName = String(text || '').trim();
        const certLenderClientName = String(allData?.CERTIFICATION?.['Lender/Client Company Name'] || allData?.CERTIFICATION?.['Lender/Client Name'] || allData?.Subject?.['Lender/Client'] || '').trim();

        if (!htmlClientName || !certLenderClientName || htmlClientName === 'N/A') return null;

        if (htmlClientName.toLowerCase() !== certLenderClientName.toLowerCase()) {
            return {
                isError: true,
                message: `Client Name mismatch. HTML: '${htmlClientName}', Report: '${certLenderClientName}'.`
            };
        }
        return { isMatch: true };
    }
    return null;
};

export const checkClientAddressHtmlConsistency = (field, text, allData) => {
    const normalize = (str) => {
        let s = String(str || '').toLowerCase();
        s = s.replace(/\bstreet\b/g, 'st')
            .replace(/\bavenue\b/g, 'ave')
            .replace(/\broad\b/g, 'rd')
            .replace(/\bdrive\b/g, 'dr')
            .replace(/\bboulevard\b/g, 'blvd')
            .replace(/\blane\b/g, 'ln')
            .replace(/\bplace\b/g, 'pl')
            .replace(/\bcircle\b/g, 'cir')
            .replace(/\bcourt\b/g, 'ct')
            .replace(/\bsuite\b/g, 'ste');
        return s.replace(/[\s.,#\-']/g, '');
    };

    if (field === 'Address (Lender/Client)') {
        if (!allData.comparisonData || !allData.comparisonData['Client Address'] || allData.comparisonData['Client Address'] === 'N/A') {
            return null;
        }

        const certLenderAddress = String(text || '').trim();
        const htmlClientAddress = String(allData.comparisonData['Client Address'] || '').trim();

        if (!htmlClientAddress || !certLenderAddress) {
            return null;
        }

        const normCert = normalize(certLenderAddress);
        const normHtml = normalize(htmlClientAddress);

        if (normHtml !== normCert && !normHtml.includes(normCert) && !normCert.includes(normHtml)) {
            return {
                isError: true,
                message: `Client Address mismatch. HTML: '${htmlClientAddress}', Report: '${certLenderAddress}'.`
            };
        }
        return { isMatch: true };
    } else if (field === 'Client Address') {
        const htmlClientAddress = String(text || '').trim();
        const certLenderAddress = String(allData?.Subject?.['Address (Lender/Client)'] || allData?.CERTIFICATION?.['Lender/Client Company Address'] || '').trim();

        if (!htmlClientAddress || !certLenderAddress || htmlClientAddress === 'N/A') {
            return null;
        }

        const normCert = normalize(certLenderAddress);
        const normHtml = normalize(htmlClientAddress);

        if (normHtml !== normCert && !normHtml.includes(normCert) && !normCert.includes(normHtml)) {
            return {
                isError: true,
                message: `Client Address mismatch. HTML: '${htmlClientAddress}', Report: '${certLenderAddress}'.`
            };
        }
        return { isMatch: true };
    }
    return null;
};

export const checkBorrowerHtmlConsistency = (field, text, allData) => {
    const normalize = (str) =>
        String(str || '')
            .toLowerCase()
            .replace(/&/g, 'and')
            .replace(/[.,]/g, '')
            .replace(/\s+/g, ' ')
            .trim();

    if (field === 'Borrower') {
        if (!allData.comparisonData || !allData.comparisonData['Borrower (and Co-Borrower)'] || allData.comparisonData['Borrower (and Co-Borrower)'] === 'N/A') {
            return null;
        }

        const reportBorrower = String(text || '').trim();
        const htmlBorrower = String(allData.comparisonData['Borrower (and Co-Borrower)'] || '').trim();

        if (!htmlBorrower || !reportBorrower) {
            return null;
        }

        const normHtml = normalize(htmlBorrower);
        const normReport = normalize(reportBorrower);

        if (!normHtml.includes(normReport) && !normReport.includes(normHtml)) {
            return {
                isError: true,
                message: `Borrower mismatch. HTML: '${htmlBorrower}', Report: '${reportBorrower}'.`
            };
        }
        return { isMatch: true };
    } else if (field === 'Borrower (and Co-Borrower)') {
        const htmlBorrower = String(text || '').trim();
        const reportBorrower = String(allData?.Subject?.['Borrower'] || '').trim();

        if (!htmlBorrower || !reportBorrower || htmlBorrower === 'N/A') return null;

        const normHtml = normalize(htmlBorrower);
        const normReport = normalize(reportBorrower);

        if (!normHtml.includes(normReport) && !normReport.includes(normHtml)) {
            return {
                isError: true,
                message: `Borrower mismatch. HTML: '${htmlBorrower}', Report: '${reportBorrower}'.`
            };
        }
        return { isMatch: true };
    }
    return null;
};
export const checkPropertyAddressHtmlConsistency = (field, text, allData, fieldPath) => {
    // This check is for the 'Property Address' field in the main subject section, which has a short fieldPath.
    if (field === 'Property Address' && fieldPath?.length === 1) {
        const reportAddress = String(text || '').trim();
        const htmlAddress = String(allData?.comparisonData?.['Property Address'] || '').trim();

        if (!htmlAddress || !reportAddress || htmlAddress === 'N/A') {
            return null; // Not enough data to compare
        }

        const normalize = (str) => {
            let s = String(str || '').toLowerCase();
            s = s.replace(/\bstreet\b/g, 'st')
                .replace(/\bavenue\b/g, 'ave')
                .replace(/\broad\b/g, 'rd')
                .replace(/\bdrive\b/g, 'dr')
                .replace(/\bboulevard\b/g, 'blvd')
                .replace(/\blane\b/g, 'ln')
                .replace(/\bplace\b/g, 'pl')
                .replace(/\bcircle\b/g, 'cir')
                .replace(/\bcourt\b/g, 'ct');
            return s.replace(/[\s.,#\-']/g, '');
        };

        const normReport = normalize(reportAddress);
        const normHtml = normalize(htmlAddress);

        if (normReport !== normHtml && !normHtml.includes(normReport) && !normReport.includes(normHtml)) {
            return { isError: true, message: `Property Address mismatch. HTML: '${htmlAddress}', Report: '${reportAddress}'.` };
        }
        return { isMatch: true };
    }
    return null;
};
export const checkAppraiserFieldsNotBlank = (field, text) => {
    const fieldsToCheck = [
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
        "Lender/Client Email Address"
    ];
    return checkNotBlank(field, text, fieldsToCheck.find(f => f === field));
};

export const checkLenderNameInconsistency = (field, text, data) => {
    if (field !== 'Lender/Client' || !data) return null;
    const subjectLenderName = String(text || '').trim();
    const appraiserLenderName = String(data.CERTIFICATION?.['Lender/Client Company Name'] || '').trim();
    if (subjectLenderName && appraiserLenderName && subjectLenderName !== appraiserLenderName) {
        return { isError: true, message: `Lender/Client mismatch: Subject section has '${subjectLenderName}', but Appraiser section has '${appraiserLenderName}'.` };
    }
    return { isMatch: true };
};

export const checkLicenseNumberConsistency = (field, text, data) => {
    if (field !== 'LICENSE/REGISTRATION/CERTIFICATION #') return null;

    const licenseNumber = String(text || '').trim();
    if (!licenseNumber) return null; // Don't validate if blank, other validations handle that.

    const certificationData = data?.CERTIFICATION;
    if (!certificationData) return null;

    const stateCert = String(certificationData['State Certification #'] || '').trim();
    const stateLicense = String(certificationData['or State License #'] || '').trim();
    const otherLicense = String(certificationData['or Other (describe)'] || '').trim();
    const stateNumber = String(certificationData['State #'] || '').trim();

    const possibleMatches = [stateCert, stateLicense, otherLicense, stateNumber].filter(Boolean);

    if (possibleMatches.length > 0 && !possibleMatches.includes(licenseNumber)) {
        return { isError: true, message: `License number mismatch. Expected to match one of: State Certification #, State License #, Other, or State #.` };
    }

    return { isMatch: true };
};

export const checkAppraiserVendorNameConsistency = (field, text, allData) => {
    if (field === 'Name') {
        const vendorName = allData?.comparisonData?.['Assigned to Vendor(s)'];
        const appraiserName = String(text || '').trim();

        if (!vendorName || vendorName === 'N/A' || !appraiserName) {
            return null;
        }

        const normalize = (str) =>
            String(str || '')
                .toLowerCase()
                .replace(/&/g, 'and')
                .replace(/[.,]/g, '')
                .replace(/\s+/g, ' ')
                .trim();

        const normVendor = normalize(vendorName);
        const normAppraiser = normalize(appraiserName);

        if (!normVendor.includes(normAppraiser) && !normAppraiser.includes(normVendor)) {
            return {
                isError: true,
                message: `Appraiser Name mismatch. HTML (Assigned to Vendor): '${vendorName}', Report: '${appraiserName}'.`
            };
        }
        return { isMatch: true };
    }
    return null;
};

export const checkDateGreaterThanToday = (field, text) => {
    const fieldsToCheck = ['Policy Period To', 'License Vaild To'];
    if (!fieldsToCheck.includes(field)) return null;

    if (!text || String(text).trim() === '') {
        return null; // Don't validate if blank, other validations can handle that.
    }

    const inputDate = new Date(text);
    if (isNaN(inputDate.getTime())) {
        return { isError: true, message: `Invalid date format for '${field}'.` };
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0); // Set time to midnight to compare dates only

    if (inputDate <= today) {
        return { isError: true, message: `'${field}' must be a future date.` };
    }

    return { isMatch: true };
};