# Documentation Reorganization Plan

## Current State Analysis

**Total Files Found**: 60+ documentation files
**Categories Identified**:
- **Product Documentation** (15 files): PRDs, assessments, planning docs
- **Technical Documentation** (8 files): Architecture, setup, schemas
- **BMAD Framework** (40+ files): Agent profiles, tasks, checklists, utilities
- **Duplicates Found**: 1 (brownfield-create-story.md appears twice)

## Proposed File Movements

### Keep In Place (No Movement)
```bash
# These files should remain at root level
./README.md                    # Main project README
```

### Product Documentation → docs/product/
```bash
mv ./PRD.md                                     docs/product/
mv ./COMPREHENSIVE_PRODUCT_ASSESSMENT.md       docs/product/assessments/
mv ./PRODUCT_ASSESSMENT_REPORT.md             docs/product/assessments/
mv ./EXECUTIVE_SUMMARY.md                     docs/product/
mv ./GAP_ANALYSIS.md                          docs/product/analysis/
mv ./FULL_SITEMAP.md                          docs/product/sitemap/
mv ./SITEMAP.md                               docs/product/sitemap/
mv ./FEATURE_COMPLETION_MATRIX.md             docs/product/planning/
mv ./MVP_DEVELOPMENT_PLAN.md                  docs/product/planning/
```

### Technical Documentation → docs/technical/
```bash
mv ./BACKEND_DEVELOPMENT_ASSESSMENT.md        docs/technical/assessments/
mv ./DIRECTORY_SCHEMA.md                      docs/technical/architecture/
mv ./DATABASE_SCHEMA.md                       docs/technical/database/
mv ./CTO_PRODUCT_DOCUMENTATION.md            docs/technical/leadership/
mv ./DOCUMENTATION.md                         docs/technical/
mv ./TECH_STACK.md                           docs/technical/
# Keep existing docs/ARCHITECTURE.md in place
# Keep existing docs/development/ structure in place
```

### BMAD Framework → docs/archive/bmad-framework/
```bash
mv ./.bmad-core/                              docs/archive/bmad-framework/
```

### Duplicate Resolution
```bash
# Remove the duplicate file:
rm ./.bmad-core/tasks/brownfield-create-story.md  # (second occurrence)
```

## Final Proposed Structure

```
AirbarDashboard/
├── README.md                                 # Main project README (stays)
├── docs/
│   ├── README.md                            # Documentation index (create)
│   ├── product/                             # Business & Product docs
│   │   ├── PRD.md
│   │   ├── EXECUTIVE_SUMMARY.md
│   │   ├── assessments/
│   │   │   ├── COMPREHENSIVE_PRODUCT_ASSESSMENT.md
│   │   │   └── PRODUCT_ASSESSMENT_REPORT.md
│   │   ├── analysis/
│   │   │   └── GAP_ANALYSIS.md
│   │   ├── sitemap/
│   │   │   ├── FULL_SITEMAP.md
│   │   │   └── SITEMAP.md
│   │   └── planning/
│   │       ├── FEATURE_COMPLETION_MATRIX.md
│   │       └── MVP_DEVELOPMENT_PLAN.md
│   ├── technical/                           # Technical documentation
│   │   ├── ARCHITECTURE.md                 # (existing, stays)
│   │   ├── DOCUMENTATION.md
│   │   ├── TECH_STACK.md
│   │   ├── assessments/
│   │   │   └── BACKEND_DEVELOPMENT_ASSESSMENT.md
│   │   ├── architecture/
│   │   │   └── DIRECTORY_SCHEMA.md
│   │   ├── database/
│   │   │   └── DATABASE_SCHEMA.md
│   │   ├── leadership/
│   │   │   └── CTO_PRODUCT_DOCUMENTATION.md
│   │   └── development/                     # (existing, stays)
│   │       ├── README.md
│   │       └── DOCKER_SETUP.md
│   └── archive/                             # Legacy/superseded content
│       └── bmad-framework/                  # BMAD system (moved from .bmad-core)
│           ├── agents/
│           ├── tasks/
│           ├── checklists/
│           ├── utils/
│           ├── data/
│           ├── user-guide.md
│           └── working-in-the-brownfield.md
```

## Commands to Execute (After Approval)

### Step 1: Create Directory Structure
```bash
mkdir -p docs/product/{assessments,analysis,sitemap,planning}
mkdir -p docs/technical/{assessments,architecture,database,leadership}
mkdir -p docs/archive/bmad-framework
```

### Step 2: Move Product Documentation
```bash
mv PRD.md docs/product/
mv COMPREHENSIVE_PRODUCT_ASSESSMENT.md docs/product/assessments/
mv PRODUCT_ASSESSMENT_REPORT.md docs/product/assessments/
mv EXECUTIVE_SUMMARY.md docs/product/
mv GAP_ANALYSIS.md docs/product/analysis/
mv FULL_SITEMAP.md docs/product/sitemap/
mv SITEMAP.md docs/product/sitemap/
mv FEATURE_COMPLETION_MATRIX.md docs/product/planning/
mv MVP_DEVELOPMENT_PLAN.md docs/product/planning/
```

### Step 3: Move Technical Documentation
```bash
mv BACKEND_DEVELOPMENT_ASSESSMENT.md docs/technical/assessments/
mv DIRECTORY_SCHEMA.md docs/technical/architecture/
mv DATABASE_SCHEMA.md docs/technical/database/
mv CTO_PRODUCT_DOCUMENTATION.md docs/technical/leadership/
mv DOCUMENTATION.md docs/technical/
mv TECH_STACK.md docs/technical/
```

### Step 4: Archive BMAD Framework
```bash
mv .bmad-core/* docs/archive/bmad-framework/
rmdir .bmad-core
```

### Step 5: Handle Duplicates (Deletion Phase - Separate Approval)
```bash
# Will be handled in deletion phase after separate approval
```

## Rationale

**Benefits**:
- Centralizes all documentation under `docs/`
- Clear separation of product vs technical documentation  
- Preserves existing `docs/development/` structure
- Archives BMAD framework rather than deleting (preserves institutional knowledge)
- Maintains project README at root level for GitHub visibility

**Risk Mitigation**:
- All moves are non-destructive
- BMAD framework archived, not deleted
- Existing `docs/` structure preserved and extended
- Changes can be easily reverted via git

## Next Steps

1. **WAIT FOR APPROVAL**: "APPROVE: EXECUTE"
2. Execute file moves as outlined above
3. Create `docs/README.md` with navigation index
4. Commit changes as single atomic commit
5. Await separate approval for temp file deletion phase