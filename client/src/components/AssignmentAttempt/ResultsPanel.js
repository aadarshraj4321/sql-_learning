import React from 'react';

const ResultsPanel = ({ results, error, isLoading }) => {
  const formatExecutionTime = (time) => {
    if (time < 1000) {
      return `${time}ms`;
    }
    return `${(time / 1000).toFixed(2)}s`;
  };

  const renderResults = () => {
    if (isLoading) {
      return (
        <div className="loading">
          <div className="spinner"></div>
          <div>Executing your query...</div>
        </div>
      );
    }

    if (error) {
      return (
        <div className="results-error">
          <div className="error-title">Query Error</div>
          <div className="error-message">{error}</div>
        </div>
      );
    }

    if (!results) {
      return (
        <div className="results-empty">
          <div className="results-empty-icon">🚀</div>
          <div>Ready to run your first query?</div>
          <p style={{ fontSize: '0.9rem', color: '#94a3b8', marginTop: '0.5rem' }}>
            Write some SQL above and hit the Run button
          </p>
        </div>
      );
    }

    if (results.rows.length === 0) {
      return (
        <div className="results-empty">
          <div className="results-empty-icon">✅</div>
          <div>Query executed successfully!</div>
          <p style={{ fontSize: '0.9rem', color: '#94a3b8', marginTop: '0.5rem' }}>
            No rows returned, but your syntax was correct
          </p>
        </div>
      );
    }

    return (
      <div>
        <div style={{ 
          background: '#f8fafc', 
          padding: '0.75rem 1rem', 
          borderBottom: '1px solid #e2e8f0',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          fontSize: '0.9rem',
          color: '#64748b'
        }}>
          <span style={{ fontWeight: '600' }}>
            {results.rowCount} row{results.rowCount !== 1 ? 's' : ''} returned
          </span>
          <span style={{ fontFamily: 'JetBrains Mono, monospace' }}>
            {formatExecutionTime(results.executionTime)}
          </span>
        </div>
        
        <table className="data-table">
          <thead>
            <tr>
              {results.columns.map((column, index) => (
                <th key={index}>{column.name}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {results.rows.map((row, rowIndex) => (
              <tr key={rowIndex}>
                {results.columns.map((column, colIndex) => {
                  const value = row[column.name];
                  const isNumeric = typeof value === 'number';
                  const isNull = value === null || value === undefined;
                  
                  return (
                    <td 
                      key={colIndex} 
                      style={{
                        textAlign: isNumeric ? 'right' : 'left',
                        fontFamily: isNumeric ? 'JetBrains Mono, monospace' : 'inherit',
                        color: isNull ? '#94a3b8' : 'inherit',
                        fontStyle: isNull ? 'italic' : 'normal'
                      }}
                    >
                      {isNull ? 'NULL' : String(value)}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  return (
    <div className="results-panel">
      <div className="results-header">
        <h2 className="results-title">Query Results</h2>
        {results && !error && (
          <div className="results-meta">
            {results.rowCount} rows • {formatExecutionTime(results.executionTime)}
          </div>
        )}
      </div>

      <div className="results-content">
        {renderResults()}
      </div>
    </div>
  );
};

export default ResultsPanel;