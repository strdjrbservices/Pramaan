import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Container,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  CircularProgress,
  Alert,
  Chip,
  TextField,
  InputAdornment
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import SearchIcon from '@mui/icons-material/Search';
import PremiumLogo from './logo';

const History = () => {
  const navigate = useNavigate();
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({
    file_name: '',
    user_name: localStorage.getItem('username') || '',
    created_at: '',
    status: '',
    totalTimeTaken: ''
  });

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      // Fetching from the backend API
      const response = await fetch('https://strdjrbservices1.pythonanywhere.com/api/get-reports/');
      
      if (!response.ok) {
        // Fallback error if endpoint is not yet implemented or fails
        throw new Error(`Failed to fetch reports (Status: ${response.status})`);
      }
      
      const data = await response.json();
      // Ensure we are working with an array
      setReports(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Error fetching history:", err);
      setError('Could not load review history. Please ensure the backend supports this feature.');
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (field, value) => {
    setFilters(prev => ({ ...prev, [field]: value }));
  };

  const handleClearFilters = () => {
    setSearchQuery('');
    setFilters({
      file_name: '',
      user_name: '',
      created_at: '',
      status: '',
      totalTimeTaken: ''
    });
  };

  const filteredReports = reports.filter((report) => {
    const fileName = (report.file_name || '').toLowerCase();
    const userName = (report.user_name || '').toLowerCase();
    const createdAt = (report.created_at ? new Date(report.created_at).toLocaleString() : 'N/A').toLowerCase();
    const status = (report.status || 'Completed').toLowerCase();
    const timeTaken = (report.report_data?.totalTimeTaken || 'N/A').toLowerCase();

    const searchLower = searchQuery.toLowerCase();
    const matchesSearch = !searchQuery ||
      fileName.includes(searchLower) ||
      userName.includes(searchLower) ||
      createdAt.includes(searchLower) ||
      status.includes(searchLower) ||
      timeTaken.includes(searchLower);

    const matchesFilters =
      (!filters.file_name || fileName.includes(filters.file_name.toLowerCase())) &&
      (!filters.user_name || userName.includes(filters.user_name.toLowerCase())) &&
      (!filters.created_at || createdAt.includes(filters.created_at.toLowerCase())) &&
      (!filters.status || status.includes(filters.status.toLowerCase())) &&
      (!filters.totalTimeTaken || timeTaken.includes(filters.totalTimeTaken.toLowerCase()));

    return matchesSearch && matchesFilters;
  });

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#f0f2f5', py: 8 }}>
      <Container maxWidth="lg">
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate('/')}
          sx={{ mb: 4, color: 'text.secondary', '&:hover': { color: 'primary.main', bgcolor: 'transparent' } }}
        >
          Back to Dashboard
        </Button>

        <Box display="flex" alignItems="center" gap={2} mb={5} justifyContent='center' >
            <PremiumLogo size={60} fullScreen={false} />
            <Box>
                <Typography variant="h4" fontWeight={800} sx={{
                    background: 'linear-gradient(45deg, #1976d2, #9c27b0)',
                    backgroundClip: 'text',
                    textFillColor: 'transparent',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                }}>
                    Review History
                </Typography>
                <Typography variant="subtitle1" color="text.secondary">
                    Archive of past appraisal reviews
                </Typography>
            </Box>
        </Box>

        {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

        <Box sx={{ mb: 3, display: 'flex', gap: 2 }}>
          <TextField
            fullWidth
            variant="outlined"
            placeholder="Search all columns..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
              sx: { bgcolor: 'background.paper', borderRadius: 2 }
            }}
          />
          <Button
            variant="outlined"
            color="secondary"
            onClick={handleClearFilters}
            sx={{ px: 3, borderRadius: 2, whiteSpace: 'nowrap', bgcolor: 'background.paper' }}
          >
            Clear Filters
          </Button>
        </Box>

        {!loading && (
          <Typography variant="subtitle2" sx={{ mb: 2, color: 'text.secondary', textAlign: 'left', display: 'block',textTransform: 'uppercase', fontWeight: 600 ,}}>
            Total Files: {filteredReports.length}
          </Typography>
        )}

        <Paper elevation={3} sx={{ borderRadius: 4, overflow: 'hidden' }}>
            {loading ? (
                <Box sx={{ p: 6, display: 'flex', justifyContent: 'center' }}>
                    <CircularProgress />
                </Box>
            ) : reports.length === 0 ? (
                <Box sx={{ p: 6, textAlign: 'center' }}>
                    <Typography color="text.secondary" variant="h6" gutterBottom>No review history found.</Typography>
                    <Button variant="contained" sx={{ mt: 2 }} onClick={() => navigate('/extractor')}>
                        Start New Review
                    </Button>
                </Box>
            ) : (
                <TableContainer>
                    <Table sx={{ minWidth: 650 }}>
                        <TableHead sx={{ bgcolor: 'grey.50' }}>
                            <TableRow>
                                <TableCell sx={{ fontWeight: 'bold', py: 2 }}>File Name</TableCell>
                                <TableCell sx={{ fontWeight: 'bold', py: 2 }}>User</TableCell>
                                <TableCell sx={{ fontWeight: 'bold', py: 2 }}>Date Processed</TableCell>
                                <TableCell sx={{ fontWeight: 'bold', py: 2 }}>Status</TableCell>
                                <TableCell sx={{ fontWeight: 'bold', py: 2 }}>Time Taken</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell sx={{ p: 1 }}>
                                    <TextField 
                                        size="small" 
                                        variant="standard" 
                                        placeholder="Filter File" 
                                        fullWidth 
                                        onChange={(e) => handleFilterChange('file_name', e.target.value)} 
                                    />
                                </TableCell>
                                <TableCell sx={{ p: 1 }}>
                                    <TextField 
                                        size="small" 
                                        variant="standard" 
                                        placeholder="Filter User" 
                                        fullWidth 
                                        value={filters.user_name}
                                        onChange={(e) => handleFilterChange('user_name', e.target.value)} 
                                    />
                                </TableCell>
                                <TableCell sx={{ p: 1 }}>
                                    <TextField 
                                        size="small" 
                                        variant="standard" 
                                        placeholder="Filter Date" 
                                        fullWidth 
                                        onChange={(e) => handleFilterChange('created_at', e.target.value)} 
                                    />
                                </TableCell>
                                <TableCell sx={{ p: 1 }}>
                                    <TextField size="small" variant="standard" placeholder="Filter Status" fullWidth onChange={(e) => handleFilterChange('status', e.target.value)} />
                                </TableCell>
                                <TableCell sx={{ p: 1 }}>
                                    <TextField size="small" variant="standard" placeholder="Filter Time" fullWidth onChange={(e) => handleFilterChange('totalTimeTaken', e.target.value)} />
                                </TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {filteredReports.length === 0 && (
                                <TableRow><TableCell colSpan={5} align="center" sx={{ py: 3 }}>No matching records found</TableCell></TableRow>
                            )}
                            {filteredReports.map((report, index) => (
                                <TableRow key={index} hover sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                                    <TableCell component="th" scope="row" sx={{ fontWeight: 500 }}>
                                        {report.file_name || 'Unknown File'}
                                    </TableCell>
                                    <TableCell>{report.user_name || 'Unknown'}</TableCell>
                                    <TableCell>
                                        {report.created_at ? new Date(report.created_at).toLocaleString() : 'N/A'}
                                    </TableCell>
                                    <TableCell>
                                        <Chip 
                                            label={report.status || 'Completed'} 
                                            color="success" 
                                            size="small" 
                                            variant="outlined"
                                        />
                                    </TableCell>
                                    <TableCell>{report.report_data?.totalTimeTaken || 'N/A'}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            )}
        </Paper>
      </Container>
    </Box>
  );
};

export default History;
