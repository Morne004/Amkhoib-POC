// src/App.js
import React, { useState } from 'react';
import UploadTemplate from './components/UploadTemplate';
import FillForm from './components/FillForm';
import { saveAs } from 'file-saver';
import PizZip from 'pizzip';
import Docxtemplater from 'docxtemplater';

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
    <div>
      {!templateArrayBuffer ? (
        <UploadTemplate onTemplateUpload={handleTemplateUpload} />
      ) : (
        <FillForm placeholders={placeholders} onFormSubmit={handleFormSubmit} />
      )}
    </div>
  );
};

export default App;
