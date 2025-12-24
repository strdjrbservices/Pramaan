import React from 'react';
import {
    Button, Stack, Paper, Box, Typography, CircularProgress, Alert,
    TableContainer, Table, TableHead, TableRow, TableCell, TableBody, Tooltip, IconButton
} from '@mui/material';
import LibraryBooksIcon from '@mui/icons-material/LibraryBooks';

const HighlightKeywords = ({ text, keywordGroups, comment }) => {
    if (!text || !keywordGroups || keywordGroups.length === 0) {
        return text;
    }

    const allKeywords = keywordGroups.flatMap(group => group.keywords);
    if (allKeywords.length === 0) {
        return text;
    }

    const escapedKeywords = allKeywords.map(kw => kw.replace(/[-\\^$*+?.()|[\]{}]/g, '\\$&'));
    const regex = new RegExp(`(${escapedKeywords.join('|')})`, 'gi');
    const parts = String(text).split(regex);

    return (
        <span>
            {parts.map((part, i) => {
                const matchedGroup = keywordGroups.find(group =>
                    group.keywords.some(keyword => part.toLowerCase() === keyword.toLowerCase())
                );
                if (matchedGroup) {
                    const styledPart = <span style={matchedGroup.style}>{part}</span>;

                    const isErrorGroup = matchedGroup.style.backgroundColor === '#ff0000';

                    let tooltipText = matchedGroup.Tooltip;
                    if (isErrorGroup && comment) {
                        tooltipText = comment;
                    }

                    if (tooltipText) {
                        return <Tooltip key={i} title={tooltipText}>{styledPart}</Tooltip>;
                    }
                    return <span key={i} style={matchedGroup.style}>{part}</span>;
                }
                return part;
            })}
        </span>
    );
};

const PromptAnalysis = ({ onPromptSubmit, loading, response, error, submittedPrompt, onAddendumRevisionButtonClick }) => {

    const keywordGroups = [
        {
            keywords: ["consistently", "Fulfilled", "PRESENT", "CONSISTENT"],
            style: { backgroundColor: '#91ff00ff', color: '#000000', padding: '1px 3px', borderRadius: '3px' },
            Tooltip: `Field is valid.`
        },
        {
            keywords: [
                "However", "Not consistently", "Not Fulfilled", "Not PRESENT",
                "Not CONSISTENT", "ilconsistently", "absent", "ilCONSISTENT", "Specifically", "mismatch", "mismatched", "missing", "inconsistent",
            ],
            style: { backgroundColor: '#ff0000', color: '#ffffff', padding: '1px 3px', borderRadius: '3px' },
            Tooltip: `Value must be Fulfilled or PRESENT.`
        }
    ];

    const prompt1 =
        "Verify that the Subject Property Address is identical across all locations in the report including: Subject Section, Sales Comparison Grid, Location Map, Aerial Map, Header/Footer, and any Addenda.\nAlso confirm the presence of the Subject Street View, Front View, and Rear View photos with no duplicates or mislabeled subject photos.";

    const prompt2 =
        "1. Compare bedroom and bathroom counts across the Improvements/Property Characteristics section, Sales Comparison Grid, Sketch/Floor Plan, and all interior/exterior photos.\n2. Verify that Gross Living Area (GLA) is consistent between the Sketch, Improvements section, Sales Grid, Cost Approach (if present), and Addendum comments. Flag any mismatch.";

    const prompt4 =
        "Match all Comparable Sale addresses across the Sales Grid, Comparable Photo Pages, MLS/Map Exhibits, Location Map, and Aerial Map. Confirm that no comparable photos are duplicated, mislabeled, or incorrectly associated with the wrong comparable.";

    const prompt5 =
        "Verify that every photo is properly labeled (Subject, Comp 1, Comp 2, etc.) and confirm that there are no duplicate photos, reused photos, or mislabeled views across the entire photo section.";

    const supplementalAddendumPrompt =
        "1. Confirm presence of the following sections and answer only 'Present' or 'Not Present': SUPPLEMENTAL ADDENDUM, ADDITIONAL COMMENTS, APPRAISER'S CERTIFICATION, SUPERVISORY APPRAISER'S CERTIFICATION, Analysis/Comments, GENERAL INFORMATION ON ANY REQUIRED REPAIRS, UNIFORM APPRAISAL DATASET (UAD) DEFINITIONS ADDENDUM.&#10;&#10;2. Confirm presence of the following sections and answer only 'Present' or 'Not Present': SCOPE OF WORK, INTENDED USE, INTENDED USER, DEFINITION OF MARKET VALUE, STATEMENT OF ASSUMPTIONS AND LIMITING CONDITIONS.";


    const renderResponse = (response) => {
        let data = response;
        if (typeof response === 'string') {
            try {
                const parsed = JSON.parse(response);
                if (typeof parsed === 'object' && parsed !== null) {
                    data = parsed;
                }
            } catch (e) {
                // Not a JSON string, treat as plain text
            }
        }

        if (typeof data === 'object' && data !== null) {
            const { summary, comparison_summary, ...otherData } = data.fields || data;
            const hasOtherData = Object.keys(otherData).length > 0 && !(Object.keys(otherData).length === 1 && otherData.raw);
            const hasComparisonSummary = Array.isArray(comparison_summary) && comparison_summary.length > 0;


            return (
                <>
                    <Stack spacing={3} sx={{ mt: 3 }}>
                        {summary && (
                            <Paper elevation={1} sx={{ p: 2, bgcolor: 'background.default' }}>
                                <Typography variant="h6" gutterBottom component="div" color="primary.main">
                                    Summary
                                </Typography>
                                <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap', lineHeight: 1.6 }}>
                                    <HighlightKeywords text={summary} keywordGroups={keywordGroups} />
                                </Typography>
                            </Paper>
                        )}
                        {hasComparisonSummary && (
                            <Paper elevation={1} sx={{ p: 2 }}>
                                <Typography variant="h6" gutterBottom component="div" color="primary.main">
                                    Comparison Summary
                                </Typography>
                                <TableContainer>
                                    <Table size="small" aria-label="comparison summary table">
                                        <TableHead>
                                            <TableRow>
                                                <TableCell sx={{ fontWeight: 'bold' }}>Status</TableCell>
                                                <TableCell sx={{ fontWeight: 'bold' }}>Section</TableCell>
                                                <TableCell sx={{ fontWeight: 'bold' }}>Comment</TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {comparison_summary.map((item, index) => (
                                                <TableRow key={index}>
                                                    <TableCell><HighlightKeywords text={item.status} keywordGroups={keywordGroups} comment={item.comment} /></TableCell>
                                                    <TableCell><HighlightKeywords text={item.section} keywordGroups={keywordGroups} /></TableCell>
                                                    <TableCell><HighlightKeywords text={item.comment} keywordGroups={keywordGroups} /></TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                            </Paper>
                        )}
                        {hasOtherData && (
                            <Paper elevation={1} sx={{ p: 2 }}>
                                <Typography variant="h6" gutterBottom component="div" color="primary.main">
                                    Analysis Details
                                </Typography>
                                <TableContainer>
                                    <Table size="small" aria-label="prompt analysis table">
                                        <TableHead>
                                            <TableRow>
                                                <TableCell sx={{ fontWeight: 'bold', borderBottom: 2, borderColor: 'primary.light' }}>Field</TableCell>
                                                <TableCell sx={{ fontWeight: 'bold', borderBottom: 2, borderColor: 'primary.light' }}>Value</TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {Object.entries(otherData).map(([key, value]) => (
                                                <TableRow key={key} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                                                    <TableCell component="th" scope="row" sx={{ fontWeight: 'medium' }}>
                                                        {key}
                                                    </TableCell>
                                                    <TableCell>
                                                        <HighlightKeywords
                                                            text={(typeof value === 'object' && value !== null && 'value' in value)
                                                                ? String(value.value)
                                                                : (typeof value === 'object' ? JSON.stringify(value, null, 2) : String(value))}
                                                            comment={(typeof value === 'object' && value !== null) ? (value.comment || value.tooltip) : null}
                                                            keywordGroups={keywordGroups}
                                                        />
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                            </Paper>
                        )}
                    </Stack>
                </>
            );
        }


        return (
            <Paper elevation={1} sx={{ p: 2, mt: 3, bgcolor: 'background.default' }}>
                <Typography variant="h6" gutterBottom component="div" color="primary.main">
                    Analysis Result
                </Typography>
                <pre style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word', color: 'inherit', fontFamily: 'monospace' }}>
                    <HighlightKeywords text={String(data)} keywordGroups={keywordGroups} />
                </pre>
            </Paper>
        );
    };


    return (
        <div id="prompt-analysis-section" className="card shadow mb-4">
            <div className="card-header CAR1 bg-info text-white" style={{ position: 'sticky', top: 0, zIndex: 10 }}>
                <strong style={{ fontSize: '1.1rem' }}>Prompt Analysis</strong>
                {onAddendumRevisionButtonClick && (
                    <Tooltip title="General/Addendum Revisions">
                        <IconButton onClick={onAddendumRevisionButtonClick} size="small" sx={{ color: 'white', float: 'right' }}><LibraryBooksIcon /></IconButton>
                    </Tooltip>
                )}
            </div>
            <div className="card-body">
                <Stack spacing={2}>
                    <Stack direction="row" spacing={1} useFlexGap flexWrap="wrap">
                        <Button variant="outlined" size="small" onClick={() => onPromptSubmit(prompt1)} disabled={loading}>Verify Subject Address & Photos</Button>
                        <Button variant="outlined" size="small" onClick={() => onPromptSubmit(prompt2)} disabled={loading}>Compare Room Counts</Button>
                        <Button variant="outlined" size="small" onClick={() => onPromptSubmit(prompt4)} disabled={loading}>Match Comp Addresses</Button>
                        <Button variant="outlined" size="small" onClick={() => onPromptSubmit(prompt5)} disabled={loading}>Verify Photo Labels & Duplicates</Button>
                        {/* <Button variant="outlined" size="small" onClick={() => onPromptSubmit(prompt6)} disabled={loading}>Revision Requests Check</Button> */}
                        <Button variant="outlined" size="small" onClick={() => onPromptSubmit(supplementalAddendumPrompt)} disabled={loading}>Page Present Check</Button>
                    </Stack>
                    {loading && <CircularProgress size={24} />}
                </Stack>

                {error && <Alert severity="error" sx={{ mt: 3 }}>{error}</Alert>}

                {response && (
                    <Box sx={{ mt: 3 }}>
                        {submittedPrompt && <Paper elevation={1} sx={{ p: 2, mb: 3, borderLeft: 4, borderColor: 'secondary.main', bgcolor: 'background.default' }}>
                            <Typography variant="h6" gutterBottom component="div" color="text.primary">
                                Given Prompt
                            </Typography>
                            <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap', fontStyle: 'italic', color: 'text.secondary' }}>
                                {submittedPrompt}
                            </Typography>
                        </Paper>}
                        {renderResponse(response)}
                    </Box>
                )}
            </div>
        </div>
    );
};

export default PromptAnalysis;