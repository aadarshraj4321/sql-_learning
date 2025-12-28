import React, { useRef } from 'react';
import Editor from '@monaco-editor/react';

const SQLEditor = ({
  value,
  onChange,
  onExecute,
  onGenerateHint,
  isExecuting,
  isGeneratingHint,
  hasError,
  hasResults,
  onKeyDown
}) => {
  const editorRef = useRef(null);

  const handleEditorDidMount = (editor, monaco) => {
    editorRef.current = editor;
    
    // Define professional SQL theme
    monaco.editor.defineTheme('professionalSQL', {
      base: 'vs',
      inherit: true,
      rules: [
        { token: 'keyword.sql', foreground: '#0066cc', fontStyle: 'bold' },
        { token: 'string.sql', foreground: '#22863a' },
        { token: 'comment.sql', foreground: '#6a737d', fontStyle: 'italic' },
        { token: 'number.sql', foreground: '#005cc5' },
        { token: 'operator.sql', foreground: '#d73a49' },
        { token: 'delimiter.sql', foreground: '#24292e' }
      ],
      colors: {
        'editor.background': '#ffffff',
        'editor.foreground': '#24292e',
        'editor.lineHighlightBackground': '#f6f8fa',
        'editor.selectionBackground': '#0366d625',
        'editorLineNumber.foreground': '#959da5',
        'editorLineNumber.activeForeground': '#24292e',
        'editorCursor.foreground': '#044289',
        'editor.selectionHighlightBackground': '#34d05840'
      }
    });

    monaco.languages.setLanguageConfiguration('sql', {
      comments: {
        lineComment: '--',
        blockComment: ['/*', '*/']
      },
      brackets: [
        ['{', '}'],
        ['[', ']'],
        ['(', ')']
      ],
      autoClosingPairs: [
        { open: '{', close: '}' },
        { open: '[', close: ']' },
        { open: '(', close: ')' },
        { open: '"', close: '"' },
        { open: "'", close: "'" }
      ]
    });

    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.Enter, () => {
      onExecute();
    });

    editor.onKeyDown((e) => {
      if (onKeyDown) {
        onKeyDown(e.browserEvent);
      }
    });

    editor.focus();
  };

  return (
    <div className="sql-editor-panel">
      <div className="sql-editor-header">
        <div className="editor-title-bar">
          <div className="editor-title">
            <div className="editor-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path d="M4 6h16v2H4zm0 5h16v2H4zm0 5h16v2H4z" fill="currentColor"/>
              </svg>
            </div>
            SQL Query Editor
          </div>
          <div className="editor-status">
            {isExecuting && <span className="status-badge executing">Running</span>}
            {hasError && !isExecuting && <span className="status-badge error">Error</span>}
            {hasResults && !hasError && !isExecuting && <span className="status-badge success">Success</span>}
            {!hasResults && !hasError && !isExecuting && <span className="status-badge ready">Ready</span>}
          </div>
        </div>
        
        <div className="editor-toolbar">
          <button
            className="toolbar-btn secondary"
            onClick={onGenerateHint}
            disabled={isGeneratingHint}
            title="Get AI hint for your query"
          >
            {isGeneratingHint ? (
              <>
                <div className="btn-spinner"></div>
                Getting Hint...
              </>
            ) : (
              <>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" fill="currentColor"/>
                </svg>
                Get Hint
              </>
            )}
          </button>
          
          <button
            className="toolbar-btn primary"
            onClick={onExecute}
            disabled={isExecuting || !value.trim()}
            title="Execute SQL query (Ctrl+Enter)"
          >
            {isExecuting ? (
              <>
                <div className="btn-spinner"></div>
                Executing...
              </>
            ) : (
              <>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <path d="M8 5v14l11-7z" fill="currentColor"/>
                </svg>
                Run Query
              </>
            )}
          </button>
        </div>
      </div>

      <div className="sql-editor-body">
        <div className="editor-sidebar">
          <div className="line-indicator">
            <span className="line-number">1</span>
          </div>
        </div>
        
        <div className="editor-main">
          <div className="editor-wrapper">
            <Editor
              height="100%"
              defaultLanguage="sql"
              value={value}
              onChange={onChange}
              onMount={handleEditorDidMount}
              theme="professionalSQL"
              options={{
                minimap: { enabled: false },
                fontSize: 15,
                fontFamily: 'JetBrains Mono, SF Mono, Monaco, Inconsolata, Fira Code, Consolas, monospace',
                lineNumbers: 'on',
                roundedSelection: false,
                scrollBeyondLastLine: false,
                automaticLayout: true,
                tabSize: 2,
                insertSpaces: true,
                wordWrap: 'on',
                contextmenu: true,
                selectOnLineNumbers: true,
                glyphMargin: false,
                folding: true,
                lineDecorationsWidth: 5,
                lineNumbersMinChars: 3,
                renderLineHighlight: 'line',
                cursorBlinking: 'blink',
                cursorStyle: 'line',
                renderWhitespace: 'selection',
                scrollbar: {
                  vertical: 'auto',
                  horizontal: 'auto',
                  useShadows: false,
                  verticalHasArrows: false,
                  horizontalHasArrows: false,
                  verticalScrollbarSize: 12,
                  horizontalScrollbarSize: 12
                },
                suggestOnTriggerCharacters: true,
                acceptSuggestionOnEnter: 'on',
                tabCompletion: 'on',
                wordBasedSuggestions: true,
                parameterHints: {
                  enabled: true
                },
                bracketPairColorization: {
                  enabled: true
                }
              }}
            />
          </div>
        </div>
      </div>

      <div className="sql-editor-footer">
        <div className="footer-info">
          <span className="info-item">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
              <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" stroke="currentColor" strokeWidth="2" fill="none"/>
            </svg>
            SQL
          </span>
          <span className="info-item">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
              <path d="M13 10V3L4 14h7v7l9-11h-7z" fill="currentColor"/>
            </svg>
            Press Ctrl+Enter to run
          </span>
        </div>
        
        <div className="footer-actions">
          <span className="char-count">{value.length} characters</span>
        </div>
      </div>
    </div>
  );
};

export default SQLEditor;