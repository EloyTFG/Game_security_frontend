// src/components/PhaseList.js
import React from 'react';
import { useNavigate } from 'react-router-dom';

const PhaseList = () => {
  const navigate = useNavigate();

  const handlePhaseClick = (phasePath) => {
    navigate(phasePath);
  };

  const phases = [
    { id: 1, name: 'Inyecciones SQL', path: '/challenges' },
    { id: 2, name: 'Broken Access Protocol', path: '/challengesbroken' },
  ];

  return (
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
      <h2>Lista de Fases</h2>
      <ul style={{ listStyle: 'none', padding: 0 }}>
        {phases.map((phase) => (
          <li key={phase.id} style={{ margin: '20px' }}>
            <button
              onClick={() => handlePhaseClick(phase.path)}
              style={{ padding: '10px 20px' }}
            >
              {phase.name}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default PhaseList;
