# Resume Diff Viewer Component Documentation

## Overview

A React component that visualizes differences between resume versions by displaying structured content with highlighted changes. It renders an Abstract Syntax Tree (AST) representation of resume content with visual indicators showing additions and modifications.

## Purpose

This component allows users to see exactly what changes were made when generating a targeted resume from their master resume. It provides a clear, visual comparison that helps users understand how their resume was optimized for a specific job description.

## Core Functionality

### Structured Content Rendering
- Renders different content types (headings, headers, paragraphs, lists)
- Maintains proper HTML semantic structure for accessibility
- Preserves content hierarchy and formatting

### Diff Visualization
- Highlights added text with special CSS styling (`diff-added` class)
- Shows unchanged content in normal styling
- Processes text chunks to identify and mark changes

### Content Type Support
- **Headers**: Renders as h2 elements for major sections
- **Headings**: Renders as h3 elements for subsections  
- **Paragraphs**: Standard paragraph content with diff highlighting
- **Lists**: Unordered lists with individual list items

### Change Detection
- Processes AST nodes with embedded diff information
- Identifies text chunks that were added during optimization
- Applies visual styling to distinguish new content from existing content

## Data Structure

### AST Node Format
The component expects an array of AST nodes with the following structure:
- `type`: Content type (heading, header, paragraph, list)
- `diff`: Array of text chunks with change information
- `items`: List items for list-type content
- `level`: Hierarchical level (unused in current implementation)
- `text`: Raw text content (unused in current implementation)

### Diff Chunk Format
Text chunks contain:
- `text`: The actual text content
- `added`: Boolean indicating if this text was added during optimization

## Visual Design

### CSS Styling
- Uses `ResumeDiffViewer.css` for component-specific styling
- Applies `diff-added` class to highlight new content
- Maintains clean, readable formatting for document content

### Change Highlighting
- Added content receives special visual treatment
- Unchanged content appears in standard formatting
- Clear visual distinction helps users identify optimizations

## Integration Context

This component is part of the resume optimization workflow, specifically used to show users how their resume was modified during the targeted generation process. It helps users understand and review the AI-generated changes before finalizing their optimized resume.

## User Experience

Users can review their optimized resume with clear visual indicators showing what content was added or modified. This transparency helps them understand the optimization process and gives them confidence in the AI-generated changes while allowing them to identify areas they might want to further customize.