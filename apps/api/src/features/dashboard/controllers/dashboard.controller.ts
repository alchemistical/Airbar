import { Request, Response } from 'express';
import { dashboardService } from '../services/dashboard.service';

export class DashboardController {
  async getDashboardData(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.params.userId;
      
      if (!userId || typeof userId !== 'string') {
        res.status(400).json({
          success: false,
          error: {
            code: 'INVALID_USER_ID',
            message: 'User ID must be a valid string',
            correlationId: req.correlationId
          }
        });
        return;
      }

      const dashboardData = await dashboardService.getDashboardData(userId);
      
      res.json({
        success: true,
        data: dashboardData,
        correlationId: req.correlationId
      });
    } catch (error) {
      console.error('Dashboard data error:', error);
      
      res.status(500).json({
        success: false,
        error: {
          code: 'DASHBOARD_DATA_ERROR',
          message: error instanceof Error ? error.message : 'Failed to fetch dashboard data',
          correlationId: req.correlationId
        }
      });
    }
  }

  async getMetrics(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.params.userId;
      
      if (!userId || typeof userId !== 'string') {
        res.status(400).json({
          success: false,
          error: {
            code: 'INVALID_USER_ID',
            message: 'User ID must be a valid string',
            correlationId: req.correlationId
          }
        });
        return;
      }

      const metrics = await dashboardService.getMetrics(userId);
      
      res.json({
        success: true,
        data: metrics,
        correlationId: req.correlationId
      });
    } catch (error) {
      console.error('Dashboard metrics error:', error);
      
      res.status(500).json({
        success: false,
        error: {
          code: 'DASHBOARD_METRICS_ERROR',
          message: error instanceof Error ? error.message : 'Failed to fetch dashboard metrics',
          correlationId: req.correlationId
        }
      });
    }
  }
}

export const dashboardController = new DashboardController();