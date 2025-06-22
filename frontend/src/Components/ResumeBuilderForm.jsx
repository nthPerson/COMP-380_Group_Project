import React, { useState, useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '.././firebase';
import Sidebar from './Sidebar/Sidebar';
import './Sidebar/Sidebar.css';
import { ChevronLeft, ChevronRight, Plus, Trash2, User, Briefcase, GraduationCap, Award, FileText } from 'lucide-react';
import './ResumeBuilderForm.css'; // Import your CSS file for styling
import { saveResume } from "../services/resumeService"; // Import the saveResume function from your service file


const ResumeBuilderForm = () => {
  const [user, setUser] = useState(null);
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, u => setUser(u));
    return () => unsub();
  }, []);

  const [currentStep, setCurrentStep] = useState(0);
  const [newTechnicalSkill, setNewTechnicalSkill] = useState('');
  const [newSoftSkill, setNewSoftSkill] = useState('');
  const [documentName, setDocumentName] = useState('');
  const [resumeData, setResumeData] = useState({
    personalInfo: {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      address: '',
      linkedin: '',
      portfolio: ''
    },
    summary: '',
    workExperience: [{
      company: '',
      position: '',
      startDate: '',
      endDate: '',
      current: false,
      description: ''
    }],
    education: [{
      institution: '',
      degree: '',
      field: '',
      graduationDate: '',
      gpa: ''
    }],
    skills: {
      technical: [],
      soft: []
    },
    certifications: [],
    projects: []
  });
  const [fieldErrors, setFieldErrors] = useState({});

  const steps = [
    { title: 'Personal Info', icon: User },
    { title: 'Summary', icon: FileText },
    { title: 'Work Experience', icon: Briefcase },
    { title: 'Education', icon: GraduationCap },
    { title: 'Skills', icon: Award },
    { title: 'Review', icon: FileText }
  ];

  const updatePersonalInfo = (field, value) => {
    setResumeData(prev => ({
      ...prev,
      personalInfo: { ...prev.personalInfo, [field]: value }
    }));
  };

  const updateSummary = (value) => {
    setResumeData(prev => ({ ...prev, summary: value }));
  };

  const addWorkExperience = () => {
    setResumeData(prev => ({
      ...prev,
      workExperience: [...prev.workExperience, {
        company: '',
        position: '',
        startDate: '',
        endDate: '',
        current: false,
        description: ''
      }]
    }));
  };

  const updateWorkExperience = (index, field, value) => {
    setResumeData(prev => ({
      ...prev,
      workExperience: prev.workExperience.map((exp, i) => 
        i === index ? { ...exp, [field]: value } : exp
      )
    }));
  };

  const removeWorkExperience = (index) => {
    setResumeData(prev => ({
      ...prev,
      workExperience: prev.workExperience.filter((_, i) => i !== index)
    }));
  };

  const addEducation = () => {
    setResumeData(prev => ({
      ...prev,
      education: [...prev.education, {
        institution: '',
        degree: '',
        field: '',
        graduationDate: '',
        gpa: ''
      }]
    }));
  };

  const updateEducation = (index, field, value) => {
    setResumeData(prev => ({
      ...prev,
      education: prev.education.map((edu, i) => 
        i === index ? { ...edu, [field]: value } : edu
      )
    }));
  };

  const removeEducation = (index) => {
    setResumeData(prev => ({
      ...prev,
      education: prev.education.filter((_, i) => i !== index)
    }));
  };

  const addSkill = (category, skill) => {
    if (skill.trim()) {
      setResumeData(prev => ({
        ...prev,
        skills: {
          ...prev.skills,
          [category]: [...prev.skills[category], skill.trim()]
        }
      }));
    }
  };

  const removeSkill = (category, index) => {
    setResumeData(prev => ({
      ...prev,
      skills: {
        ...prev.skills,
        [category]: prev.skills[category].filter((_, i) => i !== index)
      }
    }));
  };

  // Validate fields before moving to the next step and return errors if any

  const validateFields = () => {
    const errors = {};
    if (!resumeData.personalInfo.firstName.trim()) errors.firstName = "First Name is required.";
    if (!resumeData.personalInfo.lastName.trim()) errors.lastName = "Last Name is required.";
    if (!resumeData.personalInfo.email.trim()) errors.email = "Email is required.";
    if (!resumeData.personalInfo.phone.trim()) errors.phone = "Phone is required.";
    console.log("Validation Errors:", errors); // Debugging log
    return errors;
  };
  
 // Handle previous step navigation
 const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const nextStep = () => {
    const errors = validateFields();
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      console.log("Cannot proceed to the next step due to validation errors."); // Debugging log
      return;
    }
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
      console.log("Moved to step:", currentStep + 1); // Debugging log
    }
  };

  const handleSaveResume = async () => {
    try {
      const payload = {...resumeData, fileName: documentName };
      const response = await saveResume(payload);
  
      // Show a success message with the resume ID
      alert(`Resume saved successfully! Resume ID: ${response.resumeID}`);
    } catch (error) {
      // Handle errors and show an error message
      alert(`Failed to save resume: ${error.message}`);
      console.error("Error saving resume:", error);
    }
  };

  const renderPersonalInfoStep = () => (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Personal Information</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* First Name Field */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            First Name *
          </label>
          <input
            type="text"
            value={resumeData.personalInfo.firstName}
            onChange={(e) => updatePersonalInfo('firstName', e.target.value)}
            className={`input-field ${fieldErrors.firstName ? 'input-error' : ''}`} // Added validation class
            placeholder="Enter your first name"
          />
          {fieldErrors.firstName && <p className="error-message">{fieldErrors.firstName}</p>} {/* Added error message */}
        </div>
  
        {/* Last Name Field */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Last Name *
          </label>
          <input
            type="text"
            value={resumeData.personalInfo.lastName}
            onChange={(e) => updatePersonalInfo('lastName', e.target.value)}
            className={`input-field ${fieldErrors.lastName ? 'input-error' : ''}`} // Added validation class
            placeholder="Enter your last name"
          />
          {fieldErrors.lastName && <p className="error-message">{fieldErrors.lastName}</p>} {/* Added error message */}
        </div>
  
        {/* Email Field */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Email *
          </label>
          <input
            type="email"
            value={resumeData.personalInfo.email}
            onChange={(e) => updatePersonalInfo('email', e.target.value)}
            className={`input-field ${fieldErrors.email ? 'input-error' : ''}`} // Added validation class
            placeholder="your.email@example.com"
          />
          {fieldErrors.email && <p className="error-message">{fieldErrors.email}</p>} {/* Added error message */}
        </div>
  
        {/* Phone Field */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Phone *
          </label>
          <input
            type="tel"
            value={resumeData.personalInfo.phone}
            onChange={(e) => updatePersonalInfo('phone', e.target.value)}
            className={`input-field ${fieldErrors.phone ? 'input-error' : ''}`} // Added validation class
            placeholder="(555) 123-4567"
          />
          {fieldErrors.phone && <p className="error-message">{fieldErrors.phone}</p>} {/* Added error message */}
        </div>
  
        {/* Address Field */}
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Address
          </label>
          <input
            type="text"
            value={resumeData.personalInfo.address}
            onChange={(e) => updatePersonalInfo('address', e.target.value)}
            className="input-field"
            placeholder="City, State, ZIP"
          />
        </div>
  
        {/* LinkedIn Profile Field */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            LinkedIn Profile
          </label>
          <input
            type="url"
            value={resumeData.personalInfo.linkedin}
            onChange={(e) => updatePersonalInfo('linkedin', e.target.value)}
            className="input-field"
            placeholder="https://linkedin.com/in/yourprofile"
          />
        </div>
  
        {/* Portfolio/Website Field */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Portfolio/Website
          </label>
          <input
            type="url"
            value={resumeData.personalInfo.portfolio}
            onChange={(e) => updatePersonalInfo('portfolio', e.target.value)}
            className="input-field"
            placeholder="https://yourportfolio.com"
          />
        </div>
      </div>
    </div>
  );

  const renderSummaryStep = () => (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Professional Summary</h2>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Professional Summary
        </label>
        <textarea
          value={resumeData.summary}
          onChange={(e) => updateSummary(e.target.value)}
          rows={6}
          className="input-field"
          placeholder="Write a brief professional summary highlighting your key qualifications and career objectives..."
        />
        <p className="text-sm text-gray-500 mt-1">
          Tip: Keep it concise (2-3 sentences) and focus on your most relevant achievements and skills.
        </p>
      </div>
    </div>
  );

  const renderWorkExperienceStep = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">Work Experience</h2>
        <button
          onClick={addWorkExperience}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus size={16} />
          Add Experience
        </button>
      </div>
      
      {resumeData.workExperience.map((exp, index) => (
        <div key={index} className="p-4 border border-gray-200 rounded-lg">
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-lg font-semibold text-gray-800">
              Experience {index + 1}
            </h3>
            {resumeData.workExperience.length > 1 && (
              <button
                onClick={() => removeWorkExperience(index)}
                className="p-1 text-red-600 hover:text-red-800"
              >
                <Trash2 size={16} />
              </button>
            )}
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Company *
              </label>
              <input
                type="text"
                value={exp.company}
                onChange={(e) => updateWorkExperience(index, 'company', e.target.value)}
                className="input-field"
                placeholder="Company name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Position *
              </label>
              <input
                type="text"
                value={exp.position}
                onChange={(e) => updateWorkExperience(index, 'position', e.target.value)}
                className="input-field"
                placeholder="Job title"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Start Date *
              </label>
              <input
                type="date"
                value={exp.startDate}
                onChange={(e) => updateWorkExperience(index, 'startDate', e.target.value)}
                className="input-field"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                End Date
              </label>
              <input
                type="date"
                value={exp.endDate}
                onChange={(e) => updateWorkExperience(index, 'endDate', e.target.value)}
                disabled={exp.current}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
              />
              <div className="mt-2">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={exp.current}
                    onChange={(e) => updateWorkExperience(index, 'current', e.target.checked)}
                    className="mr-2"
                  />
                  <span className="text-sm text-gray-700">Currently working here</span>
                </label>
              </div>
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Job Description
              </label>
              <textarea
                value={exp.description}
                onChange={(e) => updateWorkExperience(index, 'description', e.target.value)}
                rows={4}
                className="input-field"
                placeholder="Describe your responsibilities and achievements..."
              />
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  const renderEducationStep = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">Education</h2>
        <button
          onClick={addEducation}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus size={16} />
          Add Education
        </button>
      </div>
      
      {resumeData.education.map((edu, index) => (
        <div key={index} className="p-4 border border-gray-200 rounded-lg">
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-lg font-semibold text-gray-800">
              Education {index + 1}
            </h3>
            {resumeData.education.length > 1 && (
              <button
                onClick={() => removeEducation(index)}
                className="p-1 text-red-600 hover:text-red-800"
              >
                <Trash2 size={16} />
              </button>
            )}
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Institution *
              </label>
              <input
                type="text"
                value={edu.institution}
                onChange={(e) => updateEducation(index, 'institution', e.target.value)}
                className="input-field"
                placeholder="University/College name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Degree *
              </label>
              <input
                type="text"
                value={edu.degree}
                onChange={(e) => updateEducation(index, 'degree', e.target.value)}
                className="input-field"
                placeholder="Bachelor's, Master's, etc."
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Field of Study *
              </label>
              <input
                type="text"
                value={edu.field}
                onChange={(e) => updateEducation(index, 'field', e.target.value)}
                className="input-field"
                placeholder="Computer Science, Business, etc."
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Graduation Date
              </label>
              <input
                type="date"
                value={edu.graduationDate}
                onChange={(e) => updateEducation(index, 'graduationDate', e.target.value)}
                className="input-field"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                GPA (Optional)
              </label>
              <input
                type="text"
                value={edu.gpa}
                onChange={(e) => updateEducation(index, 'gpa', e.target.value)}
                className="input-field"
                placeholder="3.5/4.0"
              />
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  const renderSkillsStep = () => {
    return (
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-gray-800">Skills</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-3">Technical Skills</h3>
            <div className="flex gap-2 mb-3">
              <input
                type="text"
                value={newTechnicalSkill}
                onChange={(e) => setNewTechnicalSkill(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    addSkill('technical', newTechnicalSkill);
                    setNewTechnicalSkill('');
                  }
                }}
                className="flex-1 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Add a technical skill"
              />
              <button
                onClick={() => {
                  addSkill('technical', newTechnicalSkill);
                  setNewTechnicalSkill('');
                }}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                <Plus size={16} />
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {resumeData.skills.technical.map((skill, index) => (
                <span
                  key={index}
                  className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                >
                  {skill}
                  <button
                    onClick={() => removeSkill('technical', index)}
                    className="ml-1 text-blue-600 hover:text-blue-800"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-3">Soft Skills</h3>
            <div className="flex gap-2 mb-3">
              <input
                type="text"
                value={newSoftSkill}
                onChange={(e) => setNewSoftSkill(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    addSkill('soft', newSoftSkill);
                    setNewSoftSkill('');
                  }
                }}
                className="flex-1 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Add a soft skill"
              />
              <button
                onClick={() => {
                  addSkill('soft', newSoftSkill);
                  setNewSoftSkill('');
                }}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
              >
                <Plus size={16} />
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {resumeData.skills.soft.map((skill, index) => (
                <span
                  key={index}
                  className="inline-flex items-center gap-1 px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm"
                >
                  {skill}
                  <button
                    onClick={() => removeSkill('soft', index)}
                    className="ml-1 text-green-600 hover:text-green-800"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderReviewStep = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-800">Review Your Resume</h2>
      
      <div className="bg-gray-50 p-6 rounded-lg">
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-2">Personal Information</h3>
          <p className="text-gray-700">
            {resumeData.personalInfo.firstName} {resumeData.personalInfo.lastName}
          </p>
          <p className="text-gray-600">{resumeData.personalInfo.email} | {resumeData.personalInfo.phone}</p>
          {resumeData.personalInfo.address && (
            <p className="text-gray-600">{resumeData.personalInfo.address}</p>
          )}
        </div>

        {resumeData.summary && (
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Professional Summary</h3>
            <p className="text-gray-700">{resumeData.summary}</p>
          </div>
        )}

        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-2">Work Experience</h3>
          {resumeData.workExperience.map((exp, index) => (
            <div key={index} className="mb-4">
              <h4 className="font-medium text-gray-800">{exp.position} at {exp.company}</h4>
              <p className="text-gray-600 text-sm">
                {exp.startDate} - {exp.current ? 'Present' : exp.endDate}
              </p>
              {exp.description && <p className="text-gray-700 mt-1">{exp.description}</p>}
            </div>
          ))}
        </div>

        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-2">Education</h3>
          {resumeData.education.map((edu, index) => (
            <div key={index} className="mb-2">
              <h4 className="font-medium text-gray-800">{edu.degree} in {edu.field}</h4>
              <p className="text-gray-600">{edu.institution}</p>
              {edu.gpa && <p className="text-gray-600 text-sm">GPA: {edu.gpa}</p>}
            </div>
          ))}
        </div>

        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-2">Skills</h3>
          {resumeData.skills.technical.length > 0 && (
            <div className="mb-2">
              <h4 className="font-medium text-gray-700">Technical:</h4>
              <p className="text-gray-600">{resumeData.skills.technical.join(', ')}</p>
            </div>
          )}
          {resumeData.skills.soft.length > 0 && (
            <div>
              <h4 className="font-medium text-gray-700">Soft Skills:</h4>
              <p className="text-gray-600">{resumeData.skills.soft.join(', ')}</p>
            </div>
        )}
      </div>

      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          PDF File Name (optional)
        </label>
        <input
          type="text"
          value={documentName}
          onChange={(e) => setDocumentName(e.target.value)}
          className="input-field"
          placeholder="MyResume.pdf"
        />
      </div>
      </div>

      <button
        onClick={handleSaveResume}
        className="w-full py-3 px-6 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition-colors"
      >
        Save Resume
      </button>
    </div>
  );

  const renderCurrentStep = () => {
    switch(currentStep) {
      case 0: return renderPersonalInfoStep();
      case 1: return renderSummaryStep();
      case 2: return renderWorkExperienceStep();
      case 3: return renderEducationStep();
      case 4: return renderSkillsStep();
      case 5: return renderReviewStep();
      default: return renderPersonalInfoStep();
    }
  };

  return (
    <div className="resume-builder-page">      {/* Progress Bar */}
      <Sidebar user={user} />
      <div className="resume-builder-content">
      <div className="mb-8">
      <div className="progress-bar">
          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <div
                key={index}
                className={`flex items-center ${
                  index < steps.length - 1 ? 'flex-1' : ''
                }`}
              >
                <div
                 className={`progress-step-icon ${index <= currentStep ? 'active' : ''}`}
                >
                  <Icon size={16} />
                </div>
                <span className={`progress-step-title ${index <= currentStep ? 'active' : ''}`}>
                  {step.title}
                </span>
                {index < steps.length - 1 && (
                  <div className={`flex-1 h-0.5 mx-4 ${
                    index < currentStep ? 'bg-blue-600' : 'bg-gray-300'
                  }`} />
                )}
              </div>
            );
          })}
        </div>
        <div className="text-sm text-gray-600">
          Step {currentStep + 1} of {steps.length}
        </div>
      </div>

      {/* Current Step Content */}
      <div className="mb-8">
        {renderCurrentStep()}
      </div>

      {/* Navigation Buttons */}
      <div className="flex justify-between">
        <button
          onClick={prevStep}
          disabled={currentStep === 0}
          className={`button button-secondary ${currentStep === 0 ? 'button-disabled' : ''}`}
        >
          <ChevronLeft size={16} />
          Previous
        </button>

        <button
          onClick={currentStep === steps.length - 1 ? handleSaveResume : nextStep}
          className="button button-primary"
        >
          {currentStep === steps.length - 1 ? 'Save Resume' : 'Next'}
          {currentStep !== steps.length - 1 && <ChevronRight size={16} />}
        </button>
      </div>
    </div>
    </div>
  );
};

export default ResumeBuilderForm;