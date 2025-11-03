# Contributing to LYAN Catering & Events

First off, thank you for considering contributing to LYAN Catering & Events! It's people like you that make this project better.

## Table of Contents

1. [Code of Conduct](#code-of-conduct)
2. [How Can I Contribute?](#how-can-i-contribute)
3. [Development Setup](#development-setup)
4. [Coding Standards](#coding-standards)
5. [Git Workflow](#git-workflow)
6. [Pull Request Process](#pull-request-process)
7. [Testing Guidelines](#testing-guidelines)
8. [Documentation](#documentation)

---

## Code of Conduct

This project and everyone participating in it is governed by our Code of Conduct. By participating, you are expected to uphold this code.

### Our Pledge

We are committed to providing a welcoming and inspiring community for all. Please be respectful and constructive in your communication.

### Expected Behavior

- Use welcoming and inclusive language
- Be respectful of differing viewpoints
- Gracefully accept constructive criticism
- Focus on what is best for the community
- Show empathy towards other community members

### Unacceptable Behavior

- Trolling, insulting/derogatory comments, and personal attacks
- Public or private harassment
- Publishing others' private information without permission
- Other conduct which could reasonably be considered inappropriate

---

## How Can I Contribute?

### Reporting Bugs

Before creating bug reports, please check existing issues to avoid duplicates.

**When reporting a bug, include:**

- **Use a clear and descriptive title**
- **Describe the exact steps to reproduce the problem**
- **Provide specific examples** (code snippets, screenshots)
- **Describe the behavior you observed** and what you expected
- **Include your environment details:**
  - OS and version
  - Node.js version
  - npm version
  - Browser and version (for frontend issues)

**Bug Report Template:**
```markdown
## Description
A clear description of the bug.

## Steps to Reproduce
1. Go to '...'
2. Click on '...'
3. Scroll down to '...'
4. See error

## Expected Behavior
What you expected to happen.

## Actual Behavior
What actually happened.

## Screenshots
If applicable, add screenshots.

## Environment
- OS: [e.g., Ubuntu 22.04]
- Node.js: [e.g., 18.17.0]
- Browser: [e.g., Chrome 119]

## Additional Context
Any other relevant information.
```

### Suggesting Features

Feature suggestions are welcome! Please provide:

- **Clear and descriptive title**
- **Detailed description of the proposed feature**
- **Use cases and examples**
- **Why this feature would be useful**
- **Possible implementation approach** (optional)

**Feature Request Template:**
```markdown
## Feature Description
A clear description of the feature.

## Problem It Solves
What problem does this feature solve?

## Proposed Solution
How should this feature work?

## Alternatives Considered
What other solutions did you consider?

## Additional Context
Any other relevant information, mockups, or examples.
```

### Contributing Code

We love pull requests! Here's how you can contribute:

1. **Find or create an issue** to work on
2. **Fork the repository**
3. **Create a feature branch**
4. **Make your changes**
5. **Test thoroughly**
6. **Submit a pull request**

---

## Development Setup

### Prerequisites

- Node.js 14+ and npm
- MongoDB (local or Atlas)
- Git

### Clone and Install

```bash
# Fork the repository on GitHub first

# Clone your fork
git clone https://github.com/YOUR_USERNAME/lyan-restaurant.git
cd lyan-restaurant

# Add upstream remote
git remote add upstream https://github.com/mame12b/lyan-restaurant.git

# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

### Environment Setup

**Backend `.env`:**
```env
PORT=5001
MONGODB_URI=mongodb://localhost:27017/lyan-restaurant-dev
JWT_SECRET=dev_jwt_secret_for_testing_only
JWT_EXPIRES_IN=15m
REFRESH_TOKEN_SECRET=dev_refresh_secret_for_testing_only
REFRESH_TOKEN_EXPIRES_IN=7d
```

**Frontend `.env`:**
```env
REACT_APP_API_URL=http://localhost:5001/api
WDS_SOCKET_IGNORE_WARNINGS=true
```

### Running Development Servers

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm start
```

### Verify Setup

- Backend: http://localhost:5001/api/health
- Frontend: http://localhost:3000

---

## Coding Standards

### JavaScript/Node.js Style Guide

We follow modern JavaScript best practices:

**General Rules:**
- Use ES6+ features (const/let, arrow functions, async/await)
- Use meaningful variable and function names
- Keep functions small and focused (single responsibility)
- Add comments for complex logic
- Handle errors properly

**Example - Good:**
```javascript
// Get user's active bookings with package details
async function getUserActiveBookings(userId) {
  try {
    const bookings = await Booking.find({
      userId,
      status: { $in: ['pending', 'confirmed'] }
    })
      .populate('packageId', 'name image price')
      .sort({ eventDate: 1 });
    
    return bookings;
  } catch (error) {
    logger.error('Error fetching user bookings:', error);
    throw new Error('Failed to fetch bookings');
  }
}
```

**Example - Bad:**
```javascript
// Don't do this
async function getBookings(id) {
  const b = await Booking.find({ userId: id, status: 'pending' }).populate('packageId');
  return b;
}
```

### React/Frontend Guidelines

**Component Structure:**
```javascript
// 1. Imports
import React, { useState, useEffect } from 'react';
import { Box, Typography, Button } from '@mui/material';
import { useAuth } from '../context/AuthContext';

// 2. Component definition
function PackageCard({ package, onSelect }) {
  // 3. Hooks
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);

  // 4. Event handlers
  const handleSelect = async () => {
    setLoading(true);
    try {
      await onSelect(package._id);
    } finally {
      setLoading(false);
    }
  };

  // 5. Effects
  useEffect(() => {
    // Side effects
  }, []);

  // 6. Render
  return (
    <Box>
      <Typography variant="h6">{package.name}</Typography>
      <Button onClick={handleSelect} disabled={loading}>
        Select Package
      </Button>
    </Box>
  );
}

// 7. PropTypes or TypeScript types (if applicable)
export default PackageCard;
```

**Best Practices:**
- Use functional components with hooks
- Extract reusable logic into custom hooks
- Use Material-UI components consistently
- Keep components small and focused
- Use meaningful prop names

### File Naming Conventions

**Backend:**
```
controllers/    → camelCase (userController.js)
models/         → PascalCase (User.js)
routes/         → camelCase (authRoutes.js)
middlewares/    → camelCase (authMiddleware.js)
utils/          → camelCase (validation.js)
```

**Frontend:**
```
components/     → PascalCase (Navbar.js, PackageCard.js)
pages/          → PascalCase (Home.js, Dashboard.js)
services/       → camelCase (api.js, authService.js)
context/        → PascalCase (AuthContext.js)
hooks/          → camelCase (useAuth.js, usePackages.js)
```

### Code Formatting

We use ESLint for linting. Before committing:

```bash
# Backend
cd backend
npm run lint

# Frontend
cd frontend
npm run lint
```

**Auto-fix issues:**
```bash
npm run lint -- --fix
```

---

## Git Workflow

### Branch Naming

Use descriptive branch names with prefixes:

```
feature/    → New features (feature/whatsapp-integration)
fix/        → Bug fixes (fix/login-validation-error)
docs/       → Documentation (docs/api-endpoints)
refactor/   → Code refactoring (refactor/booking-controller)
test/       → Adding tests (test/auth-unit-tests)
```

### Commit Messages

Write clear, descriptive commit messages:

**Format:**
```
<type>: <subject>

<body (optional)>

<footer (optional)>
```

**Types:**
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting)
- `refactor`: Code refactoring
- `test`: Adding or updating tests
- `chore`: Maintenance tasks

**Examples:**

```bash
# Good
git commit -m "feat: add WhatsApp booking confirmation"
git commit -m "fix: resolve login validation error"
git commit -m "docs: update API endpoint documentation"

# With body
git commit -m "feat: implement package filtering

Add filtering by category and event type to package list.
Includes frontend UI and backend API endpoint."

# Bad
git commit -m "fixed stuff"
git commit -m "updates"
git commit -m "WIP"
```

### Workflow Steps

**1. Sync with upstream:**
```bash
git checkout main
git fetch upstream
git merge upstream/main
git push origin main
```

**2. Create feature branch:**
```bash
git checkout -b feature/your-feature-name
```

**3. Make changes and commit:**
```bash
git add .
git commit -m "feat: add your feature"
```

**4. Keep branch updated:**
```bash
git fetch upstream
git rebase upstream/main
```

**5. Push to your fork:**
```bash
git push origin feature/your-feature-name
```

**6. Create Pull Request** on GitHub

---

## Pull Request Process

### Before Submitting

- [ ] Code follows project style guidelines
- [ ] Self-review of your code completed
- [ ] Comments added for complex logic
- [ ] No console.log() or debug code left
- [ ] Tests added/updated (if applicable)
- [ ] Documentation updated (if needed)
- [ ] No merge conflicts with main branch
- [ ] All tests pass locally
- [ ] ESLint passes without errors

### PR Template

When creating a PR, include:

```markdown
## Description
Brief description of changes.

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Related Issue
Fixes #(issue number)

## Changes Made
- Change 1
- Change 2
- Change 3

## Screenshots (if applicable)
Add screenshots of UI changes.

## Testing
How was this tested?

## Checklist
- [ ] Code follows style guidelines
- [ ] Self-review performed
- [ ] Comments added where needed
- [ ] Documentation updated
- [ ] Tests pass
- [ ] No console logs
```

### Review Process

1. **Automated checks** will run (linting, tests)
2. **Maintainer review** - wait for feedback
3. **Address feedback** - make requested changes
4. **Approval** - maintainer approves PR
5. **Merge** - maintainer merges to main

### After Your PR is Merged

1. Delete your feature branch
2. Update your local main branch
3. Celebrate! 🎉

```bash
# Delete remote branch
git push origin --delete feature/your-feature-name

# Delete local branch
git checkout main
git branch -D feature/your-feature-name

# Update main
git pull upstream main
git push origin main
```

---

## Testing Guidelines

### Backend Testing

**Unit Tests:**
```javascript
// backend/tests/controllers/auth.test.js
const { register } = require('../controllers/authController');

describe('Auth Controller', () => {
  describe('register', () => {
    it('should create new user with valid data', async () => {
      const req = {
        body: {
          name: 'Test User',
          email: 'test@example.com',
          password: 'Test123!'
        }
      };
      
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };
      
      await register(req, res);
      
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: true
        })
      );
    });
  });
});
```

**Run Tests:**
```bash
cd backend
npm test
```

### Frontend Testing

**Component Tests:**
```javascript
// frontend/src/components/__tests__/PackageCard.test.js
import { render, screen, fireEvent } from '@testing-library/react';
import PackageCard from '../PackageCard';

describe('PackageCard', () => {
  const mockPackage = {
    name: 'Wedding Package',
    price: 150000,
    image: 'https://example.com/image.jpg'
  };

  it('renders package details', () => {
    render(<PackageCard package={mockPackage} />);
    
    expect(screen.getByText('Wedding Package')).toBeInTheDocument();
    expect(screen.getByText(/150000/)).toBeInTheDocument();
  });

  it('calls onSelect when button clicked', () => {
    const mockOnSelect = jest.fn();
    render(<PackageCard package={mockPackage} onSelect={mockOnSelect} />);
    
    fireEvent.click(screen.getByText('Select'));
    
    expect(mockOnSelect).toHaveBeenCalledWith(mockPackage._id);
  });
});
```

**Run Tests:**
```bash
cd frontend
npm test
```

### Manual Testing Checklist

Before submitting PR, test:

**Authentication:**
- [ ] User registration works
- [ ] Login works with valid credentials
- [ ] Login fails with invalid credentials
- [ ] Logout works
- [ ] Protected routes redirect when not authenticated

**Packages:**
- [ ] Package list displays correctly
- [ ] Filtering works
- [ ] Package details page loads
- [ ] Admin can create/edit packages

**Bookings:**
- [ ] Booking form validates input
- [ ] Booking creation succeeds
- [ ] Payment receipt upload works
- [ ] User can view their bookings
- [ ] Admin can view all bookings

---

## Documentation

### Code Documentation

**Add JSDoc comments for functions:**
```javascript
/**
 * Create a new booking for an event
 * @param {Object} req - Express request object
 * @param {Object} req.body - Booking details
 * @param {string} req.body.packageId - Package ID
 * @param {string} req.body.eventDate - Event date (ISO format)
 * @param {number} req.body.numberOfGuests - Number of guests
 * @param {Object} res - Express response object
 * @returns {Promise<void>}
 */
async function createBooking(req, res) {
  // Implementation
}
```

### API Documentation

Update `API.md` when adding new endpoints:

```markdown
### New Endpoint Name

Description of what the endpoint does.

**Endpoint**: `POST /api/new-endpoint`

**Authentication**: Required

**Request Body**:
\```json
{
  "field": "value"
}
\```

**Success Response** (200):
\```json
{
  "success": true,
  "data": {}
}
\```
```

### README Updates

Update main `README.md` if:
- Adding new features
- Changing setup process
- Updating dependencies
- Modifying architecture

---

## Questions?

- **General questions**: Open a GitHub Discussion
- **Bug reports**: Open a GitHub Issue
- **Feature requests**: Open a GitHub Issue
- **Security issues**: Email admin@your-domain.com (don't open public issue)

---

## Recognition

Contributors will be recognized in:
- GitHub contributors page
- CONTRIBUTORS.md file (if we create one)
- Release notes for major contributions

Thank you for contributing to LYAN Catering & Events! 🎉

---

**Last Updated**: November 3, 2025
