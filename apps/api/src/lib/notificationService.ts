import { storage } from "./storage";
import type { Notification, MatchRequest } from "@airbar/shared/schema";

export class NotificationService {
  /**
   * Create a notification for a user
   */
  async createNotification(params: {
    userId: number;
    title: string;
    message: string;
    type?: "info" | "warning" | "success" | "error";
  }): Promise<Notification> {
    return await storage.createNotification({
      userId: params.userId,
      title: params.title,
      message: params.message,
      type: params.type || "info",
      isRead: false,
    });
  }

  /**
   * Notify user about a new match request
   */
  async notifyMatchRequest(matchRequest: MatchRequest): Promise<Notification> {
    const senderUser = await storage.getUser(matchRequest.senderId);
    const travelerUser = await storage.getUser(matchRequest.travelerId);

    return await this.createNotification({
      userId: matchRequest.travelerId,
      title: "New Match Request",
      message: `${senderUser?.firstName || "A user"} wants you to carry their package for $${matchRequest.reward}`,
      type: "info",
    });
  }

  /**
   * Notify user when their match request is accepted
   */
  async notifyMatchAccepted(matchRequest: MatchRequest): Promise<Notification> {
    const travelerUser = await storage.getUser(matchRequest.travelerId);

    return await this.createNotification({
      userId: matchRequest.senderId,
      title: "Match Request Accepted!",
      message: `${travelerUser?.firstName || "The traveler"} has accepted your match request. Please proceed with payment.`,
      type: "success",
    });
  }

  /**
   * Notify user when their match request is declined
   */
  async notifyMatchDeclined(matchRequest: MatchRequest): Promise<Notification> {
    const travelerUser = await storage.getUser(matchRequest.travelerId);

    return await this.createNotification({
      userId: matchRequest.senderId,
      title: "Match Request Declined",
      message: `${travelerUser?.firstName || "The traveler"} has declined your match request. You can try other travelers.`,
      type: "warning",
    });
  }

  /**
   * Notify user about payment confirmation
   */
  async notifyPaymentConfirmed(
    matchRequest: MatchRequest
  ): Promise<Notification[]> {
    const notifications: Notification[] = [];

    // Notify traveler
    const travelerNotification = await this.createNotification({
      userId: matchRequest.travelerId,
      title: "Payment Received",
      message: `Payment of $${matchRequest.reward} has been secured in escrow. You can now pick up the package.`,
      type: "success",
    });

    // Notify sender
    const senderNotification = await this.createNotification({
      userId: matchRequest.senderId,
      title: "Payment Confirmed",
      message: `Your payment of $${matchRequest.reward} is secured. The traveler will contact you for pickup.`,
      type: "success",
    });

    notifications.push(travelerNotification, senderNotification);
    return notifications;
  }

  /**
   * Notify users about package pickup
   */
  async notifyPackagePickup(
    matchRequest: MatchRequest
  ): Promise<Notification[]> {
    const notifications: Notification[] = [];
    const senderUser = await storage.getUser(matchRequest.senderId);

    // Notify sender
    const senderNotification = await this.createNotification({
      userId: matchRequest.senderId,
      title: "Package Picked Up",
      message:
        "Your package has been picked up by the traveler and is now in transit.",
      type: "info",
    });

    // Notify traveler
    const travelerNotification = await this.createNotification({
      userId: matchRequest.travelerId,
      title: "Package Pickup Confirmed",
      message: `You have successfully picked up ${senderUser?.firstName || "the sender"}'s package. Safe travels!`,
      type: "success",
    });

    notifications.push(senderNotification, travelerNotification);
    return notifications;
  }

  /**
   * Notify users about package delivery
   */
  async notifyPackageDelivery(
    matchRequest: MatchRequest
  ): Promise<Notification[]> {
    const notifications: Notification[] = [];

    // Notify sender
    const senderNotification = await this.createNotification({
      userId: matchRequest.senderId,
      title: "Package Delivered!",
      message: `Your package has been successfully delivered! Payment of $${matchRequest.reward} has been released to the traveler.`,
      type: "success",
    });

    // Notify traveler
    const travelerNotification = await this.createNotification({
      userId: matchRequest.travelerId,
      title: "Delivery Complete",
      message: `Package delivered successfully! You have earned $${matchRequest.reward}.`,
      type: "success",
    });

    notifications.push(senderNotification, travelerNotification);
    return notifications;
  }

  /**
   * Get user notifications with pagination
   */
  async getUserNotifications(
    userId: number,
    options: {
      page: number;
      limit: number;
      unreadOnly?: boolean;
    }
  ) {
    return await storage.getUserNotificationsPaginated(userId, options);
  }

  /**
   * Mark notification as read
   */
  async markAsRead(
    notificationId: number,
    isRead: boolean = true
  ): Promise<Notification | undefined> {
    return await storage.markNotificationAsRead(notificationId, isRead);
  }

  /**
   * Get unread notification count for user
   */
  async getUnreadCount(userId: number): Promise<number> {
    return await storage.getUnreadNotificationCount(userId);
  }
}

export const notificationService = new NotificationService();
