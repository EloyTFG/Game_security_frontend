// src/components/ChallengeList.js
import React from 'react';
import { Link } from 'react-router-dom';

const ChallengemimitList = () => {
  const challenges = [
    { id: 1, name: 'Mitiggacion', path: '/xxeChallenge' }
    
  ];

  return (
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
      <h1>Available Broken Access Protocol Challenges</h1>
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

export default ChallengemimitList;