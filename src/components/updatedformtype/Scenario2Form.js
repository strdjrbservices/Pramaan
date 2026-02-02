// c:\all in one\onlinedjrb\src\components\updatedformtype\Scenario2Form.js
import React from 'react';
import { GridInfoCard } from '../Subject/FormComponents';
import { SalesComparisonSection } from '../Subject/tables';
import {
    valueConditionFields,
    assignmentFields,
    combinedSiteFields,
    dwellingExteriorFields,
    unitInteriorFields,
    amenitiesStorageFields,
    overallQualityHbuMarketFields,
    projectInformationListingsFields,
    salesComparisonAdjustmentsSummaryFields,
    reconciliationAppraisalSummaryFields,
    certificationFields,
    salesGridRows,
    comparableSales
} from './Scenario2Data';

const Scenario2Form = ({
    extractedData,
    handleDataChange,
    handleSalesGridDataChange,
    editingField,
    setEditingField
}) => {
    return (
        <>
            <GridInfoCard
                id="value-condition"
                title="Summary"
                fields={valueConditionFields}
                data={extractedData}
                cardClass="bg-primary"
                extractionAttempted={Object.keys(extractedData).length > 0}
                onDataChange={handleDataChange}
                editingField={editingField}
                setEditingField={setEditingField}
                isEditable={true}
                allData={extractedData}
            />
            <GridInfoCard
                id="assignment-details"
                title="Assignment & Property Details"
                fields={assignmentFields}
                data={extractedData}
                cardClass="bg-primary"
                extractionAttempted={Object.keys(extractedData).length > 0}
                onDataChange={handleDataChange}
                editingField={editingField}
                setEditingField={setEditingField}
                isEditable={true}
                allData={extractedData}
            />

            <GridInfoCard
                id="site-details"
                title="Site Details"
                fields={combinedSiteFields}
                data={extractedData}
                cardClass="bg-primary"
                extractionAttempted={Object.keys(extractedData).length > 0}
                onDataChange={handleDataChange}
                editingField={editingField}
                setEditingField={setEditingField}
                isEditable={true}
                allData={extractedData}
            />

            <GridInfoCard
                id="dwelling-exterior"
                title="Dwelling Exterior"
                fields={dwellingExteriorFields}
                data={extractedData}
                cardClass="bg-primary"
                extractionAttempted={Object.keys(extractedData).length > 0}
                onDataChange={handleDataChange}
                editingField={editingField}
                setEditingField={setEditingField}
                isEditable={true}
                allData={extractedData}
            />

            <GridInfoCard
                id="unit-interior"
                title="Unit Interior"
                fields={unitInteriorFields}
                data={extractedData}
                cardClass="bg-primary"
                extractionAttempted={Object.keys(extractedData).length > 0}
                onDataChange={handleDataChange}
                editingField={editingField}
                setEditingField={setEditingField}
                isEditable={true}
                allData={extractedData}
            />

            <GridInfoCard
                id="amenities-storage"
                title="Amenities & Storage"
                fields={amenitiesStorageFields}
                data={extractedData}
                cardClass="bg-primary"
                extractionAttempted={Object.keys(extractedData).length > 0}
                onDataChange={handleDataChange}
                editingField={editingField}
                setEditingField={setEditingField}
                isEditable={true}
                allData={extractedData}
            />

            <GridInfoCard
                id="overall-quality-hbu-market"
                title="Overall Quality, HBU, Market"
                fields={overallQualityHbuMarketFields}
                data={extractedData}
                cardClass="bg-primary"
                extractionAttempted={Object.keys(extractedData).length > 0}
                onDataChange={handleDataChange}
                editingField={editingField}
                setEditingField={setEditingField}
                isEditable={true}
                allData={extractedData}
            />

            <GridInfoCard
                id="project-information-listings"
                title="Project Information & Listings"
                fields={projectInformationListingsFields}
                data={extractedData}
                cardClass="bg-primary"
                extractionAttempted={Object.keys(extractedData).length > 0}
                onDataChange={handleDataChange}
                editingField={editingField}
                setEditingField={setEditingField}
                isEditable={true}
                allData={extractedData}
            />

            {/* Prepare nested data for SalesComparisonSection */}
            {(() => {

                const salesGridData = { Subject: extractedData };
                comparableSales.forEach(compName => {
                    const compIndex = compName.split(' ')[1];
                    const compData = {};
                    salesGridRows.forEach(row => {
                        const flatKey = `Comp ${compIndex} ${row.valueKey}`;
                        if (extractedData[flatKey] !== undefined) {
                            compData[row.valueKey] = extractedData[flatKey];
                        }
                    });
                    salesGridData[compName] = compData;
                });
                return (
                    
                    <div className="card shadow mb-4">
                        <div className="card-header CAR1 bg-primary text-white">
                            <strong>Sales Grid</strong>
                        </div>
                        <SalesComparisonSection
                            data={salesGridData}
                            salesGridRows={salesGridRows}
                            comparableSales={comparableSales}
                            extractionAttempted={Object.keys(extractedData).length > 0}
                            handleDataChange={handleSalesGridDataChange}
                            editingField={editingField}
                            setEditingField={setEditingField}
                            isEditable={true}
                            allData={extractedData}
                        />
                    </div>
                );
            })()}

            <GridInfoCard
                id="sales-comparison-adjustments-summary"
                title="Sales Comparison (Adjustments & Summary)"
                fields={salesComparisonAdjustmentsSummaryFields}
                data={extractedData}
                cardClass="bg-primary"
                extractionAttempted={Object.keys(extractedData).length > 0}
                onDataChange={handleDataChange}
                editingField={editingField}
                setEditingField={setEditingField}
                isEditable={true}
                allData={extractedData}
            />

            <GridInfoCard
                id="reconciliation-appraisal-summary"
                title="Reconciliation & Appraisal Summary"
                fields={reconciliationAppraisalSummaryFields}
                data={extractedData}
                cardClass="bg-primary"
                extractionAttempted={Object.keys(extractedData).length > 0}
                onDataChange={handleDataChange}
                editingField={editingField}
                setEditingField={setEditingField}
                isEditable={true}
                allData={extractedData}
            />

            <GridInfoCard
                id="certification-section"
                title="Certification"
                fields={certificationFields}
                data={extractedData}
                cardClass="bg-primary"
                extractionAttempted={Object.keys(extractedData).length > 0}
                onDataChange={handleDataChange}
                editingField={editingField}
                setEditingField={setEditingField}
                isEditable={true}
                allData={extractedData}
            />
        </>
    );
};

export default Scenario2Form;
