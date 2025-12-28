import React, { useEffect } from 'react';

const HintModal = ({ hint, onClose }) => {
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [onClose]);

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div className="modal-overlay" onClick={handleBackdropClick}>
      <div className="modal">
        <div className="modal-header">
          <h2 className="modal-title">AI Hint</h2>
          <button className="modal-close" onClick={onClose} aria-label="Close hint">
            ×
          </button>
        </div>

        <div className="modal-body">
          <div className="hint-content">
            <span className="hint-icon"></span>
            <p className="hint-text">{hint.hint}</p>
          </div>

          {hint.fallback && (
            <div style={{
              background: 'rgba(245, 158, 11, 0.1)',
              border: '1px solid rgba(245, 158, 11, 0.3)',
              borderRadius: '8px',
              padding: '1rem',
              fontSize: '0.9rem',
              color: '#92400e'
            }}>
              <strong>Note:</strong> This is a general hint. Our AI hint system is temporarily unavailable.
            </div>
          )}

          <div style={{ 
            fontSize: '0.9rem', 
            color: '#64748b', 
            marginTop: '1.5rem',
            padding: '1rem',
            background: '#f8fafc',
            borderRadius: '8px'
          }}>
            <p>
              <strong>Remember:</strong> Hints are meant to guide your thinking, not give you the complete solution. 
              Try to understand the concept and apply it step by step!
            </p>
          </div>
        </div>

        <div className="modal-footer">
          <button className="btn btn--primary" onClick={onClose}>
            Got it, let me try!
          </button>
        </div>
      </div>
    </div>
  );
};

export default HintModal;