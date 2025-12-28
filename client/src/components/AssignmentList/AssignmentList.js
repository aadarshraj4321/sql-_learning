import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { assignmentService } from '../../services/api';
import AssignmentCard from './AssignmentCard';

const AssignmentList = () => {
  const [assignments, setAssignments] = useState([]);
  const [filteredAssignments, setFilteredAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDifficulty, setSelectedDifficulty] = useState('all');

  const difficulties = ['all', 'Beginner', 'Intermediate', 'Advanced'];

  useEffect(() => {
    fetchAssignments();
  }, []);

  useEffect(() => {
    filterAssignments();
  }, [assignments, searchTerm, selectedDifficulty]); // eslint-disable-line react-hooks/exhaustive-deps

  const fetchAssignments = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await assignmentService.getAssignments();
      
      if (response.success) {
        setAssignments(response.data);
      } else {
        throw new Error('Failed to fetch assignments');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const filterAssignments = () => {
    let filtered = assignments;

    if (searchTerm) {
      filtered = filtered.filter(assignment =>
        assignment.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        assignment.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        assignment.tags?.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    if (selectedDifficulty !== 'all') {
      filtered = filtered.filter(assignment => assignment.difficulty === selectedDifficulty);
    }

    setFilteredAssignments(filtered);
  };

  const handleRetry = () => {
    fetchAssignments();
  };

  if (loading) {
    return (
      <div className="assignment-list">
        <div className="loading">
          <div className="spinner"></div>
          <div>Loading your SQL challenges...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="assignment-list">
        <div className="loading">
          <div className="error-icon"></div>
          <h2>Oops! Something went wrong</h2>
          <p style={{ marginBottom: '1rem', color: '#64748b' }}>{error}</p>
          <button className="btn btn--primary" onClick={handleRetry}>
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="assignment-list">
      <div className="assignment-list__hero">
        <h1 className="assignment-list__title">Master SQL Like a Pro</h1>
        <p className="assignment-list__subtitle">
          Transform your database skills with our interactive SQL learning platform. 
          Practice real queries, get AI-powered hints, and become a SQL expert through hands-on challenges.
        </p>
      </div>

      <div className="assignment-list__controls">
        <div className="search-container">
          <span className="search-icon"></span>
          <input
            type="text"
            className="search-input"
            placeholder="Search for assignments, topics, or SQL concepts..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="filter-tabs">
          {difficulties.map(difficulty => (
            <button
              key={difficulty}
              className={`filter-tab ${
                selectedDifficulty === difficulty ? 'filter-tab--active' : ''
              }`}
              onClick={() => setSelectedDifficulty(difficulty)}
            >
              {difficulty === 'all' ? 'All Levels' : difficulty}
            </button>
          ))}
        </div>
      </div>

      {filteredAssignments.length === 0 ? (
        <div className="loading">
          <div className="empty-icon"></div>
          <h2>No assignments found</h2>
          <p style={{ color: '#64748b' }}>
            {searchTerm || selectedDifficulty !== 'all'
              ? 'Try adjusting your search or filter criteria.'
              : 'No assignments are available at the moment.'}
          </p>
        </div>
      ) : (
        <div className="assignments-grid">
          {filteredAssignments.map(assignment => (
            <Link key={assignment._id} to={`/assignment/${assignment._id}`}>
              <AssignmentCard assignment={assignment} />
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default AssignmentList;