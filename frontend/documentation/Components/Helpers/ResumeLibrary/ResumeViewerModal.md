# Resume Viewer Modal Component Documentation

## Overview

A React modal component that provides full-screen PDF viewing capabilities for resume documents. It uses react-modal to create an overlay interface that allows users to preview their resumes in a professional, distraction-free environment.

## Purpose

This component enables users to view their resume PDFs directly within the application without needing to download files or open external applications. It provides a seamless preview experience that integrates with the resume management workflow.

## Core Functionality

### Modal Interface
- Creates a full-screen overlay modal for document viewing
- Provides professional styling with modern design elements
- Handles modal open/close states through props
- Sets accessibility attributes for screen readers

### PDF Display
- Renders PDF documents using an embedded iframe
- Accepts signed URLs for secure document access
- Provides full-width, full-height viewing area
- Implements lazy loading for performance optimization

### User Controls
- **Close Button**: Prominently placed close button with hover effects
- **Overlay Click**: Allows closing by clicking outside the content area
- **Keyboard Navigation**: Supports standard modal keyboard interactions

### Visual Design
- Modern, clean interface with rounded corners and shadows
- Professional color scheme with subtle backgrounds
- Responsive design that adapts to different screen sizes
- Smooth transitions and hover effects for interactive elements

## User Interface Elements

### Header Section
- Clean header with "Resume Preview" title
- Close button with interactive hover states
- Subtle border and background styling for visual separation

### Content Area
- Full-height iframe for PDF display
- Loading overlay (currently not fully implemented)
- Background styling that complements the PDF content

### Accessibility Features
- App element configuration for screen reader compatibility
- Proper content labeling for modal identification
- Keyboard navigation support through react-modal

## Technical Implementation

### React Modal Integration
- Uses react-modal library for robust modal functionality
- Configures app element for accessibility compliance
- Provides overlay and content styling through inline styles

### PDF Viewing
- Embeds PDFs using standard iframe element
- Relies on browser's built-in PDF viewing capabilities
- Handles signed URLs for secure cloud storage access

### Responsive Design
- Uses viewport units (vh, vw) for responsive sizing
- Maintains aspect ratios across different screen sizes
- Provides maximum viewing area while preserving usability

## Integration Points

The component integrates with:
- Resume Library for document selection and viewing
- Resume services for signed URL generation
- PDF Context for document management workflows
- Browser PDF viewers for document rendering

## User Experience

Users can click "View" on any resume in their library to open this modal, which provides a clean, professional viewing experience. The modal takes up most of the screen real estate to maximize document visibility while providing easy access to close the viewer and return to the resume library.