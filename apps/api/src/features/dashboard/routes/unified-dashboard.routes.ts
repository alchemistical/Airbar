import { Router } from 'express';
import { authenticateToken } from '../../auth/middleware/auth';
import { UnifiedDashboardController } from '../controllers/unified-dashboard.controller';

const router = Router();

// All routes require authentication
router.use(authenticateToken);

// Dashboard routes
router.get('/unified', UnifiedDashboardController.getUnifiedDashboard);
router.post('/context', UnifiedDashboardController.setUserContext);
router.get('/activity-stream', UnifiedDashboardController.getActivityStream);
router.get('/quick-actions', UnifiedDashboardController.getQuickActions);

export default router;