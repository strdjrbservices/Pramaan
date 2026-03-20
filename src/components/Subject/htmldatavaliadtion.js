// Shared utility to normalize strings for comparison by removing non-alphanumeric characters.
const normalize = (val) =>
    String(val || '')
        .toLowerCase()
        .replace(/[^a-z0-9]/g, '');

/**
 * A generic factory for creating validation functions that compare a PDF field value
 * against a corresponding value from the HTML comparison data.
 *
 * @param {string} htmlField - The key for the value in `allData.comparisonData`.
 * @param {string} errorFieldLabel - The label to use for the field in the error message.
 * @param {'exact' | 'includes'} [comparisonType='exact'] - The type of comparison to perform.
 * @returns {function(string, string, object): ({isError: boolean, message: string}|{isMatch: boolean}|null)} A validation function.
 */
const createHtmlComparator = (htmlField, errorFieldLabel, comparisonType = 'exact') => {
    return (field, text, allData) => {
        // The 'field' parameter (PDF field name) is not used here because the error message is generic.
        // 'text' is the value from the PDF field.

        if (!allData.comparisonData || !allData.comparisonData[htmlField]) {
            return null; // No HTML data to compare against.
        }

        const htmlValue = allData.comparisonData[htmlField];
        const pdfValue = text;

        if (!htmlValue || htmlValue === 'N/A' || !pdfValue) {
            return null; // Not enough data to perform a comparison.
        }

        const normalizedHtml = normalize(htmlValue);
        const normalizedPdf = normalize(pdfValue);

        let isMismatch = false;
        if (comparisonType === 'includes') {
            // Check if the HTML value (which can be longer) includes the PDF value.
            isMismatch = !normalizedHtml.includes(normalizedPdf);
        } else {
            // Check for an exact match.
            isMismatch = normalizedHtml !== normalizedPdf;
        }

        if (isMismatch) {
            return {
                isError: true,
                message: `${errorFieldLabel} mismatch. HTML: '${htmlValue}', PDF: '${pdfValue}'.`
            };
        }

        return { isMatch: true };
    };
};

export const checkLenderAddressInconsistency = createHtmlComparator('Client Address', 'Lender/Client Address');

export const checkSubjectLenderNameVsHtml = createHtmlComparator('Client Name', 'Lender/Client Name');

export const checkBorrowerNameVsHtml = (field, text, allData) => {
    if (!allData.comparisonData || !allData.comparisonData['Borrower (and Co-Borrower)']) {
        return null;
    }

    const htmlBorrower = allData.comparisonData['Borrower (and Co-Borrower)'];
    const pdfBorrower = text;

    if (!htmlBorrower || htmlBorrower === 'N/A' || !pdfBorrower) {
        return null;
    }

    // Normalize names by splitting into words, removing non-alphanumerics, and converting to lowercase.
    const getWords = (name) =>
        new Set(
            String(name || '')
                .toLowerCase()
                .split(/[^a-z0-9]+/) // Split on one or more non-alphanumeric characters
                .filter(Boolean)
        );

    const htmlWords = getWords(htmlBorrower);
    const pdfWords = Array.from(getWords(pdfBorrower));

    // Check if every word in the PDF borrower name exists in the HTML borrower name.
    const isMismatch = !pdfWords.every(word => htmlWords.has(word));

    if (isMismatch) {
        return {
            isError: true,
            message: `Borrower mismatch. HTML: '${htmlBorrower}', PDF: '${pdfBorrower}'.`
        };
    }

    return { isMatch: true };
};