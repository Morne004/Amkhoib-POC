// src/App.js
import React, { useState } from 'react';
import UploadTemplate from './components/UploadTemplate';
import FillForm from './components/FillForm';
import { saveAs } from 'file-saver';
import PizZip from 'pizzip';
import Docxtemplater from 'docxtemplater';
import { ThemeProvider, createTheme, styled } from '@mui/material/styles';
import { Container, AppBar, Toolbar, Box, CssBaseline, Button } from '@mui/material';
import { Helmet } from 'react-helmet';

const theme = createTheme({
  palette: {
    primary: {
      main: '#040939',
    },
    secondary: {
      main: '#dc004e',
    },
  },
  typography: {
    h1: {
      fontSize: '2.5rem',
    },
    body1: {
      fontSize: '1.2rem',
    },
  },
});

const CustomButton = styled(Button)(({ theme }) => ({
  color: theme.palette.common.white,
  '&:hover': {
    backgroundColor: theme.palette.primary.light,
  },
  '&:active': {
    backgroundColor: theme.palette.primary.dark,
  },
}));

const App = () => {
  const [templateArrayBuffer, setTemplateArrayBuffer] = useState(null);
  const [placeholders, setPlaceholders] = useState([]);

  const handleTemplateUpload = ({ arrayBuffer, placeholders }) => {
    setTemplateArrayBuffer(arrayBuffer);
    setPlaceholders(placeholders);
  };

  const handleFormSubmit = (formData) => {
    try {
      const zip = new PizZip(templateArrayBuffer);
      const doc = new Docxtemplater(zip, {
        delimiters: { start: '<<', end: '>>' },
        paragraphLoop: true,
        linebreaks: true,
      });

      console.log("Before setting data:", formData);
      doc.setData(formData);

      console.log("Data set in Docxtemplater:", formData);

      doc.render();
      const xmlContent = zip.files['word/document.xml'].asText();
      console.log("XML Content After Render:", xmlContent);

      const output = doc.getZip().generate({
        type: 'blob',
        mimeType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      });

      saveAs(output, 'output.docx');
    } catch (error) {
      console.error("Error generating the document:", error);
      alert("Error generating the document. Please check the console for details.");
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <Helmet>
        <title>Amkhoib Contractor Proof of Concept</title>
      </Helmet>
      <CssBaseline />
      <AppBar position="static">
        <Toolbar>
          <Box
            component="img"
            sx={{ height: 40, marginRight: 2 }}
            alt="Amkhoib Logo"
            src="https://www.amkhoibcontractor.co.za/.cm4all/uproc.php/0/.main%20logo.png/picture-1200?_=174fdf29dd5"
          />
          <Box sx={{ flexGrow: 1 }} />
          <Box sx={{ display: 'flex', gap: 2 }}>
            <CustomButton>Home</CustomButton>
            <CustomButton>View Templates</CustomButton>
            <CustomButton>Start Inspection</CustomButton>
            <CustomButton>Help</CustomButton>
          </Box>
          <Box sx={{ flexGrow: 1 }} />
        </Toolbar>
      </AppBar>
      <Container>
        <Box sx={{ my: 4 }}>
          {!templateArrayBuffer ? (
            <UploadTemplate onTemplateUpload={handleTemplateUpload} />
          ) : (
            <FillForm placeholders={placeholders} onFormSubmit={handleFormSubmit} />
          )}
        </Box>
      </Container>
      <Box
        component="img"
        sx={{
          position: 'absolute',
          bottom: 16,
          right: 16,
          height: 85, // Adjust as necessary
        }}
        alt="Amkhoib Logo"
        src="https://www.amkhoibcontractor.co.za/.cm4all/uproc.php/0/.logo%20main.png/picture-2600?_=174fdb36e88"
      />
    </ThemeProvider>
  );
};

export default App;
