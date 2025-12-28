import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { assignmentService, queryService, hintService } from '../../services/api';
import QuestionPanel from './QuestionPanel';
import SampleDataViewer from './SampleDataViewer';
import SQLEditor from './SQLEditor';
import ResultsPanel from './ResultsPanel';
import HintModal from './HintModal';

const AssignmentAttempt = () => {
  const { id } = useParams();
  const [assignment, setAssignment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [query, setQuery] = useState('');
  const [queryResults, setQueryResults] = useState(null);
  const [queryError, setQueryError] = useState(null);
  const [isExecuting, setIsExecuting] = useState(false);
  const [showHintModal, setShowHintModal] = useState(false);
  const [currentHint, setCurrentHint] = useState(null);
  const [isGeneratingHint, setIsGeneratingHint] = useState(false);

  useEffect(() => {
    fetchAssignment();
  }, [id]); // eslint-disable-line react-hooks/exhaustive-deps

  const fetchAssignment = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await assignmentService.getAssignment(id);
      
      if (response.success) {
        setAssignment(response.data);
      } else {
        throw new Error('Assignment not found');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const executeQuery = async () => {
    if (!query.trim()) {
      setQueryError('Please enter a SQL query');
      return;
    }

    try {
      setIsExecuting(true);
      setQueryError(null);
      setQueryResults(null);

      const response = await queryService.executeQuery({
        query: query.trim(),
        assignmentId: id,
        userId: null
      });

      if (response.success) {
        setQueryResults(response.data);
      } else {
        throw new Error(response.error || 'Query execution failed');
      }
    } catch (err) {
      setQueryError(err.message);
    } finally {
      setIsExecuting(false);
    }
  };

  const generateHint = async () => {
    try {
      setIsGeneratingHint(true);
      setCurrentHint(null);

      const response = await hintService.generateHint({
        assignmentId: id,
        userQuery: query.trim() || undefined,
        errorMessage: queryError || undefined,
        userId: null
      });

      if (response.success) {
        setCurrentHint(response.data);
        setShowHintModal(true);
      } else {
        throw new Error(response.error || 'Failed to generate hint');
      }
    } catch (err) {
      setCurrentHint({
        hint: "Try breaking down the problem step by step. Start with a basic SELECT statement and build from there.",
        timestamp: new Date().toISOString(),
        fallback: true
      });
      setShowHintModal(true);
    } finally {
      setIsGeneratingHint(false);
    }
  };

  const handleKeyDown = (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      e.preventDefault();
      executeQuery();
    }
  };

  if (loading) {
    return (
      <div className="assignment-attempt">
        <div className="loading">
          <div className="spinner"></div>
          <div>Loading assignment...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="assignment-attempt">
        <div className="loading">
          <div className="error-icon"></div>
          <h2>Assignment not found</h2>
          <p style={{ marginBottom: '1rem', color: '#64748b' }}>{error}</p>
          <Link to="/" className="btn btn--primary">
            Back to Assignments
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="assignment-attempt">
      <div className="left-panel">
        <QuestionPanel assignment={assignment} />
        <SampleDataViewer tables={assignment.sampleTables} />
      </div>
      
      <div className="right-panel">
        <SQLEditor
          value={query}
          onChange={setQuery}
          onExecute={executeQuery}
          onGenerateHint={generateHint}
          isExecuting={isExecuting}
          isGeneratingHint={isGeneratingHint}
          hasError={!!queryError}
          hasResults={!!queryResults}
          onKeyDown={handleKeyDown}
        />
        
        <ResultsPanel
          results={queryResults}
          error={queryError}
          isLoading={isExecuting}
        />
      </div>

      {showHintModal && (
        <HintModal
          hint={currentHint}
          onClose={() => setShowHintModal(false)}
        />
      )}
    </div>
  );
};

export default AssignmentAttempt;