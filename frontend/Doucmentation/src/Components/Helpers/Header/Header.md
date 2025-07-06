# Header Component Documentation

## Overview

A React header component that displays user authentication status and profile information. It shows the user's avatar and username when logged in, and provides navigation to the user profile page. The component integrates with Firebase Authentication and the profile service to display current user data.

## Purpose

The header serves as a persistent navigation element that indicates login status and provides quick access to user profile management. It appears across the application to maintain consistent user context and navigation.

## Core Functionality

### Authentication State Monitoring
- Listens to Firebase authentication state changes in real-time
- Automatically updates when users log in or out
- Hides the header completely when no user is authenticated

### Profile Data Loading
- Fetches user profile information from Firestore after authentication
- Retrieves custom username and profile picture URL
- Falls back to Firebase user data or defaults if profile data is unavailable

### User Display
- Shows the user's profile picture (or default avatar if none set)
- Displays username with fallback hierarchy: custom username → Firebase displayName → "User"
- Provides visual indication of current user identity

### Navigation Integration
- Links to the user profile page when clicked
- Uses React Router for seamless navigation
- Maintains accessibility with proper link semantics

## Data Flow

The component first waits for Firebase authentication to determine if a user is logged in. Once authenticated, it fetches additional profile data from the profile service to get custom user information like usernames and profile pictures. It gracefully handles errors and provides sensible defaults throughout the process.

## User Experience

Users see their profile information persistently displayed in the header, giving them confidence about their login status and easy access to profile management. The component provides immediate visual feedback about authentication state and maintains consistency across the application.