import { Request, Response } from 'express';
import { UnifiedDashboardService } from '../services/unified-dashboard.service';
import { prisma } from '../../../lib/prisma';

const dashboardService = new UnifiedDashboardService(prisma);

export class UnifiedDashboardController {
  /**
   * @swagger
   * /api/dashboard/unified:
   *   get:
   *     summary: Get unified dashboard data
   *     tags: [Dashboard]
   *     security:
   *       - bearerAuth: []
   *     responses:
   *       200:
   *         description: Unified dashboard data
   */
  static async getUnifiedDashboard(req: Request, res: Response) {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({
          success: false,
          error: { code: 'UNAUTHORIZED', message: 'User not authenticated' }
        });
      }

      const dashboardData = await dashboardService.getDashboardData(userId);
      
      res.json({
        success: true,
        data: dashboardData
      });
    } catch (error) {
      console.error('Dashboard error:', error);
      res.status(500).json({
        success: false,
        error: {
          code: 'DASHBOARD_ERROR',
          message: 'Failed to load dashboard data'
        }
      });
    }
  }

  static async setUserContext(req: Request, res: Response) {
    try {
      const userId = req.user?.id;
      const { preferredMode } = req.body;
      
      if (!userId) {
        return res.status(401).json({
          success: false,
          error: { code: 'UNAUTHORIZED', message: 'User not authenticated' }
        });
      }
      
      await dashboardService.updateUserPreferences(userId, { preferredMode });
      
      res.json({ success: true });
    } catch (error) {
      console.error('Context update error:', error);
      res.status(500).json({
        success: false,
        error: { code: 'CONTEXT_UPDATE_ERROR', message: 'Failed to update user context' }
      });
    }
  }

  static async getActivityStream(req: Request, res: Response) {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({
          success: false,
          error: { code: 'UNAUTHORIZED', message: 'User not authenticated' }
        });
      }

      const activityEvents = await prisma.activityEvent.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' },
        take: 20
      });
      
      res.json({
        success: true,
        data: activityEvents
      });
    } catch (error) {
      console.error('Activity stream error:', error);
      res.status(500).json({
        success: false,
        error: {
          code: 'ACTIVITY_STREAM_ERROR',
          message: 'Failed to load activity stream'
        }
      });
    }
  }

  static async getQuickActions(req: Request, res: Response) {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({
          success: false,
          error: { code: 'UNAUTHORIZED', message: 'User not authenticated' }
        });
      }

      // For now, return basic quick actions
      const quickActions = [
        { type: 'SEND_PACKAGE', label: '📦 Send Package', url: '/send-package' },
        { type: 'ADD_TRIP', label: '✈️ Add Trip', url: '/add-trip' },
        { type: 'VIEW_EARNINGS', label: '💰 Earnings', url: '/wallet' },
        { type: 'NOTIFICATIONS', label: '🔔 Alerts', url: '/notifications' }
      ];
      
      res.json({
        success: true,
        data: quickActions
      });
    } catch (error) {
      console.error('Quick actions error:', error);
      res.status(500).json({
        success: false,
        error: {
          code: 'QUICK_ACTIONS_ERROR',
          message: 'Failed to load quick actions'
        }
      });
    }
  }
}