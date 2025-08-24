# Documentation Move & Reorganization Plan
## AirbarDashboard - Comprehensive Documentation Restructuring

*Generated: 2025-01-24*  
*Target: Unified, accurate, and maintainable documentation structure*

---

## 🎯 Execution Strategy

### **Approach**: Non-Destructive Reorganization
1. **Phase 1**: Create new structure alongside existing (no deletions)
2. **Phase 2**: Move and update content systematically  
3. **Phase 3**: Archive outdated content (with approval)
4. **Phase 4**: Clean up temporary files (with approval)

### **Safety Measures**
- All moves logged with exact commands
- Original files archived before major edits
- Rollback plan documented for each phase
- Version control for all changes

---

## 📁 Target Directory Structure

```bash
docs/
├── README.md                              # Central navigation hub
├── technical/                             # Developer documentation  
│   ├── api/                              # API documentation
│   │   ├── README.md                     # API overview
│   │   ├── authentication.md             # Auth flow documentation
│   │   ├── endpoints.md                  # API endpoints reference
│   │   └── webhooks.md                   # Webhook specifications
│   ├── architecture/                     # System architecture
│   │   ├── overview.md                   # High-level architecture
│   │   ├── database-schema.md            # Database documentation
│   │   ├── auth-system.md                # Authentication system
│   │   └── security-model.md             # Security architecture
│   ├── development/                      # Developer guides
│   │   ├── setup.md                      # Local development setup
│   │   ├── docker-setup.md               # Container setup (existing)
│   │   ├── testing.md                    # Testing strategy
│   │   ├── contributing.md               # Code contribution guidelines
│   │   └── troubleshooting.md            # Common issues & solutions
│   └── runbooks/                         # Operations documentation
│       ├── deployment.md                 # Production deployment
│       ├── monitoring.md                 # System monitoring
│       ├── backup-recovery.md            # Data backup procedures
│       └── incident-response.md          # Emergency procedures
├── product/                              # Business & product documentation
│   ├── requirements/                     # Product requirements
│   │   ├── prd.md                        # Product Requirements Document
│   │   ├── user-stories.md               # User stories & acceptance criteria
│   │   └── feature-specifications.md    # Detailed feature specs
│   ├── planning/                         # Development planning
│   │   ├── roadmap.md                    # Product roadmap
│   │   ├── mvp-plan.md                   # MVP development plan
│   │   └── feature-matrix.md             # Feature completion tracking
│   ├── research/                         # Market & user research
│   │   ├── market-analysis.md            # Market research findings
│   │   ├── competitive-analysis.md       # Competitor analysis
│   │   └── user-feedback.md              # User research & feedback
│   ├── design/                           # UX/UI documentation
│   │   ├── user-flows.md                 # User journey documentation
│   │   ├── sitemap.md                    # Site structure
│   │   └── design-system.md              # UI component guidelines
│   └── assessments/                      # Analysis reports
│       ├── product-assessment.md         # Product evaluation
│       ├── technical-assessment.md       # Technical evaluation  
│       └── gap-analysis.md               # Feature gap analysis
├── legal/                                # Legal & compliance
│   ├── terms-of-service.md              # Terms of Service (to create)
│   ├── privacy-policy.md                # Privacy Policy (to create)
│   ├── data-processing.md               # GDPR compliance (to create)
│   └── compliance-checklist.md          # Regulatory requirements
└── assets/                               # Documentation assets
    ├── images/                           # Screenshots, diagrams
    ├── diagrams/                         # Architecture diagrams
    └── templates/                        # Document templates
```

---

## 🔄 File Movement Plan

### **Phase 1: Create New Structure**

```bash
# Create the complete directory structure
mkdir -p docs/technical/{api,architecture,development,runbooks}
mkdir -p docs/product/{requirements,planning,research,design,assessments}
mkdir -p docs/legal
mkdir -p docs/assets/{images,diagrams,templates}

# Create stub README files
echo "# Technical Documentation" > docs/technical/README.md
echo "# Product Documentation" > docs/product/README.md
echo "# Legal & Compliance" > docs/legal/README.md
echo "# Documentation Assets" > docs/assets/README.md
```

### **Phase 2: Move & Organize Existing Content**

#### **Technical Documentation Moves**

```bash
# Architecture documentation
mv docs/ARCHITECTURE.md docs/technical/architecture/overview.md
mv docs/technical/database/DATABASE_SCHEMA.md docs/technical/architecture/database-schema.md  
mv docs/technical/TECH_STACK.md docs/technical/architecture/tech-stack.md

# Development documentation (preserve existing)
# docs/development/DOCKER_SETUP.md → docs/technical/development/docker-setup.md
# docs/development/README.md → docs/technical/development/setup.md

# Leadership documentation
mv docs/technical/leadership/CTO_PRODUCT_DOCUMENTATION.md docs/technical/architecture/cto-overview.md
```

#### **Product Documentation Moves**

```bash
# Core product documents
mv docs/product/PRD.md docs/product/requirements/prd.md
mv docs/product/EXECUTIVE_SUMMARY.md docs/product/requirements/executive-summary.md

# Planning documents  
mv docs/product/planning/MVP_DEVELOPMENT_PLAN.md docs/product/planning/mvp-plan.md
mv docs/product/planning/FEATURE_COMPLETION_MATRIX.md docs/product/planning/feature-matrix.md

# Analysis documents
mv docs/product/analysis/GAP_ANALYSIS.md docs/product/assessments/gap-analysis.md
mv docs/product/assessments/COMPREHENSIVE_PRODUCT_ASSESSMENT.md docs/product/assessments/product-assessment.md
mv docs/product/assessments/PRODUCT_ASSESSMENT_REPORT.md docs/product/assessments/product-report.md
mv docs/technical/assessments/BACKEND_DEVELOPMENT_ASSESSMENT.md docs/product/assessments/technical-assessment.md

# Design documents
mv docs/product/sitemap/FULL_SITEMAP.md docs/product/design/sitemap.md
# Note: SITEMAP.md will be merged into sitemap.md (content consolidation)

# Directory schema (technical architecture)
mv docs/technical/architecture/DIRECTORY_SCHEMA.md docs/technical/development/project-structure.md
```

### **Phase 3: Archive Historical Content**

```bash
# Archive BMAD framework (already in archive, verify location)
# docs/archive/bmad-framework/ (already properly located)

# Create archive for outdated planning documents
mkdir -p docs/archive/old-plans
mkdir -p docs/archive/legacy-assessments

# Move duplicate/outdated content to archive
# (Duplicates will be identified during content review)
```

### **Phase 4: Content Updates & Merges**

#### **Merge Similar Documents**

1. **Sitemap Consolidation**
   ```bash
   # Merge FULL_SITEMAP.md + SITEMAP.md → single sitemap.md
   # Manual merge required - combine unique content from both files
   ```

2. **Assessment Report Consolidation**
   ```bash
   # Merge multiple assessment reports into unified assessments
   # Keep individual reports for historical reference
   ```

3. **Architecture Document Updates**
   ```bash
   # Update architecture overview with actual implementation details
   # Correct ORM references (Prisma vs Drizzle)
   # Update authentication flow documentation
   ```

---

## 📄 New Document Creation Plan

### **Critical Missing Documents**

#### **API Documentation (docs/technical/api/)**

1. **authentication.md**
   ```markdown
   # Authentication System
   - JWT-based authentication flow
   - Refresh token mechanism
   - Role-based access control
   - Session management
   ```

2. **endpoints.md**
   ```markdown
   # API Endpoints Reference
   - Authentication endpoints (/api/auth/*)
   - Trip management (/api/trips/*)
   - Package management (/api/packages/*)
   - Matching system (/api/matches/*)
   - Payment system (/api/payments/*)
   ```

#### **Development Documentation (docs/technical/development/)**

1. **setup.md**
   ```markdown
   # Local Development Setup
   - Prerequisites installation
   - Environment configuration
   - Database setup and seeding
   - Running the development server
   ```

2. **testing.md**
   ```markdown
   # Testing Strategy
   - Unit testing guidelines
   - Integration testing approach
   - End-to-end testing setup
   - Test data management
   ```

3. **contributing.md**
   ```markdown
   # Contributing Guidelines
   - Code style standards
   - Git workflow
   - Pull request process
   - Code review checklist
   ```

#### **Operations Documentation (docs/technical/runbooks/)**

1. **deployment.md**
   ```markdown
   # Production Deployment
   - Environment setup
   - Database migration procedures
   - Application deployment steps
   - Rollback procedures
   ```

2. **monitoring.md**
   ```markdown
   # System Monitoring
   - Health check endpoints
   - Performance metrics
   - Error tracking
   - Alerting configuration
   ```

#### **Legal Documentation (docs/legal/)**

1. **terms-of-service.md** (Placeholder - requires legal review)
2. **privacy-policy.md** (Placeholder - requires legal review)
3. **compliance-checklist.md** (Regulatory requirements tracking)

### **Updated Document Templates**

#### **docs/README.md** (Central Navigation Hub)
```markdown
# AirbarDashboard Documentation

## Quick Start
- [Development Setup](technical/development/setup.md)
- [API Documentation](technical/api/README.md)
- [Product Requirements](product/requirements/prd.md)

## For Developers
- [Technical Architecture](technical/architecture/overview.md)
- [API Reference](technical/api/endpoints.md)
- [Contributing Guidelines](technical/development/contributing.md)

## For Product Team  
- [Product Requirements](product/requirements/prd.md)
- [MVP Development Plan](product/planning/mvp-plan.md)
- [Feature Matrix](product/planning/feature-matrix.md)

## For Operations
- [Deployment Guide](technical/runbooks/deployment.md)
- [Monitoring Setup](technical/runbooks/monitoring.md)
- [Incident Response](technical/runbooks/incident-response.md)
```

---

## 🗂️ Content Update Requirements

### **Priority 1: Critical Corrections**

1. **Architecture Overview** (`docs/technical/architecture/overview.md`)
   ```markdown
   # Updates Required:
   - Correct ORM: Prisma (not Drizzle)
   - Correct Auth: JWT-based (not session-based)
   - Correct Routing: React Router DOM (not Wouter)
   - Add actual system architecture diagram
   - Update deployment information
   ```

2. **Database Schema** (`docs/technical/architecture/database-schema.md`)
   ```markdown
   # Updates Required:
   - Document actual 15-entity Prisma schema
   - Update relationships and constraints
   - Add indexing strategy
   - Include migration procedures
   - Add data model diagrams
   ```

3. **MVP Development Plan** (`docs/product/planning/mvp-plan.md`)
   ```markdown
   # Updates Required:
   - Correct completion percentages (30% vs claimed 85%)
   - Update timeline to reflect actual development state
   - Revise resource requirements
   - Update technical dependencies
   - Add realistic milestones
   ```

### **Priority 2: Content Merges**

1. **Sitemap Consolidation**
   - Merge `FULL_SITEMAP.md` and `SITEMAP.md`
   - Create single comprehensive site structure document
   - Include user flow diagrams

2. **Assessment Reports**
   - Consolidate multiple assessment reports
   - Create unified current state analysis
   - Archive historical versions

### **Priority 3: New Content Creation**

1. **API Documentation** - Generate from existing code structure
2. **Developer Onboarding** - Create comprehensive setup guide  
3. **Security Documentation** - Document JWT auth flow and security model

---

## 🗑️ Final Inventory & Deletion Candidates

### **Complete File Inventory**

#### **Documentation Files (Keep & Reorganize)**
```bash
# Current docs/ structure (60 files total)
docs/
├── README.md                                    # UPDATE: Central hub
├── ARCHITECTURE.md                              # MOVE: technical/architecture/overview.md
├── technical/
│   ├── DOCUMENTATION.md                         # MOVE: technical/development/
│   ├── TECH_STACK.md                           # MOVE: technical/architecture/tech-stack.md
│   ├── assessments/BACKEND_DEVELOPMENT_ASSESSMENT.md # MOVE: product/assessments/
│   ├── architecture/DIRECTORY_SCHEMA.md        # MOVE: technical/development/project-structure.md
│   ├── database/DATABASE_SCHEMA.md             # MOVE: technical/architecture/database-schema.md
│   └── leadership/CTO_PRODUCT_DOCUMENTATION.md # MOVE: technical/architecture/cto-overview.md
├── product/
│   ├── PRD.md                                  # MOVE: product/requirements/prd.md
│   ├── EXECUTIVE_SUMMARY.md                    # MOVE: product/requirements/executive-summary.md
│   ├── analysis/GAP_ANALYSIS.md                # MOVE: product/assessments/gap-analysis.md
│   ├── assessments/                            # MOVE: All to product/assessments/
│   ├── planning/                               # REORGANIZE: Update and consolidate
│   └── sitemap/                                # MERGE: Into single design/sitemap.md
└── development/                                # MOVE: All to technical/development/
```

#### **Archive Content (Preserve Historical Value)**
```bash
docs/archive/
├── bmad-framework/                             # KEEP: Historical methodology
├── old-plans/                                  # CREATE: For outdated planning docs
└── legacy-assessments/                         # CREATE: For superseded reports
```

### **Deletion Candidates (Safe to Remove)**

#### **Agent & Temp Files (High Confidence)**
```bash
# AI/IDE temporary files - safe to delete
.local/state/replit/agent/                      # Replit AI state files
attached_assets/                                # Processed/moved content
web-bundles/                                    # Build artifacts
test-endpoints.js                               # Development testing file
replit.md                                       # Platform-specific, outdated
BMAD-METHOD                                     # Duplicate of archive content
```

#### **Duplicate Files (Medium Confidence - Verify Content)**
```bash
# Potential duplicates requiring content verification
docs/product/sitemap/SITEMAP.md                # Merge with FULL_SITEMAP.md
# Note: Manual verification required before deletion
```

#### **Build Artifacts & Cache Files**
```bash
# Development artifacts - safe to delete
*.tsbuildinfo                                   # TypeScript build info
.eslintcache                                    # ESLint cache
dist/                                           # Build output (if in root)
node_modules/.cache/                            # Build cache
```

---

## ⚡ Execution Commands

### **Phase 1: Structure Creation (Safe)**
```bash
# Create complete directory structure
mkdir -p docs/technical/{api,architecture,development,runbooks}
mkdir -p docs/product/{requirements,planning,research,design,assessments}  
mkdir -p docs/legal
mkdir -p docs/assets/{images,diagrams,templates}
mkdir -p docs/archive/{old-plans,legacy-assessments}

# Create navigation README files
echo "# Technical Documentation Hub" > docs/technical/README.md
echo "# Product Documentation Hub" > docs/product/README.md
echo "# Legal & Compliance Documentation" > docs/legal/README.md
```

### **Phase 2: Content Moves (Non-Destructive)**
```bash
# Technical documentation moves
cp docs/ARCHITECTURE.md docs/technical/architecture/overview.md
cp docs/technical/TECH_STACK.md docs/technical/architecture/tech-stack.md
cp docs/technical/database/DATABASE_SCHEMA.md docs/technical/architecture/database-schema.md
cp docs/technical/leadership/CTO_PRODUCT_DOCUMENTATION.md docs/technical/architecture/cto-overview.md
cp docs/technical/architecture/DIRECTORY_SCHEMA.md docs/technical/development/project-structure.md

# Product documentation moves
cp docs/product/PRD.md docs/product/requirements/prd.md
cp docs/product/EXECUTIVE_SUMMARY.md docs/product/requirements/executive-summary.md
cp docs/product/planning/MVP_DEVELOPMENT_PLAN.md docs/product/planning/mvp-plan.md
cp docs/product/planning/FEATURE_COMPLETION_MATRIX.md docs/product/planning/feature-matrix.md
cp docs/product/analysis/GAP_ANALYSIS.md docs/product/assessments/gap-analysis.md

# Assessment moves
cp docs/product/assessments/COMPREHENSIVE_PRODUCT_ASSESSMENT.md docs/product/assessments/product-assessment.md
cp docs/product/assessments/PRODUCT_ASSESSMENT_REPORT.md docs/product/assessments/product-report.md
cp docs/technical/assessments/BACKEND_DEVELOPMENT_ASSESSMENT.md docs/product/assessments/technical-assessment.md

# Design documentation
cp docs/product/sitemap/FULL_SITEMAP.md docs/product/design/sitemap.md
```

### **Phase 3: Content Updates (Manual Review Required)**
```bash
# These files need manual updates after copying:
# - docs/technical/architecture/overview.md (fix ORM references)
# - docs/technical/architecture/database-schema.md (update to Prisma schema)
# - docs/product/planning/mvp-plan.md (correct completion percentages)
# - docs/technical/architecture/tech-stack.md (update actual dependencies)

# Create new essential documents:
# - docs/technical/api/README.md
# - docs/technical/api/authentication.md  
# - docs/technical/development/setup.md
# - docs/technical/development/contributing.md
# - docs/README.md (central navigation hub)
```

### **Phase 4: Archive & Cleanup (Requires Approval)**
```bash
# Archive old structure (after verification)
# mv docs/ARCHITECTURE.md docs/archive/old-plans/ARCHITECTURE-original.md
# mv docs/technical/database/ docs/archive/old-plans/
# mv docs/product/sitemap/SITEMAP.md docs/archive/old-plans/ (after merge)

# Safe deletions (after approval)
# rm -rf .local/state/replit/agent/
# rm -rf attached_assets/
# rm -rf web-bundles/  
# rm test-endpoints.js
# rm replit.md
```

---

## 🔙 Rollback Plan

### **If Issues Occur During Reorganization:**

1. **Immediate Rollback**
   ```bash
   git checkout HEAD~1  # Revert last commit
   git reset --hard HEAD  # Reset working directory
   ```

2. **Partial Rollback**
   ```bash
   # Restore specific directory from git
   git checkout HEAD -- docs/
   ```

3. **Complete Reset**
   ```bash
   # Nuclear option: discard all changes
   git stash  # Save any wanted changes
   git checkout main
   git branch -D chore/unbiased-assessment-docs-revamp
   ```

### **Verification Steps**
- Verify all original files still exist before deletion
- Test that all internal documentation links work
- Confirm no build processes depend on old documentation paths
- Validate that all content has been preserved or properly archived

---

*Move Plan Complete. Ready for approval phase: **APPROVE: EXECUTE DOCS PLAN***