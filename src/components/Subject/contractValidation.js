export const checkContractFieldsMandatory = (field, text, data, fieldPath) => {
    if (fieldPath[0] !== 'CONTRACT') return null;

    const assignmentType = String(data['Assignment Type'] || '').trim().toLowerCase();

    if (assignmentType === 'purchase transaction') {
        if (!text || String(text).trim() === '') {
            return { isError: true, message: `This field is mandatory when Assignment Type is 'Purchase Transaction'.` };
        }
    }
    return { isMatch: true };
};

export const checkContractAnalysisConsistency = (field, text, data) => {
    if (!data || !data.CONTRACT) return null;

    const analysisField = "I did did not analyze the contract for sale for the subject purchase transaction. Explain the results of the analysis of the contract for sale or why the analysis was not performed.";
    const analysisValue = String(data.CONTRACT[analysisField] || '').trim().toLowerCase();

    const analysisPerformed = analysisValue.includes('did') && !analysisValue.includes('did not');

    const fieldsToCheck = [
        { name: "Contract Price $", required: analysisPerformed },
        { name: "Date of Contract", required: analysisPerformed },
        { name: "Is property seller owner of public record?", required: analysisPerformed },
        { name: "Data Source(s)", required: analysisPerformed },
        { name: "Is there any financial assistance (loan charges, sale concessions, gift or downpayment assistance, etc.) to be paid by any party on behalf of the borrower?", required: analysisPerformed },
        { name: "If Yes, report the total dollar amount and describe the items to be paid", required: analysisPerformed && String(data.CONTRACT["Is there any financial assistance (loan charges, sale concessions, gift or downpayment assistance, etc.) to be paid by any party on behalf of the borrower?"] || '').trim().toLowerCase().includes('yes') }

    ];

    if (!analysisValue.includes('did') && !analysisValue.includes('did not')) {
        if (field === analysisField) return { isError: true, message: "This field must include 'did' or 'did not'." };
    }

    for (const f of fieldsToCheck) {
        if (field === f.name) {
            const fieldValue = String(data.CONTRACT[f.name] || '').trim();
            if (f.required && !fieldValue) {
                return { isError: true, message: `This field is required because contract analysis was performed.` };
            } else if (!f.required && fieldValue) {
                return { isError: true, message: `This field should be blank because contract analysis was not performed.` };
            }
        }
    }
    return null;
};

export const checkFinancialAssistanceInconsistency = (field, data) => {
    const assistanceQuestionField =
        'Is there any financial assistance (loan charges, sale concessions, gift or downpayment assistance, etc.) to be paid by any party on behalf of the borrower?';

    const assistanceAmountField =
        'If Yes, report the total dollar amount and describe the items to be paid';

    if (field !== assistanceQuestionField && field !== assistanceAmountField) return null;
    if (!data?.CONTRACT) return null;

    const assistanceAnswer = String(
        data.CONTRACT[assistanceQuestionField] || ''
    ).toLowerCase();

    const amountText = String(
        data.CONTRACT[assistanceAmountField] || ''
    ).trim();

    // Extract numeric value (supports $5,000 / USD 100 etc.)
    const numericMatch = amountText.replace(/,/g, '').match(/-?\d+(\.\d+)?/);
    const amountValue = numericMatch ? parseFloat(numericMatch[0]) : NaN;

    /* -------------------- YES CASE -------------------- */
    if (assistanceAnswer.includes('yes')) {
        if (amountText === '' || isNaN(amountValue) || amountValue < 0) {
            return {
                isError: true,
                message:
                    "Financial assistance is marked 'Yes', but the amount must be 0 or greater than 0."
            };
        }
    }

    /* -------------------- NO CASE -------------------- */
    if (assistanceAnswer.includes('no')) {
        // If an amount is provided, it must be 0. An empty string is also acceptable.
        if (amountText !== '' && (isNaN(amountValue) || amountValue !== 0)) {
            return {
                isError: true,
                message:
                    "Financial assistance is marked 'No', so the amount must be 0 or left blank."
            };
        }
    }

    return { isMatch: true };
};


export const checkYesNoOnly = (field, text, data, fieldConfig) => {
    if (field !== fieldConfig.name) return null;

    const value = String(text || '').trim().toLowerCase();

    if (!value) {
        return { isError: true, message: `'${field}' must be 'Yes' or 'No'.` };
    }

    if (value !== 'yes' && value !== 'no') {
        return { isError: true, message: `Invalid value for '${field}'. It must be 'Yes' or 'No'.` };
    }

    return { isMatch: true };
};