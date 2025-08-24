# Contributing to Airbar

*Code contribution and review guidelines for the Airbar crowdshipping platform*

---

## 🤝 Welcome Contributors

Thank you for your interest in contributing to Airbar! This guide will help you understand our development process, coding standards, and how to submit quality contributions.

---

## 🚀 Quick Start

### Prerequisites
- **Node.js**: 18+ LTS
- **PNPM**: 8+ (package manager)
- **Docker**: Latest version
- **Git**: Latest version
- **PostgreSQL**: 15+ (or use Docker)

### Initial Setup
```bash
# 1. Fork and clone the repository
git clone https://github.com/your-username/AirbarDashboard.git
cd AirbarDashboard

# 2. Install dependencies
pnpm install

# 3. Setup environment
cp .env.example .env
# Configure DATABASE_URL, JWT_SECRET, etc.

# 4. Setup database
pnpm dev:db  # Start PostgreSQL via Docker
pnpm db:migrate
pnpm db:seed

# 5. Start development servers
pnpm dev  # Starts API, Web, and Database
```

### Verify Setup
```bash
# Check API health
curl http://localhost:3001/api/health

# Check web app
open http://localhost:3000
```

---

## 📝 Development Workflow

### Branch Strategy
We use **GitHub Flow** with feature branches:

```bash
# 1. Create feature branch from main
git checkout main
git pull origin main
git checkout -b feature/your-feature-name

# 2. Make changes and commit
git add .
git commit -m "feat: add user authentication middleware"

# 3. Push and create PR
git push origin feature/your-feature-name
# Create PR on GitHub
```

### Branch Naming Convention
- `feature/` - New features (`feature/user-authentication`)
- `fix/` - Bug fixes (`fix/payment-validation-error`)
- `docs/` - Documentation changes (`docs/api-endpoints`)
- `refactor/` - Code refactoring (`refactor/database-queries`)
- `test/` - Test additions (`test/user-registration`)

---

## 🎯 Coding Standards

### TypeScript Guidelines
```typescript
// ✅ Good: Explicit typing
interface CreateUserRequest {
  email: string;
  password: string;
  name: string;
  role: UserRole;
}

// ✅ Good: Async/await over promises
async function createUser(data: CreateUserRequest): Promise<User> {
  const hashedPassword = await bcrypt.hash(data.password, 12);
  return prisma.user.create({
    data: { ...data, password: hashedPassword }
  });
}

// ❌ Avoid: any types
function processData(data: any): any { ... }

// ❌ Avoid: Promise chains
function createUser(data) {
  return bcrypt.hash(data.password, 12)
    .then(hash => prisma.user.create({ ... }))
}
```

### API Route Structure
```typescript
// File: apps/api/src/features/auth/routes/auth.routes.ts
import { Router } from 'express';
import { z } from 'zod';
import { validateRequest } from '@airbar/shared';
import { authController } from '../controllers/auth.controller';
import { requireAuth } from '../middleware/auth';

const router = Router();

// Schema validation
const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6)
});

// Route with middleware
router.post('/login', 
  validateRequest(loginSchema),
  authController.login
);

router.get('/profile',
  requireAuth,
  authController.getProfile
);

export default router;
```

### Database Operations
```typescript
// ✅ Good: Use Prisma with proper error handling
async function getUserWithTrips(userId: string): Promise<UserWithTrips> {
  try {
    return await prisma.user.findUniqueOrThrow({
      where: { id: userId },
      include: {
        profile: true,
        trips: {
          include: { location: true }
        }
      }
    });
  } catch (error) {
    if (error instanceof PrismaClientKnownRequestError) {
      throw new NotFoundError('User not found');
    }
    throw error;
  }
}

// ❌ Avoid: Raw SQL unless necessary
const users = await prisma.$queryRaw`SELECT * FROM users WHERE id = ${id}`;
```

### React Component Guidelines
```typescript
// ✅ Good: Functional components with TypeScript
interface UserProfileProps {
  user: User;
  onUpdate: (user: User) => void;
}

export function UserProfile({ user, onUpdate }: UserProfileProps) {
  const [isEditing, setIsEditing] = useState(false);
  
  const handleSave = async (userData: UpdateUserData) => {
    try {
      const updatedUser = await updateUser(user.id, userData);
      onUpdate(updatedUser);
      setIsEditing(false);
    } catch (error) {
      toast.error('Failed to update profile');
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{user.name}</CardTitle>
      </CardHeader>
      <CardContent>
        {isEditing ? (
          <UserEditForm user={user} onSave={handleSave} />
        ) : (
          <UserDetails user={user} />
        )}
      </CardContent>
    </Card>
  );
}
```

---

## 🧪 Testing Requirements

### Test Structure
```bash
# Test file naming
src/features/auth/
├── controllers/auth.controller.ts
├── controllers/__tests__/auth.controller.test.ts
├── services/auth.service.ts
└── services/__tests__/auth.service.test.ts
```

### Unit Test Example
```typescript
// File: auth.service.test.ts
import { describe, it, expect, beforeEach } from 'vitest';
import { AuthService } from '../auth.service';
import { prismaMock } from '@/test/prisma-mock';

describe('AuthService', () => {
  let authService: AuthService;

  beforeEach(() => {
    authService = new AuthService();
  });

  it('should create user with hashed password', async () => {
    const userData = {
      email: 'test@example.com',
      password: 'password123',
      name: 'Test User'
    };

    prismaMock.user.create.mockResolvedValue({
      id: '1',
      email: userData.email,
      name: userData.name,
      password: 'hashed_password',
      role: 'USER'
    });

    const user = await authService.createUser(userData);
    
    expect(user.password).not.toBe(userData.password);
    expect(prismaMock.user.create).toHaveBeenCalledWith({
      data: expect.objectContaining({
        email: userData.email,
        name: userData.name,
        password: expect.not.stringMatching(userData.password)
      })
    });
  });
});
```

### Test Commands
```bash
# Run all tests
pnpm test

# Run specific feature tests
pnpm test auth

# Run with coverage
pnpm test --coverage

# Watch mode during development
pnpm test --watch
```

---

## 📋 Pull Request Process

### Pre-submission Checklist
- [ ] Code follows TypeScript/React best practices
- [ ] All tests pass (`pnpm test`)
- [ ] Linting passes (`pnpm lint`)
- [ ] Type checking passes (`pnpm type-check`)
- [ ] Database migrations created if needed
- [ ] Documentation updated if required
- [ ] PR description is clear and detailed

### PR Template
```markdown
## Description
Brief description of changes made.

## Type of Change
- [ ] 🐛 Bug fix
- [ ] ✨ New feature  
- [ ] 💥 Breaking change
- [ ] 📝 Documentation update
- [ ] 🔧 Refactoring

## Testing
- [ ] Unit tests added/updated
- [ ] Integration tests pass
- [ ] Manual testing completed

## Database Changes
- [ ] Migrations created
- [ ] Seed data updated
- [ ] Schema documented

## Checklist
- [ ] Code follows style guidelines
- [ ] Self-reviewed code changes
- [ ] Added comments for complex logic
- [ ] Updated documentation
- [ ] No breaking changes without migration path
```

### Review Process
1. **Automated Checks**: GitHub Actions CI must pass
2. **Code Review**: Minimum 1 reviewer approval required
3. **Testing**: All tests must pass
4. **Documentation**: Update docs if public API changes
5. **Merge**: Use "Squash and merge" for clean history

---

## 🔧 Development Tools

### Code Quality Tools
```bash
# Linting with ESLint
pnpm lint
pnpm lint:fix

# Type checking
pnpm type-check

# Code formatting with Prettier
pnpm format

# Pre-commit hooks (Husky)
# Automatically runs on git commit
```

### Database Tools
```bash
# Prisma Studio (GUI)
pnpm db:studio

# Generate Prisma client
pnpm db:generate

# Create migration
pnpm db:migrate dev --name add-user-profile

# Reset database
pnpm db:reset
```

### Docker Development
```bash
# Start all services
pnpm docker:up

# View logs
pnpm docker:logs

# Reset containers
pnpm docker:clean && pnpm docker:up
```

---

## 🏗️ Architecture Guidelines

### Monorepo Structure
```
AirbarDashboard/
├── apps/
│   ├── api/           # Express.js backend
│   └── web/           # React frontend
├── packages/
│   ├── shared/        # Shared utilities
│   ├── ui/           # Shared UI components
│   └── db/           # Database package
└── docs/             # Documentation
```

### Feature Organization
```
apps/api/src/features/auth/
├── controllers/      # HTTP request handlers
├── services/        # Business logic
├── middleware/      # Auth middleware
├── routes/          # Route definitions
├── schemas/         # Validation schemas
└── types/           # TypeScript types
```

### Import Guidelines
```typescript
// ✅ Good: Absolute imports with aliases
import { User } from '@airbar/db';
import { validateRequest } from '@airbar/shared';
import { AuthService } from '@/features/auth/services';

// ❌ Avoid: Relative imports for distant files
import { User } from '../../../db/schema';
```

---

## 🐛 Bug Reports

### Reporting Issues
When reporting bugs, include:
- **Environment**: OS, Node.js version, browser
- **Steps to reproduce**: Clear step-by-step instructions
- **Expected behavior**: What should happen
- **Actual behavior**: What actually happens
- **Screenshots**: If applicable
- **Console logs**: Error messages or warnings

### Bug Fix Process
1. Create issue with detailed description
2. Create branch: `fix/issue-description`
3. Write failing test that reproduces bug
4. Implement fix
5. Ensure test passes
6. Submit PR with reference to issue

---

## 📖 Documentation Guidelines

### Code Documentation
```typescript
/**
 * Creates a new user account with encrypted password
 * @param userData - User registration data
 * @returns Promise resolving to created user (password excluded)
 * @throws ValidationError when email format is invalid
 * @throws ConflictError when email already exists
 */
async function createUser(userData: CreateUserRequest): Promise<UserResponse> {
  // Implementation...
}
```

### API Documentation
- Update OpenAPI schemas for API changes
- Include request/response examples
- Document error responses
- Update Postman collections if used

### README Updates
- Keep setup instructions current
- Update dependencies and requirements
- Add new environment variables
- Document new scripts or commands

---

## 🎯 Performance Guidelines

### Database Optimization
```typescript
// ✅ Good: Efficient queries with proper includes
const users = await prisma.user.findMany({
  select: {
    id: true,
    email: true,
    profile: {
      select: { name: true, avatar: true }
    }
  },
  where: { active: true },
  take: 20,
  skip: offset
});

// ❌ Avoid: N+1 queries
const users = await prisma.user.findMany();
for (const user of users) {
  user.profile = await prisma.profile.findUnique({ 
    where: { userId: user.id } 
  });
}
```

### Frontend Performance
- Use React.memo for expensive components
- Implement proper loading states
- Use TanStack Query for efficient data fetching
- Optimize images and assets
- Implement proper error boundaries

---

## 🔒 Security Guidelines

### Authentication
- Always hash passwords with bcrypt (rounds: 12)
- Use JWT with short expiry (15 minutes)
- Implement refresh token rotation
- Never log sensitive data

### Input Validation
```typescript
// ✅ Good: Schema validation with Zod
const userSchema = z.object({
  email: z.string().email().max(255),
  password: z.string().min(8).max(128),
  name: z.string().min(1).max(100).trim()
});
```

### Database Security
- Use Prisma ORM (prevents SQL injection)
- Validate all user inputs
- Implement proper authorization checks
- Use environment variables for secrets

---

## 🚀 Deployment Guidelines

### Environment Variables
```bash
# Required environment variables
DATABASE_URL=postgresql://...
JWT_SECRET=your-256-bit-secret
STRIPE_SECRET_KEY=sk_test_...
REDIS_URL=redis://localhost:6379
```

### Docker Build
```bash
# Build for production
pnpm docker:build:prod

# Test production build locally
pnpm docker:up:prod
```

### CI/CD Pipeline
Our GitHub Actions pipeline:
1. **Lint & Type Check**: Code quality validation
2. **Tests**: Unit and integration tests  
3. **Build**: Production build verification
4. **Security**: Dependency vulnerability scan
5. **Deploy**: Automated deployment to staging

---

## 💡 Getting Help

### Communication Channels
- **GitHub Issues**: Bug reports, feature requests
- **GitHub Discussions**: General questions, architecture discussions
- **PR Comments**: Code-specific questions

### Code Review Support
- Tag specific reviewers for expertise areas
- Request clarification on review feedback
- Ask for pair programming sessions for complex features

### Learning Resources
- [Prisma Documentation](https://www.prisma.io/docs/)
- [Next.js Documentation](https://nextjs.org/docs)
- [TanStack Query](https://tanstack.com/query/latest)
- [Tailwind CSS](https://tailwindcss.com/docs)

---

## 📈 Project Roadmap

### Current Sprint Focus
- **Authentication**: JWT implementation complete
- **Trip Management**: CRUD operations
- **Package System**: Request creation and matching
- **Payment Integration**: Stripe escrow system

### Upcoming Features
- Real-time notifications (WebSockets)
- Advanced matching algorithm
- Mobile app development
- Analytics dashboard

---

*Thank you for contributing to Airbar! Your efforts help build a better crowdshipping platform for travelers and senders worldwide.*