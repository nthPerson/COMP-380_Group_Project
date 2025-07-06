# Select Keywords Page Documentation

## Overview

A React page component that provides the keyword selection interface in the resume optimization workflow. It displays extracted profile data from both resumes and job descriptions, allowing users to select specific keywords for targeted resume generation.

## Purpose

This page serves as a critical step in the resume optimization process where users review AI-extracted profile information and manually select the most relevant keywords to emphasize in their tailored resume. It bridges the gap between automated analysis and user-controlled customization.

## Core Functionality

### Authentication Management
- Monitors Firebase authentication state to ensure user access
- Displays loading state while authentication is being verified
- Provides sign-out functionality through the sidebar

### Workflow Prerequisites Validation
- Requires both a master resume selection and job description content
- Shows warning message when prerequisites are missing
- Prevents progression to next step without required inputs

### Profile Analysis Interface
- Displays the ProfileExtractor component when prerequisites are met
- Shows side-by-side comparison of resume and job description profiles
- Enables interactive keyword selection with visual similarity highlighting

### Navigation Controls
- **Back Button**: Returns to previous step in the workflow
- **Next Button**: Proceeds to resume generation, disabled until prerequisites are met
- Navigation buttons provide clear workflow progression

## User Interface

### Page Layout
- Uses standard layout with sidebar navigation
- Main content area focuses on keyword selection process
- Header provides clear page title and instructional information

### Informational Elements
- **InfoBox**: Explains the keyword selection process and yellow highlighting system
- **WarningBox**: Alerts users when prerequisites are missing
- Clear visual hierarchy guides users through the process

### Conditional Content Display
- Shows ProfileExtractor when ready for keyword selection
- Displays warning message when setup is incomplete
- Navigation buttons reflect current workflow state

## Integration Points

The page integrates with multiple contexts and components:
- PDF Context for master resume information
- Targeted Resume Context for job description content
- ProfileExtractor for the main keyword selection interface
- Sidebar for consistent navigation and user controls

## Workflow Position

This page represents the third step in the resume optimization process:
1. Upload/select master resume
2. Provide job description
3. **Select keywords** (this page)
4. Generate and edit targeted resume

## User Experience

Users arrive at this page after providing a job description and selecting a master resume. They see a detailed analysis of how their resume aligns with job requirements, with matching elements highlighted. They can then select specific keywords to emphasize before proceeding to generate their optimized resume.