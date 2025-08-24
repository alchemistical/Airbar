# AirbarDashboard

A modern peer-to-peer delivery platform connecting travelers with senders for efficient luggage and parcel transportation.

## Table of Contents
- [About](#about)
- [Features](#features)
- [Getting Started](#getting-started)
- [Development](#development)
- [Git Workflow](#git-workflow)
- [Contributing](#contributing)
- [Project Structure](#project-structure)

## About

AugAirBar is a crowdshipping platform that enables travelers to monetize their luggage space by delivering packages for others. The platform provides a secure, efficient way to connect package senders with travelers going to the same destination.

## Features

- **Traveler Dashboard**: Manage trips, view package requests, track earnings
- **Sender Interface**: Post delivery requests, track packages, manage payments
- **Matching System**: Intelligent pairing of travelers and package requests
- **Secure Payments**: Integrated payment processing with escrow protection
- **Real-time Tracking**: Live updates on package status and location
- **Rating System**: User reviews and trust building
- **Mobile Responsive**: Works seamlessly on all devices

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/alchemistical/AirbarDashboard.git
   cd AirbarDashboard
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   - Navigate to `http://localhost:5173`

> **Note**: The codebase has been recently cleaned up with a consolidated structure. All source code is now under `client/src/` with clean import paths and organized documentation in `docs/`.

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Run production build
- `npm run check` - TypeScript type checking
- `npm run db:push` - Push database schema changes

## Development

### Tech Stack

- **Frontend**: React 18, TypeScript, Tailwind CSS
- **Backend**: Express.js, Node.js
- **Database**: PostgreSQL with Drizzle ORM
- **Build Tool**: Vite
- **UI Components**: Radix UI, shadcn/ui
- **Payment**: Stripe integration
- **Authentication**: Passport.js

### Environment Setup

Create a `.env` file in the root directory:

```env
NODE_ENV=development
DATABASE_URL=your_database_url
STRIPE_SECRET_KEY=your_stripe_secret
STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
```

## Git Workflow

We follow a feature branch workflow. Please adhere to these guidelines:

### Branch Naming Convention

```bash
feature/feature-name        # New features
bugfix/bug-description      # Bug fixes
hotfix/critical-issue       # Critical production fixes
release/version-number      # Release preparation
```

### Commit Message Format

Use clear, descriptive commit messages in present tense:

```bash
# Good examples
git commit -m "Add user authentication system"
git commit -m "Fix payment processing error"
git commit -m "Update dashboard navigation"

# For detailed commits
git commit -m "Implement real-time package tracking

- Add WebSocket connection for live updates
- Create tracking component with status indicators
- Integrate with existing notification system"
```

### Development Workflow

1. **Start from main branch**
   ```bash
   git checkout main
   git pull origin main
   ```

2. **Create feature branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

3. **Make changes and commit**
   ```bash
   git add .
   git commit -m "Your descriptive commit message"
   ```

4. **Push branch**
   ```bash
   git push -u origin feature/your-feature-name
   ```

5. **Create Pull Request**
   - Go to GitHub repository
   - Click "New Pull Request"
   - Select your branch and provide description
   - Request review from team members

6. **After approval and merge**
   ```bash
   git checkout main
   git pull origin main
   git branch -d feature/your-feature-name
   ```

### Common Git Commands

```bash
# Check current status
git status

# View changes
git diff

# View commit history
git log --oneline --graph

# Stash temporary changes
git stash
git stash pop

# Update from remote
git fetch origin
git pull origin main

# Undo last commit (keep changes)
git reset --soft HEAD~1
```

## Contributing

### Code Standards

- Use TypeScript for type safety
- Follow existing code style and patterns
- Write meaningful component and function names
- Add comments for complex logic
- Ensure responsive design for all components

### Before Submitting

1. **Run type check**
   ```bash
   npm run check
   ```

2. **Test your changes**
   ```bash
   npm run build
   ```

3. **Commit with descriptive message**
   ```bash
   git commit -m "Brief description of changes"
   ```

### Pull Request Guidelines

- Provide clear description of changes
- Reference any related issues
- Include screenshots for UI changes
- Ensure all checks pass
- Request review from relevant team members

## Project Structure

```
AirbarDashboard/                        # Main application (root)
├── client/                             # Frontend application
│   ├── src/                            # Single source of truth
│   │   ├── components/                 # Reusable UI components
│   │   ├── pages/                      # Route components
│   │   ├── hooks/                      # Custom React hooks
│   │   ├── lib/                        # Utilities and services
│   │   ├── types/                      # TypeScript type definitions
│   │   └── server/                     # Backend Express server
│   │       ├── index.ts                # Server entry point
│   │       ├── routes.ts               # API routes
│   │       ├── db.ts                   # Database configuration
│   │       └── services/               # Business logic services
│   ├── public/                         # Static assets
│   └── index.html                      # Entry HTML template
├── shared/                             # Shared schemas and types
├── docs/                               # Organized documentation
│   ├── product/                        # Product requirements & specs
│   ├── technical/                      # Technical documentation
│   └── assets/                         # Screenshots & attachments
├── .github/                            # GitHub workflows
│   └── workflows/                      # CI/CD pipelines
├── vite.config.ts                      # Vite configuration (updated paths)
├── tsconfig.json                       # TypeScript configuration
├── package.json                        # Dependencies and scripts
└── README.md                           # Project documentation
```

### Path Aliases

The project uses clean import aliases:
- `@/*` → `client/src/*` (main source code)
- `@/components/*` → `client/src/components/*`
- `@/pages/*` → `client/src/pages/*`
- `@/hooks/*` → `client/src/hooks/*`
- `@/lib/*` → `client/src/lib/*`
- `@/server/*` → `client/src/server/*`
- `@shared/*` → `shared/*` (shared schemas)

## Support

For questions or issues:

1. Check existing [GitHub Issues](https://github.com/alchemistical/AirbarDashboard/issues)
2. Create a new issue with detailed description
3. Include steps to reproduce for bugs
4. Use appropriate labels (bug, feature, question)

## License

This project is licensed under the MIT License.

---

**Happy Coding! 🚀**

For more detailed development guidelines, see the documentation in the `docs/` directory.