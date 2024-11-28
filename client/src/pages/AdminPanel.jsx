import React, { useState, useEffect } from 'react';
import { Box, Typography, Container, Grid, Button, TextField, FormControl, FormLabel, MenuItem, Select } from '@mui/material';
import { useForm } from 'react-hook-form';
import { useAuth } from '../services/authContext';
import { apiService } from '../services/apiService';


const AdminPanel = () => {
  const { user } = useAuth();
  const { register, handleSubmit, formState: { errors }, reset } = useForm();
  const [bots, setBots] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedBot, setSelectedBot] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [settingToUpdate, setSettingToUpdate] = useState(null);
  const [newSettingValue, setNewSettingValue] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [botsData, usersData] = await Promise.all([
          apiService.getAllBots(),
          apiService.getAllUsers(),
        ]);
        setBots(botsData);
        setUsers(usersData);
      } catch (err) {
        setError('Failed to fetch data.');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleBotApproval = async (botId, approved) => {
    try {
      await apiService.updateBotApproval(botId, approved);
      const updatedBots = bots.map(bot => bot.id === botId ? { ...bot, approved } : bot);
      setBots(updatedBots);
    } catch (error) {
      setError('Failed to update bot approval.');
    }
  };

  const handleBotDeletion = async (botId) => {
    try {
      await apiService.deleteBot(botId);
      const updatedBots = bots.filter(bot => bot.id !== botId);
      setBots(updatedBots);
    } catch (error) {
      setError('Failed to delete bot.');
    }
  };

  const handleUserBan = async (userId, banned) => {
    try {
      await apiService.updateUserBanStatus(userId, banned);
      const updatedUsers = users.map(user => user.id === userId ? { ...user, banned } : user);
      setUsers(updatedUsers);
    } catch (error) {
      setError('Failed to update user ban status.');
    }
  };


  const handleSettingUpdate = async (data) => {
    try {
      await apiService.updateSetting(settingToUpdate, newSettingValue);
      // Update UI to reflect changes.  Might need to refetch settings from API.
    } catch (error) {
      setError('Failed to update setting.');
    }
    setNewSettingValue('');
    setSettingToUpdate(null);
  };


  if (loading) {
    return <Typography>Loading admin panel...</Typography>;
  }

  if (error) {
    return <Typography color="error">{error}</Typography>;
  }

  if (!user || !user.isAdmin) {
    return <Typography>Unauthorized access.</Typography>;
  }

  return (
    <Container maxWidth="lg">
      <Typography variant="h4" align="center" gutterBottom>Admin Panel</Typography>
      <Grid container spacing={3}>

        <Grid item xs={12} md={6}>
          <Typography variant="h6" gutterBottom>Bot Management</Typography>
          {bots.map((bot) => (
            <Box key={bot.id} mb={2}>
              <Typography>{bot.name} - Approved: {bot.approved ? 'Yes' : 'No'}</Typography>
              <Button variant="outlined" onClick={() => handleBotApproval(bot.id, !bot.approved)}>
                {bot.approved ? 'Disapprove' : 'Approve'}
              </Button>
              <Button variant="outlined" color="error" onClick={() => handleBotDeletion(bot.id)}>Delete</Button>
            </Box>
          ))}
        </Grid>

        <Grid item xs={12} md={6}>
          <Typography variant="h6" gutterBottom>User Management</Typography>
          {users.map((user) => (
            <Box key={user.id} mb={2}>
              <Typography>{user.username} - Banned: {user.banned ? 'Yes' : 'No'}</Typography>
              <Button variant="outlined" onClick={() => handleUserBan(user.id, !user.banned)}>
                {user.banned ? 'Unban' : 'Ban'}
              </Button>
            </Box>
          ))}
        </Grid>

        <Grid item xs={12}>
          <Typography variant="h6" gutterBottom>Website Settings</Typography>
          <FormControl fullWidth margin="normal">
            <FormLabel id="setting-label">Setting to Update</FormLabel>
            <Select
              labelId="setting-label"
              id="setting"
              value={settingToUpdate || ''}
              onChange={(e) => setSettingToUpdate(e.target.value)}
            >
              <MenuItem value="maxBotsPerPage">Max Bots Per Page</MenuItem>
              {/ Add other settings here /}
            </Select>
            {settingToUpdate && (
              <>
                <FormLabel id="new-value-label">New Value</FormLabel>
                <TextField
                  margin="normal"
                  fullWidth
                  id="new-value"
                  label="New Value"
                  name="new-value"
                  value={newSettingValue}
                  onChange={(e) => setNewSettingValue(e.target.value)}
                />
                <Button type="button" onClick={handleSettingUpdate} variant="contained">Update Setting</Button>
              </>
            )}
            {errors.setting && <Typography variant="body2" color="error">Error updating setting.</Typography>}
          </FormControl>
        </Grid>

      </Grid>
    </Container>
  );
};

export default AdminPanel;
```