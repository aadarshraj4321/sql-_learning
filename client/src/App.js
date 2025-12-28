import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Header from './components/Header/Header';
import AssignmentList from './components/AssignmentList/AssignmentList';
import AssignmentAttempt from './components/AssignmentAttempt/AssignmentAttempt';
import AboutPage from './components/About/AboutPage';
import Footer from './components/Footer/Footer';
import './styles/main.scss';

function AppContent() {
  const location = useLocation();
  const isAssignmentPage = location.pathname.includes('/assignment/');

  return (
    <div className="app">
      <Header />
      <main className={`main-content ${isAssignmentPage ? 'main-content--assignment' : ''}`}>
        <Routes>
          <Route path="/" element={<AssignmentList />} />
          <Route path="/assignment/:id" element={<AssignmentAttempt />} />
          <Route path="/about" element={<AboutPage />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;