import React from 'react';
import { EditableField } from './FormComponents';
import { Tooltip, IconButton, Paper, Box, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import LibraryBooksIcon from '@mui/icons-material/LibraryBooks';


const SalesComparisonSection = ({
  data,
  extractionAttempted,
  handleDataChange,
  editingField,
  setEditingField,
  salesGridRows,
  comparableSales,
  salesHistoryFields,
  salesComparisonAdditionalInfoFields,
  formType,
  isEditable,
  allData,
  manualValidations,
  handleManualValidation,
  onRevisionButtonClick,
  revisionHandlers
}) => {

  return (
    <>
      <Paper id="sales-comparison" elevation={3} sx={{ mb: 4, mt: 4, borderRadius: 2, overflow: 'hidden' }}>
        <Box sx={{ bgcolor: 'primary.main', color: 'white', px: 2, py: 1.5, display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'sticky', top: 0, zIndex: 10 }}>
            <Typography variant="subtitle1" fontWeight="bold">Sales Comparison Approach</Typography>
            {onRevisionButtonClick && (
              <Tooltip title="Revision Language">
                <IconButton onClick={onRevisionButtonClick} size="small" sx={{ color: 'white' }}><LibraryBooksIcon /></IconButton>
              </Tooltip>
            )}
        </Box>
        <TableContainer>
          <Table size="small" aria-label="sales comparison table" className="sales-comparison-table">
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: 'bold', minWidth: '200px', backgroundColor: 'action.hover' }}>Feature</TableCell>
                <TableCell sx={{ fontWeight: 'bold', minWidth: '200px', backgroundColor: 'action.hover' }}>Subject</TableCell>
                {comparableSales.map((sale, idx) => (
                  <TableCell key={idx} sx={{ fontWeight: 'bold', minWidth: '200px', backgroundColor: 'action.hover' }}>{sale}</TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {salesGridRows.map((row, idx) => {
                const isHighlighted = row.label === 'Date of Sale/Time';
                // const rowClass = isHighlighted ? 'highlighted-field' : '';

                // let mostCommonSource = null;
                // let verificationSourcesInconsistent = false;
                if (row.label === "Verification Source(s)") {
                  const subjectSource = data.Subject?.[row.valueKey];
                  const sources = [subjectSource, ...comparableSales.map(sale => data[sale]?.[row.valueKey])].filter(Boolean);
                  if (sources.length > 0) {
                    // const sourceCounts = sources.reduce((acc, source) => {
                    //   acc[source] = (acc[source] || 0) + 1;
                    //   return acc;
                    // }, {});
                    // mostCommonSource = Object.keys(sourceCounts).reduce((a, b) => sourceCounts[a] > sourceCounts[b] ? a : b);
                    const uniqueSources = new Set(sources);
                    if (uniqueSources.size > 1) {
                      // verificationSourcesInconsistent = true;
                    }
                  }
                }

                let mostCommonLeasehold = null;
                let leaseholdInconsistent = false;
                if (row.label === "Leasehold/Fee Simple") {
                  const allValues = [data.Subject?.[row.valueKey], ...comparableSales.map(sale => data[sale]?.[row.valueKey])].filter(Boolean);
                  if (allValues.length > 0) {
                    const valueCounts = allValues.reduce((acc, value) => {
                      acc[value] = (acc[value] || 0) + 1;
                      return acc;
                    }, {});
                    mostCommonLeasehold = Object.keys(valueCounts).reduce((a, b) => valueCounts[a] > valueCounts[b] ? a : b);
                    const uniqueValues = new Set(allValues);
                    if (uniqueValues.size > 1) leaseholdInconsistent = true;
                  }
                }

                const subjectValue = row.label === "Verification Source(s)"
                  ? (comparableSales.map(sale => data[sale]?.[row.valueKey]).find(Boolean) || data.Subject?.[row.valueKey] || '')
                  : (row.subjectValueKey ? data[row.subjectValueKey] || '' : data.Subject?.[row.valueKey] || '');

                const subjectStyle = {};
                if (extractionAttempted && ((row.subjectValueKey && !data[row.subjectValueKey]) || (!row.subjectValueKey && (!data.Subject || !data.Subject[row.valueKey])))) {
                  subjectStyle.border = '2px solid red';
                }
                const subjectLeaseholdValue = data.Subject?.[row.valueKey] || '';
                if (leaseholdInconsistent && subjectLeaseholdValue && subjectLeaseholdValue !== mostCommonLeasehold) {
                  subjectStyle.backgroundColor = 'red';
                }

                return (
                  <TableRow key={idx} sx={isHighlighted ? { backgroundColor: 'action.selected' } : {}}>
                    <TableCell sx={{ fontWeight: 'medium', borderRight: '1px solid rgba(224, 224, 224, 1)' }}>{row.label}</TableCell>
                    <TableCell sx={{ borderRight: '1px solid rgba(224, 224, 224, 1)', ...subjectStyle }}>
                      {data.Subject && !row.isAdjustmentOnly && (
                        <EditableField
                          fieldPath={row.subjectValueKey ? [row.subjectValueKey] : ['Subject', row.valueKey]}
                          value={subjectValue}
                          onDataChange={handleDataChange} editingField={editingField} setEditingField={setEditingField}
                          isMissing={extractionAttempted && (row.subjectValueKey ? !data[row.subjectValueKey] : !data.Subject?.[row.valueKey])}
                          isEditable={true}
                          allData={allData}
                          saleName={'Subject'}
                          manualValidations={manualValidations}
                          handleManualValidation={handleManualValidation}
                        />
                      )}
                      {data.Subject && row.adjustmentKey && (
                        <EditableField
                          fieldPath={['Subject', row.adjustmentKey]} value={data.Subject[row.adjustmentKey] || ''}
                          onDataChange={handleDataChange} editingField={editingField} setEditingField={setEditingField}
                          isMissing={extractionAttempted && (!data.Subject[row.adjustmentKey] || data.Subject[row.adjustmentKey] === '')}
                          isEditable={true} isAdjustment={true}
                          manualValidations={manualValidations}
                          handleManualValidation={handleManualValidation}
                        />
                      )}
                    </TableCell>
                    {comparableSales.map((sale, cidx) => {
                      const compValue = data[sale]?.[row.valueKey] || '';
                      const adjValue = data[sale]?.[row.adjustmentKey] || '';
                      const cellStyle = {};
                      if (extractionAttempted && !row.isAdjustmentOnly && (!data[sale] || (compValue === undefined || compValue === ''))) {
                        cellStyle.border = '2px solid red';
                      }

                      return (
                        <TableCell key={cidx} sx={{ borderRight: '1px solid rgba(224, 224, 224, 1)', ...cellStyle }}>
                          {!row.isAdjustmentOnly && (
                            <EditableField
                              fieldPath={[sale, row.valueKey]}
                              value={compValue}
                              onDataChange={handleDataChange} editingField={editingField} setEditingField={setEditingField}
                              isMissing={extractionAttempted && (!compValue || compValue === '')}
                              isEditable={true}
                              allData={data}
                              saleName={sale}
                              manualValidations={manualValidations}
                              handleManualValidation={handleManualValidation}
                            />
                          )}
                          {row.adjustmentKey && (
                            <EditableField
                              fieldPath={[sale, row.adjustmentKey]}
                              value={adjValue}
                              onDataChange={handleDataChange} editingField={editingField} setEditingField={setEditingField}
                              isMissing={extractionAttempted && (!adjValue || adjValue === '')}
                              isEditable={true}
                              isAdjustment={true}
                              allData={data}
                              saleName={sale}
                              manualValidations={manualValidations}
                              handleManualValidation={handleManualValidation}
                            />
                          )}
                        </TableCell>
                      );
                    })}
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      <Paper elevation={3} sx={{ mb: 4, borderRadius: 2, overflow: 'hidden' }}>
        <Box sx={{ bgcolor: 'info.main', color: 'white', px: 2, py: 1.5, position: 'sticky', top: 0, zIndex: 10 }}>
          <Typography variant="subtitle1" fontWeight="bold">Sales or Transfer History</Typography>
        </Box>
        <TableContainer>
          <Table size="small">
            <TableBody>
              {salesComparisonAdditionalInfoFields.map((field, index) => (
                <TableRow key={index} hover>
                  <TableCell sx={{ width: '50%' }}>{field}</TableCell>
                  <TableCell>
                    <EditableField
                      fieldPath={[field]}
                      value={data[field] || ''}
                      onDataChange={(path, val) => handleDataChange(path, val)} editingField={editingField} setEditingField={setEditingField}
                      isMissing={extractionAttempted && (!data[field] || data[field] === '')}
                      allData={allData}
                      isEditable={true}
                      manualValidations={manualValidations}
                      handleManualValidation={handleManualValidation}
                      revisionHandlers={revisionHandlers}
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>


      <Paper id="prior-sale-history-grid" elevation={3} sx={{ mb: 4, mt: 4, borderRadius: 2, overflow: 'hidden' }}>
        <Box sx={{ bgcolor: 'grey.900', color: 'white', px: 2, py: 1.5, position: 'sticky', top: 0, zIndex: 10 }}>
          {/* <Typography variant="subtitle1" fontWeight="bold">Prior Sale History of Subject and Comparables</Typography> */}
        </Box>
        <TableContainer>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: 'bold', backgroundColor: 'action.hover' }}>Feature</TableCell>
                <TableCell sx={{ fontWeight: 'bold', backgroundColor: 'action.hover' }}>Subject</TableCell>
                {comparableSales.map((sale, idx) => (
                  <TableCell key={idx} sx={{ fontWeight: 'bold', backgroundColor: 'action.hover' }}>{sale}</TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {salesHistoryFields.map((feature, idx) => (
                <TableRow key={idx} hover>
                  <TableCell sx={{ fontWeight: 'medium' }}>{feature}</TableCell>
                  <TableCell>
                    <EditableField
                      fieldPath={['Subject', feature]}
                      value={data.Subject?.[feature] || ''}
                      onDataChange={handleDataChange} editingField={editingField} setEditingField={setEditingField}
                      isMissing={extractionAttempted && (!data.Subject?.[feature] || data.Subject?.[feature] === '')}
                      allData={allData}
                      isEditable={true}
                      manualValidations={manualValidations}
                      handleManualValidation={handleManualValidation}
                    />
                  </TableCell>
                  {comparableSales.map((sale, cidx) => (
                    <TableCell key={cidx}>
                      <EditableField
                        fieldPath={[sale, feature]}
                        value={data[sale]?.[feature] || ''}
                        onDataChange={handleDataChange} editingField={editingField} setEditingField={setEditingField}
                        isMissing={extractionAttempted && (!data[sale]?.[feature] || data[sale]?.[feature] === '')}
                        allData={allData}
                        isEditable={true}
                        manualValidations={manualValidations}
                        handleManualValidation={handleManualValidation}
                      />
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </>
  );
};

export default SalesComparisonSection;