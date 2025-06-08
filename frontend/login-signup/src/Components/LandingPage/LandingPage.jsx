import React, { useEffect, useState, useRef } from 'react';
import { useInView } from "react-intersection-observer"; // Hook for detecting when an element is in the viewport
import { Link } from 'react-router-dom'; // React Router navigation
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from "framer-motion"; // Framer Motion for animation
import logo_icon from '../Assets/logo_icon.png';
import aiGif from '../Assets/AI.gif';
import resumeGif from '../Assets/resume.gif';

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
  // Tracks which step in the timeline is "active" based on scroll
  const [activeSection, setActiveSection] = useState(0);

  // One useInView hook per section
  const [ref0, inView0] = useInView({ threshold: 0.95 });
  const [ref1, inView1] = useInView({ threshold: 0.95 });

  // Updates the currently active section based on which part is in view
  useEffect(() => {
    if (inView0) setActiveSection(0);
    else if (inView1) setActiveSection(1);
  }, [inView0, inView1]);

  // Animations for hero section based on scroll
  const heroCompress = useMotionValue(0);// 0 = not scrolled, 1 = fully compressed
  const heroOverlayOpacity = useTransform(heroCompress, [0, 1], [0, 0.34]); // Overlay fades in with scroll

  // Handles hero compression/animation on scroll
  useEffect(() => {
    const handleScroll = () => {
      // Animate compression in the first 350px of scroll
      const progress = Math.min(1, window.scrollY / 350);
      heroCompress.set(progress);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, [heroCompress]);

  // Animate scale and vertical compression
  const heroScaleY = useTransform(heroCompress, [0, 1], [1, 0.73]); // Shrinks vertically
  const heroY = useTransform(heroCompress, [0, 1], [0, -120]); // Moves up

  // State for header styling 
  const [headerActive, setHeaderActive] = useState(false);

  // Timeline Step Component
  function TimelineStep({ isActive, stepNumber, title, content }) {
    return (
      <motion.div
        className={`timeline-step${isActive ? " active" : ""}`}
        style={{
          marginBottom: 80,
          display: "flex",
          alignItems: "center",
          flexDirection: "row",   // content left, marker right
          position: "relative"
        }}
      >

        <motion.div className="step-content">
          <h3>{title}</h3>
          <p>{content}</p>
        </motion.div>
        <div className="step-marker">{stepNumber}</div>

      </motion.div>
    );
  }
  // Based on scroll posiiton
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

  // Render component
  return (
    <>  {/* Header and links for sign up/ login*/}
      <header className={`site-banner${headerActive ? " banner-active" : ""}`}>
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

      {/* Hero section */}
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
        {/* Overlay that appears as user scrolls */}
        <motion.div
          className="hero-overlay"
          style={{
            opacity: heroOverlayOpacity,
            position: "absolute",
            inset: 0,
            background: "rgba(0,0,0,0.78)",
            pointerEvents: "none",
            zIndex: 5
          }}
        />
        {/* Hero columns for the tagline and resume */}
        <div className="hero-columns">
          {/*Left side panel of hero- tagline*/}
          <div className="hero-left">
            <h1 style={{ fontWeight: 400 }}>
              Be the <span className="tagline-highlight">"other candidate"</span> companies look for.
            </h1>
          </div>
          {/* Right side panel of hero- resume graphic(svg)*/}
          <div className="hero-right">
            <motion.svg
              width="400"
              height="480"
              viewBox="0 0 400 480"
              className="resume-svg"
            >
              {/* Gradient for graphic */}
              <defs>
                <linearGradient id="highlight" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="white" stopOpacity="0" />
                  <stop offset="35%" stopColor="white" stopOpacity="0.25" />
                  <stop offset="50%" stopColor="white" stopOpacity="0.8" />
                  <stop offset="65%" stopColor="white" stopOpacity="0.25" />
                  <stop offset="100%" stopColor="white" stopOpacity="0" />
                </linearGradient>
              </defs>

              {/* Resume paper */}
              <rect
                x="24"
                y="24"
                width="352"
                height="432"
                rx="26"
                fill="#fff"
                stroke="#B4CBEB"
                strokeWidth="5"
              />

              {/* Blue text box at the top */}
              <rect
                x="114"
                y="40"
                width="172"
                height="44"
                rx="12"
                fill="#4A90E2"
              />

              {/* Simulated lines for text */}
              {[0, 1, 2, 3, 4, 5].map((line, idx) => (
                <rect
                  key={idx}
                  x="60"
                  y={170 + idx * 38}
                  rx="7"
                  width={220 - idx * 28}
                  height="24"
                  fill="#e7effa"
                />
              ))}

              {/* Gray button */}
              <rect
                x="244"
                y="380"
                width="80"
                height="34"
                rx="10"
                fill="#c3d0e8"
              />
              <text
                x={244 + 40}           // Button x + half width
                y={376 + 22}           // Button y + about 2/3 height (for vertical center)
                textAnchor="middle"
                alignmentBaseline="middle"
                fontSize="18"
                fill="#233c65"
                fontFamily="'Fira Sans Condensed', Arial, sans-serif"
                fontWeight="bold"
              >
                Start
              </text>
            </motion.svg>
          </div>
        </div>
        {/* === END HERO COLUMNS === */}
      </motion.section>

      {/* --- TITLE BETWEEN HERO AND TIMELINE --- */}
      <div className="how-it-works-title" >
        <h2>How RezuMe Works</h2>
      </div>

      {/* ==== TIMELINE SECTION ==== */}
      <div className="timeline-row" style={{ position: "relative" }}>
        {/* Right: resume SVG illustration and connector line*/}
        <div className="hero-right" style={{ position: "relative" }}>

          {/*Resume SVG*/}
          <motion.svg
            width="400"
            height="480"
            viewBox="0 0 400 480"
            className="resume-svg"
          >
          </motion.svg>

          {/* --- Vertical connector line, connects the 'start' box from resume svg to the timeline line --- */}
          <div className="vertical-connector" />
        </div>

        {/* Timeline Steps (left side) */}
        <div className="timeline-side">

          {/*Timeline Steps*/}
          <div className="timeline-line"></div>
          {sections.map((step, idx) => (
            <TimelineStep
              key={idx}
              isActive={activeSection === idx}
              stepNumber={idx + 1}
              title={step.title}
              content={step.desc}
            />
          ))}
        </div>

      </div>


    </>
  );
}