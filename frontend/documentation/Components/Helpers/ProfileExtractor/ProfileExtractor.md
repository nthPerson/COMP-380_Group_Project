# Profile Extractor Component Documentation

## Overview

A React component that extracts structured profile information from both resumes and job descriptions, then provides an interactive interface for keyword selection and similarity analysis. It serves as the core analysis engine for matching resume content with job requirements.

## Purpose

This component bridges the gap between resume content and job requirements by extracting structured data from both sources, analyzing similarities between them, and allowing users to select relevant keywords for resume optimization. It provides visual feedback on which elements match between the resume and job description.

## Core Functionality

### Dual Profile Extraction
- Extracts structured data from the user's master resume (skills, education, experience)
- Extracts requirements from job descriptions (required skills, education, experience, responsibilities)
- Uses AI services to parse unstructured text into organized profile data

### Similarity Analysis
- Compares resume elements with job requirements using semantic similarity
- Highlights matching elements with yellow background color
- Provides visual feedback on alignment between resume and job description

### Interactive Keyword Selection
- Displays all extracted elements as selectable checkboxes
- Allows users to choose which keywords to emphasize in targeted resume generation
- Maintains keyword selection state across the session
- Syncs selections with backend keyword management service

### Real-Time Visual Feedback
- Highlights matching elements between resume and job description
- Shows loading states during profile extraction and analysis
- Provides error handling and user feedback for failed operations

## Data Processing Flow

The component follows a sequential processing pattern:
1. Extracts resume profile from the master PDF document
2. Extracts job description profile from the provided text
3. Loads any previously selected keywords from the session
4. Performs similarity analysis between resume and job elements
5. Applies visual highlighting to matching elements
6. Enables interactive keyword selection for resume optimization

## User Interface

### Two-Column Layout
- Left side displays job description requirements organized by category
- Right side shows resume content organized by type (skills, education, experience)
- Both sides feature checkboxes for keyword selection

### Visual Similarity Indicators
- Yellow highlighting indicates elements that match between resume and job description
- Clear sectioned organization makes it easy to compare requirements with qualifications
- Checkbox selection allows users to choose optimization focus areas

### Loading and Error States
- Shows loading indicators while processing profile data
- Displays error messages for failed extractions or API issues
- Graceful handling of missing data or incomplete profiles

## Integration Points

The component integrates with multiple services and contexts:
- Uses the PDF context to access the master resume document
- Calls resume and job description services for AI-powered extraction
- Communicates with keyword management services for selection persistence
- Prepares data for the targeted resume generation workflow

## User Experience

Users see a side-by-side comparison of their resume content and job requirements, with matching elements highlighted automatically. They can select specific keywords and qualifications to emphasize in their targeted resume, with immediate visual feedback on what content aligns well with the job requirements.