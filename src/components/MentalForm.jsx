import React, { useState } from 'react';
import useMentalState from '../hooks/useMentalState';

const moodEmojis = ['', ':-(', ':-|', ':-)', ':D', '^_^'];
const energyLabels = ['', 'Low', 'Soft', 'Steady', 'Good', 'High'];
const focusLabels = ['', 'Foggy', 'Drifting', 'Locked', 'Sharp', 'Deep'];
const motivationLabels = ['', 'Flat', 'Slow', 'Moving', 'Driven', 'On fire'];

const getScaleLabel = (value, labels) => {
  if (value <= 2) return labels[1];
  if (value <= 4) return labels[2];
  if (value <= 6) return labels[3];
  if (value <= 8) return labels[4];
  return labels[5];
};

const MentalForm = () => {
  const { logMental } = useMentalState();
  const [mood, setMood] = useState(5);
  const [energy, setEnergy] = useState(5);
  const [focus, setFocus] = useState(5);
  const [motiv, setMotiv] = useState(5);
  const [note, setNote] = useState('');

  const submitLog = () => {
    const now = new Date();
    logMental({
      date: now.toISOString().slice(0, 10),
      mood,
      energy,
      focus,
      motivation: motiv,
      note: note.trim(),
    });
    setNote('');
  };

  return (
    <div className="today-entry-form">
      <div style={{ fontSize: '13px', fontWeight: 500, color: 'var(--text2)', marginBottom: '16px' }}>
        Today's Check-in
      </div>
      <div className="form-row form-row-4">
        <div>
          <div className="mental-label">Mood</div>
          <div className="mental-emoji">{moodEmojis[Math.max(1, Math.ceil(mood / 2))]}</div>
          <input type="range" min="1" max="10" value={mood} className="mental-slider" onChange={(e) => setMood(Number(e.target.value))} />
          <div className="mental-val">{mood}</div>
        </div>
        <div>
          <div className="mental-label">Energy</div>
          <div className="mental-emoji">{getScaleLabel(energy, energyLabels)}</div>
          <input type="range" min="1" max="10" value={energy} className="mental-slider" onChange={(e) => setEnergy(Number(e.target.value))} />
          <div className="mental-val">{energy}</div>
        </div>
        <div>
          <div className="mental-label">Focus</div>
          <div className="mental-emoji">{getScaleLabel(focus, focusLabels)}</div>
          <input type="range" min="1" max="10" value={focus} className="mental-slider" onChange={(e) => setFocus(Number(e.target.value))} />
          <div className="mental-val">{focus}</div>
        </div>
        <div>
          <div className="mental-label">Motivation</div>
          <div className="mental-emoji">{getScaleLabel(motiv, motivationLabels)}</div>
          <input type="range" min="1" max="10" value={motiv} className="mental-slider" onChange={(e) => setMotiv(Number(e.target.value))} />
          <div className="mental-val">{motiv}</div>
        </div>
      </div>
      <div style={{ marginTop: '14px' }}>
        <div className="form-label" style={{ fontSize: '12px', color: 'var(--text2)', marginBottom: '6px' }}>
          Note (optional)
        </div>
        <input
          type="text"
          className="form-input"
          placeholder="What affected your day?"
          value={note}
          onChange={(e) => setNote(e.target.value)}
        />
      </div>
      <button className="btn" style={{ marginTop: '14px' }} onClick={submitLog}>Log Today</button>
    </div>
  );
};

export default MentalForm;
