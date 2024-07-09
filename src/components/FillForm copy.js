// src/components/FillForm.js
import React, { useState } from 'react';

const FillForm = ({ placeholders, onFormSubmit }) => {
  const [formData, setFormData] = useState({});

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onFormSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit}>
      {placeholders.map((ph) => (
        <div key={ph}>
          <label>{ph}</label>
          <input type="text" name={ph} onChange={handleChange} />
        </div>
      ))}
      <button type="submit">Generate Document</button>
    </form>
  );
};

export default FillForm;
