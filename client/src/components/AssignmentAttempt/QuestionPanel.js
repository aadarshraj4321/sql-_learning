import React from 'react';

const QuestionPanel = ({ assignment }) => {
  const getDifficultyClass = (difficulty) => {
    return `difficulty-badge--${difficulty.toLowerCase()}`;
  };

  return (
    <div className="question-panel">
      <div className="question-header">
        <h1 className="question-title">{assignment.title}</h1>
        <span className={`difficulty-badge ${getDifficultyClass(assignment.difficulty)}`}>
          {assignment.difficulty}
        </span>
      </div>
      
      <div className="question-content">
        {assignment.question}
      </div>
      
      {assignment.tags && assignment.tags.length > 0 && (
        <div className="card-tags" style={{ marginTop: '1.5rem' }}>
          {assignment.tags.map((tag, index) => (
            <span key={index} className="tag">
              {tag}
            </span>
          ))}
        </div>
      )}
    </div>
  );
};

export default QuestionPanel;