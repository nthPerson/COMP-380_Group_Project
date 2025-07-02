# Backend Test Suite

This directory contains pytest tests for the Flask backend.  All tests are
self‑contained and mock external services like Firebase and OpenAI.

## Running the tests

1. Install the Python dependencies used for testing:
   ```bash
   pip install -r ../requirements.txt
   ```
   The tests require `pytest` and the packages listed in `backend/requirements.txt`.

2. From the project root, run:
   ```bash
   pytest backend/tests -q
   ```
   All tests should execute without needing any external credentials.