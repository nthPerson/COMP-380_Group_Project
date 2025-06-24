import React, { useEffect, useState, useRef } from 'react';
import { useInView } from "react-intersection-observer"; // Hook for detecting when an element is in the viewport
import { Link } from 'react-router-dom'; // React Router navigation
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from "framer-motion"; // Framer Motion for animation
import logo_icon from '../Assets/logo_icon.png';
import aiGif from '../Assets/AI.gif';
import resumeGif from '../Assets/resume.gif';
import "./LandingPage.css";

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
        </div>
        {/* === END HERO COLUMNS === */}
      </motion.section>



    </>
  );
}