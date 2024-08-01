import React, { useState } from 'react';
import axios from 'axios';

const VerifyEmail = () => {
  const [formData, setFormData] = useState({
    email: '',
    otp: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${process.env.API_URL}/auth/verify-email`, formData);
      alert(response.data.message);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input type="email" name="email" placeholder="Email" onChange={handleChange} required />
      <input type="text" name="otp" placeholder="OTP" onChange={handleChange} required />
      <button type="submit">Verify Email</button>
    </form>
  );
};

export default VerifyEmail;
