import React, { useEffect, useState } from 'react';
import { useInView } from "react-intersection-observer";
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from "framer-motion";
import logo_icon from '../Assets/logo_icon.png';
import aiGif from '../Assets/AI.gif';
import resumeGif from '../Assets/resume.gif';
// import './Homepage.css';

const sections = [
  {
    title: 'AI Tailored Resume Tool',
    desc: "AI customizes your resume for each job—matching your skills to the perfect roles and boosting your chances of landing interviews.",
  },
  {
    title: 'Resume Maker',
    desc: "Create, customize, and export professional resumes with our intuitive builder. Choose templates, edit your content, and download your resume instantly, all in one seamless workflow.",
  }
];

export default function LandingPage() {
  const [activeSection, setActiveSection] = useState(0);

  // One useInView hook per section
  const [ref0, inView0] = useInView({ threshold: 0.95 });
  const [ref1, inView1] = useInView({ threshold: 0.95 });

  useEffect(() => {
    if (inView0) setActiveSection(0);
    else if (inView1) setActiveSection(1);
  }, [inView0, inView1]);

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

      {/* Main content area at the top */}
      <section className="landing-main-content">
        <h1>Amazing Tagline Here</h1>
        <p>More amazing stuff here. Scroll down to see more.</p>
      </section>

      {/* Spacer to push scroll-animation section further down */}
      <div style={{ height: "500px" }}></div>

      {/* --- Scroll-driven animation section --- */}
      <section className="scroll-animate-section">
        <div className="scroll-layout">
          {/* LEFT: Scrollable sections */}
          <div className="left-panel">
            <div
              ref={ref0}
              className={`left-section${activeSection === 0 ? ' active' : ''}`}
            >
              <div className="section-gradient"></div>
              <div className="left-section-content">
                <img src={aiGif} alt="AI Animation" className="animated-icon" />
              </div>
            </div>
            <div
              ref={ref1}
              className={`left-section${activeSection === 1 ? ' active' : ''}`}
            >
              <div className="section-gradient"></div>
              <div className="left-section-content">
                <img src={resumeGif} alt="Resume Animation" className="animated-icon" />
              </div>
            </div>
          </div>

          {/* RIGHT: Animated content as you scroll */}
          <div className="right-panel">
            <AnimatePresence mode="wait">
              <motion.div
                 key={activeSection}
                 className="right-content"
                 initial={{ opacity: 0 }}
                 animate={{ opacity: 1, transition: { duration: 0.30, delay: 0.35 } }} // add delay here
                 exit={{ opacity: 0, transition: { duration: 0.35 } }}
                 style={{ willChange: "opacity" }}
               >
                 <h2>{sections[activeSection].title}</h2>
                 <p>{sections[activeSection].desc}</p>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </section>
    </>
  );
}
