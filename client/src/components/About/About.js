import React from 'react';

const About = () => {
  const handleContactClick = () => {
    window.location.href = 'mailto:contact@ciphersqlstudio.com?subject=CipherSQLStudio Inquiry&body=Hi there! I\'m interested in learning more about CipherSQLStudio.';
  };

  const handleLinkedInClick = () => {
    window.open('https://linkedin.com/in/yourprofile', '_blank');
  };

  return (
    <section className="about-section" id="about">
      <h2 className="about-section__title">About CipherSQLStudio</h2>
      <p className="about-section__description">
        CipherSQLStudio is a cutting-edge SQL learning platform designed to help developers master 
        database skills through interactive practice. Built with modern web technologies and 
        professional design principles, it provides an engaging learning experience that mirrors 
        real-world development environments.
      </p>

      <div className="about-section__features">
        <div className="about-section__feature">
          <div className="about-section__feature-icon">
            <svg viewBox="0 0 24 24" fill="none">
              <path d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" stroke="currentColor" strokeWidth="2"/>
            </svg>
          </div>
          <h3 className="about-section__feature-title">Professional Editor</h3>
          <p className="about-section__feature-description">
            Monaco-powered SQL editor with syntax highlighting, auto-completion, and professional IDE features.
          </p>
        </div>

        <div className="about-section__feature">
          <div className="about-section__feature-icon">
            <svg viewBox="0 0 24 24" fill="none">
              <path d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" stroke="currentColor" strokeWidth="2"/>
            </svg>
          </div>
          <h3 className="about-section__feature-title">AI-Powered Hints</h3>
          <p className="about-section__feature-description">
            Intelligent hints that guide your learning without giving away solutions, helping you understand concepts.
          </p>
        </div>

        <div className="about-section__feature">
          <div className="about-section__feature-icon">
            <svg viewBox="0 0 24 24" fill="none">
              <path d="M13 10V3L4 14h7v7l9-11h-7z" stroke="currentColor" strokeWidth="2"/>
            </svg>
          </div>
          <h3 className="about-section__feature-title">Real-time Execution</h3>
          <p className="about-section__feature-description">
            Execute SQL queries instantly with immediate feedback and beautiful result visualization.
          </p>
        </div>
      </div>

      <div className="about-section__contact">
        <h3 className="about-section__contact-title">Get in Touch</h3>
        <div className="about-section__contact-info">
          <div className="about-section__contact-item">
            <svg viewBox="0 0 24 24" fill="none">
              <path d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" stroke="currentColor" strokeWidth="2"/>
            </svg>
            contact@ciphersqlstudio.com
          </div>
          <div className="about-section__contact-item">
            <svg viewBox="0 0 24 24" fill="none">
              <path d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" stroke="currentColor" strokeWidth="2"/>
              <path d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" stroke="currentColor" strokeWidth="2"/>
            </svg>
            Available Worldwide
          </div>
        </div>
        <div className="about-section__contact-buttons">
          <button 
            className="about-section__contact-button about-section__contact-button--primary"
            onClick={handleContactClick}
          >
            <svg viewBox="0 0 24 24" fill="none">
              <path d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" stroke="currentColor" strokeWidth="2"/>
            </svg>
            Send Email
          </button>
          <button 
            className="about-section__contact-button about-section__contact-button--secondary"
            onClick={handleLinkedInClick}
          >
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
            </svg>
            Connect on LinkedIn
          </button>
        </div>
      </div>
    </section>
  );
};

export default About;