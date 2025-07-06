# TinyDiff Editor Component Documentation

## Overview

A React component that provides a rich text editor interface using TinyMCE, specifically configured for editing resume content with diff highlighting capabilities. It allows users to edit AI-generated resume content while preserving visual indicators of changes made during optimization.

## Purpose

This component enables users to fine-tune their AI-generated targeted resumes through a professional rich text editor. It maintains diff highlighting to show which content was added during optimization while providing full editing capabilities for customization.

## Core Functionality

### Rich Text Editing
- Provides full WYSIWYG editing capabilities through TinyMCE
- Supports common formatting options (bold, italic, underline, alignment)
- Includes list creation and management (bulleted and numbered lists)
- Offers table creation and editing tools

### Diff Preservation
- Maintains `.diff-added` styling for newly added content
- Preserves change indicators while allowing content modification
- Custom CSS styling highlights optimized content with light green background

### Content Management
- Accepts HTML content as initial value
- Provides real-time content updates through onChange callback
- Exposes methods to parent components for content retrieval and manipulation

### Imperative API
- Uses forwardRef and useImperativeHandle for parent component control
- Exposes `getContent()` method for retrieving editor content
- Provides `setContent()` method for programmatically updating content

## Configuration Features

### Editor Setup
- Configured for resume editing with appropriate font sizing (12px-24px range)
- Uses professional font family (Helvetica, Arial, sans-serif)
- Set to 600px height for comfortable editing experience

### Toolbar Configuration
- Streamlined toolbar focused on resume formatting needs
- Includes essential formatting tools without overwhelming options
- Provides undo/redo, styles, font sizing, and alignment controls

### Content Validation
- Allows all HTML tags and attributes for maximum flexibility
- Special handling for span elements with class attributes
- Maintains content integrity during editing operations

### Styling Integration
- Custom CSS for professional resume appearance
- Diff highlighting with light green background for added content
- Consistent typography and spacing for resume sections

## API Integration

### Environment Configuration
- Uses `REACT_APP_TINY_MCE_API_KEY` environment variable for TinyMCE licensing
- Requires proper API key configuration for editor functionality

### Parent Component Interface
- Accepts `value` prop for initial HTML content
- Provides `onEditorChange` callback for real-time content updates
- Exposes imperative methods through ref for advanced control

## User Experience

Users can edit their AI-generated resume content using familiar word processor-style tools while still seeing which content was added during optimization. The editor provides professional formatting capabilities suitable for creating polished resume documents, with the added benefit of preserving optimization insights through visual diff indicators.