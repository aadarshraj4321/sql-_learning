// SQL query validation and sanitization utilities

const DANGEROUS_KEYWORDS = [
  'DROP', 'DELETE', 'INSERT', 'UPDATE', 'CREATE', 'ALTER', 'TRUNCATE',
  'GRANT', 'REVOKE', 'EXEC', 'EXECUTE', 'CALL', 'DECLARE', 'SET',
  'SHOW', 'DESCRIBE', 'EXPLAIN', 'ANALYZE'
];

const ALLOWED_KEYWORDS = [
  'SELECT', 'FROM', 'WHERE', 'JOIN', 'INNER', 'LEFT', 'RIGHT', 'FULL',
  'ON', 'GROUP', 'BY', 'HAVING', 'ORDER', 'LIMIT', 'OFFSET', 'DISTINCT',
  'AS', 'AND', 'OR', 'NOT', 'IN', 'LIKE', 'BETWEEN', 'IS', 'NULL',
  'COUNT', 'SUM', 'AVG', 'MIN', 'MAX', 'CASE', 'WHEN', 'THEN', 'ELSE', 'END',
  'UNION', 'INTERSECT', 'EXCEPT', 'EXISTS', 'ANY', 'ALL', 'SOME'
];

function validateQuery(query) {
  if (!query || typeof query !== 'string') {
    return {
      isValid: false,
      error: 'Query must be a non-empty string'
    };
  }

  const trimmedQuery = query.trim();
  
  if (trimmedQuery.length === 0) {
    return {
      isValid: false,
      error: 'Query cannot be empty'
    };
  }

  // Check for dangerous keywords
  const upperQuery = trimmedQuery.toUpperCase();
  for (const keyword of DANGEROUS_KEYWORDS) {
    if (upperQuery.includes(keyword)) {
      return {
        isValid: false,
        error: `Dangerous operation detected: ${keyword}. Only SELECT queries are allowed.`
      };
    }
  }

  // Check if query starts with SELECT
  if (!upperQuery.trim().startsWith('SELECT')) {
    return {
      isValid: false,
      error: 'Only SELECT queries are allowed'
    };
  }

  // Check for semicolons (prevent multiple statements)
  const semicolonCount = (trimmedQuery.match(/;/g) || []).length;
  if (semicolonCount > 1 || (semicolonCount === 1 && !trimmedQuery.endsWith(';'))) {
    return {
      isValid: false,
      error: 'Multiple statements are not allowed'
    };
  }

  // Check query length
  if (trimmedQuery.length > 5000) {
    return {
      isValid: false,
      error: 'Query is too long. Maximum length is 5000 characters.'
    };
  }

  // Check for potential SQL injection patterns
  const injectionPatterns = [
    /--/,  // SQL comments
    /\/\*/,  // Multi-line comments
    /\bxp_cmdshell\b/i,
    /\bsp_executesql\b/i,
    /\bunion\s+select\b/i,
    /\bor\s+1\s*=\s*1\b/i,
    /\band\s+1\s*=\s*1\b/i
  ];

  for (const pattern of injectionPatterns) {
    if (pattern.test(trimmedQuery)) {
      return {
        isValid: false,
        error: 'Potentially unsafe query pattern detected'
      };
    }
  }

  return {
    isValid: true,
    error: null
  };
}

function sanitizeQuery(query) {
  // Remove any trailing semicolon and trim
  let sanitized = query.trim();
  if (sanitized.endsWith(';')) {
    sanitized = sanitized.slice(0, -1);
  }
  
  // Remove any potential comments
  sanitized = sanitized.replace(/--.*$/gm, '');
  sanitized = sanitized.replace(/\/\*[\s\S]*?\*\//g, '');
  
  return sanitized.trim();
}

function isReadOnlyQuery(query) {
  const upperQuery = query.toUpperCase().trim();
  return upperQuery.startsWith('SELECT') || 
         upperQuery.startsWith('WITH') ||
         upperQuery.startsWith('SHOW') ||
         upperQuery.startsWith('DESCRIBE') ||
         upperQuery.startsWith('EXPLAIN');
}

module.exports = {
  validateQuery,
  sanitizeQuery,
  isReadOnlyQuery,
  DANGEROUS_KEYWORDS,
  ALLOWED_KEYWORDS
};