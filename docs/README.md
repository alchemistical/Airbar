# Airbar Documentation

*Central navigation hub for all Airbar platform documentation*

---

## 📚 Documentation Overview

This documentation covers the **Airbar crowdshipping platform** - a peer-to-peer delivery network connecting travelers with senders for secure, efficient package delivery worldwide.

**Platform Status**: Active development (Monorepo architecture, Prisma + PostgreSQL, React + Express)

---

## 🗂️ Documentation Structure

### 🔧 Technical Documentation
> Developer-focused resources for setup, architecture, and API integration

| Category | Description | Key Documents |
|----------|-------------|--------------|
| **[API](./technical/api/)** | REST API documentation | [Endpoints](./technical/api/endpoints.md) • [Authentication](./technical/api/authentication.md) |
| **[Architecture](./technical/architecture/)** | System design & database | [Overview](./technical/architecture/overview.md) • [Database Schema](./technical/architecture/database-schema.md) |
| **[Development](./technical/development/)** | Setup & contribution guides | [Setup](./technical/development/setup.md) • [Contributing](./technical/development/contributing.md) |
| **[Runbooks](./technical/runbooks/)** | Operations & deployment | [Deployment](./technical/runbooks/deployment.md) • [Monitoring](./technical/runbooks/monitoring.md) |

### 📊 Product Documentation  
> Business requirements, planning, and product strategy

| Category | Description | Key Documents |
|----------|-------------|--------------|
| **[Requirements](./product/requirements/)** | Product specifications | [PRD](./product/requirements/prd.md) • [Executive Summary](./product/requirements/executive-summary.md) |
| **[Planning](./product/planning/)** | Development roadmap | [MVP Plan](./product/planning/mvp-plan.md) • [Feature Matrix](./product/planning/feature-matrix.md) |
| **[Assessments](./product/assessments/)** | Analysis & evaluations | [Gap Analysis](./product/assessments/gap-analysis.md) • [Technical Assessment](./product/assessments/technical-assessment.md) |
| **[Design](./product/design/)** | UX/UI specifications | [Sitemap](./product/design/sitemap.md) |

### ⚖️ Legal Documentation
> Legal compliance and policies

| Category | Description | Status |
|----------|-------------|---------|
| **[Legal](./legal/)** | Terms, privacy policies | 🚧 *Requires legal review* |

---

## 🚀 Quick Start

### For Developers
1. **Setup**: [Development Setup Guide](./technical/development/setup.md)
2. **Architecture**: [System Overview](./technical/architecture/overview.md)  
3. **API**: [Authentication](./technical/api/authentication.md) → [Endpoints](./technical/api/endpoints.md)
4. **Database**: [Schema Reference](./technical/architecture/database-schema.md)

### For Product Teams
1. **Vision**: [Product Requirements](./product/requirements/prd.md)
2. **Planning**: [MVP Development Plan](./product/planning/mvp-plan.md)
3. **Progress**: [Feature Matrix](./product/planning/feature-matrix.md)
4. **Design**: [Application Sitemap](./product/design/sitemap.md)

### For Operations
1. **Deployment**: [Production Setup](./technical/runbooks/deployment.md)
2. **Monitoring**: [System Health](./technical/runbooks/monitoring.md)

---

## 🎯 Platform Overview

### Business Model
**Peer-to-peer crowdshipping** connecting international travelers with package senders through:
- **Escrow-secured transactions** with Stripe integration
- **KYC-verified user base** for trust and safety  
- **Real-time tracking** and communication systems
- **Dispute resolution** with 48-hour SLA

### Technical Architecture
- **Frontend**: React 18.3 + TypeScript + Tailwind CSS
- **Backend**: Express.js + TypeScript + JWT authentication
- **Database**: PostgreSQL 15 + Prisma ORM (15 entities)
- **Infrastructure**: Docker + PNPM monorepo + GitHub Actions CI/CD
- **Payments**: Stripe integration with escrow system

### Key Features
- Multi-role dashboard (Traveler/Sender)
- Trip and package management systems
- Advanced matching algorithm
- Secure payment processing
- Real-time notifications
- Comprehensive dispute resolution

---

## 📋 Documentation Standards

### Maintenance
- **Review Cycle**: Monthly accuracy review
- **Update Process**: Code changes trigger doc updates
- **Approval**: Technical changes require developer review

### Contribution Guidelines
1. Follow existing structure and naming conventions
2. Include accurate code references with `file_path:line_number`
3. Test all setup instructions before publishing
4. Keep business and technical docs synchronized

### Support
- **Questions**: Use GitHub issues for documentation feedback
- **Updates**: Submit pull requests with rationale
- **Urgent**: Contact development team directly

---

## ⚠️ Important Notes

### Current Development Status
- **Architecture**: ✅ Modern monorepo structure implemented
- **Database**: ✅ Comprehensive Prisma schema (15 entities)
- **Frontend**: ✅ React components with UI library
- **Backend**: ⚠️ API routes require business logic implementation
- **Deployment**: ✅ Docker containerization complete

### Documentation Accuracy
This documentation was restructured **January 24, 2025** to align with actual implementation. Previous architectural mismatches have been corrected.

---

*For technical support or documentation questions, see [Contributing Guidelines](./technical/development/contributing.md) or contact the development team.*