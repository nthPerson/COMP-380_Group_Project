import React, { useEffect, useState, useRef } from 'react';
import { useInView } from "react-intersection-observer";
import { Link } from 'react-router-dom';
import { motion, useMotionValue, useTransform } from "framer-motion";
import bunnyLogo from '../../Assets/Bunny_Icon.png';
import "./LandingPage.css";

// Enhanced steps with icons
const sections = [
  {
    title: 'Upload Your Master Resume',
    desc: 'Start by uploading your main, complete resume to the application.',
    icon: '📄'
  },
  {
    title: 'Provide a Job Description',
    desc: 'Either paste the job description text or enter the URL of the job posting.',
    icon: '💼'
  },
  {
    title: 'System Analyzes the Job Posting',
    desc: 'The application automatically scans the job description to identify key skills and requirements.',
    icon: '🔍'
  },
  {
    title: 'AI Generates a Customized Resume',
    desc: 'The system uses AI to create a tailored resume version optimized for the specific job.',
    icon: '🤖'
  },
  {
    title: 'Review and Edit Your Resume',
    desc: 'Preview the generated resume and make any edits or adjustments you want.',
    icon: '✏️'
  },
  {
    title: 'Download Your Customized Resume',
    desc: 'Once satisfied, download your personalized resume and use it for your job application.',
    icon: '⬇️'
  }
];

export default function LandingPage() {
  const [activeSection, setActiveSection] = useState(0);
  const [ref0, inView0] = useInView({ threshold: 0.95 });
  const [ref1, inView1] = useInView({ threshold: 0.95 });

  useEffect(() => {
    if (inView0) setActiveSection(0);
    else if (inView1) setActiveSection(1);
  }, [inView0, inView1]);

  // Enhanced scroll animations
  const heroCompress = useMotionValue(0);
  const heroOverlayOpacity = useTransform(heroCompress, [0, 1], [0, 0.4]);
  const parallaxY = useTransform(heroCompress, [0, 1], [0, -50]);

  useEffect(() => {
    const handleScroll = () => {
      const progress = Math.min(1, window.scrollY / 350);
      heroCompress.set(progress);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, [heroCompress]);

  const heroScaleY = useTransform(heroCompress, [0, 1], [1, 0.73]);
  const heroY = useTransform(heroCompress, [0, 1], [0, -120]);

  const [headerActive, setHeaderActive] = useState(false);

  // Enhanced Timeline Step Component
  function TimelineStep({ isActive, stepNumber, title, content, icon }) {
    return (
      <motion.div
        className={`timeline-step${isActive ? " active" : ""}`}
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: stepNumber * 0.1 }}
        style={{
          marginBottom: 80,
          display: "flex",
          alignItems: "center",
          flexDirection: "row",
          position: "relative"
        }}
      >
        <motion.div 
          className="step-content"
          whileHover={{ scale: 1.02, boxShadow: "0 8px 32px rgba(74,144,226,0.15)" }}
          transition={{ duration: 0.3 }}
        >
          <div className="step-icon">{icon}</div>
          <h3>{title}</h3>
          <p>{content}</p>
        </motion.div>
        <motion.div 
          className="step-marker"
          whileHover={{ scale: 1.1 }}
          transition={{ duration: 0.2 }}
        >
          {stepNumber}
        </motion.div>
      </motion.div>
    );
  }

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 320) {
        setHeaderActive(true);
      } else {
        setHeaderActive(false);
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      {/* Enhanced Header with Bunny Logo */}
      <header className={`site-banner${headerActive ? " banner-active" : ""}`}>
        <div className="top-line"></div>
        <div className="banner-content">
          <motion.div 
            className="banner-left"
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.2 }}
          >
            <img src={bunnyLogo} alt="RezuMe Bunny Logo" className="banner-logo" />
            <span className="banner-title">
              <span className="light-blue">Rezu</span>
              <span className="solid-blue">Me</span>
            </span>
          </motion.div>
          <nav className="banner-nav">
            <ul>
              <li>
                <Link to="/signup" className="nav-button signup-btn">
                  Sign Up
                </Link>
              </li>
              <li>
                <Link to="/login" className="nav-button login-btn">
                  Login
                </Link>
              </li>
            </ul>
          </nav>
        </div>
      </header>

      {/* Enhanced Hero section */}
      <motion.section
        className="landing-main-content"
        style={{
          scaleY: heroScaleY,
          y: heroY,
          transformOrigin: "top center",
          position: "relative",
          zIndex: 2,
          willChange: "transform"
        }}
      >
        {/* Animated background particles */}
        <div className="particles-container">
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              className="particle"
              animate={{
                y: [-20, 20, -20],
                x: [-10, 10, -10],
                rotate: [0, 180, 360]
              }}
              transition={{
                duration: 4 + i,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              style={{
                left: `${15 + i * 15}%`,
                top: `${20 + i * 10}%`
              }}
            />
          ))}
        </div>

        <motion.div
          className="hero-overlay"
          style={{
            opacity: heroOverlayOpacity,
            position: "absolute",
            inset: 0,
            background: "linear-gradient(135deg, rgba(74,144,226,0.1), rgba(111,208,223,0.1))",
            pointerEvents: "none",
            zIndex: 5
          }}
        />

        <div className="hero-columns">
          <motion.div 
            className="hero-left"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <h1 className="hero-title">
              Beat The <span className="tagline-highlight"> Bots, </span> Land Your Dream Job.
            </h1>
            <p className="hero-subtitle">
              Transform your resume with AI-powered customization that matches exactly what employers want.
            </p>
            <motion.div 
              className="cta-buttons"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
            >
              <Link to="/signup" className="cta-primary">
                Get Started Free
                <span className="cta-arrow">→</span>
              </Link>
            </motion.div>
          </motion.div>

          <motion.div 
            className="hero-right"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            style={{ y: parallaxY }}
          >
            <motion.svg
              width="400"
              height="480"
              viewBox="0 0 400 480"
              className="resume-svg"
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.3 }}
            >
              <defs>
                <linearGradient id="highlight" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="white" stopOpacity="0" />
                  <stop offset="35%" stopColor="white" stopOpacity="0.25" />
                  <stop offset="50%" stopColor="white" stopOpacity="0.8" />
                  <stop offset="65%" stopColor="white" stopOpacity="0.25" />
                  <stop offset="100%" stopColor="white" stopOpacity="0" />
                </linearGradient>
                <filter id="glow">
                  <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
                  <feMerge> 
                    <feMergeNode in="coloredBlur"/>
                    <feMergeNode in="SourceGraphic"/>
                  </feMerge>
                </filter>
              </defs>

              <motion.rect
                x="24"
                y="24"
                width="352"
                height="432"
                rx="26"
                fill="#fff"
                stroke="#B4CBEB"
                strokeWidth="5"
                filter="url(#glow)"
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.6 }}
              />

              <motion.rect
                x="114"
                y="40"
                width="172"
                height="44"
                rx="12"
                fill="#4A90E2"
                initial={{ width: 0 }}
                animate={{ width: 172 }}
                transition={{ duration: 0.8, delay: 0.3 }}
              />

              {[0, 1, 2, 3, 4, 5].map((line, idx) => (
                <motion.rect
                  key={idx}
                  x="60"
                  y={170 + idx * 38}
                  rx="7"
                  width={220 - idx * 28}
                  height="24"
                  fill="#e7effa"
                  initial={{ width: 0 }}
                  animate={{ width: 220 - idx * 28 }}
                  transition={{ duration: 0.6, delay: 0.5 + idx * 0.1 }}
                />
              ))}

              <motion.rect
                x="244"
                y="380"
                width="80"
                height="34"
                rx="10"
                fill="#4A90E2"
                whileHover={{ fill: "#357ABD" }}
                transition={{ duration: 0.2 }}
              />
              <text
                x={244 + 40}
                y={376 + 22}
                textAnchor="middle"
                alignmentBaseline="middle"
                fontSize="18"
                fill="white"
                fontFamily="'Fira Sans Condensed', Arial, sans-serif"
                fontWeight="bold"
              >
                Start
              </text>
            </motion.svg>
          </motion.div>
        </div>
      </motion.section>

      {/* Enhanced title section */}
      <motion.div 
        className="how-it-works-title"
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
      >
        <h2>How RezuMe Works</h2>
        <p className="section-subtitle">Transform your job search in 6 simple steps</p>
      </motion.div>

      {/* Enhanced Timeline section */}
      <div className="timeline-row" style={{ position: "relative" }}>
        <div className="hero-right" style={{ position: "relative" }}>
          <motion.svg
            width="400"
            height="480"
            viewBox="0 0 400 480"
            className="resume-svg timeline-svg"
          >
          </motion.svg>
          <div className="vertical-connector" />
        </div>

        <div className="timeline-side">
          <div className="timeline-line"></div>
          {sections.map((step, idx) => (
            <TimelineStep
              key={idx}
              isActive={activeSection === idx}
              stepNumber={idx + 1}
              title={step.title}
              content={step.desc}
              icon={step.icon}
            />
          ))}
        </div>
      </div>

      {/* Enhanced footer section */}
      <motion.section 
        className="footer-section"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
      >
        <div className="footer-content">
          <h3>Ready to get started?</h3>
          <p>Join thousands of job seekers who have successfully landed their dream jobs with RezuMe.</p>
          <Link to="/signup" className="footer-cta">
            Start Your Journey Today
          </Link>
        </div>
      </motion.section>
    </>
  );
}