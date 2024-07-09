// src/components/FillForm.js
import React, { useState } from 'react';
import { Button, TextField, Box, Typography, CircularProgress, Alert } from '@mui/material';
import { styled } from '@mui/material/styles';

const CustomButton = styled(Button)(({ theme }) => ({
  color: theme.palette.common.white,
  '&:hover': {
    backgroundColor: theme.palette.primary.light,
  },
  '&:active': {
    backgroundColor: theme.palette.primary.dark,
  },
}));

const FillForm = ({ placeholders, onFormSubmit }) => {
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null); // Reset error state on form submission

    // Simulate async form submission
    try {
      onFormSubmit(formData);
    } catch (err) {
      console.error("Error submitting the form:", err);
      setError("There was an error submitting the form. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ mt: 4, textAlign: 'center' }}>
      <Typography variant="h5" gutterBottom>
        Please complete the fields below
      </Typography>
      {placeholders.map((ph) => (
        <Box key={ph} sx={{ mb: 2 }}>
          <TextField
            fullWidth
            label={ph}
            name={ph}
            onChange={handleChange}
            variant="outlined"
            required
          />
        </Box>
      ))}
      <Box sx={{ position: 'relative' }}>
        <CustomButton
          type="submit"
          variant="contained"
          color="primary"
          disabled={loading}
        >
          Generate Document
        </CustomButton>
        {loading && (
          <CircularProgress
            size={24}
            sx={{
              color: 'primary',
              position: 'absolute',
              top: '50%',
              left: '50%',
              marginTop: '-12px',
              marginLeft: '-12px',
            }}
          />
        )}
      </Box>
      {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
    </Box>
  );
};

export default FillForm;
