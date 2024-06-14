// src/components/ChallengeList.js
import React from 'react';
import { Link } from 'react-router-dom';

const ChallengeListXSS = () => {
  const challenges = [
    { id: 1, name: 'XSS Injection Challenge 1', path: '/XSSChallenge' }
   
  ];

  return (
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
      <h1>Available XSS Injection Challenges</h1>
      <ul style={{ listStyle: 'none', padding: 0 }}>
        {challenges.map((challenge) => (
          <li key={challenge.id} style={{ margin: '20px' }}>
            <Link to={challenge.path}>
              <button style={{ padding: '10px 20px' }}>{challenge.name}</button>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ChallengeListXSS;
