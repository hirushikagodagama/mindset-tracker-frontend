import React, { useState, useEffect } from 'react';
import useHabits from '../hooks/useHabits';
import { EMOJIS } from '../utils/habitUtils';

const AddHabitModal = ({ isOpen, onClose, editHabitData }) => {
  const { addHabit, updateHabit, removeHabit } = useHabits();
  const [name, setName] = useState('');
  const [icon, setIcon] = useState(EMOJIS[0]);
  const [targetDays, setTargetDays] = useState(5);
  const [errorMessage, setErrorMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  useEffect(() => {
    if (editHabitData) {
      setName(editHabitData.name);
      setIcon(editHabitData.emoji || EMOJIS[0]);
      setTargetDays(editHabitData.targetDays || 5);
    } else {
      setName('');
      setIcon(EMOJIS[0]);
      setTargetDays(5);
    }
    setErrorMessage('');
    setIsSubmitting(false);
    setConfirmDelete(false);
  }, [editHabitData, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) return;

    try {
      setIsSubmitting(true);
      setErrorMessage('');

      if (editHabitData) {
        await updateHabit(editHabitData.id, { name: name.trim(), emoji: icon, targetDays });
      } else {
        await addHabit({ name: name.trim(), emoji: icon, targetDays });
      }

      onClose();
    } catch (error) {
      setErrorMessage(error.response?.data?.message || 'Unable to save this habit right now.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    try {
      setIsSubmitting(true);
      setErrorMessage('');
      await removeHabit(editHabitData.id);
      onClose();
    } catch (error) {
      setErrorMessage(error.response?.data?.message || 'Unable to delete this habit right now.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="modal-overlay open">
      <div className="modal">
        <div className="modal-title">{editHabitData ? 'Edit Habit' : 'Add New Habit'}</div>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Name</label>
            <input 
              type="text" 
              className="form-input" 
              placeholder="e.g. Morning run" 
              value={name}
              onChange={(e) => setName(e.target.value)}
              autoFocus
            />
          </div>
          <div className="form-group">
            <label className="form-label">Icon</label>
            <div className="emoji-grid">
              {EMOJIS.map(e => (
                <button 
                  key={e}
                  type="button"
                  className={`emoji-btn ${icon === e ? 'sel' : ''}`} 
                  onClick={() => setIcon(e)}
                >
                  {e}
                </button>
              ))}
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">Target days per week</label>
            <input
              type="range"
              min="1"
              max="7"
              value={targetDays}
              className="mental-slider"
              onChange={(e) => setTargetDays(Number(e.target.value))}
            />
            <div className="mental-val" style={{ fontSize: '18px' }}>{targetDays}</div>
          </div>
          {errorMessage && (
            <div className="form-error" role="alert">{errorMessage}</div>
          )}
          {editHabitData && confirmDelete && (
            <div className="delete-warning" role="alert">
              <div className="delete-warning-title">Delete this habit?</div>
              <div className="delete-warning-copy">This removes it from your active habit list. Existing history stays in the database.</div>
            </div>
          )}
          <div className="modal-actions" style={{ justifyContent: editHabitData ? 'space-between' : 'flex-end' }}>
            {editHabitData && (
              confirmDelete ? (
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button
                    type="button"
                    className="btn btn-ghost"
                    onClick={() => setConfirmDelete(false)}
                    disabled={isSubmitting}
                  >
                    Keep Habit
                  </button>
                  <button
                    type="button"
                    className="btn btn-danger"
                    onClick={handleDelete}
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? 'Deleting...' : 'Confirm Delete'}
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  className="btn btn-ghost"
                  style={{ color: 'var(--danger)', borderColor: 'var(--danger)' }}
                  onClick={() => setConfirmDelete(true)}
                  disabled={isSubmitting}
                >
                  Delete
                </button>
              )
            )}
            <div style={{ display: 'flex', gap: '8px' }}>
              <button type="button" className="btn btn-ghost" onClick={onClose} disabled={isSubmitting}>Cancel</button>
              <button type="submit" className="btn" disabled={isSubmitting}>{isSubmitting ? 'Working...' : editHabitData ? 'Save Changes' : 'Add Habit'}</button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddHabitModal;
