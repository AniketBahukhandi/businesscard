"use client"
import React, { useState, useEffect } from 'react';
import html2canvas from 'html2canvas';
import '../style.css';

export default function BusinessCard() {
  const [formData, setFormData] = useState({
    name: '',
    jobTitle: '',
    address: '',
    email: '',
    phone: '',
    link: '',
    template: '1'
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    const savedData = localStorage.getItem('businessCard');
    if (savedData) {
      setFormData(JSON.parse(savedData));
    }
  }, []);

  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.phone.trim()) newErrors.phone = 'Phone number is required';
    else if (!/^\d{10}$/.test(formData.phone)) newErrors.phone = 'Phone must be 10 digits';
    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Invalid email format';
    }
    return newErrors;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    setErrors({});
    localStorage.setItem('businessCard', JSON.stringify(formData));
  };

  const handleReset = () => {
    setFormData({
      name: '',
      jobTitle: '',
      address: '',
      email: '',
      phone: '',
      link: '',
      template: '1'
    });
    setErrors({});
    localStorage.removeItem('businessCard');
  };

  const handleDownload = async () => {
    const card = document.getElementById('card-preview');
    if (!card) return;
    const canvas = await html2canvas(card);
    const link = document.createElement('a');
    link.download = 'business-card.png';
    link.href = canvas.toDataURL();
    link.click();
  };

  return (
    <div className="container">
      <div className="form-section">
        <form onSubmit={handleSubmit}>
          <label>Name</label>
          <input name="name" value={formData.name} onChange={handleChange} />
          {errors.name && <span className="error">{errors.name}</span>}

          <label>Job Title</label>
          <input name="jobTitle" value={formData.jobTitle} onChange={handleChange} />

          <label>Address</label>
          <input name="address" value={formData.address} onChange={handleChange} />

          <label>Email</label>
          <input name="email" value={formData.email} onChange={handleChange} />
          {errors.email && <span className="error">{errors.email}</span>}

          <label>Phone Number</label>
          <input name="phone" value={formData.phone} onChange={handleChange} />
          {errors.phone && <span className="error">{errors.phone}</span>}

          <label>Add Links</label>
          <input name="link" value={formData.link} onChange={handleChange} />

          <label>Select Template</label>
          <select name="template" value={formData.template} onChange={handleChange}>
            <option value="1">1</option>
            <option value="2">2</option>
          </select>

          <button type="submit">Submit</button>
          <button type="button" onClick={handleReset}>Reset</button>
        </form>
      </div>
      <div className="preview-section">
        <div className={`card template-${formData.template}`} id="card-preview">
          <div className="left">
            <strong>{formData.name}</strong>
            <br />
            <span>{formData.jobTitle}</span>
          </div>
          <div className="right">
            <div>{formData.email}</div>
            <div>{formData.phone}</div>
            <div>{formData.address}</div>
            <a href={formData.link} target="_blank" rel="noreferrer">{formData.link}</a>
          </div>
        </div>
        <button className="download-btn" onClick={handleDownload}>Download</button>
      </div>
    </div>
  );
}
