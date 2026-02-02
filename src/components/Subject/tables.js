import React from 'react';
import {
    TableContainer, Table, TableHead, TableRow, TableCell, TableBody, Paper,
    Box, Typography, Alert
} from '@mui/material';
import {
    CheckCircleOutline as CheckCircleOutlineIcon, ErrorOutline as ErrorOutlineIcon
} from '@mui/icons-material';
import { EditableField } from './FormComponents';
import { checkCondoCoopProjectsTableFields } from './form1073Validation';

export const ComparableAddressConsistency = ({ data, comparableSales, extractionAttempted, onDataChange, editingField, setEditingField, isEditable, allData }) => {
    return (
        <div id="comparable-address-consistency-section" style={{}} className="card shadow ">
            <div className="card-header CAR1 bg-dark text-white" style={{ position: 'sticky', top: 0, zIndex: 10 }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <strong style={{ flexGrow: 1, textAlign: 'center' }}>Comparable Address Consistency Check</strong>
                </div>
            </div>
            <div className="card-body p-0 table-container">
                <table className="table table-hover table-striped mb-0">
                    <thead className="table-light">
                        <tr>
                            <th>Comparable Sale #</th>
                            <th>Sales Comparison Approach Address</th>
                            <th>Location Map Address</th>
                            <th>Photo Section Address</th>
                            <th>is label correct?</th>
                            <th>duplicate photo?</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {comparableSales.map((sale, index) => {
                            const compNum = index + 1;
                            const salesGridAddress = data[sale]?.Address || '';
                            const locationMapAddress = data[`Location Map Address ${compNum}`] || '';
                            const photoAddress = data[`Comparable Photo Address ${compNum}`] || '';
                            const matchingPhoto = data[`is label correct? ${compNum}`] || '';
                            const duplicatePhoto = data[`duplicate photo? ${compNum}`] || '';

                            const getFirstThreeWords = (str) => str.split(/\s+/).slice(0, 3).join(' ').toLowerCase();

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

                            const isMissingSalesGrid = extractionAttempted && !salesGridAddress;
                            const isMissingLocationMap = extractionAttempted && !locationMapAddress;
                            const isMissingPhoto = extractionAttempted && !photoAddress;

                            return (
                                <tr key={sale}>
                                    <td style={{ fontWeight: 'bold' }}>{`Comparable Sale #${compNum}`}</td>
                                    <td style={isMissingSalesGrid ? { border: '2px solid red' } : {}}>
                                        <EditableField
                                            fieldPath={[sale, 'Address']}
                                            value={salesGridAddress}
                                            onDataChange={onDataChange}
                                            editingField={editingField}
                                            setEditingField={setEditingField} allData={allData}
                                            isMissing={isMissingSalesGrid} isEditable={isEditable}
                                        // isEditable={true}
                                        />
                                    </td>
                                    <td style={isMissingLocationMap ? { border: '2px solid red' } : {}}>
                                        <EditableField
                                            fieldPath={[`Location Map Address ${compNum}`]}
                                            value={locationMapAddress}
                                            onDataChange={onDataChange}
                                            editingField={editingField}
                                            setEditingField={setEditingField}
                                            isMissing={isMissingLocationMap} allData={allData}
                                            isEditable={isEditable}
                                        />
                                    </td>
                                    <td style={isMissingPhoto ? { border: '2px solid red' } : {}}>
                                        <EditableField
                                            fieldPath={[`Comparable Photo Address ${compNum}`]}
                                            value={photoAddress}
                                            onDataChange={onDataChange}
                                            editingField={editingField}
                                            setEditingField={setEditingField}
                                            isMissing={isMissingPhoto} allData={allData}
                                            isEditable={isEditable}
                                        />
                                    </td>
                                    <td>
                                        <EditableField
                                            fieldPath={[`is label correct? ${compNum}`]}
                                            value={matchingPhoto}
                                            onDataChange={onDataChange}
                                            editingField={editingField}
                                            setEditingField={setEditingField} allData={allData}
                                            isEditable={isEditable} />
                                    </td>
                                    <td>
                                        <EditableField
                                            fieldPath={[`duplicate photo? ${compNum}`]}
                                            value={duplicatePhoto}
                                            onDataChange={onDataChange}
                                            editingField={editingField}
                                            setEditingField={setEditingField} allData={allData}
                                            isEditable={isEditable} />
                                    </td>
                                    <td style={{ textAlign: 'center' }}>
                                        {validAddresses.length > 0 && (isConsistent ? <CheckCircleOutlineIcon style={{ color: 'green' }} /> : <ErrorOutlineIcon style={{ color: 'red' }} />)}
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export const MarketConditionsTable = ({ data, marketConditionsRows, marketConditionsFields, extractionAttempted, onDataChange, editingField, setEditingField, isEditable, allData }) => {
    const timeframes = ["Prior 7-12 Months", "Prior 4-6 Months", "Current-3 Months", "Overall Trend"];

    const getTableValue = (fullLabel, timeframe) => {
        const marketData = data?.MARKET_CONDITIONS ?? {};
        const key = `${fullLabel} (${timeframe})`;
        return marketData[key] ?? marketData[fullLabel] ?? '';
    };

    return (
        <TableContainer component={Paper} sx={{ marginTop: '20px', marginBottom: '20px' }}>
            {/* <div className="card-header CAR1 bg-warning text-dark" style={{ position: 'sticky', top: 0, zIndex: 10 }}><strong>Market Conditions Addendum</strong></div> */}
            <Table className="table mb-20" style={{ marginTop: '20px' }} size="small" aria-label="market-conditions-table">
                <TableHead style={{}}>
                    <TableRow>
                        <TableCell>Inventory Analysis</TableCell>
                        {timeframes.map(tf => <TableCell key={tf} align="center">{tf}</TableCell>)}
                    </TableRow>
                </TableHead>
                <TableBody>
                    {marketConditionsRows.map(row => (
                        <TableRow key={row.label}>
                            <TableCell component="th" scope="row">
                                {row.label}
                            </TableCell>
                            {timeframes.map(tf => {
                                const value = getTableValue(row.fullLabel, tf) || getTableValue(row.label, tf);
                                const style = {};
                                if (extractionAttempted && !value) {
                                    style.border = '2px solid red';
                                }
                                return <TableCell key={tf} align="center" style={style}>{value}</TableCell>
                            })}
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
            <Box sx={{ p: 2 }}>
                {marketConditionsFields.map(field => {
                    // Render only fields that are not part of the table
                    if (marketConditionsRows.some(row => row.fullLabel.includes(field) || field.includes(row.fullLabel))) return null;

                    return (
                        <Box key={field} sx={{ mb: 2 }}>
                            <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 'bold' }}>
                                {field}
                            </Typography>
                            <EditableField
                                fieldPath={['MARKET_CONDITIONS', field]}
                                value={data?.MARKET_CONDITIONS?.[field] || ''}
                                onDataChange={onDataChange}
                                editingField={editingField}
                                setEditingField={setEditingField} allData={allData}
                                isEditable={isEditable}
                            />
                        </Box>
                    );
                })}
            </Box>
        </TableContainer>
    );
};

export const CondoCoopProjectsTable = ({ id, title, data, onDataChange, editingField, setEditingField, isEditable, condoCoopProjectsRows, condoCoopProjectsFields, extractionAttempted, allData }) => {
    const timeframes = ["Prior 7–12 Months", "Prior 4–6 Months", "Current – 3 Months", "Overall Trend"];

    const getTableValue = (fullLabel, timeframe) => {
        const projectData = data?.CONDO_COOP_PROJECTS ?? data ?? {};
        const key = `${fullLabel} (${timeframe})`;
        return projectData[key] ?? '';
    };

    return (
        <div id={id} className="card shadow mb-4">
            <div className="card-header CAR1 bg-primary text-white" style={{ position: 'sticky', top: 0, zIndex: 10 }}>
                <strong>{title}</strong>
            </div>
            <div className="card-body p-0 table-container">
                <TableContainer component={Paper}>
                    <Table size="small" aria-label="condo-coop-projects-table">
                        <TableHead>
                            <TableRow>
                                <TableCell>Subject Project Data</TableCell>
                                {timeframes.map(tf => <TableCell key={tf} align="center">{tf}</TableCell>)}
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {condoCoopProjectsRows.map(row => (
                                <TableRow key={row.label}>
                                    <TableCell component="th" scope="row">{row.label}</TableCell>
                                    {timeframes.map(tf => {
                                        const fieldName = `${row.fullLabel} (${tf})`;
                                        const value = getTableValue(row.fullLabel, tf);
                                        const isMissing = extractionAttempted && !value;
                                        return (
                                            <TableCell key={tf} align="center" style={isMissing ? { border: '2px solid red' } : {}}>
                                                <EditableField fieldPath={['CONDO_COOP_PROJECTS', fieldName]} value={value} onDataChange={onDataChange} editingField={editingField} setEditingField={setEditingField} isEditable={isEditable} isMissing={isMissing} allData={allData} customValidation={checkCondoCoopProjectsTableFields} />
                                            </TableCell>
                                        );
                                    })}
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </div>
        </div>
    );
};

export const SalesComparisonSection = ({ data, salesGridRows, comparableSales, extractionAttempted, handleDataChange, editingField, setEditingField, formType, comparisonData, getComparisonStyle, isEditable, allData }) => {
    const getSubjectValue = (row) => {
        const subjectData = data.Subject || {}; let value = subjectData[row.valueKey] ?? subjectData[row.subjectValueKey] ?? data[row.subjectValueKey] ?? data[row.valueKey] ?? ''; return value;
    };

    return (
        <div id="sales-comparison" className="card shadow mb-4">
            <div className="card-header CAR1 bg-dark text-white" style={{ position: 'sticky', top: 0, zIndex: 10 }}>

            </div>
            <div className="card-body p-0 table-container" style={{ overflowX: 'auto' }}>
                <table className="table table-hover table-striped mb-0 sales-comparison-table">
                    <thead className="table-light">
                        <tr>
                            <th style={{ minWidth: '200px' }}>Feature</th>
                            <th style={{ minWidth: '200px' }}>Subject</th>
                            {comparableSales.map((sale, index) => (
                                <th key={sale} style={{ minWidth: '200px' }}>{`Comparable Sale #${index + 1}`}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {salesGridRows.flatMap((row, rowIndex) => {
                            const rows = [];
                            const subjectValue = getSubjectValue(row);

                            rows.push(
                                <tr key={`${row.label}-${rowIndex}`}>
                                    <td style={{ fontWeight: 'bold' }}>{row.label}</td>
                                    <td>
                                        {row.isAdjustmentOnly ? '' : (
                                            <EditableField
                                                fieldPath={['Subject', row.subjectValueKey || row.valueKey]}
                                                value={subjectValue}
                                                onDataChange={handleDataChange}
                                                isEditable={isEditable} allData={allData}
                                            />
                                        )}
                                    </td>
                                    {comparableSales.map((sale, compIndex) => {
                                        const compData = data[sale] || {};
                                        const value = compData[row.valueKey] || '';
                                        const isMissing = extractionAttempted && !value && !row.isAdjustmentOnly;
                                        return (
                                            <td key={`${sale}-${row.label}`} style={isMissing ? { border: '2px solid red' } : {}}>
                                                {row.isAdjustmentOnly ? '' : (
                                                    <EditableField
                                                        fieldPath={[sale, row.valueKey]}
                                                        value={value}
                                                        onDataChange={handleDataChange}
                                                        editingField={editingField}
                                                        setEditingField={setEditingField}
                                                        isEditable={isEditable} allData={allData} />
                                                )}
                                            </td>
                                        );
                                    })}
                                </tr>
                            );

                            if (row.adjustmentKey) {
                                rows.push(
                                    <tr key={`${row.label}-adj-${rowIndex}`} className="adjustment-row">
                                        <td style={{ paddingLeft: '2rem' }}>
                                            <i>Adjustment</i>
                                        </td>
                                        <td>
                                            {/* Subject adjustment if any - usually none */}
                                        </td>
                                        {comparableSales.map((sale, compIndex) => {
                                            const compData = data[sale] || {};
                                            const adjValue = compData[row.adjustmentKey] || '';
                                            const isMissing = extractionAttempted && !adjValue;
                                            return (
                                                <td key={`${sale}-${row.adjustmentKey}`} style={isMissing ? { border: '2px solid red' } : {}}>
                                                    <EditableField
                                                        fieldPath={[sale, row.adjustmentKey]}
                                                        value={adjValue}
                                                        onDataChange={handleDataChange}
                                                        editingField={editingField}
                                                        setEditingField={setEditingField}
                                                        isEditable={isEditable}
                                                        allData={allData} />
                                                </td>
                                            );
                                        })}
                                    </tr>
                                );
                            }

                            return rows;
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export const ComparisonResultTable = ({ result }) => {
    if (!result || result.length === 0) {
        return <Alert severity="success" sx={{ mt: 2 }}>No differences found.</Alert>;
    }
    return (
        <TableContainer component={Paper} sx={{ mt: 2 }}>
            <Table stickyHeader aria-label="comparison results table">
                <TableHead>
                    <TableRow>
                        <TableCell sx={{ fontWeight: 'bold' }}>Field</TableCell>
                        <TableCell sx={{ fontWeight: 'bold' }}>Value from HTML</TableCell>
                        <TableCell sx={{ fontWeight: 'bold' }}>Value from PDF</TableCell>
                        <TableCell sx={{ fontWeight: 'bold' }} align="center">Status</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {result.map((item, index) => (
                        <TableRow key={index} hover>
                            <TableCell>{item.field}</TableCell>
                            <TableCell>{item.html_value}</TableCell>
                            <TableCell>{item.pdf_value}</TableCell>
                            <TableCell align="center">
                                {item.status === 'Match' ? (
                                    <CheckCircleOutlineIcon color="success" />
                                ) : (
                                    <ErrorOutlineIcon color="error" />
                                )}
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
};