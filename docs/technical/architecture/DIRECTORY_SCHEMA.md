# AirbarDashboard Directory Schema

## Root Directory Structure

```
/Users/hadinem/Projects/AirbarDashboard/
├── .bmad-core/                           # Business Method Agent Development core files
│   ├── agent-teams/                      # Agent team configurations
│   │   ├── team-all.yaml
│   │   ├── team-fullstack.yaml
│   │   ├── team-ide-minimal.yaml
│   │   └── team-no-ui.yaml
│   ├── agents/                           # Agent definitions
│   │   ├── analyst.md
│   │   ├── architect.md
│   │   ├── bmad-master.md
│   │   ├── bmad-orchestrator.md
│   │   ├── dev.md
│   │   ├── pm.md
│   │   ├── po.md
│   │   ├── qa.md
│   │   ├── sm.md
│   │   └── ux-expert.md
│   ├── checklists/                       # Development checklists
│   │   ├── architect-checklist.md
│   │   ├── change-checklist.md
│   │   ├── pm-checklist.md
│   │   ├── po-master-checklist.md
│   │   ├── story-dod-checklist.md
│   │   └── story-draft-checklist.md
│   ├── data/                            # Knowledge base and reference data
│   │   ├── bmad-kb.md
│   │   ├── brainstorming-techniques.md
│   │   ├── elicitation-methods.md
│   │   └── technical-preferences.md
│   ├── tasks/                           # Task definitions
│   │   ├── advanced-elicitation.md
│   │   ├── brownfield-create-epic.md
│   │   ├── brownfield-create-story.md
│   │   ├── correct-course.md
│   │   ├── create-brownfield-story.md
│   │   ├── create-deep-research-prompt.md
│   │   ├── create-doc.md
│   │   ├── create-next-story.md
│   │   ├── document-project.md
│   │   ├── execute-checklist.md
│   │   ├── facilitate-brainstorming-session.md
│   │   ├── generate-ai-frontend-prompt.md
│   │   ├── index-docs.md
│   │   ├── kb-mode-interaction.md
│   │   ├── review-story.md
│   │   ├── shard-doc.md
│   │   └── validate-next-story.md
│   ├── templates/                       # Document templates
│   │   ├── architecture-tmpl.yaml
│   │   ├── brainstorming-output-tmpl.yaml
│   │   ├── brownfield-architecture-tmpl.yaml
│   │   ├── brownfield-prd-tmpl.yaml
│   │   ├── competitor-analysis-tmpl.yaml
│   │   ├── front-end-architecture-tmpl.yaml
│   │   ├── front-end-spec-tmpl.yaml
│   │   ├── fullstack-architecture-tmpl.yaml
│   │   ├── market-research-tmpl.yaml
│   │   ├── prd-tmpl.yaml
│   │   ├── project-brief-tmpl.yaml
│   │   └── story-tmpl.yaml
│   ├── utils/                           # Utility files
│   │   ├── bmad-doc-template.md
│   │   └── workflow-management.md
│   ├── workflows/                       # Workflow definitions
│   │   ├── brownfield-fullstack.yaml
│   │   ├── brownfield-service.yaml
│   │   ├── brownfield-ui.yaml
│   │   ├── greenfield-fullstack.yaml
│   │   ├── greenfield-service.yaml
│   │   └── greenfield-ui.yaml
│   ├── core-config.yaml
│   ├── install-manifest.yaml
│   ├── user-guide.md
│   └── working-in-the-brownfield.md
├── .claude/                             # Claude IDE configuration
├── .git/                               # Git repository data
├── .github/                            # GitHub workflows and templates
│   └── workflows/
│       ├── ci.yml
│       └── deploy.yml
├── .husky/                             # Git hooks management
│   ├── _/                              # Husky internal files
│   └── pre-commit
├── .local/                             # Local state and cache files
│   └── state/
│       └── replit/
│           └── agent/
├── BMAD-METHOD/                        # Submodule: Business Method Agent Development
├── client/                             # Frontend React application
│   └── src/
│       ├── components/                 # React components
│       │   ├── auth/                   # Authentication components
│       │   │   ├── AuthLayout.tsx
│       │   │   ├── ForgotPassword.tsx
│       │   │   ├── OtpVerify.tsx
│       │   │   ├── ResetPassword.tsx
│       │   │   ├── SignInForm.tsx
│       │   │   ├── SignUpForm.tsx
│       │   │   └── SocialButton.tsx
│       │   ├── landing/                # Landing page components
│       │   │   ├── CTASection.tsx
│       │   │   ├── FAQ.tsx
│       │   │   ├── FAQAccordion.tsx
│       │   │   ├── FinalCTA.tsx
│       │   │   ├── FooterV2.tsx
│       │   │   ├── Header.tsx
│       │   │   ├── HeaderV2.tsx
│       │   │   ├── Hero.tsx
│       │   │   ├── HeroInteractive.tsx
│       │   │   ├── HowItWorks.tsx
│       │   │   ├── InstantQuoteMini.tsx
│       │   │   ├── MetricsStrip.tsx
│       │   │   ├── PopularRoutes.tsx
│       │   │   ├── QuickQuoteWidget.tsx
│       │   │   ├── ReviewCarousel.tsx
│       │   │   ├── RoleToggle.tsx
│       │   │   ├── RoutesCarousel.tsx
│       │   │   ├── SafetyList.tsx
│       │   │   ├── StatsStrip.tsx
│       │   │   ├── StepsHowItWorks.tsx
│       │   │   ├── StickyCTA.tsx
│       │   │   ├── TrustBand.tsx
│       │   │   ├── TrustRow.tsx
│       │   │   └── index.ts
│       │   ├── matching/               # Matching system components
│       │   │   ├── MatchCard.tsx
│       │   │   └── MatchDiscovery.tsx
│       │   ├── trips/                  # Trip-related components
│       │   │   └── AddTripForm.tsx
│       │   └── ui/                     # Reusable UI components (Shadcn/UI)
│       │       ├── accordion.tsx
│       │       ├── alert-dialog.tsx
│       │       ├── alert.tsx
│       │       ├── animated-button.tsx
│       │       ├── animated-card.tsx
│       │       ├── animated-input.tsx
│       │       ├── animated-textarea.tsx
│       │       ├── aspect-ratio.tsx
│       │       ├── avatar.tsx
│       │       ├── badge.tsx
│       │       ├── breadcrumb.tsx
│       │       ├── button.tsx
│       │       ├── calendar.tsx
│       │       ├── card.tsx
│       │       ├── carousel.tsx
│       │       ├── chart.tsx
│       │       ├── checkbox.tsx
│       │       ├── collapsible.tsx
│       │       ├── command.tsx
│       │       ├── context-menu.tsx
│       │       ├── date-range-picker.tsx
│       │       ├── dialog.tsx
│       │       ├── drawer.tsx
│       │       ├── dropdown-menu.tsx
│       │       ├── empty-state.tsx
│       │       ├── form.tsx
│       │       ├── hover-card.tsx
│       │       ├── input-otp.tsx
│       │       ├── input.tsx
│       │       ├── label.tsx
│       │       ├── loading-dots.tsx
│       │       ├── loading-spinner.tsx
│       │       ├── menubar.tsx
│       │       ├── navigation-menu.tsx
│       │       ├── pagination.tsx
│       │       ├── popover.tsx
│       │       ├── progress.tsx
│       │       ├── radio-group.tsx
│       │       ├── resizable.tsx
│       │       ├── scroll-area.tsx
│       │       ├── select.tsx
│       │       ├── separator.tsx
│       │       ├── sheet.tsx
│       │       ├── sidebar.tsx
│       │       ├── skeleton.tsx
│       │       ├── slider.tsx
│       │       ├── switch.tsx
│       │       ├── table.tsx
│       │       ├── tabs.tsx
│       │       ├── textarea.tsx
│       │       ├── toast.tsx
│       │       ├── toaster.tsx
│       │       ├── toggle-group.tsx
│       │       ├── toggle.tsx
│       │       └── tooltip.tsx
│       ├── context/                    # React context providers
│       │   └── AuthContext.tsx
│       ├── hooks/                      # Custom React hooks
│       │   ├── useAuth.ts
│       │   └── useUserRole.ts
│       ├── pages/                      # Page components
│       │   ├── auth/                   # Authentication pages
│       │   │   ├── ForgotPasswordPage.tsx
│       │   │   ├── LoginPage.tsx
│       │   │   ├── RegisterPage.tsx
│       │   │   └── ResetPasswordPage.tsx
│       │   ├── landing-v2/             # Landing page variants
│       │   │   ├── HomePageNew.tsx
│       │   │   └── LandingV2.tsx
│       │   ├── marketplace/            # Marketplace pages
│       │   │   └── Trips.tsx
│       │   ├── AddTripV2.tsx
│       │   ├── BrowsePackages.tsx
│       │   ├── Dashboard.tsx
│       │   ├── DashboardMatches.tsx
│       │   ├── DisputeDetail.tsx
│       │   ├── DisputeList.tsx
│       │   ├── DisputeNew.tsx
│       │   ├── History.tsx
│       │   ├── HistoryDetail.tsx
│       │   ├── HistorySender.tsx
│       │   ├── HistoryTraveler.tsx
│       │   ├── MarketplaceTripDetail.tsx
│       │   ├── MatchDetail.tsx
│       │   ├── MatchRequestDetail.tsx
│       │   ├── MatchRequests.tsx
│       │   ├── Matches.tsx
│       │   ├── MatchesDiscovery.tsx
│       │   ├── MatchesHub.tsx
│       │   ├── MyParcels.tsx
│       │   ├── MyTrips.tsx
│       │   ├── NewDelivery.tsx
│       │   ├── Notifications.tsx
│       │   ├── ParcelRequestDetail.tsx
│       │   ├── ParcelRequests.tsx
│       │   ├── PaymentCheckout.tsx
│       │   ├── Profile.tsx
│       │   ├── Referrals.tsx
│       │   ├── SendPackageV2.tsx
│       │   ├── SenderParcels.tsx
│       │   ├── Support.tsx
│       │   ├── Tracking.tsx
│       │   ├── TravelerTrips.tsx
│       │   ├── Wallet.tsx
│       │   ├── WalletEscrow.tsx
│       │   ├── WalletReferrals.tsx
│       │   ├── WalletSender.tsx
│       │   ├── WalletTransactions.tsx
│       │   ├── WalletWithdrawals.tsx
│       │   └── not-found.tsx
│       ├── server/                     # Client-side server utilities
│       │   ├── schemas/                # Validation schemas
│       │   │   └── validation.ts
│       │   ├── services/               # Service layer
│       │   │   ├── cacheService.ts
│       │   │   ├── database.ts
│       │   │   ├── locationService.ts
│       │   │   ├── packageService.ts
│       │   │   ├── tripService.ts
│       │   │   └── userService.ts
│       │   ├── db.ts
│       │   ├── index.ts
│       │   ├── notificationService.ts
│       │   ├── routes.ts
│       │   ├── storage.ts
│       │   ├── verificationService.ts
│       │   └── vite.ts
│       └── App.tsx
├── content/                            # Static content files
│   ├── faq.json
│   └── tokens.json
├── dist/                               # Build output directory
│   ├── public/
│   │   ├── assets/
│   │   │   ├── index-Crs-jcm7.js
│   │   │   └── index-DYWDIhGq.css
│   │   ├── index.html
│   │   └── logo.svg
│   └── index.js
├── prisma/                             # Database schema and migrations
│   ├── migrations/
│   │   ├── 20250823215720_init_production_schema/
│   │   │   └── migration.sql
│   │   └── migration_lock.toml
│   ├── schema.prisma
│   └── seed.ts
├── server/                             # Backend Node.js server
│   ├── controllers/                    # Route controllers
│   │   └── auth.controller.ts
│   ├── middleware/                     # Express middleware
│   │   ├── auth.ts
│   │   └── rateLimiter.ts
│   ├── routes/                         # API routes
│   │   └── auth.routes.ts
│   ├── utils/                          # Server utilities
│   │   └── jwt.ts
│   ├── db.ts
│   ├── index.ts
│   ├── routes.ts
│   ├── storage.ts
│   └── vite.ts
├── shared/                             # Shared code between client and server
│   ├── auth-schema.ts
│   ├── auth-validation.ts
│   └── schema.ts
├── test/                               # Test files
│   ├── matching-api.test.ts
│   ├── notification-api.test.ts
│   ├── react-components.test.tsx
│   ├── setup.ts
│   └── verification-api.test.ts
├── web-bundles/                        # Generated bundles for web deployment
│   ├── agents/                         # Agent text files
│   │   ├── analyst.txt
│   │   ├── architect.txt
│   │   ├── bmad-master.txt
│   │   ├── bmad-orchestrator.txt
│   │   ├── dev.txt
│   │   ├── pm.txt
│   │   ├── po.txt
│   │   ├── qa.txt
│   │   ├── sm.txt
│   │   └── ux-expert.txt
│   ├── expansion-packs/                # Extension bundles
│   │   ├── bmad-2d-phaser-game-dev/
│   │   │   ├── agents/
│   │   │   │   ├── game-designer.txt
│   │   │   │   ├── game-developer.txt
│   │   │   │   └── game-sm.txt
│   │   │   └── teams/
│   │   │       └── phaser-2d-nodejs-game-team.txt
│   │   ├── bmad-2d-unity-game-dev/
│   │   │   ├── agents/
│   │   │   │   ├── game-designer.txt
│   │   │   │   ├── game-developer.txt
│   │   │   │   └── game-sm.txt
│   │   │   └── teams/
│   │   │       └── unity-2d-game-team.txt
│   │   └── bmad-infrastructure-devops/
│   │       └── agents/
│   │           └── infra-devops-platform.txt
│   └── teams/                          # Team configuration files
│       ├── team-all.txt
│       ├── team-fullstack.txt
│       ├── team-ide-minimal.txt
│       └── team-no-ui.txt
├── .env                                # Environment variables
├── .gitignore                          # Git ignore rules
├── .replit                             # Replit configuration
├── BACKEND_DEVELOPMENT_ASSESSMENT.md   # Development assessments
├── COMPREHENSIVE_PRODUCT_ASSESSMENT.md
├── CTO_PRODUCT_DOCUMENTATION.md
├── DATABASE_SCHEMA.md
├── EXECUTIVE_SUMMARY.md
├── FEATURE_COMPLETION_MATRIX.md
├── FULL_SITEMAP.md
├── GAP_ANALYSIS.md
├── MVP_DEVELOPMENT_PLAN.md
├── PRD.md                              # Product Requirements Document
├── PRODUCT_ASSESSMENT_REPORT.md
├── README.md                           # Project documentation
├── auth_migration.sql                  # Database migration scripts
├── components.json                     # Shadcn/UI components configuration
├── knip.config.ts                     # Code analysis configuration
├── package-lock.json                  # NPM lock file
├── package.json                       # NPM package configuration
├── postcss.config.js                 # PostCSS configuration
├── prettier.config.cjs                # Prettier configuration
├── replit.md                          # Replit-specific documentation
├── tailwind.config.ts                 # Tailwind CSS configuration
├── test-endpoints.js                  # API endpoint tests
├── tsconfig.json                      # TypeScript configuration
├── vite.config.ts                     # Vite build configuration
└── vitest.config.ts                   # Vitest test configuration
```

## Key Directory Purposes

### Frontend (`client/`)
- **src/components/**: React components organized by feature (auth, landing, matching, trips, ui)
- **src/pages/**: Page-level components for routing
- **src/hooks/**: Custom React hooks for shared logic
- **src/context/**: React context providers for global state
- **src/server/**: Client-side utilities and services

### Backend (`server/`)
- **controllers/**: Express route handlers
- **middleware/**: Express middleware functions
- **routes/**: API route definitions
- **utils/**: Server utility functions

### Database (`prisma/`)
- **migrations/**: Database schema migration files
- **schema.prisma**: Database schema definition
- **seed.ts**: Database seeding script

### Testing (`test/`)
- Unit tests for API endpoints and React components
- Test setup and configuration files

### Configuration Files
- **Vite**: `vite.config.ts` - Build tool configuration
- **TypeScript**: `tsconfig.json` - TypeScript compiler options
- **Tailwind**: `tailwind.config.ts` - CSS framework configuration
- **ESLint/Prettier**: Code formatting and linting rules
- **Git Hooks**: `.husky/` - Pre-commit hooks for code quality

### Development Methodology (`BMAD-METHOD/`, `.bmad-core/`)
- AI-driven development framework with agents, workflows, and templates
- Business Method Agent Development system for structured development

### Documentation
- Comprehensive product assessments and technical documentation
- Development plans, schemas, and feature matrices
- Executive summaries and gap analyses

This directory structure reflects a full-stack TypeScript application with React frontend, Node.js backend, PostgreSQL database, and comprehensive development tooling.