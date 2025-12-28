import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || '/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    // Add any auth tokens here if needed
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error) => {
    const errorMessage = error.response?.data?.error || error.message || 'An error occurred';
    return Promise.reject(new Error(errorMessage));
  }
);

export const assignmentService = {
  // Get all assignments
  getAssignments: () => api.get('/assignments'),
  
  // Get assignment by ID
  getAssignment: (id) => api.get(`/assignments/${id}`),
  
  // Create new assignment (admin only)
  createAssignment: (assignmentData) => api.post('/assignments', assignmentData),
};

export const queryService = {
  // Execute SQL query
  executeQuery: (queryData) => api.post('/queries/execute', queryData),
  
  // Get query statistics
  getQueryStats: (assignmentId) => api.get(`/queries/stats/${assignmentId}`),
};

export const hintService = {
  // Generate AI hint
  generateHint: (hintData) => api.post('/hints/generate', hintData),
};

export default api;