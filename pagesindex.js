import React from 'react';
import Link from 'next/link';

const Home = () => {
  return (
    <div>
      <h1>Welcome to User Management App</h1>
      <nav>
        <ul>
          <li><Link href="/signup">Sign Up</Link></li>
          <li><Link href="/login">Login</Link></li>
          <li><Link href="/profile">Profile</Link></li>
        </ul>
      </nav>
    </div>
  );
};

export default Home;
