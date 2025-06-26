import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import "./LandingPage.css";

const LandingPage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Create floating particles
    const createParticles = () => {
      const particlesContainer = document.querySelector('.particles');
      const particleCount = 50;

      for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        
        const size = Math.random() * 4 + 2;
        particle.style.width = size + 'px';
        particle.style.height = size + 'px';
        
        particle.style.left = Math.random() * 100 + '%';
        particle.style.top = Math.random() * 100 + '%';
        
        particle.style.animationDelay = Math.random() * 6 + 's';
        particle.style.animationDuration = (Math.random() * 3 + 3) + 's';
        
        particlesContainer.appendChild(particle);
      }
    };

    // Animate skill tags appearing
    const animateSkills = () => {
      const skillTags = document.querySelectorAll('.skill-tag');
      skillTags.forEach((tag, index) => {
        tag.style.animationDelay = (index * 0.1) + 's';
      });
    };

    createParticles();
    animateSkills();
  }, []);

  return (
    <div className="landing-page">
      <div className="particles"></div>

      <header className="header">
        <div className="logo">RezuMe</div>
        <div className="nav-buttons">
        <button className="nav-btn" onClick={() => navigate("/signup")}>Sign Up</button>
        <button className="nav-btn primary" onClick={() => navigate("/login")}>Login</button>
        </div>
      </header>

      <section className="hero">
        <div className="hero-content">
          <h1 className="hero-title">AI-Powered Resume Tailoring That Gets You Hired</h1>
          <p className="hero-subtitle">
            Transform your generic resume into a job-specific masterpiece in minutes. 
            Our AI analyzes job descriptions and crafts personalized resumes that speak 
            directly to what employers want.
          </p>
          <div className="hero-cta">
            <button className="cta-btn cta-primary">Start Tailoring Now</button>
            <button className="cta-btn cta-secondary">Watch Demo</button>
          </div>

          <div className="stats">
            <div className="stat-item">
              <span className="stat-number">95%</span>
              <div className="stat-label">More Interviews</div>
            </div>
            <div className="stat-item">
              <span className="stat-number">10K+</span>
              <div className="stat-label">Success Stories</div>
            </div>
            <div className="stat-item">
              <span className="stat-number">3x</span>
              <div className="stat-label">Faster Process</div>
            </div>
          </div>
        </div>

        <div className="ai-demo">
          <div className="resume-container">
            <div className="ai-scanner"></div>
            <div className="resume-doc resume-generic">
              <div className="resume-header">
                <div className="resume-name">John Smith</div>
                <div className="resume-title">Software Developer</div>
              </div>
              <div className="resume-section">
                <div className="section-title">Skills</div>
                <div className="skill-tags">
                  <span className="skill-tag">JavaScript</span>
                  <span className="skill-tag">Python</span>
                  <span className="skill-tag">SQL</span>
                </div>
              </div>
            </div>
            <div className="resume-doc resume-tailored">
              <div className="resume-header">
                <div className="resume-name">John Smith</div>
                <div className="resume-title">Senior React Developer</div>
              </div>
              <div className="resume-section">
                <div className="section-title">Technical Skills</div>
                <div className="skill-tags">
                  <span className="skill-tag">React.js</span>
                  <span className="skill-tag">TypeScript</span>
                  <span className="skill-tag">Node.js</span>
                  <span className="skill-tag">GraphQL</span>
                  <span className="skill-tag">AWS</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="process">
        <h2 className="process-title">How RezuMe Works</h2>
        <div className="process-steps">
          <div className="process-step">
            <div className="step-number">01</div>
            <h3 className="step-title">Upload Master Resume</h3>
            <p className="step-description">
              Start by uploading your comprehensive resume with all your experience and skills.
            </p>
          </div>
          <div className="process-step">
            <div className="step-number">02</div>
            <h3 className="step-title">Add Job Description</h3>
            <p className="step-description">
              Paste the job posting or URL, and our AI will analyze the requirements.
            </p>
          </div>
          <div className="process-step">
            <div className="step-number">03</div>
            <h3 className="step-title">AI Magic Happens</h3>
            <p className="step-description">
              Our advanced AI tailors your resume to match the specific job requirements perfectly.
            </p>
          </div>
          <div className="process-step">
            <div className="step-number">04</div>
            <h3 className="step-title">Download & Apply</h3>
            <p className="step-description">
              Get your optimized resume and apply with confidence knowing it's perfectly matched.
            </p>
          </div>
        </div>
      </section>

      {/* Enhanced Professional Features Section */}
      <section className="features">
        <div className="features-container">
          <h2 className="features-title">Why Choose RezuMe?</h2>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">🎯</div>
              <h3 className="feature-title">ATS-Optimized</h3>
              <p className="feature-description">
                Every resume is optimized to pass Applicant Tracking Systems used by 95% of Fortune 500 companies.
              </p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">⚡</div>
              <h3 className="feature-title">Lightning Fast</h3>
              <p className="feature-description">
                Get your tailored resume in under 60 seconds. No more hours of manual editing and formatting.
              </p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🧠</div>
              <h3 className="feature-title">Smart AI Analysis</h3>
              <p className="feature-description">
                Our AI understands industry-specific keywords and requirements to maximize your match rate.
              </p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">📊</div>
              <h3 className="feature-title">Success Analytics</h3>
              <p className="feature-description">
                Track your application success rate and get insights on how to improve your job search strategy.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Professional Testimonials */}
      <section className="testimonials">
        <div className="testimonials-container">
          <h2 className="testimonials-title">Trusted by Job Seekers Worldwide</h2>
          <div className="testimonials-grid">
            <div className="testimonial-card">
              <div className="testimonial-content">
                <p>"RezuMe helped me land my dream job at Google. The AI tailoring was spot-on and saved me countless hours."</p>
              </div>
              <div className="testimonial-author">
                <div className="author-info">
                  <div className="author-name">Sarah Chen</div>
                  <div className="author-role">Software Engineer at Google</div>
                </div>
              </div>
            </div>
            <div className="testimonial-card">
              <div className="testimonial-content">
                <p>"The ATS optimization feature is a game-changer. I went from 0 responses to 3 interviews in one week."</p>
              </div>
              <div className="testimonial-author">
                <div className="author-info">
                  <div className="author-name">Marcus Rodriguez</div>
                  <div className="author-role">Marketing Director</div>
                </div>
              </div>
            </div>
            <div className="testimonial-card">
              <div className="testimonial-content">
                <p>"Professional, fast, and incredibly effective. RezuMe transformed my job search completely."</p>
              </div>
              <div className="testimonial-author">
                <div className="author-info">
                  <div className="author-name">Emily Johnson</div>
                  <div className="author-role">Product Manager</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="final-cta">
        <div className="cta-container">
          <h2 className="cta-title">Ready to Transform Your Career?</h2>
          <p className="cta-subtitle">
            Join thousands of professionals who've already upgraded their job search with RezuMe
          </p>
          <button className="cta-btn cta-primary large">Get Started Free Today</button>
          <div className="cta-features">
            <span className="cta-feature">✓ No Credit Card Required</span>
            <span className="cta-feature">✓ 30-Day Money Back Guarantee</span>
            <span className="cta-feature">✓ Cancel Anytime</span>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;