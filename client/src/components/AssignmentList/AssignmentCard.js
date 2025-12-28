import React from 'react';

const AssignmentCard = ({ assignment }) => {
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    });
  };

  const getDifficultyClass = (difficulty) => {
    return `difficulty-badge--${difficulty.toLowerCase()}`;
  };

  return (
    <div className="assignment-card">
      <div className="card-header">
        <div>
          <h3 className="card-title">{assignment.title}</h3>
          <span className={`difficulty-badge ${getDifficultyClass(assignment.difficulty)}`}>
            {assignment.difficulty}
          </span>
        </div>
      </div>

      <p className="card-description">{assignment.description}</p>

      {assignment.tags && assignment.tags.length > 0 && (
        <div className="card-tags">
          {assignment.tags.slice(0, 4).map((tag, index) => (
            <span key={index} className="tag">
              {tag}
            </span>
          ))}
          {assignment.tags.length > 4 && (
            <span className="tag">
              +{assignment.tags.length - 4}
            </span>
          )}
        </div>
      )}

      <div className="card-footer">
        <span>Added {formatDate(assignment.createdAt)}</span>
        <span className="card-arrow">→</span>
      </div>
    </div>
  );
};

export default AssignmentCard;