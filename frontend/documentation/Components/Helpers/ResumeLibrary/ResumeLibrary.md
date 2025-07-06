# Resume Library Component Documentation

## Overview

A React component that displays and manages the user's collection of resume documents. It provides a comprehensive interface for viewing, organizing, and managing both uploaded and AI-generated resumes, with special handling for master resume designation.

## Purpose

This component serves as the central hub for resume document management within the resume optimization platform. Users can view their resume collection, designate master resumes for optimization workflows, preview documents, and manage their resume library through deletion and organization features.

## Core Functionality

### Resume Collection Display
- Lists all user resumes in an organized, visual format
- Shows both uploaded and AI-generated resumes in a unified view
- Displays resume filenames and creation metadata
- Provides visual distinction between master and regular resumes

### Master Resume Management
- Highlights the currently designated master resume with green background
- Allows users to set any resume as their master template
- Shows warning when no master resume is selected
- Prevents master designation button for the currently selected master

### Document Operations
- **View**: Opens resumes in a modal viewer using signed URLs
- **Delete**: Removes resumes from the library with confirmation
- **Set as Master**: Designates resumes as the primary template for optimization

### Filtering Capabilities
- Optional filtering to show/hide generated resumes
- Optional filtering to show/hide uploaded resumes
- Configurable display options through component props

### Modal Integration
- Integrates with ResumeViewerModal for secure document preview
- Handles signed URL generation for safe PDF viewing
- Manages modal state for seamless user experience

## State Management

### PDF Context Integration
- Uses the PDF context to access resume data and operations
- Leverages shared state for resume list, master selection, and loading states
- Provides consistent data across the application

### Local Modal State
- Manages modal open/close state for document viewing
- Tracks the currently selected resume URL for preview
- Handles error states for failed URL generation

## User Interface

### Visual Organization
- Card-based layout for each resume document
- Green highlighting for master resume identification
- Clean, organized list structure with consistent spacing
- Status messages for user feedback

### Action Buttons
- **Set as Master**: Only shown for non-master resumes
- **View**: Available for all resumes to open in modal
- **Delete**: Red-colored deletion option for all resumes

### Loading and Status Handling
- Shows loading indicators during data fetching
- Displays status messages for user operations
- Handles empty state when no resumes are available

## Integration Points

The component integrates with multiple parts of the system:
- PDF Context for resume data and operations
- Resume service for signed URL generation
- ResumeViewerModal for document preview
- Master resume workflows for optimization processes

## User Experience

Users see their resume collection in an organized, manageable format. They can quickly identify their master resume, preview any document, and perform management operations. The interface provides clear visual feedback for all operations and maintains a clean, professional appearance that matches the overall application design.