import { Router } from 'express';
import { dashboardController } from '../controllers/dashboard.controller';

const router = Router();

/**
 * @swagger
 * /api/dashboard/metrics/{userId}:
 *   get:
 *     tags: [Dashboard]
 *     summary: Get dashboard metrics for a user
 *     description: Returns comprehensive dashboard metrics including trips, earnings, and activity stats
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: integer
 *         description: The user ID to fetch metrics for
 *     responses:
 *       200:
 *         description: Dashboard metrics retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/DashboardMetrics'
 *                 correlationId:
 *                   type: string
 *       400:
 *         description: Invalid user ID
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get('/metrics/:userId', dashboardController.getMetrics);

/**
 * @swagger
 * /api/dashboard/data/{userId}:
 *   get:
 *     tags: [Dashboard]
 *     summary: Get complete dashboard data for a user
 *     description: Returns comprehensive dashboard data including metrics, recent activity, and upcoming trips
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: integer
 *         description: The user ID to fetch dashboard data for
 */
router.get('/data/:userId', dashboardController.getDashboardData);

export default router;