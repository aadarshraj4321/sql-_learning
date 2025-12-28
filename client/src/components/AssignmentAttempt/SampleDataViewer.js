import React, { useState } from 'react';

const SampleDataViewer = ({ tables }) => {
  const [activeTab, setActiveTab] = useState(0);

  if (!tables || tables.length === 0) {
    return (
      <div className="sample-data-panel">
        <h2 className="panel-title">Sample Data</h2>
        <div className="results-empty">
          <div className="results-empty-icon">📊</div>
          <p>No sample data available for this assignment.</p>
        </div>
      </div>
    );
  }

  const activeTable = tables[activeTab];

  return (
    <div className="sample-data-panel">
      <h2 className="panel-title">Sample Data</h2>

      {tables.length > 1 && (
        <div className="table-tabs">
          {tables.map((table, index) => (
            <button
              key={index}
              className={`table-tab ${activeTab === index ? 'table-tab--active' : ''}`}
              onClick={() => setActiveTab(index)}
            >
              {table.tableName}
            </button>
          ))}
        </div>
      )}

      <div className="table-content">
        <div className="schema-section">
          <h3 className="schema-title">Table: {activeTable.tableName}</h3>
          
          <div style={{ marginBottom: '1.5rem' }}>
            <h4 className="schema-title">Schema</h4>
            <table className="data-table">
              <thead>
                <tr>
                  <th>Column</th>
                  <th>Type</th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(activeTable.schema).map(([column, type]) => (
                  <tr key={column}>
                    <td style={{ fontWeight: '600' }}>{column}</td>
                    <td>
                      <span className="type-badge">{type}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div>
            <h4 className="schema-title">Sample Data</h4>
            {activeTable.sampleData && activeTable.sampleData.length > 0 ? (
              <table className="data-table">
                <thead>
                  <tr>
                    {Object.keys(activeTable.schema).map(column => (
                      <th key={column}>{column}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {activeTable.sampleData.map((row, index) => (
                    <tr key={index}>
                      {Object.keys(activeTable.schema).map(column => (
                        <td key={column}>
                          {row[column] !== null && row[column] !== undefined 
                            ? String(row[column]) 
                            : <span style={{ color: '#94a3b8', fontStyle: 'italic' }}>NULL</span>
                          }
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p style={{ color: '#64748b' }}>No sample data available for this table.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SampleDataViewer;