// import React, { useEffect, useState, useRef } from 'react';
// import { useInView } from "react-intersection-observer"; // Hook for detecting when an element is in the viewport
// import { Link } from 'react-router-dom'; // React Router navigation
// import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from "framer-motion"; // Framer Motion for animation
import logo_icon from '../../Assets/logo_icon.png';
// import aiGif from '../../Assets/AI.gif';
// import resumeGif from '../../Assets/resume.gif';
import "./LandingPage.css";

import React from 'react';
import { Link } from 'react-router-dom';
import mascotVideo from '../../Assets/RezuMe_mascot_blink.mp4';
import './LandingPage.css';

// Steps for our web app 
const sections = [
  {
    title: 'Upload Your Master Resume',
    desc: 'Start by uploading your main, complete resume to the application.'
  },
  {
    title: 'Provide a Job Description',
    desc: 'Either paste the job description text or enter the URL of the job posting.'
  },
  {
    title: 'System Analyzes the Job Posting',
    desc: 'The application automatically scans the job description to identify key skills and requirements.'
  },
  {
    title: 'AI Generates a Customized Resume',
    desc: 'The system uses AI to create a tailored resume version optimized for the specific job.'
  },
  {
    title: 'Review and Edit Your Resume',
    desc: 'Preview the generated resume and make any edits or adjustments you want.'
  },
  {
    title: 'Download Your Customized Resume',
    desc: 'Once satisfied, download your personalized resume and use it for your job application.'
  }
];
// Landing page itself
export default function LandingPage() { 

  // Render component
  return (
    <> 
      <header className="site-banner">
        <div className="top-line"></div>
        <div className="banner-content">
          <div className="banner-left">
            <img src={logo_icon} alt="Logo icon" className="banner-logo" />
            <span className="banner-title">
              <span className="light-blue">Rezu</span>
              <span className="solid-blue">Me</span>
            </span>
          </div>
          <nav className="banner-nav">
            <ul>
              <li><Link to="/signup">Sign Up</Link></li>
              <li><Link to="/login">Login</Link></li>
            </ul>
          </nav>
        </div>
      </header>
      
      <section className="landing-main-content">
        <div className="mascot-container">
          <video className="mascot-video" src={mascotVideo} autoPlay loop muted />
          <h1 className="mascot-slogan">Beat the Bots, Land Your Dream Job</h1>
        </div>
      </section>

      <div className="how-it-works-title" >
        <h2>How RezuMe Works</h2>
      </div>
  
      <ol className="stepsList">
        {sections.map((step, idx) => (
          <li key={idx}>
            <h3>{step.title}</h3>
            <p>{step.desc}</p>
          </li>
        ))}
      </ol>

    </>
  );
}