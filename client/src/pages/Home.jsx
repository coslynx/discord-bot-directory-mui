import React, { useState, useEffect } from 'react';
import { Box, Grid, Container, Typography } from '@mui/material';
import { apiService } from '../services/apiService';
import BotList from '../components/BotList';
import SearchBar from '../components/SearchBar';
import { useAuth } from '../services/authContext';


const Home = () => {
  const [bots, setBots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const { user } = useAuth();


  useEffect(() => {
    const fetchBots = async () => {
      try {
        const fetchedBots = await apiService.getAllBots(searchQuery);
        setBots(fetchedBots);
      } catch (err) {
        setError('Failed to fetch bots.');
      } finally {
        setLoading(false);
      }
    };

    fetchBots();
  }, [searchQuery]);

  const handleSearch = (query) => {
    setSearchQuery(query);
  };

  return (
    <Container maxWidth="lg">
      <Box mt={2} mb={2}>
        <SearchBar onSearch={handleSearch} />
      </Box>
      <BotList bots={bots} loading={loading} error={error} />
      {user?.isAdmin && (
        <Box mt={4}>
          <Typography variant="h6" align="center">
            Admin Panel Access: <a href="/admin">Admin Panel</a>
          </Typography>
        </Box>
      )}

    </Container>
  );
};

export default Home;
```