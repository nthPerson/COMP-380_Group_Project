# Generate and Edit Resume Page Documentation

## Overview

A React page component that represents the final step in the resume optimization workflow. It generates AI-optimized resumes based on selected keywords, provides visual diff highlighting of changes, offers rich text editing capabilities, and enables users to save or download their finished resumes.

## Purpose

This page culminates the resume optimization process by creating a targeted resume that incorporates user-selected keywords and job-specific optimizations. It provides transparency through change visualization, editing flexibility, and multiple output options for the final resume.

## Core Functionality

### AI Resume Generation
- Generates targeted resumes using selected keywords and job description analysis
- Processes content through AI services to optimize for specific job requirements
- Creates HTML-formatted resume content suitable for editing and display

### Visual Diff Analysis
- Shows side-by-side comparison between original and optimized resume content
- Highlights specific changes made during the optimization process
- Provides transparency in the AI optimization decisions

### Rich Text Editing
- Integrates TinyDiffEditor for professional resume editing capabilities
- Maintains diff highlighting while allowing content customization
- Enables users to fine-tune AI-generated content to their preferences

### Similarity Score Tracking
- Calculates initial similarity between master resume and job description
- Measures post-generation similarity to quantify improvement
- Displays percentage improvement achieved through optimization

### Multiple Export Options
- **Download as Text**: Plain text file for basic use
- **Download as PDF**: Professional PDF format using jsPDF
- **Save to Library**: Stores optimized resume in user's document collection

## User Interface

### Page Structure
- Header with clear instructions and process explanation
- Main content area with generation controls and editing interface
- Navigation controls for workflow completion

### Dynamic Content Display
- Generation button appears when prerequisites are met
- Diff visualization shows after resume generation
- Editing interface becomes available with generated content
- Similarity metrics display with improvement calculations

### Visual Feedback
- Loading states during AI generation process
- Color-coded similarity improvements (green for positive changes)
- Professional formatting for diff highlighting and similarity scores

## Content Processing Pipeline

### Generation Workflow
1. Retrieves selected keywords from keyword service
2. Generates targeted resume HTML through AI services
3. Converts HTML to plain text for similarity analysis
4. Calculates post-generation similarity scores
5. Creates visual diff comparison between versions

### Text Processing
- Cleans generated HTML by removing extra whitespace
- Converts HTML to plain text for similarity calculations
- Formats content for diff visualization
- Maintains content integrity through processing steps

## Export and Download Features

### PDF Generation
- Uses jsPDF library for client-side PDF creation
- Applies professional formatting with proper margins
- Handles multi-page content with automatic pagination
- Optimizes scaling for readable output

### File Management
- Creates downloadable files using Blob API
- Generates temporary URLs for file downloads
- Properly handles file naming and format specifications
- Cleans up temporary resources after download

### Library Integration
- Converts edited content to PDF for storage
- Uploads generated resume to user's document library
- Refreshes PDF list to show newly saved documents
- Provides confirmation feedback for successful saves

## Integration Points

The page integrates with multiple services and contexts:
- PDF Context for master resume access and library management
- Targeted Resume Context for job description and generated content
- Keyword Service for selected optimization keywords
- Resume Service for generation and similarity calculations

## Workflow Position

This page represents the final step in the resume optimization process:
1. Upload/select master resume
2. Add job description
3. Select keywords
4. **Generate and edit targeted resume** (this page)

## User Experience

Users see their optimized resume generated with clear visual indicators of what changed from their original version. They can edit the content using professional tools while maintaining optimization insights, then choose how to save or download their final resume. The similarity metrics provide concrete evidence of optimization effectiveness, giving users confidence in the AI-enhanced result.