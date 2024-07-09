// src/components/UploadTemplate.js
import React, { useState } from 'react';
import PizZip from 'pizzip';
import Docxtemplater from 'docxtemplater';

const UploadTemplate = ({ onTemplateUpload }) => {
  const [file, setFile] = useState(null);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleFileUpload = () => {
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
        console.log("Extracted Text:", text);  // Debugging line

        const matches = text.match(/<<\w+>>/g);
        if (matches) {
          const placeholders = matches.map(ph => ph.replace(/<<|>>/g, ''));
          onTemplateUpload({ arrayBuffer, placeholders });
        } else {
          alert("No placeholders found in the template.");
        }
      } catch (error) {
        if (error.properties && error.properties.errors) {
          const errorMessages = error.properties.errors.map(err => {
            return `Explanation: ${err.properties.explanation}\nContext: ${err.properties.context}\nOffset: ${err.properties.offset}`;
          }).join("\n\n");
          console.error("Error processing the template:", errorMessages);
          alert("Error processing the template: \n" + errorMessages);
        } else {
          console.error("Error processing the template:", error);
          alert("Error processing the template. Please check the console for details.");
        }
      }
    };
  };

  return (
    <div>
      <input type="file" onChange={handleFileChange} />
      <button onClick={handleFileUpload}>Upload Template</button>
    </div>
  );
};

export default UploadTemplate;
