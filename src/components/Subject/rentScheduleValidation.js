export const checkRentProximityToSubject = (field, text, allData, path, saleName) => {
    if (field !== 'Proximity to Subject' || !saleName || !saleName.startsWith('COMPARABLE NO.')) {
        return null;
    }

    const proximityText = String(text || '').trim();
    if (!proximityText) return null;

    const proximityValue = parseFloat(proximityText);
    if (isNaN(proximityValue)) return null;

    if (proximityValue > 1) {
        return { isError: true, message: `For Rent Comparables, Proximity to Subject (${proximityText}) must not be greater than 1.0 mile.` };
    }
    return { isMatch: true };
};

export const checkLeaseDates = (field, text, allData, path, saleName) => {
    if ((field !== 'Date Lease Begins' && field !== 'Date Lease Expires') || !saleName || !(saleName.startsWith('COMPARABLE') || saleName === 'Subject')) {
        return null;
    }

    const leaseBeginsStr = String(allData[saleName]?.['Date Lease Begins'] || '').trim();
    const leaseExpiresStr = String(allData[saleName]?.['Date Lease Expires'] || '').trim();

    if (!leaseBeginsStr || !leaseExpiresStr) {
        return null;
    }

    const leaseBeginsDate = new Date(leaseBeginsStr);
    const leaseExpiresDate = new Date(leaseExpiresStr);

    if (isNaN(leaseBeginsDate.getTime()) || isNaN(leaseExpiresDate.getTime())) {
        return null;
    }

    if (leaseBeginsDate >= leaseExpiresDate) {
        return { isError: true, message: `For ${saleName}, 'Date Lease Begins' (${leaseBeginsStr}) must be before 'Date Lease Expires' (${leaseExpiresStr}).` };
    }

    // Calculate the difference in days.
    const diffTime = leaseExpiresDate.getTime() - leaseBeginsDate.getTime();
    const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));

    // A one-year lease term is typically 364 or 365 days. We allow a range to account for leap years.
    if (diffDays < 364 || diffDays > 366) {
        return { isError: true, message: `For ${saleName}, the lease duration between 'Date Lease Begins' (${leaseBeginsStr}) and 'Date Lease Expires' (${leaseExpiresStr}) must be one year.` };
    }

    return { isMatch: true };
};

export const checkOtherBasement = (field, text, allData, path, saleName) => {
    if (field !== 'Other (e.g., basement, etc.)') {
        return null;
    }

    // This validation should only run for comparables, not the subject itself.
    if (!saleName || !saleName.startsWith('COMPARABLE')) {
        return null;
    }

    const subjectValue = allData?.Subject?.['Other (e.g., basement, etc.)'];
    const comparableValue = text;

    const subjectValueStr = String(subjectValue || '').trim();
    const comparableValueStr = String(comparableValue || '').trim();

    if (subjectValueStr === comparableValueStr) {
        return { isMatch: true };
    } else {
        return { isError: true, message: `Value (${comparableValueStr || 'empty'}) does not match Subject's value (${subjectValueStr || 'empty'}).` };
    }
};