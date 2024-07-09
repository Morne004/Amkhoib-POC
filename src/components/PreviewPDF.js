// src/components/PreviewPDF.js
import React from 'react';
import { Document, Page } from 'react-pdf';

const PreviewPDF = ({ pdfData }) => {
  return (
    <Document file={pdfData}>
      <Page pageNumber={1} />
    </Document>
  );
};

export default PreviewPDF;
