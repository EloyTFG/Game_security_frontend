// src/components/ChallengeList.js
import React from 'react';
import { Link } from 'react-router-dom';

const ChallengeList = () => {
  const challenges = [
    { id: 1, name: 'SQL Injection Challenge 1', path: '/sql-injection-1' },
    { id: 2, name: 'SQL Injection Challenge 2', path: '/sql-injection-2' }
  ];

  return (
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
      <h1>Available SQL Injection Challenges</h1>
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

export default ChallengeList;
