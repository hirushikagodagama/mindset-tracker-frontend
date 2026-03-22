import React from 'react';
import useMentalState from '../hooks/useMentalState';

const MentalHistory = () => {
  const { mentalState } = useMentalState();
  const sorted = [...mentalState].reverse().slice(0, 10);

  if (sorted.length === 0) {
    return <div style={{ color: 'var(--text3)', fontSize: '13px', padding: '10px' }}>No entries yet.</div>;
  }

  return (
    <div className="mental-history">
      {sorted.map((entry) => (
        <div key={entry.date} className="mental-entry">
          <span className="mental-entry-date">{entry.date}</span>
          <span className="mental-badge mood-badge">Mood {entry.mood}</span>
          <span className="mental-badge energy-badge">Energy {entry.energy}</span>
          <span className="mental-badge focus-badge">Focus {entry.focus ?? '-'}</span>
          <span className="mental-badge mot-badge">Mot. {entry.motivation}</span>
          {entry.note && <span className="mental-note">"{entry.note}"</span>}
        </div>
      ))}
    </div>
  );
};

export default MentalHistory;
