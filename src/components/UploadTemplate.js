// src/components/UploadTemplate.js
import React, { useState } from 'react';
import PizZip from 'pizzip';
import Docxtemplater from 'docxtemplater';
import { Button, Typography, Box, Input, LinearProgress, Alert } from '@mui/material';
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

const UploadTemplate = ({ onTemplateUpload }) => {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setError(null); // Reset error state when a new file is selected
  };

  const handleFileUpload = () => {
    if (!file) {
      setError("Please select a file before uploading.");
      return;
    }

    setLoading(true);
    const reader = new FileReader();
    reader.readAsArrayBuffer(file);
    reader.onload = (e) => {
      const arrayBuffer = e.target.result;
      try {
        const zip = new PizZip(arrayBuffer);
        const doc = new Docxtemplater(zip, {
          delimiters: { start: '<<', end: '>>' },
          paragraphLoop: true,
          linebreaks: true,
        });

        const text = doc.getFullText();
        console.log("Extracted Text:", text);

        const matches = text.match(/<<\w+>>/g);
        if (matches) {
          const placeholders = matches.map(ph => ph.replace(/<<|>>/g, ''));
          onTemplateUpload({ arrayBuffer, placeholders });
        } else {
          setError("No placeholders found in the template.");
        }
      } catch (error) {
        if (error.properties && error.properties.errors) {
          const errorMessages = error.properties.errors.map(err => {
            return `Explanation: ${err.properties.explanation}\nContext: ${err.properties.context}\nOffset: ${err.properties.offset}`;
          }).join("\n\n");
          console.error("Error processing the template:", errorMessages);
          setError("Error processing the template. Please check the console for details.");
        } else {
          console.error("Error processing the template:", error);
          setError("Error processing the template. Please check the console for details.");
        }
      } finally {
        setLoading(false);
      }
    };
  };

  return (
    <Box sx={{ mt: 4, textAlign: 'center' }}>
      <Typography variant="h5" gutterBottom>
        Process Template
      </Typography>
      <Box sx={{ mb: 2 }}>
        <Input type="file" onChange={handleFileChange} />
      </Box>
      <CustomButton variant="contained" color="primary" onClick={handleFileUpload} sx={{ mb: 2 }}>
        Continue
      </CustomButton>
      {loading && <LinearProgress sx={{ mt: 2 }} />}
      {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
    </Box>
  );
};

export default UploadTemplate;
