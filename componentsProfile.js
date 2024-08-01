import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Profile = () => {
  const [profileData, setProfileData] = useState({
    name: '',
    email: ''
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`${process.env.API_URL}/users/profile`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setProfileData(response.data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchProfile();
  }, []);

  const handleChange = (e) => {
    setProfileData({ ...profileData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      await axios.put(`${process.env.API_URL}/users/profile`, profileData, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      alert('Profile updated');
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input type="text" name="name" placeholder="Name" value={profileData.name} onChange={handleChange} required />
      <input type="email" name="email" placeholder="Email" value={profileData.email} onChange={handleChange} required />
      <button type="submit">Update Profile</button>
    </form>
  );
};

export default Profile;
